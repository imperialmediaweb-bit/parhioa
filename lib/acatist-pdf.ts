import { readFileSync } from 'fs';
import path from 'path';
import { PDFDocument, rgb, PDFFont, PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const LOGO_URL =
  'https://pub-49f4280024fa4ca2b8a4f6323442efe8.r2.dev/sf_theodora_de_la_sihla_ri9rz2.png';

const BURGUNDY = rgb(0.396, 0.102, 0.078); // #651a14
const GOLD = rgb(0.788, 0.639, 0.38); // #c9a361
const INK = rgb(0.227, 0.082, 0.071);
const SOFT = rgb(0.54, 0.42, 0.23);

function fontPath(file: string): string {
  return path.join(process.cwd(), 'assets', 'fonts', file);
}

/** Build the acatist as a real PDF (A4, 2 columns of first names). */
export async function buildAcatistPdf(
  names: string[],
  periodLabel?: string,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const regular = await doc.embedFont(readFileSync(fontPath('DejaVuSerif.ttf')));
  const bold = await doc.embedFont(readFileSync(fontPath('DejaVuSerif-Bold.ttf')));

  // Optional logo.
  let logo: any = null;
  try {
    const res = await fetch(LOGO_URL);
    if (res.ok) logo = await doc.embedPng(new Uint8Array(await res.arrayBuffer()));
  } catch {}

  const W = 595.28;
  const H = 841.89;
  const M = 50;

  const center = (
    page: PDFPage,
    text: string,
    y: number,
    size: number,
    font: PDFFont,
    color = INK,
  ) => {
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (W - w) / 2, y, size, font, color });
  };

  const newPage = (): PDFPage => doc.addPage([W, H]);

  // ---- Header (first page) ----
  let page = newPage();
  let y = H - M;

  if (logo) {
    const lw = 60;
    const lh = (logo.height / logo.width) * lw;
    page.drawImage(logo, { x: (W - lw) / 2, y: y - lh, width: lw, height: lh });
    y -= lh + 28;
  } else {
    y -= 10;
  }

  center(page, 'ACATIST', y, 26, bold, BURGUNDY);
  y -= 24;
  center(page, 'pentru ctitorii și binefăcătorii bisericii', y, 12, regular, INK);
  y -= 18;
  center(page, 'Parohia „Sfânta Cuvioasă Teodora de la Sihla" — Botoșani', y, 11, regular, SOFT);
  y -= 16;
  if (periodLabel) {
    center(page, periodLabel.toUpperCase(), y, 10, bold, GOLD);
    y -= 16;
  }

  // gold rule
  page.drawLine({
    start: { x: M, y: y - 2 },
    end: { x: W - M, y: y - 2 },
    thickness: 1.5,
    color: GOLD,
  });
  y -= 22;

  center(
    page,
    'Pentru sănătatea, mântuirea și binecuvântarea robilor lui Dumnezeu,',
    y,
    11,
    regular,
    INK,
  );
  y -= 15;
  center(page, 'ctitori și binefăcători ai sfântului lăcaș:', y, 11, regular, INK);
  y -= 24;

  // ---- Two-column list ----
  const colGap = 24;
  const colW = (W - 2 * M - colGap) / 2;
  const size = 12;
  const lineH = 20;
  const bottom = M + 24;
  const colX = [M, M + colW + colGap];

  let col = 0;
  let cy = y;

  const ensureRoom = () => {
    if (cy < bottom) {
      col++;
      if (col > 1) {
        page = newPage();
        col = 0;
        cy = H - M;
      } else {
        cy = y; // top of columns on same page
      }
    }
  };

  if (names.length === 0) {
    center(page, '(încă niciun donator)', cy, 12, regular, SOFT);
  } else {
    for (const name of names) {
      ensureRoom();
      page.drawText(name, { x: colX[col], y: cy, size, font: regular, color: INK });
      page.drawLine({
        start: { x: colX[col], y: cy - 5 },
        end: { x: colX[col] + colW, y: cy - 5 },
        thickness: 0.4,
        color: rgb(0.85, 0.78, 0.63),
        opacity: 0.6,
      });
      cy -= lineH;
    }
  }

  // ---- Footer on last page ----
  const today = new Date().toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  center(
    doc.getPages()[doc.getPageCount() - 1],
    `Întocmit automat · ${today} · ${names.length} prenume`,
    M - 14,
    9,
    regular,
    SOFT,
  );

  return doc.save();
}
