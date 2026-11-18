/**
 * Anunț temporar de post (ex: Postul Nașterii Domnului / Postul Crăciunului).
 *
 * Un singur anunț activ, editat aici de parohie. Apare pe banda de sus
 * (news-ticker) și ca un card în secțiunea Program slujbe de pe homepage.
 * Se ascunde singur după data `until`, ca să nu rămână un anunț vechi pe site.
 *
 * Ca să-l oprești mai devreme: pune `active: false`.
 */
export interface AnuntPost {
  active: boolean;
  /** Ultima zi în care anunțul mai apare (YYYY-MM-DD). După ea dispare singur. */
  until: string;
  eyebrow: string;
  title: string;
  /** Rândurile principale (zile + ore). */
  lines: string[];
  location: string;
  phone?: string;
  phoneNote?: string;
}

export const ANUNT_POST: AnuntPost = {
  active: true,
  until: '2026-12-26',
  eyebrow: 'Postul Nașterii Domnului',
  title: 'Program de spovedit',
  lines: ['În fiecare Joi, Vineri și Sâmbătă, de la ora 16:00'],
  location:
    'Biserica „Buna-Vestire" — Str. Primăverii Nr. 20, Botoșani (casa de prăznuire)',
  phone: '0754 857 903',
  phoneNote:
    'Bătrânii și bolnavii pot fi spovediți și împărtășiți la domiciliu, la cerere.',
};

/** Returnează anunțul doar dacă e activ și nu a trecut data `until`. */
export function anuntPostActiv(now: Date = new Date()): AnuntPost | null {
  if (!ANUNT_POST.active) return null;
  if (ANUNT_POST.until) {
    const limit = new Date(`${ANUNT_POST.until}T23:59:59`);
    if (!isNaN(limit.getTime()) && now > limit) return null;
  }
  return ANUNT_POST;
}
