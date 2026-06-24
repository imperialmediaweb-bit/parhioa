/**
 * Walk all imported Facebook posts that have no featured image (or whose
 * featured image came from rss.app's channel-logo fallback), then try to
 * extract the real photo from the original Facebook post URL via mbasic
 * + og:image, and upload it to Cloudinary.
 */

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma';
import { uploadRemoteImage } from '@/lib/image-upload';
import { isAdminKeyValid } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = 'parhioa/blog';

const UA =
  'Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36';

async function getOgImage(url: string): Promise<string | null> {
  const variants = [
    url,
    url.replace(/^https?:\/\/(www\.)?facebook\.com/i, 'https://mbasic.facebook.com'),
    url.replace(/^https?:\/\/(www\.)?facebook\.com/i, 'https://m.facebook.com'),
  ];
  for (const candidate of Array.from(new Set(variants))) {
    try {
      const res = await fetch(candidate, {
        headers: {
          'User-Agent': UA,
          Accept: 'text/html,*/*;q=0.8',
          'Accept-Language': 'ro-RO,ro;q=0.9,en;q=0.7',
        },
        cache: 'no-store',
      });
      if (!res.ok) continue;
      const html = await res.text();
      const patterns: RegExp[] = [
        /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
        /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i,
        /<meta\s+property=["']og:image:secure_url["']\s+content=["']([^"']+)["']/i,
        /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i,
      ];
      for (const p of patterns) {
        const m = p.exec(html);
        if (m && m[1]) {
          const c = m[1].replace(/&amp;/g, '&');
          if (/^https?:\/\//.test(c)) return c;
        }
      }
      // mbasic inline images
      const imgRe = /<img[^>]+src=["']([^"']+)["']/gi;
      let mm: RegExpExecArray | null;
      while ((mm = imgRe.exec(html)) !== null) {
        const u = mm[1].replace(/&amp;/g, '&');
        if (/scontent[-.]/i.test(u) || /fbcdn\.net/i.test(u)) return u;
      }
    } catch {}
  }
  return null;
}

export async function POST(req: NextRequest) {
  let provided: string | undefined;
  try {
    const body = await req.json();
    provided = body?.key;
  } catch {}
  if (!isAdminKeyValid(provided)) {
    return NextResponse.json({ error: 'Acces refuzat' }, { status: 403 });
  }
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      { error: 'Lipsesc credențialele Cloudinary' },
      { status: 500 },
    );
  }

  const posts = await prisma.post.findMany({
    where: {
      status: 'publish',
      sourceGuid: { not: null },
      featuredId: null, // only the ones without a photo
    },
    take: 100,
  });

  let recovered = 0;
  let failed = 0;
  const log: string[] = [];

  for (const post of posts) {
    const fbUrl = post.sourceGuid && post.sourceGuid.startsWith('http')
      ? post.sourceGuid
      : null;
    if (!fbUrl) {
      log.push(`⏭️ ${post.title.slice(0, 50)} — fără URL Facebook`);
      continue;
    }

    const og = await getOgImage(fbUrl);
    if (!og) {
      failed++;
      log.push(`❌ ${post.title.slice(0, 50)} — Facebook a blocat fetch-ul`);
      continue;
    }

    const uploaded = await uploadRemoteImage(og, post.slug, FOLDER);
    if (!uploaded) {
      failed++;
      log.push(`❌ ${post.title.slice(0, 50)} — upload Cloudinary eșuat`);
      continue;
    }

    const media = await prisma.media.create({
      data: {
        filename: post.slug + '.jpg',
        url: uploaded.url,
        cloudinaryId: uploaded.publicId,
        alt: post.title,
        wpUrl: og,
      },
    });
    await prisma.post.update({
      where: { id: post.id },
      data: { featuredId: media.id },
    });

    recovered++;
    log.push(`🖼️ ${post.title.slice(0, 50)}`);
  }

  return NextResponse.json({
    ok: true,
    candidates: posts.length,
    recovered,
    failed,
    log,
  });
}
