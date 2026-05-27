import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container py-24 text-center">
      <p className="font-serif italic text-coral text-sm uppercase tracking-[0.18em]">404</p>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold text-navy mt-3 mb-4">
        Pagina nu a fost găsită
      </h1>
      <p className="text-ink-muted mb-8 max-w-md mx-auto">
        Linkul accesat nu mai există sau a fost mutat. Întoarce-te la pagina principală.
      </p>
      <Link href="/">
        <Button size="lg">Înapoi acasă</Button>
      </Link>
    </div>
  );
}
