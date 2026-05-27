import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  iconSrc?: string;
}

export function Logo({
  className,
  showText = true,
  size = 'default',
  iconSrc = '/logo.png',
}: LogoProps) {
  const dim = size === 'sm' ? 56 : size === 'lg' ? 96 : size === 'xl' ? 128 : 76;

  return (
    <Link
      href="/"
      className={cn('flex items-center gap-4 group whitespace-nowrap', className)}
      aria-label="Parohia Sf. Cuvioasă Teodora de la Sihla — acasă"
    >
      <img
        src={iconSrc}
        alt="Icoană Sfânta Cuvioasă Teodora de la Sihla"
        width={dim}
        height={dim}
        className="object-contain flex-shrink-0 transition-transform group-hover:scale-105 drop-shadow-sm"
        style={{ width: dim, height: dim }}
      />
      {showText && (
        <span className="flex flex-col leading-[1.15]">
          <span className="font-ecclesia text-[18px] sm:text-[20px] font-bold uppercase tracking-wider text-lavender-dark">
            Parohia
          </span>
          <span className="font-ecclesia text-[16px] sm:text-[17px] font-bold uppercase tracking-wider text-burgundy">
            Sf. Cuv. Teodora
          </span>
          <span className="font-ecclesia text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.12em] text-lavender-dark">
            de la Sihla · Botoșani
          </span>
        </span>
      )}
    </Link>
  );
}
