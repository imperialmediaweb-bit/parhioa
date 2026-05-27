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
 * Romanian Orthodox cross — carved-wood silhouette with three equal-size
 * lobes at every arm tip, matching the reference cross the user keeps
 * sending. Bottom arm is longer + its trefoil is one notch bigger.
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
  // All trefoil lobes are radius R (same circle for all 3 in a cluster)
  const R = 22;
  return (
    <svg
      viewBox="0 0 280 380"
      width={(height * 280) / 380}
      height={height}
      className={className}
      aria-hidden
    >
      <g fill={fill}>
        {/* Vertical stem — runs from below the top trefoil neck down to the bottom trefoil */}
        <rect x="118" y="46" width="44" height="304" rx="4" />
        {/* Horizontal bar */}
        <rect x="32" y="158" width="216" height="44" rx="4" />

        {/* TOP TREFOIL — 3 equal lobes forming a clover */}
        <circle cx="140" cy="24" r={R} />
        <circle cx={140 - R} cy={24 + R * 0.95} r={R} />
        <circle cx={140 + R} cy={24 + R * 0.95} r={R} />

        {/* LEFT TREFOIL */}
        <circle cx="22" cy="180" r={R} />
        <circle cx={22 + R * 0.95} cy={180 - R} r={R} />
        <circle cx={22 + R * 0.95} cy={180 + R} r={R} />

        {/* RIGHT TREFOIL (mirror of left) */}
        <circle cx="258" cy="180" r={R} />
        <circle cx={258 - R * 0.95} cy={180 - R} r={R} />
        <circle cx={258 - R * 0.95} cy={180 + R} r={R} />

        {/* BOTTOM TREFOIL — slightly bigger because the bottom arm is the longest */}
        <circle cx="140" cy="358" r={R + 4} />
        <circle cx={140 - (R + 2)} cy={358 - (R + 2) * 0.85} r={R + 2} />
        <circle cx={140 + (R + 2)} cy={358 - (R + 2) * 0.85} r={R + 2} />
      </g>

      {/* Inner carved outline — slightly inset from the body */}
      <g fill="none" stroke={accent} strokeWidth="2.5" opacity="0.55" strokeLinejoin="round">
        <rect x="124" y="52" width="32" height="292" rx="3" />
        <rect x="38" y="164" width="204" height="32" rx="3" />
      </g>

      {/* Tiny accent square at the crossing */}
      <rect x="135" y="175" width="10" height="10" rx="1.5" fill={accent} opacity="0.85" />
    </svg>
  );
}

function Diamond({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 12 12" className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M6 0 L12 6 L6 12 L0 6 Z" />
    </svg>
  );
}
