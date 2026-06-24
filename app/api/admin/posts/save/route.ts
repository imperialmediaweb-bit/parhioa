import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminKeyValid } from '@/lib/admin-auth';
import { sanitizePostHtml, sanitizeText } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SAFE_FEATURED_URL = /^https:\/\/[a-z0-9.\-]+\/[^\s<>"']+$/i;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any));

  if (!isAdminKeyValid(body.key)) {
    return NextResponse.json({ error: 'Acces refuzat' }, { status: 403 });
  }

  const title = sanitizeText(String(body.title || '')).slice(0, 200);
  const slug = String(body.slug || '').trim().toLowerCase().slice(0, 120);
  const status = body.status === 'draft' ? 'draft' : 'publish';
  const id = body.id ? Number(body.id) : null;

  // Sanitize HTML body and excerpt. Excerpt strips ALL tags; content uses
  // the parish allowlist (p, em, strong, links, lists, img, h2-h4 etc.)
  const content = sanitizePostHtml(String(body.content || ''));
  const excerpt = sanitizeText(String(body.excerpt || '')).slice(0, 280) || null;

  // Featured URL must be a real https URL — block javascript:, data:, etc.
  const featuredUrlRaw = body.featuredUrl ? String(body.featuredUrl).trim() : '';
  let featuredUrl: string | null = null;
  if (featuredUrlRaw) {
    if (!SAFE_FEATURED_URL.test(featuredUrlRaw) || featuredUrlRaw.length > 600) {
      return NextResponse.json(
        { error: 'URL-ul imaginii principale trebuie să fie o adresă https validă.' },
        { status: 400 },
      );
    }
    featuredUrl = featuredUrlRaw;
  }

  if (!title || !slug || !content.replace(/<[^>]+>/g, '').trim()) {
    // The content trim ignores empty <p></p>, <br>, etc. — so the editor
    // can't save an article with only whitespace markup.
    return NextResponse.json(
      { error: 'Titlul, slug-ul și conținutul sunt obligatorii.' },
      { status: 400 },
    );
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: 'Slug-ul poate conține doar litere mici, cifre și liniuțe.' },
      { status: 400 },
    );
  }

  // Resolve featured media (reuse existing Media row by URL when possible)
  let featuredId: number | null = null;
  if (featuredUrl) {
    const existing = await prisma.media.findFirst({ where: { url: featuredUrl } });
    if (existing) {
      featuredId = existing.id;
    } else {
      const created = await prisma.media.create({
        data: {
          filename: featuredUrl.split('/').pop() || 'featured',
          url: featuredUrl,
        },
      });
      featuredId = created.id;
    }
  }

  try {
    if (id) {
      if (!Number.isFinite(id)) {
        return NextResponse.json({ error: 'ID articol invalid.' }, { status: 400 });
      }
      await prisma.post.update({
        where: { id },
        data: {
          title,
          slug,
          content,
          excerpt,
          status,
          featuredId,
          publishedAt: status === 'publish' ? new Date() : null,
        },
      });
    } else {
      await prisma.post.create({
        data: {
          title,
          slug,
          content,
          excerpt,
          status,
          featuredId,
          publishedAt: status === 'publish' ? new Date() : null,
        },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'Slug-ul există deja.' }, { status: 400 });
    }
    console.error('[posts/save] failed:', err);
    return NextResponse.json({ error: 'Eroare la salvare.' }, { status: 500 });
  }
}
