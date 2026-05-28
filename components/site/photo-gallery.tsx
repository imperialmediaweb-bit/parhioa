'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  /** Optional video source; when set, the thumbnail (src) becomes a video poster. */
  video?: string;
}

export function PhotoGallery({ images }: { images: GalleryImage[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: true },
    [Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i === null ? 0 : (i - 1 + images.length) % images.length));
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i === null ? 0 : (i + 1) % images.length));
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightboxIndex, images.length]);

  return (
    <>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_45%] lg:flex-[0_0_33%] relative aspect-[4/5] overflow-hidden rounded-2xl group cursor-pointer ring-1 ring-gold/30"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {img.video && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream/95 text-burgundy-dark ring-2 ring-gold/70 shadow-[0_8px_22px_-4px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 ml-1">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </div>
                )}
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="font-serif italic text-sm">{img.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {snaps.slice(0, Math.min(snaps.length, 8)).map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Foto ${i + 1}`}
              className={cn(
                'h-2 rounded-full transition-all',
                selectedIndex === i ? 'w-8 bg-burgundy' : 'w-2 bg-lavender/40 hover:bg-lavender',
              )}
            />
          ))}
        </div>

        <button
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Anterior"
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white shadow-lg border border-border items-center justify-center text-burgundy hover:bg-burgundy hover:text-white transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Următor"
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white shadow-lg border border-border items-center justify-center text-burgundy hover:bg-burgundy hover:text-white transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-burgundy-dark/95 flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Închide"
            className="absolute top-4 right-4 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i === null ? 0 : (i - 1 + images.length) % images.length));
            }}
            aria-label="Anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i === null ? 0 : (i + 1) % images.length));
            }}
            aria-label="Următor"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          {images[lightboxIndex].video ? (
            <video
              key={images[lightboxIndex].video}
              src={images[lightboxIndex].video}
              poster={images[lightboxIndex].src}
              controls
              autoPlay
              playsInline
              className="max-h-[88vh] max-w-[90vw] rounded-lg bg-black"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              className="max-h-[88vh] max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          {images[lightboxIndex].caption && (
            <div className="absolute bottom-6 left-0 right-0 text-center text-white/90 font-serif italic">
              {images[lightboxIndex].caption}
            </div>
          )}
        </div>
      )}
    </>
  );
}
