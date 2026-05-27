import { cn } from '@/lib/utils';

export function SectionEyebrow({
  children,
  className,
  align = 'left',
}: {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center';
}) {
  return (
    <p
      className={cn(
        'font-ceremonial uppercase tracking-[0.28em] text-[11px] sm:text-xs text-gold-dark mb-4 flex items-center gap-2.5',
        align === 'center' && 'justify-center',
        className,
      )}
    >
      <span className="inline-block h-px w-7 bg-gold/70" />
      <span className="text-burgundy/80">☩</span>
      <span>{children}</span>
      <span className="text-burgundy/80">☩</span>
      <span className="inline-block h-px w-7 bg-gold/70" />
    </p>
  );
}
