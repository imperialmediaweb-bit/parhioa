import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import type { Metadata } from 'next';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await api.post(params.slug);
    return {
      title: `${post.title} — Parohia Sf. Teodora de la Sihla`,
      description: post.excerpt || undefined,
    };
  } catch {
    return { title: 'Articol negăsit' };
  }
}

export default async function PostPage({ params }: Props) {
  let post;
  try {
    post = await api.post(params.slug);
  } catch {
    notFound();
  }

  return (
    <article>
      <h1 className="text-3xl font-bold text-brand-dark mb-2">{post.title}</h1>
      {post.publishedAt && (
        <p className="text-sm text-stone-500 mb-6">
          {new Date(post.publishedAt).toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      )}
      {post.featured?.url && (
        <img
          src={post.featured.url}
          alt={post.featured.alt || post.title}
          className="rounded mb-6 w-full max-h-96 object-cover"
        />
      )}
      <div className="wp-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      {post.categories.length > 0 && (
        <div className="mt-8 pt-4 border-t text-sm text-stone-600">
          Categorii: {post.categories.map((c) => c.name).join(', ')}
        </div>
      )}
    </article>
  );
}
