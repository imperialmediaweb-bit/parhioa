import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const expected = process.env.ADMIN_KEY;
  const body = await req.json();

  if (expected && body.key !== expected) {
    return NextResponse.json({ error: 'Acces refuzat' }, { status: 403 });
  }

  const title = String(body.title || '').trim();
  const slug = String(body.slug || '').trim();
  const content = String(body.content || '');
  const excerpt = String(body.excerpt || '').trim() || null;
  const status = String(body.status || 'publish');
  const featuredUrl = body.featuredUrl ? String(body.featuredUrl).trim() : null;
  const id = body.id ? Number(body.id) : null;

  if (!title || !slug || !content) {
    return NextResponse.json(
      { error: 'Titlul, slug-ul și conținutul sunt obligatorii.' },
      { status: 400 },
    );
  }

  // Resolve featured media (create a Media row if URL given)
  let featuredId: number | null = null;
  if (featuredUrl) {
    const existing = await prisma.media.findFirst({ where: { url: featuredUrl } });
    if (existing) {
      featuredId = existing.id;
    } else {
      const created = await prisma.media.create({
        data: { filename: featuredUrl.split('/').pop() || 'featured', url: featuredUrl },
      });
      featuredId = created.id;
    }
  }

  try {
    if (id) {
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
    return NextResponse.json(
      { error: err?.message || 'Eroare la salvare.' },
      { status: 500 },
    );
  }
}
