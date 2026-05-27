/**
 * Insert Cloudinary delivery transformations into a URL.
 *
 * Default mode: format auto, smart quality, request enough width
 * for high-DPI screens (2000px), gentle improve. No saturation lift
 * because we don't want the parish reds to look neon — the photos
 * read as photos.
 */
export function enhanceCloudinary(url: string, opts: { skipImprove?: boolean } = {}): string {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  if (/\/upload\/[a-z0-9_,:.-]+\//i.test(url) && url.includes('f_auto')) return url;

  const transforms = opts.skipImprove
    ? 'f_auto,q_auto:good,c_limit,w_2000'
    : 'f_auto,q_auto:good,c_limit,w_2000,e_improve:20';

  return url.replace('/image/upload/', `/image/upload/${transforms}/`);
}

/**
 * Hero / banner — wider crop, slight sharpening, no improve to keep skin tones natural.
 */
export function enhanceHero(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  if (url.includes('f_auto')) return url;
  return url.replace(
    '/image/upload/',
    '/image/upload/f_auto,q_auto:good,c_limit,w_2400,e_sharpen:50/',
  );
}

/**
 * Apply Cloudinary video transformations: format auto, quality auto,
 * limit width to 1920, auto video codec (HEVC/VP9/H.264 per browser).
 * Cuts the bitrate while keeping it smooth.
 */
export function enhanceCloudinaryVideo(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  if (!url.includes('/video/upload/')) return url;
  if (/\/video\/upload\/[a-z0-9_,:.-]+\//i.test(url)) return url;
  return url.replace('/video/upload/', '/video/upload/f_auto,q_auto:good,vc_auto,w_1920,c_limit/');
}

