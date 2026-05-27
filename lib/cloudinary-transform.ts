/**
 * Insert Cloudinary delivery transformations into a URL.
 * Minimal: format auto + quality auto + safe width cap. No improve, no
 * saturation, no sharpening — we want photos to look like photos.
 */
export function enhanceCloudinary(url: string, opts: { skipImprove?: boolean } = {}): string {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  if (/\/upload\/[a-z0-9_,:.-]+\//i.test(url) && url.includes('f_auto')) return url;

  // ignore opts.skipImprove — we don't apply improve anywhere now
  void opts;
  return url.replace('/image/upload/', '/image/upload/f_auto,q_auto:best,c_limit,w_2400/');
}

export function enhanceHero(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  if (url.includes('f_auto')) return url;
  return url.replace(
    '/image/upload/',
    '/image/upload/f_auto,q_auto:best,c_limit,w_2800/',
  );
}

export function enhanceCloudinaryVideo(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  if (!url.includes('/video/upload/')) return url;
  if (/\/video\/upload\/[a-z0-9_,:.-]+\//i.test(url)) return url;
  return url.replace('/video/upload/', '/video/upload/f_auto,q_auto:good,vc_auto,w_1920,c_limit/');
}


