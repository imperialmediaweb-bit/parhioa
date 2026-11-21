'use client';

import { useEffect, useRef, useState } from 'react';

const LINKS = [
  { href: '#parohul', short: 'Parohul', full: 'Parohul bisericii' },
  { href: '#despre-parohia', short: 'Despre parohie', full: 'Despre parohie' },
  { href: '#daruieste', short: 'Dăruiește', full: 'Dăruiește pentru zidire' },
];

/**
 * Homepage quick-jump bar. Sticky just under the (shrunk) header, but it
 * auto-hides while scrolling down and reappears on scroll up, so the fixed
 * chrome stays slim.
 */
export function HomeSubNav() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;
      // Only hide once we're well past the top, and keep a small deadzone.
      if (Math.abs(y - lastY.current) > 6) {
        setHidden(goingDown && y > 320);
        lastY.current = y;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`border-y border-gold/30 bg-cream/90 backdrop-blur sticky top-16 sm:top-[72px] lg:top-[76px] z-30 transition-transform duration-300 ease-out ${
        hidden ? '-translate-y-[130%]' : 'translate-y-0'
      }`}
      aria-label="Navigare rapidă pagina principală"
    >
      <div className="container flex items-center justify-start sm:justify-center gap-5 sm:gap-8 lg:gap-12 py-2.5 sm:py-3 overflow-x-auto scrollbar-none">
        {LINKS.map((l) => (
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
      </div>
    </nav>
  );
}
