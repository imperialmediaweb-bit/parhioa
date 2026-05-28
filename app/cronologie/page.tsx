import { Hero } from '@/components/site/hero';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import { FadeIn } from '@/components/magicui/fade-in';
import { OrthodoxCross } from '@/components/site/cross-divider';

export const metadata = {
  title: 'Cronologie',
  description:
    'Pașii sfintei zidiri — momentele cheie din parcursul Parohiei Sf. Cuvioasă Teodora de la Sihla.',
};

type Milestone = {
  date: string;
  dateLabel: string;
  eyebrow: string;
  title: string;
  body: string;
  symbol?: string;
};

const MILESTONES: Milestone[] = [
  {
    date: '11 septembrie 2025',
    dateLabel: 'Început',
    eyebrow: 'Început cu binecuvântare',
    title: 'Curățirea și pregătirea locului',
    body: 'În această zi de pomenire și bucurie duhovnicească, s-a săvârșit cel dintâi pas către ridicarea bisericii parohiale — curățirea și pregătirea terenului. Locul ce zăcea nelucrat a fost înveșmântat prin osteneala și jertfa celor cu inimă bună, ca să fie vrednic de a primi, la vremea rânduită, zidirea Casei Domnului.',
    symbol: '🚩',
  },
  {
    date: '13 octombrie 2025',
    dateLabel: 'Un nou pas',
    eyebrow: 'Moment de binecuvântare',
    title: 'O Troiță a credinței și nădejdii, ridicată pe locul viitoarei biserici',
    body: 'La această dată a fost așezată Troița care veghează peste locul unde va fi construită biserica parohială. Este primul semn vizibil al lucrării de ctitorie și un moment de mare emoție pentru comunitatea noastră.',
    symbol: '✛',
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
  },
  {
    date: '26 noiembrie 2025',
    dateLabel: 'Pregătiri sfințire',
    eyebrow: 'Pregătiri pentru Sfințire',
    title: 'Pregătiri pentru Sfințirea Locului și Punerea Pietrei de Temelie',
    body: 'Cu ajutorul lui Dumnezeu am început pregătirile pentru Slujba de Sfințire a locului, Punerea Pietrei de Temelie și Sfințirea Troiței. Comunitatea s-a adunat în jurul acestei lucrări binecuvântate, cu rugăciune și nădejde.',
    symbol: '🛐',
  },
  {
    date: '1 decembrie 2025',
    dateLabel: 'Sfințirea locului',
    eyebrow: 'Praznic al obștii',
    title: 'Slujba de sfințire a locului pentru biserică',
    body: 'Ziua de 1 decembrie 2025 rămâne adânc întipărită în sufletele credincioșilor parohiei noastre. A fost o zi cu o încărcătură duhovnicească deosebită, în care s-a săvârșit slujba de sfințire a locului pentru biserica cu hramul „Sfânta Cuvioasă Teodora de la Sihla".',
    symbol: '☩',
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

        <div className="relative max-w-5xl mx-auto">
          {/* Center vertical line with golden gradient */}
          <div
            className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 top-3 bottom-3 w-px"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, #EAC784 8%, #c9a361 50%, #EAC784 92%, transparent 100%)',
            }}
            aria-hidden
          />

          <ol className="relative space-y-10 sm:space-y-16">
            {MILESTONES.map((m, i) => {
              const onRight = i % 2 === 1;
              return (
                <li key={m.date} className="relative">
                  {/* Cross medallion on the line */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 top-3 z-10">
                    <div
                      className="relative flex h-12 w-12 items-center justify-center rounded-full text-cream shadow-[0_6px_22px_-6px_rgba(101,26,20,0.7)] ring-2 ring-gold/65"
                      style={{
                        background: 'linear-gradient(180deg, #7a201a 0%, #4f120d 100%)',
                      }}
                    >
                      <span
                        className="absolute inset-0 rounded-full blur-md bg-gold/30 -z-10"
                        aria-hidden
                      />
                      <span className="text-base leading-none">☩</span>
                    </div>
                  </div>

                  {/* Row: card | date  OR  date | card on alternating sides on desktop */}
                  <div className="ml-20 sm:ml-0 sm:grid sm:grid-cols-2 sm:gap-12 items-start">
                    {/* CARD */}
                    <FadeIn
                      delay={i * 0.05}
                      className={`${onRight ? 'sm:order-2 sm:col-start-2' : 'sm:order-1 sm:col-start-1'}`}
                    >
                      <article
                        className="relative rounded-[20px] p-6 sm:p-7 shadow-[0_22px_46px_-26px_rgba(101,26,20,0.5)] overflow-hidden"
                        style={{
                          background:
                            'linear-gradient(180deg, #FBF6EE 0%, #F5EBD7 55%, #EFE0C0 100%)',
                        }}
                      >
                        {/* parchment grain */}
                        <div
                          className="absolute inset-0 opacity-25 mix-blend-multiply pointer-events-none"
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.38 0 0 0 0 0.18 0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                          }}
                        />
                        {/* double border */}
                        <div className="absolute inset-2 rounded-[14px] border border-gold/55 pointer-events-none" />
                        <div className="absolute inset-3 rounded-[11px] border border-burgundy/20 pointer-events-none" />

                        <div className="relative">
                          <p className="font-ceremonial uppercase text-[10px] tracking-[0.28em] text-gold-dark mb-2 flex items-center gap-2">
                            <span className="text-burgundy">☩</span>
                            {m.eyebrow}
                          </p>
                          <h3 className="font-display text-xl sm:text-2xl text-burgundy-dark leading-tight mb-3">
                            {m.title}
                          </h3>
                          <p className="text-[15px] text-burgundy/80 leading-relaxed font-serif">
                            {m.body}
                          </p>

                          {/* Mobile date inside card */}
                          <p className="sm:hidden mt-4 pt-3 border-t border-gold/30 font-ceremonial uppercase text-[10px] tracking-[0.22em] text-burgundy-dark flex items-center gap-2">
                            <span className="text-gold">☩</span>
                            {m.date} · {m.dateLabel}
                          </p>
                        </div>
                      </article>
                    </FadeIn>

                    {/* DATE COLUMN (desktop) */}
                    <FadeIn
                      delay={i * 0.05 + 0.05}
                      className={`hidden sm:block pt-2 ${
                        onRight
                          ? 'sm:order-1 sm:col-start-1 sm:text-right'
                          : 'sm:order-2 sm:col-start-2 sm:text-left'
                      }`}
                    >
                      <p className="font-display text-2xl lg:text-3xl text-burgundy-dark leading-tight">
                        {m.date}
                      </p>
                      <p className="font-serif italic text-burgundy/70 mt-1">{m.dateLabel}</p>
                    </FadeIn>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Closing flourish */}
          <div className="relative flex justify-center mt-14">
            <div className="relative flex flex-col items-center">
              <OrthodoxCross height={56} />
              <p className="mt-4 font-ceremonial uppercase text-[10px] tracking-[0.32em] text-gold-dark">
                Drumul continuă
              </p>
              <p className="mt-2 font-serif italic text-burgundy/65 text-center max-w-sm">
                „Cu rugăciune și răbdare zidim biserica nu doar din piatră, ci și din inimi."
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
