import Link from 'next/link';
import { BellRing, CalendarDays, ArrowRight } from 'lucide-react';
import { cld } from '@/lib/img';
import { stripEmoji, formatDateRo } from '@/lib/utils';

interface AnuntPost {
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: Date | null;
  featured?: { url: string } | null;
}

/**
 * „Anunțuri" board — the latest parish announcements (imported Facebook posts),
 * shown prominently and visually distinct from the blog so people read them as
 * notices (slujbe, privegheri, evenimente).
 */
export function Anunturi({ posts }: { posts: AnuntPost[] }) {
  const items = posts.slice(0, 3);
  if (items.length === 0) return null;

  return (
    <section className="container py-10 sm:py-12">
      <div className="rounded-3xl border border-gold/50 bg-gradient-to-br from-[#fff8ec] to-[#f6e9cf] p-5 sm:p-7 shadow-[0_18px_50px_-28px_rgba(101,26,20,0.45)]">
        <div className="flex items-center gap-2 mb-5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-burgundy text-cream">
            <BellRing className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-xl sm:text-2xl text-burgundy leading-none">
              Anunțuri
            </p>
            <p className="text-xs text-ink-soft mt-1">Slujbe, evenimente și vești — direct de la parohie</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {items.map((p) => {
            const title = stripEmoji(p.title);
            const excerpt = stripEmoji(p.excerpt || '').slice(0, 130);
            const img = p.featured?.url ? cld(p.featured.url, 600) : '';
            return (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col rounded-2xl border border-gold/40 bg-white overflow-hidden hover:border-burgundy hover:shadow-lg transition-all"
              >
                {img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img}
                    alt={title}
                    className="h-28 w-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <span className="inline-flex items-center gap-1 self-start rounded-full bg-burgundy/10 text-burgundy text-[11px] font-semibold px-2 py-0.5">
                    <CalendarDays className="h-3 w-3" />
                    {p.publishedAt ? formatDateRo(p.publishedAt) : 'Anunț'}
                  </span>
                  <h3 className="font-display text-burgundy mt-2 leading-snug line-clamp-3 group-hover:translate-x-0.5 transition-transform">
                    {title}
                  </h3>
                  {excerpt && (
                    <p className="text-xs text-ink-soft mt-1.5 line-clamp-2">{excerpt}…</p>
                  )}
                  <span className="mt-auto pt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold-dark group-hover:text-burgundy">
                    Vezi detalii <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-5 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-burgundy hover:text-burgundy-dark"
          >
            Toate anunțurile și veștile <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
