import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PostEditor } from '../../post-editor';
import { isAdminKeyValid } from '@/lib/admin-auth';
import { AdminLocked } from '../../../admin-locked';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Modifică articol' };

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { key?: string };
}) {
  const provided = searchParams.key;
  if (!isAdminKeyValid(provided)) {
    return <AdminLocked />;
  }

  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();
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
