'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { OrthodoxCross } from './cross-divider';
import { getPrayerForDay } from '@/lib/daily-prayers';

export function RugaciuneaZilei() {
  const prayer = useMemo(() => getPrayerForDay(new Date().getDay()), []);
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? prayer.paragraphs : prayer.paragraphs.slice(0, 1);

  return (
    <div className="relative pt-12">
      {/* Floating cross above */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_4px_14px_rgba(129,35,27,0.4)]">
        <OrthodoxCross height={56} />
      </div>

      <div
        className="relative rounded-[28px] px-6 pt-9 pb-7 sm:px-9 sm:pt-11 sm:pb-9 shadow-[0_30px_60px_-30px_rgba(101,26,20,0.55)] overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #FBF6EE 0%, #F5EBD7 55%, #EFE0C0 100%)',
        }}
      >
        {/* Parchment grain */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.38 0 0 0 0 0.18 0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
        <div className="absolute inset-2 rounded-[22px] border border-gold/60 pointer-events-none" />
        <div className="absolute inset-3 rounded-[19px] border border-burgundy/25 pointer-events-none" />

        {/* Header */}
        <div className="relative text-center mb-5">
          <p className="font-ceremonial uppercase text-[11px] tracking-[0.32em] text-gold-dark mb-2 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/70" />
            Rugăciunea zilei
            <span className="h-px w-8 bg-gold/70" />
          </p>
          <h3 className="font-display text-2xl sm:text-3xl text-burgundy-dark italic">
            {prayer.title}
          </h3>
        </div>

        {/* Drop-cap first letter */}
        <div className="relative">
          {visible.map((p, i) => (
            <p
              key={i}
              className="font-serif text-[15px] sm:text-[16px] leading-[1.85] text-burgundy-dark/90 mb-4 last:mb-0"
            >
              {p}
            </p>
          ))}

          {/* Fade-out gradient when collapsed */}
          {!expanded && prayer.paragraphs.length > 1 && (
            <div
              className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, transparent 0%, #F5EBD7 100%)',
              }}
            />
          )}
        </div>

        {/* Expand / collapse button */}
        {prayer.paragraphs.length > 1 && (
          <div className="relative text-center mt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-burgundy/30 bg-white/60 hover:bg-burgundy hover:text-cream hover:border-burgundy text-burgundy text-xs font-ceremonial uppercase tracking-[0.2em] transition-colors"
            >
              {expanded ? 'Închide rugăciunea' : 'Citește toată rugăciunea'}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        )}

        {/* Footer attribution */}
        <p className="relative text-center mt-5 text-[10px] sm:text-[11px] font-serif italic text-burgundy/55">
          Din „Dă-i voință, ia-i putere" — Protosinghel Nicodim Măndiță
        </p>
      </div>
    </div>
  );
}
