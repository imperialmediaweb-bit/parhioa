import Link from 'next/link';
import dynamic from 'next/dynamic';
import { prisma } from '@/lib/prisma';
import { getImages } from '@/lib/images';
import { HeroSlider, type HeroSlide } from '@/components/site/hero-slider';
import { PostCard } from '@/components/site/post-card';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { type Testimonial } from '@/components/site/testimonials';

// Heavier interactive blocks are loaded only after the hero/above-the-fold
// content paints — keeps mobile LCP/INP fast.
const Testimonials = dynamic(
  () => import('@/components/site/testimonials').then((m) => m.Testimonials),
  { ssr: true, loading: () => <div className="min-h-[280px]" /> },
);
import { CrossDivider, OrthodoxCross } from '@/components/site/cross-divider';
import { ParchmentFrame } from '@/components/site/parchment-frame';
import { ProgramSlujbe } from '@/components/site/program-slujbe';
import { SarbatoareaZilei } from '@/components/site/sarbatoarea-zilei';
import { NewsTicker } from '@/components/site/news-ticker';
import { NewsletterForm } from '@/components/site/newsletter-form';
import { SectionRibbon } from '@/components/site/section-ribbon';
import { DonationProgress } from '@/components/site/donation-progress';
import { ConstructionProgress } from '@/components/site/construction-progress';
import { PLACEHOLDER_POSTS } from '@/lib/placeholder-posts';
import { type GalleryImage } from '@/components/site/photo-gallery';
import { type VideoItem } from '@/components/site/featured-video';

const PhotoGallery = dynamic(
  () => import('@/components/site/photo-gallery').then((m) => m.PhotoGallery),
  { ssr: false, loading: () => <div className="min-h-[420px]" /> },
);

const VideoGallery = dynamic(
  () => import('@/components/site/featured-video').then((m) => m.VideoGallery),
  { ssr: false, loading: () => <div className="aspect-[16/9] max-w-5xl mx-auto rounded-[24px] bg-burgundy-dark/10" /> },
);
import { listGalleryAssets } from '@/lib/cloudinary-gallery';
import {
  CandleIcon,
  CenserIcon,
  ChurchIcon,
  GospelIcon,
  KandilaIcon,
  HandsHeartIcon,
  PrayingHandsIcon,
  MandorlaIcon,
} from '@/components/site/orthodox-icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FadeIn } from '@/components/magicui/fade-in';

export const revalidate = 60;

const TESTIMONIALS: Testimonial[] = [
  {
    text:
      'Parohia «Sfânta Cuvioasă Teodora de la Sihla» e un început frumos și binecuvântat. Părintele Cătălin Ailenei este aproape de oameni, iar ceea ce se zidește aici se simte din suflet. Mă bucur să fac parte din această comunitate.',
    author: 'Aionițoaie Ionuț',
    role: 'Enoriaș',
  },
  {
    text:
      'Se zidește cu răbdare și credință, iar părintele Cătălin este mereu alături, cu inimă bună și grijă pentru fiecare. Lucrurile cresc frumos, pas cu pas.',
    author: 'Aionițoaie Ana-Maria',
    role: 'Enoriașă',
  },
  {
    text:
      'Parohia noastră este un început binecuvântat. Părintele Cătălin Ailenei este un om cu har și răbdare, aproape de oameni. Se simte că aici se zidește nu doar o biserică, ci o familie.',
    author: 'Dorina Budeanu',
    role: 'Enoriașă',
  },
];

async function getHomeData() {
  try {
    const [posts, gallery, cloudinaryAssets] = await Promise.all([
      prisma.post
        .findMany({
          where: { status: 'publish' },
          take: 6,
          orderBy: { publishedAt: 'desc' },
          include: { featured: true, categories: true },
        })
        .catch(() => []),
      prisma.media
        .findMany({
          where: {
            url: { contains: 'cloudinary' },
            AND: [
              // Skip WordPress theme demo images that may have leaked in
              { filename: { not: { contains: 'portfolio' } } },
              { filename: { not: { contains: 'home-church' } } },
              { filename: { not: { contains: 'church-img' } } },
              { filename: { not: { contains: 'placeholder' } } },
              { filename: { not: { contains: 'demo' } } },
              { filename: { not: { contains: 'icon-' } } },
              { filename: { not: { contains: 'logo' } } },
              { filename: { not: { contains: 'removebg' } } },
              {
                OR: [
                  { mimeType: { startsWith: 'image/' } },
                  { mimeType: null },
                ],
              },
              // Need real dimensions, not 1x1 trackers
              { OR: [{ width: { gt: 400 } }, { width: null }] },
            ],
          },
          take: 24,
          orderBy: { createdAt: 'desc' },
        })
        .catch(() => []),
      listGalleryAssets(30).catch(() => []),
    ]);
    return { posts, gallery, cloudinaryAssets };
  } catch {
    return { posts: [], gallery: [], cloudinaryAssets: [] };
  }
}

