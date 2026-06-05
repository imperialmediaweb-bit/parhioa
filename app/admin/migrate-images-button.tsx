'use client';

import { useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

interface Result {
  total: number;
  alreadyOnCloudinary: number;
  freshlyUploaded: number;
  dead: number;
  skipped: number;
  log: string[];
}

export function MigrateImagesButton({ adminKey }: { adminKey?: string }) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    if (
      !confirm(
        'Se va încerca recuperarea tuturor imaginilor cu URL non-Cloudinary. Poate dura 1-5 minute. Continui?',
      )
    ) {
      return;
    }
    setPending(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/admin/migrate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: adminKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Eroare la migrare');
      } else {
        setResult(data);
      }
    } catch (e: any) {
      setError(e?.message || 'Eroare de rețea');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <h2 className="font-display text-xl text-burgundy mb-2">
        Recuperare imagini blog
      </h2>
      <p className="text-xs text-ink-soft mb-4 leading-relaxed">
        Caută în baza de date pozele cu URL non-Cloudinary (sparte după mutarea
        site-ului) și încearcă să le repare. Întâi verifică dacă sunt deja pe
        Cloudinary la calea așteptată; dacă nu, încearcă upload din URL-ul vechi.
      </p>
      <button
        onClick={onClick}
        disabled={pending}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-burgundy text-cream font-medium hover:bg-burgundy-dark disabled:opacity-60 transition-colors"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Se procesează…
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" /> Repară imaginile blog
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="rounded-lg bg-green-50 border border-green-200 p-3">
              <p className="font-display text-2xl font-bold text-green-700">
                {result.alreadyOnCloudinary}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-green-800 mt-1">
                deja pe Cloudinary
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <p className="font-display text-2xl font-bold text-blue-700">
                {result.freshlyUploaded}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-blue-800 mt-1">
                upload nou
              </p>
            </div>
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="font-display text-2xl font-bold text-red-700">{result.dead}</p>
              <p className="text-[10px] uppercase tracking-wider text-red-800 mt-1">
                sursă moartă
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
              <p className="font-display text-2xl font-bold text-gray-700">
                {result.skipped}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-gray-800 mt-1">
                sărite
              </p>
            </div>
          </div>
          <details className="text-xs">
            <summary className="cursor-pointer text-burgundy hover:underline">
              Vezi log-ul detaliat ({result.log.length} linii)
            </summary>
            <div className="mt-2 p-3 bg-cream-card/60 rounded-lg font-mono text-[11px] leading-relaxed max-h-80 overflow-y-auto">
              {result.log.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </details>
          {result.dead > 0 && (
            <p className="text-xs text-ink-soft italic">
              Cele {result.dead} pierdute vor afișa iconul Sf. Teodora pe site
              până le înlocuiești manual din editarea articolelor.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
