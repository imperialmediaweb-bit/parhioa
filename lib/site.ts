/**
 * Single source of truth for the site's public URL.
 *
 * Used by metadata (OG tags, canonical links), the sitemap, robots.txt and
 * transactional emails. Set NEXT_PUBLIC_SITE_URL in Railway → Variables once
 * the real domain is live; until then it falls back to the canonical domain.
 *
 * Always returned WITHOUT a trailing slash so callers can safely do
 * `${SITE_URL}/path`.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://parohiasfteodoradelasihla.ro'
).replace(/\/+$/, '');

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Default social-share image. The parish patron icon — always available. */
export const DEFAULT_OG_IMAGE =
  'https://res.cloudinary.com/dghmoelly/image/upload/v1780574528/sf_theodora_de_la_sihla_ri9rz2.png';
