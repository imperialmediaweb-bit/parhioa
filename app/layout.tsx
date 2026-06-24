import type { Metadata, Viewport } from 'next';
import { Lora, Cinzel_Decorative, Marcellus_SC, Cinzel } from 'next/font/google';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { MobileDonateCta } from '@/components/site/mobile-donate-cta';
import { SmoothScrollProvider } from '@/components/site/smooth-scroll-provider';
import { JsonLd } from '@/components/site/jsonld';
import { SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/site';
import { organizationJsonLd, websiteJsonLd } from '@/lib/jsonld';
import './globals.css';

// Body + most titles — warm, readable serif with italic
const lora = Lora({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

// Display — grand ecclesia titles (hero, section h2).
// Cinzel Decorative only ships Latin glyphs, so RO diacritics (Ț Ș Ă Î Â)
// will gracefully fall back to Lora — also a serif, looks fine.
const cinzelDecorative = Cinzel_Decorative({
  subsets: ['latin'],
  variable: '--font-cinzel-decorative',
  weight: ['400', '700', '900'],
  display: 'swap',
});

// Ceremonial — eyebrows, CTAs, inscriptions
const marcellusSC = Marcellus_SC({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-marcellus-sc',
  weight: ['400'],
  display: 'swap',
});

// Nav / labels — classical Roman caps, full diacritic support. Used for the
// top-level menu so Ă/Ș/Ț render at the same height as the other letters,
// which Marcellus SC's small-caps shapes do not.
const cinzel = Cinzel({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Parohia Sf. Cuvioasă Teodora de la Sihla · Botoșani',
    template: '%s — Parohia Sf. Cuvioasă Teodora de la Sihla',
  },
  description:
    'Comunitate creștin-ortodoxă în formare la Botoșani, sub ocrotirea Sfintei Cuvioase Teodora de la Sihla. Slujbe, mărturii și lucrarea de zidire a bisericii.',
  applicationName: 'Parohia Sf. Teodora',
  alternates: { canonical: '/' },
  keywords: [
    'Parohia Sf. Teodora',
    'Botoșani',
    'biserică ortodoxă',
    'donații parohie',
    'Sfânta Cuvioasă Teodora de la Sihla',
    'pr. Cătălin Ailenei',
  ],
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: SITE_URL,
    siteName: 'Parohia Sf. Cuvioasă Teodora de la Sihla',
    title: 'Parohia Sf. Cuvioasă Teodora de la Sihla · Botoșani',
    description:
      'Vino să te rogi cu noi și să fii parte din zidirea unei biserici sub ocrotirea Cuvioasei Teodora.',
    images: [{ url: DEFAULT_OG_IMAGE, width: 512, height: 512, alt: 'Sfânta Cuvioasă Teodora de la Sihla' }],
  },
  twitter: { card: 'summary_large_image', images: [DEFAULT_OG_IMAGE] },
  formatDetection: { telephone: false, email: false, address: false },
  icons: {
    icon: [
      { url: 'https://res.cloudinary.com/dghmoelly/image/upload/v1780574528/sf_theodora_de_la_sihla_ri9rz2.png' },
    ],
    shortcut: 'https://res.cloudinary.com/dghmoelly/image/upload/v1780574528/sf_theodora_de_la_sihla_ri9rz2.png',
    apple: 'https://res.cloudinary.com/dghmoelly/image/upload/v1780574528/sf_theodora_de_la_sihla_ri9rz2.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#5a1813',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ro"
      className={`${lora.variable} ${cinzelDecorative.variable} ${marcellusSC.variable} ${cinzel.variable}`}
    >
      <body>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <SmoothScrollProvider />
        <SiteHeader />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
        <MobileDonateCta />
      </body>
    </html>
  );
}
