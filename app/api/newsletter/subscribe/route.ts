import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletterWelcome } from '@/lib/email';
import { clientIp, rateLimitMulti } from '@/lib/rate-limit';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

const EMAIL_RE = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i;

export async function POST(req: NextRequest) {
  if (!originAllowed(req)) {
    return NextResponse.json({ error: 'Cerere respinsă.' }, { status: 403 });
  }

  const ip = clientIp(req);
  const rl = rateLimitMulti(`newsletter:ip:${ip}`, [
    { label: 'burst', max: 2, windowMs: 60_000 },
    { label: 'hour', max: 10, windowMs: 60 * 60_000 },
  ]);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Prea multe încercări. Reveniți peste câteva minute.' },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({} as any));
  if (body.website && String(body.website).trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const email = String(body.email || '').trim().toLowerCase();
  const name = body.name ? String(body.name).trim().slice(0, 80) : null;

  if (!EMAIL_RE.test(email) || email.length > 120) {
    return NextResponse.json(
      { error: 'Email invalid. Vă rugăm verificați adresa.' },
      { status: 400 },
    );
  }

  // Upsert — already-subscribed emails are silently OK (no enumeration leak).
  let subscriberId: number | null = null;
  let isNew = false;
  try {
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      // If they were unsubscribed previously, re-activate them.
      if (existing.unsubscribedAt) {
        await prisma.subscriber.update({
          where: { id: existing.id },
          data: { unsubscribedAt: null, name: name ?? existing.name },
        });
        isNew = true;
      }
      subscriberId = existing.id;
    } else {
      const created = await prisma.subscriber.create({
        data: { email, name, source: 'newsletter' },
      });
      subscriberId = created.id;
      isNew = true;
    }
  } catch (err) {
    console.error('[newsletter] DB write failed:', err);
    return NextResponse.json(
      { error: 'Nu am putut salva abonarea. Vă rugăm încercați din nou.' },
      { status: 500 },
    );
  }

  if (isNew && subscriberId) {
    const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?id=${subscriberId}`;
    // Fire and forget; don't fail the response if the email is slow.
    sendNewsletterWelcome({ to: email, unsubscribeUrl }).catch((err) =>
      console.error('[newsletter] welcome email failed', err),
    );
  }

  return NextResponse.json({ ok: true });
}
