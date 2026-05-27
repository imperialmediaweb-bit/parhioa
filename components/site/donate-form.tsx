'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Heart,
  CreditCard,
  Building,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type PresetTier = {
  amount: number;
  /** Symbolic element of the church the donation represents */
  symbol: string;
  /** Decorative emoji */
  icon: string;
  /** Subtitle line */
  subtitle?: string;
};

const DEFAULT_PRESETS: PresetTier[] = [
  { amount: 10, symbol: '1 cărămidă', icon: '🧱', subtitle: 'fundația' },
  { amount: 25, symbol: '3 cărămizi', icon: '🧱', subtitle: 'pereții' },
  { amount: 50, symbol: 'O piatră', icon: '🪨', subtitle: 'temelia' },
  { amount: 100, symbol: 'O grindă', icon: '🪵', subtitle: 'acoperișul' },
  { amount: 250, symbol: 'Un vitraliu', icon: '🪟', subtitle: 'lumina' },
  { amount: 500, symbol: 'O icoană', icon: '🕯️', subtitle: 'altarul' },
];

interface DonateFormProps {
  campaign?: string;
  campaignTitle?: string;
  presets?: PresetTier[];
  defaultAmount?: number;
  className?: string;
}

export function DonateForm({
  campaign = 'strangere-de-fonduri-pentru-construirea-bisericii',
  campaignTitle = 'Zidirea bisericii',
  presets = DEFAULT_PRESETS,
  defaultAmount = 50,
  className,
}: DonateFormProps) {
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [recurring, setRecurring] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const selectedAmount =
    customAmount && Number(customAmount) > 0 ? Number(customAmount) : amount;

  const selectedTier = presets.find((p) => p.amount === selectedAmount);

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
        <p className="font-ceremonial uppercase text-xs tracking-[0.22em] text-burgundy mb-2">
          {campaignTitle}
        </p>
        <h3 className="font-display text-2xl sm:text-3xl font-semibold leading-tight">
          Devino <em className="italic text-burgundy">ctitor</em>
        </h3>
        <p className="text-sm text-ink-muted mt-2 max-w-sm mx-auto">
          Fiecare dar este o parte vie din zidirea bisericii. Alege ce vrei să dăruiești.
        </p>
      </div>

      {/* One-time / Recurring toggle */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-cream-card rounded-full">
        <button
          type="button"
          onClick={() => setRecurring(false)}
          className={cn(
            'py-2.5 px-4 rounded-full text-sm font-semibold transition-all',
            !recurring
              ? 'bg-burgundy text-white shadow-md'
              : 'text-ink-muted hover:text-burgundy',
          )}
        >
          O singură dată
        </button>
        <button
          type="button"
          onClick={() => setRecurring(true)}
          className={cn(
            'py-2.5 px-4 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-1.5',
            recurring
              ? 'bg-burgundy text-white shadow-md'
              : 'text-ink-muted hover:text-burgundy',
          )}
        >
          Lunar <Sparkles className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Preset tiers — symbolic bricks/stones */}
      <div>
        <p className="text-sm font-medium text-ink mb-3 flex items-center gap-2">
          <span className="h-px flex-1 bg-border" />
          Alege jertfa ta
          <span className="h-px flex-1 bg-border" />
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {presets.map((tier) => {
            const isActive = amount === tier.amount && !customAmount;
            return (
              <button
                key={tier.amount}
                type="button"
                onClick={() => {
                  setAmount(tier.amount);
                  setCustomAmount('');
                }}
                className={cn(
                  'group relative rounded-2xl border-2 p-4 text-left transition-all duration-200',
                  isActive
                    ? 'border-burgundy bg-gradient-to-br from-burgundy via-burgundy-dark to-burgundy text-white shadow-lg scale-[1.03]'
                    : 'border-border bg-white hover:border-burgundy/60 hover:shadow-md text-ink',
                )}
              >
                <div
                  className={cn(
                    'text-2xl mb-1 transition-transform group-hover:scale-110',
                    isActive && 'animate-pulse',
                  )}
                >
                  {tier.icon}
                </div>
                <div className="font-display font-bold text-xl leading-none">
                  {tier.amount}{' '}
                  <span className={cn('text-xs font-sans', isActive ? 'text-gold' : 'text-ink-soft')}>
                    RON
                  </span>
                </div>
                <div
                  className={cn(
                    'mt-1.5 text-[12px] font-ceremonial uppercase tracking-wider',
                    isActive ? 'text-gold' : 'text-burgundy',
                  )}
                >
                  {tier.symbol}
                </div>
                {tier.subtitle && (
                  <div
                    className={cn(
                      'text-[11px] italic mt-0.5',
                      isActive ? 'text-white/80' : 'text-ink-soft',
                    )}
                  >
                    pentru {tier.subtitle}
                  </div>
                )}
                {isActive && (
                  <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gold flex items-center justify-center shadow-md">
                    <svg className="h-3.5 w-3.5 text-burgundy" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom amount */}
      <div>
        <label className="text-sm font-medium text-ink mb-2 block">
          Sau o jertfă personalizată
        </label>
        <div className="relative">
          <input
            type="number"
            min={5}
            step={1}
            placeholder="ex: 75"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-full px-5 py-4 pr-16 rounded-2xl border-2 border-border focus:outline-none focus:border-burgundy text-lg font-bold text-ink transition-colors"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-ink-muted font-medium text-sm">
            RON
          </span>
        </div>
      </div>

      {/* Summary line */}
      {selectedAmount > 0 && (
        <div className="bg-gradient-to-r from-cream-card via-cream-deep to-cream-card rounded-2xl p-4 text-center">
          <p className="text-sm text-ink-muted">
            Doneazi <strong className="text-burgundy text-lg">{selectedAmount} RON</strong>
            {recurring && <span className="text-sm"> / lună</span>}
            {selectedTier && (
              <span className="block mt-1 text-xs">
                {selectedTier.icon} {selectedTier.symbol} pentru{' '}
                <em>{selectedTier.subtitle || 'biserică'}</em>
              </span>
            )}
          </p>
        </div>
      )}

      {/* Payment methods info */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-muted justify-center">
        <span className="flex items-center gap-1.5">
          <CreditCard className="h-4 w-4 text-burgundy" /> Card bancar
        </span>
        {recurring && (
          <span className="flex items-center gap-1.5">
            <Building className="h-4 w-4 text-burgundy" /> SEPA (debit direct)
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-burgundy" /> Securizat de Stripe
        </span>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={loading || !selectedAmount}
        className="w-full text-base shadow-lg hover:shadow-xl"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Se procesează…
          </>
        ) : (
          <>
            <Heart className="h-5 w-5 mr-2" fill="currentColor" />
            Donează {selectedAmount} RON {recurring && '/ lună'}
          </>
        )}
      </Button>

      <p className="text-[11px] text-center text-ink-soft leading-relaxed">
        Plată sigură procesată prin Stripe. Numele tău va fi pomenit la Sfânta Liturghie.
      </p>
    </form>
  );
}
