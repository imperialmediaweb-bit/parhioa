import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { CAMPAIGNS } from '@/lib/campaigns';
import { PLACEHOLDER_POSTS } from '@/lib/placeholder-posts';
import { absoluteUrl } from '@/lib/site';

export const revalidate = 3600; // refresh hourly

/**
 * Static, hand-maintained public routes. Admin (/admin/**), API (/api/**),
 * and the post-payment thank-you page are intentionally excluded — they
 * either require auth or shouldn't be indexed.
 */
const STATIC_ROUTES: Array<{ path: string; priority: number; changeFreq: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
  { path: '/', priority: 1.0, changeFreq: 'daily' },
  { path: '/despre', priority: 0.7, changeFreq: 'monthly' },
  { path: '/misiune', priority: 0.6, changeFreq: 'monthly' },
  { path: '/cronologie', priority: 0.5, changeFreq: 'monthly' },
  { path: '/evenimente', priority: 0.7, changeFreq: 'weekly' },
  { path: '/blog', priority: 0.8, changeFreq: 'daily' },
  { path: '/campanii', priority: 0.8, changeFreq: 'weekly' },
  { path: '/doneaza', priority: 0.9, changeFreq: 'monthly' },
  { path: '/contact', priority: 0.6, changeFreq: 'yearly' },
  { path: '/redirectioneaza-3-5', priority: 0.5, changeFreq: 'yearly' },
  { path: '/termeni-si-conditii', priority: 0.2, changeFreq: 'yearly' },
  { path: '/politica-de-confidentialitate', priority: 0.2, changeFreq: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: now,
    changeFrequency: r.changeFreq,
    priority: r.priority,
  }));

  // Campaign detail pages.
  const campaignEntries: MetadataRoute.Sitemap = CAMPAIGNS.map((c) => ({
    url: absoluteUrl(`/donations/${c.slug}`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Published blog posts from the DB. If the DB is unreachable at build/ISR
  // time, fall back to the placeholder set so the sitemap is never empty.
  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'publish' },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' },
      take: 2000,
    });
    postEntries = posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: p.updatedAt || p.publishedAt || now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch {
    postEntries = PLACEHOLDER_POSTS.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: p.publishedAt ?? now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  }

  return [...staticEntries, ...campaignEntries, ...postEntries];
}
