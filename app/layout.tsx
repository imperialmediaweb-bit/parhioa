import type { Metadata, Viewport } from 'next';
import { Lora, Cinzel_Decorative, Marcellus_SC } from 'next/font/google';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { MobileDonateCta } from '@/components/site/mobile-donate-cta';
import { SmoothScrollProvider } from '@/components/site/smooth-scroll-provider';
import './globals.css';

// Body + most titles — warm, readable serif with italic
const lora = Lora({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

// Display — grand ecclesia titles (hero, section h2)
const cinzelDecorative = Cinzel_Decorative({
  subsets: ['latin', 'latin-ext'],
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

export const metadata: Metadata = {
  metadataBase: new URL('https://parhioa-production.up.railway.app'),
  title: {
    default: 'Parohia Sf. Cuvioasă Teodora de la Sihla · Botoșani',
    template: '%s — Parohia Sf. Cuvioasă Teodora de la Sihla',
  },
  description:
    'Comunitate creștin-ortodoxă în formare la Botoșani, sub ocrotirea Sfintei Cuvioase Teodora de la Sihla. Slujbe, mărturii și lucrarea de zidire a bisericii.',
  applicationName: 'Parohia Sf. Teodora',
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
    siteName: 'Parohia Sf. Cuvioasă Teodora de la Sihla',
    title: 'Parohia Sf. Cuvioasă Teodora de la Sihla · Botoșani',
    description:
      'Vino să te rogi cu noi și să fii parte din zidirea unei biserici sub ocrotirea Cuvioasei Teodora.',
  },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false, email: false, address: false },
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
      className={`${lora.variable} ${cinzelDecorative.variable} ${marcellusSC.variable}`}
    >
      <body>
        <SmoothScrollProvider />
        <SiteHeader />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
        <MobileDonateCta />
      </body>
    </html>
  );
}
