import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-ceremonial uppercase tracking-[0.18em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary church CTA: deep burgundy with gold hairline
        default:
          'text-cream bg-gradient-to-b from-[#7a201a] to-[#4f120d] hover:from-[#651a14] hover:to-[#3a0d09] shadow-[0_8px_22px_-10px_rgba(101,26,20,0.65)] hover:shadow-[0_12px_28px_-10px_rgba(101,26,20,0.85)] ring-1 ring-gold/40 hover:ring-gold/70',
        // Matte gold — secondary, for "ctitor" highlight
        gold:
          'text-burgundy-dark bg-gradient-to-b from-[#EAC784] to-[#c9a361] hover:from-[#f0d29a] hover:to-[#b8923f] shadow-[0_8px_22px_-10px_rgba(184,138,46,0.55)] ring-1 ring-burgundy/30',
        // Outline — for tertiary actions on cream backgrounds
        outline:
          'bg-transparent text-burgundy ring-1 ring-burgundy/40 hover:bg-burgundy hover:text-cream hover:ring-burgundy',
        // Ghost — for cards / inline links
        ghost:
          'bg-transparent text-burgundy hover:bg-burgundy/8 hover:text-burgundy-dark',
        // Cream button — for dark backgrounds (hero, footer)
        cream:
          'text-burgundy-dark bg-gradient-to-b from-cream to-[#f0e4c8] hover:from-white hover:to-cream-card ring-1 ring-gold/50 hover:ring-gold shadow-warm',
        link: 'text-burgundy underline-offset-4 hover:underline normal-case tracking-normal',
      },
      size: {
        default: 'h-11 px-7 text-[12px] min-w-[160px]',
        sm: 'h-9 px-5 text-[11px] min-w-[120px]',
        lg: 'h-13 px-9 text-[13px] min-w-[200px]',
        icon: 'h-11 w-11 min-w-0',
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
