import Link from 'next/link';
import { safeMenu } from '@/lib/api';

export async function Header() {
  const menu = await safeMenu('primary');
  const items = menu?.items.filter((i) => !i.parentId) || [];

  return (
    <header className="bg-brand-dark text-white shadow">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
        <Link href="/" className="text-xl font-semibold tracking-wide">
          Parohia Sf. Teodora de la Sihla
        </Link>
        <nav className="flex gap-5 text-sm">
          {items.length === 0 ? (
            <>
              <Link href="/" className="hover:text-brand-light">Acasă</Link>
              <Link href="/blog" className="hover:text-brand-light">Blog</Link>
            </>
          ) : (
            items.map((item) => (
              <Link
                key={item.id}
                href={normalizeHref(item.url)}
                className="hover:text-brand-light"
              >
                {item.label}
              </Link>
            ))
          )}
        </nav>
      </div>
    </header>
  );
}

function normalizeHref(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname || '/';
  } catch {
    return url.startsWith('/') ? url : `/${url}`;
  }
}
