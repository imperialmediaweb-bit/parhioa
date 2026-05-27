import Link from 'next/link';
import { Hero } from '@/components/site/hero';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { FadeIn } from '@/components/magicui/fade-in';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { Heart, CreditCard, Building, FileText } from 'lucide-react';
import { IMG } from '@/lib/images';

export const metadata = { title: 'Donează' };

export default function DoneazaPage() {
  return (
    <>
      <Hero
        title={<>Devino <em className="font-serif italic">ctitor</em></>}
        subtitle="Fiecare dar adus cu inimă curată devine o cărămidă vie în lăcașul harului. Alătură-te acestei lucrări binecuvântate."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Donează' }]}
      />

      <section className="container py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <FadeIn>
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <img src={IMG.campaignPoster} alt="Devino ctitor — campania de zidire" className="w-full h-full object-cover" />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <SectionEyebrow>Cum poți dărui</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-5">
              Alege modul în care vrei să <em className="italic text-burgundy">susții</em>
            </h2>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-8">
              Există mai multe moduri prin care poți dărui pentru Casa Domnului. Toate sunt
              binecuvântate. Toate ajută parohia să crească.
            </p>
            <div className="space-y-3">
              <Link href="/redirectioneaza-3-5">
                <Card className="p-5 bg-cream-card border-0 hover:bg-cream-deep transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-burgundy flex-shrink-0" />
                    <div>
                      <p className="font-display text-lg font-semibold">Redirecționează 3,5%</p>
                      <p className="text-sm text-ink-muted">Din impozitul pe venit, fără niciun cost.</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Card className="p-5 bg-cream-card border-0">
                <div className="flex items-center gap-4">
                  <Building className="h-8 w-8 text-burgundy flex-shrink-0" />
                  <div>
                    <p className="font-display text-lg font-semibold">Transfer bancar</p>
                    <p className="text-sm text-ink-muted">Beneficiar: Parohia Sf. Teodora · CIF: 48801453</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5 bg-cream-card border-0">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-8 w-8 text-burgundy flex-shrink-0" />
                  <div>
                    <p className="font-display text-lg font-semibold">Card bancar / PayPal</p>
                    <p className="text-sm text-ink-muted">Donație online securizată prin Stripe / PayPal.</p>
                  </div>
                </div>
              </Card>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-burgundy text-white py-20">
        <div className="container max-w-2xl text-center">
          <FadeIn>
            <Heart className="h-10 w-10 text-gold mx-auto mb-4" />
            <h2 className="font-display text-3xl sm:text-4xl italic mb-4">
              Doamne, primește jertfa noastră
            </h2>
            <p className="text-white/85 mb-8 leading-relaxed">
              Mulțumim din inimă tuturor celor care, prin rugăciune și prin dar, susțin lucrarea
              parohiei. Numele dvs. va fi pomenit la slujbele de Sfânta Liturghie.
            </p>
            <ShimmerButton background="linear-gradient(135deg, #EAC784 0%, #c9a361 100%)">
              <span className="text-base font-semibold text-burgundy-dark">Donează acum</span>
            </ShimmerButton>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
