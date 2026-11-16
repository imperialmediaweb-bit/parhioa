'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/*
  16.11.2026 — pixelul Facebook (reclama de donații pentru construirea bisericii).
  PageView pe fiecare pagină + „Donate" pe pagina de mulțumire (vezi PixelDonatie).
  Pixelul e cel din contul de reclame care promovează parohia; se schimbă din
  NEXT_PUBLIC_META_PIXEL_ID, fără cod.
*/
export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1329741987573453';

type Fbq = (...args: unknown[]) => void;
declare global {
  interface Window {
    fbq?: Fbq;
  }
}

export function MetaPixel() {
  const pathname = usePathname();
  const prima = useRef(true);
  useEffect(() => {
    if (prima.current) {
      prima.current = false;
      return;
    }
    window.fbq?.('track', 'PageView');
  }, [pathname]);

  if (!PIXEL_ID) return null;
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}

/** Pe pagina de mulțumire: o singură „donație" pe sesiunea de plată (eventID = sesiunea Stripe). */
export function PixelDonatie({ valoare, id }: { valoare: number | null; id?: string }) {
  useEffect(() => {
    let incercari = 0;
    const t = setInterval(() => {
      incercari++;
      if (window.fbq) {
        window.fbq('track', 'Donate', { value: valoare ?? 0, currency: 'RON' }, id ? { eventID: `don_${id}` } : undefined);
        clearInterval(t);
      } else if (incercari > 20) clearInterval(t);
    }, 300);
    return () => clearInterval(t);
  }, [valoare, id]);
  return null;
}
