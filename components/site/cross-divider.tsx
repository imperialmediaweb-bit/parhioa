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
  const width = Math.round(height * (80 / 116));
  // A bejeweled Byzantine cross: gold frame, deep-red body, inlaid rubies
  // (red) and sapphires (blue). `fill`/`accent` keep the gold tones.
  const gem = (cx: number, cy: number, r: number, type: 'ruby' | 'sapphire') => (
    <g key={`${cx}-${cy}`}>
      <circle cx={cx} cy={cy} r={r} fill={`url(#ox-${type})`} stroke="#00000022" strokeWidth="0.4" />
      <ellipse cx={cx - r * 0.28} cy={cy - r * 0.32} rx={r * 0.38} ry={r * 0.26} fill="#ffffff" opacity="0.65" />
    </g>
  );
  return (
    <svg
      viewBox="0 0 80 116"
      style={{ height, width }}
      className={className}
      role="img"
      aria-label="Cruce ortodoxă"
    >
      <defs>
        <linearGradient id="ox-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="50%" stopColor={fill} />
          <stop offset="100%" stopColor="#9c7d3f" />
        </linearGradient>
        <linearGradient id="ox-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a52236" />
          <stop offset="55%" stopColor="#7e1526" />
          <stop offset="100%" stopColor="#5a0e1a" />
        </linearGradient>
        <radialGradient id="ox-ruby" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ff7183" />
          <stop offset="45%" stopColor="#e02a40" />
          <stop offset="100%" stopColor="#7d0c1c" />
        </radialGradient>
        <radialGradient id="ox-sapphire" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#8fb4ff" />
          <stop offset="45%" stopColor="#2f5fd0" />
          <stop offset="100%" stopColor="#102a6b" />
        </radialGradient>
      </defs>

      {/* gold frame (slightly larger, drawn behind) */}
      <g fill="url(#ox-gold)" stroke="#8a6d33" strokeWidth="0.6" strokeLinejoin="round">
        <rect x="33.5" y="7" width="13" height="102" rx="3.5" />
        <rect x="23" y="22" width="34" height="9.5" rx="3" />
        <rect x="8" y="44" width="64" height="13" rx="3.5" />
        <rect x="20" y="76" width="40" height="9" rx="3" transform="rotate(-16 40 80.5)" />
      </g>
      {/* red enamel body (inset) */}
      <g fill="url(#ox-body)">
        <rect x="36" y="9.5" width="8" height="97" rx="2.5" />
        <rect x="25.5" y="24.3" width="29" height="5" rx="2" />
        <rect x="10.5" y="46.5" width="59" height="8.3" rx="2.5" />
        <rect x="22.5" y="78.2" width="35" height="4.8" rx="2" transform="rotate(-16 40 80.5)" />
      </g>

      {/* inlaid gems */}
      {gem(40, 50.5, 4.6, 'ruby')}      {/* center — ruby */}
      {gem(13.5, 50.5, 3, 'sapphire')}  {/* left arm */}
      {gem(66.5, 50.5, 3, 'sapphire')}  {/* right arm */}
      {gem(40, 12.5, 2.6, 'sapphire')}  {/* top */}
      {gem(40, 103, 2.6, 'sapphire')}   {/* bottom */}
      {gem(40, 27, 2.1, 'ruby')}        {/* titulus */}
      {gem(40, 68, 2.6, 'ruby')}        {/* lower stem */}
      {gem(40, 86, 2.3, 'ruby')}        {/* near foot */}
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
