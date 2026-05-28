'use client';

import { useEffect, useRef, useState } from 'react';

interface DonationProgressProps {
  /** Goal amount in RON */
  goal: number;
  /** Amount raised so far in RON */
  raised: number;
  /** Number of unique donors */
  donors?: number;
  label?: string;
  ctaLabel?: string;
}

export function DonationProgress({
  goal,
  raised,
  donors,
  label = 'Strângere pentru zidirea bisericii',
}: DonationProgressProps) {
  const percent = Math.min(100, Math.round((raised / goal) * 100));
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [animatedRaised, setAnimatedRaised] = useState(0);
  const [animatedDonors, setAnimatedDonors] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const duration = 1500;
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = Math.min(1, (now - startTime) / duration);
            const eased = 1 - Math.pow(1 - elapsed, 3);
            setAnimatedPercent(Math.round(percent * eased));
            setAnimatedRaised(Math.round(raised * eased));
            if (donors !== undefined) setAnimatedDonors(Math.round(donors * eased));
            if (elapsed < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [percent, raised, donors]);

  // Cărămizi: 1 cărămidă = 10 RON
  const bricks = Math.floor(raised / 10);

  return (
    <div
      ref={ref}
      className="relative rounded-[24px] overflow-hidden p-6 sm:p-7 shadow-[0_20px_44px_-22px_rgba(101,26,20,0.45)]"
      style={{
        background: 'linear-gradient(180deg, #FBF6EE 0%, #F5EBD7 55%, #EFE0C0 100%)',
      }}
    >
      <div className="absolute inset-2 rounded-[18px] border border-gold/55 pointer-events-none" />
      <div className="absolute inset-3 rounded-[15px] border border-burgundy/20 pointer-events-none" />

      <div className="relative">
        <p className="font-ceremonial uppercase text-[10px] tracking-[0.28em] text-gold-dark mb-2 flex items-center gap-2">
          <span className="text-burgundy">☩</span>
          {label}
        </p>

        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-display text-3xl sm:text-4xl text-burgundy-dark">
            {animatedRaised.toLocaleString('ro-RO')}
          </span>
          <span className="font-ceremonial uppercase text-xs tracking-[0.18em] text-burgundy-dark/70">
            RON strânși
          </span>
        </div>
        <p className="text-sm text-burgundy/65 font-serif italic mb-5">
          din ținta de{' '}
          <strong className="not-italic text-burgundy-dark">
            {goal.toLocaleString('ro-RO')} RON
          </strong>
        </p>

        {/* Progress bar — golden bricks filling burgundy track */}
        <div className="relative h-5 rounded-full bg-burgundy/12 overflow-hidden ring-1 ring-burgundy/20">
          <div
            className="absolute inset-y-0 left-0 transition-[width] duration-700 ease-out rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
            style={{
              width: `${animatedPercent}%`,
              background:
                'linear-gradient(90deg, #c9a361 0%, #EAC784 50%, #f4dfb3 100%)',
            }}
          />
          {/* Brick texture overlay */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='8' viewBox='0 0 16 8'><rect width='16' height='8' fill='none'/><path d='M0 0 H16 M8 4 H16 M0 4 H8 M0 8 H16' stroke='%237a201a' stroke-width='0.4'/></svg>\")",
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-ceremonial uppercase tracking-[0.22em] text-burgundy-dark/90 mix-blend-multiply">
            {animatedPercent}% din țintă
          </span>
        </div>

        {/* Stats trio */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-gold/30">
          <Stat
            value={bricks.toLocaleString('ro-RO')}
            label="Cărămizi puse"
            symbol="🧱"
          />
          {donors !== undefined && (
            <Stat
              value={animatedDonors.toLocaleString('ro-RO')}
              label="Ctitori"
              symbol="☩"
            />
          )}
          <Stat
            value={`${Math.max(0, goal - raised).toLocaleString('ro-RO')}`}
            label="RON până la țintă"
            symbol="🛐"
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label, symbol }: { value: string; label: string; symbol: string }) {
  return (
    <div className="text-center">
      <p className="text-lg leading-none mb-1">{symbol}</p>
      <p className="font-display text-lg sm:text-xl text-burgundy-dark leading-tight">{value}</p>
      <p className="font-ceremonial uppercase text-[9px] tracking-[0.18em] text-burgundy/65 mt-1">
        {label}
      </p>
    </div>
  );
}
