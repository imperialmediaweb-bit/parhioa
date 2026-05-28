'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

export function MobileDonateCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`lg:hidden fixed inset-x-3 z-40 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
      style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))' }}
    >
      <Link
        href="/doneaza"
        className="flex items-center justify-center gap-2 h-14 rounded-full text-cream font-ceremonial uppercase tracking-[0.16em] text-[12.5px] shadow-[0_10px_30px_-8px_rgba(101,26,20,0.85)] ring-1 ring-gold/60 active:scale-[0.98] transition-transform"
        style={{
          background: 'linear-gradient(180deg, #7a201a 0%, #4f120d 100%)',
        }}
      >
        <Heart className="h-4 w-4 text-gold" fill="currentColor" />
        Sprijină lucrarea parohiei
      </Link>
    </div>
  );
}
