'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

/**
 * Mobile-only sticky donate bar for the landing page. Appears after the hero
 * and hides while the donate form (#doneaza) is on screen, so it never doubles
 * up with the real form. Scrolls to the form on tap.
 */
export function LandingStickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById('doneaza');
    let formVisible = false;
    const io = target
      ? new IntersectionObserver(
          ([e]) => {
            formVisible = e.isIntersecting;
            update();
          },
          { threshold: 0.15 },
        )
      : null;
    if (target && io) io.observe(target);

    function update() {
      setShow(window.scrollY > 560 && !formVisible);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      className={`lg:hidden fixed inset-x-3 z-40 transition-all duration-300 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
      style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))' }}
    >
      <a
        href="#doneaza"
        className="flex items-center justify-center gap-2 h-14 rounded-full font-ceremonial uppercase tracking-[0.16em] text-[13px] font-semibold text-burgundy-dark shadow-[0_12px_30px_-8px_rgba(101,26,20,0.8)] ring-1 ring-gold/70 active:scale-[0.98] transition-transform"
        style={{ background: 'linear-gradient(180deg,#EAC784 0%,#c9a361 100%)' }}
      >
        <Heart className="h-4 w-4" fill="currentColor" />
        Dăruiește — de la 29 lei
      </a>
    </div>
  );
}
