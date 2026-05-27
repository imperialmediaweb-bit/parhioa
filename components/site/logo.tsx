import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  showText = true,
  size = 'default',
}: {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'default' | 'lg';
}) {
  const dim = size === 'sm' ? 44 : size === 'lg' ? 72 : 56;

  return (
    <Link
      href="/"
      className={cn('flex items-center gap-3 group whitespace-nowrap', className)}
      aria-label="Parohia Sf. Cuvioasă Teodora de la Sihla — acasă"
    >
      <Image
        src="/logo.png"
        alt="Icoană Sfânta Cuvioasă Teodora de la Sihla"
        width={dim}
        height={dim}
        priority
        className="object-contain flex-shrink-0 transition-transform group-hover:scale-105"
      />
      {showText && (
        <span className="flex flex-col leading-[1.1]">
          <span className="font-ecclesia text-[15px] font-bold uppercase tracking-wide text-lavender-dark">
            Parohia
          </span>
          <span className="font-ecclesia text-[12px] font-bold uppercase tracking-wider text-burgundy">
            Sf. Cuv. Teodora
          </span>
          <span className="font-ecclesia text-[11px] font-semibold uppercase tracking-wider text-lavender-dark">
            de la Sihla · Botoșani
          </span>
        </span>
      )}
    </Link>
  );
}
