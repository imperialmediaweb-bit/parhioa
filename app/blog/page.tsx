import { prisma } from '@/lib/prisma';
import { Hero } from '@/components/site/hero';
import { PostCard } from '@/components/site/post-card';
import { FadeIn } from '@/components/magicui/fade-in';
import { PLACEHOLDER_POSTS } from '@/lib/placeholder-posts';

export const revalidate = 60;
export const metadata = { title: 'Noutăți' };

async function getPosts() {
  try {
    return await prisma.post.findMany({
      where: { status: 'publish' },
      include: { featured: true, categories: true },
      orderBy: { publishedAt: 'desc' },
      take: 50,
    });
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <Hero
        title="Blog"
        subtitle="Vești din parohie și din viața bisericii — gânduri, slujbe și momente împărtășite."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
      />
      <section className="container py-12">
        {posts.length === 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLACEHOLDER_POSTS.map((p, i) => (
              <FadeIn key={p.slug} delay={(i % 6) * 0.05}>
                <PostCard
                  slug={p.slug}
                  title={p.title}
                  excerpt={p.excerpt}
                  publishedAt={p.publishedAt}
                  featuredUrl={p.featuredUrl}
                  featuredAlt={p.title}
                  categories={[{ name: p.category, slug: p.category.toLowerCase() }]}
                />
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p, i) => (
              <FadeIn key={p.id} delay={(i % 6) * 0.05}>
                <PostCard
                  slug={p.slug}
                  title={p.title}
                  excerpt={p.excerpt}
                  publishedAt={p.publishedAt}
                  featuredUrl={p.featured?.url}
                  featuredAlt={p.featured?.alt}
                  categories={p.categories}
                />
              </FadeIn>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
