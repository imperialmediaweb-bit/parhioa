import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '../../../lib/prisma';
import { Hero } from '../../../components/site/hero';
import { Badge } from '../../../components/ui/badge';
import { formatDateRo } from '../../../lib/utils';
import { PLACEHOLDER_POSTS } from '../../../lib/placeholder-posts';
import { sanitizePostHtml } from '@/lib/sanitize';
import { DEFAULT_OG_IMAGE } from '@/lib/site';
import { blogPostingJsonLd, breadcrumbJsonLd } from '@/lib/jsonld';
import { JsonLd } from '@/components/site/jsonld';

export const revalidate = 60;

type Props = { params: { slug: string } };

async function getPost(slug: string) {
  try {
    const dbPost = await prisma.post.findUnique({
      where: { slug },
      include: { featured: true, categories: true, tags: true },
    });
    if (dbPost && dbPost.status === 'publish') return dbPost;
  } catch {
    // ignore
  }

  const fallback = PLACEHOLDER_POSTS.find((p) => p.slug === slug);
  if (!fallback) return null;

  return {
    id: fallback.slug,
    slug: fallback.slug,
    status: 'publish' as const,
    title: fallback.title,
    excerpt: fallback.excerpt,
    publishedAt: fallback.publishedAt,
    content: `<p class="lead">${fallback.excerpt}</p><p>Articolul integral este disponibil pe site-ul oficial al parohiei: <a href="https://www.parohiasfteodoradelasihla.ro/${fallback.slug}/" target="_blank" rel="noopener" class="text-burgundy underline">citește mai departe</a>.</p>`,
    featured: { url: fallback.featuredUrl, alt: fallback.title },
    categories: [{ name: fallback.category, slug: fallback.category.toLowerCase() }],
    tags: [] as Array<{ name: string; slug: string }>,
    _placeholder: true,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Articol negăsit', robots: { index: false } };

  const url = `/blog/${post.slug}`;
  const description = post.excerpt || undefined;
  const image = post.featured?.url || DEFAULT_OG_IMAGE;
  const publishedTime =
    post.publishedAt instanceof Date
      ? post.publishedAt.toISOString()
      : post.publishedAt || undefined;

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description,
      publishedTime,
      images: [{ url: image, alt: post.featured?.alt || post.title }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description, images: [image] },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={[
          blogPostingJsonLd({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            publishedAt: post.publishedAt,
            updatedAt: (post as any).updatedAt ?? null,
            imageUrl: post.featured?.url ?? null,
          }),
          breadcrumbJsonLd([
            { name: 'Acasă', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <Hero
        title={post.title}
        subtitle={post.publishedAt ? formatDateRo(post.publishedAt) : undefined}
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title },
        ]}
      />
      <article className="container py-16 max-w-3xl">
        {post.featured?.url && (
          <img
            src={post.featured.url}
            alt={post.featured.alt || post.title}
            className="rounded-2xl w-full max-h-[480px] object-cover mb-10 shadow-sm"
          />
        )}
        {/* Sanitize on render too — defense in depth in case a legacy
            WordPress-imported post has dangerous HTML the save handler
            never sanitized. */}
        <div
          className="wp-content"
          dangerouslySetInnerHTML={{ __html: sanitizePostHtml(post.content) }}
        />
        {post.categories.length > 0 && (
          <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink-muted mr-2">Categorii:</span>
            {post.categories.map((c) => (
              <Badge key={c.slug} variant="secondary" className="font-serif italic">
                {c.name}
              </Badge>
            ))}
          </div>
        )}
      </article>
    </>
  );
}
