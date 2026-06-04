import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const expected = process.env.ADMIN_KEY;
  const body = await req.json();

  if (expected && body.key !== expected) {
    return NextResponse.json({ error: 'Acces refuzat' }, { status: 403 });
  }

  const id = Number(body.id);
  if (!id) {
    return NextResponse.json({ error: 'ID lipsă' }, { status: 400 });
  }

  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
