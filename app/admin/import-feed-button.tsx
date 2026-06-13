'use client';

import { useState } from 'react';
import { Loader2, Rss } from 'lucide-react';

interface Result {
  total: number;
  imported: number;
  skipped: number;
  failed: number;
  log: string[];
  aiEnabled: boolean;
}

export function ImportFeedButton({ adminKey }: { adminKey?: string }) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    if (
      !confirm(
        'Importă postările noi de pe Facebook ca articole de blog. Pozele se urcă pe Cloudinary. Poate dura 1-5 minute. Continui?',
      )
    ) {
      return;
    }
    setPending(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/admin/import-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: adminKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Eroare la import');
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
        Import Facebook → Blog
      </h2>
      <p className="text-xs text-ink-soft mb-4 leading-relaxed">
        Citește postările noi din pagina de Facebook a parohiei (via rss.app) și
        le salvează ca articole de blog: titlu, conținut HTML, categoria potrivită
        (Vești / Lucrări / Evenimente / Slujbe), poza pe Cloudinary. Articolele
        deja importate sunt sărite (dedup pe sourceGuid).
        {result?.aiEnabled === false && (
          <span className="block mt-2 text-amber-700">
            ⚠️ <code>OPENAI_API_KEY</code> nu e setat — articolele vor folosi textul
            brut. Setează cheia în Railway pentru rescriere ChatGPT automată.
          </span>
        )}
      </p>
      <button
        onClick={onClick}
        disabled={pending}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-burgundy text-cream font-medium hover:bg-burgundy-dark disabled:opacity-60 transition-colors"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Se importă…
          </>
        ) : (
          <>
            <Rss className="h-4 w-4" /> Importă postări noi
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
            <Stat value={result.imported} label="importate" color="green" />
            <Stat value={result.skipped} label="sărite" color="gray" />
            <Stat value={result.failed} label="eșuate" color="red" />
            <Stat value={result.total} label="total în feed" color="blue" />
          </div>
          <p className="text-xs text-ink-soft">
            {result.aiEnabled
              ? '🤖 Rescriere ChatGPT activă'
              : '✍️ Text brut (fără ChatGPT)'}
          </p>
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
  color: 'green' | 'red' | 'gray' | 'blue';
}) {
  const map: Record<string, string> = {
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
  };
  return (
    <div className={`rounded-lg border p-3 ${map[color]}`}>
      <p className="font-display text-2xl font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}
