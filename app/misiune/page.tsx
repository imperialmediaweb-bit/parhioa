import Link from 'next/link';
import { Hero } from '@/components/site/hero';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { FadeIn } from '@/components/magicui/fade-in';
import { BorderBeam } from '@/components/magicui/border-beam';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, HandHeart, Sparkles, Users, Gift, Building2, Check } from 'lucide-react';
import { getImages } from '@/lib/images';
import { CrossDivider } from '@/components/site/cross-divider';

export const metadata = { title: 'Misiune' };

export default async function MisiunePage() {
  const IMG = await getImages();
  return (
    <>
      <Hero
        title="Misiunea noastră"
        subtitle="Un loc de rugăciune, ajutor și iubire creștină, unde credința se trăiește împreună."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Misiune' }]}
      />

      {/* Intro */}
      <section className="container py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeIn>
            <SectionEyebrow>Credință vie și ajutor</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-5">
              Fiecare suflet e o piatră vie în <em className="italic text-burgundy">lucrarea lui Hristos</em>
            </h2>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-6">
              Parohia „Sfânta Cuvioasă Teodora de la Sihla&quot; își împlinește misiunea prin rugăciune,
              zidirea bisericii, sprijinirea celor în suferință și apropierea de fiecare inimă.
              Fiecare gest de susținere întărește acest drum: o comunitate vie, în slujba lui Dumnezeu
              și a aproapelui.
            </p>
            <Link href="/contact"><Button size="lg">Implică-te</Button></Link>
            <div className="flex flex-wrap gap-3 mt-6 text-sm text-ink-muted">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-burgundy" /> Rugăciune</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-burgundy" /> Milostenie</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-burgundy" /> Zidire</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
              <img
                src={IMG.handsBranch}
                alt="Mâini cu o ramură — credință vie"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <BorderBeam size={250} duration={10} colorFrom="#EAC784" colorTo="#81231B" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Mission inspiration */}
      <section className="bg-cream py-16">
        <CrossDivider className="container mb-10" />
        <div className="container grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeIn>
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
              <img
                src={IMG.liturghie}
                alt="Liturghie săvârșită în parohie"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <SectionEyebrow>Misiunea noastră</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-5">
              Rugăciune, milostenie, <em className="italic text-burgundy">iubire</em>
            </h2>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-6">
              Misiunea parohiei se inspiră din viața Sfintei Cuvioase Teodora de la Sihla – o viață
              în rugăciune, smerenie și retragere. Prin slujbe, ajutor dat celor sărmani și apropierea
              sinceră de fiecare suflet, părintele paroh Cătălin Ailenei continuă această lucrare a
              milei și a iubirii creștine.
            </p>
            <ul className="space-y-3">
              {['Credință vie în Hristos', 'Zidire duhovnicească în fiecare om', 'Dragoste lucrătoare prin fapte bune'].map((t) => (
                <li key={t} className="flex items-center gap-3 text-ink">
                  <Check className="h-5 w-5 text-burgundy flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* Programs */}
      <section className="container py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeIn>
            <SectionEyebrow>Programe ale parohiei</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-5">
              Împreună în rugăciune, faptă și <em className="italic text-burgundy">cuvânt</em>
            </h2>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-6">
              Prin slujbe, cateheze, activități pentru tineri și sprijin pentru cei în nevoie, viața
              parohiei devine o lucrare vie în Hristos. Alătură-te nouă!
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-ink-muted">
                <Check className="h-5 w-5 text-burgundy flex-shrink-0" /> Cateheze și seri de rugăciune
              </li>
              <li className="flex items-center gap-3 text-ink">
                <Check className="h-5 w-5 text-burgundy flex-shrink-0" /> <strong>Ateliere de lucru și tabere creștine</strong>
              </li>
              <li className="flex items-center gap-3 text-ink">
                <Check className="h-5 w-5 text-burgundy flex-shrink-0" /> Vecernii și Liturghii la sărbători
              </li>
            </ul>
          </FadeIn>
          <FadeIn delay={0.15}>
            <Card className="bg-cream-card border-0 p-2 rounded-3xl shadow-xl">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src={IMG.iconTeodora}
                  alt="Icoana Sfintei Cuvioase Teodora de la Sihla"
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* Partnership */}
      <section className="bg-cream py-16">
        <div className="container grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeIn>
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
              <img
                src={IMG.handsChurch}
                alt="Mâini ce țin o biserică mică — sprijin și solidaritate"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <SectionEyebrow>Parteneriate</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-5">
              Sprijin și <em className="italic text-burgundy">solidaritate</em>
            </h2>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-6">
              Alături de persoane și organizații care ne împărtășesc credința, putem face mai mult
              pentru comunitate – sprijin în cazuri sociale, ajutor în construcție, acțiuni
              filantropice și mângâiere pentru cei singuri.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-ink-muted"><Check className="h-5 w-5 text-burgundy" /> Împreună pentru lucrarea lui Dumnezeu</li>
              <li className="flex items-center gap-3 text-ink-muted"><Check className="h-5 w-5 text-burgundy" /> Sprijin constant din partea credincioșilor</li>
              <li className="flex items-center gap-3 text-ink-muted"><Check className="h-5 w-5 text-burgundy" /> Impact real</li>
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* Involvement CTAs */}
      <section className="bg-cream-card py-20">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <SectionEyebrow align="center">Implică-te</SectionEyebrow>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
                Voluntariat, ajutor, <em className="italic text-burgundy">participare</em>
              </h2>
              <p className="text-ink-muted mt-4 text-[17px]">
                Nu doar donațiile financiare contează. Poți contribui cu timp, pricepere sau simplă
                prezență. A te implica înseamnă a pune o cărămidă la zidirea unei lumi mai bune întru
                Hristos.
              </p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Gift,
                title: 'Dăruiește',
                text: 'Fiecare dar, oricât de mic, devine parte dintr-o lucrare mai mare. Sprijină biserica, ajută familiile nevoiașe și susține acțiunile misionare.',
                cta: { label: 'Donează', href: '/doneaza' },
              },
              {
                icon: Sparkles,
                title: 'Redirecționează 3,5%',
                text: 'Nu te costă nimic, dar poate schimba vieți. Redirecționează o parte din impozitul tău și contribuie la zidirea bisericii și la sprijinirea celor în suferință.',
                cta: { label: 'Redirecționează', href: '/redirectioneaza-3-5' },
              },
              {
                icon: Users,
                title: 'Fii voluntar',
                text: 'Dăruiește din timpul tău! Poți ajuta la organizare, vizite pastorale, activități pentru copii sau acțiuni caritabile. Împreună devenim mâinile iubirii lui Hristos.',
                cta: { label: 'Spre formular', href: '/contact' },
              },
            ].map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.1}>
                <Card className="h-full p-7 bg-white text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-burgundy text-white mb-4">
                    <p.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-burgundy mb-2">{p.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed mb-5">{p.text}</p>
                  <Link href={p.cta.href}>
                    <Button variant="default" size="sm">{p.cta.label}</Button>
                  </Link>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship 20% */}
      <section className="container py-16 text-center">
        <FadeIn>
          <SectionEyebrow align="center">Direcționează 20% din impozit. Nu te costă nimic.</SectionEyebrow>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-5 max-w-2xl mx-auto">
            Completează contractul de <em className="italic text-burgundy">sponsorizare</em>
          </h2>
          <p className="text-ink-muted leading-relaxed text-[17px] max-w-2xl mx-auto mb-8">
            Firmele pot susține parohia fără niciun cost, redirecționând 20% din impozitul pe profit.
            Ajută la construirea bisericii și la sprijinirea familiilor în nevoie. E simplu. E legal.
            E cu rost.
          </p>
          <Link href="/directioneaza-20"><Button size="lg">Direcționează impozit</Button></Link>
        </FadeIn>
      </section>
    </>
  );
}
