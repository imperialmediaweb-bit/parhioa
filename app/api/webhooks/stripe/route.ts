import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendThankYouEmail, sendAdminPaymentFailedEmail } from '@/lib/email';
import { findCampaign } from '@/lib/campaigns';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET not set' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err: any) {
    console.error('[stripe webhook] signature verification failed:', err?.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await recordDonation(event.data.object as Stripe.Checkout.Session);
        break;

      case 'checkout.session.expired':
        await notifyIncomplete(event.data.object as Stripe.Checkout.Session, 'expired');
        break;

      case 'checkout.session.async_payment_failed':
        await notifyIncomplete(event.data.object as Stripe.Checkout.Session, 'failed');
        break;

      // Recurring subscription renewals. The FIRST month is already recorded
      // via checkout.session.completed; this catches months 2, 3, … which
      // would otherwise disappear silently.
      case 'invoice.paid':
      case 'invoice.payment_succeeded':
        await recordRenewal(event.data.object as Stripe.Invoice);
        break;

      // Failed subscription renewal — card expired, insufficient funds, etc.
      // The parish needs to know so they can reach out to the donor.
      case 'invoice.payment_failed':
        await notifyRenewalFailed(event.data.object as Stripe.Invoice);
        break;

      // Donor canceled their monthly pledge. We log it on the donor record
      // so the admin sees the lifetime history clearly.
      case 'customer.subscription.deleted':
        await logSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;

      case 'charge.refunded':
        await markRefunded(event.data.object as Stripe.Charge);
        break;
    }
  } catch (err) {
    console.error(`[stripe webhook] handler failed for ${event.type}:`, err);
    return NextResponse.json({ error: 'processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function recordDonation(session: Stripe.Checkout.Session) {
  const sessionId = session.id;
  const existing = await prisma.donation.findUnique({ where: { stripeSessionId: sessionId } });
  if (existing) return;

  const meta = session.metadata || {};
  const campaign = meta.campaign || 'zidirea-bisericii';
  const recurring = meta.recurring === 'true';
  const isPublic = meta.isPublic !== '0';
  const donorName = (meta.donorName || '').trim() || null;
  const donorPhone = (meta.donorPhone || '').trim() || null;

  const email = session.customer_details?.email || session.customer_email || null;
  const fallbackName = session.customer_details?.name || null;
  const fallbackPhone = session.customer_details?.phone || null;

  const amountTotal = session.amount_total ?? 0;
  const amountRon = Math.round(amountTotal / 100);
  const currency = (session.currency || 'ron').toLowerCase();

  const phone = donorPhone || fallbackPhone || null;

  const subscriptionId =
    typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id ?? null;

  let donorId: number | null = null;
  if (email) {
    const donor = await prisma.donor.upsert({
      where: { email },
      update: {
        name: donorName || fallbackName || undefined,
        phone: phone || undefined,
        isPublic,
      },
      create: {
        email,
        name: donorName || fallbackName || null,
        phone,
        isPublic,
      },
    });
    donorId = donor.id;
  } else if (donorName || fallbackName) {
    const donor = await prisma.donor.create({
      data: {
        name: donorName || fallbackName,
        phone,
        isPublic,
      },
    });
    donorId = donor.id;
  }

  await prisma.donation.create({
    data: {
      stripeSessionId: sessionId,
      stripeSubscriptionId: subscriptionId,
      amount: amountRon,
      currency,
      campaign,
      recurring,
      status: 'completed',
      isPublic,
      donorId,
    },
  });

  if (email) {
    const camp = findCampaign(campaign);
    await sendThankYouEmail({
      to: email,
      donorName: donorName || fallbackName || null,
      amount: amountRon,
      recurring,
      campaignTitle: camp?.title || 'Zidirea bisericii',
    });
  }
}

async function notifyIncomplete(
  session: Stripe.Checkout.Session,
  reason: 'expired' | 'failed',
) {
  const meta = session.metadata || {};
  const campaign = meta.campaign || 'zidirea-bisericii';
  const donorName =
    (meta.donorName || '').trim() || session.customer_details?.name || null;
  const donorEmail =
    session.customer_details?.email || session.customer_email || null;

  const amountTotal = session.amount_total ?? 0;
  const amountRon = amountTotal ? Math.round(amountTotal / 100) : null;

  // Persist the email even when the payment didn't complete — useful for
  // re-engagement and future campaigns. Honors the donor's public/anonymous
  // preference from the form.
  if (donorEmail) {
    const isPublic = meta.isPublic !== '0';
    await prisma.donor.upsert({
      where: { email: donorEmail },
      update: { name: donorName ?? undefined, isPublic },
      create: { email: donorEmail, name: donorName, isPublic },
    });
  }

  await sendAdminPaymentFailedEmail({
    donorEmail,
    donorName,
    amount: amountRon,
    campaign,
    reason,
  });
}

/**
 * Record a subscription renewal as its own Donation row.
 *
 * Stripe fires `invoice.paid` for BOTH the very first month of a subscription
 * (alongside `checkout.session.completed`) AND for every monthly renewal
 * after that. The first one is already covered by `recordDonation`, so we
 * filter on `billing_reason === 'subscription_cycle'` (renewals only).
 *
 * One-time donations don't have an invoice, so this code path never fires
 * for them.
 */
async function recordRenewal(invoice: Stripe.Invoice) {
  if (!stripe) return;

  // Only handle renewals — the initial subscription_create invoice is
  // already covered by checkout.session.completed (avoids double-counting).
  if (invoice.billing_reason !== 'subscription_cycle') return;

  const invoiceId = invoice.id;
  if (!invoiceId) return;

  // Dedup: stripeSessionId is unique, and we use the invoice id as the key.
  const existing = await prisma.donation.findUnique({
    where: { stripeSessionId: invoiceId },
  });
  if (existing) return;

  const subscriptionId =
    typeof invoice.subscription === 'string'
      ? invoice.subscription
      : invoice.subscription?.id ?? null;

  if (!subscriptionId) return;

  // Pull the subscription to access the metadata we set at checkout
  // (campaign, donorName, donorPhone, isPublic).
  const sub = await stripe.subscriptions.retrieve(subscriptionId).catch(() => null);
  const meta = sub?.metadata || {};
  const campaign = meta.campaign || 'zidirea-bisericii';
  const isPublic = meta.isPublic !== '0';
  const metaName = (meta.donorName || '').trim() || null;
  const metaPhone = (meta.donorPhone || '').trim() || null;

  const email =
    invoice.customer_email ||
    (typeof invoice.customer === 'object' && invoice.customer && !invoice.customer.deleted
      ? invoice.customer.email
      : null) ||
    null;

  const amountTotal = invoice.amount_paid ?? 0;
  const amountRon = Math.round(amountTotal / 100);
  const currency = (invoice.currency || 'ron').toLowerCase();

  let donorId: number | null = null;
  if (email) {
    const donor = await prisma.donor.upsert({
      where: { email },
      update: { name: metaName ?? undefined, phone: metaPhone ?? undefined },
      create: { email, name: metaName, phone: metaPhone, isPublic },
    });
    donorId = donor.id;
  }

  await prisma.donation.create({
    data: {
      stripeSessionId: invoiceId,
      stripeSubscriptionId: subscriptionId,
      amount: amountRon,
      currency,
      campaign,
      recurring: true,
      status: 'completed',
      isPublic,
      donorId,
    },
  });

  // Send a brief thank-you each month — keeps the relationship warm and
  // gives the donor an audit trail for their own records (Form 230, etc.).
  if (email) {
    const camp = findCampaign(campaign);
    await sendThankYouEmail({
      to: email,
      donorName: metaName,
      amount: amountRon,
      recurring: true,
      campaignTitle: camp?.title || 'Zidirea bisericii',
    });
  }
}

/**
 * Subscription renewal failed (expired card, insufficient funds, etc.).
 * Notify the parish so they can reach out before the donor goes silent.
 */
async function notifyRenewalFailed(invoice: Stripe.Invoice) {
  // Only fire for renewals — failed first-month invoices are already
  // covered by checkout.session.async_payment_failed.
  if (invoice.billing_reason !== 'subscription_cycle') return;

  const meta =
    (typeof invoice.subscription === 'object' && invoice.subscription?.metadata) ||
    {};
  const campaign = (meta as any).campaign || 'zidirea-bisericii';
  const donorName =
    ((meta as any).donorName || '').trim() ||
    (typeof invoice.customer === 'object' && invoice.customer && !invoice.customer.deleted
      ? invoice.customer.name
      : null) ||
    null;
  const donorEmail =
    invoice.customer_email ||
    (typeof invoice.customer === 'object' && invoice.customer && !invoice.customer.deleted
      ? invoice.customer.email
      : null) ||
    null;

  const amountTotal = invoice.amount_due ?? 0;
  const amountRon = amountTotal ? Math.round(amountTotal / 100) : null;

  await sendAdminPaymentFailedEmail({
    donorEmail,
    donorName,
    amount: amountRon,
    campaign,
    reason: 'failed',
  });
}

/**
 * Donor canceled (or Stripe terminated) their monthly pledge.
 * No money movement — we just log it so the admin sees the lifetime arc
 * of each ctitor pledge. Existing donation rows are kept (history).
 */
async function logSubscriptionCanceled(sub: Stripe.Subscription) {
  const meta = sub.metadata || {};
  console.log('[stripe webhook] subscription canceled', {
    subscriptionId: sub.id,
    campaign: meta.campaign,
    donorName: meta.donorName,
    canceledAt: sub.canceled_at
      ? new Date(sub.canceled_at * 1000).toISOString()
      : null,
  });
}

async function markRefunded(charge: Stripe.Charge) {
  if (!stripe) return;

  const paymentIntentId =
    typeof charge.payment_intent === 'string'
      ? charge.payment_intent
      : charge.payment_intent?.id;

  if (!paymentIntentId) return;

  // Find the Checkout Session this charge originated from.
  const sessions = await stripe.checkout.sessions.list({
    payment_intent: paymentIntentId,
    limit: 1,
  });
  const sessionId = sessions.data[0]?.id;
  if (!sessionId) return;

  await prisma.donation.updateMany({
    where: { stripeSessionId: sessionId },
    data: { status: 'refunded' },
  });
}
