import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Status' };

export default async function AdminPage() {
  let counts = { pages: 0, posts: 0, media: 0, categories: 0, tags: 0 };
  let recentPosts: { id: number; title: string; slug: string; status: string }[] = [];
  let error: string | null = null;

  try {
    const [pages, posts, media, categories, tags] = await Promise.all([
      prisma.page.count(),
      prisma.post.count(),
      prisma.media.count(),
      prisma.category.count(),
      prisma.tag.count(),
    ]);
    counts = { pages, posts, media, categories, tags };

    recentPosts = await prisma.post.findMany({
      take: 20,
      orderBy: { publishedAt: 'desc' },
      select: { id: true, title: true, slug: true, status: true },
    });
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="font-display text-3xl font-semibold text-burgundy mb-6">
        Admin · DB Status
      </h1>

      {error && (
        <div className="bg-burgundy/10 border border-burgundy text-burgundy p-4 rounded-lg mb-6">
          <strong>Eroare DB:</strong>
          <pre className="text-xs mt-2 whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Pagini', value: counts.pages, href: null },
          { label: 'Articole', value: counts.posts, href: '/blog' },
          { label: 'Poze (Media)', value: counts.media, href: '/admin/media' },
          { label: 'Categorii', value: counts.categories, href: null },
          { label: 'Tag-uri', value: counts.tags, href: null },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-cream-card border border-border rounded-xl p-5 text-center"
          >
            <div className="font-display text-4xl font-bold text-burgundy">{stat.value}</div>
            <p className="text-sm text-ink-muted mt-1 uppercase tracking-wider">
              {stat.label}
            </p>
            {stat.href && (
              <Link href={stat.href} className="text-xs text-coral hover:underline mt-2 inline-block">
                vezi →
              </Link>
            )}
          </div>
        ))}
      </div>

      <h2 className="font-display text-2xl font-semibold text-navy mb-4">
        Cele mai recente {recentPosts.length} articole
      </h2>
      {recentPosts.length === 0 ? (
        <p className="text-ink-muted">
          Nu există articole în DB. Rulează:{' '}
          <code className="bg-cream-card px-2 py-1 rounded">railway run npm run import:wp</code>
        </p>
      ) : (
        <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
          <thead className="bg-cream-card">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Titlu</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentPosts.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3 font-mono text-xs text-ink-soft">{p.id}</td>
                <td className="p-3">
                  <Link href={`/blog/${p.slug}`} className="text-burgundy hover:underline">
                    {p.title}
                  </Link>
                </td>
                <td className="p-3 font-mono text-xs text-ink-soft">{p.slug}</td>
                <td className="p-3">
                  <span
                    className={
                      p.status === 'publish'
                        ? 'text-green-700 bg-green-100 px-2 py-0.5 rounded text-xs'
                        : 'text-orange-700 bg-orange-100 px-2 py-0.5 rounded text-xs'
                    }
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-10 text-sm text-ink-muted space-y-2">
        <p>
          <Link href="/admin/media" className="text-coral hover:underline">
            → Vezi toate pozele din DB
          </Link>
        </p>
        <p>
          <Link href="/" className="text-coral hover:underline">
            ← Înapoi acasă
          </Link>
        </p>
      </div>
    </div>
  );
}
