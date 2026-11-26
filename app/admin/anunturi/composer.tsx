'use client';

import { useState } from 'react';
import { Send, Loader2, Check, BellRing } from 'lucide-react';

export function AnnounceComposer({
  adminKey = '',
  subscriberCount,
}: {
  adminKey?: string;
  subscriberCount: number;
}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const send = async () => {
    if (!title.trim() || !body.trim()) {
      setError('Scrie titlul și textul anunțului.');
      return;
    }
    if (
      !confirm(
        `Trimiți acest anunț către ${subscriberCount} ${
          subscriberCount === 1 ? 'telefon abonat' : 'telefoane abonate'
        }?`,
      )
    )
      return;
    setSending(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/admin/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: adminKey, title, body, url: url || '/' }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Nu am putut trimite.');
      setResult(`Trimis la ${d.sent} ${d.sent === 1 ? 'telefon' : 'telefoane'}.`);
      setTitle('');
      setBody('');
      setUrl('');
    } catch (e: any) {
      setError(e.message || 'Eroare.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gold/50 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <BellRing className="h-4 w-4 text-gold-dark" />
        <h2 className="font-display text-lg text-burgundy">Trimite un anunț</h2>
      </div>
      <p className="text-xs text-ink-soft mb-4">
        Ajunge pe telefoanele celor care au instalat aplicația și au pornit
        anunțurile — acum <strong>{subscriberCount}</strong>.
      </p>

      <label className="text-xs text-ink-soft">Titlu</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={120}
        placeholder="Ex: Priveghere mâine seară"
        className="mt-1 mb-3 w-full rounded-xl border border-border px-3 py-2 text-navy outline-none focus:border-gold"
      />

      <label className="text-xs text-ink-soft">Text</label>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={300}
        rows={3}
        placeholder="Ex: Vă așteptăm mâine la ora 18:00 la slujba de priveghere."
        className="mt-1 mb-1 w-full rounded-xl border border-border px-3 py-2 text-navy outline-none focus:border-gold resize-none"
      />
      <p className="text-[11px] text-ink-soft text-right mb-3">{body.length}/300</p>

      <label className="text-xs text-ink-soft">Link la apăsare (opțional)</label>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="/blog/articol  sau  lași gol (deschide pagina principală)"
        className="mt-1 mb-4 w-full rounded-xl border border-border px-3 py-2 text-navy outline-none focus:border-gold"
      />

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      {result && (
        <p className="text-sm text-green-700 mb-3 flex items-center gap-1">
          <Check className="h-4 w-4" /> {result}
        </p>
      )}

      <button
        type="button"
        onClick={send}
        disabled={sending || subscriberCount === 0}
        className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-burgundy text-cream py-2.5 font-medium hover:bg-burgundy-dark transition disabled:opacity-60"
      >
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {sending ? 'Se trimite…' : 'Trimite anunțul'}
      </button>
      {subscriberCount === 0 && (
        <p className="text-[11px] text-ink-soft mt-2 text-center">
          Încă nimeni nu s-a abonat. Spune oamenilor să instaleze aplicația și să
          apese „Primește anunțuri”.
        </p>
      )}
    </div>
  );
}
