'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart } from 'lucide-react';
import { Logo } from './logo';
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
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top gold hairline */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div
        className="relative shadow-[0_4px_22px_-12px_rgba(101,26,20,0.3)]"
        style={{
          background:
            'linear-gradient(180deg, #fffdf8 0%, #fbf4e6 100%)',
        }}
      >
        {/* Faint Byzantine gold motif — subtle Orthodox texture behind the bar */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] bg-byzantine-pattern"
          aria-hidden
        />

        <div className="container relative flex h-24 sm:h-28 items-center justify-between gap-3 sm:gap-6">
          <Logo size="default" className="shrink min-w-0" />

          {/* Desktop nav — active page marked with a steady gold underline;
              hover grows the same underline from the centre. */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative font-nav uppercase text-[12.5px] font-medium tracking-[0.18em] whitespace-nowrap py-1 transition-colors',
                    active ? 'text-burgundy' : 'text-burgundy-dark/80 hover:text-burgundy',
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'pointer-events-none absolute -bottom-0.5 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-gold/60 via-gold to-gold/60 transition-all duration-300',
                      active ? 'w-full' : 'w-0 group-hover:w-full',
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Subtle gold divider between the nav and the action group */}
            <span
              className="hidden lg:block h-7 w-px bg-gradient-to-b from-transparent via-gold/45 to-transparent mr-1"
              aria-hidden
            />
            <button
              type="button"
              onClick={openSearch}
              aria-label="Caută"
              aria-keyshortcuts="Control+K"
              className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full text-burgundy ring-1 ring-gold/25 hover:ring-gold/60 hover:bg-cream-card transition-all"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Gilded CTA — richer, premium Orthodox gold button */}
            <Link
              href="/donations/strangere-de-fonduri-pentru-construirea-bisericii"
              className="hidden md:inline-flex group/cta transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span
                className="relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-ceremonial uppercase text-[12px] tracking-[0.14em] text-burgundy-dark shadow-[0_8px_22px_-8px_rgba(201,163,97,0.85)] ring-1 ring-gold-dark/40"
                style={{
                  background: 'linear-gradient(135deg, #f4dfb3 0%, #EAC784 45%, #c9a361 100%)',
                }}
              >
                <Heart className="h-3.5 w-3.5 text-burgundy" fill="currentColor" />
                Dăruiește
                {/* soft shine on hover */}
                <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-white/0 via-white/0 to-white/40 opacity-0 group-hover/cta:opacity-100 transition-opacity" />
              </span>
            </Link>

            {/* Mobile hamburger */}
            <MobileMenu items={NAV} onSearch={openSearch} />
          </div>
        </div>
      </div>

      {/* Ornamental gold divider with a central cross medallion */}
      <div className="relative h-[3px] bg-gradient-to-r from-transparent via-gold/50 to-transparent">
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-[11px] leading-none text-burgundy"
          style={{ background: 'radial-gradient(circle at 50% 40%, #f4dfb3, #EAC784 70%, #c9a361)' }}
          aria-hidden
        >
          ☩
        </span>
      </div>
    </header>
  );
}
