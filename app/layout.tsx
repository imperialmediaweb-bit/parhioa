import type { Metadata } from 'next';
import {
  Playfair_Display,
  Lora,
  Merriweather,
  Poppins,
  Cinzel_Decorative,
  Marcellus_SC,
} from 'next/font/google';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { MobileDonateCta } from '@/components/site/mobile-donate-cta';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  variable: '--font-merriweather',
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

// Ecclesiastical / Byzantine accent — used for special titles (hero, section headers)
const cinzelDecorative = Cinzel_Decorative({
  subsets: ['latin'],
  variable: '--font-cinzel-decorative',
  weight: ['400', '700', '900'],
  display: 'swap',
});

// Roman inscriptional small caps — used for eyebrows ("CREDINȚĂ VIE ȘI AJUTOR", etc.)
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
      className={`${playfair.variable} ${lora.variable} ${merriweather.variable} ${poppins.variable} ${cinzelDecorative.variable} ${marcellusSC.variable}`}
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
