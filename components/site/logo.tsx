import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className, mark = true }: { className?: string; mark?: boolean }) {
  return (
    <Link href="/" className={cn('flex items-center gap-3 group', className)}>
      {mark && (
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-light text-white shadow-sm transition-transform group-hover:scale-105">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
            <path d="M11 2h2v6h6v2h-6v3.5L23 16v2H1v-2l10-2.5V10H5V8h6V2z" />
          </svg>
        </span>
      )}
      <span className="font-display text-[15px] font-bold leading-tight text-navy">
        Parohia &quot;Sf.
        <br />
        Cuvioasă Teodora
        <br />
        de la Sihla&quot;
      </span>
    </Link>
  );
}
