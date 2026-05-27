import { cn } from '@/lib/utils';

/**
 * Orthodox-style cross divider — three crossbars, optional flourishes.
 * Used between sections to add a discreet ecclesiastical accent.
 */
export function CrossDivider({
  className,
  size = 'default',
}: {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}) {
  const h = size === 'sm' ? 30 : size === 'lg' ? 60 : 44;

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4 my-8',
        className,
      )}
      aria-hidden
    >
      <span className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-burgundy/40" />
      <svg
        viewBox="0 0 60 80"
        height={h}
        className="text-burgundy"
        fill="currentColor"
      >
        {/* Orthodox three-bar cross */}
        {/* Vertical post */}
        <rect x="28" y="6" width="4" height="68" rx="1" />
        {/* Top bar (INRI titulus) */}
        <rect x="22" y="14" width="16" height="3" rx="0.5" />
        {/* Main horizontal bar */}
        <rect x="14" y="26" width="32" height="4" rx="1" />
        {/* Slanted footrest bar (suppedaneum) */}
        <g transform="rotate(20 30 56)">
          <rect x="14" y="54" width="32" height="3" rx="0.5" />
        </g>
        {/* Decorative trefoils on the main bar tips */}
        <circle cx="14" cy="28" r="2.5" />
        <circle cx="46" cy="28" r="2.5" />
        <circle cx="30" cy="6" r="2.5" />
      </svg>
      <span className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-burgundy/40" />
    </div>
  );
}
