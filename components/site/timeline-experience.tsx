'use client';

import { Fragment, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { OrthodoxCross } from './cross-divider';
import { opt } from '@/lib/img';

export type Milestone = {
  date: string;
  dateLabel: string;
  eyebrow: string;
  title: string;
  body: string;
  symbol?: string;
  image?: string;
  imageAlt?: string;
  /** Optional video (click-to-play) shown in the card instead of the photo. */
  video?: string;
  videoPoster?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Click-to-play video with a poster and a golden play button. */
function TimelineVideo({
  src,
  poster,
  label,
  aspect = 'aspect-[16/10]',
}: {
  src: string;
  poster: string;
  label: string;
  aspect?: string;
}) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <video
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        className={`w-full ${aspect} bg-black object-cover`}
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Redă: ${label}`}
      className={`group/vid relative block w-full ${aspect} overflow-hidden`}
    >
      <img
        src={poster}
        alt={label}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/vid:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="relative flex items-center justify-center">
          <span className="absolute h-16 w-16 rounded-full bg-gold/25 animate-ping" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark text-burgundy-dark shadow-[0_8px_22px_-6px_rgba(234,199,132,0.8)] transition-transform duration-300 group-hover/vid:scale-110">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </span>
      <span className="absolute bottom-2.5 left-3 right-3 font-ceremonial uppercase text-[10px] tracking-[0.2em] text-cream/95 flex items-center gap-1.5">
        <span className="text-gold">☩</span> Vezi filmul
      </span>
    </button>
  );
}

/**
 * Premium, scroll-driven church-building timeline. Brand motion idea: the
 * church rises as you scroll — a golden line fills from top to bottom, cross
 * medallions ignite like candles at each stage, parchment cards wipe in from
 * the side and photos reveal with a soft parallax. Text is always in the DOM
 * (SSR) for SEO, and everything collapses to a calm, motion-free layout under
 * prefers-reduced-motion.
 */
export function TimelineExperience({ milestones }: { milestones: Milestone[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Progress of the golden line is tied to how far the timeline has scrolled.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 0.75', 'end 0.55'],
  });
  const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={trackRef} className="relative max-w-5xl mx-auto">
      {/* Static track */}
      <div
        className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 top-3 bottom-3 w-[2px] rounded-full bg-burgundy/12"
        aria-hidden
      />
      {/* Golden fill that grows with scroll */}
      <motion.div
        className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 top-3 bottom-3 w-[2px] rounded-full origin-top"
        style={{
          scaleY: reduce ? 1 : fillScale,
          background:
            'linear-gradient(180deg, #EAC784 0%, #c9a361 50%, #EAC784 100%)',
          boxShadow: '0 0 12px rgba(234,199,132,0.65)',
        }}
        aria-hidden
      />

      <ol className="relative space-y-12 sm:space-y-20">
        {milestones.map((m, i) => (
          <TimelineItem key={m.date + m.title} m={m} index={i} reduce={!!reduce} />
        ))}
      </ol>

      {/* Closing flourish — how the finished church will look */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative flex flex-col items-center mt-20"
      >
        <OrthodoxCross height={56} />
        <p className="mt-4 font-ceremonial uppercase text-[10px] tracking-[0.32em] text-gold-dark">
          Așa va arăta biserica — proiectul 3D
        </p>
        <motion.figure
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease: EASE }}
          className="mt-5 w-full max-w-2xl overflow-hidden rounded-[18px] ring-1 ring-gold/45 shadow-[0_26px_60px_-30px_rgba(101,26,20,0.6)]"
        >
          <TimelineVideo
            src="/santier/reel-proiect.mp4"
            poster="/santier/poster.jpg"
            label="Proiectul 3D al viitoarei biserici"
            aspect="aspect-video"
          />
        </motion.figure>
        <p className="mt-6 font-ceremonial uppercase text-[10px] tracking-[0.32em] text-gold-dark">
          Drumul continuă
        </p>
        <p className="mt-2 font-serif italic text-burgundy/65 text-center max-w-sm">
          „Cu rugăciune și răbdare zidim biserica nu doar din piatră, ci și din inimi."
        </p>
      </motion.div>
    </div>
  );
}

function TimelineItem({
  m,
  index,
  reduce,
}: {
  m: Milestone;
  index: number;
  reduce: boolean;
}) {
  const onRight = index % 2 === 1;
  const itemRef = useRef<HTMLLIElement>(null);

  // Gentle parallax for the photo as the card scrolls through the viewport.
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [16, -16]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  };

  const words = m.title.split(' ');

  return (
    <li ref={itemRef} className="relative">
      {/* Cross medallion — ignites like a candle when it enters */}
      <motion.div
        className="absolute left-6 sm:left-1/2 -translate-x-1/2 top-3 z-10"
        initial={{ scale: reduce ? 1 : 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-90px' }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      >
        <div
          className="relative flex h-12 w-12 items-center justify-center rounded-full text-cream ring-2 ring-gold/70"
          style={{ background: 'linear-gradient(180deg, #7a201a 0%, #4f120d 100%)' }}
        >
          <motion.span
            className="absolute inset-0 rounded-full -z-10 bg-gold/40 blur-md"
            animate={reduce ? undefined : { opacity: [0.25, 0.7, 0.25], scale: [1, 1.25, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          />
          <span className="text-base leading-none">{m.symbol ?? '☩'}</span>
        </div>
      </motion.div>

      <div className="ml-20 sm:ml-0 sm:grid sm:grid-cols-2 sm:gap-12 items-center">
        {/* CARD */}
        <motion.article
          initial={{ opacity: 0, x: reduce ? 0 : onRight ? 48 : -48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          whileHover={reduce ? undefined : { y: -5 }}
          className={`group relative rounded-[20px] p-6 sm:p-7 overflow-hidden transition-shadow duration-300 shadow-[0_22px_46px_-26px_rgba(101,26,20,0.5)] hover:shadow-[0_30px_60px_-24px_rgba(101,26,20,0.6)] ${
            onRight ? 'sm:order-2 sm:col-start-2' : 'sm:order-1 sm:col-start-1'
          }`}
          style={{
            background: 'linear-gradient(180deg, #FBF6EE 0%, #F5EBD7 55%, #EFE0C0 100%)',
          }}
        >
          {/* parchment grain */}
          <div
            className="absolute inset-0 opacity-25 mix-blend-multiply pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.38 0 0 0 0 0.18 0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            }}
          />
          <div className="absolute inset-2 rounded-[14px] border border-gold/55 pointer-events-none transition-colors duration-300 group-hover:border-gold/80" />
          <div className="absolute inset-3 rounded-[11px] border border-burgundy/20 pointer-events-none" />

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-70px' }}
            className="relative"
          >
            <motion.p
              variants={rise}
              className="font-ceremonial uppercase text-[10px] tracking-[0.28em] text-gold-dark mb-2 flex items-center gap-2"
            >
              <span className="text-burgundy">☩</span>
              {m.eyebrow}
            </motion.p>

            {/* Title revealed word by word (real spaces kept for SEO/a11y) */}
            <h3 className="font-display text-xl sm:text-2xl text-burgundy-dark leading-tight mb-3">
              {words.map((w, wi) => (
                <Fragment key={wi}>
                  <motion.span variants={rise} className="inline-block">
                    {w}
                  </motion.span>
                  {wi < words.length - 1 ? ' ' : ''}
                </Fragment>
              ))}
            </h3>

            <motion.p
              variants={rise}
              className="text-[15px] text-burgundy/80 leading-relaxed font-serif"
            >
              {m.body}
            </motion.p>

            {m.video ? (
              <motion.div
                variants={rise}
                className="mt-4 overflow-hidden rounded-[12px] ring-1 ring-gold/40 shadow-[0_14px_30px_-18px_rgba(101,26,20,0.6)]"
              >
                <TimelineVideo
                  src={m.video}
                  poster={opt(m.videoPoster ?? m.image ?? '')}
                  label={m.title}
                />
              </motion.div>
            ) : m.image ? (
              <motion.div
                variants={rise}
                className="mt-4 overflow-hidden rounded-[12px] ring-1 ring-gold/40 shadow-[0_14px_30px_-18px_rgba(101,26,20,0.6)]"
              >
                <motion.div style={{ y: imgY }} className="will-change-transform">
                  <img
                    src={opt(m.image)}
                    alt={m.imageAlt ?? m.title}
                    loading="lazy"
                    className="w-full aspect-[16/10] object-cover scale-125 transition-transform duration-700 ease-out group-hover:scale-[1.32]"
                  />
                </motion.div>
              </motion.div>
            ) : null}

            {/* Mobile date inside card */}
            <p className="sm:hidden mt-4 pt-3 border-t border-gold/30 font-ceremonial uppercase text-[10px] tracking-[0.22em] text-burgundy-dark flex items-center gap-2">
              <span className="text-gold">☩</span>
              {m.date} · {m.dateLabel}
            </p>
          </motion.div>
        </motion.article>

        {/* DATE COLUMN (desktop) */}
        <motion.div
          initial={{ opacity: 0, x: reduce ? 0 : onRight ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className={`hidden sm:block ${
            onRight
              ? 'sm:order-1 sm:col-start-1 sm:text-right'
              : 'sm:order-2 sm:col-start-2 sm:text-left'
          }`}
        >
          <p className="font-display text-2xl lg:text-4xl text-burgundy-dark leading-tight">
            {m.date}
          </p>
          <p className="font-serif italic text-burgundy/70 mt-1">{m.dateLabel}</p>
        </motion.div>
      </div>
    </li>
  );
}
