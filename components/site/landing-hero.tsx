'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { ShimmerButton } from '@/components/magicui/shimmer-button';

/**
 * Premium landing hero for the church-building campaign. The real architectural
 * rendering sits behind a warm burgundy veil, with a subtle scroll parallax,
 * a strong headline, two CTAs and real stat tickers. No money sum is shown.
 */
export function LandingHero({
  src,
  donors,
  percent,
}: {
  src: string;
  donors: number;
  percent: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yImg = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '14%']);
  const scaleImg = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);

  const pct = Math.max(0, Math.min(100, Math.round(percent)));

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Background rendering with parallax */}
      <motion.div className="absolute inset-0 -z-10" style={{ y: yImg, scale: scaleImg }}>
        <img src={src} alt="Viitoarea biserică — Parohia Sf. Teodora de la Sihla" className="h-full w-full object-cover" />
      </motion.div>
      {/* Warm veil for legibility — darker, centre-weighted behind the text */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 42%, rgba(26,7,5,0.34) 0%, rgba(26,7,5,0.74) 100%), linear-gradient(180deg, rgba(26,7,5,0.6) 0%, rgba(26,7,5,0.34) 38%, rgba(44,10,7,0.82) 100%)',
        }}
        aria-hidden
      />

      <div className="container relative flex min-h-[86vh] flex-col items-center justify-center py-20 text-center text-cream">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-ceremonial uppercase tracking-[0.3em] text-[11px] sm:text-sm text-gold"
        >
          ☩ Parohia Sf. Cuvioasă Teodora de la Sihla · Botoșani ☩
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-cream text-4xl sm:text-6xl md:text-7xl leading-[1.05] mt-4 max-w-4xl [text-shadow:0_2px_4px_rgba(20,5,3,0.7),0_6px_30px_rgba(20,5,3,0.65)]"
        >
          Să ridicăm împreună<br />
          <em className="italic text-gold [text-shadow:0_2px_4px_rgba(20,5,3,0.7),0_6px_30px_rgba(20,5,3,0.6)]">o biserică</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-5 max-w-2xl text-base sm:text-lg text-cream/90 leading-relaxed"
        >
          Fiecare cărămidă pusă azi rămâne rugăciunea ta înaintea lui Dumnezeu. Dăruiește de la{' '}
          <strong className="text-gold">10 cărămizi (29 lei)</strong> și fii ctitor al primei biserici a parohiei.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3"
        >
          <a href="#doneaza">
            <ShimmerButton
              background="linear-gradient(135deg, #EAC784 0%, #c9a361 100%)"
              shimmerColor="#fff7e6"
              className="!text-burgundy-dark font-ceremonial uppercase tracking-[0.18em] text-sm px-8 py-4 font-semibold shadow-xl"
            >
              Pune o cărămidă
            </ShimmerButton>
          </a>
          <a
            href="#biserica-3d"
            className="rounded-full border border-cream/40 px-7 py-4 text-sm font-ceremonial uppercase tracking-[0.18em] text-cream hover:bg-cream hover:text-burgundy transition-colors"
          >
            Vezi cum se ridică
          </a>
        </motion.div>

        {/* Stat tickers (real figures) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-12 grid grid-cols-3 gap-4 sm:gap-10 border-t border-cream/20 pt-6"
        >
          <Stat value={100000} label="cărămizi de pus" />
          <Stat value={donors} label={donors === 1 ? 'ctitor' : 'ctitori'} />
          <Stat value={pct} label="din biserică ridicat" suffix="%" />
        </motion.div>
      </div>

      {/* bottom fade into the page */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cream to-transparent" aria-hidden />
    </section>
  );
}

function Stat({ value, label, suffix }: { value: number; label: string; suffix?: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-2xl sm:text-4xl text-gold drop-shadow">
        <NumberTicker value={value} className="text-gold" />
        {suffix}
      </div>
      <div className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-cream/75 mt-1">{label}</div>
    </div>
  );
}
