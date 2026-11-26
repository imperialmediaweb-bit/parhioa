'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * „Biserica se ridică" — the REAL church rendering (photo), shown clearly, with
 * the donation progress below (bar + stages). The money sum is never shown.
 */
const STAGES = [
  { label: 'Temelie', at: 8 },
  { label: 'Ziduri', at: 30 },
  { label: 'Acoperiș', at: 55 },
  { label: 'Turlă', at: 75 },
  { label: 'Cruce', at: 95 },
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
  const pct = Math.max(0, Math.min(100, Math.round(percent)));
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-2xl">
      {/* Cross above */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-gold text-3xl drop-shadow">☩</div>

      {/* The real rendering — clear, full colour, framed */}
      <div
        className="relative overflow-hidden shadow-[0_30px_60px_-30px_rgba(101,26,20,0.5)]"
        style={{
          aspectRatio: '16 / 10',
          borderTopLeftRadius: '46% 16%',
          borderTopRightRadius: '46% 16%',
          borderBottomLeftRadius: '14px',
          borderBottomRightRadius: '14px',
          border: '2px solid rgba(201,163,97,0.6)',
        }}
      >
        <img
          src={src}
          alt="Macheta viitoarei biserici — Parohia Sf. Teodora de la Sihla"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        {/* subtle warm glow rising from the foundation to the current progress */}
        <motion.div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          initial={{ height: '0%' }}
          animate={inView ? { height: `${Math.max(6, pct)}%` } : {}}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background:
              'linear-gradient(to top, rgba(255,205,110,0.5), rgba(255,205,110,0.12) 60%, transparent)',
            mixBlendMode: 'screen',
          }}
          aria-hidden
        />
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px 6px rgba(61,15,10,0.28)' }} aria-hidden />
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
