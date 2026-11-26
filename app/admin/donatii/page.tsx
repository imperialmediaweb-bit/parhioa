import { prisma } from '@/lib/prisma';
import { CopyEmailsButton } from './copy-emails-button';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { AdminGate } from '../admin-gate';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Donații' };

interface SearchParams {
  key?: string;
}

// Common Romanian first names (diacritic-folded, lowercase) used to pick the
// „prenume" out of a full name regardless of order (Nume Prenume / Prenume Nume).
const FIRST_NAMES = new Set(
  (
    'andrei alexandru adrian marian ion ionut gabriel george gheorghe mihai mihail nicolae ' +
    'vasile constantin catalin cristian cristi daniel dan florin bogdan razvan radu sorin stefan ' +
    'stefanita stefanut marius valentin vlad victor dragos emil eugen paul petru petre teodor tudor ' +
    'toma dumitru grigore iulian lucian marcel octavian ovidiu sebastian silviu traian viorel ciprian ' +
    'costel costin doru ilie laurentiu liviu luca matei narcis sandu virgil aurel anton pavel iacob ' +
    'simion avram david darius denis robert rares eduard gelu nelu relu nicu puiu cosmin alin calin ' +
    'horia iosif leon marin mircea remus romeo sever tiberiu valeriu zaharia samoila ananie gavril ' +
    'maria ioana elena ana andreea alexandra gabriela mihaela daniela nicoleta cristina camelia carmen ' +
    'florentina georgiana larisa laura monica oana raluca roxana simona teodora diana denisa bianca ' +
    'loredana lavinia mirela claudia corina catalina doina dorina eugenia felicia florica geta ileana ' +
    'iuliana lacramioara liliana livia luminita magdalena manuela marcela mariana marilena marinela ' +
    'madalina melania narcisa natalia otilia paula petronela rodica sanda silvia sofia stela steluta ' +
    'tatiana valentina valeria veronica victoria violeta viorica zoe aurelia anca adela adriana alina ' +
    'amalia angela antonia beatrice crina daria delia emilia estera eva gina irina isabela izabela ' +
    'lidia lia lucia margareta miruna nadia olga ramona sabina smaranda sorina tamara vasilica ' +
    'ecaterina paraschiva profira zamfira ruxandra anisoara lenuta mioara saveta safta catinca ' +
    'aurica elisabeta eleonora'
  ).split(/\s+/),
);

function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ș|ş/g, 's')
    .replace(/ț|ţ/g, 't')
    .toLowerCase();
}

/**
 * Extract the first name(s) (prenume) from a donor's full name for the pomelnic.
 * Drops „Familia/Fam./Pr." prefixes, splits „X și Y" / „X & Y" / „X - Y" into
 * separate people, then for each person picks the token that is a known Romanian
 * first name (works for both „Nume Prenume" and „Prenume Nume"); if none match,
 * falls back to the last word. Hyphenated names like „Andreea-Elena" stay whole.
 */
function firstNamesOf(full: string): string[] {
  const cleaned = full
    .trim()
    .replace(/^(familia|fam\.?|pr\.?|preot|p[ăa]rinte|dl\.?|d-l|dna\.?|d-na)\s+/i, '');
  return cleaned
    .split(/\s+(?:și|si)\s+|\s*[&/,+]\s*|\s+-\s+/i)
    .map((person) => {
      const words = person.trim().split(/\s+/).filter(Boolean);
      for (const w of words) {
        const whole = fold(w.replace(/[.,;:]+$/, ''));
        const head = whole.split('-')[0];
        if (FIRST_NAMES.has(whole) || FIRST_NAMES.has(head)) {
          return w.replace(/[.,;:]+$/, '').trim();
        }
      }
      return (words[words.length - 1] || '').replace(/[.,;:]+$/, '').trim();
    })
    .filter((n) => n.length > 1);
}

