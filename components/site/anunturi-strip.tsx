import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Calendar, ArrowRight } from 'lucide-react';

interface Props {
  limit?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  evenimente: 'Eveniment',
  vesti: 'Vești',
  lucrari: 'Lucrări',
  slujbe: 'Slujbă',
  'vesti-din-parohie': 'Vești',
};

const CATEGORY_STYLES: Record<string, string> = {
  evenimente: 'bg-gold/20 text-gold-dark border-gold/30',
  vesti: 'bg-burgundy/10 text-burgundy border-burgundy/20',
  lucrari: 'bg-navy/10 text-navy border-navy/20',
  slujbe: 'bg-cream-deep text-burgundy-dark border-gold/20',
  'vesti-din-parohie': 'bg-burgundy/10 text-burgundy border-burgundy/20',
};

function categoryLabel(slug: string): { label: string; cls: string } {
  return {
    label: CATEGORY_LABELS[slug] || 'Anunț',
    cls: CATEGORY_STYLES[slug] || 'bg-burgundy/10 text-burgundy border-burgundy/20',
  };
}

function timeAgo(date: Date | null): string {
  if (!date) return '';
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (days < 1) return 'azi';
  if (days < 2) return 'ieri';
  if (days < 7) return `acum ${days} zile`;
  if (days < 30) return `acum ${Math.floor(days / 7)} săpt.`;
  return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
}

export async function AnunturiStrip({ limit = 4 }: Props) {
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: {
        status: 'publish',
        // Only items from the Facebook import (have a sourceGuid)
        sourceGuid: { not: null },
      },
      orderBy: { publishedAt: 'desc' },
      include: { featured: true, categories: true },
      take: limit,
    });
  } catch (err) {
    console.error('[AnunturiStrip] DB read failed:', err);
    return null;
  }

  if (posts.length === 0) return null;

  return (
    <section className="container py-10 sm:py-14">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-6 sm:mb-8 gap-3 flex-wrap">
          <div>
            <p className="font-ceremonial uppercase text-[11px] tracking-[0.28em] text-burgundy mb-1 flex items-center gap-2">
              <span className="text-gold">☩</span>
              Din viața parohiei
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-navy">
              Anunțuri & evenimente
            </h2>
            <p className="text-sm text-ink-soft mt-1">
              Unde va participa părintele, evenimente, anunțuri importante
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm text-burgundy hover:text-burgundy-dark font-medium inline-flex items-center gap-1"
          >
            Toate articolele <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-4 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {posts.map((post) => {
            const category = post.categories?.[0];
            const cat = category ? categoryLabel(category.slug) : null;
            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group snap-start shrink-0 w-[82%] sm:w-auto rounded-2xl overflow-hidden bg-white border border-border hover:border-burgundy/40 hover:shadow-xl transition-all flex flex-col"
              >
                {post.featured?.url ? (
                  <div className="aspect-video w-full overflow-hidden bg-cream-card">
                    <img
                      src={post.featured.url}
                      alt={post.featured.alt || post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-gradient-to-br from-cream-card via-cream-deep to-cream-card flex items-center justify-center">
                    <span className="text-4xl text-burgundy/30">☩</span>
                  </div>
                )}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {cat && (
                      <span
                        className={`text-[10px] uppercase tracking-wider font-ceremonial px-2 py-0.5 rounded-full border ${cat.cls}`}
                      >
                        {cat.label}
                      </span>
                    )}
                    {post.publishedAt && (
                      <span className="text-[11px] text-ink-soft flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {timeAgo(post.publishedAt)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-[15px] sm:text-base font-semibold text-navy leading-snug line-clamp-3 group-hover:text-burgundy transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="text-[11px] text-burgundy font-medium mt-auto pt-1 inline-flex items-center gap-1">
                    Citește
                    <ArrowRight className="h-3 w-3" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
