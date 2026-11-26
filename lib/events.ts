import OpenAI from 'openai';
import { stripEmoji } from './utils';
import { romaniaWallToUtc } from './agenda';
import { prisma } from './prisma';

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const EVENT_RE =
  /(priveghere|masl[uy]|acatist|hram|liturghi|vecerni|utreni|spovedani|sf[iî]n[țt]ire|parastas|botez|cununi|aghiasm|tain[ăa]|v[ăa] invit[ăa]m|v[ăa] a[șs]tept[ăa]m|program liturgic|slujb)/i;

const CONSTRUCTION_RE =
  /([șs]antier|funda[țt]i|zidire|turnare|beton|c[ăa]r[ăa]mid|arm[ăa]tur|cuzine[țt]|excavat|lucr[ăa]rile la|funda[țt]ia)/i;

/** True when the post is about a service/event (not construction). */
export function isEventPost(text: string): boolean {
  const t = text || '';
  if (!EVENT_RE.test(t)) return false;
  // If it is mostly construction and has no service keyword density, skip.
  if (CONSTRUCTION_RE.test(t) && !/(priveghere|masl|acatist|hram|liturghi|vecerni|slujb|program liturgic)/i.test(t))
    return false;
  return true;
}

export interface ExtractedEvent {
  title: string;
  startAt: Date;
  allDay: boolean;
  location: string | null;
}

/**
 * Extract concrete dated events (priveghere, maslu, acatist...) from a post's
 * text. Uses the post date as the anchor so any relative wording resolves. Only
 * returns events with a real calendar date. Empty array on failure.
 */
export async function extractEvents(
  text: string,
  pubDate: Date | null,
): Promise<ExtractedEvent[]> {
  const clean = stripEmoji(text || '').replace(/\s+/g, ' ').trim().slice(0, 2000);
  if (!clean || !client || !isEventPost(clean)) return [];

  const anchor = (pubDate || new Date()).toISOString().slice(0, 10);

  const system = `Extragi evenimentele bisericești (slujbe) dintr-un anunț în română.
Postarea a fost publicată în jurul datei ${anchor}; folosește-o pentru a rezolva zilele.
Întoarce STRICT JSON: {"events":[{"title","date","time","allDay","location"}]}.
- title: scurt, ce slujbă e (ex: „Priveghere — Sf. Arsenie Boca", „Taina Sfântului Maslu", „Acatist").
- date: "YYYY-MM-DD" (data exactă a evenimentului).
- time: "HH:MM" 24h, sau "" dacă nu se spune ora.
- allDay: true dacă nu e oră.
- location: locul, dacă e menționat, altfel "".
Include DOAR evenimente cu dată clară. Dacă sunt mai multe (ex: Vineri priveghere, Sâmbătă Liturghie), le pui pe toate. Dacă nu e niciun eveniment datat, întoarce {"events":[]}.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      max_tokens: 800,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: clean },
      ],
      response_format: { type: 'json_object' },
    });
    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
    const list: any[] = Array.isArray(parsed.events) ? parsed.events : [];
    const out: ExtractedEvent[] = [];
    for (const e of list) {
      const date = String(e.date || '');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
      const [y, m1, d] = date.split('-').map(Number);
      const time = String(e.time || '');
      const hasTime = /^\d{2}:\d{2}$/.test(time);
      const [h, min] = hasTime ? time.split(':').map(Number) : [9, 0];
      out.push({
        title: stripEmoji(String(e.title || 'Slujbă')).trim().slice(0, 140) || 'Slujbă',
        startAt: romaniaWallToUtc(y, m1, d, h, min),
        allDay: !hasTime,
        location: (String(e.location || '').trim().slice(0, 140)) || null,
      });
    }
    return out;
  } catch (err) {
    console.error('[events] extract failed', err);
    return [];
  }
}

/**
 * Re-sync the stored events for one post: wipe its previous events and recreate
 * them from the current text. Safe to call on every import/refresh. Never throws.
 */
export async function syncPostEvents(opts: {
  sourceGuid: string;
  slug: string;
  text: string;
  pubDate: Date | null;
}): Promise<number> {
  try {
    await prisma.event.deleteMany({ where: { sourceGuid: opts.sourceGuid } }).catch(() => {});
    if (!isEventPost(stripEmoji(opts.text || ''))) return 0;
    const events = await extractEvents(opts.text, opts.pubDate);
    if (events.length === 0) return 0;
    await prisma.event.createMany({
      data: events.map((e) => ({
        sourceGuid: opts.sourceGuid,
        postSlug: opts.slug,
        title: e.title,
        startAt: e.startAt,
        allDay: e.allDay,
        location: e.location,
      })),
    });
    return events.length;
  } catch (err) {
    console.error('[events] sync failed', err);
    return 0;
  }
}

