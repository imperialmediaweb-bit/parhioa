import type { Metadata } from 'next';
import { Cinzel, Cormorant_Garamond, Inter } from 'next/font/google';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
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
    <html lang="ro" className={`${cinzel.variable} ${cormorant.variable} ${inter.variable}`}>
      <body>
        <SiteHeader />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
