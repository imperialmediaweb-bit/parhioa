import { cn } from '@/lib/utils';

/**
 * Decorative Byzantine flourish — a vegetal/scroll motif used around
 * section headings and corners. Pairs with CrossDivider.
 */
export function Ornament({
  className,
  width = 80,
  flip = false,
  color = 'currentColor',
}: {
  className?: string;
  width?: number;
  flip?: boolean;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 80 24"
      width={width}
      height={(width * 24) / 80}
      className={cn(className, flip && 'scale-x-[-1]')}
      fill={color}
      aria-hidden
    >
      {/* Central knot */}
      <circle cx="40" cy="12" r="2.5" />
      <circle cx="40" cy="12" r="5" fill="none" stroke={color} strokeWidth="1" />
      {/* Scrolling vine going right */}
      <path
        d="M45 12 Q 50 7, 55 12 T 65 12 T 75 12"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Leaves on the right vine */}
      <ellipse cx="55" cy="9" rx="2.5" ry="1.5" transform="rotate(-30 55 9)" />
      <ellipse cx="65" cy="15" rx="2" ry="1.2" transform="rotate(30 65 15)" />
      {/* Scrolling vine going left */}
      <path
        d="M35 12 Q 30 17, 25 12 T 15 12 T 5 12"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="25" cy="15" rx="2.5" ry="1.5" transform="rotate(30 25 15)" />
      <ellipse cx="15" cy="9" rx="2" ry="1.2" transform="rotate(-30 15 9)" />
      {/* Trefoil end caps */}
      <circle cx="3" cy="12" r="2" />
      <circle cx="77" cy="12" r="2" />
    </svg>
  );
}

/**
 * A title wrapped with Byzantine ornaments left and right.
 * Use for hero subtitles or section headings.
 */
export function OrnatedLabel({
  children,
  className,
  align = 'center',
}: {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 font-ceremonial uppercase tracking-[0.22em] text-xs text-burgundy',
        align === 'center' ? 'justify-center' : 'justify-start',
        className,
      )}
    >
      <Ornament width={50} className="text-gold-dark" />
      <span>{children}</span>
      <Ornament width={50} flip className="text-gold-dark" />
    </div>
  );
}

/**
 * Small decorative star/cross — for inline use inside text or to mark items.
 */
export function StarCross({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      {/* 8-point star */}
      <path d="M12 1 L13.5 8 L20 6.5 L15.5 12 L20 17.5 L13.5 16 L12 23 L10.5 16 L4 17.5 L8.5 12 L4 6.5 L10.5 8 Z" />
      {/* Cross overlay */}
      <rect x="11.2" y="7" width="1.6" height="10" rx="0.3" fill="#FBF6EE" />
      <rect x="8.5" y="11.2" width="7" height="1.6" rx="0.3" fill="#FBF6EE" />
    </svg>
  );
}
