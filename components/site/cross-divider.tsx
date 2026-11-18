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
 * Romanian Orthodox three-bar cross, drawn inline as SVG — no external image,
 * so it never breaks and costs no bandwidth. Gold with a soft inner highlight
 * to match the parish's parchment-and-gold aesthetic.
 */
export function OrthodoxCross({
  height = 86,
  className,
  fill = '#c9a961',
  accent = '#f0dca8',
}: {
  height?: number;
  className?: string;
  fill?: string;
  accent?: string;
}) {
  const width = Math.round(height * (72 / 100)); // ~5:7, taller than wide
  return (
    <svg
      viewBox="0 0 72 100"
      style={{ height, width }}
      className={className}
      role="img"
      aria-label="Cruce ortodoxă"
    >
      <defs>
        <linearGradient id="oxcross-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={fill} />
        </linearGradient>
      </defs>
      <g fill="url(#oxcross-g)" stroke={fill} strokeWidth="0.5">
        {/* vertical beam */}
        <rect x="31" y="4" width="10" height="92" rx="2.5" />
        {/* top bar (titulus) */}
        <rect x="22" y="18" width="28" height="7" rx="2" />
        {/* main cross bar */}
        <rect x="10" y="36" width="52" height="9" rx="2.5" />
        {/* slanted foot bar (suppedaneum) */}
        <rect x="20" y="64" width="32" height="7" rx="2" transform="rotate(-18 36 67.5)" />
      </g>
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
