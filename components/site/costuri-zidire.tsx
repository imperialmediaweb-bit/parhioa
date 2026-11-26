import { Landmark, Layers, HardHat, Coins } from 'lucide-react';

/**
 * „Cât costă zidirea" — transparency of the estimated masonry-stage costs, so
 * donors see where their gift goes. Figures are estimates for the current
 * (masonry) stage; they build trust and complement the donation campaign.
 */
const ROWS = [
  { icon: Landmark, label: 'Cărămidă', detail: '100.000 buc.', value: '290.000 lei' },
  { icon: Layers, label: 'Mortar', detail: '3.018 saci', value: '75.450 lei' },
  { icon: HardHat, label: 'Manoperă', detail: 'conform devizului', value: '52.480 lei' },
];

export function CosturiZidire() {
  return (
    <section className="container py-10 sm:py-14">
      <div className="max-w-3xl mx-auto rounded-3xl border border-gold/50 bg-gradient-to-br from-[#fdfaf2] to-[#f4e8cd] p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-burgundy text-cream">
            <Coins className="h-5 w-5" />
          </span>
          <h2 className="font-display text-xl sm:text-2xl text-burgundy">Cât costă zidirea</h2>
        </div>
        <p className="text-sm text-ink-soft mb-6">
          Transparent, ca să știi unde merge darul tău. Costuri estimative pentru etapa de zidărie.
        </p>

        <ul className="divide-y divide-gold/30">
          {ROWS.map((r) => (
            <li key={r.label} className="flex items-center gap-3 py-3">
              <span className="h-9 w-9 shrink-0 rounded-xl bg-burgundy/10 text-burgundy flex items-center justify-center">
                <r.icon className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display text-burgundy leading-tight">{r.label}</p>
                <p className="text-xs text-ink-soft">{r.detail}</p>
              </div>
              <p className="font-display text-ink whitespace-nowrap">{r.value}</p>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between rounded-2xl bg-burgundy text-cream px-5 py-4">
          <span className="font-display text-lg">Total estimativ</span>
          <span className="font-display text-xl sm:text-2xl">417.930 lei</span>
        </div>

        <p className="text-center text-sm italic text-burgundy/80 mt-5">
          „Casa Mea, casă de rugăciune se va chema." (Isaia 56, 7)
        </p>
        <p className="text-center text-xs text-ink-soft mt-1">
          O cărămidă pusă azi rămâne rugăciunea ta înaintea lui Dumnezeu.
        </p>
      </div>
    </section>
  );
}
