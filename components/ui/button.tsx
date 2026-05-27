import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-coral text-white hover:bg-coral-dark shadow-warm hover:shadow-candlelight border border-coral-dark/40',
        cream:
          'bg-gradient-to-b from-cream to-cream-card text-navy hover:from-cream-card hover:to-cream-deep border border-gold/50 shadow-warm hover:shadow-warm-md',
        outline:
          'border-2 border-burgundy/40 bg-transparent text-burgundy hover:bg-burgundy hover:text-white shadow-sm',
        ghost: 'hover:bg-cream-card text-navy',
        navy: 'bg-navy text-cream hover:bg-navy-dark shadow-warm-md',
        gold:
          'bg-gradient-to-b from-gold to-gold-dark text-navy-dark hover:shadow-candlelight border border-gold-dark/50',
        link: 'text-coral underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-13 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';

export { Button, buttonVariants };
