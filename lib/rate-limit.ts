/**
 * Tiny in-memory sliding-window rate limiter. Suitable for a single
 * Railway instance — donations, pledges, contact form. Cleans itself
 * up so it doesn't leak unbounded memory.
 *
 * For multi-instance hosting, swap with Upstash/Redis. Until then this
 * is fine and adds zero infra dependencies.
 */

interface Hit {
  /** Timestamps (ms) of recent hits, ascending. */
  ts: number[];
}

const STORE = new Map<string, Hit>();
const MAX_KEYS = 50_000; // hard cap so we never OOM

function nowMs(): number {
  return Date.now();
}

/**
 * Returns { ok, retryAfterMs } telling the caller whether the action
 * may proceed. Sliding window: keeps only timestamps within `windowMs`,
 * allows up to `max` hits in that window.
 */
export function rateLimit(
  key: string,
  max: number,
  windowMs: number,
): { ok: boolean; retryAfterMs: number } {
  const now = nowMs();
  const horizon = now - windowMs;

  // Soft cap — when full, evict the oldest entries opportunistically.
  if (STORE.size > MAX_KEYS) {
    const evictAt = Math.floor(STORE.size * 0.1);
    let i = 0;
    for (const k of STORE.keys()) {
      STORE.delete(k);
      if (++i >= evictAt) break;
    }
  }

  const entry = STORE.get(key) ?? { ts: [] };
  // Drop timestamps outside the window.
  while (entry.ts.length && entry.ts[0] < horizon) entry.ts.shift();

  if (entry.ts.length >= max) {
    const retryAfterMs = entry.ts[0] + windowMs - now;
    STORE.set(key, entry);
    return { ok: false, retryAfterMs: Math.max(0, retryAfterMs) };
  }

  entry.ts.push(now);
  STORE.set(key, entry);
  return { ok: true, retryAfterMs: 0 };
}

/**
 * Convenience: check multiple windows at once (e.g. burst + sustained).
 * Returns the first failing window, if any.
 */
export function rateLimitMulti(
  baseKey: string,
  windows: { max: number; windowMs: number; label?: string }[],
): { ok: boolean; retryAfterMs: number; label?: string } {
  for (const w of windows) {
    const key = w.label ? `${baseKey}:${w.label}` : `${baseKey}:${w.windowMs}`;
    const r = rateLimit(key, w.max, w.windowMs);
    if (!r.ok) return { ok: false, retryAfterMs: r.retryAfterMs, label: w.label };
  }
  return { ok: true, retryAfterMs: 0 };
}

/** Extract a reasonable client IP from headers Railway/Vercel set. */
export function clientIp(req: { headers: Headers }): string {
  const h = req.headers;
  const xff = h.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return (
    h.get('x-real-ip') ||
    h.get('cf-connecting-ip') ||
    h.get('fly-client-ip') ||
    'unknown'
  );
}
