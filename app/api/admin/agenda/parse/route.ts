import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { parseAgendaText } from '@/lib/agenda';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Extracts structured fields from dictated/typed text. Does NOT save. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}) as any);
  if (!isAdminAuthorized(body.key)) {
    return NextResponse.json({ error: 'Acces refuzat' }, { status: 403 });
  }
  const text = String(body.text || '').slice(0, 600);
  if (!text.trim()) {
    return NextResponse.json({ error: 'Scrie sau spune ceva mai întâi.' }, { status: 400 });
  }
  const parsed = await parseAgendaText(text);
  return NextResponse.json(parsed);
}
