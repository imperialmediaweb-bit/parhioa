import { v2 as cloudinary } from 'cloudinary';
import { cache } from 'react';

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export type CloudinaryAsset = {
  publicId: string;
  url: string;
  width: number;
  height: number;
  createdAt: string;
  folder?: string;
  alt?: string;
  caption?: string;
};

/**
 * Lists recent images directly from the Cloudinary account.
 *
 * - If CLOUDINARY_GALLERY_FOLDER env var is set (e.g. "galerie" or
 *   "parohia/galerie"), only returns assets in that folder.
 * - Otherwise returns the latest uploads across all folders.
 *
 * Cached per request via React's `cache`.
 */
export const listGalleryAssets = cache(
  async (max = 30): Promise<CloudinaryAsset[]> => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      return [];
    }

    const folder = process.env.CLOUDINARY_GALLERY_FOLDER?.trim();

    try {
      const expression = [
        'resource_type:image',
        // Skip tiny/icon-like files
        'width>800',
        // Skip removed-bg logos and theme demos
        '-public_id:*removebg*',
        '-public_id:*logo*',
        '-public_id:*icon*',
        '-public_id:*portfolio*',
        '-public_id:*home-church*',
        '-public_id:*church-img*',
        folder ? `folder:${folder}/*` : null,
      ]
        .filter(Boolean)
        .join(' AND ');

      const result = await cloudinary.search
        .expression(expression)
        .sort_by('created_at', 'desc')
        .max_results(max)
        .with_field('context')
        .execute();

      return (result.resources || []).map((r: Record<string, unknown>) => ({
        publicId: r.public_id as string,
        url: enhance(r.secure_url as string),
        width: (r.width as number) || 0,
        height: (r.height as number) || 0,
        createdAt: r.created_at as string,
        folder: r.folder as string | undefined,
        alt: (r.context as { alt?: string })?.alt,
        caption: (r.context as { caption?: string })?.caption,
      }));
    } catch {
      return [];
    }
  },
);

function enhance(url: string): string {
  // Inject Cloudinary auto-format + auto-quality transforms
  return url.includes('/image/upload/') && !url.includes('/f_auto')
    ? url.replace('/image/upload/', '/image/upload/f_auto,q_auto:best,c_limit,w_2000/')
    : url;
}
