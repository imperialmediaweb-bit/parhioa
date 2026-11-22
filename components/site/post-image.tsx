'use client';

import { useEffect, useRef, useState } from 'react';
import { cld } from '@/lib/img';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

const ICON_URL =
  'https://pub-49f4280024fa4ca2b8a4f6323442efe8.r2.dev/sf_theodora_de_la_sihla_ri9rz2.png';

function PlaceholderArt({ alt, className }: { alt: string; className?: string }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden ${className || ''}`}
      style={{
        background:
          'radial-gradient(130% 130% at 50% 0%, #7a201a 0%, #4f120d 58%, #350b08 100%)',
      }}
    >
      {/* Warm gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 85% at 50% 32%, rgba(234,199,132,0.28), transparent 72%)',
        }}
      />
      {/* Subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.8' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      {/* Ornamental double frame */}
      <div className="absolute inset-3 rounded-[12px] border border-gold/45 pointer-events-none" />
      <div className="absolute inset-4 rounded-[10px] border border-gold/15 pointer-events-none" />

      <img
        src={ICON_URL}
        alt={alt}
        className="relative h-20 w-20 sm:h-24 sm:w-24 object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.45)]"
      />
      <p className="relative mt-3 font-ceremonial uppercase text-[9px] sm:text-[10px] tracking-[0.24em] text-gold text-center px-4 leading-relaxed">
        Parohia Sf. Cuv. Teodora
      </p>
      <span className="relative mt-1 text-gold/80 text-sm leading-none">☩</span>
    </div>
  );
}

export function PostImage({ src, alt, className }: Props) {
  const [errored, setErrored] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // A server-rendered <img> can finish (and fail) loading before React
  // hydrates and attaches `onError`, so the handler never fires. Catch those
  // already-broken images on mount and fall back to the branded placeholder.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setErrored(true);
  }, []);

  if (errored) {
    return <PlaceholderArt alt={alt} className={className} />;
  }

  return (
    <img
      ref={ref}
      src={cld(src)}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      loading="lazy"
      decoding="async"
    />
  );
}
