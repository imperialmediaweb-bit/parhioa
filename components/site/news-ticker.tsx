import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Megaphone } from 'lucide-react';
import { anuntPostActiv } from '@/lib/anunt-post';

const CATEGORY_LABEL: Record<string, string> = {
  evenimente: 'Eveniment',
  lucrari: 'Lucrări',
  slujbe: 'Slujbă',
  'vesti-din-parohie': 'Vești',
};

function formatDate(d: Date | null): string {
  if (!d) return '';
  return d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
}

/**
 * News ticker — thin horizontal strip under the header showing the latest
 * Facebook-imported announcements as a marquee. Animation is CSS-only.
 */
export async function NewsTicker() {
  let posts: any[] = [];
  try {
    // Only show recent posts on the ticker — anything older than 14 days
    // has already happened and shouldn't keep scrolling.
    const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    posts = await prisma.post.findMany({
      where: {
        status: 'publish',
        sourceGuid: { not: null },
        publishedAt: { gte: cutoff },
      },
      orderBy: { publishedAt: 'desc' },
      include: { categories: true },
      take: 8,
    });
  } catch {
    posts = [];
  }

  // Build a unified list: a fasting-period announcement (if active) pinned
  // first, then the recent Facebook posts. The ticker shows even with zero
  // posts as long as the announcement is active.
  const anunt = anuntPostActiv();
  if (posts.length === 0 && !anunt) return null;

  type TickerItem = {
    key: string;
    accent?: boolean;
    label?: string | null;
    date?: string | null;
    text: string;
    href?: string;
  };

  const base: TickerItem[] = [];
  if (anunt) {
    base.push({
      key: 'anunt-post',
      accent: true,
      label: anunt.eyebrow,
      text: `${anunt.title}: ${anunt.lines.join(' · ')} — ${anunt.location}`,
    });
  }
  for (const p of posts) {
    const cat = p.categories?.[0]?.slug;
    base.push({
      key: `post-${p.id}`,
      label: cat ? CATEGORY_LABEL[cat] : null,
      date: formatDate(p.publishedAt),
      text: p.title,
      href: `/blog/${p.slug}`,
    });
  }

  // Duplicate the list so the CSS marquee loops seamlessly.
  const items = [...base, ...base];

  return (
    <div className="relative bg-gradient-to-r from-burgundy-dark via-burgundy to-burgundy-dark border-y border-gold/40 text-cream overflow-hidden">
      <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-32 bg-gradient-to-r from-burgundy-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-32 bg-gradient-to-l from-burgundy-dark to-transparent z-10 pointer-events-none" />

      <div className="relative flex items-center">
        {/* Pinned label on the left */}
        <div className="hidden sm:flex absolute left-0 top-0 bottom-0 z-20 items-center gap-2 px-5 bg-gold text-burgundy-dark font-ceremonial uppercase text-[11px] tracking-[0.22em] font-bold shadow-md">
          <Megaphone className="h-3.5 w-3.5" />
          Anunțuri
        </div>

        {/* Marquee track */}
        <div
          className="flex items-center gap-10 py-2.5 whitespace-nowrap animate-marquee hover:[animation-play-state:paused] will-change-transform sm:pl-44 pl-4"
          style={
            {
              '--duration': '90s',
              '--gap': '2.5rem',
            } as React.CSSProperties
          }
        >
          {items.map((it, i) => {
            const inner = (
              <>
                <span className="text-gold text-base leading-none">☩</span>
                {it.label && (
                  <span
                    className={
                      it.accent
                        ? 'font-ceremonial uppercase text-[10px] tracking-[0.18em] text-burgundy-dark bg-gold px-1.5 py-0.5 rounded-full font-bold'
                        : 'font-ceremonial uppercase text-[10px] tracking-[0.18em] text-gold/90 border border-gold/40 px-1.5 py-0.5 rounded-full'
                    }
                  >
                    {it.label}
                  </span>
                )}
                {it.date && (
                  <span className="text-gold/75 text-xs font-medium">{it.date}</span>
                )}
                <span className="font-serif text-cream">{it.text}</span>
              </>
            );
            return it.href ? (
              <Link
                key={`${it.key}-${i}`}
                href={it.href}
                className="flex items-center gap-2.5 text-sm hover:text-gold transition-colors"
              >
                {inner}
              </Link>
            ) : (
              <span
                key={`${it.key}-${i}`}
                className="flex items-center gap-2.5 text-sm"
              >
                {inner}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
