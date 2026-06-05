import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateRo } from '@/lib/utils';
import { PostImage } from './post-image';

interface PostCardProps {
  slug: string;
  title: string;
  excerpt?: string | null;
  publishedAt?: Date | string | null;
  featuredUrl?: string | null;
  featuredAlt?: string | null;
  categories?: { slug: string; name: string }[];
  href?: string;
}

export function PostCard({
  slug,
  title,
  excerpt,
  publishedAt,
  featuredUrl,
  featuredAlt,
  categories,
  href,
}: PostCardProps) {
  const url = href || `/blog/${slug}`;
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={url} className="block overflow-hidden">
        <PostImage
          src={
            featuredUrl ||
            'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1780574528/sf_theodora_de_la_sihla_ri9rz2.png'
          }
          alt={featuredAlt || title}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <CardContent className="p-6 pt-6 flex flex-col gap-3">
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 2).map((c) => (
              <Badge key={c.slug} variant="secondary" className="font-serif italic">
                {c.name}
              </Badge>
            ))}
          </div>
        )}
        <Link href={url}>
          <h3 className="font-display text-xl font-semibold text-navy leading-snug transition-colors group-hover:text-coral">
            {title}
          </h3>
        </Link>
        {publishedAt && (
          <p className="text-xs uppercase tracking-wider text-ink-soft">
            {formatDateRo(publishedAt)}
          </p>
        )}
        {excerpt && <p className="text-sm text-ink-muted line-clamp-3">{excerpt}</p>}
        <Link
          href={url}
          className="mt-auto pt-2 text-sm font-medium text-coral hover:text-coral-dark inline-flex items-center gap-1"
        >
          Citește mai mult →
        </Link>
      </CardContent>
    </Card>
  );
}
