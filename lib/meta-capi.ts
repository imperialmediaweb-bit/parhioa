import crypto from 'crypto';

// Același pixel ca în components/meta-pixel.tsx (fișier 'use client', nu se importă pe server).
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1329741987573453';

/*
  21.11.2026 — donația trimisă la Facebook direct de pe server (Conversions API).
  Pixelul din browser pleacă, dar Facebook nu-l înregistra; evenimentele de pe
  server ajung. Același event_id ca pixelul (don_<sesiunea Stripe>), deci Facebook
  le numără o singură dată. Fără META_CAPI_TOKEN nu se trimite nimic.
  Un eșec aici nu atinge niciodată înregistrarea donației.
*/
const TOKEN = process.env.META_CAPI_TOKEN;

const sha = (v: string) => crypto.createHash('sha256').update(v.trim().toLowerCase()).digest('hex');

export async function trimiteDonatieLaFacebook(d: {
  sessionId: string;
  valoare: number;
  email?: string | null;
  telefon?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  ip?: string | null;
  ua?: string | null;
  url?: string | null;
}) {
  if (!TOKEN || !PIXEL_ID) return;
  try {
    const user_data: Record<string, unknown> = {};
    if (d.email) user_data.em = [sha(d.email)];
    if (d.telefon) {
      let t = d.telefon.replace(/\D/g, '');
      if (t.startsWith('0')) t = '4' + t;
      user_data.ph = [sha(t)];
    }
    user_data.country = [sha('ro')];
    if (d.fbp) user_data.fbp = d.fbp;
    if (d.fbc) user_data.fbc = d.fbc;
    if (d.ip) user_data.client_ip_address = d.ip;
    if (d.ua) user_data.client_user_agent = d.ua;
    const body = {
      data: [
        {
          event_name: 'Donate',
          event_time: Math.floor(Date.now() / 1000),
          event_id: `don_${d.sessionId}`,
          action_source: 'website',
          event_source_url: d.url || 'https://parohiasfteodoradelasihla.ro/doneaza/multumim',
          user_data,
          custom_data: { value: d.valoare, currency: 'RON' },
        },
      ],
    };
    const r = await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(TOKEN)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) console.error('[meta-capi] Facebook a refuzat:', r.status, (await r.text()).slice(0, 300));
  } catch (err) {
    console.error('[meta-capi] eroare:', err);
  }
}
