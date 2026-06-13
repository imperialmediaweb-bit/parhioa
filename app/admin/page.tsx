import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Heart, FileText, Image as ImageIcon, Users, Mail, ExternalLink } from 'lucide-react';
import { MigrateImagesButton } from './migrate-images-button';
import { ImportFeedButton } from './import-feed-button';
import { RefetchImagesButton } from './refetch-images-button';

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
  const expected = process.env.ADMIN_KEY;
  const provided = searchParams.key;

  if (expected && provided !== expected) {
    return (
      <div className="container py-20 max-w-md mx-auto text-center">
        <h1 className="font-display text-2xl text-burgundy mb-3">Acces restricționat</h1>
        <p className="text-ink-muted text-sm">
          Accesează panoul prin linkul cu cheia primită.
        </p>
      </div>
    );
  }

  const keyParam = provided ? `?key=${encodeURIComponent(provided)}` : '';

  const [donationAgg, donorCount, postCount, mediaCount] = await Promise.all([
    prisma.donation.aggregate({
      where: { status: { in: ['completed', 'self_reported_bank'] } },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.donor.count(),
    prisma.post.count(),
    prisma.media.count(),
  ]).catch(() => [
    { _sum: { amount: 0 }, _count: { _all: 0 } } as any,
    0,
    0,
    0,
  ]);

  const totalRaised = donationAgg._sum?.amount || 0;
  const totalDonations = donationAgg._count?._all || 0;

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
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl text-burgundy">
          Panou administrare
        </h1>
        <p className="text-ink-muted text-sm mt-1">
          Parohia Sf. Cuv. Teodora de la Sihla — Botoșani
        </p>
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
