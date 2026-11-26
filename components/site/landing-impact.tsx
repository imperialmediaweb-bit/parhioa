import Link from 'next/link';
import { FadeIn } from '@/components/magicui/fade-in';
import { SectionEyebrow } from './section-eyebrow';

/**
 * „Ce zidești cu darul tău" — concrete, price-anchored impact cards that mirror
 * the donation presets (brick 2,90 lei/buc). Informational + a gentle CTA to the
 * donate form. No money sum of the campaign is shown.
 */
const ITEMS = [
  { icon: '🧱', title: '10 cărămizi', price: '29 lei', note: 'temelia zidului — 2,90 lei bucata' },
  { icon: '🪨', title: 'Un sac de mortar', price: '50 lei', note: 'leagă cărămizile între ele' },
  { icon: '🛠️', title: '1 m² de tencuială', price: '100 lei', note: 'pereții care îmbracă biserica' },
  { icon: '🧱', title: '1 m² de zidărie', price: '250 lei', note: 'un petic întreg de zid' },
  { icon: '🪵', title: 'O grindă', price: '500 lei', note: 'acoperișul de deasupra altarului' },
  { icon: '🪟', title: 'O fereastră', price: '1000 lei', note: 'lumina care intră în casa Domnului' },
] as const;

export function LandingImpact() {
  return (
    <section className="container py-14 sm:py-20">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-10">
            <SectionEyebrow align="center">Fiecare dar zidește</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-burgundy">
              Ce <em className="italic">zidești</em> cu darul tău
            </h2>
            <p className="text-ink-muted mt-3 max-w-2xl mx-auto leading-relaxed">
              Fiecare sumă are un chip: o cărămidă, o grindă, o fereastră. Alege cât dăruiești —
              restul îl zidim împreună.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {ITEMS.map((it, i) => (
            <FadeIn key={it.title} delay={i * 0.06}>
              <Link
                href="#doneaza"
                className="group block h-full rounded-3xl border border-gold/40 bg-gradient-to-br from-[#fdfaf2] to-[#f4e8cd] p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(101,26,20,0.5)] hover:border-gold"
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl transition-transform group-hover:scale-110">{it.icon}</span>
                  <span className="font-display text-xl text-burgundy">{it.price}</span>
                </div>
                <h3 className="font-display text-lg text-navy mt-4">{it.title}</h3>
                <p className="text-sm text-ink-soft mt-1 leading-relaxed">{it.note}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-ceremonial uppercase tracking-[0.18em] text-burgundy group-hover:gap-2 transition-all">
                  Dăruiește <span aria-hidden>→</span>
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>

        <p className="text-center text-[12px] text-ink-soft italic mt-6 max-w-2xl mx-auto">
          Sumele și unitățile sunt orientative — fiecare donație contribuie la zidirea bisericii în
          ansamblu, nu la un element anume.
        </p>
      </div>
    </section>
  );
}
