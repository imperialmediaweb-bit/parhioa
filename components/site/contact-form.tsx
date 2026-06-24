'use client';

import { useState } from 'react';
import { User, Mail, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  // Honeypot field — real users never fill this; bots fill everything.
  const [website, setWebsite] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Vă rugăm completați nume, email și mesajul.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject: subject.trim(),
          message: message.trim(),
          website,
        }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        setError(data?.error || 'Nu am putut trimite mesajul. Vă rugăm încercați din nou.');
        return;
      }
      setSent(true);
    } catch {
      setError('Eroare de rețea. Vă rugăm încercați din nou.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-9 w-9 text-green-700" />
        </div>
        <h3 className="font-display text-xl text-burgundy mb-2">Mesaj trimis</h3>
        <p className="text-ink-muted leading-relaxed max-w-sm mx-auto text-sm">
          Mulțumim. Părintele va primi mesajul și va răspunde cât de curând posibil
          pe adresa <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      {/* Honeypot — visually hidden, real users never see it. */}
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

      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
        <label className="sr-only" htmlFor="contact-name">Nume</label>
        <input
          id="contact-name"
          type="text"
          required
          maxLength={120}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nume *"
          className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-border focus:outline-none focus:ring-2 focus:ring-burgundy text-ink"
        />
      </div>
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
        <label className="sr-only" htmlFor="contact-email">Adresă de email</label>
        <input
          id="contact-email"
          type="email"
          required
          maxLength={120}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adresă de email *"
          className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-border focus:outline-none focus:ring-2 focus:ring-burgundy text-ink"
        />
      </div>
      <div className="relative">
        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
        <label className="sr-only" htmlFor="contact-phone">Telefon (opțional)</label>
        <input
          id="contact-phone"
          type="tel"
          maxLength={30}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Telefon (opțional)"
          className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-border focus:outline-none focus:ring-2 focus:ring-burgundy text-ink"
        />
      </div>
      <div>
        <label className="sr-only" htmlFor="contact-subject">Subiect</label>
        <input
          id="contact-subject"
          type="text"
          maxLength={200}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subiect (opțional)"
          className="w-full px-4 py-3 rounded-full bg-white border border-border focus:outline-none focus:ring-2 focus:ring-burgundy text-ink"
        />
      </div>
      <div>
        <label className="sr-only" htmlFor="contact-message">Mesaj</label>
        <textarea
          id="contact-message"
          required
          rows={5}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesaj *"
          className="w-full px-4 py-3 rounded-3xl bg-white border border-border focus:outline-none focus:ring-2 focus:ring-burgundy text-ink resize-y"
        />
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Se trimite…
          </>
        ) : (
          'Trimite mesajul'
        )}
      </Button>
      <p className="text-[11px] text-ink-soft text-center">
        Mesajul ajunge direct la părintele paroh. Vă răspundem în maximum 48 ore.
      </p>
    </form>
  );
}
