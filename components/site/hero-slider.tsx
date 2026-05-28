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
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 transition items-center justify-center"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            aria-label="Slide următor"
            onClick={scrollNext}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 transition items-center justify-center"
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
    <div className="relative h-[78vh] min-h-[480px] max-h-[640px] sm:h-[760px] sm:min-h-[640px] sm:max-h-[820px] lg:h-[88vh] lg:min-h-[760px] lg:max-h-[920px] w-full overflow-hidden bg-navy-dark">
      {/* Media */}
      {slide.media.type === 'video' ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={slide.media.poster}
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        >
          <source src={slide.media.src} type="video/mp4" />
        </video>
      ) : (
        <img
          src={slide.media.src}
          alt={slide.media.alt || ''}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-transform ease-out',
            active ? 'scale-110' : 'scale-100',
          )}
          style={{ transitionDuration: '8000ms' }}
        />
      )}

      {/* Cinematic but readable overlay — keeps icons visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-[#3d0f0a]/30 to-black/70" />
      {/* Golden vignette glow at top + soft floor */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(234, 199, 132, 0.28), transparent 60%), radial-gradient(ellipse 90% 60% at 50% 110%, rgba(0, 0, 0, 0.55), transparent 60%)',
        }}
      />
      {/* Subtle incense / mist haze */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='m'><feTurbulence baseFrequency='0.012' numOctaves='3' seed='4'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.85 0 0 0 0 0.6 0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23m)'/></svg>\")",
        }}
      />

      {/* Subtle dark vignette focused under the text block, so icons stay visible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 45% 35% at 50% 55%, rgba(0,0,0,0.5), transparent 75%)',
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center px-6 z-10">
        <div
          className={cn(
            'mx-auto max-w-3xl text-center text-white transition-all duration-700',
            active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          {slide.eyebrow && (
            <p className="font-ceremonial uppercase tracking-[0.32em] text-xs sm:text-sm text-gold mb-6 flex items-center justify-center gap-3">
              <span className="inline-block h-px w-8 bg-gold/70" />
              <span>{slide.eyebrow}</span>
              <span className="inline-block h-px w-8 bg-gold/70" />
            </p>
          )}
          <h1 className="font-ecclesia text-[28px] xs:text-[32px] sm:text-5xl lg:text-6xl xl:text-7xl !text-white font-bold leading-[1.08] tracking-wide mb-5 sm:mb-7 uppercase drop-shadow-[0_3px_18px_rgba(0,0,0,0.6)]">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="font-serif italic text-[15px] xs:text-base sm:text-xl lg:text-2xl text-cream max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
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
