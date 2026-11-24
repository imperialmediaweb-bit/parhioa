'use client';

import { useEffect } from 'react';

/**
 * Captures the ad/traffic source once, on landing, and remembers it so it can
 * be attached to a donation made later in the visit. Stores `utm_source` (or
 * the referrer's host for organic social) in localStorage. Facebook ad clicks
 * are additionally caught server-side via the `_fbc` cookie.
 */
export function UtmCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      let src = (params.get('utm_source') || '').trim().toLowerCase();
      if (!src) {
        const ref = document.referrer || '';
        if (/facebook\.com|fb\.com|fbclid/i.test(ref + window.location.search))
          src = 'facebook';
        else if (/instagram\.com/i.test(ref)) src = 'instagram';
        else if (/google\./i.test(ref)) src = 'google';
      }
      if (src) {
        localStorage.setItem('utm_source', src.slice(0, 40));
        localStorage.setItem('utm_source_at', String(Date.now()));
      }
    } catch {
      /* storage blocked — ignore */
    }
  }, []);

  return null;
}

/** Read the remembered source (valid ~45 days), for the donation request. */
export function readStoredSource(): string {
  if (typeof window === 'undefined') return '';
  try {
    const at = Number(localStorage.getItem('utm_source_at') || '0');
    if (at && Date.now() - at > 45 * 24 * 60 * 60 * 1000) return '';
    return (localStorage.getItem('utm_source') || '').slice(0, 40);
  } catch {
    return '';
  }
}
