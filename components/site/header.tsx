'use client';

import Link from 'next/link';
import { Search, Heart } from 'lucide-react';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import { MobileMenu } from './mobile-menu';
import { OPEN_SEARCH_EVENT } from './search-modal';

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
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top gold hairline */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="relative bg-white shadow-[0_2px_18px_-10px_rgba(101,26,20,0.22)]">
        {/* Faint Byzantine gold motif — subtle Orthodox texture behind the bar */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05] bg-byzantine-pattern"
          aria-hidden
        />

        <div className="container relative flex h-24 sm:h-28 items-center justify-between gap-3 sm:gap-6">
          <Logo size="default" className="shrink min-w-0" />

          {/* Desktop nav — centered golden underline that grows from the middle */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative font-nav uppercase text-[12px] font-medium tracking-[0.18em] text-burgundy-dark/85 transition-colors hover:text-burgundy whitespace-nowrap py-1"
              >
                {item.label}
                <span className="pointer-events-none absolute -bottom-0.5 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold/70 via-gold to-gold/70 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Subtle gold divider between the nav and the action group */}
            <span className="hidden lg:block h-7 w-px bg-gradient-to-b from-transparent via-gold/45 to-transparent mr-1" aria-hidden />
            <button
              type="button"
              onClick={openSearch}
              aria-label="Caută"
              aria-keyshortcuts="Control+K"
              className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full text-burgundy ring-1 ring-transparent hover:ring-gold/50 hover:bg-cream-card transition-all"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/donations/strangere-de-fonduri-pentru-construirea-bisericii"
              className="hidden md:inline-flex transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Button
                size="sm"
                className="!gap-1.5 shadow-[0_6px_18px_-6px_rgba(101,26,20,0.5)] hover:shadow-[0_10px_26px_-8px_rgba(101,26,20,0.6)]"
              >
                <Heart className="h-3.5 w-3.5 text-gold" fill="currentColor" />
                Dăruiește
              </Button>
            </Link>

            {/* Mobile hamburger */}
            <MobileMenu items={NAV} onSearch={openSearch} />
          </div>
        </div>
      </div>

      {/* Bottom gold hairline */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
    </header>
  );
}
