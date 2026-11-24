'use client';

import { useEffect, useState } from 'react';
import { Download, X, Share } from 'lucide-react';

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'pwa_install_dismissed_v1';

/**
 * Registers the service worker and offers an "install app" button.
 * - On Chrome/Edge/Android it uses the native `beforeinstallprompt`.
 * - On iOS Safari (no such event) it shows the manual "Adaugă la ecranul
 *   principal" instructions instead.
 * The prompt hides once installed or dismissed (remembered per device).
 */
export function PwaInstall() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    // Register the service worker (installability + light offline support).
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Already installed? Never nag.
    const standalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    if (standalone) return;

    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === '1';
    } catch {}
    if (dismissed) return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', onBIP);

    // iOS Safari: no beforeinstallprompt — detect and show manual hint.
    const ua = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|crios|fxios|android).)*safari/i.test(ua);
    if (isIOS && isSafari) {
      const t = setTimeout(() => setShow(true), 2500);
      setIosHint(true);
      return () => {
        clearTimeout(t);
        window.removeEventListener('beforeinstallprompt', onBIP);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', onBIP);
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {}
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    try {
      await deferred.userChoice;
    } catch {}
    setDeferred(null);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-5 sm:bottom-5 z-[60] sm:max-w-sm">
      <div className="rounded-2xl border border-gold/50 bg-white shadow-[0_20px_50px_-20px_rgba(101,26,20,0.45)] p-4 flex items-start gap-3">
        <img
          src="/icons/icon-192.png"
          alt=""
          className="h-11 w-11 rounded-xl border border-gold/40 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-display text-burgundy text-sm leading-tight">
            Instalează aplicația parohiei
          </p>
          {iosHint ? (
            <p className="text-xs text-ink-soft mt-1 leading-snug">
              Apasă{' '}
              <Share className="inline h-3.5 w-3.5 -mt-0.5 text-burgundy" /> (Partajează)
              în Safari, apoi „Adaugă la ecranul principal”.
            </p>
          ) : (
            <p className="text-xs text-ink-soft mt-1 leading-snug">
              O deschizi direct de pe telefon sau desktop, ca pe orice aplicație.
            </p>
          )}
          {!iosHint && (
            <button
              onClick={install}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-burgundy text-cream px-3.5 py-1.5 text-xs font-medium hover:bg-burgundy-dark transition"
            >
              <Download className="h-3.5 w-3.5" />
              Instalează
            </button>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="Închide"
          className="text-ink-soft hover:text-burgundy transition shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
