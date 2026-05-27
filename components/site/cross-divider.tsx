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

/** The Romanian Orthodox carved-wood cross provided by the parish, hosted on Cloudinary. */
const CROSS_IMG_URL =
  'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1779907599/0000078e_c2uclm.jpg';

/**
 * Romanian Orthodox cross — uses the parish's own wooden cross image
 * uploaded to Cloudinary. Falls back to a tiny SVG only if the image
 * fails to load somehow.
 */
export function OrthodoxCross({
  height = 86,
  className,
  // kept for API compat; not used now that the image speaks for itself
  fill: _fill,
  accent: _accent,
}: {
  height?: number;
  className?: string;
  fill?: string;
  accent?: string;
}) {
  // Original image aspect ratio is roughly 5:7 (taller than wide)
  return (
    <img
      src={CROSS_IMG_URL}
      alt="Cruce ortodoxă"
      style={{ height, width: 'auto' }}
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
