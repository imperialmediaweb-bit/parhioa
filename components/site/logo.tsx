import Link from 'next/link';
import { cn } from '@/lib/utils';
import { opt } from '@/lib/img';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  iconSrc?: string;
  /** Present the icon inside a gilded „kiot" frame, like a venerated icon. */
  framed?: boolean;
}

// Responsive sizes: [mobile, sm, lg]. Bumped mobile values so the icon
// reads clearly on phones — the icon is the parish's visual anchor and was
// too small on small screens.
const SIZE_CLASSES: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'w-14 h-14 sm:w-16 sm:h-16',
  // Balanced with the 3-line wordmark next to it in the header.
  default: 'w-[72px] h-[72px] sm:w-20 sm:h-20 lg:w-[88px] lg:h-[88px]',
  lg: 'w-24 h-24 sm:w-28 sm:h-28',
  xl: 'w-28 h-28 sm:w-32 sm:h-32',
};

export function Logo({
  className,
  showText = true,
  size = 'default',
  iconSrc = 'https://pub-49f4280024fa4ca2b8a4f6323442efe8.r2.dev/sf_theodora_de_la_sihla_ri9rz2.png',
  framed = false,
}: LogoProps) {
  const iconImg = (
    <img
      src={opt(iconSrc, 400)}
      alt="Icoană Sfânta Cuvioasă Teodora de la Sihla"
      className={cn(
        'object-contain flex-shrink-0 transition-transform group-hover:scale-[1.04] drop-shadow-sm',
        SIZE_CLASSES[size],
      )}
    />
  );
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-3 sm:gap-4 group whitespace-nowrap', className)}
      aria-label="Parohia Sf. Cuvioasă Teodora de la Sihla — acasă"
    >
      {framed ? (
        <span
          className="relative flex items-center justify-center rounded-[14px] p-1.5 sm:p-2 flex-shrink-0 shadow-[0_8px_22px_-10px_rgba(101,26,20,0.5)]"
          style={{
            background:
              'radial-gradient(circle at 50% 38%, #fffaf0 0%, #f6ead1 60%, #efdcbb 100%)',
          }}
        >
          {/* Double gilded border — kiot (icon case) feel */}
          <span className="pointer-events-none absolute inset-[3px] rounded-[11px] border border-gold/70" />
          <span className="pointer-events-none absolute inset-[6px] rounded-[9px] border border-burgundy/20" />
          {iconImg}
        </span>
      ) : (
        iconImg
      )}
      {showText && (
        <span className="flex flex-col leading-[1.05] min-w-0">
          {/* Mobile: 2 compact lines */}
          <span className="sm:hidden font-ecclesia text-[15px] font-bold uppercase tracking-wider text-burgundy leading-tight">
            Sf. Cuv. Teodora
          </span>
          <span className="sm:hidden font-ecclesia text-[11px] font-semibold uppercase tracking-[0.08em] text-lavender-dark leading-tight mt-0.5">
            de la Sihla <span className="text-gold-dark">·</span> Botoșani
          </span>
          {/* Tablet+: 3 full lines with gold accents */}
          <span className="hidden sm:flex items-center gap-2 font-ecclesia text-[12px] lg:text-[13px] font-semibold uppercase tracking-[0.3em] text-lavender-dark">
            Parohia
            <span className="h-px w-7 lg:w-9 bg-gradient-to-r from-gold/70 to-transparent" aria-hidden />
          </span>
          <span className="hidden sm:block font-ecclesia text-[16px] lg:text-[19px] font-bold uppercase tracking-wide text-burgundy leading-none mt-0.5">
            Sf. Cuv. Teodora
          </span>
          <span className="hidden sm:flex items-center gap-1.5 font-ecclesia text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.14em] text-lavender-dark mt-1">
            <span className="text-gold-dark text-[9px] leading-none">☩</span>
            de la Sihla <span className="text-gold-dark">·</span> Botoșani
          </span>
        </span>
      )}
    </Link>
  );
}
