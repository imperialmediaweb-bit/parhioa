'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';

interface PostData {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  featuredUrl?: string;
}

interface Props {
  initial?: PostData;
  adminKey?: string;
}

export function PostEditor({ initial, adminKey }: Props) {
  const [title, setTitle] = useState(initial?.title || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '');
  const [content, setContent] = useState(initial?.content || '');
  const [status, setStatus] = useState(initial?.status || 'publish');
  const [featuredUrl, setFeaturedUrl] = useState(initial?.featuredUrl || '');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  // Auto-slug from title when slug is empty
  const onTitleChange = (v: string) => {
    setTitle(v);
    if (!initial && !slug) {
      setSlug(
        v
          .toLowerCase()
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 80),
      );
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setError('Completează titlul, slug-ul și conținutul.');
      return;
    }
    startTransition(async () => {
      const res = await fetch('/api/admin/posts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: initial?.id,
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          content,
          status,
          featuredUrl: featuredUrl.trim() || null,
          key: adminKey,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || 'Eroare la salvare.');
        return;
      }
      const keyParam = adminKey ? `?key=${encodeURIComponent(adminKey)}` : '';
      router.push(`/admin/blog${keyParam}`);
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field
        label="Titlu"
        value={title}
        onChange={onTitleChange}
        placeholder="Ex: Sărbătoarea Sfintei Cuvioase Teodora — program și pomelnice"
        required
      />
      <Field
        label="Slug (URL)"
        value={slug}
        onChange={setSlug}
        placeholder="ex: sarbatoarea-sfintei-teodora-2026"
        required
        mono
      />
      <Field
        label="Rezumat (excerpt)"
        value={excerpt}
        onChange={setExcerpt}
        placeholder="O propoziție scurtă care apare în lista de articole."
        textarea
        rows={2}
      />
      <Field
        label="Imagine principală (URL)"
        value={featuredUrl}
        onChange={setFeaturedUrl}
        placeholder="https://res.cloudinary.com/... (opțional)"
        mono
      />
      <Field
        label="Conținut (HTML sau text)"
        value={content}
        onChange={setContent}
        placeholder="<p>Conținutul articolului…</p>"
        textarea
        rows={16}
        mono
      />

      <div>
        <label className="text-sm font-medium text-ink block mb-2">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border bg-white"
        >
          <option value="publish">Publicat (vizibil pe site)</option>
          <option value="draft">Ciornă (ascuns)</option>
        </select>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-burgundy text-cream font-medium hover:bg-burgundy-dark disabled:opacity-60 transition-colors"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Se salvează…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Salvează
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-border bg-white hover:bg-cream-card transition-colors"
        >
          Anulează
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  textarea = false,
  mono = false,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  mono?: boolean;
  rows?: number;
}) {
  const baseClass = `w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-burgundy bg-white ${
    mono ? 'font-mono text-sm' : ''
  }`;
  return (
    <div>
      <label className="text-sm font-medium text-ink block mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={baseClass + ' resize-y'}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
    </div>
  );
}