export default async function HomePage() {
  const [{ posts, gallery, cloudinaryAssets }, IMG] = await Promise.all([
    getHomeData(),
    getImages(),
  ]);

  // Add more videos here as you upload them to Cloudinary.
  const VIDEOS: VideoItem[] = [
    {
      src: 'https://res.cloudinary.com/dghmoelly/video/upload/f_auto,q_auto:good,vc_auto,w_1920,c_limit/v1779891366/AQNW2yUPExwSeWN0RACjr1UnnrcH284LxopR8_On3Dvmql2ce0KyJuMVtjmO3mRRp-L0hB5t3mQlskEVLQNwKUvzORweggc0znWD8zGC7yPjKw_aj76ye.mp4',
      poster:
        'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1779885083/parhioa/wp-28252.png',
      caption: 'Prezentarea proiectului bisericii',
    },
  ];

  const CURATED_GALLERY: GalleryImage[] = [
    {
      src: 'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1779885155/parhioa/wp-27811.webp',
      alt: 'Clipe din viața parohiei',
      caption: 'Clipe din viața parohiei',
    },
    {
      src: 'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1779885137/parhioa/wp-27850.webp',
      alt: 'Comunitatea parohiei',
      caption: 'Comunitatea parohiei',
    },
    {
      src: 'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1779885140/parhioa/wp-27849.webp',
      alt: 'Slujbe vii',
      caption: 'Slujbe vii',
    },
    {
      src: 'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1779885141/parhioa/wp-27848.webp',
      alt: 'Sfânta Cruce',
      caption: 'Sfânta Cruce',
    },
    {
      src: 'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1779885127/parhioa/wp-27898.webp',
      alt: 'Lucrarea zidirii',
      caption: 'Lucrarea zidirii',
    },
    {
      src: 'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1779885135/parhioa/wp-27851.webp',
      alt: 'Momente de rugăciune',
      caption: 'Momente de rugăciune',
    },
  ];

  const galleryImages: GalleryImage[] =
    CURATED_GALLERY.length >= 3
      ? CURATED_GALLERY
      : cloudinaryAssets.length >= 6
      ? cloudinaryAssets.slice(0, 18).map((a) => ({
          src: a.url,
          alt: a.alt || a.publicId.split('/').pop() || 'Foto parohie',
          caption: a.caption,
        }))
      : gallery.length >= 6
      ? gallery.slice(0, 18).map((m) => ({
          src: m.url,
          alt: m.alt || m.filename,
          caption: m.caption || undefined,
        }))
      : [
          { src: IMG.priestPortrait, alt: 'Pr. Cătălin Ailenei', caption: 'Părintele paroh' },
          { src: IMG.ctitorPhoto, alt: 'Comunitatea parohiei', caption: 'Comunitatea parohiei' },
          { src: IMG.liturghie, alt: 'Sfânta Liturghie', caption: 'Sfânta Liturghie' },
          { src: IMG.iconTeodora, alt: 'Icoana Sf. Teodora', caption: 'Icoana Cuvioasei Teodora' },
          { src: IMG.handsBranch, alt: 'Credință vie', caption: 'Credință vie' },
          { src: IMG.handsChurch, alt: 'Lucrarea zidirii', caption: 'Mâini ce zidesc' },
          { src: IMG.campaignPoster, alt: 'Devino ctitor', caption: 'Devino ctitor' },
          { src: IMG.parishIcon, alt: 'Icoana parohiei', caption: 'Sub ocrotirea Sf. Teodora' },
        ];

  const HERO_SLIDES: HeroSlide[] = [
    {
      // ===== VIDEO SLIDE =====
      // Cloudinary video with f_auto + q_auto + vc_auto so the browser
      // gets the lightest codec it supports (AV1/VP9/H.264) at the right
      // bitrate — no more stuttering.
      media: {
        type: 'video',
        src: 'https://res.cloudinary.com/dghmoelly/video/upload/f_auto,q_auto:good,vc_auto,w_1920,c_limit/v1779891366/AQNW2yUPExwSeWN0RACjr1UnnrcH284LxopR8_On3Dvmql2ce0KyJuMVtjmO3mRRp-L0hB5t3mQlskEVLQNwKUvzORweggc0znWD8zGC7yPjKw_aj76ye.mp4',
        poster: IMG.heroSlide1,
      },
      eyebrow: 'Binecuvântare și chemare',
      title: <>Într-o inimă, o credință, o familie duhovnicească</>,
      subtitle:
        'Vino să te rogi cu noi, să te împărtășești din harul lui Dumnezeu și să fii parte dintr-o comunitate vie.',
      primaryCta: { label: 'Misiunea noastră', href: '/misiune' },
      secondaryCta: { label: 'Despre noi', href: '/despre' },
    },
    {
      media: { type: 'image', src: IMG.heroSlide2, alt: 'Zidirea bisericii' },
      eyebrow: 'Fii sprijin pentru biserica noastră',
      title: (
        <>
          Zidim cu credință, <em className="font-serif italic">cărămidă cu cărămidă</em>
        </>
      ),
      subtitle:
        'Parohia noastră nu are încă un lăcaș de închinare. Cu ajutorul tău, putem pune piatra de temelie. Orice dar devine o cărămidă în casa Domnului.',
      primaryCta: {
        label: 'Contribuie',
        href: '/donations/strangere-de-fonduri-pentru-construirea-bisericii',
      },
    },
  ];

  return (
    <>
      {/* ============= 1. HERO SLIDER ============= */}
      <HeroSlider slides={HERO_SLIDES} />

      {/* ============= 1b. NEWS TICKER — Facebook announcements ============= */}
      <NewsTicker />

      {/* ============= 2. PROGRAM SLUJBE + SĂRBĂTOAREA ZILEI ============= */}
      <section className="container py-10 sm:py-14">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-2">
            <ProgramSlujbe />
          </div>
          <div className="lg:col-span-1 lg:sticky lg:top-32">
            <SarbatoareaZilei />
          </div>
        </div>
      </section>

      {/* ============= 2b. STICKY SUB-NAV ============= */}
      <nav className="border-y border-gold/30 bg-cream/85 backdrop-blur sticky top-24 sm:top-28 lg:top-32 z-30">
        <div className="container flex items-center justify-start sm:justify-center gap-5 sm:gap-8 lg:gap-12 py-2.5 sm:py-4 overflow-x-auto scrollbar-none">
          <a
            href="#parohul"
            className="flex items-center gap-1.5 sm:gap-2 font-ceremonial uppercase text-[10px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.18em] text-burgundy-dark hover:text-burgundy active:text-burgundy transition whitespace-nowrap shrink-0"
          >
            <span className="text-gold">☩</span>
            <span className="sm:hidden">Parohul</span>
            <span className="hidden sm:inline">Parohul bisericii</span>
          </a>
          <a
            href="#despre-parohia"
            className="flex items-center gap-1.5 sm:gap-2 font-ceremonial uppercase text-[10px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.18em] text-burgundy-dark hover:text-burgundy active:text-burgundy transition whitespace-nowrap shrink-0"
          >
            <span className="text-gold">☩</span>
            <span>Despre parohie</span>
          </a>
          <a
            href="#daruieste"
            className="flex items-center gap-1.5 sm:gap-2 font-ceremonial uppercase text-[10px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.18em] text-burgundy-dark hover:text-burgundy active:text-burgundy transition whitespace-nowrap shrink-0"
          >
            <span className="text-gold">☩</span>
            <span className="sm:hidden">Dăruiește</span>
            <span className="hidden sm:inline">Dăruiește pentru zidire</span>
          </a>
        </div>
      </nav>

      {/* ============= 3. PĂRINTELE CĂTĂLIN AILENEI ============= */}
      <section id="parohul" className="container py-10 sm:py-16 lg:py-20 scroll-mt-44">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center max-w-5xl mx-auto">
          <FadeIn className="lg:col-span-2">
            <ParchmentFrame
              src={IMG.priestPortrait}
              alt="Părintele Cătălin Ailenei"
              caption="Pr. Cătălin Ailenei"
              ratio="4/5"
            />
          </FadeIn>
          <FadeIn delay={0.15} className="lg:col-span-3">
            <SectionEyebrow>Părintele paroh</SectionEyebrow>
            <h2 className="font-display text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-5">
              Părintele Cătălin Ailenei – <em className="italic text-burgundy">păstor cu inimă de rugăciune</em>
            </h2>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-5">
              Cu blândețe și râvnă, părintele Cătălin Ailenei veghează asupra obștii încredințate,
              purtând în rugăciune sufletele celor ce se adună sub acoperământul Sfintei Cuvioase
              Teodora. Piatra cea vie a Bisericii se așază mai întâi în inimile credincioșilor, prin
              harul slujirii și al cuvântului duhovnicesc.
            </p>

            <blockquote className="border-l-4 border-burgundy/60 pl-5 my-6 italic text-burgundy/90 font-serif">
              „Nu zidim doar biserică de piatră, ci o biserică în inimile noastre — întru care
              Hristos să poată locui."
              <span className="block not-italic text-xs uppercase tracking-[0.22em] text-burgundy/60 mt-2 font-ceremonial">
                — Pr. Cătălin Ailenei
              </span>
            </blockquote>

            <ul className="space-y-2.5 mb-7">
              {[
                { eyebrow: 'Slujire', text: 'Săvârșirea cu evlavie a Sfintei Liturghii și a rânduielilor bisericești.' },
                { eyebrow: 'Duhovnicie', text: 'Spovedanie, cuvânt de folos și călăuzire pe drumul mântuirii.' },
                { eyebrow: 'Apropiere', text: 'Vizite pastorale, sfeștanii și prezență vie în viața enoriașilor.' },
              ].map((item) => (
                <li key={item.eyebrow} className="flex gap-3 items-start">
                  <span className="mt-1.5 flex-shrink-0 text-gold">☩</span>
                  <span>
                    <span className="font-ceremonial uppercase text-[11px] tracking-[0.22em] text-burgundy-dark">
                      {item.eyebrow}
                    </span>
                    <span className="text-ink-muted font-serif"> — {item.text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <Link href="/despre">
              <Button size="lg" variant="outline">Despre părintele paroh</Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      <SectionRibbon />

      {/* ============= 5. SUB OCROTIREA SF. CUVIOASE TEODORA ============= */}
      <section id="despre-parohia" className="container py-10 sm:py-16 lg:py-20 scroll-mt-44">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center max-w-5xl mx-auto">
          <FadeIn delay={0.15} className="lg:col-span-2 lg:order-2 flex items-center">
            <div className="relative mx-auto w-full max-w-[400px] pt-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_4px_14px_rgba(129,35,27,0.4)]">
                <OrthodoxCross height={54} />
              </div>
              <div
                className="relative rounded-[28px] aspect-square overflow-hidden shadow-[0_30px_60px_-30px_rgba(101,26,20,0.55)] p-5"
                style={{
                  background: 'linear-gradient(180deg, #FBF6EE 0%, #F5EBD7 55%, #EFE0C0 100%)',
                }}
              >
                <div className="absolute inset-2 rounded-[22px] border border-gold/60 pointer-events-none" />
                <div className="absolute inset-3 rounded-[19px] border border-burgundy/25 pointer-events-none" />
                <img
                  src={IMG.parishIcon}
                  alt="Sfânta Cuvioasă Teodora de la Sihla"
                  className="absolute inset-6 w-[calc(100%-3rem)] h-[calc(100%-3rem)] object-contain"
                />
              </div>
            </div>
          </FadeIn>
          <FadeIn className="lg:col-span-3 lg:order-1">
            <SectionEyebrow>Ocrotitoarea parohiei</SectionEyebrow>
            <h2 className="font-display text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-5">
              Sub ocrotirea <em className="italic text-burgundy">Sfintei Cuvioase Teodora</em> de la Sihla
            </h2>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-6">
              Parohia noastră din Botoșani se află sub binecuvântata ocrotire a Sfintei Cuvioase
              Teodora de la Sihla — floare aleasă a pustiei și rugătoare neîncetată înaintea lui
              Hristos. Viața ei, petrecută în post și lacrimi în adâncul pădurilor Neamțului, ne este
              pildă de răbdare, smerenie și statornicie în credință.
            </p>
            <Link href="/misiune">
              <Button size="lg" variant="outline">Misiunea parohiei</Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      <SectionRibbon />

      {/* ============= 6. FII CTITOR AL UNEI LUCRĂRI SFINTE ============= */}
      <section id="daruieste" className="relative iconostasis py-12 sm:py-20 scroll-mt-44">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center max-w-5xl mx-auto">
            <FadeIn className="lg:col-span-2 space-y-6">
              <ParchmentFrame
                src={IMG.ctitorPhoto}
                alt="Comunitatea parohiei adunată în rugăciune"
                caption="Comunitatea parohiei"
                ratio="4/5"
              />
              {/* Second photo hidden on mobile — saves vertical space. */}
              <div className="hidden lg:block">
                <ParchmentFrame
                  src="https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1779885078/parhioa/wp-28263.jpg"
                  alt="Locul viitoarei biserici"
                  caption="Locul viitoarei biserici"
                  ratio="4/5"
                  cross={false}
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.15} className="lg:col-span-3">
              <SectionEyebrow>Devino ctitor</SectionEyebrow>
              <h2 className="font-display text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-5">
                Fii ctitor al unei <em className="italic text-burgundy">lucrări sfinte</em>
              </h2>
              <blockquote className="border-l-4 border-burgundy pl-4 my-5 italic text-ink-muted">
                „Unde sunt doi sau trei adunați în Numele Meu, acolo sunt și Eu în mijlocul lor."{' '}
                <span className="block text-sm not-italic mt-1 text-burgundy">(Matei 18, 20)</span>
              </blockquote>
              <p className="text-ink-muted leading-relaxed text-[17px] mb-4">
                Sub ocrotirea <strong className="text-ink">Sfintei Cuvioase Teodora de la Sihla</strong>,
                zidim cu credință o biserică pentru sufletele care caută mângâiere, luminare și
                întâlnire cu Dumnezeu. Fiecare dar adus cu inimă curată devine o cărămidă vie în acest
                lăcaș al harului.
              </p>
              <div className="mb-7">
                <ConstructionProgress label="Stadiul zidirii bisericii" />
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/donations/strangere-de-fonduri-pentru-construirea-bisericii">
                  <Button size="lg">Sprijină lucrarea parohiei</Button>
                </Link>
                <Link href="/campanii">
                  <Button size="lg" variant="outline">Vezi toate campaniile</Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <SectionRibbon />

      {/* ============= 7. 3 STÂLPI – MISIUNEA PAROHIEI ============= */}
      <section className="container py-10 sm:py-16 lg:py-20">
        <FadeIn>
          <div className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto">
            <SectionEyebrow align="center">
              Misiunea parohiei „Sfânta Cuvioasă Teodora de la Sihla"
            </SectionEyebrow>
            <h2 className="font-display text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              Zidim credința, slujim cu <em className="italic text-burgundy">dragoste</em>, trăim în rugăciune
            </h2>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[
            {
              Icon: ChurchIcon,
              title: 'Slujire liturgică',
              text:
                'Ne adunăm cu evlavie la Sfânta Liturghie și la toate rânduielile Bisericii, căutând întărirea sufletelor și luminarea vieții noastre în Hristos.',
            },
            {
              Icon: HandsHeartIcon,
              title: 'Milostenie și grijă',
              text:
                'Ne străduim să fim aproape de cei în suferință – bolnavi, bătrâni, copii lipsiți – cu ce putem, din dragoste pentru Dumnezeu și pentru aproapele.',
            },
            {
              Icon: PrayingHandsIcon,
              title: 'Rugăciune împreună',
              text:
                'Rugăciunea este temelia parohiei noastre. Ne unim inimile înaintea Domnului, în unitate și pace, cu nădejde că El primește și osteneala, și tăcerea.',
            },
          ].map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.1}>
              <Card className="h-full p-6 sm:p-8 bg-cream text-center ornament-frame">
                <div className="mx-auto flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-br from-burgundy to-burgundy-dark text-cream mb-4 sm:mb-5 shadow-candlelight candlelight-halo">
                  <p.Icon size={38} />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-burgundy">{p.title}</h3>
                <p className="text-ink-muted leading-relaxed font-serif text-[15px] sm:text-base">{p.text}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ============= 8. VIDEO YOUTUBE ============= */}
      <section
        className="relative py-14 sm:py-20 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(19, 31, 51, 0.7), rgba(19, 31, 51, 0.85)), url(${IMG.videoSectionBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="container max-w-3xl text-center">
          <FadeIn>
            <p className="font-ceremonial uppercase tracking-[0.22em] text-sm text-gold mb-4">
              Împreună întru Hristos, dincolo de ziduri
            </p>
            <h2 className="font-display text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-5 !text-white">
              Mărturisirea credinței prin <em className="italic text-gold">rugăciune și cuvânt</em>
            </h2>
            <p className="text-white/90 mb-8 leading-relaxed text-[17px]">
              Cu ajutorul lui Dumnezeu, slujbele săvârșite în parohia noastră, împreună cu cuvinte de
              folos, momente duhovnicești și clipe de bucurie creștină, pot fi urmărite și pe canalul
              nostru de YouTube.
            </p>
            <a
              href="https://www.youtube.com/watch?v=w03-ddqY-AE"
              target="_blank"
              rel="noopener"
              className="inline-flex flex-col items-center gap-4 group"
              aria-label="Vezi pe YouTube"
            >
              <span className="relative flex items-center justify-center">
                <span className="absolute h-32 w-32 rounded-full bg-gold/30 animate-ping" />
                <span className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark text-burgundy-dark shadow-candlelight transition-transform group-hover:scale-110">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
              <span className="font-ceremonial uppercase text-xs tracking-[0.28em] text-gold">
                Vezi pe YouTube
              </span>
            </a>
          </FadeIn>
        </div>
      </section>

      <SectionRibbon />

      {/* ============= 8b. SCHEȚE / VIAȚA PAROHIEI – cards with Orthodox motifs ============= */}
      <section className="container py-10 sm:py-16 lg:py-20">
        <FadeIn>
          <div className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto">
            <SectionEyebrow align="center">Viața parohiei în chipuri</SectionEyebrow>
            <h2 className="font-display text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              Pași spre <em className="italic text-burgundy">Hristos</em>
            </h2>
            <p className="text-ink-muted mt-4 text-[17px]">
              Sfintele Liturghii, icoanele, lumânările aprinse și clipele de pelerinaj sunt firele
              vii ale comunității noastre.
            </p>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              img: IMG.liturghie,
              Icon: ChurchIcon,
              eyebrow: 'Sfânta Liturghie',
              title: 'Slujbe vii',
              text: 'Liturghie, vecernii și paraclise în rânduiala bisericească.',
            },
            {
              img: IMG.iconTeodora,
              Icon: MandorlaIcon,
              eyebrow: 'Icoane',
              title: 'Acoperământul sfinților',
              text: 'Sub ocrotirea Sfintei Cuvioase Teodora de la Sihla.',
            },
            {
              img: IMG.handsBranch,
              Icon: CandleIcon,
              eyebrow: 'Lumânări',
              title: 'Pomelnice și sfeștanii',
              text: 'Pomeniri la Sfânta Liturghie pentru cei vii și adormiți.',
            },
            {
              img: IMG.handsChurch,
              Icon: CenserIcon,
              eyebrow: 'Pelerinaje',
              title: 'Drumuri spre lumină',
              text: 'Drumuri la mănăstiri și întâlniri duhovnicești.',
            },
          ].map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.08}>
              <article
                className="relative h-full rounded-[22px] overflow-hidden group transition-all duration-300 hover:-translate-y-1.5 shadow-[0_18px_40px_-22px_rgba(101,26,20,0.4)] hover:shadow-[0_24px_50px_-22px_rgba(101,26,20,0.55)]"
                style={{
                  background: 'linear-gradient(180deg, #FBF6EE 0%, #F5EBD7 100%)',
                }}
              >
                {/* Double inner border */}
                <div className="absolute inset-2 rounded-[16px] border border-gold/55 pointer-events-none z-10" />
                <div className="absolute inset-3 rounded-[13px] border border-burgundy/20 pointer-events-none z-10" />

                {/* Image with Byzantine arched bottom */}
                <div className="relative m-3 mb-0 aspect-square overflow-hidden"
                  style={{
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',
                    borderBottomLeftRadius: '50% 28%',
                    borderBottomRightRadius: '50% 28%',
                  }}
                >
                  <img
                    src={s.img}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/55 via-transparent to-transparent" />
                </div>

                {/* Floating icon medallion */}
                <div className="relative -mt-7 flex justify-center z-20">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full text-cream shadow-[0_8px_18px_-6px_rgba(101,26,20,0.65)] ring-2 ring-gold/70"
                    style={{
                      background: 'linear-gradient(180deg, #7a201a 0%, #4f120d 100%)',
                    }}
                  >
                    <s.Icon size={26} />
                  </div>
                </div>

                <div className="relative px-5 pt-3 pb-6 text-center">
                  <p className="font-ceremonial uppercase text-[10px] tracking-[0.22em] text-gold-dark mb-2 flex items-center justify-center gap-2">
                    <span className="h-px w-4 bg-gold/70" />
                    {s.eyebrow}
                    <span className="h-px w-4 bg-gold/70" />
                  </p>
                  <h3 className="font-display text-lg text-burgundy-dark mb-2 leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-sm text-burgundy/70 leading-relaxed font-serif italic">{s.text}</p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ============= 8c. GALERIE VIDEO + FOTO ============= */}
      {(galleryImages.length >= 3 || VIDEOS.length > 0) && (
        <>
          <SectionRibbon />
          <section className="container py-10 sm:py-16 lg:py-20">
            <FadeIn>
              <div className="text-center mb-10 max-w-3xl mx-auto">
                <SectionEyebrow align="center">Galerie</SectionEyebrow>
                <h2 className="font-display text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                  Clipe din <em className="italic text-burgundy">viața parohiei</em>
                </h2>
                <p className="text-ink-muted mt-4 font-serif italic">
                  Vezi imagini și momente filmate din comunitatea noastră.
                </p>
              </div>
            </FadeIn>

            {VIDEOS.length > 0 && (
              <FadeIn delay={0.05} className="mb-14">
                <VideoGallery videos={VIDEOS} />
              </FadeIn>
            )}

            {galleryImages.length >= 3 && (
              <FadeIn delay={0.1}>
                <div className="text-center mb-8">
                  <p className="font-ceremonial uppercase text-[11px] tracking-[0.28em] text-gold-dark flex items-center justify-center gap-3">
                    <span className="h-px w-8 bg-gold/70" />
                    <span className="text-burgundy/80">☩</span>
                    Galerie foto
                    <span className="text-burgundy/80">☩</span>
                    <span className="h-px w-8 bg-gold/70" />
                  </p>
                </div>
                <PhotoGallery images={galleryImages} />
              </FadeIn>
            )}
          </section>
        </>
      )}

      {/* ============= 9. TESTIMONIALE ============= */}
      <section className="bg-lavender-soft/50 py-10 sm:py-16 lg:py-20">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <SectionEyebrow align="center">
                Milostenia zidește și suflete, nu doar ziduri
              </SectionEyebrow>
              <h2 className="font-display text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                Mărturii ale <em className="italic text-burgundy">comunității</em>
              </h2>
              <p className="font-serif italic text-ink-muted mt-3">
                Glasul celor ce zidesc împreună, despre credință, rugăciune și nădejde.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Testimonials items={TESTIMONIALS} />
          </FadeIn>
        </div>
      </section>

      <SectionRibbon />

      {/* ============= 10. FII ALĂTURI DE PAROHIE – 4 IMG GRID + 3 ICON BOXES ============= */}
      <section className="container py-10 sm:py-16 lg:py-20">
        <FadeIn>
          <div className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto">
            <SectionEyebrow align="center">Sprijină lucrarea parohiei</SectionEyebrow>
            <h2 className="font-display text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              Fii alături de parohie cu <em className="italic text-burgundy">rugăciunea și darul</em>
            </h2>
            <p className="text-ink-muted mt-5 text-[17px] max-w-2xl mx-auto">
              Parohia „Sfânta Cuvioasă Teodora de la Sihla" se zidește cu nădejde – în piatră și în
              suflete. Orice jertfă adusă, fie prin donații, redirecționarea impozitului sau
              voluntariat, devine parte din această lucrare binecuvântată.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              Icon: GospelIcon,
              title: 'Redirecționează din impozit',
              text:
                'Persoanele fizice (3,5%) și firmele (20%) pot susține parohia fără cost. Un gest simplu, dar care zidește.',
              href: '/redirectioneaza-3-5',
              cta: 'Vezi cum',
            },
            {
              Icon: HandsHeartIcon,
              title: 'Dăruiește pentru comunitate',
              text:
                'Prin darul tău, biserica prinde viață, iar cei aflați în nevoi simt mâna lui Dumnezeu.',
              href: '/donations/strangere-de-fonduri-pentru-construirea-bisericii',
              cta: 'Dăruiește acum',
              highlight: true,
            },
            {
              Icon: KandilaIcon,
              title: 'Fii alături ca voluntar',
              text:
                'Biserica are nevoie de oameni, nu doar de bani. Prezența ta contează în orice formă.',
              href: '/contact',
              cta: 'Mă alătur',
            },
          ].map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.1}>
              <Link
                href={p.href}
                className="group relative block h-full rounded-[22px] overflow-hidden p-7 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1.5 shadow-[0_18px_40px_-22px_rgba(101,26,20,0.4)] hover:shadow-[0_26px_55px_-22px_rgba(101,26,20,0.6)]"
                style={{
                  background: p.highlight
                    ? 'linear-gradient(180deg, #7a201a 0%, #4f120d 100%)'
                    : 'linear-gradient(180deg, #FBF6EE 0%, #F5EBD7 100%)',
                }}
              >
                {/* Double inner border */}
                <div
                  className={`absolute inset-2 rounded-[16px] border pointer-events-none ${
                    p.highlight ? 'border-gold/45' : 'border-gold/60'
                  }`}
                />
                <div
                  className={`absolute inset-3 rounded-[13px] border pointer-events-none ${
                    p.highlight ? 'border-gold/20' : 'border-burgundy/22'
                  }`}
                />

                <div
                  className={`relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ring-2 transition-transform group-hover:scale-105 ${
                    p.highlight
                      ? 'bg-cream text-burgundy-dark ring-gold/70 shadow-[0_8px_18px_-6px_rgba(0,0,0,0.4)]'
                      : 'text-cream ring-gold/70 shadow-[0_8px_18px_-6px_rgba(101,26,20,0.55)]'
                  }`}
                  style={
                    p.highlight
                      ? undefined
                      : { background: 'linear-gradient(180deg, #7a201a 0%, #4f120d 100%)' }
                  }
                >
                  <p.Icon size={30} />
                </div>

                <h3
                  className={`relative font-display text-xl mb-3 leading-tight ${
                    p.highlight ? 'text-cream' : 'text-burgundy-dark'
                  }`}
                >
                  {p.title}
                </h3>
                <p
                  className={`relative text-[14px] leading-relaxed font-serif italic mb-5 ${
                    p.highlight ? 'text-cream/85' : 'text-burgundy/75'
                  }`}
                >
                  {p.text}
                </p>

                <p
                  className={`relative font-ceremonial uppercase text-[11px] tracking-[0.22em] inline-flex items-center gap-2 transition-colors ${
                    p.highlight ? 'text-gold' : 'text-burgundy-dark group-hover:text-burgundy'
                  }`}
                >
                  {p.cta}
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ============= 11. BLOG NOUTĂȚI ============= */}
      <section className="relative bg-parchment py-12 sm:py-20">
        <div className="container">
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
              <div>
                <SectionEyebrow>
                  Articole duhovnicești, vești din parohie și cuvinte de folos
                </SectionEyebrow>
                <h2 className="font-display text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                  Noutăți din viața parohiei <br />
                  și <em className="italic text-burgundy">gânduri pentru suflet</em>
                </h2>
              </div>
              <Link href="/blog">
                <Button variant="default" size="lg">
                  Citește toate articolele
                </Button>
              </Link>
            </div>
          </FadeIn>

          {posts.length === 0 ? (
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-4 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {PLACEHOLDER_POSTS.slice(0, 3).map((p, i) => (
                <div key={p.slug} className="snap-start shrink-0 w-[80%] sm:w-auto">
                  <FadeIn delay={i * 0.05}>
                    <PostCard
                      slug={p.slug}
                      title={p.title}
                      excerpt={p.excerpt}
                      publishedAt={p.publishedAt}
                      featuredUrl={p.featuredUrl}
                      featuredAlt={p.title}
                      categories={[{ name: p.category, slug: p.category.toLowerCase() }]}
                    />
                  </FadeIn>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-4 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {posts.slice(0, 3).map((p, i) => (
                <div key={p.id} className="snap-start shrink-0 w-[80%] sm:w-auto">
                  <FadeIn delay={i * 0.05}>
                    <PostCard
                      slug={p.slug}
                      title={p.title}
                      excerpt={p.excerpt}
                      publishedAt={p.publishedAt}
                      featuredUrl={p.featured?.url}
                      featuredAlt={p.featured?.alt}
                      categories={p.categories}
                    />
                  </FadeIn>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============= 12. NEWSLETTER ============= */}
      <section
        className="relative py-16 sm:py-24 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 6, 4, 0.85), rgba(26, 6, 4, 0.92)), url(${IMG.newsletterBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative container max-w-2xl">
          <FadeIn>
            <div className="relative mx-auto pt-12">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_4px_14px_rgba(0,0,0,0.5)]">
                <OrthodoxCross height={64} />
              </div>
              <div
                className="relative rounded-[28px] px-6 pt-10 pb-9 sm:px-12 sm:pt-12 sm:pb-12 text-center shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #FBF6EE 0%, #F5EBD7 55%, #EFE0C0 100%)',
                }}
              >
                <div
                  className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.38 0 0 0 0 0.18 0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                  }}
                />
                <div className="absolute inset-2 rounded-[22px] border border-gold/60 pointer-events-none" />
                <div className="absolute inset-3 rounded-[19px] border border-burgundy/25 pointer-events-none" />

                <div className="relative">
                  <p className="font-ceremonial uppercase tracking-[0.32em] text-[11px] text-gold-dark mb-3 flex items-center justify-center gap-3">
                    <span className="h-px w-8 bg-gold/70" />
                    Foaia parohiei
                    <span className="h-px w-8 bg-gold/70" />
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl leading-tight mb-5 text-burgundy-dark">
                    Rămâi aproape de viața parohiei
                  </h2>
                  <p className="font-serif italic text-burgundy/75 mb-7 max-w-md mx-auto">
                    Primește în căsuța ta vești despre slujbe, pomelnice și cuvinte de folos de la
                    părintele paroh.
                  </p>

                  <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-7 text-sm text-burgundy-dark/80">
                    <li className="flex items-center gap-2">
                      <span className="text-gold">☩</span> Pomelnice
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold">☩</span> Programul slujbelor
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold">☩</span> Cuvinte de la părinte
                    </li>
                  </ul>

                  <NewsletterForm />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
