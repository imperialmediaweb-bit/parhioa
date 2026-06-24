import Link from 'next/link';
import { Hero } from '@/components/site/hero';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { FadeIn } from '@/components/magicui/fade-in';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { Quote, Building2, ArrowRight } from 'lucide-react';
import { getImages } from '@/lib/images';
import { activeCampaigns } from '@/lib/campaigns';

export const metadata = { title: 'Campanii' };

export default async function CampaniiPage() {
  const IMG = await getImages();
  // Single source of truth — derive cards from lib/campaigns so the title,
  // slug and quote always match the canonical campaign page.
  const CAMPAIGNS = activeCampaigns.map((c) => ({
    slug: c.slug,
    image: IMG[c.image],
    title: c.title,
    quote: c.bodyQuote ? `„${c.bodyQuote.text}"` : '',
    excerpt: c.description[0] ?? '',
  }));

  return (
    <>
      <Hero
        title={<>Campaniile parohiei – <em className="font-serif italic">fapte bune care zidesc</em></>}
        subtitle="Campaniile prin care parohia sprijină zidirea bisericii, ajutorarea familiilor aflate în nevoie, susținerea celor lipsiți și alte lucrări de folos. Împreună putem duce mai departe credința prin faptă."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Campanii' }]}
      />

      {/* Campaign card with image */}
      <section className="container py-12">
        <FadeIn>
          {CAMPAIGNS.map((c) => (
            <Card key={c.slug} className="overflow-hidden bg-cream-card border-0 max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2">
                <div className="aspect-[4/5] md:aspect-auto overflow-hidden">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 self-center">
                  <Building2 className="h-8 w-8 text-burgundy mb-4" />
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-burgundy leading-snug mb-3">
                    {c.title}
                  </h3>
                  <p className="font-serif italic text-ink-muted mb-4 text-[15px]">{c.quote}</p>
                  <p className="text-sm text-ink-muted leading-relaxed mb-6">{c.excerpt}</p>
                  <Link href={`/donations/${c.slug}`}>
                    <Button size="lg" className="gap-2">
                      Vezi campania și donează <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </FadeIn>
      </section>

      {/* Stats / impact */}
      <section className="bg-cream py-12">
        <div className="container max-w-4xl text-center">
          <FadeIn>
            <SectionEyebrow align="center">Împreună putem mai mult</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-12">
              Fiecare cărămidă spune o <em className="italic text-burgundy">rugăciune</em>
            </h2>
          </FadeIn>
          <div className="grid grid-cols-3 gap-6">
            <FadeIn>
              <div className="font-display text-4xl sm:text-5xl font-bold text-burgundy">
                <NumberTicker value={2022} />
              </div>
              <p className="font-ceremonial text-xs uppercase tracking-wider text-ink-muted mt-2">
                an înființare
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="font-display text-4xl sm:text-5xl font-bold text-burgundy">
                <NumberTicker value={1} />
              </div>
              <p className="font-ceremonial text-xs uppercase tracking-wider text-ink-muted mt-2">
                biserică în zidire
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="font-display text-4xl sm:text-5xl font-bold text-burgundy">∞</div>
              <p className="font-ceremonial text-xs uppercase tracking-wider text-ink-muted mt-2">
                rugăciuni
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-burgundy text-white py-20">
        <div className="container text-center max-w-2xl">
          <FadeIn>
            <Quote className="h-12 w-12 text-gold/40 mx-auto mb-4" />
            <p className="font-display text-2xl sm:text-3xl italic leading-relaxed mb-8">
              „Dăruind pentru Biserică, te faci moștenitor al comorilor veșnice."
            </p>
            <p className="font-ceremonial text-sm uppercase tracking-[0.2em] text-gold mb-8">
              Sfântul Ioan Damaschin
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/redirectioneaza-3-5">
                <Button variant="cream" size="lg">Redirecționează 3,5%</Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
