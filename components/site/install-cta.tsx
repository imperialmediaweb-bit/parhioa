'use client';

import { useEffect, useState } from 'react';
import { Download, Bell, Check, Share, Plus } from 'lucide-react';

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const VAPID = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

/** Big, always-visible install + notifications button for the /instaleaza page. */
export function InstallCTA() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    const s =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setStandalone(s);
    const ua = window.navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream);

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    window.addEventListener('beforeinstallprompt', onBIP);
    return () => window.removeEventListener('beforeinstallprompt', onBIP);
  }, []);

  const subscribePush = async () => {
    if (!VAPID || !('serviceWorker' in navigator) || !('PushManager' in window)) return;
    try {
      if (!('Notification' in window)) return;
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return;
      const reg = await navigator.serviceWorker.ready;
      const sub =
        (await reg.pushManager.getSubscription()) ||
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID),
        }));
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub }),
      });
    } catch {}
  };

  const onClick = async () => {
    setBusy(true);
    try {
      if (deferred) {
        await deferred.prompt();
        try {
          await deferred.userChoice;
        } catch {}
        setDeferred(null);
      }
      await subscribePush();
      setDone(true);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-green-600 text-white px-6 py-3 font-medium">
        <Check className="h-5 w-5" /> Gata! Aplicația e instalată și vei primi anunțuri.
      </div>
    );
  }

  // iPhone/iPad: can't trigger install programmatically — show the steps.
  if (isIOS && !standalone) {
    return (
      <div className="rounded-2xl border border-gold/50 bg-white p-5 text-left max-w-sm mx-auto">
        <p className="font-display text-burgundy mb-2">Pe iPhone / iPad:</p>
        <ol className="text-sm text-ink space-y-2">
          <li className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-burgundy text-cream text-xs flex items-center justify-center shrink-0">1</span>
            Apasă <Share className="inline h-4 w-4 text-burgundy" /> (Partajează), jos în Safari.
          </li>
          <li className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-burgundy text-cream text-xs flex items-center justify-center shrink-0">2</span>
            Alege <Plus className="inline h-4 w-4 text-burgundy" /> „Adaugă la ecranul principal”.
          </li>
          <li className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-burgundy text-cream text-xs flex items-center justify-center shrink-0">3</span>
            Deschide aplicația și apasă „Primește anunțuri”.
          </li>
        </ol>
      </div>
    );
  }

  if (standalone) {
    return (
      <button
        onClick={onClick}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full bg-burgundy text-cream px-7 py-3.5 text-lg font-medium hover:bg-burgundy-dark transition disabled:opacity-60"
      >
        <Bell className="h-5 w-5" />
        {busy ? 'Un moment…' : 'Primește anunțuri'}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-full bg-burgundy text-cream px-7 py-3.5 text-lg font-medium hover:bg-burgundy-dark transition disabled:opacity-60 shadow-lg"
    >
      <Download className="h-5 w-5" />
      {busy ? 'Un moment…' : 'Instalează aplicația'}
    </button>
  );
}
