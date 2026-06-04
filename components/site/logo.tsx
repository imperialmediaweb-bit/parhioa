import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  iconSrc?: string;
}

// Responsive sizes: [mobile, sm, lg]. Bumped mobile values so the icon
// reads clearly on phones — the icon is the parish's visual anchor and was
// too small on small screens.
const SIZE_CLASSES: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'w-14 h-14 sm:w-14 sm:h-14',
  default: 'w-20 h-20 sm:w-20 sm:h-20 lg:w-24 lg:h-24',
  lg: 'w-24 h-24 sm:w-24 sm:h-24 lg:w-28 lg:h-28',
  xl: 'w-28 h-28 sm:w-28 sm:h-28 lg:w-32 lg:h-32',
};

export function Logo({
  className,
  showText = true,
  size = 'default',
  iconSrc = 'https://res.cloudinary.com/dghmoelly/image/upload/v1780574528/sf_theodora_de_la_sihla_ri9rz2.png',
}: LogoProps) {
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-3 sm:gap-4 group whitespace-nowrap', className)}
      aria-label="Parohia Sf. Cuvioasă Teodora de la Sihla — acasă"
    >
      <img
        src={iconSrc}
        alt="Icoană Sfânta Cuvioasă Teodora de la Sihla"
        className={cn(
          'object-contain flex-shrink-0 transition-transform group-hover:scale-105 drop-shadow-sm',
          SIZE_CLASSES[size],
        )}
      />
      {showText && (
        <span className="flex flex-col leading-[1.05] min-w-0">
          {/* Mobile: 2 compact lines */}
          <span className="sm:hidden font-ecclesia text-[13px] font-bold uppercase tracking-wider text-burgundy leading-tight">
            Sf. Cuv. Teodora
          </span>
          <span className="sm:hidden font-ecclesia text-[9.5px] font-semibold uppercase tracking-[0.08em] text-lavender-dark leading-tight">
            de la Sihla · Botoșani
          </span>
          {/* Tablet+: 3 full lines */}
          <span className="hidden sm:block font-ecclesia text-[13px] lg:text-[15px] font-bold uppercase tracking-wider text-lavender-dark">
            Parohia
          </span>
          <span className="hidden sm:block font-ecclesia text-[15px] lg:text-[17px] font-bold uppercase tracking-wider text-burgundy">
            Sf. Cuv. Teodora
          </span>
          <span className="hidden sm:block font-ecclesia text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.1em] text-lavender-dark">
            de la Sihla · Botoșani
          </span>
        </span>
      )}
    </Link>
  );
}
