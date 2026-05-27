const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export type Media = {
  id: number;
  url: string;
  alt: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
};

export type Page = {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured: Media | null;
  publishedAt: string | null;
};

export type Post = Page & {
  categories: { id: number; slug: string; name: string }[];
  tags: { id: number; slug: string; name: string }[];
};

export type MenuItem = {
  id: number;
  label: string;
  url: string;
  order: number;
  parentId: number | null;
};

export type Menu = { id: number; slug: string; name: string; items: MenuItem[] };

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: 60 },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  pages: () => fetchJson<Page[]>('/pages'),
  page: (slug: string) => fetchJson<Page>(`/pages/${slug}`),
  posts: (params?: { take?: number; skip?: number; category?: string }) => {
    const q = new URLSearchParams();
    if (params?.take) q.set('take', String(params.take));
    if (params?.skip) q.set('skip', String(params.skip));
    if (params?.category) q.set('category', params.category);
    const qs = q.toString();
    return fetchJson<Post[]>(`/posts${qs ? `?${qs}` : ''}`);
  },
  post: (slug: string) => fetchJson<Post>(`/posts/${slug}`),
  menu: (slug: string) => fetchJson<Menu>(`/menus/${slug}`),
};

export async function safeMenu(slug: string): Promise<Menu | null> {
  try {
    return await api.menu(slug);
  } catch {
    return null;
  }
}
