import type { Metadata } from 'next';
import { InstallCTA } from '@/components/site/install-cta';
import { Bell, CalendarCheck, Image as ImageIcon, Smartphone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Instalează aplicația parohiei',
  description:
    'Instalează aplicația Parohiei Sf. Cuvioasă Teodora de la Sihla pe telefon și primește veștile din viața parohiei, programul slujbelor și anunțurile — direct pe ecran.',
  alternates: { canonical: '/instaleaza' },
  openGraph: {
    type: 'website',
    title: 'Instalează aplicația parohiei',
    description:
      'Vești, slujbe și anunțuri din viața parohiei, direct pe telefon. Android și iPhone.',
    url: '/instaleaza',
    images: [
      {
        url: '/instaleaza-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Aplicația Parohiei Sf. Cuvioasă Teodora de la Sihla',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instalează aplicația parohiei',
    description:
      'Vești, slujbe și anunțuri din viața parohiei, direct pe telefon. Android și iPhone.',
    images: ['/instaleaza-og.jpg'],
  },
};

export default function InstaleazaPage() {
  return (
    <div className="container py-12 max-w-2xl text-center">
      <img
        src="/icons/icon-192.png"
        alt="Aplicația Parohiei Sf. Teodora"
        className="h-24 w-24 rounded-2xl border border-gold/50 mx-auto shadow-md"
      />
      <h1 className="font-display text-3xl sm:text-4xl text-burgundy mt-5">
        Aplicația parohiei
      </h1>
      <p className="text-ink-muted mt-2">
        Parohia „Sfânta Cuvioasă Teodora de la Sihla” — Botoșani
      </p>
      <p className="text-ink mt-4 max-w-md mx-auto">
        Instaleaz-o pe telefon și ai parohia la un click: veștile din viața
        parohiei îți apar direct pe ecran, cu program, slujbe și anunțuri.
      </p>

      <div className="mt-7 flex justify-center">
        <InstallCTA />
      </div>

      <div className="mt-10 grid sm:grid-cols-3 gap-4 text-left">
        <Feature icon={Bell} title="Anunțuri pe telefon">
          Primești o notificare când apare ceva nou în viața parohiei.
        </Feature>
        <Feature icon={CalendarCheck} title="Program & vești">
          Slujbe, evenimente și noutăți din parohie, mereu la îndemână.
        </Feature>
        <Feature icon={ImageIcon} title="Ca o aplicație">
          Se deschide pe tot ecranul, cu iconița Sfintei pe telefon.
        </Feature>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-cream-card p-5 text-left text-sm text-ink-soft">
        <p className="font-medium text-burgundy flex items-center gap-2 mb-2">
          <Smartphone className="h-4 w-4" /> Dacă nu apare butonul de instalare
        </p>
        <p className="mb-1">
          <strong>Android (Chrome):</strong> apasă butonul de mai sus sau meniul ⋮ →
          „Instalează aplicația”.
        </p>
        <p>
          <strong>iPhone (Safari):</strong> apasă <em>Partajează</em> → „Adaugă la
          ecranul principal”, apoi deschide aplicația și pornește anunțurile.
        </p>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="h-9 w-9 rounded-xl bg-burgundy/10 text-burgundy flex items-center justify-center mb-2">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-display text-burgundy">{title}</p>
      <p className="text-xs text-ink-soft mt-1 leading-snug">{children}</p>
    </div>
  );
}
