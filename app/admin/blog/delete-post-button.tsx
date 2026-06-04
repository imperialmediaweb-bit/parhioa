'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export function DeletePostButton({
  id,
  title,
  adminKey,
}: {
  id: number;
  title: string;
  adminKey?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();

  const onDelete = () => {
    startTransition(async () => {
      const res = await fetch('/api/admin/posts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, key: adminKey }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || 'Nu am putut șterge articolul.');
        setConfirm(false);
      }
    });
  };

  if (confirm) {
    return (
      <span className="inline-flex items-center gap-1">
        <span className="text-xs text-red-700">Sigur?</span>
        <button
          onClick={onDelete}
          disabled={pending}
          className="px-2 py-0.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {pending ? '…' : 'Da, șterge'}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="px-2 py-0.5 text-xs bg-gray-200 rounded hover:bg-gray-300"
        >
          Nu
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="p-1.5 rounded hover:bg-red-50 text-ink-soft hover:text-red-600"
      title={`Șterge "${title}"`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
