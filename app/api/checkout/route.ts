import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../lib/stripe';

export const dynamic = 'force-dynamic';

/**
 * POST /api/checkout
 * Body: { amount: number (RON), recurring?: boolean, campaign?: string, mode?: 'card' | 'sepa' }
 *
 * Creates a Stripe Checkout Session and returns the URL.
 * - For one-time donations: mode='payment'
 * - For recurring monthly: mode='subscription'
 * - Card + SEPA Direct Debit (bank transfer) are both accepted
 */
export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe nu este configurat. Setează STRIPE_SECRET_KEY în Railway.' },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();
    const amount = Number(body.amount);
    const recurring = !!body.recurring;
    const campaign = String(body.campaign || 'zidirea-bisericii');

    if (!amount || amount < 5 || amount > 100000) {
      return NextResponse.json(
        { error: 'Suma trebuie să fie între 5 și 100.000 RON.' },
        { status: 400 },
      );
    }

    const origin = req.headers.get('origin') || req.nextUrl.origin;
    const amountBani = Math.round(amount * 100);

    const session = await stripe.checkout.sessions.create({
      mode: recurring ? 'subscription' : 'payment',
      payment_method_types: recurring ? ['card', 'sepa_debit'] : ['card'],
      line_items: [
        {
          price_data: {
            currency: 'ron',
            unit_amount: amountBani,
            recurring: recurring ? { interval: 'month' } : undefined,
            product_data: {
              name:
                campaign === 'zidirea-bisericii'
                  ? 'Donație – Zidirea bisericii'
                  : `Donație – ${campaign}`,
              description: 'Parohia Sf. Cuvioasă Teodora de la Sihla, Botoșani',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/doneaza/multumim?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/doneaza`,
      metadata: {
        campaign,
        recurring: String(recurring),
      },
      locale: 'ro',
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      { error: err?.message || 'A apărut o eroare la procesarea plății.' },
      { status: 500 },
    );
  }
}
