import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CAMPAIGNS } from '@/lib/campaigns';

export const dynamic = 'force-dynamic';

/** Fold diacritics + lowercase so „căsătorie" matches „casatorie". */
function fold(s: string): string {
  return (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ș|ş/gi, 's')
    .replace(/ț|ţ/gi, 't')
    .toLowerCase()
    .trim();
}

type Result = {
  type: 'Pagină' | 'Articol' | 'Campanie';
  title: string;
  url: string;
  excerpt?: string;
};

const STATIC_PAGES: { title: string; url: string; keywords: string }[] = [
  { title: 'Acasă', url: '/', keywords: 'acasa prima pagina parohia' },
  { title: 'Despre parohie', url: '/despre', keywords: 'despre istoric parohie comunitate' },
  { title: 'Misiune', url: '/misiune', keywords: 'misiune viziune slujire milostenie rugaciune' },
  { title: 'Cronologie', url: '/cronologie', keywords: 'cronologie istoric etape zidire santier fundatie' },
  { title: 'Campanii', url: '/campanii', keywords: 'campanii strangere fonduri donatii ctitor' },
  { title: 'Noutăți', url: '/blog', keywords: 'noutati blog stiri anunturi vesti' },
  { title: 'Contact', url: '/contact', keywords: 'contact adresa telefon email program slujbe' },
  { title: 'Donează', url: '/doneaza', keywords: 'doneaza donatie card transfer banca' },
  {
    title: 'Redirecționează 3,5%',
    url: '/redirectioneaza-3-5',
    keywords: 'redirectionare impozit 3.5 formular 230 anaf',
  },
  { title: 'Termeni și condiții', url: '/termeni-si-conditii', keywords: 'termeni conditii legal' },
  {
    title: 'Politică de confidențialitate',
    url: '/politica-de-confidentialitate',
    keywords: 'politica confidentialitate date gdpr',
  },
];

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q') || '';
  const needle = fold(q);
  if (needle.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results: Result[] = [];

  // Static pages
  for (const p of STATIC_PAGES) {
    if (fold(`${p.title} ${p.keywords}`).includes(needle)) {
      results.push({ type: 'Pagină', title: p.title, url: p.url });
    }
  }

  // Campaigns
  for (const c of CAMPAIGNS) {
    const hay = fold(`${c.title} ${(c.description || []).join(' ')}`);
    if (hay.includes(needle)) {
      results.push({
        type: 'Campanie',
        title: c.title,
        url: `/donations/${c.slug}`,
        excerpt: c.description?.[0],
      });
    }
  }

  // Blog posts (from the database)
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'publish' },
      orderBy: { publishedAt: 'desc' },
      select: { title: true, slug: true, excerpt: true },
      take: 300,
    });
    for (const post of posts) {
      const hay = fold(`${post.title} ${post.excerpt || ''}`);
      if (hay.includes(needle)) {
        results.push({
          type: 'Articol',
          title: post.title,
          url: `/blog/${post.slug}`,
          excerpt: post.excerpt || undefined,
        });
      }
      if (results.length >= 40) break;
    }
  } catch {
    // DB unavailable — still return page/campaign matches.
  }

  return NextResponse.json({ results: results.slice(0, 24) });
}
