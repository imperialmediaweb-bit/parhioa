'use client';

import { useEffect, useRef, useState } from 'react';

export type ConstructionStage = {
  /** Internal key (snake_case) */
  key: string;
  /** Romanian label shown to the user */
  label: string;
  /** Single sentence describing this phase */
  description?: string;
  /** Emoji or symbol shown above the label */
  symbol?: string;
  /** "done" | "active" | "upcoming" */
  status: 'done' | 'active' | 'upcoming';
  /** 0–100, only used when status === "active" */
  percent?: number;
  /** Relative weight of this stage in the overall progress (defaults to 1) */
  weight?: number;
};

const STAGES: ConstructionStage[] = [
  {
    key: 'binecuvantare',
    label: 'Binecuvântare și sfințire teren',
    description: 'Locul a fost sfințit și pus sub ocrotirea Cuvioasei Teodora.',
    symbol: '☩',
    status: 'done',
    weight: 1,
  },
  {
    key: 'cruce_temelie',
    label: 'Așezarea Sfintei Cruci',
    description: 'Crucea de temelie a fost ridicată și binecuvântată.',
    symbol: '✛',
    status: 'done',
    weight: 1,
  },
  {
    key: 'fundatie',
    label: 'Fundația și temelia',
    description: 'Pregătirea terenului și turnarea fundației — urmează după strângerea de fonduri.',
    symbol: '🪨',
    status: 'upcoming',
    weight: 4,
  },
  {
    key: 'ziduri',
    label: 'Zidurile și pereții',
    description: 'Ridicarea pereților bisericii — cărămidă cu cărămidă.',
    symbol: '🧱',
    status: 'upcoming',
    weight: 6,
  },
  {
    key: 'acoperis',
    label: 'Acoperișul și turlele',
    description: 'Șarpanta, acoperișul și înălțarea turlelor.',
    symbol: '🏛️',
    status: 'upcoming',
    weight: 4,
  },
  {
    key: 'iconostas',
    label: 'Iconostas și pictură',
    description: 'Catapeteasma, icoanele și pictura bisericească.',
    symbol: '🖼️',
    status: 'upcoming',
    weight: 3,
  },
  {
    key: 'sfintire',
    label: 'Sfințirea bisericii',
    description: 'Slujba de sfințire și prima Sfântă Liturghie.',
    symbol: '🕯️',
    status: 'upcoming',
    weight: 1,
  },
];

