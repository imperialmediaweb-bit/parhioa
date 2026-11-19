/**
 * Image delivery base. Images were migrated off Cloudinary (quota kept
 * getting exhausted by traffic) onto Cloudflare R2, which has free egress.
 *
 * Set NEXT_PUBLIC_R2_URL in Railway to the bucket's public URL. Falls back to
 * the current r2.dev public domain.
 *
 * Later, a branded custom domain (e.g. media.parohiasfteodoradelasihla.ro)
 * can replace the r2.dev URL via the env var, with no code change.
 */
export const R2_BASE = (
  process.env.NEXT_PUBLIC_R2_URL ||
  'https://pub-49f4280024fa4ca2b8a4f6323442efe8.r2.dev'
).replace(/\/+$/, '');

const CLD_RE =
  /https?:\/\/res\.cloudinary\.com\/dghmoelly\/image\/upload\/([^"'\s)]+)/g;

// A path segment that is a Cloudinary transformation (f_auto, q_auto:best,
// c_crop,g_north,… ) or a version (v123456) — stripped when mapping to R2,
// which stores assets by their bare public_id + extension.
function isTransformOrVersion(seg: string): boolean {
  if (/^v\d+$/.test(seg)) return true; // version
  if (seg.includes(',')) return true; // chained transforms
  return /^(c|w|h|f|q|g|e|r|o|b|a|x|y|z|t|l|co|cs|bo|ar|dpr|fl|if|pg|vc|so|du|dn|dl|eo|fn|ac|br)_[a-z0-9:._-]+$/i.test(
    seg,
  );
}

/** The R2 object key for a Cloudinary public-id path (strips transforms/version). */
function cldPathToKey(rest: string): string {
  return rest
    .split('/')
    .filter((s) => !isTransformOrVersion(s))
    .join('/');
}

/**
 * Optimize/resize an R2 image through the free wsrv.nl image CDN — upscales
 * small WordPress-era thumbnails, sharpens and re-encodes to WebP. This
 * replaces the automatic quality/resize Cloudinary used to do (f_auto,q_auto,
 * w_), which R2 (plain storage) cannot. R2 stays the origin; wsrv.nl only
 * proxies, so swapping it out later is a one-line change.
 */
export function opt(r2url: string, width = 1600): string {
  if (!r2url || r2url.includes('wsrv.nl')) return r2url;
  // Only our own R2 assets go through the optimizer.
  if (!r2url.includes('.r2.dev') && !r2url.includes(R2_BASE)) return r2url;
  return `https://wsrv.nl/?url=${encodeURIComponent(r2url)}&w=${width}&q=82&output=webp&we`;
}

/**
 * Rewrite a Cloudinary (dghmoelly) delivery URL to its R2 equivalent AND run
 * it through the optimizer. Non-Cloudinary, non-R2 URLs are returned
 * unchanged. Used at render time on image URLs from the database.
 */
export function cld(url: string | null | undefined, width = 1600): string {
  if (!url) return '';
  const m = url.match(
    /^https?:\/\/res\.cloudinary\.com\/dghmoelly\/image\/upload\/(.+)$/,
  );
  const r2 = m ? `${R2_BASE}/${cldPathToKey(m[1])}` : url;
  return opt(r2, width);
}

/** Rewrite + optimize every Cloudinary/R2 image URL inside a longer string. */
export function cldAll(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(CLD_RE, (_full, rest) => opt(`${R2_BASE}/${cldPathToKey(rest)}`))
    .replace(
      /https?:\/\/pub-[a-z0-9]+\.r2\.dev\/[^"'\s)]+\.(?:png|jpe?g|webp|gif)/gi,
      (u) => (u.includes('wsrv.nl') ? u : opt(u)),
    );
}
