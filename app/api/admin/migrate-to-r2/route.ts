import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { isR2Configured, uploadToR2, extFromType } from '@/lib/r2';
import { cldPathToKey } from '@/lib/img';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300;

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

/**
 * One-time (idempotent) migration: copy every Cloudinary-hosted image
 * (res.cloudinary.com/dghmoelly/...) to R2 at its mapped key and rewrite the
 * Media.url to the R2 URL, so the site serves it from R2 (free egress).
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}) as any);
  if (!isAdminAuthorized(body.key)) {
    return NextResponse.json({ error: 'Acces refuzat' }, { status: 403 });
  }
  if (!isR2Configured()) {
    return NextResponse.json({ error: 'R2 neconfigurat' }, { status: 503 });
  }

  const media = await prisma.media.findMany({
    where: { url: { contains: 'res.cloudinary.com/dghmoelly' } },
    select: { id: true, url: true },
    take: 500,
  });

  let migrated = 0;
  let failed = 0;
  const log: string[] = [];

  for (const m of media) {
    const match = m.url.match(
      /res\.cloudinary\.com\/dghmoelly\/image\/upload\/(.+)$/,
    );
    if (!match) {
      failed++;
      continue;
    }
    const key = cldPathToKey(match[1]);
    try {
      const res = await fetch(m.url, { headers: { 'User-Agent': UA }, cache: 'no-store' });
      if (!res.ok) {
        failed++;
        log.push(`✗ ${key.slice(-40)} (fetch ${res.status})`);
        continue;
      }
      const ct = res.headers.get('content-type') || 'image/jpeg';
      const buf = Buffer.from(await res.arrayBuffer());
      // Ensure the key has an extension (older public-ids may lack one).
      const finalKey = /\.(jpe?g|png|webp|gif|svg)$/i.test(key)
        ? key
        : `${key}.${extFromType(ct)}`;
      const r2url = await uploadToR2(finalKey, buf, ct);
      if (!r2url) {
        failed++;
        log.push(`✗ ${finalKey.slice(-40)} (upload)`);
        continue;
      }
      await prisma.media.update({ where: { id: m.id }, data: { url: r2url } });
      migrated++;
      log.push(`✓ ${finalKey.slice(-44)}`);
    } catch (err: any) {
      failed++;
      log.push(`✗ ${key.slice(-40)} (${(err?.message || '').slice(0, 30)})`);
    }
  }

  return NextResponse.json({ ok: true, candidates: media.length, migrated, failed, log });
}
