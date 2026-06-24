import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
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

function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    // Preferred: Authorization: Bearer <secret> header (not logged in URLs).
    const auth = req.headers.get('authorization');
    if (auth && safeStringEqual(auth, `Bearer ${expected}`)) return true;
    // Fallback for simple GET schedulers that can't set headers.
    const q = req.nextUrl.searchParams.get('secret');
    if (q && safeStringEqual(q, expected)) return true;
    return false;
  }
  // No CRON_SECRET → fall back to a valid ADMIN_KEY in ?key= so the endpoint
  // is never world-open. FAIL-CLOSED if neither is configured.
  return isAdminKeyValid(req.nextUrl.searchParams.get('key'));
}

function safeStringEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

async function runImport(maxAgeHours: number = 24) {
  const items: FeedItem[] = await fetchFeed();
  if (items.length === 0) {
    return { ok: true, total: 0, imported: 0, skipped: 0, failed: 0, log: ['Feed gol'] };
  }

  // Only consider items posted in the last `maxAgeHours` hours so the cron
  // doesn't keep re-trying old posts every run.
  const cutoff = Date.now() - maxAgeHours * 60 * 60 * 1000;
  const recent = items.filter((i) => {
    if (!i.pubDate) return false; // skip items without a known date in cron mode
    return i.pubDate.getTime() >= cutoff;
  });

  if (recent.length === 0) {
    return {
      ok: true,
      total: items.length,
      recent: 0,
      imported: 0,
      skipped: 0,
      failed: 0,
      log: [`Nicio postare nouă în ultimele ${maxAgeHours}h`],
      aiEnabled: !!process.env.OPENAI_API_KEY,
      timestamp: new Date().toISOString(),
    };
  }

  let imported = 0;
  let skipped = 0;
  let failed = 0;
  const log: string[] = [];

  for (const item of recent) {
    const guid = item.guid || item.link;
    if (!guid) {
      skipped++;
      continue;
    }

    const existing = await prisma.post.findUnique({ where: { sourceGuid: guid } });
    if (existing) {
      skipped++;
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
      log.push(`✅ ${rewritten.title.slice(0, 60)}`);
    } catch (err: any) {
      failed++;
      log.push(`❌ ${item.title.slice(0, 40)}: ${(err?.message || '').slice(0, 60)}`);
    }
  }

  console.log(
    `[cron import-feed] total=${items.length} recent=${recent.length} imported=${imported} skipped=${skipped} failed=${failed}`,
  );

  return {
    ok: true,
    total: items.length,
    recent: recent.length,
    imported,
    skipped,
    failed,
    log,
    aiEnabled: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString(),
  };
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Acces refuzat' }, { status: 401 });
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
  const hoursParam = Number(req.nextUrl.searchParams.get('hours'));
  const maxAgeHours = Number.isFinite(hoursParam) && hoursParam > 0 ? hoursParam : 24;
  return NextResponse.json(await runImport(maxAgeHours));
}

export async function POST(req: NextRequest) {
  return GET(req);
}
