// Centralized image map — points to the live WordPress site for now.
// After running `npm run import:wp`, swap WP_BASE with your Cloudinary
// base (e.g. https://res.cloudinary.com/<cloud>/image/upload/parhioa/)
// so every reference flips at once.
const WP_BASE = 'https://www.parohiasfteodoradelasihla.ro/wp-content/uploads';

export const IMG = {
  // People
  priestPortrait: `${WP_BASE}/2025/06/Catalin-Ailenei.webp`,
  parishLogo: `${WP_BASE}/2024/03/Parohia-Sfanta-Cuvioasa-Teodora-de-la-Sihla.png`,
  parishLogoBotosani: `${WP_BASE}/2025/06/Parohia-Sfanta-Cuvioasa-Teodora-de-la-Sihla-Botosani.webp`,

  // Sections (hands holding a branch, candles, etc.)
  handsBranch: `${WP_BASE}/2025/06/ChatGPT-Image-Jun-19-2025-09_17_21-PM-1.webp`,
  liturghie: `${WP_BASE}/2025/06/ChatGPT-Image-Jun-20-2025-08_31_56-AM-1.webp`,
  iconTeodora: `${WP_BASE}/2025/06/Screenshot_80-1-1.webp`,
  iconTeodora2: `${WP_BASE}/2025/06/Screenshot_82-1.webp`,
  handsChurch: `${WP_BASE}/2025/06/ChatGPT-Image-Jun-20-2025-09_30_18-PM-1.webp`,
  priestPraying: `${WP_BASE}/2025/06/ChatGPT-Image-Jun-19-2025-05_37_02-PM-1.webp`,

  // Campaign / donation
  campaignPoster: `${WP_BASE}/2025/06/WhatsApp-Image-2025-11-03-at-15.27.15.jpeg`,
  donationFamily: `${WP_BASE}/2025/06/400455773_122112509750091213_6175291480986669359_n.jpg`,

  // Redirectioneaza 3.5%
  redirectChurch: `${WP_BASE}/2025/06/Screenshot_59-1.webp`,
  redirectForm: `${WP_BASE}/2025/06/Screenshot_77-1.png`,

  // Favicon variants
  favicon180: `${WP_BASE}/2025/06/cropped-Screenshot_90-1-180x180.png`,
};
