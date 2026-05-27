import { cache } from 'react';
import { prisma } from './prisma';

/**
 * Centralized image map for the static layouts (home, misiune, despre, etc.).
 *
 * Each entry says: "look up the media whose WP slug contains <fragment>; if
 * we can't find it, fall back to the live WordPress URL."
 *
 * After running `npm run import:wp`, the Media table contains everything that
 * lives in WP, with `url` pointing at Cloudinary. The lookup below resolves
 * to those Cloudinary URLs automatically. The fallback only kicks in if the
 * import hasn't run yet or a particular image isn't in the DB.
 */

const WP_BASE = 'https://www.parohiasfteodoradelasihla.ro/wp-content/uploads';

type ImageEntry = { match: string; fallback: string };

const IMAGE_MAP = {
  priestPortrait: {
    match: 'catalin-ailenei',
    fallback: `${WP_BASE}/2025/06/Catalin-Ailenei.webp`,
  },
  parishLogo: {
    match: 'parohia-sfanta-cuvioasa-teodora-de-la-sihla',
    fallback: `${WP_BASE}/2024/03/Parohia-Sfanta-Cuvioasa-Teodora-de-la-Sihla.png`,
  },
  parishLogoBotosani: {
    match: 'parohia-sfanta-cuvioasa-teodora-de-la-sihla-botosani',
    fallback: `${WP_BASE}/2025/06/Parohia-Sfanta-Cuvioasa-Teodora-de-la-Sihla-Botosani.webp`,
  },
  handsBranch: {
    match: 'jun-19-2025-09_17_21',
    fallback: `${WP_BASE}/2025/06/ChatGPT-Image-Jun-19-2025-09_17_21-PM-1.webp`,
  },
  liturghie: {
    match: 'jun-20-2025-08_31_56',
    fallback: `${WP_BASE}/2025/06/ChatGPT-Image-Jun-20-2025-08_31_56-AM-1.webp`,
  },
  iconTeodora: {
    match: 'screenshot_80-1-1',
    fallback: `${WP_BASE}/2025/06/Screenshot_80-1-1.webp`,
  },
  iconTeodora2: {
    match: 'screenshot_82-1',
    fallback: `${WP_BASE}/2025/06/Screenshot_82-1.webp`,
  },
  handsChurch: {
    match: 'jun-20-2025-09_30_18',
    fallback: `${WP_BASE}/2025/06/ChatGPT-Image-Jun-20-2025-09_30_18-PM-1.webp`,
  },
  priestPraying: {
    match: 'jun-19-2025-05_37_02',
    fallback: `${WP_BASE}/2025/06/ChatGPT-Image-Jun-19-2025-05_37_02-PM-1.webp`,
  },
  campaignPoster: {
    match: 'whatsapp-image-2025-11-03',
    fallback: `${WP_BASE}/2025/06/WhatsApp-Image-2025-11-03-at-15.27.15.jpeg`,
  },
  donationFamily: {
    match: '400455773_122112509750091213',
    fallback: `${WP_BASE}/2025/06/400455773_122112509750091213_6175291480986669359_n.jpg`,
  },
  redirectChurch: {
    match: 'screenshot_59-1',
    fallback: `${WP_BASE}/2025/06/Screenshot_59-1.webp`,
  },
  redirectForm: {
    match: 'screenshot_77',
    fallback: `${WP_BASE}/2025/06/Screenshot_77-1.png`,
  },
} satisfies Record<string, ImageEntry>;

export type ImageKey = keyof typeof IMAGE_MAP;

/**
 * Fetch all configured images in one query and return a key->url map.
 * Cached per request via `react.cache`, so multiple components on the same
 * page share a single DB hit.
 */
export const getImages = cache(async (): Promise<Record<ImageKey, string>> => {
  const result = Object.fromEntries(
    Object.entries(IMAGE_MAP).map(([key, entry]) => [key, entry.fallback]),
  ) as Record<ImageKey, string>;

  try {
    const fragments = Object.values(IMAGE_MAP).map((e) => e.match.toLowerCase());
    const allMedia = await prisma.media.findMany({
      where: {
        OR: fragments.map((f) => ({
          filename: { contains: f, mode: 'insensitive' as const },
        })),
      },
      select: { filename: true, url: true },
    });

    for (const [key, entry] of Object.entries(IMAGE_MAP) as [ImageKey, ImageEntry][]) {
      const hit = allMedia.find((m) =>
        m.filename.toLowerCase().includes(entry.match.toLowerCase()),
      );
      if (hit?.url) result[key] = hit.url;
    }
  } catch {
    // DB unreachable — fall back to WP URLs (already set above).
  }

  return result;
});
