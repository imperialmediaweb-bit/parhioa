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
export function cldPathToKey(rest: string): string {
  return rest
    .split('/')
    .filter((s) => !isTransformOrVersion(s))
    .join('/');
}

/**
 * Return the delivery URL for an image.
 *
 * Images are served DIRECTLY from Cloudflare R2 (a fast, free-egress CDN).
 * We previously routed them through the wsrv.nl proxy to upscale/sharpen the
 * small WordPress-era thumbnails, but on image-heavy pages that proxy added
 * latency and an extra point of failure (404/JSON for missing sources), which
 * showed up as broken images. Direct R2 is reliable; the few small thumbnails
 * are an acceptable trade for images that always load.
 */
export function opt(r2url: string, _width = 1600): string {
  if (!r2url) return '';
  // Unwrap any legacy wsrv.nl URL back to its R2 source.
  const m = r2url.match(/wsrv\.nl\/\?url=([^&]+)/);
  if (m) {
    try {
      return decodeURIComponent(m[1]);
    } catch {
      return r2url;
    }
  }
  return r2url;
}

/**
 * Build a Cloudinary delivery URL for an upload path, injecting automatic
 * format/quality when the path has no transform yet.
 */
function cldDeliver(rest: string): string {
  const first = rest.split('/')[0];
  const body = isTransformOrVersion(first) ? rest : `f_auto,q_auto/${rest}`;
  return `https://res.cloudinary.com/dghmoelly/image/upload/${body}`;
}

/**
 * Normalize an image URL for rendering.
 *
 * Most assets live on R2 and are stored as R2 URLs in the DB — those are
 * returned unchanged. Recent blog imports, however, are uploaded to
 * Cloudinary and stored as Cloudinary (dghmoelly) URLs; the one-time
 * Cloudinary→R2 migration never copied them, so rewriting them to R2 yields
 * a 404 (broken image → placeholder). We therefore serve those directly from
 * Cloudinary (where they actually exist), with f_auto/q_auto optimization.
 */
export function cld(url: string | null | undefined, width = 1600): string {
  if (!url) return '';
  const m = url.match(
    /^https?:\/\/res\.cloudinary\.com\/dghmoelly\/image\/upload\/(.+)$/,
  );
  if (m) return cldDeliver(m[1]);
  return opt(url, width);
}

/** Rewrite + optimize every Cloudinary/R2 image URL inside a longer string. */
export function cldAll(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(CLD_RE, (_full, rest) => cldDeliver(rest))
    .replace(
      /https?:\/\/pub-[a-z0-9]+\.r2\.dev\/[^"'\s)]+\.(?:png|jpe?g|webp|gif)/gi,
      (u) => (u.includes('wsrv.nl') ? u : opt(u)),
    );
}
