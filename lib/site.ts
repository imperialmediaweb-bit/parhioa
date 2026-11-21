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
  'https://pub-49f4280024fa4ca2b8a4f6323442efe8.r2.dev/sf_theodora_de_la_sihla_ri9rz2.png';

/**
 * Build per-page metadata with a unique description that also flows into
 * og:description and twitter:description, plus a canonical URL. Keeps every
 * page's SEO description distinct instead of inheriting the site default.
 */
export function pageMetadata(opts: {
  title?: string;
  description: string;
  path: string;
}): import('next').Metadata {
  const { title, description, path } = opts;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      ...(title
        ? { title: `${title} — Parohia Sf. Cuvioasă Teodora de la Sihla` }
        : {}),
      description,
      url: absoluteUrl(path),
    },
    twitter: { description },
  };
}
