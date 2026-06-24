import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Public unsubscribe link from the welcome email.
 * GET /api/newsletter/unsubscribe?id=NN
 *
 * Returns plain HTML so the user lands on a friendly page without needing
 * to log in. The id is opaque enough — if someone enumerates it, the worst
 * they can do is unsubscribe a stranger (we can recover by re-subscribing).
 */
export async function GET(req: NextRequest) {
  const idStr = req.nextUrl.searchParams.get('id');
  const id = Number(idStr);
  if (!Number.isFinite(id)) {
    return new NextResponse('Link invalid.', { status: 400 });
  }

  try {
    await prisma.subscriber.update({
      where: { id },
      data: { unsubscribedAt: new Date() },
    });
  } catch {
    // Already gone? Same UX either way.
  }

  return new NextResponse(
    `<!doctype html><html lang="ro"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Dezabonare — Parohia Sf. Teodora</title>
<style>
  body{margin:0;background:#f3ead8;font-family:Georgia,serif;color:#2c1810;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;}
  .card{max-width:480px;background:#fdf6e8;border:1px solid #c9a961;border-radius:16px;padding:36px 28px;text-align:center;}
  h1{font-size:22px;margin:0 0 14px;color:#6b1f2b;}
  p{font-size:15px;line-height:1.6;margin:0 0 12px;}
  a{color:#6b1f2b;}
</style></head>
<body><div class="card">
<div style="font-size:32px;margin-bottom:12px;">☩</div>
<h1>V-ați dezabonat</h1>
<p>Nu vă vom mai trimite emailuri de la parohie pe această adresă.</p>
<p style="font-size:13px;color:#6b5544;">Dacă a fost o greșeală, ne puteți contacta la <a href="mailto:contact@parohiasfteodoradelasihla.ro">contact@parohiasfteodoradelasihla.ro</a>.</p>
<p style="margin-top:20px;"><a href="/">← Înapoi pe site</a></p>
</div></body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}
