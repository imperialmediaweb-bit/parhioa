import Link from 'next/link';
import { Search } from 'lucide-react';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import { MobileMenu } from './mobile-menu';

const NAV = [
  { label: 'Despre', href: '/despre' },
  { label: 'Misiune', href: '/misiune' },
  { label: 'Campanii', href: '/campanii' },
  { label: 'Noutăți', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Redirecționează', href: '/redirectioneaza-3-5' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white shadow-sm">
      <div className="container flex h-24 sm:h-28 lg:h-32 items-center justify-between gap-3 sm:gap-4">
        {/* Logo — bigger now */}
        <Logo size="lg" className="shrink min-w-0" />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-serif text-[15px] font-medium text-navy transition-colors hover:text-burgundy whitespace-nowrap relative after:absolute after:left-0 after:bottom-[-6px] after:h-[2px] after:w-0 after:bg-burgundy after:transition-all hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            aria-label="Caută"
            className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full text-navy hover:bg-cream-card transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/donations/strangere-de-fonduri-pentru-construirea-bisericii"
            className="hidden md:inline-block"
          >
            <Button variant="cream" size="sm">Donează</Button>
          </Link>
          <Link href="/contact" className="hidden md:inline-block">
            <Button variant="default" size="sm">Mesaj</Button>
          </Link>

          {/* Mobile hamburger */}
          <MobileMenu items={NAV} />
        </div>
      </div>
    </header>
  );
}
