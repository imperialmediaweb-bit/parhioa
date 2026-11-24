import { NextRequest, NextResponse } from 'next/server';
import { isAdminKeyValid, adminCookieToken, ADMIN_COOKIE } from '@/lib/admin-auth';
import { rateLimitMulti } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * Admin login: exchange the secret code for a short session cookie, so the key
 * no longer needs to live in the URL. Rate-limited to blunt brute force.
 */
export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const limit = rateLimitMulti(`admin-login:${ip}`, [
    { label: 'burst', max: 5, windowMs: 60_000 },
    { label: 'hour', max: 20, windowMs: 60 * 60_000 },
  ]);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Prea multe încercări. Reveniți peste câteva minute.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) } },
    );
  }

  const body = await req.json().catch(() => ({}) as any);
  const code = String(body.code || '');
  const token = adminCookieToken();

  if (!token || !isAdminKeyValid(code)) {
    return NextResponse.json({ error: 'Cod greșit.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    // Session cookie — expires when the browser closes, so the code is
    // re-entered each session (more secure than a key sitting in the URL).
  });
  return res;
}
