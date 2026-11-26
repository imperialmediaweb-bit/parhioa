import Link from 'next/link';
import { CalendarDays, Clock, MapPin, ArrowRight } from 'lucide-react';

interface EventItem {
  id: number;
  title: string;
  startAt: Date;
  allDay: boolean;
  location: string | null;
  postSlug: string | null;
}

const TZ = 'Europe/Bucharest';

function dayNum(d: Date): string {
  return new Intl.DateTimeFormat('ro-RO', { timeZone: TZ, day: '2-digit' }).format(d);
}
function monthShort(d: Date): string {
  return new Intl.DateTimeFormat('ro-RO', { timeZone: TZ, month: 'short' })
    .format(d)
    .replace('.', '');
}
function weekday(d: Date): string {
  return new Intl.DateTimeFormat('ro-RO', { timeZone: TZ, weekday: 'long' }).format(d);
}
function time(d: Date): string {
  return new Intl.DateTimeFormat('ro-RO', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(d);
}

/**
 * „Slujbe & evenimente" — upcoming services (priveghere, maslu, acatist…)
 * extracted from the parish announcements. Distinct from construction news.
 */
export function Evenimente({ events }: { events: EventItem[] }) {
  if (!events || events.length === 0) return null;
  const items = events.slice(0, 4);

  return (
    <section className="container pb-4 sm:pb-6">
      <div className="rounded-3xl border border-gold/50 bg-gradient-to-br from-[#fdfaf2] to-[#f5e9cd] p-5 sm:p-7">
        <div className="flex items-center gap-2 mb-5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-burgundy text-cream">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-xl sm:text-2xl text-burgundy leading-none">
              Slujbe & evenimente
            </p>
            <p className="text-xs text-ink-soft mt-1">Ce urmează la parohie — privegheri, Sfântul Maslu, acatiste</p>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((e) => {
            const inner = (
              <div className="flex items-stretch gap-4 rounded-2xl border border-gold/40 bg-white p-4 h-full hover:border-burgundy hover:shadow-md transition-all">
                <div className="shrink-0 w-16 rounded-xl bg-burgundy text-cream flex flex-col items-center justify-center py-2">
                  <span className="text-2xl font-display leading-none">{dayNum(e.startAt)}</span>
                  <span className="text-[11px] uppercase tracking-wide mt-0.5">{monthShort(e.startAt)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-burgundy leading-snug line-clamp-2">{e.title}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
                    <span className="inline-flex items-center gap-1 capitalize">
                      <CalendarDays className="h-3 w-3" /> {weekday(e.startAt)}
                    </span>
                    {!e.allDay && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {time(e.startAt)}
                      </span>
                    )}
                    {e.location && (
                      <span className="inline-flex items-center gap-1 min-w-0">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{e.location}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
            return (
              <li key={e.id}>
                {e.postSlug ? (
                  <Link href={`/blog/${e.postSlug}`} className="group block h-full">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
