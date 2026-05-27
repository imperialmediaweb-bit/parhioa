import { cn } from '@/lib/utils';

export function CrossDivider({
  className,
  size = 'default',
  variant = 'light',
}: {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'light' | 'dark' | 'gold';
}) {
  const h = size === 'sm' ? 56 : size === 'lg' ? 110 : 80;

  const palette = {
    light: { cross: '#81231B', inner: '#EAC784', rule: 'from-burgundy/40', dot: 'text-gold-dark' },
    dark: { cross: '#EAC784', inner: '#FBF6EE', rule: 'from-gold/40', dot: 'text-gold' },
    gold: { cross: '#c9a361', inner: '#FBF6EE', rule: 'from-gold/50', dot: 'text-burgundy' },
  }[variant];

  return (
    <div className={cn('flex items-center justify-center gap-4 my-10 select-none', className)} aria-hidden>
      <span className="flex items-center gap-2 flex-1 max-w-[140px] justify-end">
        <span className={cn('h-px flex-1 bg-gradient-to-r from-transparent', palette.rule)} />
        <Diamond className={cn('h-2 w-2', palette.dot)} />
      </span>

      <OrthodoxCross height={h} fill={palette.cross} accent={palette.inner} />

      <span className="flex items-center gap-2 flex-1 max-w-[140px]">
        <Diamond className={cn('h-2 w-2', palette.dot)} />
        <span className={cn('h-px flex-1 bg-gradient-to-l from-transparent', palette.rule)} />
      </span>
    </div>
  );
}

/**
 * Romanian Orthodox cross with budded / trefoil ends — modelled after
 * the carved-wood cross the user wants. Single horizontal bar, longer
 * lower stem, each of the 4 arm tips flowering into 3 lobes.
 */
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
  return (
    <svg
      viewBox="0 0 220 320"
      width={(height * 220) / 320}
      height={height}
      className={className}
      aria-hidden
    >
      <defs>
        {/* The trefoil "bud" — three overlapping circles forming a clover */}
        <g id="bud-h">
          {/* Horizontal: lobe sticks out to the right (rotate as needed) */}
          <circle cx="0" cy="0" r="22" />
          <circle cx="14" cy="-18" r="18" />
          <circle cx="14" cy="18" r="18" />
        </g>
      </defs>

      {/* Vertical stem */}
      <rect x="92" y="42" width="36" height="240" rx="3" fill={fill} />

      {/* Horizontal bar — single, like the wooden reference */}
      <rect x="38" y="138" width="144" height="40" rx="3" fill={fill} />

      {/* TOP trefoil — bud rotated so it opens upward */}
      <g transform="translate(110 42) rotate(-90)" fill={fill}>
        <circle cx="0" cy="0" r="22" />
        <circle cx="14" cy="-18" r="18" />
        <circle cx="14" cy="18" r="18" />
      </g>

      {/* LEFT trefoil — bud opens to the left */}
      <g transform="translate(38 158) rotate(180)" fill={fill}>
        <circle cx="0" cy="0" r="22" />
        <circle cx="14" cy="-18" r="18" />
        <circle cx="14" cy="18" r="18" />
      </g>

      {/* RIGHT trefoil — bud opens to the right */}
      <g transform="translate(182 158)" fill={fill}>
        <circle cx="0" cy="0" r="22" />
        <circle cx="14" cy="-18" r="18" />
        <circle cx="14" cy="18" r="18" />
      </g>

      {/* BOTTOM trefoil — bud opens downward, larger than the top one */}
      <g transform="translate(110 282) rotate(90) scale(1.15)" fill={fill}>
        <circle cx="0" cy="0" r="22" />
        <circle cx="14" cy="-18" r="18" />
        <circle cx="14" cy="18" r="18" />
      </g>

      {/* Inner gold accent following the silhouette — like the inset line on the wooden cross */}
      <g
        fill="none"
        stroke={accent}
        strokeWidth="2"
        opacity="0.55"
        strokeLinejoin="round"
      >
        <rect x="98" y="48" width="24" height="228" rx="2" />
        <rect x="44" y="144" width="132" height="28" rx="2" />
      </g>

      {/* Center accent — small gold square at the crossing */}
      <rect x="105" y="153" width="10" height="10" rx="1.5" fill={accent} opacity="0.85" />
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
