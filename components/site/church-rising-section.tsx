import { prisma } from '@/lib/prisma';
import { getImages } from '@/lib/images';
import { ChurchRising } from './church-rising';

const CAMPAIGN = 'strangere-de-fonduri-pentru-construirea-bisericii';
const GOAL_RON = 1_500_000;

async function fetchProgress() {
  try {
    const [agg, donors] = await Promise.all([
      prisma.donation.aggregate({
        where: { campaign: CAMPAIGN, status: { in: ['completed', 'self_reported_bank'] } },
        _sum: { amount: true },
      }),
      prisma.donor.count({ where: { donations: { some: { campaign: CAMPAIGN } } } }),
    ]);
    return { raised: agg._sum.amount || 0, donors };
  } catch {
    return { raised: 0, donors: 0 };
  }
}

/**
 * Homepage section: the real church rendering rising with REAL donation
 * progress (no money sum shown). Updates right after a donation (the donation
 * handlers revalidate '/').
 */
export async function ChurchRisingSection() {
  const IMG = await getImages();
  const { raised, donors } = await fetchProgress();
  const percent = Math.min(100, (raised / GOAL_RON) * 100);

  return (
    <section className="container py-12 sm:py-16">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <p className="font-ceremonial uppercase text-[11px] tracking-[0.28em] text-gold-dark">
          Împreună zidim
        </p>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-burgundy mt-2">
          Biserica se ridică, bucată cu bucată
        </h2>
        <p className="text-ink-soft text-sm mt-2">
          Cu fiecare dar, se ridică mai mult din casa Domnului. Așa am ajuns până acum:
        </p>
      </div>
      <ChurchRising src={IMG.churchRendering} percent={percent} donors={donors} />
    </section>
  );
}
