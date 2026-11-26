'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useInView } from 'framer-motion';

// 3D church — client-only (Three.js/WebGL), loaded in the browser.
const Church3D = dynamic(() => import('./church-3d'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-2xl bg-gradient-to-br from-[#f6ecd8] to-[#efe0c0] animate-pulse"
      style={{ height: 'min(70vh, 460px)' }}
    />
  ),
});

const STAGES = [
  { label: 'Temelie', at: 4 },
  { label: 'Ziduri', at: 18 },
  { label: 'Acoperiș', at: 50 },
  { label: 'Turlă', at: 66 },
  { label: 'Cupolă', at: 82 },
  { label: 'Cruce', at: 95 },
] as const;

export function ChurchRising({
  percent,
  donors = 0,
}: {
  percent: number;
  donors?: number;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(percent)));
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-2xl">
      <div
        className="relative overflow-hidden rounded-3xl border-2 border-gold/50 shadow-[0_30px_60px_-30px_rgba(101,26,20,0.5)]"
      >
        <Church3D percent={pct} />
        <p className="absolute top-3 left-1/2 -translate-x-1/2 font-ceremonial uppercase text-[10px] tracking-[0.28em] text-burgundy/80 pointer-events-none">
          ☩ machetă 3D · rotește cu degetul ☩
        </p>
      </div>

      {/* progress — NO money sum, only progress */}
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
