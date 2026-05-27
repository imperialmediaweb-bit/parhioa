'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { cn } from '@/lib/utils';

export type SlideMedia =
  | { type: 'image'; src: string; alt?: string }
  | { type: 'video'; src: string; poster?: string };

export interface HeroSlide {
  media: SlideMedia;
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function HeroSlider({
  slides,
  autoplayMs = 6500,
}: {
  slides: HeroSlide[];
  autoplayMs?: number;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 30 },
    [Autoplay({ delay: autoplayMs, stopOnInteraction: false, stopOnMouseEnter: true })],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <section className="relative isolate overflow-hidden -mb-12 sm:-mb-16">
      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, i) => (
            <div key={i} className="relative min-w-0 flex-[0_0_100%]">
              <SlideContent slide={slide} active={selectedIndex === i} />
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button
            aria-label="Slide anterior"
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 transition flex items-center justify-center"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            aria-label="Slide următor"
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 transition flex items-center justify-center"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  selectedIndex === i ? 'w-8 bg-gold' : 'w-2 bg-white/50 hover:bg-white/80',
                )}
              />
            ))}
          </div>
        </>
      )}

      {/* Curved bottom edge */}
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="block w-full -mt-px h-12 sm:h-20 text-white relative z-10"
        aria-hidden
      >
        <path d="M0,0 C480,80 960,80 1440,0 L1440,80 L0,80 Z" fill="currentColor" />
      </svg>
    </section>
  );
}

function SlideContent({ slide, active }: { slide: HeroSlide; active: boolean }) {
  return (
    <div className="relative h-[600px] sm:h-[680px] lg:h-[760px] w-full overflow-hidden bg-navy-dark">
      {/* Media */}
      {slide.media.type === 'video' ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={slide.media.poster}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={slide.media.src} type="video/mp4" />
        </video>
      ) : (
        <img
          src={slide.media.src}
          alt={slide.media.alt || ''}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-transform duration-[8000ms] ease-out',
            active ? 'scale-110' : 'scale-100',
          )}
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/40 via-navy-dark/55 to-navy-dark/80" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center px-6 z-10">
        <div
          className={cn(
            'mx-auto max-w-3xl text-center text-white transition-all duration-700',
            active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          {slide.eyebrow && (
            <p className="font-ceremonial uppercase tracking-[0.24em] text-xs sm:text-sm text-gold mb-4">
              {slide.eyebrow}
            </p>
          )}
          <h1 className="font-ecclesia text-3xl sm:text-4xl lg:text-5xl xl:text-6xl !text-white font-bold leading-[1.15] tracking-wide mb-6 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="font-body text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
              {slide.subtitle}
            </p>
          )}
          {(slide.primaryCta || slide.secondaryCta) && (
            <div className="flex flex-wrap gap-3 justify-center">
              {slide.primaryCta && (
                <Link href={slide.primaryCta.href}>
                  <ShimmerButton>
                    <span className="text-base font-semibold">{slide.primaryCta.label}</span>
                  </ShimmerButton>
                </Link>
              )}
              {slide.secondaryCta && (
                <Link href={slide.secondaryCta.href}>
                  <Button variant="cream" size="lg">
                    {slide.secondaryCta.label}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
