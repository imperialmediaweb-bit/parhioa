'use client';

import { useState } from 'react';

/**
 * Admin login screen. Shown instead of the sensitive page when there is no
 * valid session. Exchanges the secret code for a session cookie, then reloads.
 */
export function AdminGate() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Cod greșit.');
      }
      // Reload to the same page WITHOUT any ?key in the URL.
      window.location.replace(window.location.pathname);
    } catch (err: any) {
      setError(err.message || 'Eroare.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-gold/40 bg-white p-7 shadow-[0_20px_50px_-24px_rgba(101,26,20,0.5)] text-center"
      >
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-cream text-xl"
          style={{ background: 'linear-gradient(180deg,#7a201a,#4f120d)' }}
        >
          ☩
        </div>
        <h1 className="font-display text-2xl text-burgundy">Administrare parohie</h1>
        <p className="text-xs text-ink-soft mt-1 mb-5">
          Introdu codul de acces pentru a continua.
        </p>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Cod de acces"
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-xl border border-border px-4 py-3 text-center tracking-widest outline-none focus:border-gold text-navy"
        />
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        <button
          type="submit"
          disabled={loading || code.length < 3}
          className="mt-5 w-full rounded-full bg-burgundy text-cream py-3 font-medium hover:bg-burgundy-dark transition disabled:opacity-50"
        >
          {loading ? 'Se verifică…' : 'Intră'}
        </button>
        <p className="text-[11px] text-ink-soft mt-4">
          Codul se cere la fiecare sesiune, pentru siguranță.
        </p>
      </form>
    </div>
  );
}
