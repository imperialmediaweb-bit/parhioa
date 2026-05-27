import { cn } from '@/lib/utils';

/**
 * Decorative section divider — a full-width ribbon that blends the two
 * logo colors (burgundy + lavender) with a gold-rimmed central cross
 * medallion and small Orthodox crosses scattered along the band. Use
 * between major homepage sections instead of a plain CrossDivider.
 */
export function SectionRibbon({
  className,
  variant = 'default',
}: {
  className?: string;
  variant?: 'default' | 'compact';
}) {
  const height = variant === 'compact' ? 'h-12' : 'h-16';

  return (
    <div className={cn('relative w-full overflow-hidden', className)} aria-hidden>
      {/* Outer gold hairline */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Main band — burgundy ↔ lavender gradient from logo palette */}
      <div
        className={cn('relative', height)}
        style={{
          background:
            'linear-gradient(90deg, #3d0f0a 0%, #5a1813 18%, #7a6c8c 42%, #9b8caa 50%, #7a6c8c 58%, #5a1813 82%, #3d0f0a 100%)',
        }}
      >
        {/* Damask-style pattern overlay */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='none' stroke='%23EAC784' stroke-width='0.6'><path d='M30 8 L36 18 L46 18 L38 25 L41 35 L30 28 L19 35 L22 25 L14 18 L24 18 Z' opacity='0.4'/><circle cx='30' cy='30' r='2' fill='%23EAC784' opacity='0.5'/></g></svg>\")",
          }}
        />

        {/* Scattered small crosses along the band */}
        <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-10 text-gold/70 font-display text-xs sm:text-sm select-none">
          <span>☩</span>
          <span className="opacity-50">·</span>
          <span>☩</span>
          <span className="opacity-50">·</span>
          <span className="opacity-0 sm:opacity-100">☩</span>
          <span className="hidden sm:inline opacity-50">·</span>
          {/* center spacer reserved for medallion */}
          <span className="opacity-0">☩</span>
          <span className="hidden sm:inline opacity-50">·</span>
          <span className="opacity-0 sm:opacity-100">☩</span>
          <span className="opacity-50">·</span>
          <span>☩</span>
          <span className="opacity-50">·</span>
          <span>☩</span>
        </div>

        {/* Central cross medallion */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full blur-md bg-gold/40 scale-150" />
            {/* Disc */}
            <div
              className={cn(
                'relative flex items-center justify-center rounded-full text-burgundy-dark ring-2 ring-gold/80 shadow-[0_4px_18px_-2px_rgba(0,0,0,0.5)]',
                variant === 'compact' ? 'h-10 w-10 text-base' : 'h-14 w-14 text-xl',
              )}
              style={{
                background: 'radial-gradient(circle at 30% 30%, #FBF6EE, #EAC784 70%, #c9a361)',
              }}
            >
              <span className="leading-none">☩</span>
            </div>
          </div>
        </div>

        {/* Side ornamental knots (left + right) */}
        {(['left-6 sm:left-12', 'right-6 sm:right-12'] as const).map((pos) => (
          <svg
            key={pos}
            viewBox="0 0 20 20"
            className={`absolute ${pos} top-1/2 -translate-y-1/2 h-3 w-3 text-gold/80`}
            fill="currentColor"
            aria-hidden
          >
            <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
          </svg>
        ))}
      </div>

      {/* Inner gold hairlines */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
    </div>
  );
}
