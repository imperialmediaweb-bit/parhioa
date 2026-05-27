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
        'font-ceremonial uppercase tracking-[0.22em] text-xs text-burgundy mb-3 flex items-center gap-2',
        align === 'center' && 'justify-center',
        className,
      )}
    >
      <span className="inline-block h-px w-6 bg-gold-dark" />
      <span>{children}</span>
      <span className="inline-block h-px w-6 bg-gold-dark" />
    </p>
  );
}
