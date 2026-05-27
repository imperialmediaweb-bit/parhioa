/**
 * Insert Cloudinary transformations into a delivery URL.
 *
 * Cloudinary URL format:
 *   https://res.cloudinary.com/<cloud>/image/upload/<transforms>/<version>/<public_id>
 *
 * We add: f_auto (best format — AVIF/WebP), q_auto (smart quality), and
 * e_improve:30 (gentle color/contrast auto-enhance). Photos look more vivid
 * and download smaller without manual tuning.
 */
export function enhanceCloudinary(url: string, opts: { skipImprove?: boolean } = {}): string {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  // Don't double-apply if transformations already exist
  if (/\/upload\/[a-z0-9_,:.-]+\//i.test(url) && url.includes('e_improve')) return url;

  const transforms = opts.skipImprove
    ? 'f_auto,q_auto'
    : 'f_auto,q_auto,e_improve:30,e_saturation:8';

  // Insert immediately after /upload/
  return url.replace('/image/upload/', `/image/upload/${transforms}/`);
}

/**
 * Helper for hero / banner images — wider crop + sharpening.
 */
export function enhanceHero(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  if (url.includes('e_improve')) return url;
  return url.replace(
    '/image/upload/',
    '/image/upload/f_auto,q_auto:good,e_improve:40,e_sharpen:60,e_saturation:10/',
  );
}
