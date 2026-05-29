import { prisma } from '@/lib/prisma';
import { getImages } from '@/lib/images';
import { unitsFromTotal } from '@/lib/symbolic';
import { NumberTicker } from '@/components/magicui/number-ticker';

interface Props {
  campaign: string;
  goalRon: number;
}

async function fetchTotals(campaign: string) {
  try {
    const [agg, donorCount] = await Promise.all([
      prisma.donation.aggregate({
        where: { campaign, status: { in: ['completed', 'self_reported_bank'] } },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.donor.count({ where: { donations: { some: { campaign } } } }),
    ]);
    return {
      raised: agg._sum.amount || 0,
      donations: agg._count._all || 0,
      donors: donorCount,
    };
  } catch (err) {
    console.error('[ChurchProgress] DB read failed:', err);
    return { raised: 0, donations: 0, donors: 0 };
  }
}

export async function ChurchProgress({ campaign, goalRon }: Props) {
  const IMG = await getImages();
  const totals = await fetchTotals(campaign);
  const pct = Math.min(100, Math.round((totals.raised / goalRon) * 100));
  const units = unitsFromTotal(totals.raised);

  // Light rises from foundation (bottom). Always at least an 8% glow so even at 0
  // there's a faint candle-flame at the base of the building.
  const lightHeightPct = Math.max(8, pct);

  return (
    <div className="relative">
      <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gold/30 bg-burgundy-dark">
        <img
          src={IMG.churchRendering}
          alt="Biserica viitoare — Parohia Sf. Teodora de la Sihla"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Subtle dark veil so the gold light reads. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(20,8,10,0.55) 0%, rgba(20,8,10,0.25) 35%, rgba(20,8,10,0.05) 70%)',
          }}
          aria-hidden
        />

        {/* Rising golden light — radial glow at the foundation that grows upward
            with the percentage raised. */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none transition-[height] duration-1000 ease-out"
          style={{
            height: `${lightHeightPct}%`,
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(255,212,128,0.85) 0%, rgba(255,184,77,0.55) 30%, rgba(201,169,97,0.25) 60%, transparent 90%)',
            mixBlendMode: 'screen',
          }}
          aria-hidden
        />

        {/* Foundation candle-line — bright base line. */}
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            bottom: `${Math.max(0, lightHeightPct - 1)}%`,
            height: '2px',
            background:
              'linear-gradient(to right, transparent 0%, rgba(255,224,150,0.9) 20%, rgba(255,255,200,1) 50%, rgba(255,224,150,0.9) 80%, transparent 100%)',
            boxShadow: '0 0 12px 2px rgba(255,212,128,0.7)',
          }}
          aria-hidden
        />

        {/* Top-left badge with raised amount. */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-burgundy/90 backdrop-blur-sm border border-gold/40 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-white shadow-xl">
          <p className="font-ceremonial uppercase text-[10px] sm:text-[11px] tracking-[0.22em] text-gold">
            Strâns până acum
          </p>
          <p className="font-display text-2xl sm:text-3xl font-bold leading-tight mt-1">
            <NumberTicker value={totals.raised} />{' '}
            <span className="text-gold text-sm">RON</span>
          </p>
          <p className="text-[11px] sm:text-xs text-white/75 mt-0.5">
            din ținta de {goalRon.toLocaleString('ro-RO')} RON · {pct}%
          </p>
        </div>

        {/* Top-right badge: donor + brick counters */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-cream-card/90 backdrop-blur-sm border border-gold/40 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-ink shadow-xl text-right">
          <p className="font-ceremonial uppercase text-[10px] sm:text-[11px] tracking-[0.22em] text-burgundy">
            Ctitori · cărămizi
          </p>
          <p className="font-display text-2xl sm:text-3xl font-bold leading-tight mt-1 text-burgundy">
            <NumberTicker value={totals.donors} />{' '}
            <span className="text-ink-soft text-sm">·</span>{' '}
            <NumberTicker value={units.caramizi} />
          </p>
          <p className="text-[11px] sm:text-xs text-ink-soft mt-0.5">
            inimi care zidesc împreună
          </p>
        </div>

        {/* Bottom inscription */}
        <div className="absolute inset-x-0 bottom-0 pb-5 sm:pb-6 text-center pointer-events-none">
          <p className="font-display italic text-gold text-sm sm:text-base drop-shadow-lg">
            „Cei ce zidesc Biserica, zidesc cer pe pământ."
          </p>
        </div>
      </div>

      {/* Progress bar below the image */}
      <div className="mt-5">
        <div className="h-3 rounded-full overflow-hidden bg-cream-deep border border-gold/30">
          <div
            className="h-full bg-gradient-to-r from-gold via-amber-300 to-gold shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-[width] duration-1000 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-ink-soft text-center mt-2">
          {pct}% din ținta de {goalRon.toLocaleString('ro-RO')} RON ·{' '}
          <span className="text-burgundy font-medium">{totals.donations} donații</span>
        </p>
      </div>
    </div>
  );
}
