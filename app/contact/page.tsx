import { Hero } from '@/components/site/hero';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { FadeIn } from '@/components/magicui/fade-in';
import { Card } from '@/components/ui/card';
import { MapPin, HandHeart, HeartPulse, Mail, Phone } from 'lucide-react';
import { getImages } from '@/lib/images';
import { ContactForm } from '@/components/site/contact-form';

export const metadata = { title: 'Contact' };

export default async function ContactPage() {
  const IMG = await getImages();
  return (
    <>
      <Hero
        title={<>Trimite un <em className="font-serif italic">gând</em> sau o întrebare</>}
        subtitle="Scrie-ne pentru întrebări, rugăciuni sau sprijin duhovnicesc. Suntem aproape."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      {/* Form + photo */}
      <section className="container py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-stretch">
          <FadeIn>
            <Card className="h-full bg-lavender-soft border-0 p-8 sm:p-10">
              <SectionEyebrow>Contact</SectionEyebrow>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-tight mb-3">
                Ai un cuvânt de împărtășit sau o întrebare pe suflet?
              </h2>
              <p className="text-ink-muted leading-relaxed mb-6">
                Scrie-ne folosind formularul de mai jos, fie pentru rugăciune, sfat duhovnicesc,
                ori alte întrebări legate de parohie.
              </p>
              <ContactForm />
            </Card>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="relative h-full min-h-[500px] rounded-3xl overflow-hidden shadow-xl">
              <img src={IMG.priestPraying} alt="Părintele în rugăciune" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/40 to-transparent" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3 ways to connect */}
      <section className="container py-12">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: MapPin, title: 'Vizitează-ne', text: 'Vino la slujbe, rugăciuni și întâlniri duhovnicești. Parohia este deschisă tuturor celor care caută liniște, lumină și comuniune cu Dumnezeu.' },
            { icon: HandHeart, title: 'Implicare în parohie', text: 'Dacă dorești să ajuți, să fii de folos sau să te alături celor care slujesc cu inimă, te așteptăm. Participă la activități sau în faptele milei creștine.' },
            { icon: HeartPulse, title: 'Dăruiește cu inimă', text: 'Susține parohia prin redirecționare de impozit, donații sau voluntariat. Fiecare gest, oricât de mic, contează în lucrarea zidirii.' },
          ].map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.1}>
              <div className="text-center p-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-burgundy text-white mb-4">
                  <p.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl font-semibold text-burgundy mb-3">{p.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{p.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Map + address */}
      <section className="bg-lavender-soft py-12">
        <div className="container grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <FadeIn>
            <div className="space-y-3">
              <div className="aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-xl bg-white">
                <iframe
                  src="https://www.google.com/maps?q=Strada+Pacea+45B,+Boto%C8%99ani,+Romania&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  title="Locația parohiei — Strada Pacea 45B"
                />
              </div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Strada+Pacea+45B,+Botosani,+Romania"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm text-burgundy hover:text-burgundy-dark font-medium underline-offset-2 hover:underline"
              >
                Deschide indicații în Google Maps →
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <SectionEyebrow>Vrei să ne vizitezi?</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-6">
              Te așteptăm cu drag la Parohia „Sfânta Cuvioasă Teodora de la Sihla&quot; din <em className="italic text-burgundy">Botoșani</em>.
            </h2>
            <div className="space-y-4 text-ink">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-burgundy flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-0.5">Adresa parohiei (administrativ):</p>
                  <p className="text-ink-muted">Strada Pacea, Nr. 45B, Botoșani, România</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gold/10 border border-gold/30 rounded-xl p-3">
                <span className="text-burgundy text-lg leading-none mt-0.5">☩</span>
                <div>
                  <p className="font-semibold mb-0.5 text-burgundy">Unde se țin slujbele:</p>
                  <p className="text-ink-muted leading-relaxed">
                    Până la finalizarea bisericii proprii, slujbele se țin la{' '}
                    <strong className="text-ink">Biserica „Bunavestire"</strong> — Botoșani.
                    Programul săptămânal este afișat pe{' '}
                    <a href="/" className="underline text-burgundy">pagina principală</a>.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-burgundy flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-0.5">Email:</p>
                  <a href="mailto:contact@parohiasfteodoradelasihla.ro" className="text-ink-muted hover:text-burgundy">
                    contact@parohiasfteodoradelasihla.ro
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-burgundy flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-0.5">Telefon:</p>
                  <p className="text-ink-muted">Preot paroh: Părintele Cătălin Ailenei</p>
                  <a href="tel:+40754857903" className="text-ink-muted hover:text-burgundy">Telefon: +40 754 857 903</a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
