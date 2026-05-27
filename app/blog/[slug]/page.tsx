import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Hero } from '@/components/site/hero';
import { Badge } from '@/components/ui/badge';
import { formatDateRo } from '@/lib/utils';

export const revalidate = 60;

type Props = { params: { slug: string } };

async function getPost(slug: string) {
  try {
    return await prisma.post.findUnique({
      where: { slug },
      include: { featured: true, categories: true, tags: true },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Articol negăsit' };
  return { title: post.title, description: post.excerpt || undefined };
}

export default async function PostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post || post.status !== 'publish') notFound();

  return (
    <>
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
        <div className="wp-content" dangerouslySetInnerHTML={{ __html: post.content }} />
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
