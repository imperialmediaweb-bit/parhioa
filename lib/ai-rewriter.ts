import OpenAI from 'openai';

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
    return {
      title: opts.rawTitle.slice(0, 140) || 'Vești din parohie',
      excerpt: opts.rawDescription.slice(0, 240),
      contentHtml: `<p>${escapeHtml(opts.rawDescription)}</p>${
        opts.link
          ? `<p><a href="${escapeAttr(opts.link)}" target="_blank" rel="noopener noreferrer">Vezi postarea originală pe Facebook</a></p>`
          : ''
      }`,
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
Primești text brut dintr-o postare de Facebook și îl transformi într-un articol de blog ortodox autentic.

Reguli stricte:
- Limba română impecabilă, cu diacritice corecte (ă, â, î, ș, ț).
- Ton evlavios, cald, fără limbaj bisericesc forțat sau cliseic.
- Articolul are 2-5 paragrafe scurte (max 100 cuvinte/paragraf).
- Folosește HTML simplu: <p>, <strong>, <em>. NU folosi titluri H1-H3 în conținut.
- NU inventa fapte. Dacă textul brut e scurt, scrii doar ce e acolo, mai îngrijit.
- Termină cu o reflecție duhovnicească scurtă (o propoziție), apoi „Slavă lui Dumnezeu pentru toate!" pe rând separat dacă se potrivește.

Întoarce STRICT JSON valid cu cheile:
{
  "title": "titlu scurt 6-12 cuvinte, fără diacritice GRESITE",
  "excerpt": "rezumat 150-220 caractere",
  "contentHtml": "HTML cu paragrafe",
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
      temperature: 0.4,
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

    return {
      title: (parsed.title || opts.rawTitle || 'Vești din parohie').slice(0, 200),
      excerpt: (parsed.excerpt || '').slice(0, 260),
      contentHtml:
        parsed.contentHtml ||
        `<p>${escapeHtml(opts.rawDescription)}</p>`,
      category,
    };
  } catch (err) {
    console.error('[ai-rewriter] OpenAI call failed, falling back:', err);
    return {
      title: opts.rawTitle.slice(0, 140) || 'Vești din parohie',
      excerpt: opts.rawDescription.slice(0, 240),
      contentHtml: `<p>${escapeHtml(opts.rawDescription)}</p>`,
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
