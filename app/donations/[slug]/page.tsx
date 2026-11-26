import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Hero } from '@/components/site/hero';
import { FadeIn } from '@/components/magicui/fade-in';
import { Card } from '@/components/ui/card';
import { DonateForm, type PresetTier } from '@/components/site/donate-form';
import { ChurchProgress } from '@/components/site/church-progress';
import { ChurchRising3D } from '@/components/site/church-rising-3d';
import { CosturiZidire } from '@/components/site/costuri-zidire';
import { prisma } from '@/lib/prisma';
import { CtitoriList } from '@/components/site/ctitori-list';
import { ConstructionProgress } from '@/components/site/construction-progress';
import { CopyButton } from '@/components/site/copy-button';
import { ShieldCheck, Building2, Landmark, User } from 'lucide-react';
import { isStripeConfigured } from '@/lib/stripe';
import { findCampaign } from '@/lib/campaigns';
import { DEFAULT_OG_IMAGE } from '@/lib/site';
import { getImages } from '@/lib/images';
import { LandingHero } from '@/components/site/landing-hero';
import { LandingImpact } from '@/components/site/landing-impact';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { FloatingEmbers } from '@/components/site/floating-embers';
import { ShimmerButton } from '@/components/magicui/shimmer-button';

// Amount → realistic construction unit (price-anchored). Each preset describes
// what the gift actually pays for in the church build.
const SYMBOLS: Record<number, { symbol: string; icon: string; subtitle: string }> = {
  29: { symbol: '10 cărămizi', icon: '🧱', subtitle: 'fundație' },
  50: { symbol: '1 sac de ciment', icon: '🪨', subtitle: 'temelie' },
  100: { symbol: '1 m² de tencuială', icon: '🛠️', subtitle: 'pereți' },
  250: { symbol: '1 m² de zidărie', icon: '🧱', subtitle: 'pereți' },
  500: { symbol: '1 grindă', icon: '🪵', subtitle: 'acoperiș' },
  1000: { symbol: '1 fereastră', icon: '🪟', subtitle: 'lumină' },
};

const CONSTRUCTION_SLUG = 'strangere-de-fonduri-pentru-construirea-bisericii';

/** Real donation progress for the 3D rising church (no money sum shown). */
async function fetchCampaignProgress(slug: string, goalRon: number) {
  try {
    const [agg, donors] = await Promise.all([
      prisma.donation.aggregate({
        where: { campaign: slug, status: { in: ['completed', 'self_reported_bank'] } },
        _sum: { amount: true },
      }),
      prisma.donor.count({ where: { donations: { some: { campaign: slug } } } }),
    ]);
    const raised = agg._sum.amount || 0;
    return { percent: goalRon > 0 ? Math.min(100, (raised / goalRon) * 100) : 0, donors };
  } catch {
    return { percent: 0, donors: 0 };
  }
}

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

  const isConstruction = campaign.slug === CONSTRUCTION_SLUG;
  // Same goal basis as the homepage "Biserica se ridică" section, so the 3D
  // church shows the SAME real progress on both pages (not 0%).
  const progress = isConstruction
    ? await fetchCampaignProgress(campaign.slug, 1_500_000)
    : null;
  const IMG = await getImages();

  const tiers: PresetTier[] = campaign.presetAmounts.map((amount) => ({
    amount,
    symbol: SYMBOLS[amount]?.symbol || `${amount} RON`,
    icon: SYMBOLS[amount]?.icon || '🙏',
    subtitle: SYMBOLS[amount]?.subtitle || 'biserică',
  }));

  return (
    <>
      {isConstruction ? (
        <LandingHero
          src={IMG.churchRendering}
          donors={progress?.donors ?? 0}
          percent={progress?.percent ?? 0}
        />
      ) : (
        <Hero
          title={campaign.title}
          breadcrumb={[
            { label: 'Acasă', href: '/' },
            { label: 'Campanii', href: '/campanii' },
            { label: campaign.shortTitle },
          ]}
        />
      )}

      {/* ── CENTERPIECE: the church rising ───────────────────────────────────── */}
      <section id="biserica-3d" className="container py-12 sm:py-16 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-8">
              <SectionEyebrow align="center">Împreună zidim</SectionEyebrow>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-burgundy">
                {isConstruction ? 'Biserica se ridică, bucată cu bucată' : 'Lumina se ridică odată cu noi'}
              </h2>
              <p className="text-ink-muted mt-3 max-w-2xl mx-auto leading-relaxed">
                {isConstruction
                  ? 'Cu fiecare dar, se ridică mai mult din casa Domnului. Așa am ajuns până acum:'
                  : 'Fiecare jertfă adusă cu inima curată ridică lumina de la temelie spre cer.'}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            {isConstruction && progress ? (
              <ChurchRising3D percent={progress.percent} donors={progress.donors} />
            ) : (
              <ChurchProgress campaign={campaign.slug} goalRon={campaign.goalRon} />
            )}
          </FadeIn>

          {/* Construction stages — parchment-style list of seven phases. */}
          <FadeIn delay={0.2}>
            <div className="mt-10 sm:mt-12 max-w-3xl mx-auto">
              <ConstructionProgress label="Stadiul zidirii bisericii" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CE ZIDEȘTI CU DARUL TĂU + CÂT COSTĂ (doar construcție) ──────────── */}
      {isConstruction && <LandingImpact />}
      {isConstruction && <CosturiZidire />}

      {/* ── DONATE + CTITORI ────────────────────────────────────────────────── */}
      <section id="doneaza" className="container py-12 sm:py-16 scroll-mt-24">
        <FadeIn>
          <div className="text-center mb-8">
            <SectionEyebrow align="center">Dăruiește</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-burgundy">
              Pune și tu o cărămidă
            </h2>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {/* Donate form (left, sticky on desktop) */}
          <div className="lg:col-span-3 min-w-0">
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
          <div className="lg:col-span-2 min-w-0">
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

      {/* ── BOTTOM CTA (premium, cu jar plutitor) ───────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#4f120d] to-[#2c0a07] text-cream py-16 sm:py-20">
        <FloatingEmbers density={30} className="pointer-events-none absolute inset-0 h-full w-full" />
        <div className="container relative max-w-2xl text-center">
          <FadeIn>
            <div className="text-gold text-3xl mb-3">☩</div>
            <h2 className="font-display text-3xl sm:text-5xl italic mb-4">
              Pune și tu o cărămidă
            </h2>
            <p className="text-cream/85 mb-8 leading-relaxed max-w-xl mx-auto">
              De la 10 cărămizi (29 lei), numele tău va fi pomenit la Sfânta Liturghie și va rămâne
              în zidul acestei biserici. Împreună o ridicăm.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center items-center">
              <a href="#doneaza">
                <ShimmerButton
                  background="linear-gradient(135deg,#EAC784,#c9a361)"
                  shimmerColor="#fff7e6"
                  className="!text-burgundy-dark font-ceremonial uppercase tracking-[0.18em] text-sm px-8 py-4 font-semibold"
                >
                  Dăruiește acum
                </ShimmerButton>
              </a>
              <Link
                href="/redirectioneaza-3-5"
                className="rounded-full border border-cream/35 px-7 py-4 text-sm font-ceremonial uppercase tracking-[0.18em] hover:bg-cream hover:text-burgundy transition-colors"
              >
                Redirecționează 3,5%
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
