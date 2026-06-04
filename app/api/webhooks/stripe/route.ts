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

  const email = session.customer_details?.email || session.customer_email || null;
  const fallbackName = session.customer_details?.name || null;

  const amountTotal = session.amount_total ?? 0;
  const amountRon = Math.round(amountTotal / 100);
  const currency = (session.currency || 'ron').toLowerCase();

  let donorId: number | null = null;
  if (email) {
    const donor = await prisma.donor.upsert({
      where: { email },
      update: {
        name: donorName || fallbackName || undefined,
        isPublic,
      },
      create: {
        email,
        name: donorName || fallbackName || null,
        isPublic,
      },
    });
    donorId = donor.id;
  } else if (donorName || fallbackName) {
    const donor = await prisma.donor.create({
      data: {
        name: donorName || fallbackName,
        isPublic,
      },
    });
    donorId = donor.id;
  }

  await prisma.donation.create({
    data: {
      stripeSessionId: sessionId,
      amount: amountRon,
      currency,
      campaign,
      recurring,
      status: 'completed',
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
