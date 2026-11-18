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
  // kept for API compatibility; the generated icon carries its own colors
  fill: _fill,
  accent: _accent,
}: {
  height?: number;
  className?: string;
  fill?: string;
  accent?: string;
}) {
  return (
    <img
      src="https://pub-49f4280024fa4ca2b8a4f6323442efe8.r2.dev/cruce-ortodoxa.png"
      alt="Cruce ortodoxă — Răstignirea Domnului"
      style={{ height, width: "auto" }}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}

function Diamond({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 12 12" className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M6 0 L12 6 L6 12 L0 6 Z" />
    </svg>
  );
}
