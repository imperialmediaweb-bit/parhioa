'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getPrayerForDay } from '@/lib/daily-prayers';

type Feast = {
  /** ISO MM-DD format */
  date: string;
  name: string;
  /** "great", "polyeleos", "feast" */
  rank?: 'great' | 'polyeleos' | 'feast';
};

/**
 * Major Romanian Orthodox feasts and saints' days. Static lookup for
 * "today" — for full liturgical calendar, integrate with an API later.
 */
const FEASTS: Feast[] = [
  // Praznice împărătești
  { date: '01-01', name: 'Tăierea împrejur a Domnului · Sf. Vasile cel Mare', rank: 'great' },
  { date: '01-06', name: 'Botezul Domnului — Boboteaza', rank: 'great' },
  { date: '01-07', name: 'Soborul Sfântului Ioan Botezătorul', rank: 'polyeleos' },
  { date: '01-30', name: 'Sfinții Trei Ierarhi', rank: 'polyeleos' },
  { date: '02-02', name: 'Întâmpinarea Domnului', rank: 'great' },
  { date: '03-25', name: 'Buna Vestire', rank: 'great' },
  { date: '06-24', name: 'Nașterea Sf. Ioan Botezătorul', rank: 'polyeleos' },
  { date: '06-29', name: 'Sfinții Apostoli Petru și Pavel', rank: 'great' },
  { date: '07-20', name: 'Sf. Proroc Ilie Tesviteanul', rank: 'polyeleos' },
  { date: '08-06', name: 'Schimbarea la Față a Domnului', rank: 'great' },
  { date: '08-07', name: 'Sf. Cuvioasă Teodora de la Sihla — Hramul parohiei', rank: 'great' },
  { date: '08-15', name: 'Adormirea Maicii Domnului', rank: 'great' },
  { date: '09-08', name: 'Nașterea Maicii Domnului', rank: 'great' },
  { date: '09-14', name: 'Înălțarea Sfintei Cruci', rank: 'great' },
  { date: '10-14', name: 'Sf. Cuv. Parascheva de la Iași', rank: 'polyeleos' },
  { date: '10-26', name: 'Sf. M. Mc. Dimitrie, Izvorâtorul de Mir', rank: 'polyeleos' },
  { date: '11-08', name: 'Soborul Sf. Arhangheli Mihail și Gavriil', rank: 'polyeleos' },
  { date: '11-21', name: 'Intrarea în Biserică a Maicii Domnului', rank: 'great' },
  { date: '11-30', name: 'Sf. Apostol Andrei — Ocrotitorul României', rank: 'great' },
  { date: '12-06', name: 'Sf. Ier. Nicolae, Arhiepiscopul Mirelor Lichiei', rank: 'great' },
  { date: '12-25', name: 'Nașterea Domnului — Crăciunul', rank: 'great' },
  { date: '12-26', name: 'Soborul Maicii Domnului', rank: 'polyeleos' },
  { date: '12-27', name: 'Sf. Apostol și Întâiul Mucenic Ștefan', rank: 'polyeleos' },
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

export function SarbatoareaZilei() {
  const { today, feast, upcoming, dayIndex } = useMemo(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const key = `${mm}-${dd}`;

    const todayFeast = FEASTS.find((f) => f.date === key);

    // Find next 3 feasts after today (within ~60 days)
    const todayValue = now.getMonth() * 31 + now.getDate();
    const sorted = FEASTS.map((f) => {
      const [m, d] = f.date.split('-').map(Number);
      const value = (m - 1) * 31 + d;
      const delta = value - todayValue;
      return { ...f, delta: delta < 0 ? delta + 12 * 31 : delta };
    })
      .filter((f) => f.delta > 0 && f.delta <= 60)
      .sort((a, b) => a.delta - b.delta)
      .slice(0, 3);

    return {
      today: {
        dayName: DAY_NAMES_RO[now.getDay()],
        date: `${now.getDate()} ${MONTHS_RO[now.getMonth()]}`,
      },
      feast: todayFeast,
      upcoming: sorted,
      dayIndex: now.getDay(),
    };
  }, []);

  const dailyPrayer = useMemo(() => getPrayerForDay(dayIndex), [dayIndex]);
  const [expandedPrayer, setExpandedPrayer] = useState(false);

  return (
    <div className="relative h-full">
      <div
        className="relative h-full rounded-[24px] px-6 py-7 sm:px-7 sm:py-8 shadow-[0_20px_44px_-22px_rgba(101,26,20,0.45)] overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #5a1813 0%, #3d0f0a 70%, #2a0907 100%)',
        }}
      >
        {/* Subtle damask pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='none' stroke='%23EAC784' stroke-width='0.6'><path d='M30 8 L36 18 L46 18 L38 25 L41 35 L30 28 L19 35 L22 25 L14 18 L24 18 Z'/></g></svg>\")",
          }}
        />
        {/* Gold inner border */}
        <div className="absolute inset-2 rounded-[18px] border border-gold/35 pointer-events-none" />

        <div className="relative">
          <p className="font-ceremonial uppercase text-[10px] tracking-[0.32em] text-gold/85 mb-2 flex items-center gap-2">
            <span className="h-px w-6 bg-gold/60" />
            Calendar Ortodox
            <span className="h-px flex-1 bg-gold/40" />
          </p>
          <p className="font-display text-xl sm:text-2xl text-cream leading-tight">
            {today.dayName}
            <span className="font-serif italic text-cream/65 text-base ml-2">{today.date}</span>
          </p>
        </div>

        <div className="relative my-5 flex-1">
          {feast ? (
            <div>
              <p className="font-ceremonial uppercase text-[10px] tracking-[0.28em] text-gold mb-3 flex items-center gap-2">
                <span className="text-base">☩</span>
                Sărbătoarea de astăzi
              </p>
              <p className="font-display text-lg sm:text-xl text-cream leading-snug">
                {feast.name}
              </p>
              {feast.rank === 'great' && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] font-ceremonial text-burgundy-dark bg-gold px-3 py-1 rounded-full">
                  ☩ Praznic împărătesc
                </p>
              )}
            </div>
          ) : (
            <div>
              <p className="font-ceremonial uppercase text-[10px] tracking-[0.28em] text-gold/80 mb-3 flex items-center gap-2">
                <span className="text-base">☩</span>
                {dailyPrayer.title}
              </p>
              <div className="text-cream/85 text-[14px] sm:text-[15px] leading-relaxed font-serif space-y-3">
                {(expandedPrayer
                  ? dailyPrayer.paragraphs
                  : dailyPrayer.paragraphs.slice(0, 1)
                ).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {dailyPrayer.paragraphs.length > 1 && (
                <button
                  onClick={() => setExpandedPrayer(!expandedPrayer)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/15 hover:bg-gold/25 text-gold text-[10px] uppercase tracking-[0.22em] font-ceremonial transition-colors"
                >
                  {expandedPrayer ? 'Închide' : 'Citește toată rugăciunea'}
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${expandedPrayer ? 'rotate-180' : ''}`}
                  />
                </button>
              )}
              <p className="mt-3 text-[10px] italic text-cream/45 font-serif">
                Din „Dă-i voință, ia-i putere" — Protosinghel Nicodim Măndiță
              </p>
            </div>
          )}
        </div>

        {upcoming.length > 0 && (
          <div className="relative pt-5 border-t border-gold/25">
            <p className="font-ceremonial uppercase text-[10px] tracking-[0.28em] text-gold/70 mb-3">
              Sărbători apropiate
            </p>
            <ul className="space-y-2">
              {upcoming.map((u) => {
                const [m, d] = u.date.split('-').map(Number);
                return (
                  <li key={u.date} className="flex items-baseline gap-3 text-cream/85">
                    <span className="font-mono text-[11px] text-gold w-12 flex-shrink-0">
                      {d} {MONTHS_RO[m - 1].slice(0, 3)}
                    </span>
                    <span className="text-[13px] leading-snug font-serif">{u.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
