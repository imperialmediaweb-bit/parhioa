import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getImages } from '@/lib/images';
import { HeroSlider, type HeroSlide } from '@/components/site/hero-slider';
import { PostCard } from '@/components/site/post-card';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { Testimonials, type Testimonial } from '@/components/site/testimonials';
import { VideoSection } from '@/components/site/video-section';
import { CrossDivider, OrthodoxCross } from '@/components/site/cross-divider';
import { NumberTicker } from '@/components/magicui/number-ticker';
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
import { BorderBeam } from '@/components/magicui/border-beam';
import { FadeIn } from '@/components/magicui/fade-in';
import { Percent, Users, BookOpen, HandHeart } from 'lucide-react';

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
    const posts = await prisma.post
      .findMany({
        where: { status: 'publish' },
        take: 6,
        orderBy: { publishedAt: 'desc' },
        include: { featured: true, categories: true },
      })
      .catch(() => []);
    return { posts };
  } catch {
    return { posts: [] };
  }
}

export default async function HomePage() {
  const [{ posts }, IMG] = await Promise.all([getHomeData(), getImages()]);

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

      {/* ============= 2. STICKY SUB-NAV ============= */}
      <nav className="border-y border-border bg-white sticky top-24 sm:top-28 lg:top-32 z-30">
        <div className="container flex items-center justify-center gap-4 sm:gap-8 lg:gap-12 py-3 sm:py-4 text-sm overflow-x-auto">
          <a
            href="#parohul"
            className="flex items-center gap-2 text-ink hover:text-burgundy transition whitespace-nowrap"
          >
            <span className="font-display text-base">→</span>
            <span>Parohul bisericii</span>
          </a>
          <a
            href="#despre-parohia"
            className="flex items-center gap-2 text-ink hover:text-burgundy transition whitespace-nowrap"
          >
            <span className="font-display text-base">→</span>
            <span>Despre</span>
          </a>
          <a
            href="#daruieste"
            className="flex items-center gap-2 text-ink hover:text-burgundy transition whitespace-nowrap"
          >
            <span className="font-display text-base">→</span>
            <span>Dăruiește pentru zidire</span>
          </a>
        </div>
      </nav>

      {/* ============= 3. PĂRINTELE CĂTĂLIN AILENEI ============= */}
      <section id="parohul" className="container py-12 sm:py-20 scroll-mt-44">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center max-w-5xl mx-auto">
          <FadeIn className="lg:col-span-2">
            <div className="relative aspect-[4/5] max-w-[380px] mx-auto rounded-3xl overflow-hidden shadow-warm-lg bg-cream-card">
              <img
                src={IMG.priestPortrait}
                alt="Părintele Cătălin Ailenei"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.15} className="lg:col-span-3">
            <SectionEyebrow>Părintele paroh</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-5">
              Părintele Cătălin Ailenei – <em className="italic text-burgundy">păstor cu inimă de rugăciune</em>
            </h2>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-4">
              Cu blândețe și râvnă, părintele Cătălin Ailenei veghează asupra obștii încredințate,
              purtând în rugăciune și jertfelnicie sufletele celor ce se adună sub acoperământul
              Sfintei Cuvioase Teodora de la Sihla.
            </p>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-6">
              În vremea în care sfânta biserică se zidește cu trudă, piatra cea vie se așază mai
              întâi în inimile credincioșilor, prin harul slujirii și al cuvântului duhovnicesc.
            </p>
            <Link href="/despre">
              <Button size="lg">Despre părintele paroh</Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ============= 4. IMPLICĂ-TE + DEVINO CTITOR CARD ============= */}
      <section className="relative bg-cream bg-byzantine-pattern py-12 sm:py-20">
        <div className="container">
          <CrossDivider className="mb-8" />
          <FadeIn>
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <SectionEyebrow align="center">
                Milostenia zidește și suflete, nu doar ziduri
              </SectionEyebrow>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
                Implică-te în lucrarea parohiei <br className="hidden sm:inline" />
                și sprijinirea celor în <em className="italic text-burgundy">suferință</em>
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="max-w-sm mx-auto">
              <Link href="/donations/strangere-de-fonduri-pentru-construirea-bisericii">
                <Card className="overflow-hidden bg-white border-0 hover:shadow-warm-xl transition-shadow cursor-pointer group">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={IMG.campaignPoster}
                      alt="Devino ctitor — campania de zidire"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl font-semibold text-burgundy mb-2">
                      Strângere de fonduri pentru construirea bisericii
                    </h3>
                    <p className="font-serif italic text-sm text-ink-muted">
                      📜 „Nu zidurile fac Biserica, ci credința; dar fără ziduri, credința nu are unde…"
                    </p>
                  </div>
                </Card>
              </Link>
              <div className="text-center mt-6">
                <Link href="/campanii">
                  <Button variant="default" size="lg">Campaniile parohiei</Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============= 5. SUB OCROTIREA SF. CUVIOASE TEODORA ============= */}
      <section id="despre-parohia" className="container py-12 sm:py-20 scroll-mt-44">
        <CrossDivider className="mb-12" />
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center max-w-5xl mx-auto">
          <FadeIn delay={0.15} className="lg:col-span-2 lg:order-2">
            <div className="relative aspect-square max-w-[380px] mx-auto rounded-3xl overflow-hidden shadow-warm-lg bg-cream p-3">
              <img
                src={IMG.parishIcon}
                alt="Sfânta Cuvioasă Teodora de la Sihla"
                className="absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] object-contain"
              />
            </div>
          </FadeIn>
          <FadeIn className="lg:col-span-3 lg:order-1">
            <SectionEyebrow>Ocrotitoarea parohiei</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-5">
              Sub ocrotirea <em className="italic text-burgundy">Sfintei Cuvioase Teodora</em> de la Sihla
            </h2>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-4">
              Parohia noastră din Botoșani se află sub binecuvântata ocrotire a Sfintei Cuvioase
              Teodora de la Sihla, floare aleasă a pustiei și rugătoare neîncetată înaintea lui
              Hristos. Viața ei, petrecută în post și lacrimi, în adâncul pădurilor Neamțului, este
              pentru noi pildă de răbdare, smerenie și statornicie în credință.
            </p>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-6">
              Ne dorim ca, urmându-i pașii, să zidim în sufletele noastre altar viu al rugăciunii,
              unde harul lui Dumnezeu să odihnească peste comunitatea noastră.
            </p>
            <Link href="/misiune">
              <Button size="lg">Misiune</Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ============= 6. FII CTITOR AL UNEI LUCRĂRI SFINTE ============= */}
      <section id="daruieste" className="relative iconostasis py-12 sm:py-20 scroll-mt-44">
        <div className="container">
          <CrossDivider className="mb-8" />
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center max-w-5xl mx-auto">
            <FadeIn className="lg:col-span-2">
              <div className="relative mx-auto max-w-[400px] pt-12">
                {/* Floating Orthodox cross above the frame */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_4px_14px_rgba(129,35,27,0.35)]">
                  <OrthodoxCross height={64} />
                </div>

                {/* Parchment frame */}
                <div
                  className="relative rounded-[28px] px-5 pt-6 pb-5 shadow-warm-lg overflow-hidden"
                  style={{
                    background:
                      'linear-gradient(180deg, #FBF6EE 0%, #F5EBD7 55%, #EFE0C0 100%)',
                  }}
                >
                  {/* Subtle parchment grain */}
                  <div
                    className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.38 0 0 0 0 0.18 0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                    }}
                  />

                  {/* Double gold/burgundy inner border */}
                  <div className="absolute inset-2 rounded-[22px] border border-gold/60 pointer-events-none" />
                  <div className="absolute inset-3 rounded-[19px] border border-burgundy/25 pointer-events-none" />

                  {/* Gold corner ornaments */}
                  {([
                    'top-2 left-2 rotate-0',
                    'top-2 right-2 rotate-90',
                    'bottom-2 right-2 rotate-180',
                    'bottom-2 left-2 -rotate-90',
                  ] as const).map((pos) => (
                    <svg
                      key={pos}
                      viewBox="0 0 24 24"
                      className={`absolute ${pos} h-5 w-5 text-gold pointer-events-none`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      aria-hidden
                    >
                      <path d="M2 10 V4 H10" />
                      <circle cx="4" cy="4" r="0.8" fill="currentColor" />
                    </svg>
                  ))}

                  {/* Photo with Byzantine arched top */}
                  <div
                    className="relative aspect-[4/5] overflow-hidden bg-burgundy/5"
                    style={{
                      borderTopLeftRadius: '50% 18%',
                      borderTopRightRadius: '50% 18%',
                      borderBottomLeftRadius: '10px',
                      borderBottomRightRadius: '10px',
                    }}
                  >
                    <img
                      src={IMG.ctitorPhoto}
                      alt="Comunitatea parohiei adunată în rugăciune"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Subtle inner vignette */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        boxShadow: 'inset 0 0 60px 6px rgba(61,15,10,0.45)',
                      }}
                    />
                  </div>

                  {/* Inscribed caption */}
                  <div className="relative mt-4 flex items-center justify-center gap-3">
                    <span className="h-px w-8 bg-gold/70" />
                    <span className="text-gold text-base leading-none">☩</span>
                    <p className="font-ceremonial uppercase text-[11px] sm:text-xs tracking-[0.28em] text-burgundy">
                      Comunitatea parohiei
                    </p>
                    <span className="text-gold text-base leading-none">☩</span>
                    <span className="h-px w-8 bg-gold/70" />
                  </div>
                </div>

                <BorderBeam size={300} duration={14} colorFrom="#EAC784" colorTo="#81231B" />
              </div>
            </FadeIn>
            <FadeIn delay={0.15} className="lg:col-span-3">
              <SectionEyebrow>Devino ctitor</SectionEyebrow>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-5">
                Fii ctitor al unei <em className="italic text-burgundy">lucrări sfinte</em>
              </h2>
              <blockquote className="border-l-4 border-burgundy pl-4 my-5 italic text-ink-muted">
                „Unde sunt doi sau trei adunați în Numele Meu, acolo sunt și Eu în mijlocul lor."{' '}
                <span className="block text-sm not-italic mt-1 text-burgundy">(Matei 18, 20)</span>
              </blockquote>
              <p className="text-ink-muted leading-relaxed text-[17px] mb-4">
                <strong className="text-ink">Sub ocrotirea Sfintei Cuvioase Teodora de la Sihla,</strong>{' '}
                zidim cu credință o biserică pentru sufletele care caută mângâiere, luminare și întâlnire
                cu Dumnezeu.
              </p>
              <p className="text-ink-muted leading-relaxed text-[17px] mb-4">
                Fiecare dar adus cu inimă curată devine o cărămidă vie în acest lăcaș al harului.
              </p>
              <p className="text-ink-muted leading-relaxed text-[17px] mb-6">
                Alătură-te acestei lucrări binecuvântate, pentru ca împreună să ridicăm un loc unde
                rugăciunea să ardă neîncetat și unde fiecare suflet să afle pace și întărire.
              </p>
              <Link href="/donations/strangere-de-fonduri-pentru-construirea-bisericii">
                <Button size="lg">Ajută la zidire</Button>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============= 7. 3 STÂLPI – MISIUNEA PAROHIEI ============= */}
      <section className="container py-12 sm:py-20">
        <CrossDivider className="mb-10" />
        <FadeIn>
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <SectionEyebrow align="center">
              Misiunea parohiei „Sfânta Cuvioasă Teodora de la Sihla"
            </SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
              Zidim credința, slujim cu <em className="italic text-burgundy">dragoste</em>, trăim în rugăciune
            </h2>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Card className="h-full p-8 bg-cream text-center ornament-frame">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-burgundy to-burgundy-dark text-cream mb-5 shadow-candlelight candlelight-halo">
                  <p.Icon size={44} />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-3 text-burgundy">{p.title}</h3>
                <p className="text-ink-muted leading-relaxed font-serif">{p.text}</p>
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
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-5 !text-white">
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

      {/* ============= 8b. SCHEȚE / VIAȚA PAROHIEI – cards with Orthodox motifs ============= */}
      <section className="container py-12 sm:py-20">
        <FadeIn>
          <CrossDivider size="lg" className="mb-10" />
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <SectionEyebrow align="center">Viața parohiei în chipuri</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
              Pași spre <em className="italic text-burgundy">Hristos</em>
            </h2>
            <p className="text-ink-muted mt-4 text-[17px]">
              Sfintele Liturghii, icoanele, lumânările aprinse și clipele de pelerinaj sunt firele
              vii ale comunității noastre.
            </p>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
              text: 'Drumuri la mănăstiri, întâlniri duhovnicești și clipe de bucurie creștină.',
            },
          ].map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.08}>
              <Card className="h-full overflow-hidden bg-cream group transition-all duration-300 hover:-translate-y-1 hover:shadow-warm-lg">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/65 via-burgundy-dark/15 to-transparent" />
                  <div className="absolute top-3 left-3 flex h-12 w-12 items-center justify-center rounded-full bg-cream text-burgundy border-2 border-gold/60 shadow-warm-md">
                    <s.Icon size={24} />
                  </div>
                </div>
                <div className="p-5 border-t border-gold/30">
                  <p className="font-ceremonial uppercase text-[11px] tracking-[0.18em] text-burgundy mb-2 flex items-center gap-2">
                    <span className="h-px w-3 bg-gold-dark" /> {s.eyebrow}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-navy mb-2 leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed font-serif">{s.text}</p>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ============= 9. TESTIMONIALE ============= */}
      <section className="bg-lavender-soft/50 py-12 sm:py-20">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <SectionEyebrow align="center">
                Milostenia zidește și suflete, nu doar ziduri
              </SectionEyebrow>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
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

      {/* ============= 10. FII ALĂTURI DE PAROHIE – 4 IMG GRID + 3 ICON BOXES ============= */}
      <section className="container py-12 sm:py-20">
        <CrossDivider className="mb-10" />
        <FadeIn>
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <SectionEyebrow align="center">Sprijină lucrarea parohiei</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
              Fii alături de parohie cu <em className="italic text-burgundy">rugăciunea și darul</em>
            </h2>
            <p className="text-ink-muted mt-5 text-[17px] max-w-2xl mx-auto">
              Parohia „Sfânta Cuvioasă Teodora de la Sihla" se zidește cu nădejde – în piatră și în
              suflete. Orice jertfă adusă, fie prin donații, redirecționarea impozitului sau
              voluntariat, devine parte din această lucrare binecuvântată.
            </p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: 4 icon images in a 2x2 grid (hidden on tablet) */}
          <FadeIn delay={0.1} className="hidden lg:grid lg:col-span-5 grid-cols-2 gap-3">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
              <img src={IMG.iconBox1} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg mt-12">
              <img src={IMG.iconBox2} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
              <img src={IMG.iconBox3} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg mt-12">
              <img src={IMG.iconBox4} alt="" className="w-full h-full object-cover" />
            </div>
          </FadeIn>

          {/* Right: 3 icon boxes with descriptions */}
          <div className="lg:col-span-7 space-y-5">
            {[
              {
                Icon: GospelIcon,
                title: 'Redirecționează din impozit',
                text:
                  'Atât persoanele fizice (3,5%) cât și firmele (20% din impozitul pe profit sau venit) pot susține parohia fără costuri suplimentare. Sprijină zidirea bisericii printr-un gest simplu.',
                href: '/redirectioneaza-3-5',
                cta: 'Vezi cum',
              },
              {
                Icon: HandsHeartIcon,
                title: 'Dăruiește cu inimă',
                text:
                  'Prin darul tău, biserica prinde viață, iar cei aflați în nevoi simt mâna lui Dumnezeu. Dăruiește cu credință și nădejde.',
                href: '/donations/strangere-de-fonduri-pentru-construirea-bisericii',
                cta: 'Donează',
              },
              {
                Icon: KandilaIcon,
                title: 'Implică-te ca voluntar',
                text:
                  'Biserica are nevoie și de oameni, nu doar de bani. Fie că ajuți la curățenie, organizare sau distribuirea unor ajutoare, prezența ta contează.',
                href: '/contact',
                cta: 'Mă alătur',
              },
            ].map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.1}>
                <div className="flex gap-4 sm:gap-5 p-5 rounded-2xl bg-cream border border-gold/30 shadow-warm hover:shadow-warm-md transition-shadow">
                  <div className="flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-burgundy to-burgundy-dark text-cream shadow-candlelight">
                    <p.Icon size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold text-burgundy mb-1.5">
                      {p.title}
                    </h3>
                    <p className="text-sm text-ink-muted leading-relaxed mb-2 font-serif">
                      {p.text}
                    </p>
                    <Link
                      href={p.href}
                      className="text-sm font-semibold text-burgundy hover:text-burgundy-dark inline-flex items-center gap-1"
                    >
                      {p.cta} →
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
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
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
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
            <p className="text-center text-ink-muted">
              Rulează scriptul de import:{' '}
              <code className="bg-cream-card px-2 py-0.5 rounded">npm run import:wp</code>
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(0, 3).map((p, i) => (
                <FadeIn key={p.id} delay={i * 0.05}>
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============= 12. NEWSLETTER ============= */}
      <section
        className="relative py-14 sm:py-20 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(19, 31, 51, 0.75), rgba(19, 31, 51, 0.85)), url(${IMG.newsletterBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container max-w-2xl text-center">
          <FadeIn>
            <BookOpen className="h-10 w-10 text-gold mx-auto mb-4" />
            <p className="font-ceremonial uppercase tracking-[0.22em] text-sm text-gold mb-4">
              Rămâi aproape de viața parohiei
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-6 !text-white">
              Primește vești, rugăciuni și cuvinte de folos <br />
              în <em className="italic text-gold">căsuța ta de e-mail</em>
            </h2>

            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8 text-sm text-cream/85">
              <li className="flex items-center gap-2">
                <span className="text-gold text-base">☩</span> Pomelnice și pomeniri
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold text-base">☩</span> Programul slujbelor
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold text-base">☩</span> Cuvinte de la părintele paroh
              </li>
            </ul>

            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="adresa.ta@email.ro"
                className="flex-1 px-5 py-3.5 rounded-full bg-white/12 border border-gold/40 backdrop-blur text-white placeholder:text-white/55 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <Button type="submit" variant="gold" size="lg">
                Abonează-mă
              </Button>
            </form>
            <p className="text-xs text-cream/55 mt-4 italic">
              Niciun spam. Doar gânduri bune. Te poți dezabona oricând.
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
