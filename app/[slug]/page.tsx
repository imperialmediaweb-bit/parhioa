import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Hero } from '@/components/site/hero';

export const revalidate = 60;

type Props = { params: { slug: string } };

const RESERVED = new Set([
  'blog', 'api', '_next', 'favicon.ico',
  'despre', 'misiune', 'campanii', 'contact', 'doneaza', 'redirectioneaza-3-5',
]);

async function getPage(slug: string) {
  try {
    return await prisma.page.findUnique({
      where: { slug },
      include: { featured: true },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (RESERVED.has(params.slug)) return {};
  const page = await getPage(params.slug);
  if (!page) return { title: 'Pagină negăsită' };
  return { title: page.title, description: page.excerpt || undefined };
}

export default async function DynamicPage({ params }: Props) {
  if (RESERVED.has(params.slug)) notFound();
  const page = await getPage(params.slug);
  if (!page || page.status !== 'publish') notFound();

  return (
    <>
      <Hero
        title={page.title}
        subtitle={page.excerpt || undefined}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: page.title }]}
      />
      <article className="container py-16 max-w-3xl">
        {page.featured?.url && (
          <img
            src={page.featured.url}
            alt={page.featured.alt || page.title}
            className="rounded-2xl w-full max-h-[480px] object-cover mb-10 shadow-sm"
          />
        )}
        <div className="wp-content" dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </>
  );
}
