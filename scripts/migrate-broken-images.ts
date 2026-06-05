/* eslint-disable no-console */
/**
 * Find every Media row whose `url` is NOT a Cloudinary URL, then try
 * to recover the image in this order:
 *
 *   1. Check if Cloudinary already has it at parhioa/wp-{wpId} —
 *      a previous import pass may have uploaded but failed to update DB.
 *   2. Try to upload the original source URL (wpUrl || url) to Cloudinary.
 *   3. If both fail, leave the row — the PostImage component will show
 *      the parish icon as a graceful fallback.
 *
 * Usage:
 *   railway run npm run migrate:images
 *
 * Locally:
 *   DATABASE_URL=... CLOUDINARY_CLOUD_NAME=... CLOUDINARY_API_KEY=... \
 *     CLOUDINARY_API_SECRET=... npx ts-node \
 *     --project tsconfig.scripts.json scripts/migrate-broken-images.ts
 */

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = 'parhioa';

async function checkCloudinaryExists(publicId: string): Promise<string | null> {
  try {
    const res = await cloudinary.api.resource(publicId, { resource_type: 'image' });
    return res.secure_url as string;
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

async function main() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error(
      '❌ Lipsesc CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET în env',
    );
    process.exit(1);
  }

  const candidates = await prisma.media.findMany({
    where: { NOT: { url: { contains: 'cloudinary' } } },
    orderBy: { id: 'asc' },
  });

  console.log(`📦 ${candidates.length} imagini fără URL Cloudinary\n`);

  let alreadyOnCloudinary = 0;
  let freshlyUploaded = 0;
  let dead = 0;
  let skipped = 0;

  for (const m of candidates) {
    const wpId = m.wpId || m.id;
    const publicId = `${FOLDER}/wp-${wpId}`;
    const source = m.wpUrl || m.url;

    process.stdout.write(`  [${m.id}] wp-${wpId}: `);

    // Step 1: maybe it's already on Cloudinary
    const existingUrl = await checkCloudinaryExists(publicId);
    if (existingUrl) {
      await prisma.media.update({
        where: { id: m.id },
        data: { url: existingUrl, cloudinaryId: publicId },
      });
      alreadyOnCloudinary++;
      console.log('🔗 deja pe Cloudinary, link reparat');
      continue;
    }

    // Step 2: try to upload from the original source
    if (!source || !source.startsWith('http')) {
      skipped++;
      console.log('⏭️  fără URL sursă');
      continue;
    }

    const uploadedUrl = await uploadToCloudinary(source, publicId);
    if (uploadedUrl) {
      await prisma.media.update({
        where: { id: m.id },
        data: { url: uploadedUrl, cloudinaryId: publicId },
      });
      freshlyUploaded++;
      console.log('✅ upload nou reușit');
    } else {
      dead++;
      console.log('❌ sursă moartă');
    }
  }

  console.log('');
  console.log('═══════════════════════════════════════');
  console.log(`🔗 Deja pe Cloudinary (link reparat):  ${alreadyOnCloudinary}`);
  console.log(`✅ Upload nou reușit:                  ${freshlyUploaded}`);
  console.log(`❌ Sursă moartă (pierdute):            ${dead}`);
  console.log(`⏭️  Sărite (fără URL):                  ${skipped}`);
  console.log('═══════════════════════════════════════');

  if (dead > 0) {
    console.log('');
    console.log('Pentru cele pierdute, articolul afișează iconul parohiei.');
    console.log('Le poți înlocui manual din /admin/blog (Edit articol → URL imagine).');
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
