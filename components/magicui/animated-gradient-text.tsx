import { cn } from '@/lib/utils';

export function AnimatedGradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-block bg-[linear-gradient(110deg,#c4513f,45%,#c8a87a,55%,#c4513f)] bg-[length:200%_100%] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]',
        className,
      )}
      style={{ animation: 'shimmer 4s linear infinite' }}
    >
      {children}
    </span>
  );
}
