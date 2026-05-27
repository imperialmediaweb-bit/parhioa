'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
}

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Deschide meniul"
        className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full text-navy hover:bg-cream-card transition"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          'lg:hidden fixed inset-0 bg-navy-dark/60 backdrop-blur-sm z-[100] transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className={cn(
          'lg:hidden fixed right-0 top-0 bottom-0 w-[88%] max-w-sm bg-cream z-[101] shadow-2xl transition-transform duration-300 flex flex-col',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
        aria-label="Meniu navigare"
      >
        {/* Header bar inside drawer */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-white">
          <span className="font-ecclesia text-sm uppercase tracking-[0.18em] text-burgundy">
            Meniu
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Închide meniul"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-card hover:bg-cream-deep transition"
          >
            <X className="h-5 w-5 text-burgundy" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-5">
          <ul className="space-y-1">
            {items.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'block px-4 py-4 rounded-2xl font-display text-lg transition',
                      active
                        ? 'bg-burgundy text-white shadow'
                        : 'text-navy hover:bg-cream-card',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom action area */}
        <div className="p-5 border-t border-border bg-white space-y-2">
          <Link
            href="/donations/strangere-de-fonduri-pentru-construirea-bisericii"
            className="block"
          >
            <Button variant="default" size="lg" className="w-full">
              <Heart className="h-4 w-4 mr-2" fill="currentColor" /> Donează
            </Button>
          </Link>
          <Link href="/contact" className="block">
            <Button variant="cream" size="lg" className="w-full">
              <Mail className="h-4 w-4 mr-2" /> Trimite mesaj
            </Button>
          </Link>
          <p className="text-xs text-ink-soft text-center mt-3 italic">
            Parohia Sf. Cuv. Teodora de la Sihla · Botoșani
          </p>
        </div>
      </aside>
    </>
  );
}
