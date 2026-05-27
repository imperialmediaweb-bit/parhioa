import Link from 'next/link';
import { Hero } from '@/components/site/hero';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { FadeIn } from '@/components/magicui/fade-in';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { CheckCircle2, Mail, Pin, Calendar, Building2 } from 'lucide-react';
import { IMG } from '@/lib/images';

export const metadata = { title: 'Redirecționează 3,5%' };

export default function Redirect35Page() {
  return (
    <>
      <Hero
        title="Redirecționează 3,5%"
        subtitle="Susține zidirea bisericii noastre."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Redirecționează 3,5%' }]}
      />

      {/* Intro card with photo */}
      <section className="container py-16">
        <FadeIn>
          <Card className="bg-cream-card border-0 p-2 rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 lg:p-12 self-center">
                <SectionEyebrow>Ajută-ne cu 3,5% din impozitul pe venit</SectionEyebrow>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-4">
                  Fără nici un cost pentru tine, <em className="italic text-burgundy">dar cu impact</em>
                </h2>
                <p className="text-ink-muted leading-relaxed text-[17px]">
                  Fără niciun cost pentru tine, poți contribui la construirea unui loc de rugăciune
                  pentru comunitatea noastră. Completează formularul și ajută-ne să punem cărămidă
                  peste cărămidă în Casa Domnului.
                </p>
              </div>
              <div className="aspect-[4/3] lg:aspect-auto lg:min-h-[400px] overflow-hidden rounded-2xl">
                <img src={IMG.redirectChurch} alt="Biserica viitoare" className="w-full h-full object-cover" />
              </div>
            </div>
          </Card>
        </FadeIn>
      </section>

      {/* How money is used */}
      <section className="container py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <FadeIn>
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-lg">
              <img src={IMG.donationFamily} alt="Cărămizi pentru zidirea bisericii" className="w-full h-full object-cover" />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <SectionEyebrow>Părintele Cătălin Ailenei</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-5">
              Cum vor fi folosiți <em className="italic text-burgundy">banii?</em>
            </h2>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-5">
              Fiecare donație, fiecare formular 230 completat și fiecare ajutor primit va merge către:
            </p>
            <ul className="space-y-3">
              {[
                'Pregătirea terenului',
                'Fundația bisericii',
                'Zidirea pereților și montarea acoperișului',
                'Amenajarea Sfântului Altar și a spațiului pentru credincioși',
                'Achiziția icoanelor, mobilierului liturgic și obiectelor necesare pentru slujbe',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink">
                  <CheckCircle2 className="h-5 w-5 text-burgundy flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* Why */}
      <section className="bg-cream py-16">
        <div className="container max-w-3xl text-center">
          <FadeIn>
            <SectionEyebrow align="center">Implică-te</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-6">
              Cum și de ce să faci asta?
            </h2>
            <div className="space-y-4 text-ink-muted text-[17px] leading-relaxed text-left">
              <p>
                Redirecționează 3,5% din impozitul pe venit către Parohia Sfânta Cuvioasă Teodora de
                la Sihla și devino parte din zidirea primei noastre biserici!
              </p>
              <p>
                Gestul tău nu te costă nimic! Este vorba de o sumă care oricum ar ajunge la bugetul
                de stat. Acum, cu o simplă completare a Formularului 230, poți decide ca acești bani
                să ajute direct comunitatea ta.
              </p>
              <p className="font-display text-xl italic text-burgundy text-center mt-6">
                De ce să faci asta?
              </p>
              <p>
                Pentru că fiecare formular înseamnă o cărămidă în plus la temelia unei biserici unde
                generații întregi se vor ruga, se vor boteza, se vor cununa și vor primi binecuvântarea
                lui Dumnezeu.
              </p>
              <p>
                În plus, o parte din fonduri va merge către sprijinirea familiilor aflate în
                dificultăți: copii, bătrâni, bolnavi, oameni care au nevoie de ajutorul nostru.
              </p>
              <p className="text-center font-display text-xl italic text-burgundy mt-6">
                Este un act simplu, dar cu impact uriaș!
              </p>
              <p className="text-center">
                Cu doar câteva minute din timpul tău, poți transforma 3,5% din impozitul pe venit
                într-o lucrare de credință și iubire.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Steps */}
      <section className="container py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <FadeIn>
            <SectionEyebrow>Pașii</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-6">
              Care sunt <em className="italic text-burgundy">pașii?</em>
            </h2>
            <ol className="space-y-5">
              {[
                'Pasul 1: Completează formularul de mai jos direct online.',
                'Pasul 2: Poți completa și semna digital, fără programe speciale.',
                'Pasul 3: După completare, descarcă PDF-ul generat.',
                'Pasul 4: Trimite PDF-ul completat pe e-mail la contact@parohiasfteodoradelasihla.ro sau pe WhatsApp la 0754 510 167.',
                'Pasul 5 (opțional): Dacă preferi, poți descărca formularul, îl completezi de mână, îl semnezi și ne poți trimite o poză clară cu el tot pe WhatsApp.',
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 h-9 w-9 rounded-full bg-burgundy text-white flex items-center justify-center font-display text-lg font-semibold">
                    {i + 1}
                  </span>
                  <p className="text-ink-muted leading-relaxed pt-1">
                    {step.replace(/^Pasul \d+( \(opțional\))?: /, '')}
                  </p>
                </li>
              ))}
            </ol>
          </FadeIn>

          <FadeIn delay={0.15}>
            <Card className="bg-cream-card border-0 p-6 rounded-3xl">
              <div className="bg-white rounded-2xl p-6 text-center">
                <p className="font-ceremonial uppercase text-xs tracking-[0.18em] text-burgundy mb-4">
                  Formularul ANAF 230
                </p>
                <img src={IMG.redirectForm} alt="Formular 230 ANAF" className="w-full max-w-[260px] mx-auto rounded-lg" />
                <a
                  href="#"
                  className="inline-block mt-6"
                >
                  <Button size="lg">Descarcă contract</Button>
                </a>
              </div>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* Online form CTA */}
      <section className="bg-cream-card py-16">
        <div className="container max-w-2xl text-center">
          <FadeIn>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-4">
              Completează online, direct mai jos!
            </h2>
            <p className="text-ink-muted text-[17px] leading-relaxed mb-8">
              Completează formularul direct pe site, semnează electronic și generează PDF-ul cu
              semnătura digitală. Totul se face rapid, online, fără să descarci programe suplimentare!
            </p>
            <ShimmerButton>
              <span className="text-base font-semibold">Începe formularul</span>
            </ShimmerButton>
          </FadeIn>
        </div>
      </section>

      {/* Parish info */}
      <section className="container py-16">
        <FadeIn>
          <Card className="bg-lavender-soft border-0 p-8 sm:p-12 rounded-3xl">
            <SectionEyebrow align="center">Implică-te</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-center mb-3">
              Datele Parohiei Sfânta Cuvioasă Teodora de la Sihla
            </h2>
            <p className="text-center text-ink-muted max-w-2xl mx-auto mb-10">
              Parohia noastră este înregistrată oficial și are toate documentele necesare pentru a
              putea primi redirecționarea celor 3,5% din impozitul pe venit. Iată informațiile complete:
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div>
                <h3 className="font-display text-xl font-semibold text-burgundy mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5" /> Date de identificare fiscală
                </h3>
                <ul className="space-y-2 text-ink-muted text-sm">
                  <li><strong className="text-ink">Denumire:</strong> Parohia „Sfânta Cuvioasă Teodora de la Sihla&quot; – Botoșani</li>
                  <li><strong className="text-ink">Adresă:</strong> Județul Botoșani, Municipiul Botoșani, Strada Pacea, Nr. 45B</li>
                  <li><strong className="text-ink">CIF/CUI:</strong> 48801453</li>
                  <li><strong className="text-ink">Data atribuirii codului fiscal:</strong> 19.09.2023</li>
                </ul>
              </div>

              <div>
                <h3 className="font-display text-xl font-semibold text-burgundy mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" /> Date oficiale de înființare
                </h3>
                <ul className="space-y-2 text-ink-muted text-sm">
                  <li><strong className="text-ink">Decizie de înființare:</strong> Decizia nr. 60/2022 emisă de Mitropolia Moldovei și Bucovinei</li>
                  <li><strong className="text-ink">Data înființării:</strong> 23 noiembrie 2022</li>
                  <li><strong className="text-ink">Aparține de:</strong> Protopopiatul Botoșani, Arhiepiscopia Iașilor</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-lavender/40 text-center max-w-md mx-auto space-y-3">
              <h3 className="font-display text-xl font-semibold text-burgundy mb-2 flex items-center justify-center gap-2">
                <Pin className="h-5 w-5" /> Email de contact pentru formular 230
              </h3>
              <p className="flex items-center justify-center gap-2 text-ink">
                <Mail className="h-4 w-4 text-burgundy" />
                <a href="mailto:contact@parohiasfteodoradelasihla.ro" className="hover:text-burgundy">
                  contact@parohiasfteodoradelasihla.ro
                </a>
              </p>
              <p className="text-ink">
                <strong>WhatsApp:</strong> <a href="https://wa.me/40754857903" className="hover:text-burgundy">+40 754 857 903</a>
              </p>
            </div>
          </Card>
        </FadeIn>
      </section>
    </>
  );
}
