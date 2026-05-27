import Link from 'next/link';
import { Hero } from '@/components/site/hero';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { FadeIn } from '@/components/magicui/fade-in';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DonateForm } from '@/components/site/donate-form';
import { Heart, FileText, Building, CreditCard, ShieldCheck } from 'lucide-react';
import { getImages } from '@/lib/images';
import { isStripeConfigured } from '@/lib/stripe';

export const metadata = { title: 'Donează' };

export default async function DoneazaPage() {
  const IMG = await getImages();
  return (
    <>
      <Hero
        title={<>Devino <em className="font-serif italic">ctitor</em></>}
        subtitle="Fiecare dar adus cu inimă curată devine o cărămidă vie în lăcașul harului. Alătură-te acestei lucrări binecuvântate."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Donează' }]}
      />

      {/* Donate form (Stripe Checkout) */}
      <section className="container py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <FadeIn>
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <img
                src={IMG.campaignPoster}
                alt="Devino ctitor — campania de zidire"
                className="w-full h-full object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <Card className="p-6 sm:p-8 bg-white border border-border">
              {!isStripeConfigured && (
                <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  ⚠️ <strong>Stripe nu e configurat încă.</strong> Setează{' '}
                  <code>STRIPE_SECRET_KEY</code> în Railway → Variables ca să poți primi plăți.
                  Formularul de mai jos funcționează, dar nu va finaliza plata până nu adaugi cheia.
                </div>
              )}
              <DonateForm campaign="zidirea-bisericii" campaignTitle="Zidirea bisericii" />
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* Other ways to give */}
      <section className="bg-cream py-12">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <SectionEyebrow align="center">Alte moduri de a dărui</SectionEyebrow>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
                Există mai multe căi prin care poți <em className="italic text-burgundy">susține</em>
              </h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link href="/redirectioneaza-3-5">
              <Card className="p-6 bg-white hover:shadow-lg transition cursor-pointer h-full">
                <FileText className="h-10 w-10 text-burgundy mb-3" />
                <h3 className="font-display text-xl font-semibold mb-2">Redirecționează 3,5%</h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Din impozitul pe venit. Fără niciun cost pentru tine — banii care oricum ar
                  ajunge la stat, ajung la parohie.
                </p>
                <p className="mt-3 text-sm text-coral font-medium">Vezi cum →</p>
              </Card>
            </Link>

            <Card className="p-6 bg-white h-full">
              <Building className="h-10 w-10 text-burgundy mb-3" />
              <h3 className="font-display text-xl font-semibold mb-2">Transfer bancar</h3>
              <div className="text-sm text-ink-muted space-y-1 leading-relaxed">
                <p>
                  <strong className="text-ink">Beneficiar:</strong> Parohia Sf. Cuv. Teodora de la Sihla
                </p>
                <p>
                  <strong className="text-ink">CIF:</strong> 48801453
                </p>
                <p className="text-xs italic mt-2">
                  Pentru IBAN, contactează preotul paroh la{' '}
                  <a href="mailto:contact@parohiasfteodoradelasihla.ro" className="text-burgundy hover:underline">
                    email
                  </a>
                  .
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white h-full">
              <CreditCard className="h-10 w-10 text-burgundy mb-3" />
              <h3 className="font-display text-xl font-semibold mb-2">Card · Stripe</h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Donație online sigură cu cardul. Suportă plăți unice și abonamente lunare.
                Poți alege orice sumă.
              </p>
              <p className="mt-3 text-sm text-coral font-medium">Folosește formularul de mai sus ↑</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust badge / thanks */}
      <section className="bg-burgundy text-white py-12">
        <div className="container max-w-2xl text-center">
          <FadeIn>
            <ShieldCheck className="h-12 w-12 text-gold mx-auto mb-4" />
            <h2 className="font-display text-3xl sm:text-4xl italic mb-4">
              Plăți securizate de Stripe
            </h2>
            <p className="text-white/85 leading-relaxed mb-4">
              Datele cardului tău sunt procesate direct de Stripe, certificat PCI-DSS. Noi nu vedem
              și nu stocăm nicio informație despre card.
            </p>
            <p className="text-gold/90 italic">
              Numele tău va fi pomenit la Sfânta Liturghie.
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
