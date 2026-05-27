import Link from 'next/link';
import { Facebook, Linkedin, Music2, Check, MapPin, Mail, Phone } from 'lucide-react';
import { Logo } from './logo';
import { OrthodoxCross } from './cross-divider';

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
    <footer className="relative bg-navy-dark text-cream/90 mt-20 overflow-hidden">
      {/* Decorative Byzantine pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><g fill='none' stroke='%23EAC784' stroke-width='0.6' opacity='0.55'><path d='M40 8 L46 22 L62 22 L50 32 L54 48 L40 38 L26 48 L30 32 L18 22 L34 22 Z'/><circle cx='40' cy='40' r='3' fill='%23EAC784'/></g></svg>\")",
        }}
      />
      {/* Golden top edge accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Sacred quote band */}
      <div className="relative border-b border-gold/20 py-10">
        <div className="container max-w-3xl text-center">
          <div className="flex justify-center mb-4 opacity-80">
            <OrthodoxCross height={56} fill="#EAC784" accent="#FBF6EE" />
          </div>
          <p className="font-display text-xl sm:text-2xl italic text-cream leading-relaxed">
            „Casa Mea, casă de rugăciune se va chema, pentru toate neamurile."
          </p>
          <p className="mt-3 font-ceremonial uppercase text-xs tracking-[0.22em] text-gold">
            Isaia 56:7
          </p>
        </div>
      </div>

      <div className="relative container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-2xl p-4 inline-block shadow-warm-lg">
              <Logo size="lg" />
            </div>
            <p className="text-sm text-cream/75 leading-relaxed max-w-xs">
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
            <h4 className="mb-4 font-ceremonial text-sm uppercase tracking-[0.22em] text-gold flex items-center gap-2">
              <span className="inline-block h-px w-4 bg-gold" /> Info
            </h4>
            <ul className="space-y-2.5">
              {INFO.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-cream/80 hover:text-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-gold/60 group-hover:text-gold transition-colors">✦</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 font-ceremonial text-sm uppercase tracking-[0.22em] text-gold flex items-center gap-2">
              <span className="inline-block h-px w-4 bg-gold" /> Resurse
            </h4>
            <ul className="space-y-2.5">
              {RESURSE.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-cream/80 hover:text-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-gold/60 group-hover:text-gold transition-colors">✦</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="mb-4 font-ceremonial text-sm uppercase tracking-[0.22em] text-gold flex items-center gap-2">
              <span className="inline-block h-px w-4 bg-gold" /> Contact
            </h4>
            <p className="text-sm text-cream/80 mb-3">Cod fiscal (CIF): <strong className="text-gold">48801453</strong></p>
            <ContactRow icon={MapPin}>Strada Pacea, Nr. 45B, Botoșani, România</ContactRow>
            <ContactRow icon={Mail}>
              <a href="mailto:contact@parohiasfteodoradelasihla.ro" className="hover:text-gold transition">
                contact@parohiasfteodoradelasihla.ro
              </a>
            </ContactRow>
            <ContactRow icon={Phone}>
              <a href="tel:+40754857903" className="hover:text-gold transition">+40 754 857 903</a>
            </ContactRow>
            <ContactRow icon={Check}>Preot paroh: Pr. Cătălin Ailenei</ContactRow>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gold/20 flex flex-wrap items-center justify-between gap-3 text-xs text-cream/60">
          <span>© Parohia „Sfânta Cuvioasă Teodora de la Sihla&quot; · {new Date().getFullYear()}</span>
          <div className="flex gap-5">
            <Link href="/termeni-si-conditii" className="hover:text-gold transition-colors">
              Termeni și Condiții
            </Link>
            <Link href="/politica-de-confidentialitate" className="hover:text-gold transition-colors">
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
      className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-navy-dark transition-all hover:shadow-candlelight"
    >
      {children}
    </a>
  );
}

function ContactRow({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-cream/80 mb-2.5">
      <Icon className="h-4 w-4 text-gold flex-shrink-0 mt-1" />
      <span className="flex-1">{children}</span>
    </div>
  );
}
