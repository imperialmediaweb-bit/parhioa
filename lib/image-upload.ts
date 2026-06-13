/**
 * Download a remote image with browser-like headers, then upload the bytes
 * to Cloudinary. This works for Facebook / Instagram CDN URLs that block
 * server-to-server fetches but accept browser-shaped requests.
 *
 * Strategy:
 *   1. Fetch the URL with a real Chrome User-Agent + Facebook Referer.
 *   2. Buffer the bytes.
 *   3. Upload the buffer to Cloudinary using upload_stream.
 *
 * Fallback: if our fetch fails, ask Cloudinary to fetch it directly
 * (works for plain CDNs like imgur, rss.app, etc.).
 */

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

const BROWSER_HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  Accept:
    'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  'Accept-Language': 'ro-RO,ro;q=0.9,en;q=0.8',
  Referer: 'https://www.facebook.com/',
};

async function fetchImageBuffer(url: string): Promise<{
  buffer: Buffer;
  contentType: string;
} | null> {
  try {
    const res = await fetch(url, {
      headers: BROWSER_HEADERS,
      // No revalidation on import — we only call this when actually importing.
      cache: 'no-store',
    });
    if (!res.ok) {
      console.warn(`[image-upload] fetch ${res.status} ${url.slice(0, 80)}`);
      return null;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) {
      console.warn(`[image-upload] non-image content-type ${contentType}`);
      return null;
    }
    if (buffer.byteLength < 1024) {
      // Probably a 1x1 tracking pixel or error placeholder.
      console.warn(`[image-upload] suspiciously small image ${buffer.byteLength}B`);
      return null;
    }
    return { buffer, contentType };
  } catch (err) {
    console.warn('[image-upload] fetch threw', err);
    return null;
  }
}

function uploadBuffer(
  buffer: Buffer,
  publicId: string,
  folder: string,
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder,
        overwrite: false,
        resource_type: 'image',
      },
      (err, result) => {
        if (err) reject(err);
        else if (result) resolve(result);
        else reject(new Error('upload returned no result'));
      },
    );
    stream.end(buffer);
  });
}

export async function uploadRemoteImage(
  url: string,
  publicIdBase: string,
  folder: string = 'parhioa/blog',
): Promise<{ url: string; publicId: string } | null> {
  // 1) Try fetch-then-upload (works for Facebook CDN with proper headers)
  const fetched = await fetchImageBuffer(url);
  if (fetched) {
    try {
      const result = await uploadBuffer(fetched.buffer, publicIdBase, folder);
      return { url: result.secure_url, publicId: result.public_id };
    } catch (err) {
      console.warn('[image-upload] buffer upload failed, will try direct', err);
    }
  }

  // 2) Fallback: let Cloudinary fetch the URL itself
  try {
    const direct = await cloudinary.uploader.upload(url, {
      folder,
      public_id: publicIdBase,
      overwrite: false,
      resource_type: 'image',
    });
    return { url: direct.secure_url, publicId: direct.public_id };
  } catch (err: any) {
    console.error(
      `[image-upload] both fetch and direct upload failed for ${url.slice(0, 80)}`,
      err?.message || err,
    );
    return null;
  }
}
