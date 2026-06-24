import { timingSafeEqual } from 'crypto';

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
