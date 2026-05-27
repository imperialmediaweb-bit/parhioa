'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
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
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {items.map((t, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-1">
              <Card className="h-full p-8 bg-cream relative">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-burgundy/15" />
                <p className="font-body italic text-ink/85 leading-relaxed mb-6 text-[15px]">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <p className="font-display text-lg font-semibold text-burgundy">{t.author}</p>
                  {t.role && <p className="text-xs uppercase tracking-wider text-lavender-dark mt-1">{t.role}</p>}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {snaps.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Mărturia ${i + 1}`}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              selectedIndex === i ? 'w-8 bg-burgundy' : 'w-2 bg-lavender/40 hover:bg-lavender',
            )}
          />
        ))}
      </div>

      <button
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="Anterior"
        className="hidden lg:flex absolute -left-12 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white border border-border items-center justify-center text-burgundy hover:bg-burgundy hover:text-white transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Următor"
        className="hidden lg:flex absolute -right-12 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white border border-border items-center justify-center text-burgundy hover:bg-burgundy hover:text-white transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
