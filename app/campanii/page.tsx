import Link from 'next/link';
import { Hero } from '@/components/site/hero';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { FadeIn } from '@/components/magicui/fade-in';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { Quote } from 'lucide-react';
import { IMG } from '@/lib/images';

export const metadata = { title: 'Campanii' };

const CAMPAIGNS = [
  {
    image: IMG.campaignPoster,
    title: 'Strângere de fonduri pentru construirea bisericii',
    quote:
      '„Nu zidurile fac Biserica, ci credința; dar fără ziduri, credința nu are unde…"',
    excerpt:
      'Devino ctitor al bisericii noi a Parohiei Sfânta Cuvioasă Teodora de la Sihla. Fiecare cărămidă spune o rugăciune. Susține construcția lăcașului de cult.',
    href: '/doneaza',
    cta: 'Devino ctitor',
  },
];

export default function CampaniiPage() {
  return (
    <>
      <Hero
        title={<>Campaniile parohiei – <em className="font-serif italic">fapte bune care zidesc</em></>}
        subtitle="Campaniile prin care parohia sprijină zidirea bisericii, ajutorarea familiilor aflate în nevoie, susținerea celor lipsiți și alte lucrări de folos. Împreună putem duce mai departe credința prin faptă."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Campanii' }]}
      />

      <section className="container py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CAMPAIGNS.map((c, i) => (
            <FadeIn key={c.title} delay={i * 0.1}>
              <Card className="h-full overflow-hidden bg-cream-card border-0">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-semibold text-burgundy mb-3 leading-snug">
                    {c.title}
                  </h3>
                  <p className="font-serif italic text-ink-muted mb-3 text-[15px]">{c.quote}</p>
                  <p className="text-sm text-ink-muted leading-relaxed mb-5">{c.excerpt}</p>
                  <Link href={c.href}>
                    <Button size="sm">{c.cta}</Button>
                  </Link>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Stats / impact */}
      <section className="bg-cream py-16">
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
              <Link href="/doneaza"><Button variant="cream" size="lg">Donează acum</Button></Link>
              <Link href="/redirectioneaza-3-5"><Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-burgundy">Redirecționează 3,5%</Button></Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
