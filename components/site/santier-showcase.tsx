'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Render = { src: string; alt: string; caption: string };

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Promotional "șantier" showcase — a cinematic band presenting the first
 * on-site footage of the church being built, with the architectural
 * renderings ("așa va arăta") and a donation call-to-action. Self-hosted
 * video (public/santier) with a click-to-play poster so nothing downloads
 * until the visitor asks for it.
 */
export function SantierShowcase({
  videoSrc = '/santier/santier-biserica.mp4',
  poster = '/santier/poster.jpg',
  donateHref = '/donations/strangere-de-fonduri-pentru-construirea-bisericii',
  renders = [
    {
      src: 'https://pub-49f4280024fa4ca2b8a4f6323442efe8.r2.dev/parhioa/wp-28263.jpg',
      alt: 'Randare — așa va arăta biserica parohiei',
      caption: 'Proiectul viitoarei biserici',
    },
    {
      src: 'https://pub-49f4280024fa4ca2b8a4f6323442efe8.r2.dev/parhioa/wp-28264.png',
      alt: 'Randare — biserica văzută din lateral',
      caption: 'Așa va arăta lăcașul sfânt',
    },
  ],
}: {
  videoSrc?: string;
  poster?: string;
  donateHref?: string;
  renders?: Render[];
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 text-cream">
      {/* Cinematic background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, #3a1512 0%, #230b09 45%, #150605 100%)',
        }}
      />
      {/* Gold glow top */}
      <div
        className="absolute inset-x-0 top-0 h-40 -z-10 opacity-60 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 0%, rgba(234,199,132,0.28), transparent 70%)',
        }}
      />
      {/* Grain */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.12] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.8' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="container max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="inline-flex items-center gap-2 font-ceremonial uppercase tracking-[0.26em] text-[11px] sm:text-xs text-burgundy-dark bg-gold px-4 py-1.5 rounded-full shadow-[0_6px_20px_-6px_rgba(234,199,132,0.7)] mb-5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-burgundy-dark/70 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-burgundy-dark" />
            </span>
            A început zidirea bisericii
          </p>
          <h2 className="font-display text-[28px] sm:text-4xl md:text-5xl font-semibold leading-tight !text-cream">
            Biserica prinde viață,{' '}
            <em className="italic text-gold">piatră cu piatră</em>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/80 leading-relaxed text-[16px] sm:text-[17px] font-serif">
            Cu ajutorul lui Dumnezeu și al ctitorilor, lucrările au început pe
            șantier. Iată primele imagini — fundația pe care se va înălța lăcașul
            Cuvioasei Teodora de la Sihla.
          </p>
        </motion.div>

        {/* Video */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative rounded-[22px] overflow-hidden shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] ring-1 ring-gold/40"
        >
          <div className="pointer-events-none absolute inset-0 z-20 rounded-[22px] border border-gold/25" />
          {playing ? (
            <video
              src={videoSrc}
              poster={poster}
              controls
              autoPlay
              playsInline
              className="w-full aspect-video bg-black object-cover"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="Redă filmul de pe șantier"
              className="group relative block w-full aspect-video overflow-hidden"
            >
              <img
                src={poster}
                alt="Șantierul noii biserici — fundația"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/30" />
              {/* Play button */}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="relative flex items-center justify-center">
                  <span className="absolute h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gold/25 animate-ping" />
                  <span className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark text-burgundy-dark shadow-[0_10px_30px_-6px_rgba(234,199,132,0.8)] transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-9 w-9 sm:h-11 sm:w-11 ml-1">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </span>
              <span className="absolute bottom-4 left-5 right-5 flex items-center justify-between gap-3">
                <span className="font-ceremonial uppercase tracking-[0.22em] text-[11px] sm:text-xs text-gold">
                  ☩ Primele imagini de pe șantier
                </span>
                <span className="font-serif italic text-cream/85 text-sm hidden sm:block">
                  cu cântare bizantină
                </span>
              </span>
            </button>
          )}
        </motion.div>

        {/* Stat chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {[
            { k: 'Etapa curentă', v: 'Turnarea fundației' },
            { k: 'Se lucrează', v: 'Cu binecuvântare' },
            { k: 'Împreună', v: 'Ctitori ai bisericii' },
          ].map((s) => (
            <div
              key={s.k}
              className="rounded-xl border border-gold/25 bg-white/5 backdrop-blur-sm px-4 py-3 text-center"
            >
              <p className="font-ceremonial uppercase tracking-[0.2em] text-[10px] text-gold/80">
                {s.k}
              </p>
              <p className="font-display text-[15px] sm:text-base text-cream mt-0.5">{s.v}</p>
            </div>
          ))}
        </motion.div>

        {/* Renderings — "așa va arăta" */}
        {renders.length > 0 && (
          <div className="mt-14 sm:mt-16">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="text-center font-ceremonial uppercase tracking-[0.26em] text-xs text-gold mb-6"
            >
              ✛ Așa va arăta biserica
            </motion.p>
            <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
              {renders.map((r, i) => (
                <motion.figure
                  key={r.src}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
                  className="group relative overflow-hidden rounded-[18px] ring-1 ring-gold/30 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]"
                >
                  <img
                    src={r.src}
                    alt={r.alt}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pt-10 pb-3">
                    <span className="font-serif italic text-cream text-sm">{r.caption}</span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mt-12 sm:mt-14 text-center"
        >
          <p className="text-cream/85 font-serif text-[16px] sm:text-[17px] mb-5 max-w-xl mx-auto">
            Fiecare dar adus cu inimă curată devine o cărămidă vie în acest lăcaș
            al harului. Alătură-te ctitorilor bisericii.
          </p>
          <Link
            href={donateHref}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-gold to-gold-dark px-8 py-4 font-ceremonial uppercase tracking-[0.18em] text-sm text-burgundy-dark shadow-[0_14px_36px_-10px_rgba(234,199,132,0.8)] transition-transform hover:scale-[1.04]"
          >
            ☩ Devino ctitor al bisericii
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
