import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Remove a browser's push subscription. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}) as any);
  const endpoint = body?.endpoint;
  if (!endpoint) {
    return NextResponse.json({ error: 'Lipsește endpoint' }, { status: 400 });
  }
  await prisma.pushSubscription.deleteMany({ where: { endpoint } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
