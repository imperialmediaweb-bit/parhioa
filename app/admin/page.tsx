import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Heart, FileText, Image as ImageIcon, Users, Mail, ExternalLink } from 'lucide-react';
import { MigrateImagesButton } from './migrate-images-button';
import { ImportFeedButton } from './import-feed-button';
import { RefetchImagesButton } from './refetch-images-button';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { AdminGate } from './admin-gate';
import { LogoutButton } from './logout-button';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Parohia Sf. Teodora' };

interface SearchParams {
  key?: string;
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const provided = searchParams.key;

  if (!isAdminAuthorized(provided)) {
    return <AdminGate />;
  }

  const keyParam = provided ? `?key=${encodeURIComponent(provided)}` : '';

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const paidWhere = { status: { in: ['completed', 'self_reported_bank'] } };

  const [donationAgg, monthAgg, donorCount, postCount, mediaCount, recent] =
    await Promise.all([
      prisma.donation.aggregate({
        where: paidWhere,
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.donation.aggregate({
        where: { ...paidWhere, createdAt: { gte: monthStart } },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.donor.count(),
      prisma.post.count(),
      prisma.media.count(),
      prisma.donation.findMany({
        where: paidWhere,
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: { donor: true },
      }),
    ]).catch(() => [
      { _sum: { amount: 0 }, _count: { _all: 0 } } as any,
      { _sum: { amount: 0 }, _count: { _all: 0 } } as any,
      0,
      0,
      0,
      [] as any[],
    ]);

  const totalRaised = donationAgg._sum?.amount || 0;
  const totalDonations = donationAgg._count?._all || 0;
  const monthRaised = monthAgg._sum?.amount || 0;
  const monthDonations = monthAgg._count?._all || 0;

  const kpis = [
    { label: 'Total strâns', value: `${totalRaised.toLocaleString('ro-RO')} RON`, sub: `${totalDonations} donații` },
    { label: 'Luna aceasta', value: `${monthRaised.toLocaleString('ro-RO')} RON`, sub: `${monthDonations} donații` },
    { label: 'Ctitori', value: donorCount.toLocaleString('ro-RO'), sub: 'donatori' },
    { label: 'Articole', value: postCount.toLocaleString('ro-RO'), sub: `${mediaCount} imagini` },
  ];

  const cards = [
    {
      title: 'Donații & ctitori',
      desc: 'Vezi cine a donat, sume, emailuri pentru campanii viitoare',
      href: `/admin/donatii${keyParam}`,
      icon: Heart,
      stat: `${totalRaised.toLocaleString('ro-RO')} RON · ${totalDonations} donații · ${donorCount} ctitori`,
      accent: 'burgundy',
    },
    {
      title: 'Blog · articole',
      desc: 'Adaugă, modifică sau șterge articole de pe blog',
      href: `/admin/blog${keyParam}`,
      icon: FileText,
      stat: `${postCount} articole`,
      accent: 'gold',
    },
    {
      title: 'Imagini (Media)',
      desc: 'Galeria de imagini din baza de date',
      href: `/admin/media`,
      icon: ImageIcon,
      stat: `${mediaCount} imagini`,
      accent: 'gold',
    },
  ];

  return (
    <div className="container py-10 max-w-5xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-burgundy">
            Panou administrare
          </h1>
          <p className="text-ink-muted text-sm mt-1">
            Parohia Sf. Cuv. Teodora de la Sihla — Botoșani
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-gold/40 bg-gradient-to-br from-white to-cream-card p-4"
          >
            <p className="text-[11px] uppercase tracking-wider text-gold-dark font-medium">
              {k.label}
            </p>
            <p className="font-display text-2xl text-burgundy mt-1 leading-tight">
              {k.value}
            </p>
            <p className="text-[11px] text-ink-soft mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {cards.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="group rounded-2xl border border-border bg-white p-6 hover:border-burgundy hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  c.accent === 'burgundy'
                    ? 'bg-burgundy/10 text-burgundy'
                    : 'bg-gold/20 text-gold-dark'
                }`}
              >
                <c.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-lg text-burgundy group-hover:translate-x-0.5 transition-transform">
                  {c.title}
                </h2>
                <p className="text-xs text-ink-soft mt-0.5">{c.desc}</p>
              </div>
            </div>
            <p className="text-xs text-ink-muted font-mono mt-3 border-t border-border pt-3">
              {c.stat}
            </p>
          </Link>
        ))}
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl text-burgundy">Ultimele donații</h2>
          <Link
            href={`/admin/donatii${keyParam}`}
            className="text-xs text-gold-dark hover:text-burgundy font-medium"
          >
            Vezi toate →
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-white overflow-hidden">
          {recent.length === 0 ? (
            <p className="p-5 text-sm text-ink-soft">Încă nicio donație.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((d: any) => (
                <li key={d.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="text-navy truncate">
                      {d.donor?.name?.trim() || 'Donator anonim'}
                    </p>
                    <p className="text-[11px] text-ink-soft">
                      {new Date(d.createdAt).toLocaleDateString('ro-RO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      {d.status === 'self_reported_bank' ? ' · transfer bancar' : ''}
                    </p>
                  </div>
                  <span className="font-display text-burgundy whitespace-nowrap">
                    {(d.amount || 0).toLocaleString('ro-RO')} RON
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <h2 className="font-display text-xl text-burgundy mb-3">Mentenanță & automatizare</h2>
      <div className="mb-10 space-y-4">
        <ImportFeedButton adminKey={provided} />
        <RefetchImagesButton adminKey={provided} />
        <MigrateImagesButton adminKey={provided} />
      </div>

      <h2 className="font-display text-xl text-burgundy mb-3">Linkuri utile</h2>
      <div className="rounded-2xl border border-border bg-white p-5 space-y-2 text-sm">
        <LinkRow href="/" label="Site public — pagina principală" />
        <LinkRow
          href="/donations/strangere-de-fonduri-pentru-construirea-bisericii"
          label="Pagina campaniei de donații"
        />
        <LinkRow href="/contact" label="Pagina de contact" />
        <LinkRow
          href="https://dashboard.stripe.com"
          label="Stripe Dashboard (procesator plăți)"
          external
        />
        <LinkRow
          href="https://resend.com/emails"
          label="Resend Dashboard (emailuri trimise)"
          external
        />
        <LinkRow
          href="https://railway.app"
          label="Railway (hosting)"
          external
        />
      </div>
    </div>
  );
}

function LinkRow({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex items-center justify-between py-1.5 hover:text-burgundy transition-colors"
    >
      <span>{label}</span>
      <ExternalLink className="h-3.5 w-3.5 text-ink-soft" />
    </a>
  );
}
