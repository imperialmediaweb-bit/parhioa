'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * „Biserica se ridică bucată cu bucată" — uses the REAL church rendering and
 * reveals it in full colour from the foundation up to the current REAL
 * donation progress; above the line it stays a faint blueprint until more is
 * gathered. The money sum is never shown — only the progress.
 */
const STAGES = [
  { label: 'Temelie', at: 8 },
  { label: 'Ziduri', at: 30 },
  { label: 'Acoperiș', at: 60 },
  { label: 'Turlă', at: 82 },
  { label: 'Cruce', at: 96 },
] as const;

export function ChurchRising({
  src,
  percent,
  donors = 0,
}: {
  src: string;
  percent: number;
  donors?: number;
}) {
  const pct = Math.max(2, Math.min(100, Math.round(percent)));
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-2xl">
      {/* Floating cross */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-gold text-3xl drop-shadow">☩</div>

      <div
        className="relative overflow-hidden shadow-[0_30px_60px_-30px_rgba(101,26,20,0.55)]"
        style={{
          aspectRatio: '16 / 11',
          borderTopLeftRadius: '48% 16%',
          borderTopRightRadius: '48% 16%',
          borderBottomLeftRadius: '14px',
          borderBottomRightRadius: '14px',
          border: '2px solid rgba(201,163,97,0.6)',
        }}
      >
        {/* Blueprint / "to be built" layer (faint, cool) */}
        <img
          src={src}
          alt="Macheta viitoarei biserici"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'grayscale(0.7) brightness(1.05) sepia(0.25) opacity(0.4)' }}
          loading="lazy"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(30,40,70,0.28), rgba(30,40,70,0.05))' }}
          aria-hidden
        />

        {/* Built layer — full colour, revealed from the bottom up to pct%.
            One full-size image clipped from the top; aligns with the blueprint. */}
        <motion.img
          src={src}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={inView ? { clipPath: `inset(${100 - pct}% 0 0 0)` } : {}}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Golden construction line at the current height */}
        <motion.div
          className="absolute inset-x-0 pointer-events-none"
          initial={{ bottom: '0%', opacity: 0 }}
          animate={inView ? { bottom: `${pct}%`, opacity: pct < 100 ? 1 : 0 } : {}}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: '3px',
            background:
              'linear-gradient(to right, transparent, rgba(255,224,150,0.95) 20%, #fff7d6 50%, rgba(255,224,150,0.95) 80%, transparent)',
            boxShadow: '0 0 16px 3px rgba(255,212,128,0.8)',
          }}
          aria-hidden
        />

        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 70px 8px rgba(61,15,10,0.35)' }} aria-hidden />
      </div>

      {/* progress — NO money sum */}
      <div className="mt-4">
        <div className="h-2.5 rounded-full bg-burgundy/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg,#c9a361,#EAC784,#8a2a1f)' }}
            initial={{ width: 0 }}
            animate={inView ? { width: `${pct}%` } : {}}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-display text-burgundy">
            Împreună am ridicat <strong>{pct}%</strong> din biserică
          </span>
          {donors > 0 && (
            <span className="text-ink-soft text-xs">
              {donors} {donors === 1 ? 'ctitor' : 'ctitori'}
            </span>
          )}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {STAGES.map((s) => (
            <span
              key={s.label}
              className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                pct >= s.at
                  ? 'bg-gold/20 border-gold text-burgundy'
                  : 'bg-transparent border-border text-ink-soft/60'
              }`}
            >
              {pct >= s.at ? '✓ ' : ''}
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
