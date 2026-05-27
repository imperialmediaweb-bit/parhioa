import Link from 'next/link';
import { api } from '@/lib/api';

export const revalidate = 60;
export const metadata = { title: 'Blog — Parohia Sf. Teodora de la Sihla' };

export default async function BlogPage() {
  const posts = await api.posts({ take: 50 });

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark mb-6">Articole</h1>
      {posts.length === 0 ? (
        <p className="text-stone-600">Nu există articole publicate.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((p) => (
            <li key={p.id} className="border-b pb-4">
              <Link href={`/blog/${p.slug}`} className="text-xl font-semibold text-brand hover:underline">
                {p.title}
              </Link>
              {p.publishedAt && (
                <p className="text-xs text-stone-500 mt-1">
                  {new Date(p.publishedAt).toLocaleDateString('ro-RO')}
                </p>
              )}
              {p.excerpt && <p className="text-stone-600 mt-2">{p.excerpt}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
