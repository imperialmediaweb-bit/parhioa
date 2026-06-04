import { PostEditor } from '../post-editor';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Articol nou' };

export default function NewPostPage({
  searchParams,
}: {
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

  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="font-display text-3xl text-burgundy mb-6">Articol nou</h1>
      <PostEditor adminKey={provided} />
    </div>
  );
}
