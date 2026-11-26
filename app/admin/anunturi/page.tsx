import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, BellRing } from 'lucide-react';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { isPushConfigured } from '@/lib/push';
import { AdminGate } from '../admin-gate';
import { AnnounceComposer } from './composer';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Anunțuri' };

export default async function AnunturiPage({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  const provided = searchParams.key;
  if (!isAdminAuthorized(provided)) {
    return <AdminGate />;
  }
  const keyParam = provided ? `?key=${encodeURIComponent(provided)}` : '';

  const count = await prisma.pushSubscription.count().catch(() => 0);
  const configured = isPushConfigured();

  return (
    <div className="container py-8 max-w-2xl">
      <Link
        href={`/admin${keyParam}`}
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-burgundy mb-5"
      >
        <ArrowLeft className="h-4 w-4" /> Panou
      </Link>

      <div className="flex items-center gap-2 mb-5">
        <BellRing className="h-6 w-6 text-burgundy" />
        <h1 className="font-display text-2xl sm:text-3xl text-burgundy">
          Anunțuri către telefoane
        </h1>
      </div>

      {!configured ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          Notificările nu sunt încă active (lipsesc cheile VAPID pe server).
        </div>
      ) : (
        <AnnounceComposer adminKey={provided ?? ''} subscriberCount={count} />
      )}

      <div className="mt-6 rounded-2xl border border-border bg-cream-card p-4 text-xs text-ink-soft leading-relaxed">
        <p className="font-medium text-burgundy mb-1">Cum ajung anunțurile la oameni</p>
        Oamenii deschid site-ul pe telefon, apasă „Instalează + anunțuri” și acceptă
        notificările. De atunci, primesc pe telefon ce trimiți de aici. Pe iPhone
        trebuie întâi instalată aplicația pe ecranul principal.
      </div>
    </div>
  );
}
