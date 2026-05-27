'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Heart, CreditCard, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRESET_AMOUNTS = [50, 100, 200, 500, 1000];

interface DonateFormProps {
  campaign?: string;
  campaignTitle?: string;
  className?: string;
}

export function DonateForm({
  campaign = 'zidirea-bisericii',
  campaignTitle = 'Zidirea bisericii',
  className,
}: DonateFormProps) {
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [recurring, setRecurring] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const selectedAmount =
    customAmount && Number(customAmount) > 0 ? Number(customAmount) : amount;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedAmount || selectedAmount < 5) {
      setError('Suma minimă este 5 RON.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedAmount, recurring, campaign }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Nu am putut iniția plata.');
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'Eroare. Încearcă din nou.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className={cn('space-y-6', className)}>
      <div className="text-center">
        <p className="font-ceremonial uppercase text-xs tracking-[0.2em] text-burgundy mb-2">
          {campaignTitle}
        </p>
        <h3 className="font-display text-2xl sm:text-3xl font-semibold">Donează cu inimă</h3>
      </div>

      {/* One-time / Recurring toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-cream-card rounded-full">
        <button
          type="button"
          onClick={() => setRecurring(false)}
          className={cn(
            'py-3 px-4 rounded-full text-sm font-semibold transition',
            !recurring
              ? 'bg-burgundy text-white shadow'
              : 'text-ink-muted hover:text-burgundy',
          )}
        >
          O singură dată
        </button>
        <button
          type="button"
          onClick={() => setRecurring(true)}
          className={cn(
            'py-3 px-4 rounded-full text-sm font-semibold transition',
            recurring
              ? 'bg-burgundy text-white shadow'
              : 'text-ink-muted hover:text-burgundy',
          )}
        >
          Lunar (recurent)
        </button>
      </div>

      {/* Preset amounts */}
      <div>
        <p className="text-sm font-medium text-ink mb-3">Alege suma</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {PRESET_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAmount(a);
                setCustomAmount('');
              }}
              className={cn(
                'py-3 rounded-xl border-2 font-display font-semibold text-lg transition',
                amount === a && !customAmount
                  ? 'border-burgundy bg-burgundy text-white shadow-md'
                  : 'border-border hover:border-burgundy text-ink bg-white',
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Custom amount */}
      <div>
        <label className="text-sm font-medium text-ink mb-2 block">
          Sau introdu o sumă personalizată (RON)
        </label>
        <div className="relative">
          <input
            type="number"
            min={5}
            step={1}
            placeholder="ex: 250"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-full px-5 py-4 pr-16 rounded-2xl border-2 border-border focus:outline-none focus:border-burgundy text-lg font-semibold text-ink"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-ink-muted font-medium">
            RON
          </span>
        </div>
      </div>

      {/* Payment methods info */}
      <div className="bg-cream-card rounded-2xl p-4">
        <p className="text-xs uppercase font-semibold tracking-wider text-burgundy mb-3">
          Metode de plată
        </p>
        <div className="flex flex-wrap gap-3 text-sm text-ink-muted">
          <span className="flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-burgundy" /> Card bancar
          </span>
          {recurring && (
            <span className="flex items-center gap-1.5">
              <Building className="h-4 w-4 text-burgundy" /> Virament (SEPA)
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Heart className="h-4 w-4 text-burgundy" /> Securizat de Stripe
          </span>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={loading || !selectedAmount}
        className="w-full text-base"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Se procesează…
          </>
        ) : (
          <>
            Donează {selectedAmount} RON {recurring && '/ lună'}
          </>
        )}
      </Button>

      <p className="text-xs text-center text-ink-soft">
        Vei fi redirecționat către Stripe Checkout pentru a finaliza plata în siguranță.
      </p>
    </form>
  );
}
