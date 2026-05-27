import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-3xl font-bold text-brand-dark mb-2">Pagina nu a fost găsită</h1>
      <p className="text-stone-600 mb-6">Linkul accesat nu mai există sau a fost mutat.</p>
      <Link href="/" className="text-brand underline">
        Întoarce-te la pagina principală
      </Link>
    </div>
  );
}
