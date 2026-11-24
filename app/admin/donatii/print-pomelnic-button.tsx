'use client';

const LOGO =
  'https://pub-49f4280024fa4ca2b8a4f6323442efe8.r2.dev/sf_theodora_de_la_sihla_ri9rz2.png';

/**
 * Opens a clean, print-ready „acatist" in a new window — the parish logo, a
 * commemoration header and the donors' first names in columns — then triggers
 * the browser print dialog. `periodLabel` names the period (week/month/all) and
 * `buttonLabel` is the visible button text.
 */
export function PrintPomelnicButton({
  names,
  periodLabel,
  buttonLabel = '☩ Scoate acatistul',
  variant = 'solid',
}: {
  names: string[];
  periodLabel?: string;
  buttonLabel?: string;
  variant?: 'solid' | 'outline';
}) {
  const open = () => {
    const today = new Date().toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const periodHtml = periodLabel
      ? `<p class="period">${escapeHtml(periodLabel)}</p>`
      : '';
    const items = names
      .map((n) => `<li>${escapeHtml(n)}</li>`)
      .join('');
    const html = `<!doctype html><html lang="ro"><head><meta charset="utf-8">
<title>Acatist — Parohia Sf. Cuv. Teodora de la Sihla</title>
<style>
  @page { size: A4; margin: 18mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #3a1512; margin: 0; }
  .wrap { max-width: 760px; margin: 0 auto; padding: 24px; }
  .head { text-align: center; border-bottom: 2px solid #c9a361; padding-bottom: 16px; margin-bottom: 20px; }
  .head img { height: 84px; width: auto; }
  .sitecross { display:flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:50%; margin:0 auto 8px; background:radial-gradient(circle at 50% 40%, #f4dfb3, #EAC784 70%, #c9a361); color:#651a14; font-size:14px; line-height:1; }
  h1 { font-size: 30px; letter-spacing: 3px; text-transform: uppercase; margin: 10px 0 4px; color: #651a14; }
  .sub { font-style: italic; color: #6b4a2a; font-size: 15px; margin: 0; }
  .period { margin: 8px 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #8a6a3a; }
  .intro { text-align: center; margin: 18px 0; font-size: 16px; }
  ul { columns: 3; column-gap: 28px; list-style: none; padding: 0; margin: 0; font-size: 15px; line-height: 1.9; }
  @media (max-width: 640px) { ul { columns: 2; } }
  li { break-inside: avoid; border-bottom: 1px dotted #d9c7a0; padding: 1px 2px; }
  li::before { content: '☩ '; color: #c9a361; font-size: 11px; }
  .foot { margin-top: 26px; text-align: center; color: #8a6a3a; font-size: 12px; border-top: 1px solid #e0d2ab; padding-top: 12px; }
  .empty { text-align:center; color:#8a6a3a; font-style:italic; }
  @media print { .noprint { display: none !important; } }
</style></head>
<body><div class="wrap">
  <div class="head">
    <div class="sitecross">☩</div>
    <img src="${LOGO}" alt="Parohia Sf. Cuv. Teodora de la Sihla" />
    <h1>Acatist</h1>
    <p class="sub">Parohia „Sfânta Cuvioasă Teodora de la Sihla" — Botoșani</p>
    ${periodHtml}
  </div>
  <p class="intro">Pentru sănătatea, mântuirea și binecuvântarea robilor lui Dumnezeu,<br/>ctitori și binefăcători ai sfântului lăcaș:</p>
  ${names.length ? `<ul>${items}</ul>` : '<p class="empty">(încă niciun donator)</p>'}
  <p class="foot">Întocmit automat · ${today} · ${names.length} prenume</p>
  <button class="noprint" onclick="window.print()" style="display:block;margin:24px auto 0;padding:10px 20px;border:1px solid #651a14;background:#651a14;color:#fff;border-radius:999px;cursor:pointer;font-size:14px;">Printează / Salvează ca PDF</button>
</div>
<script>window.onload=function(){setTimeout(function(){window.print()},400)}<\/script>
</body></html>`;
    // Open a print-ready window (it auto-opens the print dialog, where the
    // priest can print OR „Salvează ca PDF" to download). If pop-ups are
    // blocked, fall back to downloading the file directly.
    const w = window.open('', '_blank');
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
      return;
    }
    const slug =
      (periodLabel || 'parohie')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40) || 'acatist';
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Acatist-${slug}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  };

  return (
    <button
      type="button"
      onClick={open}
      className={
        variant === 'outline'
          ? 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-dark/60 bg-white text-burgundy text-xs font-semibold hover:bg-cream-card transition'
          : 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-dark bg-gradient-to-br from-gold to-gold-dark text-burgundy-dark text-xs font-semibold hover:brightness-105 transition'
      }
    >
      {buttonLabel}
    </button>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
