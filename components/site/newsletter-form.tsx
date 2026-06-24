'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, Mail } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Vă rugăm completați adresa de email.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), website }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        setError(data?.error || 'Nu am putut salva abonarea. Reîncercați.');
        return;
      }
      setDone(true);
    } catch {
      setError('Eroare de rețea. Reîncercați.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-3">
        <CheckCircle2 className="h-10 w-10 text-gold mx-auto mb-3" />
        <p className="font-display text-lg text-cream">Mulțumim!</p>
        <p className="text-cream/80 text-sm mt-1">
          V-am trimis un email de confirmare la <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        name="website"
        className="absolute left-[-9999px] w-px h-px opacity-0"
        aria-hidden="true"
      />
      <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/60" />
          <label htmlFor="newsletter-email" className="sr-only">Adresă de email</label>
          <input
            id="newsletter-email"
            type="email"
            required
            maxLength={120}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplu.ro"
            className="w-full pl-10 pr-4 py-3 rounded-full bg-cream/10 border border-cream/30 text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 rounded-full bg-gold text-burgundy-dark font-semibold hover:bg-gold-light disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Se trimite…
            </>
          ) : (
            'Abonează-mă'
          )}
        </button>
      </div>
      {error && (
        <p className="text-sm text-gold bg-burgundy-dark/40 border border-gold/40 rounded-lg px-3 py-2 max-w-md mx-auto text-center">
          {error}
        </p>
      )}
      <p className="text-[11px] text-cream/55 text-center">
        Trimitem rar — program de sărbători, anunțuri importante. Poți renunța oricând.
      </p>
    </form>
  );
}
