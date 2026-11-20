import { Hero } from '@/components/site/hero';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { FadeIn } from '@/components/magicui/fade-in';
import {
  TimelineExperience,
  type Milestone,
} from '@/components/site/timeline-experience';

export const metadata = {
  title: 'Cronologie',
  description:
    'Pașii sfintei zidiri — momentele cheie din parcursul Parohiei Sf. Cuvioasă Teodora de la Sihla.',
};

const MILESTONES: Milestone[] = [
  {
    date: '11 septembrie 2025',
    dateLabel: 'Început',
    eyebrow: 'Început cu binecuvântare',
    title: 'Curățirea și pregătirea locului',
    body: 'În această zi de pomenire și bucurie duhovnicească, s-a săvârșit cel dintâi pas către ridicarea bisericii parohiale — curățirea și pregătirea terenului. Locul ce zăcea nelucrat a fost înveșmântat prin osteneala și jertfa celor cu inimă bună, ca să fie vrednic de a primi, la vremea rânduită, zidirea Casei Domnului.',
    symbol: '🚩',
    image: 'https://pub-49f4280024fa4ca2b8a4f6323442efe8.r2.dev/parhioa/wp-28194.jpg',
    imageAlt: 'Curățirea și pregătirea terenului pentru biserică',
  },
  {
    date: '13 octombrie 2025',
    dateLabel: 'Un nou pas',
    eyebrow: 'Moment de binecuvântare',
    title: 'O Troiță a credinței și nădejdii, ridicată pe locul viitoarei biserici',
    body: 'La această dată a fost așezată Troița care veghează peste locul unde va fi construită biserica parohială. Este primul semn vizibil al lucrării de ctitorie și un moment de mare emoție pentru comunitatea noastră.',
    symbol: '✛',
    image: 'https://pub-49f4280024fa4ca2b8a4f6323442efe8.r2.dev/parhioa/wp-28243.jpg',
    imageAlt: 'Troița ridicată pe locul viitoarei biserici',
  },
  {
    date: '30 octombrie 2025',
    dateLabel: 'Autorizația de construire',
    eyebrow: 'Moment decisiv al ctitoriei',
    title: 'Autorizația de Construire a fost emisă',
    body: 'Cu ajutorul și binecuvântarea lui Dumnezeu, după doi ani de osteneli, rugăciuni și răbdare, parohia a obținut Autorizația de Construire pentru Biserică, Paraclis, anexe și împrejmuire. Este un pas hotărâtor în lucrarea de ctitorie și o chemare către toți cei ce iubesc Biserica lui Hristos să devină ctitori ai noii biserici.',
    symbol: '📜',
  },
  {
    date: '19 noiembrie 2025',
    dateLabel: 'Racordarea electrică',
    eyebrow: 'Un pas important spre ctitorie',
    title: 'Racordarea electrică a fost realizată',
    body: 'Au fost finalizate lucrările de racordare la rețeaua electrică pe terenul parohiei. A fost montată o priză de lucru și cablul pentru proiectorul ce va lumina Sfânta Troiță, pregătind locul pentru începerea lucrărilor de construire a bisericii.',
    symbol: '⚡',
    image: 'https://pub-49f4280024fa4ca2b8a4f6323442efe8.r2.dev/parhioa/wp-28280.png',
    imageAlt: 'Racordarea electrică pe terenul parohiei',
  },
  {
    date: '26 noiembrie 2025',
    dateLabel: 'Pregătiri sfințire',
    eyebrow: 'Pregătiri pentru Sfințire',
    title: 'Pregătiri pentru Sfințirea Locului și Punerea Pietrei de Temelie',
    body: 'Cu ajutorul lui Dumnezeu am început pregătirile pentru Slujba de Sfințire a locului, Punerea Pietrei de Temelie și Sfințirea Troiței. Comunitatea s-a adunat în jurul acestei lucrări binecuvântate, cu rugăciune și nădejde.',
    symbol: '🛐',
    image: 'https://pub-49f4280024fa4ca2b8a4f6323442efe8.r2.dev/parhioa/wp-28299.png',
    imageAlt: 'Pregătiri pentru sfințirea locului și punerea pietrei de temelie',
  },
  {
    date: '1 decembrie 2025',
    dateLabel: 'Sfințirea locului',
    eyebrow: 'Praznic al obștii',
    title: 'Slujba de sfințire a locului pentru biserică',
    body: 'Ziua de 1 decembrie 2025 rămâne adânc întipărită în sufletele credincioșilor parohiei noastre. A fost o zi cu o încărcătură duhovnicească deosebită, în care s-a săvârșit slujba de sfințire a locului pentru biserica cu hramul „Sfânta Cuvioasă Teodora de la Sihla".',
    symbol: '☩',
    image: 'https://pub-49f4280024fa4ca2b8a4f6323442efe8.r2.dev/parhioa/wp-28305.jpg',
    imageAlt: 'Slujba de sfințire a locului pentru biserică',
  },
  {
    date: 'Noiembrie 2026',
    dateLabel: 'Au început lucrările',
    eyebrow: 'Început de șantier',
    title: 'Au început lucrările de construire — turnarea fundației',
    body: 'Cu ajutorul lui Dumnezeu și al ctitorilor, au început lucrările pe șantier: pregătirea terenului, așezarea armăturilor și turnarea fundației pe care se va înălța sfântul lăcaș. Primele imagini de pe șantier pot fi urmărite în filmul de pe pagina principală.',
    symbol: '🪨',
    image: '/santier/fundatie.jpg',
    imageAlt: 'Turnarea fundației noii biserici — primele lucrări pe șantier',
  },
];

export default function CronologiePage() {
  return (
    <>
      <Hero
        title="Cronologie"
        subtitle="Pașii sfintei zidiri — momentele cheie din parcursul parohiei noastre."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Cronologie' }]}
      />

      <section className="container py-14 sm:py-20">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <SectionEyebrow align="center">Pașii sfintei zidiri</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
              Fiecare pas, <em className="italic text-burgundy">o binecuvântare</em>
            </h2>
            <p className="text-ink-muted mt-5 font-serif italic text-[17px]">
              Aici se arată drumul către zidirea Casei Domnului: de la curățirea locului, prin
              osteneală și rugăciune, până la vremea binecuvântată a ridicării sfântului lăcaș.
            </p>
          </div>
        </FadeIn>

        <TimelineExperience milestones={MILESTONES} />
      </section>
    </>
  );
}
