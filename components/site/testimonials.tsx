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
      <div className="overflow-hidden px-2 sm:px-4 -mx-2 sm:-mx-4 py-3" ref={emblaRef}>
        <div className="flex gap-5">
          {items.map((t, i) => (
            <div
              key={i}
              className="min-w-0 flex-[0_0_80%] sm:flex-[0_0_60%] lg:flex-[0_0_32%]"
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
    <article className="relative h-full pt-8">
      {/* Small floating cross above */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 text-gold-dark text-2xl drop-shadow-[0_2px_4px_rgba(101,26,20,0.35)] leading-none">
        ☩
      </div>

      <div
        className="relative h-full px-7 pt-8 pb-7 rounded-[20px] overflow-hidden shadow-[0_18px_40px_-20px_rgba(101,26,20,0.4)]"
        style={{
          background: 'linear-gradient(180deg, #FBF6EE 0%, #F5EBD7 55%, #EFE0C0 100%)',
        }}
      >
        {/* Parchment grain */}
        <div
          className="absolute inset-0 opacity-25 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.38 0 0 0 0 0.18 0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
        {/* Inner double border */}
        <div className="absolute inset-2 rounded-[15px] border border-gold/55 pointer-events-none" />
        <div className="absolute inset-3 rounded-[12px] border border-burgundy/20 pointer-events-none" />

        {/* Drop-cap quote */}
        <span
          className="absolute top-3 left-5 font-display text-[80px] text-burgundy/22 leading-none select-none pointer-events-none"
          aria-hidden
        >
          „
        </span>

        <blockquote className="relative pt-3 h-full flex flex-col">
          <p className="font-serif italic text-[15.5px] text-burgundy-dark/85 leading-[1.85] mb-6 flex-1">
            {testimonial.text}
          </p>
          <footer className="border-t border-gold/40 pt-4 flex items-center gap-3">
            <span className="inline-flex h-9 w-9 rounded-full items-center justify-center font-ceremonial text-sm text-cream shadow-[0_4px_10px_-3px_rgba(101,26,20,0.5)]"
              style={{
                background: 'linear-gradient(180deg, #7a201a 0%, #4f120d 100%)',
              }}
            >
              {testimonial.author.charAt(0)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display text-[15px] text-burgundy-dark leading-tight">
                {testimonial.author}
              </p>
              {testimonial.role && (
                <p className="font-ceremonial text-[10px] uppercase tracking-[0.22em] text-burgundy/55 mt-1">
                  {testimonial.role}
                </p>
              )}
            </div>
          </footer>
        </blockquote>
      </div>
    </article>
  );
}
