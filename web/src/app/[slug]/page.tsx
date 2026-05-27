import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import type { Metadata } from 'next';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const page = await api.page(params.slug);
    return {
      title: `${page.title} — Parohia Sf. Teodora de la Sihla`,
      description: page.excerpt || undefined,
    };
  } catch {
    return { title: 'Pagină negăsită' };
  }
}

export default async function DynamicPage({ params }: Props) {
  let page;
  try {
    page = await api.page(params.slug);
  } catch {
    notFound();
  }

  return (
    <article>
      <h1 className="text-3xl font-bold text-brand-dark mb-6">{page.title}</h1>
      {page.featured?.url && (
        <img
          src={page.featured.url}
          alt={page.featured.alt || page.title}
          className="rounded mb-6 w-full max-h-96 object-cover"
        />
      )}
      <div className="wp-content" dangerouslySetInnerHTML={{ __html: page.content }} />
    </article>
  );
}
