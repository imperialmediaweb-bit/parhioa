import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthorized } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Mark an agenda item done / not done. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}) as any);
  if (!isAdminAuthorized(body.key)) {
    return NextResponse.json({ error: 'Acces refuzat' }, { status: 403 });
  }
  const id = Number(body.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'ID invalid' }, { status: 400 });
  }
  await prisma.agendaItem
    .update({ where: { id }, data: { done: body.done === true } })
    .catch(() => {});
  return NextResponse.json({ ok: true });
}
