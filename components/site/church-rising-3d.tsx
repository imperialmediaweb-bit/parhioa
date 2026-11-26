'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useInView } from 'framer-motion';

// 3D church is client-only (WebGL) — never SSR it.
const Church3D = dynamic(() => import('./church-3d'), {
  ssr: false,
  loading: () => (
    <div className="w-full flex items-center justify-center" style={{ height: 'min(68vh, 440px)' }}>
      <div className="h-8 w-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
    </div>
  ),
});

/**
 * „Biserica se ridică" — a 3D Orthodox church that rises stage by stage. It is
 * driven by the real building progress; a minimum floor keeps it dignified
 * (never an empty platform). The money sum is never shown.
 */
const STAGES = [
  { label: 'Temelie', at: 8 },
  { label: 'Ziduri', at: 30 },
  { label: 'Acoperiș', at: 55 },
  { label: 'Turlă', at: 75 },
  { label: 'Cruce', at: 95 },
] as const;

export function ChurchRising3D({
  percent,
  donors = 0,
  floor = 18,
}: {
  percent: number;
  donors?: number;
  /** minimum shown stage (defaults to the real construction stage, ~18%) */
  floor?: number;
}) {
  const pct = Math.max(floor, Math.min(100, Math.round(percent)));
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-2xl">
      <div
        className="relative overflow-hidden rounded-[18px]"
        style={{
          border: '1px solid rgba(201,163,97,0.45)',
          background: 'linear-gradient(180deg,#fbf4e6 0%,#f5ead3 100%)',
          boxShadow: '0 30px 60px -34px rgba(101,26,20,0.5)',
        }}
      >
        <Church3D percent={pct} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: 'inset 0 0 50px 4px rgba(61,15,10,0.1)' }}
          aria-hidden
        />
      </div>

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
            Biserica e ridicată <strong>{pct}%</strong>
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
