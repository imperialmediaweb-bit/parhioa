'use client';

import { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

const ICON_URL =
  'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1780574528/sf_theodora_de_la_sihla_ri9rz2.png';

function PlaceholderArt({ alt, className }: { alt: string; className?: string }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden ${className || ''}`}
      style={{
        background:
          'linear-gradient(180deg, #FBF6EE 0%, #F5EBD7 55%, #EFE0C0 100%)',
      }}
    >
      {/* Parchment grain */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.38 0 0 0 0 0.18 0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      <div className="absolute inset-2 rounded-[14px] border border-gold/55 pointer-events-none" />
      <div className="absolute inset-3 rounded-[12px] border border-burgundy/25 pointer-events-none" />

      <img
        src={ICON_URL}
        alt={alt}
        className="relative h-16 w-16 sm:h-20 sm:w-20 object-contain opacity-85 mb-2"
      />
      <p className="relative text-burgundy text-sm sm:text-base">☩</p>
    </div>
  );
}

export function PostImage({ src, alt, className }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return <PlaceholderArt alt={alt} className={className} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      loading="lazy"
      decoding="async"
    />
  );
}
