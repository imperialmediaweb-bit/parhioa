import OpenAI from 'openai';

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export interface ParsedAgenda {
  /** Local date in Romania, "YYYY-MM-DD" (empty if the AI couldn't find one). */
  date: string;
  /** Local time "HH:MM" or empty when no time was mentioned. */
  time: string;
  allDay: boolean;
  title: string;
  location: string;
}

/** Last Sunday (day-of-month) of a given month, UTC. */
function lastSunday(year: number, month0: number): number {
  const d = new Date(Date.UTC(year, month0 + 1, 0));
  return d.getUTCDate() - d.getUTCDay();
}

/**
 * Is a Romania wall-clock calendar date in summer time (EEST, +3)?
 * EU DST: last Sunday of March → last Sunday of October.
 */
function isRomaniaDST(y: number, m1: number, d: number): boolean {
  if (m1 > 3 && m1 < 10) return true;
  if (m1 < 3 || m1 > 10) return false;
  if (m1 === 3) return d >= lastSunday(y, 2);
  return d < lastSunday(y, 9); // October
}

/**
 * Convert a Romania wall-clock time (what a person says, "marți la 17:00")
 * into the correct UTC instant, accounting for EET/EEST. The server runs in
 * UTC, so storing the right instant keeps display correct everywhere.
 */
export function romaniaWallToUtc(
  y: number,
  m1: number,
  d: number,
  h = 0,
  min = 0,
): Date {
  const offset = isRomaniaDST(y, m1, d) ? 3 : 2;
  return new Date(Date.UTC(y, m1 - 1, d, h - offset, min));
}

/** Today's date in Romania as {y, m1, d} — used to resolve "mâine", "marți". */
export function romaniaToday(): { y: number; m1: number; d: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Bucharest',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get('year'), m1: get('month'), d: get('day') };
}

/**
 * Turn free Romanian text (typed or dictated) like
 *   „marți la 5 după-amiază cuvântare la Mănăstirea Vorona"
 * into structured agenda fields. Uses today's Romania date as the anchor so
 * relative days resolve correctly. Returns best-effort empty fields on failure.
 */
export async function parseAgendaText(text: string): Promise<ParsedAgenda> {
  const clean = (text || '').trim().slice(0, 600);
  const empty: ParsedAgenda = {
    date: '',
    time: '',
    allDay: true,
    title: clean.slice(0, 120),
    location: '',
  };
  if (!clean || !client) return empty;

  const t = romaniaToday();
  const todayISO = `${t.y}-${String(t.m1).padStart(2, '0')}-${String(t.d).padStart(2, '0')}`;

  const system = `Ești un asistent care transformă notițe în română (scrise sau dictate) despre programul unui preot ortodox în date structurate pentru o agendă.
Astăzi este ${todayISO} (ora României). Rezolvă expresii relative („azi", „mâine", „poimâine", „marțea viitoare", „pe 5") față de această dată.
Întoarce STRICT JSON valid:
{
  "date": "YYYY-MM-DD sau \\"\\" dacă nu se poate deduce",
  "time": "HH:MM în format 24h, sau \\"\\" dacă nu s-a spus ora",
  "allDay": true/false (true dacă NU s-a precizat ora),
  "title": "ce are de făcut, scurt, cu diacritice (ex: Cuvântare, Slujbă, Întâlnire)",
  "location": "locul, dacă e menționat, altfel \\"\\""
}
Reguli: „la 5" fără alt context pentru un preot înseamnă de obicei 17:00 (după-amiaza) dacă nu e dimineață clar. Nu inventa loc sau dată dacă nu reies din text.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: clean },
      ],
      response_format: { type: 'json_object' },
    });
    const parsed = JSON.parse(
      completion.choices[0]?.message?.content || '{}',
    ) as Partial<ParsedAgenda>;

    const date = /^\d{4}-\d{2}-\d{2}$/.test(parsed.date || '') ? parsed.date! : '';
    const time = /^\d{2}:\d{2}$/.test(parsed.time || '') ? parsed.time! : '';
    return {
      date,
      time,
      allDay: time ? false : parsed.allDay !== false,
      title: (parsed.title || clean).toString().trim().slice(0, 140) || 'Eveniment',
      location: (parsed.location || '').toString().trim().slice(0, 140),
    };
  } catch (err) {
    console.error('[agenda] parse failed:', err);
    return empty;
  }
}
