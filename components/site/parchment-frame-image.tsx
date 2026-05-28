'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Inner image cell of the ParchmentFrame — split into its own client
 * component so the surrounding ParchmentFrame can stay a server component
 * while still getting subtle scroll-driven parallax on the photo.
 */
export function ParchmentFrameImage({
  src,
  alt,
  aspect,
  parallax = true,
}: {
  src: string;
  alt: string;
  aspect: string;
  parallax?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], parallax ? ['-8%', '8%'] : ['0%', '0%']);

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden bg-burgundy/5 flex-1 min-h-0', aspect)}
      style={{
        borderTopLeftRadius: '50% 18%',
        borderTopRightRadius: '50% 18%',
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px',
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="absolute inset-0 w-full h-[116%] object-cover"
        loading="lazy"
        decoding="async"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 60px 6px rgba(61,15,10,0.4)' }}
      />
    </div>
  );
}
