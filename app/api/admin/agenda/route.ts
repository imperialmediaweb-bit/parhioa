import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { sanitizeText } from '@/lib/sanitize';
import { romaniaWallToUtc } from '@/lib/agenda';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Create an agenda item from structured fields. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}) as any);
  if (!isAdminAuthorized(body.key)) {
    return NextResponse.json({ error: 'Acces refuzat' }, { status: 403 });
  }

  const title = sanitizeText(String(body.title || '')).slice(0, 140);
  if (!title) {
    return NextResponse.json({ error: 'Lipsește titlul.' }, { status: 400 });
  }

  const dateStr = String(body.date || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json({ error: 'Alege o dată.' }, { status: 400 });
  }
  const [y, m1, d] = dateStr.split('-').map(Number);

  const timeStr = String(body.time || '');
  const hasTime = /^\d{2}:\d{2}$/.test(timeStr);
  const [h, min] = hasTime ? timeStr.split(':').map(Number) : [0, 0];
  const allDay = body.allDay === true || !hasTime;

  const startAt = romaniaWallToUtc(y, m1, d, allDay ? 9 : h, allDay ? 0 : min);

  const location = sanitizeText(String(body.location || '')).slice(0, 140) || null;
  const notes = sanitizeText(String(body.notes || '')).slice(0, 2000) || null;
  const rawText = sanitizeText(String(body.rawText || '')).slice(0, 2000) || null;

  const item = await prisma.agendaItem.create({
    data: { startAt, allDay, title, location, notes, rawText },
  });
  return NextResponse.json({ ok: true, id: item.id });
}
