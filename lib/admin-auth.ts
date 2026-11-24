import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

/** Name of the admin session cookie set after a correct code is entered. */
export const ADMIN_COOKIE = 'admin_ok';

/**
 * Centralized admin authentication. FAIL-CLOSED: if ADMIN_KEY is not set
 * in the environment, NO request is authorized — the admin surface is
 * locked until the operator configures a key. This prevents the whole
 * admin area (donor PII, blog write/delete, feed import) from being world
 * open on a misconfigured deploy.
 *
 * Comparison is timing-safe to avoid leaking the key length/prefix through
 * response-time analysis.
 */
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** True only when ADMIN_KEY is configured AND the provided value matches. */
export function isAdminKeyValid(provided: string | null | undefined): boolean {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return false; // fail closed
  if (!provided) return false;
  return safeEqual(provided, expected);
}

/**
 * Returns whether the admin surface is configured at all. Used by UI to
 * show a "not configured" notice ONLY on the locked screen (never alongside
 * sensitive data).
 */
export function isAdminConfigured(): boolean {
  return !!process.env.ADMIN_KEY;
}

/**
 * Opaque session token derived from ADMIN_KEY — stored in the admin cookie so
 * the raw key never travels in the URL or lives in the cookie. Deterministic,
 * so each request recomputes and compares it.
 */
export function adminCookieToken(): string | null {
  const key = process.env.ADMIN_KEY;
  if (!key) return null;
  return createHash('sha256').update(`${key}::parhioa::admin::v1`).digest('hex');
}

/** True when the request carries a valid admin session cookie. */
export function isAdminCookieAuthed(): boolean {
  const token = adminCookieToken();
  if (!token) return false;
  try {
    const val = cookies().get(ADMIN_COOKIE)?.value;
    return !!val && safeEqual(val, token);
  } catch {
    return false;
  }
}

/**
 * Master check used by admin pages and APIs: authorized if a valid session
 * cookie is present OR a valid ?key is provided (kept as a fallback so a direct
 * keyed link still works and never locks the operator out).
 */
export function isAdminAuthorized(providedKey?: string | null): boolean {
  return isAdminCookieAuthed() || isAdminKeyValid(providedKey);
}