export function ConstructionProgress({
  label = 'Stadiul zidirii bisericii',
}: {
  label?: string;
}) {
  const total = STAGES.length;
  const doneCount = STAGES.filter((s) => s.status === 'done').length;
  const activeStage = STAGES.find((s) => s.status === 'active');
  const totalWeight = STAGES.reduce((sum, s) => sum + (s.weight ?? 1), 0);
  const doneWeight =
    STAGES.filter((s) => s.status === 'done').reduce((sum, s) => sum + (s.weight ?? 1), 0) +
    (activeStage ? ((activeStage.percent ?? 0) / 100) * (activeStage.weight ?? 1) : 0);
  const overall = Math.round((doneWeight / totalWeight) * 100);

  const [animOverall, setAnimOverall] = useState(0);
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
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setAnimOverall(Math.round(overall * eased));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [overall]);

  return (
    <div
      ref={ref}
      className="relative rounded-[24px] overflow-hidden p-6 sm:p-7 shadow-[0_20px_44px_-22px_rgba(101,26,20,0.45)]"
      style={{
        background: 'linear-gradient(180deg, #FBF6EE 0%, #F5EBD7 55%, #EFE0C0 100%)',
      }}
    >
      {/* Parchment grain */}
      <div
        className="absolute inset-0 opacity-25 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.38 0 0 0 0 0.18 0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      <div className="absolute inset-2 rounded-[18px] border border-gold/55 pointer-events-none" />
      <div className="absolute inset-3 rounded-[15px] border border-burgundy/20 pointer-events-none" />

      <div className="relative">
        <p className="font-ceremonial uppercase text-[10px] tracking-[0.28em] text-gold-dark mb-2 flex items-center gap-2">
          <span className="text-burgundy">☩</span>
          {label}
        </p>

        <div className="flex items-baseline justify-between gap-3 mb-4">
          <p className="font-display text-2xl sm:text-3xl text-burgundy-dark leading-tight">
            <span className="text-gold-dark">{doneCount}</span>{' '}
            <span className="text-burgundy/60 text-xl">/ {total}</span>{' '}
            <span className="font-serif italic text-burgundy/70 text-lg">etape</span>
          </p>
          <p className="font-ceremonial uppercase text-xs tracking-[0.18em] text-burgundy-dark/75">
            {animOverall}% parcurs
          </p>
        </div>

        {/* Overall thin progress bar */}
        <div className="relative h-1.5 rounded-full bg-burgundy/12 overflow-hidden mb-5">
          <div
            className="absolute inset-y-0 left-0 transition-[width] duration-700 ease-out rounded-full"
            style={{
              width: `${animOverall}%`,
              background: 'linear-gradient(90deg, #c9a361 0%, #EAC784 50%, #f4dfb3 100%)',
            }}
          />
        </div>

        {/* Stages list */}
        <ol className="relative space-y-1">
          {/* Vertical track */}
          <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gold/35" aria-hidden />

          {STAGES.map((stage, idx) => {
            const firstUpcomingIdx = STAGES.findIndex((s) => s.status === 'upcoming');
            const isNext = idx === firstUpcomingIdx && !activeStage;
            return (
            <li key={stage.key} className="relative flex items-start gap-4 py-2">
              <span
                className={`relative z-10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-ceremonial transition-all ${
                  stage.status === 'done'
                    ? 'text-cream shadow-[0_4px_10px_-2px_rgba(101,26,20,0.5)]'
                    : stage.status === 'active'
                      ? 'text-burgundy-dark ring-2 ring-gold/80 shadow-[0_0_18px_-2px_rgba(234,199,132,0.7)]'
                      : 'bg-burgundy/15 text-burgundy ring-1 ring-burgundy/25'
                }`}
                style={
                  stage.status === 'done'
                    ? { background: 'linear-gradient(180deg, #7a201a 0%, #4f120d 100%)' }
                    : stage.status === 'active'
                      ? {
                          background:
                            'radial-gradient(circle at 30% 30%, #FBF6EE, #EAC784 70%, #c9a361)',
                        }
                      : undefined
                }
              >
                {stage.status === 'done' ? (
                  <CheckIcon />
                ) : (
                  <span aria-hidden>{stage.symbol}</span>
                )}
              </span>
              <div className="flex-1 min-w-0 pt-1">
                <p
                  className={`font-display text-[15px] leading-tight ${
                    stage.status === 'upcoming' ? 'text-burgundy-dark/85' : 'text-burgundy-dark'
                  }`}
                >
                  {stage.label}
                  {stage.status === 'active' && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.22em] font-ceremonial text-burgundy-dark bg-gold/70 px-2 py-0.5 rounded-full align-middle">
                      În lucru
                    </span>
                  )}
                  {isNext && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.22em] font-ceremonial text-burgundy-dark bg-gold/70 px-2 py-0.5 rounded-full align-middle">
                      Următoarea
                    </span>
                  )}
                </p>
                {stage.description && (
                  <p
                    className={`text-[13px] mt-0.5 font-serif italic ${
                      stage.status === 'upcoming' ? 'text-burgundy/65' : 'text-burgundy/75'
                    }`}
                  >
                    {stage.description}
                  </p>
                )}
                {stage.status === 'active' && stage.percent !== undefined && (
                  <div className="mt-2 relative h-1 rounded-full bg-burgundy/10 overflow-hidden max-w-[260px]">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: `${stage.percent}%`,
                        background:
                          'linear-gradient(90deg, #c9a361 0%, #EAC784 50%, #f4dfb3 100%)',
                      }}
                    />
                  </div>
                )}
              </div>
            </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
