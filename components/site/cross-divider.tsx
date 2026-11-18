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
  const width = Math.round(height * (76 / 108));
  const gid = 'oxcross-g';
  const sid = 'oxcross-sheen';
  // Trefoil (3-lobe) terminals at each beam end — the Romanian/Byzantine
  // budded-cross motif — rendered as three small circles.
  const Bud = ({ cx, cy }: { cx: number; cy: number }) => (
    <g fill={`url(#${gid})`} stroke={fill} strokeWidth="0.4">
      <circle cx={cx} cy={cy} r="3.1" />
      <circle cx={cx - 3.4} cy={cy} r="2.6" />
      <circle cx={cx + 3.4} cy={cy} r="2.6" />
    </g>
  );
  return (
    <svg
      viewBox="0 0 76 108"
      style={{ height, width }}
      className={className}
      role="img"
      aria-label="Cruce ortodoxă"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="55%" stopColor={fill} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
        <linearGradient id={sid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill={`url(#${gid})`} stroke={fill} strokeWidth="0.6" strokeLinejoin="round">
        {/* vertical beam */}
        <rect x="32" y="8" width="12" height="94" rx="3" />
        {/* top bar (titulus) */}
        <rect x="23" y="22" width="30" height="8" rx="2.5" />
        {/* main cross bar */}
        <rect x="9" y="42" width="58" height="11" rx="3" />
        {/* slanted foot bar (suppedaneum) */}
        <rect x="19" y="72" width="38" height="8" rx="2.5" transform="rotate(-16 38 76)" />
      </g>
      {/* budded terminals */}
      <Bud cx={38} cy={9} />
      <Bud cx={38} cy={100} />
      <Bud cx={11} cy={47.5} />
      <Bud cx={65} cy={47.5} />
      {/* subtle vertical sheen */}
      <rect x="32" y="8" width="12" height="94" rx="3" fill={`url(#${sid})`} opacity="0.35" />
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
