import Link from 'next/link';
import { Facebook, Linkedin, Music2, MapPin, Mail, Phone, User } from 'lucide-react';
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
    <footer className="relative mt-20 overflow-hidden text-cream/90">
      {/* Deep burgundy → wine gradient — matches the logo, not navy */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, #5a1813 0%, #3d0f0a 70%, #2a0907 100%)',
        }}
      />
      {/* Subtle gold ornamental wash (carved-wood-like) */}
      <div
        className="absolute inset-0 -z-10 opacity-25 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.6' numOctaves='2' seed='8'/><feColorMatrix values='0 0 0 0 0.92 0 0 0 0 0.78 0 0 0 0 0.52 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Top golden edge */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="absolute top-[3px] inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Sacred quote band */}
      <div className="relative border-b border-gold/25 py-12">
        <div className="container max-w-3xl text-center">
          <div className="flex justify-center mb-5">
            <OrthodoxCross height={72} fill="#EAC784" accent="#FBF6EE" />
          </div>
          <p className="font-display text-2xl sm:text-3xl italic text-cream leading-relaxed">
            „Casa Mea, casă de rugăciune se va chema, pentru toate neamurile."
          </p>
          <p className="mt-4 font-ceremonial uppercase text-xs tracking-[0.28em] text-gold">
            — Isaia 56:7
          </p>
        </div>
      </div>

      <div className="relative container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* About + logo */}
          <div className="lg:col-span-4 space-y-5">
            <FooterLogo />
            <p className="text-[15px] text-cream/80 leading-relaxed max-w-sm font-serif">
              Parohia „Sfânta Cuvioasă Teodora de la Sihla&quot; din Botoșani este o comunitate în
              formare, zidită cu credință, rugăciune și dragoste frățească.
            </p>
            <div className="flex gap-2.5 pt-1">
              <SocialLink href="#" label="Facebook"><Facebook className="h-4 w-4" /></SocialLink>
              <SocialLink href="#" label="TikTok"><Music2 className="h-4 w-4" /></SocialLink>
              <SocialLink href="#" label="LinkedIn"><Linkedin className="h-4 w-4" /></SocialLink>
            </div>
          </div>

          {/* Info column */}
          <div className="lg:col-span-2">
            <FooterHeading>Info</FooterHeading>
            <ul className="space-y-2.5">
              {INFO.map((item) => <FooterLink key={item.href} {...item} />)}
            </ul>
          </div>

          {/* Resurse column */}
          <div className="lg:col-span-2">
            <FooterHeading>Resurse</FooterHeading>
            <ul className="space-y-2.5">
              {RESURSE.map((item) => <FooterLink key={item.href} {...item} />)}
            </ul>
          </div>

          {/* Contact column */}
          <div className="lg:col-span-4">
            <FooterHeading>Contact</FooterHeading>
            <p className="text-sm text-cream/85 mb-4 flex items-center gap-2">
              <span className="text-gold">CIF</span>
              <span className="font-mono font-bold text-gold-light">48801453</span>
            </p>
            <div className="space-y-3">
              <ContactRow icon={MapPin}>Strada Pacea, Nr. 45B, Botoșani, România</ContactRow>
              <ContactRow icon={Mail}>
                <a href="mailto:contact@parohiasfteodoradelasihla.ro" className="hover:text-gold transition">
                  contact@parohiasfteodoradelasihla.ro
                </a>
              </ContactRow>
              <ContactRow icon={Phone}>
                <a href="tel:+40754857903" className="hover:text-gold transition">+40 754 857 903</a>
              </ContactRow>
              <ContactRow icon={User}>Preot paroh: Pr. Cătălin Ailenei</ContactRow>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-gold/25 flex flex-wrap items-center justify-between gap-3 text-xs text-cream/65">
          <span className="flex items-center gap-2">
            <span className="text-gold text-base">☩</span>
            Parohia „Sfânta Cuvioasă Teodora de la Sihla&quot; · {new Date().getFullYear()}
          </span>
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

function FooterLogo() {
  return (
    <Link href="/" className="group inline-flex flex-col gap-3" aria-label="Acasă">
      <img
        src="https://res.cloudinary.com/dghmoelly/image/upload/v1779891768/Screenshot_101-removebg-preview_yxrjmd.png"
        alt="Parohia Sf. Cuvioasă Teodora de la Sihla"
        className="h-28 sm:h-32 w-auto object-contain drop-shadow-[0_4px_20px_rgba(234,199,132,0.35)] transition-transform group-hover:scale-105"
      />
      <div className="leading-[1.1]">
        <p className="font-ecclesia text-[22px] sm:text-[26px] font-bold uppercase tracking-wider text-gold">
          Parohia
        </p>
        <p className="font-ecclesia text-[17px] sm:text-[20px] font-bold uppercase tracking-wider text-cream">
          Sf. Cuv. Teodora
        </p>
        <p className="font-ecclesia text-[12px] sm:text-[14px] font-semibold uppercase tracking-[0.18em] text-gold/80">
          de la Sihla · Botoșani
        </p>
      </div>
    </Link>
  );
}

function CrossBullet() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" className="text-gold" fill="currentColor" aria-hidden>
      <rect x="5" y="1" width="2" height="10" />
      <rect x="1" y="5" width="10" height="2" />
    </svg>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h4 className="font-ceremonial text-sm uppercase tracking-[0.22em] text-gold mb-2">
        {children}
      </h4>
      <div className="flex items-center gap-2">
        <span className="h-px w-6 bg-gold" />
        <CrossBullet />
      </div>
    </div>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-[15px] text-cream/80 hover:text-gold transition-colors flex items-center gap-2 group font-serif"
      >
        <span className="text-gold/50 group-hover:text-gold transition-colors text-xs">›</span>
        {label}
      </Link>
    </li>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-burgundy-dark transition-all hover:shadow-candlelight"
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
    <div className="flex items-start gap-3 text-[15px] text-cream/80 font-serif">
      <Icon className="h-4 w-4 text-gold flex-shrink-0 mt-1" />
      <span className="flex-1">{children}</span>
    </div>
  );
}
