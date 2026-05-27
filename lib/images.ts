import { cache } from 'react';
import { prisma } from './prisma';

const WP_BASE = 'https://www.parohiasfteodoradelasihla.ro/wp-content/uploads';

type ImageEntry = {
  /** All fragments are tried in order; first DB hit wins. Use distinctive bits of the filename. */
  matches: string[];
  fallback: string;
};

const IMAGE_MAP = {
  priestPortrait: {
    matches: ['catalin-ailenei'],
    fallback: `${WP_BASE}/2025/06/Catalin-Ailenei.webp`,
  },
  parishLogo: {
    matches: ['parohia-sfanta-cuvioasa-teodora-de-la-sihla'],
    fallback: `${WP_BASE}/2024/03/Parohia-Sfanta-Cuvioasa-Teodora-de-la-Sihla.png`,
  },
  parishLogoBotosani: {
    matches: ['parohia-sfanta-cuvioasa-teodora-de-la-sihla-botosani'],
    fallback: `${WP_BASE}/2025/06/Parohia-Sfanta-Cuvioasa-Teodora-de-la-Sihla-Botosani.webp`,
  },
  handsBranch: {
    matches: ['09_17_21', '09-17-21', 'jun-19-2025-09', 'image-jun-19'],
    fallback: `${WP_BASE}/2025/06/ChatGPT-Image-Jun-19-2025-09_17_21-PM-1.webp`,
  },
  liturghie: {
    matches: ['08_31_56', '08-31-56', 'jun-20-2025-08', 'image-jun-20'],
    fallback: `${WP_BASE}/2025/06/ChatGPT-Image-Jun-20-2025-08_31_56-AM-1.webp`,
  },
  iconTeodora: {
    matches: ['screenshot_80', 'screenshot-80'],
    fallback: `${WP_BASE}/2025/06/Screenshot_80-1-1.webp`,
  },
  iconTeodora2: {
    matches: ['screenshot_82', 'screenshot-82'],
    fallback: `${WP_BASE}/2025/06/Screenshot_82-1.webp`,
  },
  handsChurch: {
    matches: ['09_30_18', '09-30-18', 'jun-20-2025-09'],
    fallback: `${WP_BASE}/2025/06/ChatGPT-Image-Jun-20-2025-09_30_18-PM-1.webp`,
  },
  priestPraying: {
    matches: ['05_37_02', '05-37-02', 'jun-19-2025-05'],
    fallback: `${WP_BASE}/2025/06/ChatGPT-Image-Jun-19-2025-05_37_02-PM-1.webp`,
  },
  campaignPoster: {
    matches: ['whatsapp-image-2025-11-03', 'whatsapp-image-2025-11', '15-27-15', '15_27_15'],
    fallback: `${WP_BASE}/2025/06/WhatsApp-Image-2025-11-03-at-15.27.15.jpeg`,
  },
  donationFamily: {
    matches: ['400455773'],
    fallback: `${WP_BASE}/2025/06/400455773_122112509750091213_6175291480986669359_n.jpg`,
  },
  redirectChurch: {
    matches: ['screenshot_59', 'screenshot-59'],
    fallback: `${WP_BASE}/2025/06/Screenshot_59-1.webp`,
  },
  redirectForm: {
    matches: ['screenshot_77', 'screenshot-77'],
    fallback: `${WP_BASE}/2025/06/Screenshot_77-1.png`,
  },
} satisfies Record<string, ImageEntry>;

export type ImageKey = keyof typeof IMAGE_MAP;

export const getImages = cache(async (): Promise<Record<ImageKey, string>> => {
  const result = Object.fromEntries(
    Object.entries(IMAGE_MAP).map(([key, entry]) => [key, entry.fallback]),
  ) as Record<ImageKey, string>;

  try {
    // Collect every fragment we might look for, query once.
    const allFragments = Array.from(
      new Set(Object.values(IMAGE_MAP).flatMap((e) => e.matches.map((m) => m.toLowerCase()))),
    );

    const media = await prisma.media.findMany({
      where: {
        OR: allFragments.flatMap((f) => [
          { filename: { contains: f, mode: 'insensitive' as const } },
          { wpUrl: { contains: f, mode: 'insensitive' as const } },
          { url: { contains: f, mode: 'insensitive' as const } },
        ]),
      },
      select: { filename: true, url: true, wpUrl: true },
    });

    for (const [key, entry] of Object.entries(IMAGE_MAP) as [ImageKey, ImageEntry][]) {
      for (const fragment of entry.matches) {
        const f = fragment.toLowerCase();
        const hit = media.find((m) => {
          const fn = (m.filename || '').toLowerCase();
          const wpu = (m.wpUrl || '').toLowerCase();
          const u = (m.url || '').toLowerCase();
          return fn.includes(f) || wpu.includes(f) || u.includes(f);
        });
        if (hit?.url) {
          result[key] = hit.url;
          break;
        }
      }
    }
  } catch {
    // DB unreachable — fall back to WP URLs (already in result).
  }

  return result;
});
