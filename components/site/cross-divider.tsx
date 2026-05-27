import { cn } from '@/lib/utils';

/**
 * Authentic Eastern Orthodox cross with budded/trefoil ends —
 * each arm terminates in three rounded lobes (the classic shape
 * carved into wooden icon crosses).
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
  const h = size === 'sm' ? 44 : size === 'lg' ? 88 : 64;

  const colors = {
    light: {
      cross: '#81231B',
      inner: '#EAC784',
      line: 'from-burgundy/40',
      dot: 'text-gold-dark',
    },
    dark: {
      cross: '#EAC784',
      inner: '#FBF6EE',
      line: 'from-white/35',
      dot: 'text-gold',
    },
    gold: {
      cross: '#c9a361',
      inner: '#FBF6EE',
      line: 'from-gold/50',
      dot: 'text-burgundy',
    },
  }[variant];

  return (
    <div
      className={cn('flex items-center justify-center gap-4 my-10 select-none', className)}
      aria-hidden
    >
      {/* Left rule */}
      <span className="flex items-center gap-2 flex-1 max-w-[160px] justify-end">
        <span className={cn('h-px flex-1 bg-gradient-to-r from-transparent', colors.line)} />
        <Diamond className={cn('h-2 w-2', colors.dot)} />
      </span>

      {/* The Orthodox cross — three-bar with budded ends */}
      <OrthodoxCross height={h} fill={colors.cross} accent={colors.inner} />

      {/* Right rule */}
      <span className="flex items-center gap-2 flex-1 max-w-[160px]">
        <Diamond className={cn('h-2 w-2', colors.dot)} />
        <span className={cn('h-px flex-1 bg-gradient-to-l from-transparent', colors.line)} />
      </span>
    </div>
  );
}

export function OrthodoxCross({
  height = 80,
  fill = '#81231B',
  accent = '#EAC784',
  className,
}: {
  height?: number;
  fill?: string;
  accent?: string;
  className?: string;
}) {
  // Viewbox: 120 wide × 180 tall — matches the long-stemmed Eastern Orthodox cross
  return (
    <svg
      viewBox="0 0 120 180"
      height={height}
      className={className}
      fill={fill}
      aria-hidden
    >
      <defs>
        {/* Reusable trefoil cluster (one lobe of the budded end) */}
        <symbol id="trefoil-end" viewBox="-26 -16 52 32">
          <circle cx="-14" cy="0" r="10" />
          <circle cx="14" cy="0" r="10" />
          <circle cx="0" cy="-10" r="10" />
        </symbol>
      </defs>

      {/* Vertical post (longer below the main bar) */}
      <rect x="54" y="26" width="12" height="138" rx="2" />

      {/* Main horizontal bar */}
      <rect x="26" y="78" width="68" height="14" rx="2" />

      {/* Top short bar (INRI titulus) */}
      <rect x="46" y="44" width="28" height="8" rx="1" />

      {/* Slanted suppedaneum (footrest) */}
      <g transform="rotate(18 60 142)">
        <rect x="32" y="138" width="56" height="9" rx="1.5" />
      </g>

      {/* Budded ends — top of post */}
      <g transform="translate(60 18)">
        <circle r="11" />
        <circle cx="-11" cy="6" r="8.5" />
        <circle cx="11" cy="6" r="8.5" />
      </g>

      {/* Budded ends — left of main bar */}
      <g transform="translate(22 85)">
        <circle r="11" />
        <circle cx="-6" cy="-11" r="8.5" />
        <circle cx="-6" cy="11" r="8.5" />
      </g>

      {/* Budded ends — right of main bar */}
      <g transform="translate(98 85)">
        <circle r="11" />
        <circle cx="6" cy="-11" r="8.5" />
        <circle cx="6" cy="11" r="8.5" />
      </g>

      {/* Budded ends — left of suppedaneum (rotated) */}
      <g transform="rotate(18 60 142) translate(28 142.5)">
        <circle r="8" />
        <circle cx="-5" cy="-7" r="6.5" />
        <circle cx="-5" cy="7" r="6.5" />
      </g>

      {/* Budded ends — right of suppedaneum (rotated) */}
      <g transform="rotate(18 60 142) translate(92 142.5)">
        <circle r="8" />
        <circle cx="5" cy="-7" r="6.5" />
        <circle cx="5" cy="7" r="6.5" />
      </g>

      {/* Budded end — bottom of post */}
      <g transform="translate(60 168)">
        <circle r="11" />
        <circle cx="-11" cy="-6" r="8.5" />
        <circle cx="11" cy="-6" r="8.5" />
      </g>

      {/* Gold accent at the centre crossing */}
      <circle cx="60" cy="85" r="4.5" fill={accent} />

      {/* Inner outline accent on the main bar (subtle) */}
      <rect
        x="29"
        y="81"
        width="62"
        height="8"
        rx="1.5"
        fill="none"
        stroke={accent}
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  );
}

function Diamond({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="currentColor" aria-hidden>
      <path d="M6 0 L12 6 L6 12 L0 6 Z" />
    </svg>
  );
}
