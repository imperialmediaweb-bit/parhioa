import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendContactToParish } from '@/lib/email';
import { clientIp, rateLimitMulti } from '@/lib/rate-limit';
import { sanitizeText } from '@/lib/sanitize';

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
  const rl = rateLimitMulti(`contact:ip:${ip}`, [
    { label: 'burst', max: 2, windowMs: 60_000 },
    { label: 'hour', max: 10, windowMs: 60 * 60_000 },
  ]);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Prea multe mesaje trimise. Vă rugăm reveniți peste câteva minute.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) },
      },
    );
  }

  const body = await req.json().catch(() => ({} as any));

  // Honeypot — bots fill anything labelled like an extra field. The form
  // includes a hidden <input name="website"> that real users never see/touch.
  if (body.website && String(body.website).trim() !== '') {
    // Pretend success so the bot doesn't retry, but write nothing.
    return NextResponse.json({ ok: true });
  }

  const name = sanitizeText(String(body.name || '')).slice(0, 120);
  const email = String(body.email || '').trim().toLowerCase();
  const phoneRaw = String(body.phone || '').trim();
  const phone = phoneRaw
    ? phoneRaw.replace(/[^\d+\-\s()]/g, '').slice(0, 30) || null
    : null;
  const subject = sanitizeText(String(body.subject || '')).slice(0, 200) || null;
  const message = sanitizeText(String(body.message || '')).slice(0, 5000);

  if (!name) {
    return NextResponse.json(
      { error: 'Vă rugăm să completați numele.' },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email) || email.length > 120) {
    return NextResponse.json(
      { error: 'Email invalid. Vă rugăm verificați adresa.' },
      { status: 400 },
    );
  }
  if (message.length < 5) {
    return NextResponse.json(
      { error: 'Mesajul este prea scurt.' },
      { status: 400 },
    );
  }

  // Persist for audit / admin review.
  try {
    await prisma.contactMessage.create({
      data: { name, email, phone, subject, message, ip },
    });
  } catch (err) {
    console.error('[contact] DB write failed:', err);
    // Continue — we still try to forward by email so the message isn't lost.
  }

  try {
    await sendContactToParish({ name, email, phone, subject, message });
  } catch (err) {
    // The DB row above means we won't lose the message even if email is down.
    console.error('[contact] email forward failed (saved to DB):', err);
  }

  return NextResponse.json({ ok: true });
}
