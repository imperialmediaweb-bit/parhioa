import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendThankYouEmail } from '@/lib/email';
import { findCampaign } from '@/lib/campaigns';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/donations/bank-pledge
 * Body: { amount, campaign, donorName?, donorEmail, isPublic }
 *
 * Recorded when a donor self-reports that they have made a bank transfer.
 * Stored as a Donation with status='self_reported_bank' so the parish can
 * reconcile against their bank statement.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body.amount);
    const campaignSlug = String(body.campaign || 'zidirea-bisericii');
    const donorName = String(body.donorName || '').trim().slice(0, 80) || null;
    const donorEmail = String(body.donorEmail || '').trim().toLowerCase();
    const donorPhone = String(body.donorPhone || '').trim().slice(0, 20) || null;
    const isPublic = body.isPublic !== false;

    if (!amount || amount < 5 || amount > 100000) {
      return NextResponse.json(
        { error: 'Suma trebuie să fie între 5 și 100.000 RON.' },
        { status: 400 },
      );
    }
    if (!donorEmail || !/.+@.+\..+/.test(donorEmail)) {
      return NextResponse.json(
        { error: 'Email invalid. Avem nevoie de o adresă validă pentru confirmare.' },
        { status: 400 },
      );
    }

    const donor = await prisma.donor.upsert({
      where: { email: donorEmail },
      update: {
        name: donorName ?? undefined,
        phone: donorPhone ?? undefined,
        isPublic,
      },
      create: {
        email: donorEmail,
        name: donorName,
        phone: donorPhone,
        isPublic,
      },
    });

    await prisma.donation.create({
      data: {
        stripeSessionId: `bank_${randomUUID()}`,
        amount: Math.round(amount),
        currency: 'ron',
        campaign: campaignSlug,
        recurring: false,
        status: 'self_reported_bank',
        donorId: donor.id,
      },
    });

    const camp = findCampaign(campaignSlug);
    await sendThankYouEmail({
      to: donorEmail,
      donorName,
      amount: Math.round(amount),
      recurring: false,
      campaignTitle: camp?.title || 'Zidirea bisericii',
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[bank-pledge] failed:', err);
    return NextResponse.json(
      { error: err?.message || 'A apărut o eroare. Încearcă din nou.' },
      { status: 500 },
    );
  }
}
