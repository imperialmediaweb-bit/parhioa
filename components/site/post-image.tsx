'use client';

import { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

const FALLBACK_URL =
  'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1780574528/sf_theodora_de_la_sihla_ri9rz2.png';

export function PostImage({ src, alt, className }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`relative flex items-center justify-center bg-gradient-to-br from-cream-card via-cream-deep to-cream-card ${className || ''}`}
      >
        <img
          src={FALLBACK_URL}
          alt={alt}
          className="h-20 w-20 object-contain opacity-70"
        />
      </div>
    );
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