export default async function DonationsAdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const provided = searchParams.key;

  // FAIL-CLOSED: donor PII (names, emails, phones) is never rendered unless
  // a valid ADMIN_KEY is configured and matched.
  if (!isAdminAuthorized(provided)) {
    return <AdminGate />;
  }

  const [donations, donors, aggByStatus] = await Promise.all([
    prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      include: { donor: true },
      take: 500,
    }),
    prisma.donor.findMany({
      where: { email: { not: null } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isPublic: true,
        createdAt: true,
      },
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

  // Donations in the current calendar month.
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const paidThisMonth = donations.filter(
    (d) =>
      (d.status === 'completed' || d.status === 'self_reported_bank') &&
      d.createdAt >= monthStart,
  );
  const monthSum = paidThisMonth.reduce((s, d) => s + d.amount, 0);
  const monthCount = paidThisMonth.length;
  const monthLabel = now.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });

  // Acatist „pentru vii" — ONLY first names (prenume), deduped & sorted. Built
  // for three periods so the priest can read the right one each week/month.
  const paidWithName = donations.filter(
    (d) =>
      (d.status === 'completed' || d.status === 'self_reported_bank') && d.donor?.name,
  );
  const namesFrom = (list: typeof paidWithName) =>
    Array.from(new Set(list.flatMap((d) => firstNamesOf(d.donor!.name!)))).sort((a, b) =>
      a.localeCompare(b, 'ro'),
    );
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const acatistKey = provided ? `&key=${encodeURIComponent(provided)}` : '';
  const pomelnicNames = namesFrom(paidWithName);
  const namesMonth = namesFrom(paidWithName.filter((d) => d.createdAt >= monthStart));
  const namesWeek = namesFrom(paidWithName.filter((d) => d.createdAt >= weekStart));
  const fmtDay = (d: Date) => d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
  const weekLabel = `Săptămâna aceasta · ${fmtDay(weekStart)} – ${fmtDay(now)}`;
  const monthPeriodLabel = `Luna aceasta · ${monthLabel}`;

  // Ad attribution: donations whose source looks like a paid/social channel.
  const AD_RE = /facebook|instagram|meta|google|tiktok|youtube|ads|cpc|paid|fbclid/i;
  const paidDonations = donations.filter(
    (d) => d.status === 'completed' || d.status === 'self_reported_bank',
  );
  const fromAds = paidDonations.filter((d) => d.source && AD_RE.test(d.source));
  const adsSum = fromAds.reduce((s, d) => s + d.amount, 0);
  const adsCount = fromAds.length;
  // Breakdown by source (within the loaded donations).
  const bySourceMap: Record<string, { sum: number; count: number }> = {};
  for (const d of paidDonations) {
    const key = d.source || 'direct / necunoscut';
    (bySourceMap[key] ||= { sum: 0, count: 0 });
    bySourceMap[key].sum += d.amount;
    bySourceMap[key].count += 1;
  }
  const bySource = Object.entries(bySourceMap).sort((a, b) => b[1].sum - a[1].sum);

  const allEmails = donors.map((d) => d.email!).filter(Boolean).join(', ');

  const csv = [
    'nume,email,telefon,public,creat_la',
    ...donors.map((d) =>
      [
        (d.name ?? '').replace(/,/g, ' '),
        d.email ?? '',
        (d.phone ?? '').replace(/,/g, ' '),
        d.isPublic ? 'da' : 'nu',
        d.createdAt.toISOString(),
      ].join(','),
    ),
  ].join('\n');

  return (
    <div className="container py-10 max-w-6xl">
      <div className="mb-6">
        <p className="font-ceremonial uppercase text-[11px] tracking-[0.28em] text-gold-dark flex items-center gap-2">
          <span className="text-burgundy">☩</span> Administrare parohie
        </p>
        <h1 className="font-display text-3xl text-burgundy mt-1">Donații & ctitori</h1>
        <p className="text-xs text-ink-soft mt-1">
          Toți cei care au inițiat o donație (reușită, în transfer sau abandonată)
          sunt salvați aici.
        </p>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-gold/50 via-gold/20 to-transparent" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <Stat
          label={`Luna aceasta · ${monthLabel}`}
          value={`${monthSum.toLocaleString('ro-RO')} RON`}
          sub={`${monthCount} donații`}
          accent
        />
        <Stat
          label="Din reclame"
          value={`${adsSum.toLocaleString('ro-RO')} RON`}
          sub={`${adsCount} donații`}
          accent
        />
        <Stat
          label="Total strâns"
          value={`${totalRaised.toLocaleString('ro-RO')} RON`}
          sub={`${totalCompleted} donații reușite`}
        />
        <Stat label="Emailuri colectate" value={String(donors.length)} />
        <Stat label="Prenume în acatist" value={String(pomelnicNames.length)} />
      </div>

      {/* Acatist (pentru vii) — weekly / monthly / all */}
      <section className="mb-8 rounded-2xl border border-gold/45 bg-gradient-to-br from-[#fffdf8] to-[#f6ead1] p-5 sm:p-6">
        <h2 className="font-display text-xl text-burgundy">☩ Acatist (pentru vii)</h2>
        <p className="text-xs text-ink-soft mt-1 max-w-2xl">
          Doar numele mic (prenumele), fiecare o singură dată — pentru pomenire la Sfânta
          Liturghie. Se deschide gata de printat (sau „Salvează ca PDF"), cu logo și cruce.
          Alege perioada:
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <a
            href={`/api/admin/acatist?period=week${acatistKey}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-dark bg-gradient-to-br from-gold to-gold-dark text-burgundy-dark text-xs font-semibold hover:brightness-105 transition"
          >
            ☩ Săptămâna aceasta ({namesWeek.length})
          </a>
          <a
            href={`/api/admin/acatist?period=month${acatistKey}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-dark/60 bg-white text-burgundy text-xs font-semibold hover:bg-cream-card transition"
          >
            ☩ Luna aceasta ({namesMonth.length})
          </a>
          <a
            href={`/api/admin/acatist?period=all${acatistKey}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-dark/60 bg-white text-burgundy text-xs font-semibold hover:bg-cream-card transition"
          >
            Toți ({pomelnicNames.length})
          </a>
        </div>
      </section>

      {/* Source breakdown — where donors come from (ads vs direct) */}
      <section className="mb-10 rounded-2xl border border-border bg-white p-5 sm:p-6">
        <h2 className="font-display text-xl text-burgundy">De unde vin donatorii</h2>
        <p className="text-xs text-ink-soft mt-1 mb-4">
          Sursa e salvată la donație (din linkul de reclamă cu <code>?utm_source=</code> sau din
          clicul pe reclama Facebook). Donațiile mai vechi apar ca „direct / necunoscut".
        </p>
        {bySource.length === 0 ? (
          <p className="text-sm text-ink-muted">Încă nu sunt date de sursă.</p>
        ) : (
          <div className="space-y-2">
            {bySource.map(([src, v]) => {
              const maxSum = bySource[0][1].sum || 1;
              const pct = Math.round((v.sum / maxSum) * 100);
              const isAd = AD_RE.test(src);
              return (
                <div key={src} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 text-xs truncate flex items-center gap-1.5">
                    {isAd && <span className="text-gold-dark">☩</span>}
                    <span className={isAd ? 'text-burgundy font-medium' : 'text-ink-muted'}>
                      {src}
                    </span>
                  </span>
                  <span className="flex-1 h-2 rounded-full bg-cream-card overflow-hidden">
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        background: isAd
                          ? 'linear-gradient(90deg,#c9a361,#EAC784)'
                          : '#cbb89a',
                      }}
                    />
                  </span>
                  <span className="w-28 shrink-0 text-right text-xs text-ink">
                    <span className="font-display font-bold text-burgundy">
                      {v.sum.toLocaleString('ro-RO')}
                    </span>{' '}
                    RON · {v.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

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
                <th className="px-4 py-3 text-left">Telefon</th>
                <th className="px-4 py-3 text-right">Sumă</th>
                <th className="px-4 py-3 text-left">Metodă</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Sursă</th>
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
                // Per-donation flag wins; fall back to the donor default
                // for legacy rows that predate the column.
                const isPublic =
                  d.isPublic === false ? false : d.donor?.isPublic !== false;
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
                    <td className="px-4 py-3 text-xs text-ink-muted font-mono whitespace-nowrap">
                      {d.donor?.phone || '—'}
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
                      {d.source ? (
                        <span
                          className={
                            AD_RE.test(d.source)
                              ? 'text-burgundy font-medium'
                              : 'text-ink-muted'
                          }
                        >
                          {d.source}
                        </span>
                      ) : (
                        <span className="text-ink-soft">—</span>
                      )}
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
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl px-4 py-4 shadow-[0_8px_22px_-16px_rgba(101,26,20,0.45)] ${
        accent
          ? 'border border-gold/50 bg-gradient-to-br from-[#fffaf0] to-[#f3e4c6]'
          : 'border border-border bg-white'
      }`}
    >
      <p className="text-[10px] uppercase tracking-wider text-ink-soft font-ceremonial truncate">
        {label}
      </p>
      <p className="font-display text-2xl font-bold mt-1 text-burgundy">{value}</p>
      {sub && <p className="text-[11px] text-ink-soft mt-0.5">{sub}</p>}
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
