import Link from 'next/link';
import { Hero } from '@/components/site/hero';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { FadeIn } from '@/components/magicui/fade-in';
import { BorderBeam } from '@/components/magicui/border-beam';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Quote, Cross } from 'lucide-react';
import { getImages } from '@/lib/images';
import { CrossDivider } from '@/components/site/cross-divider';

export const metadata = { title: 'Despre' };

export default async function DesprePage() {
  const IMG = await getImages();
  return (
    <>
      <Hero
        title="Despre parohia noastră"
        subtitle="Un lăcaș întru zidire sufletească, născut cu binecuvântare arhierească, sub ocrotirea Sfintei Cuvioase Teodora de la Sihla."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Despre' }]}
      />

      {/* Intro */}
      <section className="container py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeIn>
            <SectionEyebrow>Parohia</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-5">
              Sub ocrotirea <em className="italic text-burgundy">Sfintei Cuvioase Teodora</em> de la Sihla
            </h2>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-4">
              Parohia noastră se află încă în zidire, dar comunitatea s-a adunat deja în jurul
              rugăciunii, al slujbelor de întărire sufletească și al ajutorării celor aflați în nevoi.
            </p>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-4">
              Credința este dar de la Dumnezeu și se trăiește în comuniune. Misiunea parohiei este
              de a fi un loc de adunare a credincioșilor în jurul Sfintei Liturghii, spre întărirea
              unora prin alții și spre vestirea Evangheliei iubirii lui Hristos.
            </p>
            <p className="text-ink-muted leading-relaxed text-[17px]">
              Nu zidim doar pereți de piatră, ci dorim să clădim o familie duhovnicească, întemeiată
              pe rugăciune și dragoste frățească. Nădăjduim ca parohia să devină lumina celor din
              întuneric, alinarea celor în necazuri și școala iubirii lui Dumnezeu.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <img src={IMG.parishLogoBotosani} alt="Parohia Sf. Teodora — Botoșani" className="absolute inset-0 w-full h-full object-cover" />
              <BorderBeam size={250} duration={10} colorFrom="#EAC784" colorTo="#81231B" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pr. Cătălin Ailenei */}
      <section className="bg-cream py-16">
        <CrossDivider className="container mb-10" />
        <div className="container grid lg:grid-cols-5 gap-10 lg:gap-12 items-center">
          <FadeIn className="lg:col-span-2">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <img src={IMG.priestPortrait} alt="Părintele Cătălin Ailenei" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-3">
            <SectionEyebrow>Părintele paroh</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-2">
              Pr. Cătălin Ailenei
            </h2>
            <p className="font-serif italic text-burgundy text-lg mb-5">
              Preot paroh la Parohia „Sfânta Cuvioasă Teodora de la Sihla&quot;
            </p>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-4">
              Preot slujitor la Parohia „Sfânta Cuvioasă Teodora de la Sihla&quot; din Botoșani, cu
              râvnă în slujire și dragoste pentru aproapele. A slujit la Poiana și a fost călăuză
              tinerilor în cadrul Asociației Ortodoxe.
            </p>
            <p className="text-ink-muted leading-relaxed text-[17px]">
              Și-a desăvârșit studiile la Facultatea de Teologie „Dumitru Stăniloae&quot; din Iași.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Sfânta Cuvioasă Teodora */}
      <section className="container py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeIn>
            <SectionEyebrow>Ocrotitoarea parohiei</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-5">
              Sfânta Cuvioasă <em className="italic text-burgundy">Teodora de la Sihla</em>
            </h2>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-4">
              Sfânta Cuvioasă Teodora, floare aleasă a neamului românesc, s-a născut în veacul al
              XVII-lea și, după moartea soțului ei, a părăsit toate cele trecătoare, viețuind ani
              mulți în post și rugăciune în peșterile Sihlei.
            </p>
            <p className="text-ink-muted leading-relaxed text-[17px]">
              Aleasă de Dumnezeu spre a fi pildă de sfințenie și nevoință, Biserica a proslăvit-o
              în anul 1992. Cu rugăciunile ei, să ne fie tuturor întărire, mângâiere și povățuire
              în ispitele vieții.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <Card className="bg-cream-card border-0 p-2 rounded-3xl shadow-xl">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img src={IMG.iconTeodora2} alt="Icoana Sfintei Cuvioase Teodora de la Sihla" className="w-full h-full object-cover" />
              </div>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* Pull-quote — message from the priest */}
      <section className="bg-burgundy text-white py-20 relative">
        <div className="container max-w-3xl">
          <FadeIn>
            <Quote className="h-12 w-12 text-gold/40 mb-4" />
            <blockquote className="font-display text-xl sm:text-2xl lg:text-3xl leading-relaxed italic mb-6">
              „Cu îngăduința Bunului Dumnezeu și cu binecuvântarea Înaltpreasfințitului Părinte
              Teofan, Mitropolitul Moldovei și Bucovinei, parohia noastră a fost înființată încă
              de anul trecut! Nădăjduim ca acestei comunități să-i punem o temelie de nestăvilit
              în fața ispitelor, cu ajutorul lui Dumnezeu, prin lucrarea Duhului Sfânt – Cel ce
              sfințește toate, și prin mijlocirea Sfintei Cuvioase Teodora de la Sihla."
            </blockquote>
            <p className="font-ceremonial uppercase text-sm tracking-[0.2em] text-gold">
              Pr. Cătălin Ailenei
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Domnul a zidit casa aceasta */}
      <section className="container py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeIn delay={0.15} className="order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <img src={IMG.handsChurch} alt="Mâini ce țin o biserică mică" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </FadeIn>
          <FadeIn className="order-1 lg:order-2">
            <SectionEyebrow>Întemeierea</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-5">
              „Domnul a zidit <em className="italic text-burgundy">casa aceasta</em>…"
            </h2>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-4">
              Cu mila Domnului și cu rânduială de Sus, Parohia „Sfânta Cuvioasă Teodora de la Sihla&quot;
              s-a întemeiat ca semn de binecuvântare și mângâiere pentru sufletele credincioșilor
              din Botoșani.
            </p>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-4">
              Deși lăcaș de închinare încă nu este zidit, cu ajutorul Bunului Dumnezeu și cu
              sprijinul celor cu inimă bună, nădăjduim că va fi înălțat la vremea rânduită. Până
              atunci, ne adunăm cu rugăciune și cu nădejde, oriunde se poate sluji cu evlavie,
              cu pace și cu inimă curată.
            </p>
            <p className="text-ink-muted leading-relaxed text-[17px]">
              Parohia nu este doar zid de piatră, ci inimile celor ce cred și năzuiesc spre cele
              de sus.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Împreună slujitori */}
      <section className="bg-cream-card py-16">
        <div className="container max-w-3xl text-center">
          <FadeIn>
            <Cross className="h-10 w-10 text-burgundy mx-auto mb-4" />
            <SectionEyebrow align="center">Slujitori întru Hristos</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-5">
              Împreună slujitori întru <em className="italic text-burgundy">Hristos</em>
            </h2>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-4">
              Sub acoperământul Cuvioasei Teodora, dorim să clădim nu doar o biserică, ci o obște
              a dragostei, a milosteniei și a viețuirii întru Hristos. Ne dorim ca acest loc să fie
              un liman duhovnicesc pentru cei osteniți, un izvor de har pentru cei ce caută pacea
              și o casă pentru cei ce vor să se apropie de Dumnezeu.
            </p>
            <p className="text-ink-muted leading-relaxed text-[17px] mb-4">
              Zidirea cea din afară se va face, cu voia Domnului, dar mai întâi se zidește biserica
              cea din suflete. Ne rugăm ca toți cei care citesc aceste rânduri să fie parte vie din
              această lucrare, cu rugăciunea, cu fapta bună, cu gândul cel curat.
            </p>
            <p className="font-display text-xl italic text-burgundy mt-8 mb-8">
              Fie ca, prin mila Domnului și prin ocrotirea Cuvioasei Teodora, să ajungem a vedea
              această biserică înălțată nu doar în piatră, ci mai ales în inimile oamenilor.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/misiune"><Button size="lg">Misiunea parohiei</Button></Link>
              <Link href="/contact"><Button variant="outline" size="lg">Contactează-ne</Button></Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
