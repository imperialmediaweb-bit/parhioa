import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { R2_BASE } from './img';

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET = process.env.R2_BUCKET;
const ENDPOINT =
  process.env.R2_ENDPOINT ||
  (ACCOUNT_ID ? `https://${ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined);

export function isR2Configured(): boolean {
  return !!(ACCESS_KEY_ID && SECRET_ACCESS_KEY && BUCKET && ENDPOINT);
}

let client: S3Client | null = null;
function getClient(): S3Client | null {
  if (client) return client;
  if (!isR2Configured()) return null;
  client = new S3Client({
    region: 'auto',
    endpoint: ENDPOINT,
    credentials: {
      accessKeyId: ACCESS_KEY_ID as string,
      secretAccessKey: SECRET_ACCESS_KEY as string,
    },
  });
  return client;
}

/** Map a content-type to a file extension. */
export function extFromType(ct: string): string {
  if (/png/i.test(ct)) return 'png';
  if (/webp/i.test(ct)) return 'webp';
  if (/gif/i.test(ct)) return 'gif';
  if (/svg/i.test(ct)) return 'svg';
  return 'jpg';
}

/**
 * Upload bytes to R2 at `key` and return the public URL. Returns null when R2
 * is not configured or the upload fails (caller falls back to Cloudinary).
 */
export async function uploadToR2(
  key: string,
  buffer: Buffer,
  contentType = 'image/jpeg',
): Promise<string | null> {
  const c = getClient();
  if (!c || !BUCKET) return null;
  try {
    await c.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
    return `${R2_BASE}/${key}`;
  } catch (err) {
    console.error('[r2] upload failed', key, err);
    return null;
  }
}
