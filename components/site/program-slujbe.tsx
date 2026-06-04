'use client';

import { useMemo } from 'react';
import { OrthodoxCross } from './cross-divider';

type Service = { time: string; name: string };

const WEEK: { day: string; services: Service[] }[] = [
  { day: 'Luni', services: [] },
  { day: 'Marți', services: [] },
  { day: 'Miercuri', services: [{ time: '17:00', name: 'Acatist' }] },
  { day: 'Joi', services: [] },
  { day: 'Vineri', services: [{ time: '17:00', name: 'Vecernia' }] },
  {
    day: 'Sâmbătă',
    services: [
      { time: '08:00', name: 'Utrenia' },
      { time: '09:30', name: 'Sf. Liturghie' },
      { time: '17:00', name: 'Vecernia' },
    ],
  },
  {
    day: 'Duminică',
    services: [
      { time: '08:00', name: 'Utrenia' },
      { time: '09:30', name: 'Sfânta Liturghie' },
    ],
  },
];

const DAY_NAMES_RO = [
  'Duminică',
  'Luni',
  'Marți',
  'Miercuri',
  'Joi',
  'Vineri',
  'Sâmbătă',
];

const MONTHS_RO = [
  'ianuarie',
  'februarie',
  'martie',
  'aprilie',
  'mai',
  'iunie',
  'iulie',
  'august',
  'septembrie',
  'octombrie',
  'noiembrie',
  'decembrie',
];

export function ProgramSlujbe() {
  const todayLabel = useMemo(() => {
    const d = new Date();
    return {
      dayName: DAY_NAMES_RO[d.getDay()],
      date: `${d.getDate()} ${MONTHS_RO[d.getMonth()]} ${d.getFullYear()}`,
    };
  }, []);

  return (
    <div className="relative h-full pt-12">
      {/* Floating cross above */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_4px_14px_rgba(129,35,27,0.4)]">
        <OrthodoxCross height={60} />
      </div>

      <div
        className="relative h-full rounded-[28px] px-6 pt-10 pb-8 sm:px-8 sm:pt-12 sm:pb-10 shadow-[0_30px_60px_-30px_rgba(101,26,20,0.55)] overflow-hidden flex flex-col"
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

        <div className="relative text-center mb-6">
          <p className="font-ceremonial uppercase text-[11px] tracking-[0.32em] text-gold-dark mb-2 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/70" />
            Astăzi
            <span className="h-px w-8 bg-gold/70" />
          </p>
          <h3 className="font-display text-2xl sm:text-3xl text-burgundy-dark">
            {todayLabel.dayName}
          </h3>
          <p className="font-serif italic text-sm text-burgundy/70 mt-1">{todayLabel.date}</p>
        </div>

        <div className="relative grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-7 gap-1.5">
          {WEEK.map((d) => {
            const isToday = d.day === todayLabel.dayName;
            return (
              <div
                key={d.day}
                className={`rounded-xl px-2 py-2.5 sm:px-3 sm:py-3 transition-all ${
                  isToday
                    ? 'bg-gradient-to-b from-burgundy to-burgundy-dark text-cream ring-1 ring-gold/60 shadow-[0_8px_22px_-10px_rgba(101,26,20,0.65)]'
                    : 'bg-white/40 text-burgundy-dark/80 ring-1 ring-burgundy/10'
                }`}
              >
                <p
                  className={`font-ceremonial uppercase text-[10px] tracking-[0.16em] mb-1.5 sm:mb-2 text-center ${
                    isToday ? 'text-gold' : 'text-burgundy/70'
                  }`}
                >
                  {d.day.slice(0, 3)}
                </p>
                <div className="space-y-1 sm:space-y-1.5">
                  {d.services.length === 0 ? (
                    <p
                      className={`text-[11px] italic text-center ${
                        isToday ? 'text-cream/70' : 'text-burgundy/40'
                      }`}
                    >
                      —
                    </p>
                  ) : (
                    d.services.map((s) => (
                      <div key={s.name + s.time} className="text-center leading-tight">
                        <p
                          className={`font-mono text-[10px] sm:text-[11px] font-semibold ${
                            isToday ? 'text-gold' : 'text-burgundy'
                          }`}
                        >
                          {s.time}
                        </p>
                        <p
                          className={`text-[9px] sm:text-[11px] leading-snug ${
                            isToday ? 'text-cream' : 'text-burgundy-dark/80'
                          }`}
                        >
                          {s.name}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="relative text-center mt-6 text-xs font-serif italic text-burgundy/60">
          La sărbători mari, programul poate fi modificat. Vezi pagina{' '}
          <a href="/contact" className="underline hover:text-burgundy">
            de contact
          </a>{' '}
          pentru detalii.
        </p>
      </div>
    </div>
  );
}
