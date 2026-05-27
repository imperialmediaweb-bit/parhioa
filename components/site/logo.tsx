import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  iconSrc?: string;
}

// Responsive sizes: [mobile, sm, lg]
const SIZE_CLASSES: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'w-12 h-12 sm:w-14 sm:h-14',
  default: 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24',
  lg: 'w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28',
  xl: 'w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36',
};

export function Logo({
  className,
  showText = true,
  size = 'default',
  iconSrc = 'https://res.cloudinary.com/dghmoelly/image/upload/v1779891768/Screenshot_101-removebg-preview_yxrjmd.png',
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
        <span className="flex flex-col leading-[1.05]">
          <span className="font-ecclesia text-[17px] sm:text-[22px] lg:text-[26px] font-bold uppercase tracking-wider text-lavender-dark">
            Parohia
          </span>
          <span className="font-ecclesia text-[14px] sm:text-[18px] lg:text-[22px] font-bold uppercase tracking-wider text-burgundy">
            Sf. Cuv. Teodora
          </span>
          <span className="font-ecclesia text-[11px] sm:text-[13px] lg:text-[15px] font-semibold uppercase tracking-[0.1em] text-lavender-dark">
            de la Sihla · Botoșani
          </span>
        </span>
      )}
    </Link>
  );
}
