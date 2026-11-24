import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendThankYouEmail } from '@/lib/email';
import { findCampaign } from '@/lib/campaigns';
import { clientIp, rateLimitMulti } from '@/lib/rate-limit';
import { sanitizeShortText } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/donations/bank-pledge
 * Body: { amount, campaign, donorName?, donorEmail, donorPhone?, isPublic? }
 *
 * Donor self-reports they made a bank transfer. We record it so the parish
 * can reconcile against their bank statement; until proper moderation is
 * built, anti-abuse keeps the public ctitori list and the rising-light
 * progress meter honest.
 *
 * Anti-abuse layers (each MUST pass):
 *   1. Origin/Referer must come from the parish domain (blocks naive
 *      cross-site scripts; not a real auth, just raises the floor).
 *   2. Rate-limit by IP — both a 1/min burst window and a 10/hour
 *      sustained window. Same for the email.
 *   3. Strict input validation: integer amount, length caps, control-char
 *      and URL stripping on name/phone, plausible email shape.
 *   4. Per-IP idempotency: same (email, amount) within 2 minutes returns
 *      the previous result without creating a second donation. Stops the
 *      "double-click submit" duplicate.
 */

const ALLOWED_HOST_HINTS = [
  'parohiasfteodoradelasihla.ro',
  '.up.railway.app', // dev/preview
  'localhost',
];

function originAllowed(req: NextRequest): boolean {
  const origin = req.headers.get('origin') || req.headers.get('referer') || '';
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname;
    return ALLOWED_HOST_HINTS.some((h) =>
      h.startsWith('.') ? host.endsWith(h) : host === h,
    );
  } catch {
    return false;
  }
}

const EMAIL_RE = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i;

export async function POST(req: NextRequest) {
  try {
    // 1. Origin / Referer check
    if (!originAllowed(req)) {
      return NextResponse.json(
        { error: 'Cerere respinsă (origine invalidă).' },
        { status: 403 },
      );
    }

    // 2. IP-based rate limit BEFORE parsing JSON so even malformed
    //    floods are counted.
    const ip = clientIp(req);
    const ipLimit = rateLimitMulti(`bank-pledge:ip:${ip}`, [
      { label: 'burst', max: 2, windowMs: 60_000 },
      { label: 'hour', max: 10, windowMs: 60 * 60_000 },
    ]);
    if (!ipLimit.ok) {
      return NextResponse.json(
        {
          error:
            'Prea multe încercări într-un timp scurt. Vă rugăm reveniți peste câteva minute.',
        },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(ipLimit.retryAfterMs / 1000)) } },
      );
    }

    const body = await req.json().catch(() => ({} as any));

    // 3. Input validation + sanitization
    const amountNum = Number(body.amount);
    if (!Number.isFinite(amountNum) || amountNum < 5 || amountNum > 100_000) {
      return NextResponse.json(
        { error: 'Suma trebuie să fie între 5 și 100.000 RON.' },
        { status: 400 },
      );
    }
    const amount = Math.round(amountNum);

    const campaignSlug = sanitizeShortText(String(body.campaign || ''), 80) ||
      'zidirea-bisericii';
    // Reject obviously made-up campaign slugs early.
    if (!findCampaign(campaignSlug)) {
      return NextResponse.json({ error: 'Campanie inexistentă.' }, { status: 400 });
    }

    const donorEmail = String(body.donorEmail || '').trim().toLowerCase();
    if (!EMAIL_RE.test(donorEmail) || donorEmail.length > 120) {
      return NextResponse.json(
        { error: 'Email invalid. Avem nevoie de o adresă validă pentru confirmare.' },
        { status: 400 },
      );
    }

    const donorName = sanitizeShortText(String(body.donorName || ''), 80) || null;
    const donorPhoneRaw = String(body.donorPhone || '').trim();
    // Allow only digits, spaces, + and dashes; cap at 20 chars.
    const donorPhone = donorPhoneRaw
      ? donorPhoneRaw.replace(/[^\d+\-\s()]/g, '').slice(0, 20) || null
      : null;
    const isPublic = body.isPublic !== false;
    const source =
      (sanitizeShortText(String(body.source || ''), 40) ||
        (req.cookies.get('_fbc')?.value ? 'facebook-ads' : '')).toLowerCase() || null;

    // 4. Per-email rate limit (stops attackers iterating different emails
    //    through the same IP, and spammers using one harvested email).
    const emailLimit = rateLimitMulti(`bank-pledge:email:${donorEmail}`, [
      { label: 'burst', max: 1, windowMs: 60_000 },
      { label: 'hour', max: 3, windowMs: 60 * 60_000 },
    ]);
    if (!emailLimit.ok) {
      return NextResponse.json(
        {
          error:
            'Am primit deja o donație recentă cu acest email. Dacă este o problemă, contactați-ne la contact@parohiasfteodoradelasihla.ro.',
        },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(emailLimit.retryAfterMs / 1000)) } },
      );
    }

    // 5. Idempotency: if the same email already has a `self_reported_bank`
    //    pledge for the same amount in the last 2 minutes, treat the
    //    second submission as a duplicate (no new row, no new email).
    const twoMinAgo = new Date(Date.now() - 2 * 60_000);
    const recent = await prisma.donation.findFirst({
      where: {
        status: 'self_reported_bank',
        amount,
        campaign: campaignSlug,
        createdAt: { gte: twoMinAgo },
        donor: { email: donorEmail },
      },
      select: { id: true },
    });
    if (recent) {
      return NextResponse.json({ ok: true, deduped: true });
    }

    const donor = await prisma.donor.upsert({
      where: { email: donorEmail },
      update: {
        // Only fill missing fields — don't retroactively rewrite a donor's
        // history if they previously gave with a different name/phone.
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
        amount,
        currency: 'ron',
        campaign: campaignSlug,
        source,
        recurring: false,
        status: 'self_reported_bank',
        isPublic,
        donorId: donor.id,
      },
    });

    const camp = findCampaign(campaignSlug);
    // Don't block the response on a flaky email send.
    sendThankYouEmail({
      to: donorEmail,
      donorName,
      amount,
      recurring: false,
      campaignTitle: camp?.title || 'Zidirea bisericii',
    }).catch((err) => console.error('[bank-pledge] thank-you send failed', err));

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[bank-pledge] failed:', err);
    return NextResponse.json(
      { error: 'A apărut o eroare. Vă rugăm să încercați din nou.' },
      { status: 500 },
    );
  }
}
