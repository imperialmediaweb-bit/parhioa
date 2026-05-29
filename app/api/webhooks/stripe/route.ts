import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendThankYouEmail } from '@/lib/email';
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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await recordDonation(session);
    } catch (err) {
      console.error('[stripe webhook] recordDonation failed:', err);
      return NextResponse.json({ error: 'processing failed' }, { status: 500 });
    }
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
