import { prisma } from '@/lib/prisma';
import { symbolicLabel } from '@/lib/symbolic';

interface Props {
  campaign: string;
  limit?: number;
}

async function fetchRecent(campaign: string, limit: number) {
  try {
    return await prisma.donation.findMany({
      where: { campaign, status: { in: ['completed', 'self_reported_bank'] } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { donor: true },
    });
  } catch {
    return [];
  }
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'acum câteva clipe';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `acum ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `acum ${hours} ${hours === 1 ? 'oră' : 'ore'}`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `acum ${days} ${days === 1 ? 'zi' : 'zile'}`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `acum ${weeks} ${weeks === 1 ? 'săpt.' : 'săpt.'}`;
  return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
}

export async function CtitoriList({ campaign, limit = 24 }: Props) {
  const donations = await fetchRecent(campaign, limit);

  return (
    <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-cream-card via-cream-deep/40 to-cream-card overflow-hidden shadow-lg">
      <div className="px-5 sm:px-6 py-4 border-b border-gold/20 bg-burgundy/5 flex items-baseline justify-between">
        <div>
          <p className="font-ceremonial uppercase text-[11px] tracking-[0.22em] text-burgundy">
            Pomelnicul
          </p>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-navy mt-0.5">
            Ctitorii bisericii
          </h3>
        </div>
        <span className="text-xs text-ink-soft hidden sm:block">
          ultimii ctitori
        </span>
      </div>

      {donations.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-4xl mb-3">🕯️</p>
          <p className="text-ink-muted text-sm leading-relaxed max-w-xs mx-auto">
            Fii primul ctitor al acestei biserici. Numele tău va deschide pomelnicul.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gold/15 max-h-[480px] overflow-y-auto">
          {donations.map((d) => {
            const isAnon = !d.donor || d.donor.isPublic === false || !d.donor.name;
            const displayName = isAnon ? 'Anonim' : (d.donor!.name as string);
            const sym = symbolicLabel(d.amount);

            return (
              <li
                key={d.id}
                className="px-5 sm:px-6 py-3.5 flex items-center gap-3 hover:bg-cream-card/50 transition-colors"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-burgundy/10 border border-burgundy/20 flex items-center justify-center text-lg">
                  {isAnon ? '🕯️' : sym.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={
                      isAnon
                        ? 'font-medium text-ink-muted italic truncate'
                        : 'font-medium text-ink truncate'
                    }
                  >
                    {displayName}
                  </p>
                  <p className="text-[11px] text-ink-soft mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <span>
                      {sym.label} · {timeAgo(d.createdAt)}
                    </span>
                    {d.recurring && (
                      <span className="inline-block px-1.5 py-px rounded-full bg-burgundy/10 text-burgundy text-[9px] uppercase tracking-wider font-ceremonial">
                        lunar
                      </span>
                    )}
                    {d.status === 'self_reported_bank' && (
                      <span className="inline-block px-1.5 py-px rounded-full bg-gold/20 text-burgundy text-[9px] uppercase tracking-wider font-ceremonial">
                        transfer
                      </span>
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="px-5 sm:px-6 py-3 bg-cream-card/40 border-t border-gold/15 text-center">
        <p className="text-[11px] text-ink-soft italic">
          „Pomenește, Doamne, pe ctitorii sfântului acestui lăcaș."
        </p>
      </div>
    </div>
  );
}
