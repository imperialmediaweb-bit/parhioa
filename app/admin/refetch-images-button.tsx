'use client';

import { useState } from 'react';
import { Loader2, ImageDown } from 'lucide-react';

interface Result {
  candidates: number;
  recovered: number;
  failed: number;
  log: string[];
}

export function RefetchImagesButton({ adminKey }: { adminKey?: string }) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    if (
      !confirm(
        'Caută poza originală de pe Facebook pentru fiecare articol importat fără imagine, urcă pe Cloudinary și actualizează articolul. Poate dura 2-5 min. Continui?',
      )
    ) {
      return;
    }
    setPending(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/admin/refetch-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: adminKey }),
      });
      const data = await res.json();
      if (!res.ok) setError(data?.error || 'Eroare');
      else setResult(data);
    } catch (e: any) {
      setError(e?.message || 'Eroare rețea');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <h2 className="font-display text-xl text-burgundy mb-2">
        Recuperare poze originale Facebook
      </h2>
      <p className="text-xs text-ink-soft mb-4 leading-relaxed">
        Pentru fiecare articol importat de pe Facebook care nu are imagine
        (logo-ul rss.app a fost ignorat ca poză duplicat), încearcă să extragă
        poza adevărată din pagina Facebook (via mbasic + og:image), o urcă
        pe Cloudinary și o atașează articolului.
      </p>
      <button
        onClick={onClick}
        disabled={pending}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-burgundy text-cream font-medium hover:bg-burgundy-dark disabled:opacity-60 transition-colors"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Se caută…
          </>
        ) : (
          <>
            <ImageDown className="h-4 w-4" /> Caută pozele originale
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
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat value={result.candidates} label="candidați" color="gray" />
            <Stat value={result.recovered} label="recuperate" color="green" />
            <Stat value={result.failed} label="eșuate" color="red" />
          </div>
          <details className="text-xs">
            <summary className="cursor-pointer text-burgundy hover:underline">
              Vezi log ({result.log.length})
            </summary>
            <div className="mt-2 p-3 bg-cream-card/60 rounded-lg font-mono text-[11px] leading-relaxed max-h-80 overflow-y-auto">
              {result.log.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </details>
          {result.failed > 0 && (
            <p className="text-xs text-ink-soft italic">
              Facebook blochează scraper-ele agresiv. Pentru cele eșuate, ai 2
              opțiuni: deschizi articolul din /admin/blog și pui manual URL-ul
              imaginii (salvezi poza din Facebook pe Cloudinary cu drag&drop pe
              cloudinary.com), sau aștepți și mai încerci.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: 'green' | 'red' | 'gray';
}) {
  const map: Record<string, string> = {
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
  };
  return (
    <div className={`rounded-lg border p-3 ${map[color]}`}>
      <p className="font-display text-2xl font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}
