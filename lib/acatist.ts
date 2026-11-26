// Shared logic for the „acatist" (first-name list of living donors) — used by
// the admin page and by the printable /api/admin/acatist route so it opens as a
// normal page (works inside in-app browsers like WhatsApp, which block popups).

const LOGO =
  'https://pub-49f4280024fa4ca2b8a4f6323442efe8.r2.dev/sf_theodora_de_la_sihla_ri9rz2.png';

export const FIRST_NAMES = new Set(
  (
    'andrei alexandru adrian marian ion ionut gabriel george gheorghe mihai mihail nicolae ' +
    'vasile constantin catalin cristian cristi daniel dan florin bogdan razvan radu sorin stefan ' +
    'stefanita stefanut marius valentin vlad victor dragos emil eugen paul petru petre teodor tudor ' +
    'toma dumitru grigore iulian lucian marcel octavian ovidiu sebastian silviu traian viorel ciprian ' +
    'costel costin doru ilie laurentiu liviu luca matei narcis sandu virgil aurel anton pavel iacob ' +
    'simion avram david darius denis robert rares eduard gelu nelu relu nicu puiu cosmin alin calin ' +
    'horia iosif leon marin mircea remus romeo sever tiberiu valeriu zaharia samoila ananie gavril ' +
    'maria ioana elena ana andreea alexandra gabriela mihaela daniela nicoleta cristina camelia carmen ' +
    'florentina georgiana larisa laura monica oana raluca roxana simona teodora diana denisa bianca ' +
    'loredana lavinia mirela claudia corina catalina doina dorina eugenia felicia florica geta ileana ' +
    'iuliana lacramioara liliana livia luminita magdalena manuela marcela mariana marilena marinela ' +
    'madalina melania narcisa natalia otilia paula petronela rodica sanda silvia sofia stela steluta ' +
    'tatiana valentina valeria veronica victoria violeta viorica zoe aurelia anca adela adriana alina ' +
    'amalia angela antonia beatrice crina daria delia emilia estera eva gina irina isabela izabela ' +
    'lidia lia lucia margareta miruna nadia olga ramona sabina smaranda sorina tamara vasilica ' +
    'ecaterina paraschiva profira zamfira ruxandra anisoara lenuta mioara saveta safta catinca ' +
    'aurica elisabeta eleonora'
  ).split(/\s+/),
);

export function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ș|ş/g, 's')
    .replace(/ț|ţ/g, 't')
    .toLowerCase();
}

/** Extract the donor's first name(s) for the acatist. */
export function firstNamesOf(full: string): string[] {
  const cleaned = full
    .trim()
    .replace(/^(familia|fam\.?|pr\.?|preot|p[ăa]rinte|dl\.?|d-l|dna\.?|d-na)\s+/i, '');
  return cleaned
    .split(/\s+(?:și|si)\s+|\s*[&/,+]\s*|\s+-\s+/i)
    .map((person) => {
      const words = person.trim().split(/\s+/).filter(Boolean);
      for (const w of words) {
        const whole = fold(w.replace(/[.,;:]+$/, ''));
        const head = whole.split('-')[0];
        if (FIRST_NAMES.has(whole) || FIRST_NAMES.has(head)) {
          return w.replace(/[.,;:]+$/, '').trim();
        }
      }
      return (words[words.length - 1] || '').replace(/[.,;:]+$/, '').trim();
    })
    .filter((n) => n.length > 1);
}

/** Unique, sorted (RO) first names from a list of full names. */
export function uniqueFirstNames(fullNames: string[]): string[] {
  return Array.from(new Set(fullNames.flatMap((n) => firstNamesOf(n)))).sort((a, b) =>
    a.localeCompare(b, 'ro'),
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Full printable HTML page for the acatist. Opened as a normal same-tab page,
 * so it works everywhere (incl. WhatsApp's in-app browser). The priest prints
 * or saves to PDF from the button / browser menu.
 */
export function buildAcatistHtml(names: string[], periodLabel?: string): string {
  const today = new Date().toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const items = names.map((n) => `<li>${escapeHtml(n)}</li>`).join('');
  const periodHtml = periodLabel ? `<p class="period">${escapeHtml(periodLabel)}</p>` : '';

  return `<!doctype html><html lang="ro"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Acatist — Parohia Sf. Cuv. Teodora de la Sihla</title>
<style>
  @page { size: A4 portrait; margin: 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #3a1512; margin: 0; background:#f6efe0; }
  .bar { position: sticky; top: 0; background:#651a14; color:#fff; padding:12px 16px; display:flex; gap:10px; justify-content:center; }
  .bar button { background:#EAC784; color:#4f120d; border:0; border-radius:999px; padding:10px 18px; font-size:15px; font-weight:700; cursor:pointer; }
  .hint { text-align:center; font-size:12px; color:#8a6a3a; padding:8px 16px 0; }
  .wrap { max-width: 760px; margin: 0 auto; padding: 24px; background:#fff; }
  .head { text-align: center; border-bottom: 2px solid #c9a361; padding-bottom: 16px; margin-bottom: 20px; }
  .head img { height: 84px; width: auto; }
  .sitecross { display:flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:50%; margin:0 auto 8px; background:radial-gradient(circle at 50% 40%, #f4dfb3, #EAC784 70%, #c9a361); color:#651a14; font-size:14px; line-height:1; }
  h1 { font-size: 30px; letter-spacing: 3px; text-transform: uppercase; margin: 10px 0 4px; color: #651a14; }
  .sub { font-style: italic; color: #6b4a2a; font-size: 15px; margin: 0; }
  .period { margin: 8px 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #8a6a3a; }
  .intro { text-align: center; margin: 18px 0; font-size: 16px; }
  ul { columns: 2; column-gap: 34px; list-style: none; padding: 0; margin: 0; font-size: 15px; line-height: 2; }
  @media (max-width: 640px) { ul { columns: 1; } }
  li { break-inside: avoid; border-bottom: 1px dotted #d9c7a0; padding: 1px 2px; }
  .forwhom { margin: 6px 0 0; font-family: Georgia, serif; font-size: 16px; color: #651a14; }
  .foot { margin-top: 26px; text-align: center; color: #8a6a3a; font-size: 12px; border-top: 1px solid #e0d2ab; padding-top: 12px; }
  .empty { text-align:center; color:#8a6a3a; font-style:italic; }
  @media print { .noprint { display: none !important; } body { background:#fff; } .wrap { padding:0; } }
</style></head>
<body>
  <div class="bar noprint">
    <button onclick="window.print()">Printează / Salvează ca PDF</button>
  </div>
  <p class="hint noprint">Dacă butonul nu funcționează în WhatsApp, deschide pagina în Chrome/Safari (meniul din colț → „Deschide în browser").</p>
  <div class="wrap">
    <div class="head">
      <div class="sitecross">☩</div>
      <img src="${LOGO}" alt="Parohia Sf. Cuv. Teodora de la Sihla" />
      <h1>Acatist</h1>
      <p class="forwhom">pentru ctitorii și binefăcătorii bisericii</p>
      <p class="sub">Parohia „Sfânta Cuvioasă Teodora de la Sihla" — Botoșani</p>
      ${periodHtml}
    </div>
    <p class="intro">Pentru sănătatea, mântuirea și binecuvântarea robilor lui Dumnezeu,<br/>ctitori și binefăcători ai sfântului lăcaș:</p>
    ${names.length ? `<ul>${items}</ul>` : '<p class="empty">(încă niciun donator)</p>'}
    <p class="foot">Întocmit automat · ${today} · ${names.length} prenume</p>
  </div>
</body></html>`;
}
