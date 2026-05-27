import { cn } from '@/lib/utils';

/**
 * Three-bar Orthodox cross with gold flourishes on either side.
 * Used between sections to give the page a clear ecclesiastical accent.
 */
export function CrossDivider({
  className,
  size = 'default',
  variant = 'light',
}: {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'light' | 'dark' | 'gold';
}) {
  const h = size === 'sm' ? 36 : size === 'lg' ? 72 : 52;
  const colors = {
    light: { line: 'from-burgundy/40', cross: 'text-burgundy', accent: 'text-gold' },
    dark: { line: 'from-white/30', cross: 'text-gold', accent: 'text-white/70' },
    gold: { line: 'from-gold/50', cross: 'text-gold-dark', accent: 'text-burgundy' },
  }[variant];

  return (
    <div
      className={cn('flex items-center justify-center gap-4 my-10 select-none', className)}
      aria-hidden
    >
      {/* Left flourish */}
      <span className="flex items-center gap-2 flex-1 max-w-[180px] justify-end">
        <span className={cn('h-px flex-1 bg-gradient-to-r from-transparent', colors.line)} />
        <Diamond className={cn('h-2 w-2', colors.accent)} />
        <span className={cn('h-px w-6 bg-current', colors.cross, 'opacity-60')} />
      </span>

      {/* Orthodox three-bar cross */}
      <svg
        viewBox="0 0 60 100"
        height={h}
        className={colors.cross}
        fill="currentColor"
      >
        {/* Top trefoil cluster */}
        <circle cx="30" cy="6" r="2" />
        <circle cx="26" cy="3" r="1.3" />
        <circle cx="34" cy="3" r="1.3" />
        {/* Vertical post */}
        <rect x="28" y="8" width="4" height="78" rx="1" />
        {/* INRI titulus (small top bar) */}
        <rect x="22" y="18" width="16" height="3" rx="0.5" />
        {/* Main horizontal */}
        <rect x="12" y="32" width="36" height="4.5" rx="1.2" />
        {/* Trefoil tips on the main bar */}
        <circle cx="12" cy="34" r="3" />
        <circle cx="48" cy="34" r="3" />
        {/* Slanted suppedaneum (footrest) */}
        <g transform="rotate(20 30 64)">
          <rect x="14" y="62" width="32" height="3.5" rx="0.8" />
          <circle cx="14" cy="63.5" r="2" />
          <circle cx="46" cy="63.5" r="2" />
        </g>
        {/* Gold accent dot in the center of the cross */}
        <circle cx="30" cy="34.5" r="2" fill="#EAC784" />
      </svg>

      {/* Right flourish */}
      <span className="flex items-center gap-2 flex-1 max-w-[180px]">
        <span className={cn('h-px w-6 bg-current', colors.cross, 'opacity-60')} />
        <Diamond className={cn('h-2 w-2', colors.accent)} />
        <span className={cn('h-px flex-1 bg-gradient-to-l from-transparent', colors.line)} />
      </span>
    </div>
  );
}

function Diamond({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="currentColor" aria-hidden>
      <path d="M6 0 L12 6 L6 12 L0 6 Z" />
    </svg>
  );
}
