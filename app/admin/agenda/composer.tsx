'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Square, Sparkles, Loader2, Check } from 'lucide-react';

export function AgendaComposer({ adminKey = '' }: { adminKey?: string }) {
  const router = useRouter();
  const [raw, setRaw] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [voiceOK, setVoiceOK] = useState(true);

  const recRef = useRef<any>(null);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setVoiceOK(false);
      return;
    }
    const rec = new SR();
    rec.lang = 'ro-RO';
    rec.continuous = true;
    rec.interimResults = true;
    let base = '';
    rec.onresult = (e: any) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const txt = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += txt;
        else interim += txt;
      }
      if (final) base = (base + ' ' + final).trim();
      setRaw((base + ' ' + interim).trim());
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.onstart = () => {
      base = raw;
    };
    recRef.current = rec;
    return () => {
      try {
        rec.stop();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMic = () => {
    const rec = recRef.current;
    if (!rec) return;
    if (listening) {
      try {
        rec.stop();
      } catch {}
      setListening(false);
    } else {
      setError(null);
      try {
        rec.start();
        setListening(true);
      } catch {}
    }
  };

  const understand = async () => {
    if (!raw.trim()) {
      setError('Scrie sau spune ceva mai întâi.');
      return;
    }
    setThinking(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/agenda/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: adminKey, text: raw }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Nu am putut înțelege.');
      if (d.date) setDate(d.date);
      if (d.time) setTime(d.time);
      if (d.title) setTitle(d.title);
      if (d.location) setLocation(d.location);
    } catch (e: any) {
      setError(e.message || 'Eroare.');
    } finally {
      setThinking(false);
    }
  };

  const save = async () => {
    if (!title.trim()) {
      setError('Lipsește titlul (ce are de făcut).');
      return;
    }
    if (!date) {
      setError('Alege o dată.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: adminKey,
          title,
          date,
          time,
          allDay: !time,
          location,
          notes,
          rawText: raw,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Nu am putut salva.');
      setOk(true);
      setRaw('');
      setDate('');
      setTime('');
      setTitle('');
      setLocation('');
      setNotes('');
      setTimeout(() => setOk(false), 2500);
      router.refresh();
    } catch (e: any) {
      setError(e.message || 'Eroare.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gold/50 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-gold-dark" />
        <h2 className="font-display text-lg text-burgundy">Adaugă în agendă</h2>
      </div>

      {/* Voice / text box */}
      <label className="text-xs text-ink-soft">
        Scrie sau apasă microfonul și spune (ex: „marți la 5 cuvântare la Mănăstirea Vorona")
      </label>
      <div className="mt-1.5 relative">
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={2}
          placeholder="Ce ai de făcut, unde și când…"
          className="w-full rounded-xl border border-border px-3 py-2.5 pr-12 text-navy outline-none focus:border-gold resize-none"
        />
        {voiceOK && (
          <button
            type="button"
            onClick={toggleMic}
            aria-label={listening ? 'Oprește' : 'Vorbește'}
            className={`absolute right-2 top-2 h-9 w-9 rounded-full flex items-center justify-center transition ${
              listening
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-burgundy text-cream hover:bg-burgundy-dark'
            }`}
          >
            {listening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
        )}
      </div>
      {!voiceOK && (
        <p className="text-[11px] text-ink-soft mt-1">
          (Microfonul merge în Chrome pe telefon/laptop. Poți scrie și cu mâna.)
        </p>
      )}

      <button
        type="button"
        onClick={understand}
        disabled={thinking}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold-dark bg-gradient-to-br from-gold to-gold-dark text-burgundy-dark px-4 py-1.5 text-sm font-semibold hover:brightness-105 transition disabled:opacity-60"
      >
        {thinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {thinking ? 'Înțeleg…' : 'Înțelege'}
      </button>

      {/* Structured fields (editable) */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-ink-soft">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-navy outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="text-xs text-ink-soft">Ora (opțional)</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-navy outline-none focus:border-gold"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-ink-soft">Ce (titlu)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Cuvântare / Slujbă / Întâlnire…"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-navy outline-none focus:border-gold"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-ink-soft">Unde (loc)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Mănăstirea Vorona, Botoșani…"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-navy outline-none focus:border-gold"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-ink-soft">Notițe (opțional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-navy outline-none focus:border-gold resize-none"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-burgundy text-cream py-2.5 font-medium hover:bg-burgundy-dark transition disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : ok ? (
          <Check className="h-4 w-4" />
        ) : null}
        {ok ? 'Salvat' : saving ? 'Se salvează…' : 'Salvează în agendă'}
      </button>
    </div>
  );
}
