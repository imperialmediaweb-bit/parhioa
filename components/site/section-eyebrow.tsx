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
        'font-ceremonial uppercase tracking-[0.22em] text-xs text-burgundy mb-3',
        align === 'center' && 'text-center',
        className,
      )}
    >
      {children}
    </p>
  );
}
