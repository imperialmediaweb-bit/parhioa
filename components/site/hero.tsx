import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CrossDivider } from './cross-divider';

interface HeroProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
}

export function Hero({ title, subtitle, breadcrumb, className }: HeroProps) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden -mb-12 sm:-mb-16',
        className,
      )}
    >
      <div
        className="relative bg-navy-dark px-6 py-24 sm:py-32 text-center text-white"
        style={{
          backgroundImage:
            'linear-gradient(rgba(19, 31, 51, 0.7), rgba(19, 31, 51, 0.8)), url("https://images.unsplash.com/photo-1543968996-ee822b8176ba?auto=format&fit=crop&w=2000&q=70")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto max-w-3xl space-y-5 animate-fade-up">
          <CrossDivider size="sm" variant="dark" className="my-0 mb-4" />
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl !text-white font-semibold leading-[1.1] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-white/90 font-serif">
              {subtitle}
            </p>
          )}
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="text-sm text-white/80">
              {breadcrumb.map((b, i) => (
                <span key={i}>
                  {i > 0 && <span className="mx-2 opacity-60">›</span>}
                  {b.href ? (
                    <Link href={b.href} className="hover:text-white transition-colors">
                      {b.label}
                    </Link>
                  ) : (
                    <span>{b.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
        </div>
      </div>
      {/* Curved bottom edge */}
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="block w-full -mt-px h-12 sm:h-20 text-white"
        aria-hidden
      >
        <path d="M0,0 C480,80 960,80 1440,0 L1440,80 L0,80 Z" fill="currentColor" />
      </svg>
    </section>
  );
}
