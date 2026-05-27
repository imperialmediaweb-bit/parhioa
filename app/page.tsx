import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { HeroSlider, type HeroSlide } from '@/components/site/hero-slider';
import { PostCard } from '@/components/site/post-card';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { Testimonials, type Testimonial } from '@/components/site/testimonials';
import { PhotoGallery, type GalleryImage } from '@/components/site/photo-gallery';
import { VideoSection } from '@/components/site/video-section';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BorderBeam } from '@/components/magicui/border-beam';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text';
import { FadeIn } from '@/components/magicui/fade-in';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { Heart, HandHeart, Users, Church, BookOpen, Sparkles } from 'lucide-react';

export const revalidate = 60;

// =====================================================================
//  Hero slides — first one is a video, the rest are images.
//  Replace media.src with your real assets (public/hero/* or Cloudinary).
// =====================================================================
const HERO_SLIDES: HeroSlide[] = [
  {
    media: {
      type: 'video',
      src: '/hero/intro.mp4',
      poster:
        'https://images.unsplash.com/photo-1548407260-da850faa41e3?auto=format&fit=crop&w=2000&q=80',
    },
    eyebrow: 'Parohia Sf. Cuv. Teodora de la Sihla · Botoșani',
    title: <>Într-o inimă, o credință, o familie duhovnicească</>,
    subtitle:
      'Vino să te rogi cu noi, să te împărtășești din harul lui Dumnezeu și să fii parte dintr-o comunitate vie.',
    primaryCta: { label: 'Implică-te', href: '/misiune' },
    secondaryCta: { label: 'Despre noi', href: '/despre' },
  },
  {
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1548407260-da850faa41e3?auto=format&fit=crop&w=2000&q=80',
      alt: 'Lumânări aprinse',
    },
    eyebrow: 'Zidirea bisericii',
    title: <>Zidim cu credință, <em className="font-serif italic">cărămidă cu cărămidă</em></>,
    subtitle:
      'Parohia noastră nu are încă un lăcaș de închinare. Cu ajutorul tău, putem pune piatra de temelie.',
    primaryCta: { label: 'Devino ctitor', href: '/campanii' },
    secondaryCta: { label: 'Redirecționează 3,5%', href: '/redirectioneaza-3-5' },
  },
  {
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1601925268875-c5b0c5e3a1bc?auto=format&fit=crop&w=2000&q=80',
      alt: 'Biserica ortodoxă',
    },
    eyebrow: 'Rugăciune · Milostenie · Iubire',
    title: <>Zidim credința, slujim cu dragoste</>,
    subtitle:
      'Trei stâlpi care țin viața parohiei și prin care creștem împreună întru Hristos.',
    primaryCta: { label: 'Vezi misiunea', href: '/misiune' },
  },
];

// =====================================================================
//  Real testimonials extracted from the live site
// =====================================================================
const TESTIMONIALS: Testimonial[] = [
  {
    text:
      'Parohia «Sfânta Cuvioasă Teodora de la Sihla» e un început frumos și binecuvântat. Părintele Cătălin Ailenei este aproape de oameni, iar ceea ce se zidește aici se simte din suflet. Mă bucur să fac parte din această comunitate.',
    author: 'Maria',
    role: 'Credincioasă',
  },
  {
    text:
      'Se zidește cu răbdare și credință, iar părintele Cătălin este mereu alături, cu inimă bună și grijă pentru fiecare. Lucrurile cresc frumos, pas cu pas.',
    author: 'Andrei',
    role: 'Voluntar',
  },
  {
    text:
      'Am simțit căldură și liniște încă de la prima slujbă. Aici nu te simți străin — ești primit ca-n familia ta duhovnicească.',
    author: 'Elena',
    role: 'Enoriaș',
  },
];

// =====================================================================
//  Gallery — replace with your real images (Cloudinary URLs after import)
// =====================================================================
const GALLERY: GalleryImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1548407260-da850faa41e3?auto=format&fit=crop&w=900&q=80',
    alt: 'Lumânări',
    caption: 'Slujbă de seară',
  },
  {
    src: 'https://images.unsplash.com/photo-1601925268875-c5b0c5e3a1bc?auto=format&fit=crop&w=900&q=80',
    alt: 'Biserica',
    caption: 'Locul viitoarei biserici',
  },
  {
    src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
    alt: 'Iconă',
    caption: 'Sfânta Liturghie',
  },
  {
    src: 'https://images.unsplash.com/photo-1543525238-7f7c0adbd1c0?auto=format&fit=crop&w=900&q=80',
    alt: 'Cruce',
    caption: 'Troița credinței',
  },
  {
    src: 'https://images.unsplash.com/photo-1490127252417-7c393f993ee4?auto=format&fit=crop&w=900&q=80',
    alt: 'Rugăciune',
    caption: 'Părintele Cătălin Ailenei',
  },
  {
    src: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=900&q=80',
    alt: 'Lumini',
    caption: 'Bucurie creștină',
  },
];

