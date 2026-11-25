'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Trash2, Undo2 } from 'lucide-react';

export function ItemActions({
  id,
  done,
  adminKey = '',
}: {
  id: number;
  done: boolean;
  adminKey?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const call = async (path: string, extra: Record<string, unknown>) => {
    setBusy(true);
    try {
      await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: adminKey, id, ...extra }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        disabled={busy}
        onClick={() => call('/api/admin/agenda/toggle', { done: !done })}
        title={done ? 'Marchează nefăcut' : 'Marchează făcut'}
        className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-ink-muted hover:text-burgundy hover:border-burgundy transition disabled:opacity-50"
      >
        {done ? <Undo2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          if (confirm('Ștergi această intrare din agendă?')) {
            call('/api/admin/agenda/delete', {});
          }
        }}
        title="Șterge"
        className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-ink-muted hover:text-red-600 hover:border-red-400 transition disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
