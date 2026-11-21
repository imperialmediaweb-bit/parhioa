'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart } from 'lucide-react';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import { MobileMenu } from './mobile-menu';
import { OPEN_SEARCH_EVENT } from './search-modal';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Despre', href: '/despre' },
  { label: 'Misiune', href: '/misiune' },
  { label: 'Cronologie', href: '/cronologie' },
  { label: 'Campanii', href: '/campanii' },
  { label: 'Noutăți', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

// Homepage quick-jump links, integrated into the header (shown only on `/`).
const HOME_JUMP = [
  { href: '#parohul', short: 'Parohul', full: 'Parohul bisericii' },
  { href: '#despre-parohia', short: 'Despre parohie', full: 'Despre parohie' },
  { href: '#daruieste', short: 'Dăruiește', full: 'Dăruiește pentru zidire' },
];

function openSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-[0_2px_18px_-10px_rgba(101,26,20,0.25)]">
      {/* Top gold hairline */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div
        className={cn(
          'container flex items-center justify-between gap-3 sm:gap-6 transition-[height] duration-300 ease-out',
          scrolled
            ? 'h-16 sm:h-[72px] lg:h-[76px]'
            : 'h-24 sm:h-28 lg:h-32',
        )}
      >
        <Logo size={scrolled ? 'sm' : 'default'} className="shrink min-w-0" />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-nav uppercase text-[12px] font-medium tracking-[0.18em] text-burgundy-dark/85 transition-colors hover:text-burgundy whitespace-nowrap relative after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-gold after:transition-all hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Caută"
            aria-keyshortcuts="Control+K"
            className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full text-burgundy hover:bg-cream-card transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/donations/strangere-de-fonduri-pentru-construirea-bisericii"
            className="hidden md:inline-flex"
          >
            <Button size="sm" className="!gap-1.5">
              <Heart className="h-3.5 w-3.5 text-gold" fill="currentColor" />
              Dăruiește
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <MobileMenu items={NAV} onSearch={openSearch} />
        </div>
      </div>

      {/* Integrated homepage quick-jump row — part of the header, shown only on
          the homepage and collapsed once the user scrolls, so the fixed chrome
          stays slim. */}
      {isHome && (
        <div
          className={cn(
            'overflow-hidden border-t border-gold/25 bg-cream/70 transition-all duration-300 ease-out',
            scrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100',
          )}
        >
          <nav
            className="container flex items-center justify-start sm:justify-center gap-5 sm:gap-8 lg:gap-12 py-2 overflow-x-auto scrollbar-none"
            aria-label="Navigare rapidă pagina principală"
          >
            {HOME_JUMP.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="flex items-center gap-1.5 sm:gap-2 font-ceremonial uppercase text-[10px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.18em] text-burgundy-dark hover:text-burgundy active:text-burgundy transition whitespace-nowrap shrink-0"
              >
                <span className="text-gold">☩</span>
                <span className="sm:hidden">{l.short}</span>
                <span className="hidden sm:inline">{l.full}</span>
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Bottom gold hairline */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </header>
  );
}
