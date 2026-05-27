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
  const h = size === 'sm' ? 56 : size === 'lg' ? 110 : 78;

  const palette = {
    light: { cross: '#81231B', inner: '#EAC784' },
    dark: { cross: '#EAC784', inner: '#FBF6EE' },
    gold: { cross: '#c9a361', inner: '#FBF6EE' },
  }[variant];

  // Cross stands alone at the top of a section — no horizontal rule lines.
  // Two tiny gold diamonds underneath act as a subtle "footer" instead.
  return (
    <div
      className={cn('flex flex-col items-center select-none mt-2 mb-10 sm:mb-14', className)}
      aria-hidden
    >
      <OrthodoxCross height={h} fill={palette.cross} accent={palette.inner} />
      <div className="mt-3 flex items-center gap-2 opacity-70">
        <Diamond className="h-1.5 w-1.5" style={{ color: palette.inner }} />
        <span
          className="h-px w-12 bg-current opacity-50"
          style={{ color: palette.cross }}
        />
        <Diamond className="h-1.5 w-1.5" style={{ color: palette.inner }} />
      </div>
    </div>
  );
}

/**
 * Romanian Orthodox cross with budded/clover ends.
 *
 * Drawn as a single carved silhouette: vertical stem + single horizontal
 * bar, each of the 4 arms flowering into a three-lobe clover (top center
 * lobe + two side lobes). The bottom trefoil is slightly larger because
 * the lower arm is the longest one, matching the wooden reference cross.
 */
export function OrthodoxCross({
  height = 86,
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
      viewBox="0 0 240 320"
      width={(height * 240) / 320}
      height={height}
      className={className}
      aria-hidden
    >
      <g fill={fill}>
        {/* Vertical stem */}
        <rect x="106" y="36" width="28" height="252" rx="4" />
        {/* Horizontal bar */}
        <rect x="38" y="140" width="164" height="32" rx="4" />

        {/* TOP trefoil — three lobes around the top of the stem */}
        <circle cx="120" cy="22" r="18" />
        <circle cx="100" cy="36" r="17" />
        <circle cx="140" cy="36" r="17" />

        {/* LEFT trefoil — clover sticking out left */}
        <circle cx="24" cy="156" r="18" />
        <circle cx="40" cy="138" r="17" />
        <circle cx="40" cy="174" r="17" />

        {/* RIGHT trefoil — clover sticking out right */}
        <circle cx="216" cy="156" r="18" />
        <circle cx="200" cy="138" r="17" />
        <circle cx="200" cy="174" r="17" />

        {/* BOTTOM trefoil — slightly bigger, longest arm */}
        <circle cx="120" cy="296" r="20" />
        <circle cx="98" cy="280" r="18" />
        <circle cx="142" cy="280" r="18" />
      </g>

      {/* Inner gold accent following the silhouette */}
      <g
        fill="none"
        stroke={accent}
        strokeWidth="2"
        opacity="0.5"
        strokeLinejoin="round"
      >
        <rect x="112" y="42" width="16" height="240" rx="2" />
        <rect x="44" y="146" width="152" height="20" rx="2" />
      </g>

      {/* Small gold cross at the centre of the crossing */}
      <g fill={accent} opacity="0.85">
        <rect x="117" y="148" width="6" height="16" rx="1" />
        <rect x="112" y="153" width="16" height="6" rx="1" />
      </g>
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
