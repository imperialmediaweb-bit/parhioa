import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Media' };

export default async function MediaAdminPage() {
  const media = await prisma.media.findMany({
    orderBy: { wpId: 'desc' },
    take: 200,
  });

  return (
    <div className="container py-12">
      <h1 className="font-display text-3xl font-semibold text-burgundy mb-2">
        Media în baza de date
      </h1>
      <p className="text-ink-muted mb-8">
        {media.length} fișiere. Verifică aici ce s-a importat și ce nume au.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {media.map((m) => (
          <div
            key={m.id}
            className="border border-border rounded-xl overflow-hidden bg-white text-sm"
          >
            <div className="aspect-square bg-cream relative">
              <img
                src={m.url}
                alt={m.alt || m.filename}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-3 space-y-1">
              <p className="font-mono text-xs text-ink truncate" title={m.filename}>
                <strong>filename:</strong> {m.filename}
              </p>
              <p className="font-mono text-xs text-ink-muted">
                <strong>wpId:</strong> {m.wpId} · <strong>id:</strong> {m.id}
              </p>
              {m.wpUrl && (
                <p className="font-mono text-[10px] text-ink-soft truncate" title={m.wpUrl}>
                  wp: {m.wpUrl.replace(/^https?:\/\//, '')}
                </p>
              )}
              <p className="font-mono text-[10px] text-ink-soft truncate" title={m.url}>
                cdn: {m.url.replace(/^https?:\/\//, '')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
