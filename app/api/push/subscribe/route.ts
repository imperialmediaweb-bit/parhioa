import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Save a browser's push subscription (public endpoint — no admin auth). */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}) as any);
  const sub = body?.subscription;
  const endpoint = sub?.endpoint;
  const p256dh = sub?.keys?.p256dh;
  const auth = sub?.keys?.auth;

  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: 'Abonament invalid' }, { status: 400 });
  }

  const ua = (req.headers.get('user-agent') || '').slice(0, 180);

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { p256dh, auth, ua },
    create: { endpoint, p256dh, auth, ua },
  });

  return NextResponse.json({ ok: true });
}
