'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  className?: string;
  label?: string;
}

export function CopyButton({ value, className, label = 'Copiază' }: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore — older browsers
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-gold/40 bg-white hover:bg-cream-card transition-colors text-xs font-medium',
        copied ? 'text-green-700 border-green-300 bg-green-50' : 'text-burgundy',
        className,
      )}
      aria-label={label}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" /> Copiat
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" /> {label}
        </>
      )}
    </button>
  );
}
