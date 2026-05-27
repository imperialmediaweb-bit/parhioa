import { cn } from '@/lib/utils';

/**
 * Authentic Romanian Orthodox cross — modelled after a carved-wood
 * Russian/Greek style cross with cloverleaf (trefoil) ends. Each arm
 * terminates in three large rounded lobes meeting at a slim neck.
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
  const h = size === 'sm' ? 48 : size === 'lg' ? 96 : 68;

  const palette = {
    light: { cross: '#81231B', inner: '#EAC784', rule: 'from-burgundy/40', dot: 'text-gold-dark' },
    dark: { cross: '#EAC784', inner: '#FBF6EE', rule: 'from-gold/40', dot: 'text-gold' },
    gold: { cross: '#c9a361', inner: '#FBF6EE', rule: 'from-gold/50', dot: 'text-burgundy' },
  }[variant];

  return (
    <div
      className={cn('flex items-center justify-center gap-4 my-10 select-none', className)}
      aria-hidden
    >
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
 * Romanian Orthodox cross SVG — carved-wood style with trefoil ends.
 * The path describes the full silhouette: each arm flares into three
 * round lobes, then a slim neck, then thickens into the cross body.
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
      viewBox="0 0 200 280"
      height={height}
      width={(height * 200) / 280}
      className={className}
      aria-hidden
    >
      {/* Main silhouette — single filled path so it reads as one carved object */}
      <path
        fill={fill}
        d="
          M 100 8
          C 92 8, 86 14, 86 22
          C 86 28, 88 32, 90 35
          C 82 35, 76 41, 76 49
          C 76 57, 82 63, 90 63
          C 92 63, 94 63, 96 62
          L 96 80
          L 60 80
          C 60 72, 54 66, 46 66
          C 38 66, 32 72, 32 80
          C 32 86, 35 90, 39 92
          C 32 92, 26 98, 26 106
          C 26 114, 32 120, 40 120
          C 48 120, 54 114, 54 106
          C 56 106, 58 105, 60 105
          L 96 105
          L 96 200
          L 78 200
          C 78 192, 72 186, 64 186
          C 56 186, 50 192, 50 200
          C 50 206, 53 211, 57 213
          C 49 213, 43 219, 43 227
          C 43 235, 49 241, 57 241
          C 65 241, 71 235, 71 227
          C 71 226, 71 225, 70 224
          L 90 220
          L 92 248
          C 84 248, 78 254, 78 262
          C 78 270, 84 276, 92 276
          L 108 276
          C 116 276, 122 270, 122 262
          C 122 254, 116 248, 108 248
          L 110 220
          L 130 224
          C 129 225, 129 226, 129 227
          C 129 235, 135 241, 143 241
          C 151 241, 157 235, 157 227
          C 157 219, 151 213, 143 213
          C 147 211, 150 206, 150 200
          C 150 192, 144 186, 136 186
          C 128 186, 122 192, 122 200
          L 104 200
          L 104 105
          L 140 105
          C 142 105, 144 106, 146 106
          C 146 114, 152 120, 160 120
          C 168 120, 174 114, 174 106
          C 174 98, 168 92, 161 92
          C 165 90, 168 86, 168 80
          C 168 72, 162 66, 154 66
          C 146 66, 140 72, 140 80
          L 104 80
          L 104 62
          C 106 63, 108 63, 110 63
          C 118 63, 124 57, 124 49
          C 124 41, 118 35, 110 35
          C 112 32, 114 28, 114 22
          C 114 14, 108 8, 100 8
          Z
        "
      />
      {/* Inner outline — subtle gold accent following the silhouette */}
      <path
        fill="none"
        stroke={accent}
        strokeWidth="1.2"
        opacity="0.55"
        d="
          M 96 80 L 60 80
          M 96 105 L 60 105
          M 96 200 L 78 200
          M 104 200 L 122 200
          M 104 80 L 140 80
          M 104 105 L 140 105
        "
      />
      {/* Gold dot at the crossing */}
      <circle cx="100" cy="92" r="4" fill={accent} />
      {/* Inner highlight stroke for depth */}
      <path
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        opacity="0.35"
        d="
          M 96 18 L 96 65
          M 96 105 L 96 195
          M 96 245 L 96 268
          M 32 92 L 60 92
          M 140 92 L 168 92
        "
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
