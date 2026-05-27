import Link from 'next/link';
import { Search } from 'lucide-react';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import { getImages } from '@/lib/images';

const NAV = [
  { label: 'Despre', href: '/despre' },
  { label: 'Misiune', href: '/misiune' },
  { label: 'Campanii', href: '/campanii' },
  { label: 'Noutăți', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Redirecționează', href: '/redirectioneaza-3-5' },
];

export async function SiteHeader() {
  const IMG = await getImages();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-24 sm:h-28 items-center justify-between gap-6">
        <Logo iconSrc={IMG.parishLogo} />

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-serif text-[15px] font-medium text-navy transition-colors hover:text-coral"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Caută"
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-navy hover:bg-cream-card transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link href="/doneaza">
            <Button variant="cream" size="sm">Donează</Button>
          </Link>
          <Link href="/contact">
            <Button variant="default" size="sm">Mesaj</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
