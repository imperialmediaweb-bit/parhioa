import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Hero } from '@/components/site/hero';
import { FadeIn } from '@/components/magicui/fade-in';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DonateForm, type PresetTier } from '@/components/site/donate-form';
import { ChurchProgress } from '@/components/site/church-progress';
import { CtitoriList } from '@/components/site/ctitori-list';
import { ConstructionProgress } from '@/components/site/construction-progress';
import { CopyButton } from '@/components/site/copy-button';
import { Heart, ShieldCheck, Building2, Landmark, User } from 'lucide-react';
import { isStripeConfigured } from '@/lib/stripe';
import { findCampaign } from '@/lib/campaigns';
import { DEFAULT_OG_IMAGE } from '@/lib/site';

// Amount → realistic construction unit (price-anchored). Each preset describes
// what the gift actually pays for in the church build.
const SYMBOLS: Record<number, { symbol: string; icon: string; subtitle: string }> = {
  25: { symbol: '5 cărămizi', icon: '🧱', subtitle: 'fundație' },
  50: { symbol: '1 sac de ciment', icon: '🪨', subtitle: 'temelie' },
  100: { symbol: '1 m² de tencuială', icon: '🛠️', subtitle: 'pereți' },
  250: { symbol: '1 m² de zidărie', icon: '🧱', subtitle: 'pereți' },
  500: { symbol: '1 grindă', icon: '🪵', subtitle: 'acoperiș' },
  1000: { symbol: '1 fereastră', icon: '🪟', subtitle: 'lumină' },
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const c = findCampaign(params.slug);
  if (!c) return { title: 'Campanie inexistentă', robots: { index: false } };

  const url = `/donations/${c.slug}`;
  const description = c.description[0];
  return {
    title: c.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: c.title,
      description,
      images: [{ url: DEFAULT_OG_IMAGE, alt: c.title }],
    },
    twitter: { card: 'summary_large_image', title: c.title, description, images: [DEFAULT_OG_IMAGE] },
  };
}

export default async function DonationCampaignPage({
  params,
}: {
  params: { slug: string };
}) {
  const campaign = findCampaign(params.slug);
  if (!campaign) notFound();

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

      {/* ── CENTERPIECE: parchment-framed church with rising golden light ────── */}
      <section className="container py-10 sm:py-14">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-8">
              <p className="font-ceremonial uppercase text-xs tracking-[0.24em] text-burgundy mb-2">
                Biserica din inimi
              </p>
              <h2 className="font-display text-3xl sm:text-4xl italic text-navy">
                Lumina se ridică odată cu noi
              </h2>
              <p className="text-ink-muted mt-3 max-w-2xl mx-auto leading-relaxed">
                Fiecare jertfă adusă cu inima curată ridică lumina de la temelie spre cer.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <ChurchProgress campaign={campaign.slug} goalRon={campaign.goalRon} />
          </FadeIn>

          {/* Construction stages — parchment-style list of seven phases. */}
          <FadeIn delay={0.2}>
            <div className="mt-10 sm:mt-12 max-w-3xl mx-auto">
              <ConstructionProgress label="Stadiul zidirii bisericii" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── DONATE + CTITORI ────────────────────────────────────────────────── */}
      <section id="donate-zidirea-bisericii" className="container pb-12 sm:pb-16 scroll-mt-24">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {/* Donate form (left, sticky on desktop) */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-32">
              <FadeIn>
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
                    bankDetails={campaign.bankDetails}
                  />
                </Card>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="flex items-center justify-center gap-2 text-xs text-ink-soft mt-4">
                  <ShieldCheck className="h-4 w-4" />
                  Plată securizată SSL · procesare prin Stripe
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Ctitori list (right) */}
          <div className="lg:col-span-2">
            <FadeIn delay={0.1}>
              <CtitoriList campaign={campaign.slug} />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── BANK DETAILS (moved up, right after the donate form) ─────────────── */}
      <section className="container pb-12 sm:pb-14">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <Card className="bg-gradient-to-br from-cream-card via-cream-deep/40 to-cream-card border border-gold/30 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="h-6 w-6 text-burgundy" />
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-navy">
                  Donații prin <em className="italic text-burgundy">transfer bancar</em>
                </h3>
              </div>
              <p className="text-sm text-ink-muted mb-5">
                Pentru cei ce preferă viramentul direct, datele contului parohiei sunt:
              </p>
              <dl className="grid sm:grid-cols-1 gap-3">
                <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-border">
                  <User className="h-5 w-5 text-burgundy flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <dt className="text-xs uppercase font-bold tracking-wider text-ink-soft">
                      Titular
                    </dt>
                    <dd className="font-medium text-ink mt-0.5 break-words">
                      {campaign.bankDetails.holder}
                    </dd>
                  </div>
                  <CopyButton value={campaign.bankDetails.holder} />
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-border">
                  <Landmark className="h-5 w-5 text-burgundy flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <dt className="text-xs uppercase font-bold tracking-wider text-ink-soft">
                      IBAN
                    </dt>
                    <dd className="font-mono font-bold text-ink mt-0.5 break-all">
                      {campaign.bankDetails.iban}
                    </dd>
                  </div>
                  <CopyButton value={campaign.bankDetails.iban} />
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-border">
                  <Building2 className="h-5 w-5 text-burgundy flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <dt className="text-xs uppercase font-bold tracking-wider text-ink-soft">
                      Banca
                    </dt>
                    <dd className="font-medium text-ink mt-0.5">{campaign.bankDetails.bank}</dd>
                  </div>
                  <CopyButton value={campaign.bankDetails.bank} />
                </div>
              </dl>
              <p className="text-xs text-ink-soft italic text-center mt-4">
                Sau alegeți <em>„Transfer bancar"</em> în formularul de mai sus pentru a
                ne anunța că ați făcut transferul.
              </p>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* ── STORY + QUOTE ────────────────────────────────────────────────────── */}
      <section className="bg-cream-card/40 border-y border-gold/20 py-14">
        <div className="container max-w-3xl">
          <FadeIn>
            <div className="border-l-4 border-burgundy bg-white/70 rounded-r-2xl p-6 sm:p-7 mb-8">
              <p className="text-2xl mb-2">📜</p>
              <p className="font-serif italic text-ink leading-relaxed text-lg sm:text-xl">
                „{campaign.bodyQuote.text}"
              </p>
              <p className="font-ceremonial text-sm uppercase tracking-[0.18em] text-burgundy mt-3">
                — {campaign.bodyQuote.author}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="space-y-5">
              {campaign.description.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === campaign.description.length - 1
                      ? 'font-display italic text-2xl sm:text-3xl text-burgundy text-center mt-8'
                      : 'text-ink-muted leading-relaxed text-[17px] sm:text-lg'
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-burgundy text-white py-12">
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
