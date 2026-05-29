import { prisma } from '@/lib/prisma';
import { getImages } from '@/lib/images';
import { OrthodoxCross } from './cross-divider';

interface Props {
  campaign: string;
  /** Internal scale for the rising-light height. Never displayed. */
  goalRon: number;
}

async function fetchInternals(campaign: string) {
  try {
    const [agg, donorCount] = await Promise.all([
      prisma.donation.aggregate({
        where: { campaign, status: { in: ['completed', 'self_reported_bank'] } },
        _sum: { amount: true },
      }),
      prisma.donor.count({ where: { donations: { some: { campaign } } } }),
    ]);
    return {
      raised: agg._sum.amount || 0,
      donors: donorCount,
    };
  } catch {
    return { raised: 0, donors: 0 };
  }
}

export async function ChurchProgress({ campaign, goalRon }: Props) {
  const IMG = await getImages();
  const { raised, donors } = await fetchInternals(campaign);

  // Internal-only: light height as a function of progress. NEVER displayed.
  const internalPct = Math.min(100, (raised / Math.max(1, goalRon)) * 100);
  const lightHeightPct = Math.max(10, internalPct);

  return (
    <div className="relative mx-auto w-full max-w-4xl pt-14">
      {/* Floating cross above the parchment */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_4px_14px_rgba(129,35,27,0.4)]">
        <OrthodoxCross height={64} />
      </div>

      {/* Parchment outer panel */}
      <div
        className="relative rounded-[32px] px-5 sm:px-7 pt-7 sm:pt-9 pb-6 shadow-[0_30px_60px_-30px_rgba(101,26,20,0.55)] overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #FBF6EE 0%, #F5EBD7 55%, #EFE0C0 100%)',
        }}
      >
        {/* Parchment grain texture */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.38 0 0 0 0 0.18 0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
          aria-hidden
        />

        {/* Gold + burgundy double border */}
        <div className="absolute inset-2 rounded-[26px] border border-gold/60 pointer-events-none" />
        <div className="absolute inset-3 rounded-[23px] border border-burgundy/25 pointer-events-none" />

        {/* Corner ornaments */}
        {(
          [
            'top-2 left-2 rotate-0',
            'top-2 right-2 rotate-90',
            'bottom-2 right-2 rotate-180',
            'bottom-2 left-2 -rotate-90',
          ] as const
        ).map((pos) => (
          <svg
            key={pos}
            viewBox="0 0 24 24"
            className={`absolute ${pos} h-5 w-5 text-gold pointer-events-none`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            aria-hidden
          >
            <path d="M2 10 V4 H10" />
            <circle cx="4" cy="4" r="0.8" fill="currentColor" />
          </svg>
        ))}

        {/* Eyebrow inscription */}
        <p className="relative font-ceremonial uppercase text-[10px] sm:text-[11px] tracking-[0.28em] text-burgundy text-center mb-3 sm:mb-4">
          ☩ Catedrala se ridică din inimi ☩
        </p>

        {/* Church image inside a Byzantine-arched window */}
        <div
          className="relative overflow-hidden bg-burgundy/5 w-full"
          style={{
            aspectRatio: '16 / 10',
            borderTopLeftRadius: '50% 14%',
            borderTopRightRadius: '50% 14%',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
          }}
        >
          <img
            src={IMG.churchRendering}
            alt="Biserica viitoare — Parohia Sf. Teodora de la Sihla"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />

          {/* Veil so the gold light reads against the building */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(20,8,10,0.55) 0%, rgba(20,8,10,0.20) 35%, rgba(20,8,10,0.04) 70%)',
            }}
            aria-hidden
          />

          {/* Rising golden light from the foundation */}
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

          {/* Foundation light-line */}
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

          {/* Inner shadow to seat the image in the frame */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 60px 6px rgba(61,15,10,0.4)' }}
            aria-hidden
          />
        </div>

        {/* Caption under the photo */}
        <div className="relative mt-5 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-gold/70" />
          <span className="text-gold text-base leading-none">☩</span>
          <p className="font-ceremonial uppercase text-[11px] sm:text-xs tracking-[0.28em] text-burgundy text-center">
            {donors > 0
              ? `${donors} ${donors === 1 ? 'ctitor pune umărul la zid' : 'ctitori pun umărul la zid'}`
              : 'fii primul ctitor al acestei biserici'}
          </p>
          <span className="text-gold text-base leading-none">☩</span>
          <span className="h-px w-10 bg-gold/70" />
        </div>

        {/* Inscription */}
        <p className="relative text-center mt-4 font-display italic text-burgundy/85 text-base sm:text-lg leading-snug">
          „Cei ce zidesc Biserica, zidesc cer pe pământ."
        </p>
      </div>
    </div>
  );
}
