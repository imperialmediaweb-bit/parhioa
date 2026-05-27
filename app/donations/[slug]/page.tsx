import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Hero } from '@/components/site/hero';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { FadeIn } from '@/components/magicui/fade-in';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DonateForm, type PresetTier } from '@/components/site/donate-form';
import { Quote, Heart, ShieldCheck, Copy, Building2, Landmark, User } from 'lucide-react';
import { getImages } from '@/lib/images';
import { isStripeConfigured } from '@/lib/stripe';
import { findCampaign } from '@/lib/campaigns';

// Mapping amounts → symbolic church elements (bricks, stones, etc.)
const SYMBOLS: Record<number, { symbol: string; icon: string; subtitle: string }> = {
  10: { symbol: '1 cărămidă', icon: '🧱', subtitle: 'fundația' },
  25: { symbol: '3 cărămizi', icon: '🧱', subtitle: 'pereții' },
  50: { symbol: 'O piatră', icon: '🪨', subtitle: 'temelia' },
  100: { symbol: 'O grindă', icon: '🪵', subtitle: 'acoperișul' },
  250: { symbol: 'Un vitraliu', icon: '🪟', subtitle: 'lumina' },
  500: { symbol: 'O icoană', icon: '🕯️', subtitle: 'altarul' },
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const c = findCampaign(params.slug);
  return c
    ? { title: c.title, description: c.description[0] }
    : { title: 'Campanie inexistentă' };
}

export default async function DonationCampaignPage({
  params,
}: {
  params: { slug: string };
}) {
  const campaign = findCampaign(params.slug);
  if (!campaign) notFound();

  const IMG = await getImages();
  const imageUrl = IMG[campaign.image];

  // Build tiers from campaign's preset amounts using the SYMBOLS map
  const tiers: PresetTier[] = campaign.presetAmounts.map((amount) => ({
    amount,
    symbol: SYMBOLS[amount]?.symbol || `${amount} RON`,
    icon: SYMBOLS[amount]?.icon || '🙏',
    subtitle: SYMBOLS[amount]?.subtitle || 'biserică',
  }));

  return (
    <>
      <Hero
        title={campaign.title}
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Campanii', href: '/campanii' },
          { label: campaign.shortTitle },
        ]}
      />

      <section className="container py-16">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 max-w-6xl mx-auto">
          {/* LEFT: poster + body content */}
          <div className="lg:col-span-3 space-y-8">
            <FadeIn>
              <div className="aspect-[4/5] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-xl">
                <img src={imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              {/* Body quote */}
              <div className="border-l-4 border-burgundy bg-cream-card/60 rounded-r-2xl p-6">
                <p className="text-2xl mb-2">📜</p>
                <p className="font-serif italic text-ink leading-relaxed text-lg">
                  „{campaign.bodyQuote.text}"
                </p>
                <p className="font-ceremonial text-sm uppercase tracking-[0.18em] text-burgundy mt-3">
                  — {campaign.bodyQuote.author}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="space-y-4">
                {campaign.description.map((p, i) => (
                  <p
                    key={i}
                    className={
                      i === campaign.description.length - 1
                        ? 'font-display italic text-2xl text-burgundy text-center mt-6'
                        : 'text-ink-muted leading-relaxed text-[17px]'
                    }
                  >
                    {p}
                  </p>
                ))}
              </div>
            </FadeIn>

            {/* Bank details (offline donation) */}
            <FadeIn delay={0.2}>
              <Card className="bg-gradient-to-br from-cream-card via-cream-deep/40 to-cream-card border border-gold/30 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Landmark className="h-6 w-6 text-burgundy" />
                  <h3 className="font-display text-xl font-semibold text-navy">
                    Donații prin <em className="italic text-burgundy">transfer bancar</em>
                  </h3>
                </div>
                <p className="text-sm text-ink-muted mb-5">
                  Pentru cei ce preferă viramentul direct, datele contului parohiei sunt:
                </p>
                <dl className="grid sm:grid-cols-1 gap-3">
                  <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-border">
                    <User className="h-5 w-5 text-burgundy flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <dt className="text-xs uppercase font-bold tracking-wider text-ink-soft">
                        Titular
                      </dt>
                      <dd className="font-medium text-ink mt-0.5 break-words">
                        {campaign.bankDetails.holder}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-border">
                    <Copy className="h-5 w-5 text-burgundy flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <dt className="text-xs uppercase font-bold tracking-wider text-ink-soft">
                        IBAN
                      </dt>
                      <dd className="font-mono font-bold text-ink mt-0.5 break-all">
                        {campaign.bankDetails.iban}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-border">
                    <Building2 className="h-5 w-5 text-burgundy flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <dt className="text-xs uppercase font-bold tracking-wider text-ink-soft">
                        Banca
                      </dt>
                      <dd className="font-medium text-ink mt-0.5">{campaign.bankDetails.bank}</dd>
                    </div>
                  </div>
                </dl>
                <p className="text-xs text-ink-soft italic text-center mt-5">
                  sau prin metodele de mai jos (card · SEPA · recurent) →
                </p>
              </Card>
            </FadeIn>
          </div>

          {/* RIGHT: sticky Stripe donate form */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-32 space-y-4">
              <FadeIn delay={0.15}>
                <Card className="p-6 sm:p-8 bg-white border border-border shadow-2xl">
                  {!isStripeConfigured && (
                    <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                      ⚠️ Stripe nu e configurat încă. Plățile vor funcționa după ce admin-ul
                      adaugă <code>STRIPE_SECRET_KEY</code> în setări Railway.
                    </div>
                  )}
                  <DonateForm
                    campaign={campaign.slug}
                    campaignTitle={campaign.shortTitle}
                    presets={tiers}
                    defaultAmount={campaign.defaultAmount}
                  />
                </Card>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="flex items-center justify-center gap-2 text-xs text-ink-soft">
                  <ShieldCheck className="h-4 w-4" />
                  Plată securizată SSL · procesare prin Stripe
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
              Dacă preferi să redirecționezi 3,5% din impozitul pe venit (fără cost), vezi pagina
              dedicată. Sau implică-te ca voluntar — toate căile sunt o cărămidă vie în zidire.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/redirectioneaza-3-5">
                <Button variant="cream" size="lg">
                  Redirecționează 3,5%
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white hover:text-burgundy"
                >
                  Voluntariat
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
