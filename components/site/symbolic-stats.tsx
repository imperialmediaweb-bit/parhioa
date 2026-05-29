import { prisma } from '@/lib/prisma';
import { unitsFromTotal } from '@/lib/symbolic';
import { NumberTicker } from '@/components/magicui/number-ticker';

interface Props {
  campaign: string;
}

const PANELS = [
  { key: 'caramizi', icon: '🧱', label: 'cărămizi' },
  { key: 'pietre', icon: '🪨', label: 'pietre de temelie' },
  { key: 'grinzi', icon: '🪵', label: 'grinzi' },
  { key: 'vitralii', icon: '🪟', label: 'vitralii' },
  { key: 'icoane', icon: '🕯️', label: 'icoane' },
] as const;

export async function SymbolicStats({ campaign }: Props) {
  let raised = 0;
  try {
    const agg = await prisma.donation.aggregate({
      where: { campaign, status: 'completed' },
      _sum: { amount: true },
    });
    raised = agg._sum.amount || 0;
  } catch {}

  const units = unitsFromTotal(raised);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {PANELS.map((p) => (
        <div
          key={p.key}
          className="rounded-2xl border border-gold/30 bg-cream-card/60 px-4 py-5 text-center shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-1.5">{p.icon}</div>
          <div className="font-display text-2xl sm:text-3xl font-bold text-burgundy leading-none">
            <NumberTicker value={units[p.key]} />
          </div>
          <div className="text-[11px] uppercase tracking-wider font-ceremonial text-ink-soft mt-1.5">
            {p.label}
          </div>
        </div>
      ))}
    </div>
  );
}
