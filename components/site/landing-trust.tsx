import { ShieldCheck, ReceiptText, Church } from 'lucide-react';
import { FadeIn } from '@/components/magicui/fade-in';

/**
 * Trust strip — three reassurances that lift donation conversion: secure
 * payment, transparent costs, and the spiritual promise. Placed right after the
 * hero so the visitor's first objection is answered before scrolling.
 */
const ITEMS = [
  { Icon: ShieldCheck, title: 'Plată securizată', note: 'prin Stripe · SSL · card sau transfer' },
  { Icon: ReceiptText, title: '100% transparent', note: 'vezi exact unde merge fiecare dar' },
  { Icon: Church, title: 'Pomenire la Liturghie', note: 'numele tău, în rugăciunea parohiei' },
] as const;

export function LandingTrust() {
  return (
    <section className="border-y border-gold/25 bg-cream-card/50">
      <div className="container py-5 sm:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {ITEMS.map((it, i) => (
            <FadeIn key={it.title} delay={i * 0.08}>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                  <it.Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-burgundy leading-tight">{it.title}</p>
                  <p className="text-xs text-ink-soft">{it.note}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
