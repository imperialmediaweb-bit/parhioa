import Link from 'next/link';
import { api } from '@/lib/api';

export const revalidate = 60;

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof api.posts>> = [];
  let homePage: Awaited<ReturnType<typeof api.page>> | null = null;
  try {
    homePage = await api.page('acasa');
  } catch {
    try {
      homePage = await api.page('home');
    } catch {}
  }
  try {
    posts = await api.posts({ take: 6 });
  } catch {}

  return (
    <div className="space-y-12">
      {homePage ? (
        <article>
          <h1 className="text-3xl font-bold text-brand-dark mb-4">{homePage.title}</h1>
          <div className="wp-content" dangerouslySetInnerHTML={{ __html: homePage.content }} />
        </article>
      ) : (
        <section>
          <h1 className="text-3xl font-bold text-brand-dark mb-2">Bun venit</h1>
          <p className="text-stone-600">
            Site-ul Parohiei Sf. Teodora de la Sihla. Aici găsiți programul slujbelor,
            evenimente și articole.
          </p>
        </section>
      )}

      {posts.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-brand-dark mb-4">Articole recente</h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {posts.map((p) => (
              <li key={p.id} className="bg-white p-4 rounded shadow-sm border border-stone-200">
                <Link href={`/blog/${p.slug}`} className="text-lg font-semibold text-brand hover:underline">
                  {p.title}
                </Link>
                {p.publishedAt && (
                  <p className="text-xs text-stone-500 mt-1">
                    {new Date(p.publishedAt).toLocaleDateString('ro-RO')}
                  </p>
                )}
                {p.excerpt && <p className="text-sm text-stone-600 mt-2 line-clamp-3">{p.excerpt}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
