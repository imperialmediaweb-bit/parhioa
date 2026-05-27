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
  sm: 'w-10 h-10 sm:w-11 sm:h-11',
  default: 'w-12 h-12 sm:w-14 sm:h-14 lg:w-15 lg:h-15',
  lg: 'w-13 h-13 sm:w-14 sm:h-14 lg:w-16 lg:h-16',
  xl: 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24',
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
        <span className="hidden sm:flex flex-col leading-[1.05]">
          <span className="font-ecclesia text-[13px] lg:text-[15px] font-bold uppercase tracking-wider text-lavender-dark">
            Parohia
          </span>
          <span className="font-ecclesia text-[15px] lg:text-[17px] font-bold uppercase tracking-wider text-burgundy">
            Sf. Cuv. Teodora
          </span>
          <span className="font-ecclesia text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.1em] text-lavender-dark">
            de la Sihla · Botoșani
          </span>
        </span>
      )}
    </Link>
  );
}
