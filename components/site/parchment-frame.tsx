import { OrthodoxCross } from './cross-divider';
import { cn } from '@/lib/utils';

/**
 * Icon-frame style wrapper for parish photos — parchment background,
 * gold double border, Orthodox cross floating above, corner ornaments,
 * Byzantine arch on the image. Use across the homepage and key pages
 * so every parish photo feels like an icon on a wall.
 */
export function ParchmentFrame({
  src,
  alt,
  caption,
  ratio = '4/5',
  cross = true,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  ratio?: '4/5' | 'square' | '3/4';
  cross?: boolean;
  className?: string;
}) {
  const aspect =
    ratio === 'square' ? 'aspect-square' : ratio === '3/4' ? 'aspect-[3/4]' : 'aspect-[4/5]';

  return (
    <div className={cn('relative mx-auto max-w-[420px]', cross ? 'pt-12' : '', className)}>
      {cross && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_4px_14px_rgba(129,35,27,0.4)]">
          <OrthodoxCross height={60} />
        </div>
      )}

      <div
        className="relative rounded-[28px] px-5 pt-6 pb-5 shadow-[0_30px_60px_-30px_rgba(101,26,20,0.55)] overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #FBF6EE 0%, #F5EBD7 55%, #EFE0C0 100%)',
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

        {/* Double inner border */}
        <div className="absolute inset-2 rounded-[22px] border border-gold/60 pointer-events-none" />
        <div className="absolute inset-3 rounded-[19px] border border-burgundy/25 pointer-events-none" />

        {/* Corner ornaments */}
        {(
          [
            'top-2 left-2 rotate-0',
            'top-2 right-2 rotate-90',
            'bottom-2 right-2 rotate-180',
            'bottom-2 left-2 -rotate-90',
          ] as const
        ).map((pos) => (
          <svg
            key={pos}
            viewBox="0 0 24 24"
            className={`absolute ${pos} h-5 w-5 text-gold pointer-events-none`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            aria-hidden
          >
            <path d="M2 10 V4 H10" />
            <circle cx="4" cy="4" r="0.8" fill="currentColor" />
          </svg>
        ))}

        {/* Photo with Byzantine arched top */}
        <div
          className={cn('relative overflow-hidden bg-burgundy/5', aspect)}
          style={{
            borderTopLeftRadius: '50% 18%',
            borderTopRightRadius: '50% 18%',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
          }}
        >
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 60px 6px rgba(61,15,10,0.4)' }}
          />
        </div>

        {caption && (
          <div className="relative mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/70" />
            <span className="text-gold text-base leading-none">☩</span>
            <p className="font-ceremonial uppercase text-[11px] sm:text-xs tracking-[0.28em] text-burgundy">
              {caption}
            </p>
            <span className="text-gold text-base leading-none">☩</span>
            <span className="h-px w-8 bg-gold/70" />
          </div>
        )}
      </div>
    </div>
  );
}
