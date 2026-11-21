'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

function openSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

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

      {/* Bottom gold hairline */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </header>
  );
}
