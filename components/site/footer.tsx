import Link from 'next/link';
import { Facebook, Linkedin, Music2, Check } from 'lucide-react';
import { Logo } from './logo';

const INFO = [
  { label: 'Despre', href: '/despre' },
  { label: 'Campanii', href: '/campanii' },
  { label: 'Noutăți', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Misiune', href: '/misiune' },
];

const RESURSE = [
  { label: 'Direcționează 20%', href: '/directioneaza-20' },
  { label: 'Redirecționează 3,5%', href: '/redirectioneaza-3-5' },
  { label: 'Voluntariat', href: '/voluntariat' },
  { label: 'Evenimente', href: '/evenimente' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-4">
            <Logo />
            <p className="text-sm text-ink-muted leading-relaxed max-w-xs">
              Parohia „Sfânta Cuvioasă Teodora de la Sihla&quot; din Botoșani este o comunitate în
              formare, zidită cu credință, rugăciune și dragoste frățească.
            </p>
            <div className="flex gap-2 pt-2">
              <SocialLink href="#" label="Facebook"><Facebook className="h-4 w-4" /></SocialLink>
              <SocialLink href="#" label="TikTok"><Music2 className="h-4 w-4" /></SocialLink>
              <SocialLink href="#" label="LinkedIn"><Linkedin className="h-4 w-4" /></SocialLink>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-navy">Info</h4>
            <ul className="space-y-2.5">
              {INFO.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-ink hover:text-coral transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-navy">Resurse</h4>
            <ul className="space-y-2.5">
              {RESURSE.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-ink hover:text-coral transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-navy">Contact</h4>
            <p className="text-sm text-ink mb-3">Cod fiscal (CIF): 48801453</p>
            <ContactRow>Adresă: Strada Pacea, Nr. 45B, Botoșani, România</ContactRow>
            <ContactRow>Email: contact@parohiasfteodoradelasihla.ro</ContactRow>
            <ContactRow>Telefon: +40 754 857 903</ContactRow>
            <ContactRow>Preot paroh: Pr. Cătălin Ailenei</ContactRow>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted">
          <span>© Parohia „Sfânta Cuvioasă Teodora de la Sihla&quot;</span>
          <div className="flex gap-5">
            <Link href="/termeni-si-conditii" className="hover:text-coral transition-colors">
              Termeni și Condiții
            </Link>
            <Link href="/politica-de-confidentialitate" className="hover:text-coral transition-colors">
              Politică de Confidențialitate
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-white transition-colors hover:bg-coral"
    >
      {children}
    </a>
  );
}

function ContactRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm text-ink mb-2">
      <Check className="h-4 w-4 text-coral flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}
