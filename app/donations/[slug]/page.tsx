import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Hero } from '@/components/site/hero';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { FadeIn } from '@/components/magicui/fade-in';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DonateForm } from '@/components/site/donate-form';
import { Quote, Heart, ShieldCheck } from 'lucide-react';
import { getImages, type ImageKey } from '@/lib/images';
import { isStripeConfigured } from '@/lib/stripe';

// =============================================================
// Campaign registry. Add new fundraisers here. The slug becomes
// /donations/<slug> AND /campanii links.
// =============================================================
const CAMPAIGNS: Record<
  string,
  {
    title: string;
    image: ImageKey;
    quote: string;
    description: string[];
    defaultAmount?: number;
  }
> = {
  'strangere-de-fonduri-pentru-construirea-bisericii': {
    title: 'Strângere de fonduri pentru construirea bisericii',
    image: 'campaignPoster',
    quote: '„Nu zidurile fac Biserica, ci credința; dar fără ziduri, credința nu are unde…"',
    description: [
      'Parohia „Sfânta Cuvioasă Teodora de la Sihla" din Botoșani își caută încă lăcașul de închinare. Pentru a putea zidi prima biserică a parohiei, avem nevoie de ajutorul tău.',
      'Fiecare dar este o cărămidă vie. Donația ta — fie ea o singură dată sau lunară — devine parte din temelia unui loc unde generații întregi se vor ruga, se vor boteza, se vor cununa și vor primi binecuvântarea lui Dumnezeu.',
      'Mulțumim din inimă. Numele tău va fi pomenit la Sfânta Liturghie.',
    ],
    defaultAmount: 50,
  },
  // Alias for shorter URL
  'zidirea-bisericii': {
    title: 'Strângere de fonduri pentru construirea bisericii',
    image: 'campaignPoster',
    quote: '„Nu zidurile fac Biserica, ci credința; dar fără ziduri, credința nu are unde…"',
    description: [
      'Parohia „Sfânta Cuvioasă Teodora de la Sihla" din Botoșani își caută încă lăcașul de închinare. Pentru a putea zidi prima biserică a parohiei, avem nevoie de ajutorul tău.',
      'Fiecare dar este o cărămidă vie. Donația ta — fie ea o singură dată sau lunară — devine parte din temelia unui loc unde generații întregi se vor ruga, se vor boteza, se vor cununa și vor primi binecuvântarea lui Dumnezeu.',
      'Mulțumim din inimă. Numele tău va fi pomenit la Sfânta Liturghie.',
    ],
    defaultAmount: 50,
  },
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const c = CAMPAIGNS[params.slug];
  return c
    ? { title: c.title, description: c.description[0] }
    : { title: 'Campanie inexistentă' };
}

export default async function DonationCampaignPage({
  params,
}: {
  params: { slug: string };
}) {
  const campaign = CAMPAIGNS[params.slug];
  if (!campaign) notFound();

  const IMG = await getImages();
  const imageUrl = IMG[campaign.image];

  return (
    <>
      <Hero
        title={campaign.title}
        subtitle={campaign.quote}
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Campanii', href: '/campanii' },
          { label: campaign.title },
        ]}
      />

      <section className="container py-16">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 max-w-6xl mx-auto">
          {/* Left: image + story */}
          <div className="lg:col-span-3 space-y-6">
            <FadeIn>
              <div className="aspect-[4/5] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-xl">
                <img
                  src={imageUrl}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <SectionEyebrow>Despre campanie</SectionEyebrow>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-5">
                Devino <em className="italic text-burgundy">ctitor</em>
              </h2>
              {campaign.description.map((p, i) => (
                <p key={i} className="text-ink-muted leading-relaxed text-[17px] mb-4">
                  {p}
                </p>
              ))}

              <Card className="bg-cream-card border-0 p-6 mt-6">
                <Quote className="h-8 w-8 text-burgundy/30 mb-3" />
                <p className="font-serif italic text-ink leading-relaxed">{campaign.quote}</p>
              </Card>
            </FadeIn>
          </div>

          {/* Right: sticky donate form */}
          <div className="lg:col-span-2">
            <div className="sticky top-32 space-y-4">
              <FadeIn delay={0.15}>
                <Card className="p-6 sm:p-8 bg-white border border-border shadow-lg">
                  {!isStripeConfigured && (
                    <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                      ⚠️ Stripe nu e configurat încă. Plățile vor funcționa după ce admin-ul adaugă{' '}
                      <code>STRIPE_SECRET_KEY</code> în setări.
                    </div>
                  )}
                  <DonateForm campaign={params.slug} campaignTitle={campaign.title} />
                </Card>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="flex items-center justify-center gap-2 text-xs text-ink-soft">
                  <ShieldCheck className="h-4 w-4" />
                  Plăți securizate prin Stripe · PCI-DSS
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-burgundy text-white py-16">
        <div className="container max-w-2xl text-center">
          <FadeIn>
            <Heart className="h-10 w-10 text-gold mx-auto mb-4" />
            <h2 className="font-display text-3xl sm:text-4xl italic mb-4">
              Mulțumim pentru darul tău
            </h2>
            <p className="text-white/85 mb-6 leading-relaxed">
              Dacă preferi alte metode de plată, vezi pagina cu opțiuni — transfer bancar,
              redirecționare 3,5% din impozit sau voluntariat.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/doneaza">
                <Button variant="cream" size="lg">Alte moduri de a dărui</Button>
              </Link>
              <Link href="/redirectioneaza-3-5">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white hover:text-burgundy"
                >
                  Redirecționează 3,5%
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
