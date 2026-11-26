'use client';

import { useEffect, useState } from 'react';
import { Download, X, Share, Bell, Check } from 'lucide-react';

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'pwa_install_dismissed_v2';
const VAPID = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

/**
 * One button that installs the app AND turns on announcements, so a person
 * taps once. Registers the service worker, shows an install prompt
 * (Chrome/Android) or iOS instructions, and — on install / tap — asks for
 * notification permission and subscribes to push.
 */
export function PwaInstall() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);
  const [iosHint, setIosHint] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Opening the app clears the icon badge (the "new" dot).
    if ('clearAppBadge' in navigator) {
      (navigator as any).clearAppBadge?.().catch(() => {});
    }

    const isStandalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setStandalone(isStandalone);

    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === '1';
    } catch {}

    const canPush =
      'serviceWorker' in navigator && 'PushManager' in window && !!VAPID;

    // Already subscribed? Then nothing to offer.
    const check = async () => {
      let alreadySub = false;
      if (canPush) {
        try {
          const reg = await navigator.serviceWorker.ready;
          const s = await reg.pushManager.getSubscription();
          alreadySub = !!s;
        } catch {}
      }
      setSubscribed(alreadySub);

      if (dismissed || alreadySub) return;

      // iOS Safari (not installed): must install first; can't push until then.
      const ua = window.navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
      const isSafari = /^((?!chrome|crios|fxios|android).)*safari/i.test(ua);
      if (isIOS && isSafari && !isStandalone) {
        setIosHint(true);
        setTimeout(() => setShow(true), 2500);
        return;
      }

      // Installed already (standalone) but not subscribed → offer announcements.
      if (isStandalone && canPush) {
        setShow(true);
      }
    };
    check();

    const onBIP = (e: Event) => {
      if (dismissed) return;
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', onBIP);
    return () => window.removeEventListener('beforeinstallprompt', onBIP);
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {}
  };

  const subscribePush = async (): Promise<boolean> => {
    if (!VAPID || !('serviceWorker' in navigator) || !('PushManager' in window))
      return false;
    try {
      if (!('Notification' in window)) return false;
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return false;
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      const sub =
        existing ||
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID),
        }));
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub }),
      });
      setSubscribed(true);
      return true;
    } catch {
      return false;
    }
  };

  const onClick = async () => {
    setBusy(true);
    try {
      // 1) Install, if we can.
      if (deferred) {
        await deferred.prompt();
        try {
          await deferred.userChoice;
        } catch {}
        setDeferred(null);
      }
      // 2) Turn on announcements (asks permission once).
      await subscribePush();
      setDone(true);
      setTimeout(() => setShow(false), 2200);
    } finally {
      setBusy(false);
    }
  };

  if (!show) return null;

  const label = standalone ? 'Primește anunțuri' : 'Instalează + anunțuri';

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
            Aplicația parohiei + anunțuri
          </p>
          {iosHint ? (
            <p className="text-xs text-ink-soft mt-1 leading-snug">
              Apasă <Share className="inline h-3.5 w-3.5 -mt-0.5 text-burgundy" />{' '}
              (Partajează) în Safari → „Adaugă la ecranul principal”. Apoi deschide
              aplicația și pornești anunțurile.
            </p>
          ) : done ? (
            <p className="text-xs text-green-700 mt-1 leading-snug flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Gata! Vei primi anunțurile parohiei.
            </p>
          ) : (
            <p className="text-xs text-ink-soft mt-1 leading-snug">
              Instaleaz-o pe telefon și primești o notificare când părintele
              anunță ceva nou.
            </p>
          )}
          {!iosHint && !done && (
            <button
              onClick={onClick}
              disabled={busy}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-burgundy text-cream px-3.5 py-1.5 text-xs font-medium hover:bg-burgundy-dark transition disabled:opacity-60"
            >
              {standalone ? <Bell className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
              {busy ? 'Un moment…' : label}
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
