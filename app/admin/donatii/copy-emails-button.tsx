'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyEmailsButton({ emails }: { emails: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(emails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={!emails}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-burgundy/40 bg-cream-card text-burgundy text-xs font-medium hover:bg-burgundy/10 disabled:opacity-50 transition-colors"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" /> Copiat
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" /> Copy emails
        </>
      )}
    </button>
  );
}
