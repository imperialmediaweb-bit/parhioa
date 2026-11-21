import { prisma } from '@/lib/prisma';
import { Hero } from '@/components/site/hero';
import { PostCard } from '@/components/site/post-card';
import { FadeIn } from '@/components/magicui/fade-in';
import { PLACEHOLDER_POSTS } from '@/lib/placeholder-posts';
import { ARTICOLE_STATICE } from '@/lib/articole-statice';

export const revalidate = 60;
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Noutăți',
  path: '/blog',
  description:
    'Noutăți, anunțuri și cuvinte duhovnicești de la Parohia „Sfânta Cuvioasă Teodora" din Botoșani: slujbe, pelerinaje și momente din viața parohiei.',
});

type Card = {
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: Date | null;
  featuredUrl?: string | null;
  featuredAlt?: string | null;
  categories: { name: string; slug: string }[];
};

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

  // Our own editorial articles always appear, merged with DB posts (or the
  // placeholder set when the DB is empty), newest first.
  const staticCards: Card[] = ARTICOLE_STATICE.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    publishedAt: a.publishedAt,
    featuredUrl: a.featuredUrl,
    featuredAlt: a.featuredAlt,
    categories: [{ name: a.category, slug: a.category.toLowerCase() }],
  }));

  const dbCards: Card[] =
    posts.length > 0
      ? posts.map((p) => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          publishedAt: p.publishedAt,
          featuredUrl: p.featured?.url,
          featuredAlt: p.featured?.alt,
          categories: p.categories,
        }))
      : PLACEHOLDER_POSTS.map((p) => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          publishedAt: p.publishedAt,
          featuredUrl: p.featuredUrl,
          featuredAlt: p.title,
          categories: [{ name: p.category, slug: p.category.toLowerCase() }],
        }));

  const cards: Card[] = [...staticCards, ...dbCards].sort(
    (a, b) =>
      (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0),
  );
  return (
    <>
      <Hero
        title="Blog"
        subtitle="Vești din parohie și din viața bisericii — gânduri, slujbe și momente împărtășite."
        breadcrumb={[{ label: 'Acasă', href: '/' }, { label: 'Blog' }]}
      />
      <section className="container py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((p, i) => (
            <FadeIn key={p.slug} delay={(i % 6) * 0.05}>
              <PostCard
                slug={p.slug}
                title={p.title}
                excerpt={p.excerpt}
                publishedAt={p.publishedAt}
                featuredUrl={p.featuredUrl}
                featuredAlt={p.featuredAlt}
                categories={p.categories}
              />
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
