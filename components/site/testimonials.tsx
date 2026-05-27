'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Testimonial {
  text: string;
  author: string;
  role?: string;
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 7000, stopOnInteraction: false, stopOnMouseEnter: true })],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {items.map((t, i) => (
            <div
              key={i}
              className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-1"
            >
              <ManuscriptCard testimonial={t} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-10">
        {snaps.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Mărturia ${i + 1}`}
            className={cn(
              'transition-all duration-300',
              selectedIndex === i
                ? 'w-10 h-2 rounded-full bg-burgundy shadow-warm'
                : 'h-2 w-2 rounded-full bg-burgundy/30 hover:bg-burgundy/60',
            )}
          />
        ))}
      </div>

      <button
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="Anterior"
        className="hidden lg:flex absolute -left-14 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-cream border-2 border-gold/40 items-center justify-center text-burgundy hover:bg-burgundy hover:text-cream hover:shadow-candlelight transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Următor"
        className="hidden lg:flex absolute -right-14 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-cream border-2 border-gold/40 items-center justify-center text-burgundy hover:bg-burgundy hover:text-cream hover:shadow-candlelight transition-all"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

function ManuscriptCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article
      className="relative h-full p-8 sm:p-9 text-ink overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #fbf4e3 0%, #f4ead2 100%), url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.75' numOctaves='2' seed='2'/><feColorMatrix values='0 0 0 0 0.7 0 0 0 0 0.5 0 0 0 0 0.2 0 0 0 0.1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundBlendMode: 'multiply',
        boxShadow:
          '0 1px 3px rgba(60,30,10,0.1), 0 10px 30px -10px rgba(124,93,29,0.18), inset 0 1px 0 rgba(255,250,235,0.7)',
        borderRadius: '6px',
      }}
    >
      {/* Manuscript corner ornaments */}
      <svg className="absolute top-2 left-2 text-gold-dark/55" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M 4 12 Q 4 4, 12 4 M 4 18 Q 4 4, 18 4"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="4" cy="4" r="2" fill="currentColor" />
        <path
          d="M 10 8 Q 12 8, 12 10 Q 10 10, 10 8 Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="absolute top-2 right-2 text-gold-dark/55"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        style={{ transform: 'scaleX(-1)' }}
      >
        <path
          d="M 4 12 Q 4 4, 12 4 M 4 18 Q 4 4, 18 4"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="4" cy="4" r="2" fill="currentColor" />
        <path
          d="M 10 8 Q 12 8, 12 10 Q 10 10, 10 8 Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="absolute bottom-2 left-2 text-gold-dark/55"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        style={{ transform: 'scaleY(-1)' }}
      >
        <path
          d="M 4 12 Q 4 4, 12 4 M 4 18 Q 4 4, 18 4"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="4" cy="4" r="2" fill="currentColor" />
      </svg>
      <svg
        className="absolute bottom-2 right-2 text-gold-dark/55"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        style={{ transform: 'scale(-1, -1)' }}
      >
        <path
          d="M 4 12 Q 4 4, 12 4 M 4 18 Q 4 4, 18 4"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="4" cy="4" r="2" fill="currentColor" />
      </svg>

      {/* Burgundy initial drop-cap */}
      <span
        className="absolute top-6 left-7 font-display text-7xl text-burgundy/15 leading-none select-none"
        aria-hidden
      >
        „
      </span>

      <blockquote className="relative pt-5">
        <p className="font-serif italic text-[15.5px] text-ink/90 leading-[1.85] mb-6">
          {testimonial.text}
        </p>
        <footer className="border-t border-gold-dark/30 pt-4 flex items-center gap-3">
          <span className="inline-block h-7 w-7 rounded-full bg-gradient-to-br from-burgundy to-burgundy-dark text-cream flex items-center justify-center font-display text-xs font-bold shadow-warm">
            {testimonial.author.charAt(0)}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-display text-base font-semibold text-burgundy leading-tight">
              {testimonial.author}
            </p>
            {testimonial.role && (
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink/55 mt-0.5">
                {testimonial.role}
              </p>
            )}
          </div>
        </footer>
      </blockquote>
    </article>
  );
}
