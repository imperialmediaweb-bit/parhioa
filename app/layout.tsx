import type { Metadata } from 'next';
import { Lora, Cinzel_Decorative, Marcellus_SC } from 'next/font/google';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { MobileDonateCta } from '@/components/site/mobile-donate-cta';
import './globals.css';

// Body + most titles — warm, readable serif with italic
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

// Display — grand ecclesia titles (hero, section h2)
const cinzelDecorative = Cinzel_Decorative({
  subsets: ['latin'],
  variable: '--font-cinzel-decorative',
  weight: ['400', '700', '900'],
  display: 'swap',
});

// Ceremonial — eyebrows, CTAs, inscriptions
const marcellusSC = Marcellus_SC({
  subsets: ['latin'],
  variable: '--font-marcellus-sc',
  weight: ['400'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Parohia Sf. Cuvioasă Teodora de la Sihla',
    template: '%s — Parohia Sf. Cuvioasă Teodora de la Sihla',
  },
  description:
    'Site oficial al Parohiei „Sfânta Cuvioasă Teodora de la Sihla" din Botoșani — comunitate creștin-ortodoxă în formare.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ro"
      className={`${lora.variable} ${cinzelDecorative.variable} ${marcellusSC.variable}`}
    >
      <body>
        <SiteHeader />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
        <MobileDonateCta />
      </body>
    </html>
  );
}
