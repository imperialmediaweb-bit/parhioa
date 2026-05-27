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
        'font-serif italic uppercase tracking-[0.18em] text-xs text-coral mb-3',
        align === 'center' && 'text-center',
        className,
      )}
    >
      {children}
    </p>
  );
}