async function getData() {
  try {
    const [home, posts] = await Promise.all([
      prisma.page.findUnique({ where: { slug: 'acasa' }, include: { featured: true } }).catch(() => null),
      prisma.post.findMany({
        where: { status: 'publish' },
        take: 6,
        orderBy: { publishedAt: 'desc' },
        include: { featured: true, categories: true },
      }).catch(() => []),
    ]);
    return { home, posts };
  } catch {
    return { home: null, posts: [] };
  }
}

export default async function HomePage() {
  const { posts } = await getData();

  return (
    <>
      {/* ===== 1. HERO SLIDER (video + 2 images) ===== */}
      <HeroSlider slides={HERO_SLIDES} />

      {/* ===== 2. ABOUT THE PRIEST — INTRO ===== */}
      <section className="container py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeIn>
            <SectionEyebrow>Implică-te în lucrarea parohiei</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-5">
              Mărturisirea credinței prin <em className="italic text-burgundy">rugăciune și cuvânt</em>
            </h2>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-4">
              Cu blândețe și râvnă, părintele Cătălin Ailenei veghează asupra obștii încredințate,
              purtând în rugăciune și jertfelnicie sufletele celor ce se adună sub acoperământul
              Sfintei Cuvioase Teodora de la Sihla.
            </p>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-8">
              Ne dorim ca, urmându-i pașii, să zidim în sufletele noastre altar viu al rugăciunii,
              unde harul lui Dumnezeu să odihnească peste comunitatea noastră.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/despre"><Button variant="default" size="lg">Despre părintele paroh</Button></Link>
              <Link href="/misiune"><Button variant="outline" size="lg">Misiunea parohiei</Button></Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1490127252417-7c393f993ee4?auto=format&fit=crop&w=900&q=80"
                alt="Părintele Cătălin Ailenei"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/40 to-transparent" />
              <Card className="absolute bottom-6 left-6 right-6 p-5 bg-white/95 backdrop-blur border-0 shadow-lg">
                <p className="font-ceremonial uppercase text-xs tracking-[0.2em] text-burgundy mb-1">
                  Părintele Cătălin Ailenei
                </p>
                <p className="text-sm text-ink-muted italic">Preot paroh</p>
              </Card>
              <BorderBeam size={250} duration={10} delay={2} colorFrom="#EAC784" colorTo="#81231B" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== 3. THE 3 PILLARS: RUGĂCIUNE, MILOSTENIE, IUBIRE ===== */}
      <section className="bg-cream py-16 sm:py-24">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <SectionEyebrow align="center">Misiunea noastră</SectionEyebrow>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
                Zidim credința, slujim cu <em className="italic text-burgundy">dragoste</em>, trăim în rugăciune
              </h2>
              <p className="text-ink-muted mt-5 text-[17px]">
                Trei stâlpi care țin viața parohiei și prin care creștem împreună întru Hristos.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Church,
                title: 'Rugăciune',
                text:
                  'Ne adunăm cu evlavie la Sfânta Liturghie și la toate rânduielile Bisericii, căutând întărirea sufletelor și luminarea vieții noastre în Hristos.',
              },
              {
                icon: Heart,
                title: 'Milostenie',
                text:
                  'Ne străduim să fim aproape de cei în suferință – bolnavi, bătrâni, copii lipsiți – cu ce putem, din dragoste pentru Dumnezeu și pentru aproapele.',
              },
              {
                icon: HandHeart,
                title: 'Iubire',
                text:
                  'Rugăciunea este temelia parohiei noastre. Ne unim inimile înaintea Domnului, în unitate și pace, cu nădejde că El primește și osteneala, și tăcerea.',
              },
            ].map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.1}>
                <Card className="h-full p-8 bg-white">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-burgundy text-white mb-5">
                    <p.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-3 text-burgundy">{p.title}</h3>
                  <p className="text-ink-muted leading-relaxed">{p.text}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. VIDEO SECTION (YouTube embed or MP4) ===== */}
      <section className="container py-16 sm:py-24">
        <FadeIn>
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <SectionEyebrow align="center">Slujbe și cuvinte de folos</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
              Urmărește-ne pe <em className="italic text-burgundy">YouTube</em>
            </h2>
            <p className="text-ink-muted mt-4 text-[17px]">
              Cu ajutorul lui Dumnezeu, slujbele săvârșite în parohia noastră — împreună cu cuvinte
              de folos, momente duhovnicești și clipe de bucurie creștină — pot fi urmărite și pe
              canalul nostru YouTube.
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <VideoSection
            poster="https://images.unsplash.com/photo-1543525238-7f7c0adbd1c0?auto=format&fit=crop&w=1600&q=80"
            youtubeId="dQw4w9WgXcQ"
            className="max-w-4xl mx-auto"
          />
          <p className="text-center text-xs text-ink-soft mt-3 italic">
            Înlocuiește youtubeId din app/page.tsx cu ID-ul real al canalului parohiei.
          </p>
        </FadeIn>
      </section>

      {/* ===== 5. TESTIMONIALS (slider) ===== */}
      <section className="bg-lavender-soft/50 py-16 sm:py-24">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <SectionEyebrow align="center">Glasul comunității</SectionEyebrow>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
                Despre credință, rugăciune și <em className="italic text-burgundy">nădejde</em>
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Testimonials items={TESTIMONIALS} />
          </FadeIn>
        </div>
      </section>

      {/* ===== 6. DONATE CTA ===== */}
      <section className="bg-gradient-to-br from-burgundy via-burgundy-dark to-burgundy text-white py-20 relative overflow-hidden">
        <div className="container text-center max-w-3xl relative z-10">
          <FadeIn>
            <SectionEyebrow align="center" className="!text-gold">Fii alături</SectionEyebrow>
            <h2 className="font-ecclesia text-3xl sm:text-5xl font-bold mb-5 text-white uppercase tracking-wide leading-tight">
              Fii alături de parohie cu <em className="text-gold font-serif italic normal-case">rugăciunea și darul</em>
            </h2>
            <p className="text-white/85 mb-8 max-w-xl mx-auto text-[17px] leading-relaxed">
              Fiecare dar adus cu inimă curată devine o cărămidă vie în acest lăcaș al harului.
              Alătură-te lucrării binecuvântate.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/redirectioneaza-3-5">
                <ShimmerButton background="linear-gradient(135deg, #EAC784 0%, #c9a361 100%)">
                  <span className="text-base font-semibold text-burgundy-dark">Redirecționează 3,5%</span>
                </ShimmerButton>
              </Link>
              <Link href="/doneaza">
                <Button variant="cream" size="lg">Donează acum</Button>
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 text-center max-w-2xl mx-auto">
              <div>
                <div className="font-ecclesia text-4xl sm:text-5xl font-bold text-gold">
                  <NumberTicker value={3.5} decimalPlaces={1} />%
                </div>
                <p className="font-ceremonial text-xs uppercase tracking-wider text-white/70 mt-2">din impozit</p>
              </div>
              <div>
                <div className="font-ecclesia text-4xl sm:text-5xl font-bold text-gold">
                  <NumberTicker value={2022} />
                </div>
                <p className="font-ceremonial text-xs uppercase tracking-wider text-white/70 mt-2">an înființare</p>
              </div>
              <div>
                <div className="font-ecclesia text-4xl sm:text-5xl font-bold text-gold">∞</div>
                <p className="font-ceremonial text-xs uppercase tracking-wider text-white/70 mt-2">recunoștință</p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Decorative ornament */}
        <Sparkles className="absolute top-10 left-10 h-8 w-8 text-gold/20" />
        <Sparkles className="absolute bottom-10 right-10 h-8 w-8 text-gold/20" />
      </section>

      {/* ===== 7. LATEST POSTS ===== */}
      <section className="container py-16 sm:py-24">
        <FadeIn>
          <div className="text-center mb-12">
            <SectionEyebrow align="center">Noutăți din viața parohiei</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold">
              Vești, mărturii și <em className="italic text-burgundy">povești</em>
            </h2>
          </div>
        </FadeIn>

        {posts.length === 0 ? (
          <p className="text-center text-ink-muted">
            Rulează scriptul de import:{' '}
            <code className="bg-cream-card px-2 py-0.5 rounded">npm run import:wp</code>
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p, i) => (
              <FadeIn key={p.id} delay={(i % 6) * 0.05}>
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

        <FadeIn delay={0.2}>
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button variant="outline" size="lg">Vezi toate noutățile</Button>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ===== 8. PHOTO GALLERY (la sfârșit, cum ai cerut) ===== */}
      <section className="bg-cream py-16 sm:py-24">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <SectionEyebrow align="center">Galerie foto</SectionEyebrow>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold">
                Momente din viața <em className="italic text-burgundy">parohiei</em>
              </h2>
              <p className="text-ink-muted mt-4 text-[17px]">
                Imagini din slujbe, întâlniri și momente împărtășite. Click pe orice fotografie pentru a o mări.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <PhotoGallery images={GALLERY} />
          </FadeIn>
        </div>
      </section>

      {/* ===== 9. NEWSLETTER ===== */}
      <section className="container py-16 sm:py-20">
        <FadeIn>
          <Card className="p-10 sm:p-14 text-center bg-gradient-to-br from-cream-card to-cream relative overflow-hidden border-0">
            <BookOpen className="absolute -top-6 -left-6 h-32 w-32 text-burgundy/5" />
            <BookOpen className="absolute -bottom-6 -right-6 h-32 w-32 text-burgundy/5 rotate-180" />
            <SectionEyebrow align="center">Rămâi aproape</SectionEyebrow>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3">
              Primește vești, rugăciuni și cuvinte de folos
            </h2>
            <p className="text-ink-muted mb-6 max-w-lg mx-auto">
              Înscrie-te la newsletter și primești lunar gânduri, programul slujbelor și momente
              importante din viața parohiei.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="adresa.ta@email.ro"
                className="flex-1 px-4 py-3 rounded-full border border-border bg-white text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-burgundy"
              />
              <Button type="submit" size="lg">Abonează-mă</Button>
            </form>
          </Card>
        </FadeIn>
      </section>
    </>
  );
}
