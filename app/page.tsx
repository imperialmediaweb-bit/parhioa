import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Hero } from '@/components/site/hero';
import { PostCard } from '@/components/site/post-card';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BorderBeam } from '@/components/magicui/border-beam';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text';
import { FadeIn } from '@/components/magicui/fade-in';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { Heart, HandHeart, Users, Church } from 'lucide-react';

export const revalidate = 60;

async function getData() {
  try {
    const [home, posts] = await Promise.all([
      prisma.page
        .findUnique({ where: { slug: 'acasa' }, include: { featured: true } })
        .catch(() => null),
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
  const { home, posts } = await getData();

  return (
    <>
      <Hero
        title={
          <>
            Credința care <AnimatedGradientText>zidește</AnimatedGradientText> împreună
          </>
        }
        subtitle="Parohia Sfânta Cuvioasă Teodora de la Sihla — o comunitate în formare, prin rugăciune, milostenie și iubire creștină."
      />

      {/* Intro section */}
      <section className="container py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeIn>
            <Card className="relative overflow-hidden bg-cream-card border-0 p-8 sm:p-10">
              <SectionEyebrow>Credință vie și ajutor</SectionEyebrow>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-4">
                Fiecare suflet e o piatră vie în lucrarea lui Hristos
              </h2>
              <p className="text-ink-muted mb-6 leading-relaxed">
                Parohia „Sfânta Cuvioasă Teodora de la Sihla&quot; își împlinește misiunea prin
                rugăciune, zidirea bisericii, sprijinirea celor în suferință și apropierea de fiecare
                inimă. Fiecare gest de susținere întărește acest drum: o comunitate vie, în slujba
                lui Dumnezeu și a aproapelui.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/misiune"><Button variant="default">Implică-te</Button></Link>
                <Link href="/despre"><Button variant="outline">Despre noi</Button></Link>
              </div>
              <BorderBeam size={250} duration={10} delay={2} />
            </Card>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1548407260-da850faa41e3?auto=format&fit=crop&w=800&q=80"
                alt="Biserica parohială"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats / pillars */}
      <section className="bg-cream py-16 sm:py-24">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <SectionEyebrow align="center">Misiunea noastră</SectionEyebrow>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
                Rugăciune, milostenie, iubire
              </h2>
              <p className="text-ink-muted mt-4">
                Trei stâlpi care țin viața parohiei și prin care creștem împreună întru Hristos.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Church, title: 'Slujbe vii', text: 'Liturghii, vecernii, paraclise și sfeștanii săptămânale.' },
              { icon: Heart, title: 'Milostenie', text: 'Sprijin pentru familiile și persoanele aflate în nevoie.' },
              { icon: HandHeart, title: 'Catehizare', text: 'Întâlniri duhovnicești și ateliere pentru copii și tineri.' },
              { icon: Users, title: 'Comunitate', text: 'O parohie tânără, deschisă, vie, ce zidește împreună.' },
            ].map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.1}>
                <Card className="h-full p-6 bg-white">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral text-white mb-4">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{p.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{p.text}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Home page content (if exists in WP) */}
      {home && (
        <section className="container py-16 sm:py-24">
          <article className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy mb-6">
              {home.title}
            </h2>
            <div className="wp-content" dangerouslySetInnerHTML={{ __html: home.content }} />
          </article>
        </section>
      )}

      {/* Latest posts */}
      <section className="container py-16 sm:py-24">
        <FadeIn>
          <div className="text-center mb-12">
            <SectionEyebrow align="center">Vești din parohie</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold">
              Noutăți și articole recente
            </h2>
          </div>
        </FadeIn>

        {posts.length === 0 ? (
          <p className="text-center text-ink-muted">
            Nu există articole publicate. Rulează scriptul de import:{' '}
            <code className="bg-cream-card px-2 py-0.5 rounded">npm run import:wp</code>
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p, i) => (
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

        <FadeIn delay={0.2}>
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button variant="outline" size="lg">Vezi toate noutățile</Button>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* CTA: donate */}
      <section className="bg-gradient-to-br from-navy via-navy-soft to-navy-dark text-white py-20">
        <div className="container text-center max-w-3xl">
          <FadeIn>
            <SectionEyebrow align="center" className="text-gold">Implică-te</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold mb-4 text-white">
              Devino ctitor al unei <em className="text-gold font-serif italic">biserici tinere</em>
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Redirecționează 3,5% din impozitul pe venit sau donează direct — fiecare gest este o
              cărămidă în zidirea casei lui Dumnezeu.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/redirectioneaza-3-5">
                <ShimmerButton>
                  <span className="text-base font-semibold">Redirecționează 3,5%</span>
                </ShimmerButton>
              </Link>
              <Link href="/doneaza">
                <Button variant="cream" size="lg">Donează acum</Button>
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-6 text-center max-w-2xl mx-auto">
              <div>
                <div className="font-display text-4xl sm:text-5xl font-bold text-gold">
                  <NumberTicker value={3.5} decimalPlaces={1} />%
                </div>
                <p className="text-sm text-white/70 mt-1">din impozit</p>
              </div>
              <div>
                <div className="font-display text-4xl sm:text-5xl font-bold text-gold">
                  <NumberTicker value={2022} />
                </div>
                <p className="text-sm text-white/70 mt-1">an înființare</p>
              </div>
              <div>
                <div className="font-display text-4xl sm:text-5xl font-bold text-gold">
                  ∞
                </div>
                <p className="text-sm text-white/70 mt-1">recunoștință</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
