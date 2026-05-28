import { cache } from 'react';
import { prisma } from './prisma';
import { enhanceCloudinary } from './cloudinary-transform';

const WP_BASE = 'https://www.parohiasfteodoradelasihla.ro/wp-content/uploads';

type ImageEntry = {
  /** All fragments are tried in order; first DB hit wins. */
  matches: string[];
  fallback: string;
};

/**
 * Image map extracted directly from the live site's HTML — exact filenames,
 * not guesses. Each key has multiple match fragments because WordPress
 * sometimes appends -2, -3 to slugs.
 */
const IMAGE_MAP = {
  // ===== Hero slider (exact images from live elementskit-advanced-slider) =====
  heroSlide1: {
    matches: ['image-9-1', 'image-9'],
    fallback: `${WP_BASE}/2024/04/image-9-1.webp`,
  },
  heroSlide2: {
    matches: ['image-8', '2025/07/image-8'],
    fallback: `${WP_BASE}/2025/07/image-8.webp`,
  },

  // ===== Section: Părintele Cătălin Ailenei =====
  priestPortrait: {
    matches: ['catalin-ailenei'],
    fallback: `${WP_BASE}/2025/06/Catalin-Ailenei.webp`,
  },

  // ===== Section: Sub ocrotirea Sf. Teodora =====
  parishLogoBotosani: {
    matches: ['parohia-sfanta-cuvioasa-teodora-de-la-sihla-botosani'],
    fallback: `${WP_BASE}/2025/06/Parohia-Sfanta-Cuvioasa-Teodora-de-la-Sihla-Botosani.webp`,
  },

  // ===== Section: Fii ctitor al unei lucrări sfinte (REAL parish icon) =====
  parishIcon: {
    // No DB lookup — pin to the Cloudinary image the user wants used for the parish icon.
    matches: ['__never_match__'],
    fallback: 'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1779909922/Screenshot_98_uqff8q.png',
  },

  // ===== Section: Fii ctitor — community photo =====
  ctitorPhoto: {
    matches: ['__never_match__'],
    fallback: 'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1779910523/594401053_122229437516091213_3614555738436750498_n_yn7qvr.jpg',
  },

  // ===== Header / general logo =====
  parishLogo: {
    matches: ['parohia-sfanta-cuvioasa-teodora-de-la-sihla.png', '2024/03/parohia-sfanta'],
    fallback: `${WP_BASE}/2024/03/Parohia-Sfanta-Cuvioasa-Teodora-de-la-Sihla.png`,
  },

  // ===== Campaign poster (Devino ctitor) =====
  campaignPoster: {
    matches: ['whatsapp-image-2025-11-03', '15-27-15', '15_27_15'],
    fallback: `${WP_BASE}/2025/06/WhatsApp-Image-2025-11-03-at-15.27.15.jpeg`,
  },

  // ===== Video section background (Împreună întru Hristos) =====
  videoSectionBg: {
    matches: ['image-5-picsart', 'picsart-aiimageenhancer', 'image-5-'],
    fallback: `${WP_BASE}/2025/06/image-5-Picsart-AiImageEnhancer-2.webp`,
  },

  // ===== Newsletter background =====
  newsletterBg: {
    matches: ['image-6.webp', '2025/06/image-6'],
    fallback: `${WP_BASE}/2025/06/image-6.webp`,
  },

  // ===== Background for redirect-3-5 hero =====
  redirectHeroBg: {
    matches: ['image-7.webp', '2025/06/image-7'],
    fallback: `${WP_BASE}/2025/06/image-7.webp`,
  },

  // ===== Donate section: 4 small icon images (left grid) =====
  iconBox1: {
    matches: ['screenshot_73'],
    fallback: `${WP_BASE}/2025/06/Screenshot_73.webp`,
  },
  iconBox2: {
    matches: ['screenshot_300', '2025/10/screenshot_300'],
    fallback: `${WP_BASE}/2025/10/Screenshot_300.png`,
  },
  iconBox3: {
    matches: ['screenshot_60-2', 'screenshot_60'],
    fallback: `${WP_BASE}/2025/06/Screenshot_60-2.webp`,
  },
  iconBox4: {
    matches: ['liturghie-2', 'liturghie'],
    fallback: `${WP_BASE}/2025/06/liturghie-2.webp`,
  },

  // ===== Other useful images (preserved from earlier extraction) =====
  iconTeodora: {
    matches: ['screenshot_80', 'screenshot_82'],
    fallback: `${WP_BASE}/2025/06/Screenshot_80-1-1.webp`,
  },
  redirectChurch: {
    matches: ['screenshot_59'],
    fallback: `${WP_BASE}/2025/06/Screenshot_59-1.webp`,
  },
  redirectForm: {
    matches: ['screenshot_77'],
    fallback: `${WP_BASE}/2025/06/Screenshot_77-1.png`,
  },
  donationFamily: {
    matches: ['400455773'],
    fallback: `${WP_BASE}/2025/06/400455773_122112509750091213_6175291480986669359_n.jpg`,
  },

  // ===== Legacy aliases (so older pages don't break) =====
  handsBranch: {
    matches: ['__never_match__'],
    fallback: 'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1779885100/parhioa/wp-28191.webp',
  },
  liturghie: {
    matches: ['__never_match__'],
    fallback: 'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1779885081/parhioa/wp-28259.png',
  },
  iconTeodora2: {
    matches: ['screenshot_82'],
    fallback: `${WP_BASE}/2025/06/Screenshot_82-1.webp`,
  },
  handsChurch: {
    matches: ['__never_match__'],
    fallback: 'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1779885066/parhioa/wp-28305.jpg',
  },
  priestPraying: {
    matches: ['jun-19-2025-05_37_02', '05_37_02'],
    fallback: `${WP_BASE}/2025/06/ChatGPT-Image-Jun-19-2025-05_37_02-PM-1.webp`,
  },
} satisfies Record<string, ImageEntry>;

export type ImageKey = keyof typeof IMAGE_MAP;

export const getImages = cache(async (): Promise<Record<ImageKey, string>> => {
  const result = Object.fromEntries(
    Object.entries(IMAGE_MAP).map(([key, entry]) => [key, entry.fallback]),
  ) as Record<ImageKey, string>;

  try {
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
    // Fall back to WP URLs (already in result).
  }

  // Auto-enhance every Cloudinary URL we return — f_auto, q_auto and a gentle
  // color/contrast improvement. WordPress fallback URLs are returned untouched.
  for (const key of Object.keys(result) as ImageKey[]) {
    result[key] = enhanceCloudinary(result[key]);
  }

  return result;
});
