import Link from 'next/link';
import { cn } from '@/lib/utils';
import { OrthodoxCross } from './cross-divider';

interface HeroProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
}

export function Hero({ title, subtitle, breadcrumb, className }: HeroProps) {
  return (
    <section className={cn('relative isolate overflow-hidden', className)}>
      <div
        className="relative px-6 py-24 sm:py-32 text-center text-cream"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(26, 6, 4, 0.85) 0%, rgba(61, 15, 10, 0.92) 100%), url("https://images.unsplash.com/photo-1543968996-ee822b8176ba?auto=format&fit=crop&w=2000&q=70")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Top gold hairline */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        {/* Bottom gold hairline */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        {/* Candlelight glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(234, 199, 132, 0.22), transparent 60%)',
          }}
        />


        <div className="relative mx-auto max-w-3xl space-y-5 animate-fade-up">
          <div className="flex justify-center mb-3 drop-shadow-[0_4px_14px_rgba(0,0,0,0.5)]">
            <OrthodoxCross height={56} />
          </div>
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="font-ceremonial uppercase text-[10px] tracking-[0.32em] text-gold/85 flex items-center justify-center gap-2 flex-wrap">
              {breadcrumb.map((b, i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="text-gold/40">·</span>}
                  {b.href ? (
                    <Link href={b.href} className="hover:text-gold transition-colors">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-cream">{b.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl !text-cream leading-[1.1] tracking-wide drop-shadow-[0_3px_18px_rgba(0,0,0,0.65)]">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-base sm:text-lg lg:text-xl text-cream/90 font-serif italic drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
