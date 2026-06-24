import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { findCampaign } from '@/lib/campaigns';
import { clientIp, rateLimitMulti } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * POST /api/checkout — create a Stripe Checkout Session.
 * Body: { amount, recurring?, campaign?, donorName?, donorEmail, donorPhone?, isPublic? }
 *
 * Anti-abuse:
 *   - Origin/Referer check (no naive cross-site script).
 *   - IP rate-limit (burst + sustained) BEFORE creating Stripe sessions
 *     — Stripe charges per API call and flags accounts with abusive traffic.
 *   - Strict input validation (integer-bani amount, sanitized name/phone).
 *   - Campaign slug must exist in lib/campaigns.
 */

const ALLOWED_HOST_HINTS = [
  'parohiasfteodoradelasihla.ro',
  '.up.railway.app',
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

const CONTROL_CHARS = /[ --‎‏‪-‮⁦-⁩]/g;

function sanitizeShortText(s: string, max: number): string {
  return s
    .replace(CONTROL_CHARS, '')
    .replace(/<[^>]*>/g, '')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

const EMAIL_RE = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i;

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Plata cu cardul este temporar indisponibilă. Vă rugăm folosiți transferul bancar.' },
      { status: 503 },
    );
  }

  if (!originAllowed(req)) {
    return NextResponse.json({ error: 'Cerere respinsă.' }, { status: 403 });
  }

  const ip = clientIp(req);
  const ipLimit = rateLimitMulti(`checkout:ip:${ip}`, [
    { label: 'burst', max: 3, windowMs: 60_000 },
    { label: 'hour', max: 20, windowMs: 60 * 60_000 },
  ]);
  if (!ipLimit.ok) {
    return NextResponse.json(
      { error: 'Prea multe încercări de plată. Vă rugăm reveniți peste câteva minute.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(ipLimit.retryAfterMs / 1000)) } },
    );
  }

  try {
    const body = await req.json().catch(() => ({} as any));
    const amountNum = Number(body.amount);
    const recurring = !!body.recurring;
    const campaign = sanitizeShortText(String(body.campaign || ''), 80) ||
      'zidirea-bisericii';

    if (!findCampaign(campaign)) {
      return NextResponse.json({ error: 'Campanie inexistentă.' }, { status: 400 });
    }

    if (!Number.isFinite(amountNum) || amountNum < 5 || amountNum > 100_000) {
      return NextResponse.json(
        { error: 'Suma trebuie să fie între 5 și 100.000 RON.' },
        { status: 400 },
      );
    }
    const amount = Math.round(amountNum); // integer RON; consistent with bank-pledge

    const donorEmail = String(body.donorEmail || '').trim().toLowerCase();
    if (!EMAIL_RE.test(donorEmail) || donorEmail.length > 120) {
      return NextResponse.json(
        { error: 'Email invalid. Avem nevoie de un email valid pentru confirmare.' },
        { status: 400 },
      );
    }

    const donorName = sanitizeShortText(String(body.donorName || ''), 80);
    const donorPhoneRaw = String(body.donorPhone || '').trim();
    const donorPhone = donorPhoneRaw
      ? donorPhoneRaw.replace(/[^\d+\-\s()]/g, '').slice(0, 20)
      : '';
    const isPublic = body.isPublic !== false;

    const camp = findCampaign(campaign);
    const productName = camp ? `Donație — ${camp.shortTitle}` : 'Donație parohie';

    const origin = req.headers.get('origin') || req.nextUrl.origin;
    // success/cancel routes back to the originating campaign page so the
    // donor doesn't lose context if they cancel.
    const campaignUrl = `${origin}/donations/${camp?.slug ?? campaign}`;

    const session = await stripe.checkout.sessions.create({
      mode: recurring ? 'subscription' : 'payment',
      payment_method_types: recurring ? ['card', 'sepa_debit'] : ['card'],
      line_items: [
        {
          price_data: {
            currency: 'ron',
            unit_amount: amount * 100,
            recurring: recurring ? { interval: 'month' } : undefined,
            product_data: {
              name: productName,
              description: 'Parohia Sf. Cuvioasă Teodora de la Sihla, Botoșani',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/doneaza/multumim?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: campaignUrl,
      customer_email: donorEmail,
      metadata: {
        campaign,
        recurring: String(recurring),
        donorName,
        donorPhone,
        isPublic: isPublic ? '1' : '0',
      },
      ...(recurring
        ? {
            subscription_data: {
              metadata: {
                campaign,
                donorName,
                donorPhone,
                isPublic: isPublic ? '1' : '0',
              },
            },
          }
        : {}),
      locale: 'ro',
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('[checkout] failed:', err);
    return NextResponse.json(
      { error: 'A apărut o eroare la inițierea plății. Vă rugăm încercați din nou.' },
      { status: 500 },
    );
  }
}
