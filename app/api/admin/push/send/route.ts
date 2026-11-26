import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { sanitizeText } from '@/lib/sanitize';
import { sendPushToAll, isPushConfigured } from '@/lib/push';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Send a push announcement to all subscribers. Admin only. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}) as any);
  if (!isAdminAuthorized(body.key)) {
    return NextResponse.json({ error: 'Acces refuzat' }, { status: 403 });
  }
  if (!isPushConfigured()) {
    return NextResponse.json(
      { error: 'Notificările nu sunt configurate (lipsesc cheile VAPID).' },
      { status: 503 },
    );
  }

  const title = sanitizeText(String(body.title || '')).slice(0, 120);
  const bodyText = sanitizeText(String(body.body || '')).slice(0, 300);
  let url = String(body.url || '/').slice(0, 300);
  if (!/^\/[^\s]*$/.test(url) && !/^https:\/\//.test(url)) url = '/';

  if (!title || !bodyText) {
    return NextResponse.json({ error: 'Scrie titlul și textul.' }, { status: 400 });
  }

  const result = await sendPushToAll({ title, body: bodyText, url });
  return NextResponse.json({ ok: true, ...result });
}
