import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Megaphone } from 'lucide-react';

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
    return null;
  }
  if (posts.length === 0) return null;

  // Duplicate the list so the CSS marquee loops seamlessly.
  const items = [...posts, ...posts];

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
              '--duration': '50s',
              '--gap': '2.5rem',
            } as React.CSSProperties
          }
        >
          {items.map((p, i) => {
            const cat = p.categories?.[0]?.slug;
            const catLabel = cat ? CATEGORY_LABEL[cat] : null;
            return (
              <Link
                key={`${p.id}-${i}`}
                href={`/blog/${p.slug}`}
                className="flex items-center gap-2.5 text-sm hover:text-gold transition-colors"
              >
                <span className="text-gold text-base leading-none">☩</span>
                {catLabel && (
                  <span className="font-ceremonial uppercase text-[10px] tracking-[0.18em] text-gold/90 border border-gold/40 px-1.5 py-0.5 rounded-full">
                    {catLabel}
                  </span>
                )}
                {p.publishedAt && (
                  <span className="text-gold/75 text-xs font-medium">
                    {formatDate(p.publishedAt)}
                  </span>
                )}
                <span className="font-serif text-cream">{p.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
