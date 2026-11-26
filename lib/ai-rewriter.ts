import OpenAI from 'openai';
import { sanitizePostHtml, sanitizeText } from './sanitize';
import { stripEmoji } from './utils';

/**
 * Build the article body from the FULL original post text — deterministically,
 * so nothing is ever dropped (the AI tends to shorten and cut the liturgical
 * program). Removes emoji, splits into paragraphs, and turns a program / list
 * of days into a bullet list.
 */
function formatBodyFromRaw(raw: string, link: string): string {
  let t = stripEmoji(raw || '').replace(/[ \t ]+/g, ' ').trim();
  if (!t) return '';

  // Put structural markers on their own lines.
  t = t.replace(/\s*(Programul liturgic[:：])/gi, '\n\n$1\n');
  t = t.replace(/\s*(Loca[țt]ia[:：])/gi, '\n\n$1 ');
  t = t.replace(/\s*(V[ăa] a[șs]tept[ăa]m)/g, '\n\n$1');
  // Each day of the week starts a new line (program entries).
  t = t.replace(
    /\s+(Luni|Mar[țt]i|Miercuri|Joi|Vineri|S[âa]mb[ăa]t[ăa]|Duminic[ăa])([,:]| –| -| ora)/g,
    '\n$1$2',
  );

  const blocks = t
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  let html = '';
  for (const b of blocks) {
    const lines = b
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length > 1) {
      const [head, ...rest] = lines;
      html += `<p><strong>${escapeHtml(head)}</strong></p>`;
      html += '<ul>' + rest.map((l) => `<li>${escapeHtml(l)}</li>`).join('') + '</ul>';
    } else {
      html += `<p>${escapeHtml(lines[0])}</p>`;
    }
  }
  if (link) {
    html += `<p><a href="${escapeAttr(link)}" target="_blank" rel="noopener noreferrer">Vezi postarea originală pe Facebook</a></p>`;
  }
  return sanitizePostHtml(html);
}

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export interface RewrittenArticle {
  title: string;
  excerpt: string;
  contentHtml: string;
  category: 'Vești din parohie' | 'Lucrări' | 'Evenimente' | 'Slujbe';
}

/**
 * Rewrite a raw Facebook post into a proper Romanian Orthodox blog article.
 * Falls back to a simple wrapping of the original text if OPENAI_API_KEY
 * is not configured.
 */
export async function rewriteAsArticle(opts: {
  rawTitle: string;
  rawDescription: string;
  pubDate: Date | null;
  link: string;
}): Promise<RewrittenArticle> {
  // Heuristic category from text — used both as fallback and to seed the
  // system prompt.
  const fallbackCategory = inferCategory(opts.rawTitle + ' ' + opts.rawDescription);

  if (!client) {
    // Fallback when OPENAI_API_KEY is unset: still keep the full post, cleaned.
    return {
      title: stripEmoji(sanitizeText(opts.rawTitle)).slice(0, 140) || 'Vești din parohie',
      excerpt: stripEmoji(sanitizeText(opts.rawDescription)).slice(0, 240),
      contentHtml: formatBodyFromRaw(opts.rawDescription, opts.link),
      category: fallbackCategory,
    };
  }

  const dateLabel = opts.pubDate
    ? opts.pubDate.toLocaleDateString('ro-RO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const systemPrompt = `Ești redactorul oficial al Parohiei "Sfânta Cuvioasă Teodora de la Sihla" din Botoșani.
Primești text brut dintr-o postare de Facebook și îl transformi într-un articol de blog ortodox îngrijit.

Reguli stricte:
- Limba română impecabilă, cu diacritice corecte (ă, â, î, ș, ț).
- Ton evlavios, cald, fără limbaj forțat.
- PĂSTREAZĂ TOT conținutul și TOATE detaliile concrete: datele, zilele, orele,
  programul liturgic, locațiile, adresele, numele. NU scurta, NU rezuma, NU omite
  programul. Articolul trebuie să conțină postarea întreagă, doar curățată și
  aranjată frumos.
- ELIMINĂ complet emoji-urile și simbolurile decorative (📜 ☦️ 🙏 📖 🕯️ ⛪ ❤️ 🌿 🕖 etc.).
- Formatează clar cu HTML simplu: <p> pentru paragrafe. Pentru un program sau o
  listă de ore/zile folosește <ul><li>…</li></ul>, fiecare rând pe punctul lui
  (ex: „Vineri, 27 noiembrie — ora 19:00: Slujba Privegherii"). NU folosi titluri H1-H3.
- Poți folosi <strong> pentru accente (ex: data, ora), dar fără exagerare.
- NU inventa nimic ce nu există în textul brut.

Întoarce STRICT JSON valid cu cheile:
{
  "title": "titlu scurt și limpede, 6-12 cuvinte, fără emoji, cu diacritice corecte",
  "excerpt": "rezumat 150-220 caractere, fără emoji",
  "contentHtml": "postarea întreagă, curățată, în <p> și, unde e cazul, <ul><li>",
  "category": "una din: Vești din parohie | Lucrări | Evenimente | Slujbe"
}`;

  const userPrompt = `Titlu brut: ${opts.rawTitle || '(fără titlu)'}
Data postării: ${dateLabel || 'necunoscută'}
Text brut:
${opts.rawDescription || '(fără descriere)'}

Rescrie acest text ca articol de blog parohial. Răspunde DOAR cu JSON-ul cerut, fără explicații.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 2000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw) as Partial<RewrittenArticle>;
    const validCategories: RewrittenArticle['category'][] = [
      'Vești din parohie',
      'Lucrări',
      'Evenimente',
      'Slujbe',
    ];
    const category =
      parsed.category && validCategories.includes(parsed.category as any)
        ? (parsed.category as RewrittenArticle['category'])
        : fallbackCategory;

    // Body is built deterministically from the FULL original text (never the
    // AI's shortened version), so the whole post — program, hours, location —
    // is always kept. The AI is used only for a clean title/excerpt/category.
    const contentHtml = formatBodyFromRaw(opts.rawDescription, opts.link);
    return {
      title: stripEmoji(sanitizeText(parsed.title || opts.rawTitle || 'Vești din parohie')).slice(0, 200),
      excerpt: stripEmoji(sanitizeText(parsed.excerpt || opts.rawDescription || '')).slice(0, 260),
      contentHtml,
      category,
    };
  } catch (err) {
    console.error('[ai-rewriter] OpenAI call failed, falling back:', err);
    return {
      title: stripEmoji(sanitizeText(opts.rawTitle)).slice(0, 140) || 'Vești din parohie',
      excerpt: stripEmoji(sanitizeText(opts.rawDescription)).slice(0, 240),
      contentHtml: formatBodyFromRaw(opts.rawDescription, opts.link),
      category: fallbackCategory,
    };
  }
}

function inferCategory(text: string): RewrittenArticle['category'] {
  const t = text.toLowerCase();
  if (/(zidire|cărămid|temelie|biseric.+ constru|sfinț.+ loc|piatră de temelie|șantier|racordare|construcț|lucrăr)/.test(t))
    return 'Lucrări';
  if (/(conferinț|întâlnire|hram|pelerinaj|seminar|simpozion|eveniment|participă)/.test(t))
    return 'Evenimente';
  if (/(liturghie|vecernie|maslu|acatist|parastas|botez|cununie|spovedanie)/.test(t))
    return 'Slujbe';
  return 'Vești din parohie';
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, '&#39;');
}
