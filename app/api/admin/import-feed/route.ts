import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import slugify from 'slugify';
import { prisma } from '@/lib/prisma';
import { fetchFeed, type FeedItem } from '@/lib/facebook-feed';
import { rewriteAsArticle } from '@/lib/ai-rewriter';
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

async function uploadImage(url: string, baseSlug: string) {
  return uploadRemoteImage(url, baseSlug, FOLDER);
}

async function ensureCategory(name: string) {
  const slug = slugify(name, { lower: true, strict: true });
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return existing;
  return prisma.category.create({ data: { slug, name } });
}

function uniqueSlug(base: string): string {
  const trimmed = slugify(base || 'articol', { lower: true, strict: true }).slice(0, 80);
  return `${trimmed}-${Date.now().toString(36).slice(-4)}`;
}

export async function POST(req: NextRequest) {
  let providedKey: string | undefined;
  try {
    const body = await req.json();
    providedKey = body?.key;
  } catch {}
  if (!isAdminKeyValid(providedKey)) {
    return NextResponse.json({ error: 'Acces refuzat' }, { status: 403 });
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      { error: 'Lipsesc credențialele Cloudinary în Railway' },
      { status: 500 },
    );
  }

  const items: FeedItem[] = await fetchFeed();
  if (items.length === 0) {
    return NextResponse.json({ ok: true, total: 0, imported: 0, skipped: 0, failed: 0, log: ['Feed gol sau inaccesibil'] });
  }

  let imported = 0;
  let skipped = 0;
  let failed = 0;
  const log: string[] = [];

  for (const item of items) {
    const guid = item.guid || item.link;
    if (!guid) {
      skipped++;
      log.push('⏭️ fără guid');
      continue;
    }

    const existing = await prisma.post.findUnique({ where: { sourceGuid: guid } });
    if (existing) {
      // If the existing post has no featured image and the feed now has one
      // (better extraction), try to attach it. Otherwise skip.
      if (!existing.featuredId && item.image) {
        try {
          const uploaded = await uploadImage(item.image, existing.slug);
          if (uploaded) {
            const media = await prisma.media.create({
              data: {
                filename: existing.slug + '.jpg',
                url: uploaded.url,
                cloudinaryId: uploaded.publicId,
                alt: existing.title,
                wpUrl: item.image,
              },
            });
            await prisma.post.update({
              where: { id: existing.id },
              data: { featuredId: media.id },
            });
            log.push(`🖼️ ${existing.title.slice(0, 60)} — poză adăugată`);
            continue;
          }
        } catch (err: any) {
          log.push(
            `⚠️ ${existing.title.slice(0, 40)} — nu am putut atașa poză: ${(err?.message || '').slice(0, 50)}`,
          );
        }
      }
      skipped++;
      log.push(`⏭️ deja importat: ${existing.title.slice(0, 60)}`);
      continue;
    }

    try {
      const rewritten = await rewriteAsArticle({
        rawTitle: item.title,
        rawDescription: item.description,
        pubDate: item.pubDate,
        link: item.link,
      });

      const slug = uniqueSlug(rewritten.title);

      let featuredId: number | null = null;
      if (item.image) {
        const uploaded = await uploadImage(item.image, slug);
        if (uploaded) {
          const media = await prisma.media.create({
            data: {
              filename: slug + '.jpg',
              url: uploaded.url,
              cloudinaryId: uploaded.publicId,
              alt: rewritten.title,
              wpUrl: item.image,
            },
          });
          featuredId = media.id;
        }
      }

      const category = await ensureCategory(rewritten.category);

      await prisma.post.create({
        data: {
          sourceGuid: guid,
          slug,
          title: rewritten.title,
          content: rewritten.contentHtml,
          excerpt: rewritten.excerpt,
          status: 'publish',
          featuredId,
          publishedAt: item.pubDate || new Date(),
          categories: { connect: [{ id: category.id }] },
        },
      });

      imported++;
      log.push(`✅ ${rewritten.title.slice(0, 60)} → ${rewritten.category}`);
    } catch (err: any) {
      failed++;
      const msg = err?.message || String(err);
      log.push(`❌ ${item.title.slice(0, 40)}: ${msg.slice(0, 80)}`);
    }
  }

  return NextResponse.json({
    ok: true,
    total: items.length,
    imported,
    skipped,
    failed,
    log,
    aiEnabled: !!process.env.OPENAI_API_KEY,
  });
}
