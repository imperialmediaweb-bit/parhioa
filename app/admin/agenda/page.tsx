import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { AdminGate } from '../admin-gate';
import { romaniaToday, romaniaWallToUtc } from '@/lib/agenda';
import { AgendaComposer } from './composer';
import { ItemActions } from './item-actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Agenda părintelui' };

function fmtDay(d: Date): string {
  return new Intl.DateTimeFormat('ro-RO', {
    timeZone: 'Europe/Bucharest',
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }).format(d);
}
function fmtTime(d: Date): string {
  return new Intl.DateTimeFormat('ro-RO', {
    timeZone: 'Europe/Bucharest',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  const provided = searchParams.key;
  if (!isAdminAuthorized(provided)) {
    return <AdminGate />;
  }
  const keyParam = provided ? `?key=${encodeURIComponent(provided)}` : '';

  const t = romaniaToday();
  const todayCutoff = romaniaWallToUtc(t.y, t.m1, t.d, 0, 0);

  const items = await prisma.agendaItem
    .findMany({ orderBy: { startAt: 'asc' }, take: 300 })
    .catch(() => [] as any[]);

  const upcoming = items.filter((i: any) => i.startAt >= todayCutoff);
  const past = items.filter((i: any) => i.startAt < todayCutoff).reverse();

  const Row = ({ i }: { i: any }) => (
    <li
      className={`flex items-start gap-3 px-4 py-3 ${i.done ? 'opacity-55' : ''}`}
    >
      <div className="mt-0.5 shrink-0 text-center w-14">
        <div className="text-[11px] uppercase tracking-wide text-gold-dark leading-tight">
          {fmtDay(i.startAt).split(',')[0]}
        </div>
        <div className="font-display text-burgundy text-sm leading-tight">
          {fmtDay(i.startAt).split(', ')[1]}
        </div>
        {!i.allDay && (
          <div className="text-[11px] text-ink-soft mt-0.5">{fmtTime(i.startAt)}</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-navy ${i.done ? 'line-through' : ''}`}>{i.title}</p>
        {i.location && (
          <p className="text-xs text-ink-soft flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3" /> {i.location}
          </p>
        )}
        {i.notes && <p className="text-xs text-ink-muted mt-0.5">{i.notes}</p>}
      </div>
      <ItemActions id={i.id} done={i.done} adminKey={provided} />
    </li>
  );

  return (
    <div className="container py-8 max-w-2xl">
      <Link
        href={`/admin${keyParam}`}
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-burgundy mb-5"
      >
        <ArrowLeft className="h-4 w-4" /> Panou
      </Link>

      <div className="flex items-center gap-2 mb-5">
        <CalendarDays className="h-6 w-6 text-burgundy" />
        <h1 className="font-display text-2xl sm:text-3xl text-burgundy">
          Agenda părintelui
        </h1>
      </div>

      <AgendaComposer adminKey={provided ?? ''} />

      <h2 className="font-display text-lg text-burgundy mt-8 mb-2">Ce urmează</h2>
      <div className="rounded-2xl border border-border bg-white overflow-hidden">
        {upcoming.length === 0 ? (
          <p className="p-5 text-sm text-ink-soft">Nimic programat momentan.</p>
        ) : (
          <ul className="divide-y divide-border">
            {upcoming.map((i: any) => (
              <Row key={i.id} i={i} />
            ))}
          </ul>
        )}
      </div>

      {past.length > 0 && (
        <>
          <h2 className="font-display text-lg text-burgundy mt-8 mb-2">Trecute</h2>
          <div className="rounded-2xl border border-border bg-white overflow-hidden">
            <ul className="divide-y divide-border">
              {past.slice(0, 40).map((i: any) => (
                <Row key={i.id} i={i} />
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
