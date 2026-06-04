import { prisma } from '@/lib/prisma';
import { CopyEmailsButton } from './copy-emails-button';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Donații' };

interface SearchParams {
  key?: string;
}

export default async function DonationsAdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const expected = process.env.ADMIN_KEY;
  const provided = searchParams.key;

  if (expected && provided !== expected) {
    return (
      <div className="container py-20 max-w-md mx-auto text-center">
        <h1 className="font-display text-2xl text-burgundy mb-3">Acces restricționat</h1>
        <p className="text-ink-muted text-sm">
          Accesează pagina prin linkul cu cheia primită la administrare.
        </p>
      </div>
    );
  }

  const isUnprotected = !expected;

  const [donations, donors, aggByStatus] = await Promise.all([
    prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      include: { donor: true },
      take: 500,
    }),
    prisma.donor.findMany({
      where: { email: { not: null } },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, isPublic: true, createdAt: true },
    }),
    prisma.donation.groupBy({
      by: ['status'],
      _sum: { amount: true },
      _count: { _all: true },
    }),
  ]);

  const totals: Record<string, { sum: number; count: number }> = {};
  for (const g of aggByStatus) {
    totals[g.status] = { sum: g._sum.amount || 0, count: g._count._all || 0 };
  }
  const totalRaised =
    (totals.completed?.sum || 0) + (totals.self_reported_bank?.sum || 0);
  const totalCompleted =
    (totals.completed?.count || 0) + (totals.self_reported_bank?.count || 0);

  const allEmails = donors.map((d) => d.email!).filter(Boolean).join(', ');

  const csv = [
    'nume,email,public,creat_la',
    ...donors.map((d) =>
      [
        (d.name ?? '').replace(/,/g, ' '),
        d.email ?? '',
        d.isPublic ? 'da' : 'nu',
        d.createdAt.toISOString(),
      ].join(','),
    ),
  ].join('\n');

  return (
    <div className="container py-10 max-w-6xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl text-burgundy">Donații & ctitori</h1>
          <p className="text-xs text-ink-soft mt-1">
            Toți cei care au inițiat o donație (reușită, în transfer sau abandonată)
            sunt salvați aici.
          </p>
        </div>
        {isUnprotected && (
          <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
            ⚠️ Setează <code>ADMIN_KEY</code> în Railway ca să protejezi pagina
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Stat label="Total strâns" value={`${totalRaised.toLocaleString('ro-RO')} RON`} />
        <Stat label="Donații reușite" value={String(totalCompleted)} />
        <Stat label="Emailuri colectate" value={String(donors.length)} />
        <Stat
          label="Refunded"
          value={String(totals.refunded?.count || 0)}
          muted
        />
      </div>

      {/* Email list for future campaigns */}
      <section className="mb-10 rounded-2xl border border-border bg-white p-5 sm:p-6">
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <h2 className="font-display text-xl text-burgundy">
            Listă pentru campanii viitoare
          </h2>
          <div className="flex gap-2">
            <CopyEmailsButton emails={allEmails} />
            <a
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
              download={`ctitori-${new Date().toISOString().slice(0, 10)}.csv`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-burgundy bg-burgundy text-cream text-xs font-medium hover:bg-burgundy-dark transition-colors"
            >
              Export CSV
            </a>
          </div>
        </div>
        <p className="text-xs text-ink-soft mb-3">
          {donors.length} emailuri unice. „Copy emails" îți copiază în clipboard
          lista separată prin virgulă — pentru Mailchimp, Brevo, etc.
        </p>
        <details className="text-xs">
          <summary className="cursor-pointer text-burgundy hover:underline">
            Vezi lista completă ({donors.length})
          </summary>
          <div className="mt-3 p-3 bg-cream-card/60 rounded-lg font-mono text-[11px] break-all leading-relaxed">
            {allEmails || '(încă nicio adresă colectată)'}
          </div>
        </details>
      </section>

      {/* Donations table */}
      <h2 className="font-display text-xl text-burgundy mb-4">Ultimele donații</h2>
      {donations.length === 0 ? (
        <div className="text-center py-12 text-ink-muted bg-cream-card/40 rounded-2xl">
          Nicio donație încă.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-cream-card text-ink-soft text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left">Donator</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-right">Sumă</th>
                <th className="px-4 py-3 text-left">Metodă</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Public</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {donations.map((d) => {
                const method = d.stripeSessionId.startsWith('bank_')
                  ? 'Transfer'
                  : d.recurring
                    ? 'Card · lunar'
                    : 'Card';
                const isPublic = d.donor?.isPublic !== false;
                return (
                  <tr key={d.id} className="hover:bg-cream-card/30">
                    <td className="px-4 py-3 text-ink-soft text-xs whitespace-nowrap">
                      {d.createdAt.toLocaleString('ro-RO', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">
                      {d.donor?.name || (
                        <span className="italic text-ink-soft">Anonim</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-muted font-mono break-all">
                      {d.donor?.email || '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-display font-bold text-burgundy whitespace-nowrap">
                      {d.amount.toLocaleString('ro-RO')}{' '}
                      <span className="text-[10px] text-ink-soft font-sans">
                        {d.currency.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">{method}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {isPublic ? (
                        <span className="text-green-700">da</span>
                      ) : (
                        <span className="text-ink-soft italic">anonim</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-ink-soft mt-6 text-center">
        Afișate ultimele {donations.length} donații.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white px-4 py-4">
      <p className="text-[10px] uppercase tracking-wider text-ink-soft font-ceremonial">
        {label}
      </p>
      <p
        className={`font-display text-2xl font-bold mt-1 ${
          muted ? 'text-ink-soft' : 'text-burgundy'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    completed: { label: 'plătit', cls: 'bg-green-100 text-green-800' },
    self_reported_bank: { label: 'transfer', cls: 'bg-amber-100 text-amber-800' },
    refunded: { label: 'refund', cls: 'bg-red-100 text-red-800' },
  };
  const entry = map[status] || { label: status, cls: 'bg-gray-100 text-gray-700' };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium ${entry.cls}`}
    >
      {entry.label}
    </span>
  );
}
