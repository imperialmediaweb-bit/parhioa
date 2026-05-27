import Link from 'next/link';
import { CheckCircle2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Mulțumim' };

export default async function MultumimPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  let amount: number | null = null;
  let recurring = false;

  if (searchParams.session_id && stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(searchParams.session_id);
      amount = session.amount_total ? session.amount_total / 100 : null;
      recurring = session.metadata?.recurring === 'true';
    } catch {}
  }

  return (
    <div className="container py-20 max-w-2xl text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-burgundy text-white mb-6">
        <CheckCircle2 className="h-12 w-12" />
      </div>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold text-burgundy mb-4">
        Mulțumim!
      </h1>
      {amount && (
        <p className="font-display text-2xl text-ink mb-4">
          Donația ta de <strong>{amount} RON</strong>
          {recurring && ' lunar'} a fost primită.
        </p>
      )}
      <p className="text-ink-muted text-lg leading-relaxed mb-8">
        Numele tău va fi pomenit la Sfânta Liturghie. Domnul Iisus Hristos să-ți răsplătească
        însutit jertfa și dragostea cu care ai răspuns acestei chemări.
      </p>

      <div className="bg-cream-card rounded-2xl p-6 mb-8">
        <Heart className="h-6 w-6 text-burgundy mx-auto mb-3" />
        <p className="font-serif italic text-ink-muted">
          „Dăruind pentru Biserică, te faci moștenitor al comorilor veșnice."
        </p>
        <p className="font-ceremonial text-xs uppercase tracking-[0.18em] text-burgundy mt-3">
          Sfântul Ioan Damaschin
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/">
          <Button variant="default" size="lg">
            Înapoi acasă
          </Button>
        </Link>
        <Link href="/blog">
          <Button variant="outline" size="lg">
            Vezi noutățile parohiei
          </Button>
        </Link>
      </div>
    </div>
  );
}
