import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Plus, ExternalLink, Pencil } from 'lucide-react';
import { DeletePostButton } from './delete-post-button';
import { isAdminKeyValid } from '@/lib/admin-auth';
import { AdminLocked } from '../admin-locked';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Blog' };

interface SearchParams {
  key?: string;
}

export default async function AdminBlogList({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const provided = searchParams.key;
  if (!isAdminKeyValid(provided)) {
    return <AdminLocked />;
  }
  const keyParam = `?key=${encodeURIComponent(provided as string)}`;

  const posts = await prisma.post.findMany({
    orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      publishedAt: true,
      excerpt: true,
    },
    take: 200,
  });

  return (
    <div className="container py-10 max-w-5xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <Link
            href={`/admin${keyParam}`}
            className="text-xs text-ink-soft hover:text-burgundy"
          >
            ← Înapoi la panou
          </Link>
          <h1 className="font-display text-3xl text-burgundy mt-1">Blog · articole</h1>
        </div>
        <Link
          href={`/admin/blog/new${keyParam}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-burgundy text-cream font-medium hover:bg-burgundy-dark transition-colors"
        >
          <Plus className="h-4 w-4" /> Articol nou
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-border bg-cream-card/40">
          <p className="text-ink-muted mb-4">Nu există articole încă.</p>
          <Link
            href={`/admin/blog/new${keyParam}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-burgundy text-cream text-sm"
          >
            <Plus className="h-4 w-4" /> Creează primul articol
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-card text-ink-soft text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Titlu</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Publicat</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-cream-card/30">
                  <td className="px-4 py-3 font-medium text-ink">{p.title}</td>
                  <td className="px-4 py-3 text-xs font-mono text-ink-muted">
                    {p.slug}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted">
                    {p.publishedAt
                      ? p.publishedAt.toLocaleDateString('ro-RO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium ${
                        p.status === 'publish'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status === 'publish' ? 'publicat' : p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        className="p-1.5 rounded hover:bg-cream-card text-ink-soft hover:text-burgundy"
                        title="Vezi pe site"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/blog/${p.id}/edit${keyParam}`}
                        className="p-1.5 rounded hover:bg-cream-card text-ink-soft hover:text-burgundy"
                        title="Modifică"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeletePostButton id={p.id} title={p.title} adminKey={provided} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
