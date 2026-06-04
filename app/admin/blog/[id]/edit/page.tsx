import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PostEditor } from '../../post-editor';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Modifică articol' };

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { key?: string };
}) {
  const expected = process.env.ADMIN_KEY;
  const provided = searchParams.key;
  if (expected && provided !== expected) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-2xl text-burgundy">Acces restricționat</h1>
      </div>
    );
  }

  const id = Number(params.id);
  const post = await prisma.post.findUnique({
    where: { id },
    include: { featured: true },
  });
  if (!post) notFound();

  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="font-display text-3xl text-burgundy mb-6">Modifică articol</h1>
      <PostEditor
        adminKey={provided}
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? '',
          content: post.content,
          status: post.status,
          featuredUrl: post.featured?.url ?? '',
        }}
      />
    </div>
  );
}
