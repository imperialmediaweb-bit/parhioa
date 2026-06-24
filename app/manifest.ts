import type { MetadataRoute } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/site';

/**
 * Web app manifest — lets users add the parish site to their phone's home
 * screen and have it launch full-screen with the parish icon, like a
 * lightweight app. No service worker, no install prompt — just the basics.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Parohia Sf. Cuvioasă Teodora de la Sihla',
    short_name: 'Sf. Teodora',
    description:
      'Comunitate creștin-ortodoxă din Botoșani sub ocrotirea Sfintei Cuvioase Teodora de la Sihla.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f3ead8',
    theme_color: '#5a1813',
    lang: 'ro-RO',
    orientation: 'portrait',
    icons: [
      { src: DEFAULT_OG_IMAGE, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: DEFAULT_OG_IMAGE, sizes: '192x192', type: 'image/png', purpose: 'any' },
    ],
  };
}
