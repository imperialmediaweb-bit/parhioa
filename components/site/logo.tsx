import Link from 'next/link';
import { getImages } from '@/lib/images';
import { cn } from '@/lib/utils';

export async function Logo({
  className,
  showText = true,
  size = 'default',
  variant = 'header',
}: {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  variant?: 'header' | 'footer' | 'hero';
}) {
  const dim = size === 'sm' ? 56 : size === 'lg' ? 96 : size === 'xl' ? 128 : 76;

  const IMG = await getImages();
  // Prefer a custom /logo.png if uploaded; otherwise fall back to the
  // parish icon from Cloudinary (set up by the WP import).
  const logoSrc = IMG.parishLogo || '/logo.png';

  return (
    <Link
      href="/"
      className={cn('flex items-center gap-4 group whitespace-nowrap', className)}
      aria-label="Parohia Sf. Cuvioasă Teodora de la Sihla — acasă"
    >
      <img
        src={logoSrc}
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
