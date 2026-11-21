'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, FileText, Megaphone, BookOpen } from 'lucide-react';

type Result = {
  type: 'Pagină' | 'Articol' | 'Campanie';
  title: string;
  url: string;
  excerpt?: string;
};

const ICONS: Record<Result['type'], typeof FileText> = {
  Pagină: FileText,
  Articol: BookOpen,
  Campanie: Megaphone,
};

/** Global event other components dispatch to open the search. */
export const OPEN_SEARCH_EVENT = 'open-search';

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const router = useRouter();

  const close = useCallback(() => {
    setOpen(false);
    setQ('');
    setResults([]);
    setActive(0);
    // Restore focus to the element that opened the dialog.
    lastFocused.current?.focus?.();
  }, []);

  // Open via custom event (header + mobile menu) and Cmd/Ctrl+K.
  useEffect(() => {
    const openNow = () => {
      lastFocused.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openNow();
      }
    };
    window.addEventListener(OPEN_SEARCH_EVENT, openNow);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, openNow);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // Lock body scroll + focus the input when opening.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      document.body.style.overflow = '';
      clearTimeout(t);
    };
  }, [open]);

  // Debounced live search.
  useEffect(() => {
    if (!open) return;
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: ctrl.signal,
        });
        const data = await res.json();
        setResults(Array.isArray(data.results) ? data.results : []);
        setActive(0);
      } catch {
        /* aborted or failed */
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [q, open]);

  const go = useCallback(
    (url: string) => {
      close();
      router.push(url);
    },
    [close, router],
  );

  // Keyboard: Escape closes, arrows move, Enter selects, Tab is trapped.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active].url);
    } else if (e.key === 'Tab') {
      // Simple focus trap — keep focus inside the dialog.
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'input, button, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center p-4 sm:p-6"
      onKeyDown={onKeyDown}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Închide căutarea"
        onClick={close}
        className="absolute inset-0 bg-navy-dark/70 backdrop-blur-sm animate-fade-up"
        tabIndex={-1}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Căutare pe site"
        className="relative z-10 mt-[8vh] w-full max-w-xl overflow-hidden rounded-2xl bg-cream shadow-2xl ring-1 ring-gold/40"
      >
        {/* Input row */}
        <div className="flex items-center gap-3 border-b border-border px-4 sm:px-5 py-3.5">
          <Search className="h-5 w-5 text-burgundy shrink-0" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Caută pagini, articole, campanii…"
            aria-label="Caută pe site"
            className="flex-1 bg-transparent text-navy placeholder:text-ink-soft outline-none text-base"
            autoComplete="off"
            spellCheck={false}
          />
          {loading && <Loader2 className="h-4 w-4 text-burgundy animate-spin shrink-0" aria-hidden />}
          <button
            type="button"
            onClick={close}
            aria-label="Închide"
            className="flex h-8 w-8 items-center justify-center rounded-full text-burgundy hover:bg-cream-card transition shrink-0"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {q.trim().length < 2 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-soft font-serif italic">
              Scrie cel puțin două litere pentru a căuta.
            </p>
          ) : !loading && results.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-soft font-serif italic">
              Niciun rezultat pentru „{q.trim()}".
            </p>
          ) : (
            <ul className="py-2" role="listbox" aria-label="Rezultate">
              {results.map((r, i) => {
                const Icon = ICONS[r.type];
                return (
                  <li key={`${r.url}-${i}`} role="option" aria-selected={i === active}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(r.url)}
                      className={`w-full text-left flex items-start gap-3 px-4 sm:px-5 py-3 transition ${
                        i === active ? 'bg-cream-card' : 'hover:bg-cream-card/60'
                      }`}
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="font-display text-[15px] text-navy truncate">
                            {r.title}
                          </span>
                          <span className="shrink-0 font-ceremonial uppercase text-[9px] tracking-[0.16em] text-burgundy/70 border border-burgundy/25 rounded-full px-1.5 py-0.5">
                            {r.type}
                          </span>
                        </span>
                        {r.excerpt && (
                          <span className="block text-[13px] text-ink-muted font-serif line-clamp-1 mt-0.5">
                            {r.excerpt}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-border px-5 py-2.5 flex items-center justify-between text-[11px] text-ink-soft">
          <span className="font-ceremonial uppercase tracking-[0.16em]">☩ Parohia Sf. Teodora</span>
          <span className="hidden sm:flex items-center gap-2">
            <kbd className="rounded border border-border bg-white px-1.5 py-0.5">↑↓</kbd> navighezi
            <kbd className="rounded border border-border bg-white px-1.5 py-0.5">Enter</kbd> deschizi
            <kbd className="rounded border border-border bg-white px-1.5 py-0.5">Esc</kbd> închizi
          </span>
        </div>
      </div>
    </div>
  );
}
