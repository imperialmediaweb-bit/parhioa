import { PostEditor } from '../post-editor';
import { isAdminKeyValid } from '@/lib/admin-auth';
import { AdminLocked } from '../../admin-locked';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Articol nou' };

export default function NewPostPage({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  const provided = searchParams.key;
  if (!isAdminKeyValid(provided)) {
    return <AdminLocked />;
  }

  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="font-display text-3xl text-burgundy mb-6">Articol nou</h1>
      <PostEditor adminKey={provided} />
    </div>
  );
}
