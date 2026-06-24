import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { isAdminKeyValid } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 min — image uploads can be slow

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = 'parhioa';

async function checkCloudinaryExists(publicId: string): Promise<string | null> {
  try {
    const res = await cloudinary.api.resource(publicId, { resource_type: 'image' });
    return (res as any).secure_url as string;
  } catch {
    return null;
  }
}

async function uploadToCloudinary(url: string, publicId: string): Promise<string | null> {
  try {
    const res = await cloudinary.uploader.upload(url, {
      folder: FOLDER,
      public_id: publicId.replace(`${FOLDER}/`, ''),
      overwrite: false,
      resource_type: 'image',
    });
    return res.secure_url as string;
  } catch {
    return null;
  }
}

async function clearDuplicateFeaturedImages(): Promise<number> {
  // Find posts that share the same featured Media URL — those are the
  // rss.app channel logo bleeding into multiple imports. Clear featuredId
  // so the cards show the parchment placeholder instead.
  const groups = await prisma.post.groupBy({
    by: ['featuredId'],
    where: { featuredId: { not: null } },
    _count: { _all: true },
    having: { featuredId: { _count: { gt: 1 } } },
  });

  let cleared = 0;
  for (const g of groups) {
    if (!g.featuredId) continue;
    const updated = await prisma.post.updateMany({
      where: { featuredId: g.featuredId },
      data: { featuredId: null },
    });
    cleared += updated.count;
  }
  return cleared;
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
      { error: 'Lipsesc credențialele Cloudinary (CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET)' },
      { status: 500 },
    );
  }

  const candidates = await prisma.media.findMany({
    where: { NOT: { url: { contains: 'cloudinary' } } },
    orderBy: { id: 'asc' },
  });

  let alreadyOnCloudinary = 0;
  let freshlyUploaded = 0;
  let dead = 0;
  let skipped = 0;
  const log: string[] = [];

  for (const m of candidates) {
    const wpId = m.wpId || m.id;
    const publicId = `${FOLDER}/wp-${wpId}`;
    const source = m.wpUrl || m.url;

    const existing = await checkCloudinaryExists(publicId);
    if (existing) {
      await prisma.media.update({
        where: { id: m.id },
        data: { url: existing, cloudinaryId: publicId },
      });
      alreadyOnCloudinary++;
      log.push(`🔗 [${m.id}] wp-${wpId} — link reparat`);
      continue;
    }

    if (!source || !source.startsWith('http')) {
      skipped++;
      log.push(`⏭️ [${m.id}] wp-${wpId} — fără URL sursă`);
      continue;
    }

    const uploaded = await uploadToCloudinary(source, publicId);
    if (uploaded) {
      await prisma.media.update({
        where: { id: m.id },
        data: { url: uploaded, cloudinaryId: publicId },
      });
      freshlyUploaded++;
      log.push(`✅ [${m.id}] wp-${wpId} — upload nou`);
    } else {
      dead++;
      log.push(`❌ [${m.id}] wp-${wpId} — sursă moartă`);
    }
  }

  const duplicatesCleared = await clearDuplicateFeaturedImages();
  if (duplicatesCleared > 0) {
    log.push(`🧹 ${duplicatesCleared} articole — poză duplicat (logo Facebook) ștearsă`);
  }

  return NextResponse.json({
    ok: true,
    total: candidates.length,
    alreadyOnCloudinary,
    freshlyUploaded,
    dead,
    skipped,
    duplicatesCleared,
    log,
  });
}
