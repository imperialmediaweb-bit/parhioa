import 'dotenv/config';
import axios, { AxiosInstance } from 'axios';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

const WP_API = process.env.WORDPRESS_API_URL;
if (!WP_API) {
  throw new Error('WORDPRESS_API_URL is required in .env');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'parhioa';

const http: AxiosInstance = axios.create({
  baseURL: WP_API,
  timeout: 30000,
  headers: { 'User-Agent': 'parhioa-importer/1.0' },
});

async function fetchAll<T>(endpoint: string, perPage = 100): Promise<T[]> {
  const results: T[] = [];
  let page = 1;
  while (true) {
    try {
      const { data, headers } = await http.get<T[]>(endpoint, {
        params: { per_page: perPage, page, _embed: true },
      });
      results.push(...data);
      const totalPages = Number(headers['x-wp-totalpages'] || 1);
      if (page >= totalPages) break;
      page++;
    } catch (err: any) {
      if (err.response?.status === 400 && page > 1) break;
      throw err;
    }
  }
  return results;
}

async function uploadToCloudinary(url: string, wpId: number): Promise<{ url: string; publicId: string }> {
  const res = await cloudinary.uploader.upload(url, {
    folder: CLOUDINARY_FOLDER,
    public_id: `wp-${wpId}`,
    overwrite: false,
    resource_type: 'auto',
  });
  return { url: res.secure_url, publicId: res.public_id };
}

async function importMedia() {
  console.log('Importing media...');
  const items = await fetchAll<any>('/media');
  console.log(`  found ${items.length} media items`);

  for (const m of items) {
    const existing = await prisma.media.findUnique({ where: { wpId: m.id } });
    if (existing?.cloudinaryId) {
      console.log(`  skip ${m.id} (already uploaded)`);
      continue;
    }

    let cloudUrl = m.source_url;
    let publicId: string | null = null;
    try {
      const uploaded = await uploadToCloudinary(m.source_url, m.id);
      cloudUrl = uploaded.url;
      publicId = uploaded.publicId;
    } catch (err: any) {
      console.warn(`  upload failed for ${m.source_url}: ${err.message}`);
    }

    await prisma.media.upsert({
      where: { wpId: m.id },
      create: {
        wpId: m.id,
        filename: m.slug,
        mimeType: m.mime_type,
        url: cloudUrl,
        cloudinaryId: publicId,
        alt: m.alt_text || null,
        caption: m.caption?.rendered ? stripHtml(m.caption.rendered) : null,
        width: m.media_details?.width || null,
        height: m.media_details?.height || null,
      },
      update: { url: cloudUrl, cloudinaryId: publicId },
    });
    console.log(`  imported media ${m.id}`);
  }
}

async function importCategories() {
  console.log('Importing categories...');
  const items = await fetchAll<any>('/categories');
  for (const c of items) {
    await prisma.category.upsert({
      where: { wpId: c.id },
      create: {
        wpId: c.id,
        slug: c.slug,
        name: decodeHtml(c.name),
        description: c.description || null,
        parentId: c.parent || null,
      },
      update: { name: decodeHtml(c.name), description: c.description || null },
    });
  }
  console.log(`  imported ${items.length} categories`);
}

async function importTags() {
  console.log('Importing tags...');
  const items = await fetchAll<any>('/tags');
  for (const t of items) {
    await prisma.tag.upsert({
      where: { wpId: t.id },
      create: { wpId: t.id, slug: t.slug, name: decodeHtml(t.name) },
      update: { name: decodeHtml(t.name) },
    });
  }
  console.log(`  imported ${items.length} tags`);
}

async function importPages() {
  console.log('Importing pages...');
  const items = await fetchAll<any>('/pages');
  for (const p of items) {
    const featured = p.featured_media
      ? await prisma.media.findUnique({ where: { wpId: p.featured_media } })
      : null;

    const content = await rewriteImages(p.content?.rendered || '');

    await prisma.page.upsert({
      where: { wpId: p.id },
      create: {
        wpId: p.id,
        slug: p.slug,
        title: decodeHtml(p.title?.rendered || ''),
        content,
        excerpt: stripHtml(p.excerpt?.rendered || '') || null,
        status: p.status,
        parentId: p.parent || null,
        menuOrder: p.menu_order || 0,
        featuredId: featured?.id || null,
        publishedAt: p.date ? new Date(p.date) : null,
      },
      update: {
        title: decodeHtml(p.title?.rendered || ''),
        content,
        excerpt: stripHtml(p.excerpt?.rendered || '') || null,
        status: p.status,
        featuredId: featured?.id || null,
      },
    });
  }
  console.log(`  imported ${items.length} pages`);
}

async function importPosts() {
  console.log('Importing posts...');
  const items = await fetchAll<any>('/posts');
  for (const post of items) {
    const featured = post.featured_media
      ? await prisma.media.findUnique({ where: { wpId: post.featured_media } })
      : null;

    const content = await rewriteImages(post.content?.rendered || '');

    const cats = await prisma.category.findMany({
      where: { wpId: { in: post.categories || [] } },
    });
    const tags = await prisma.tag.findMany({
      where: { wpId: { in: post.tags || [] } },
    });

    await prisma.post.upsert({
      where: { wpId: post.id },
      create: {
        wpId: post.id,
        slug: post.slug,
        title: decodeHtml(post.title?.rendered || ''),
        content,
        excerpt: stripHtml(post.excerpt?.rendered || '') || null,
        status: post.status,
        featuredId: featured?.id || null,
        publishedAt: post.date ? new Date(post.date) : null,
        categories: { connect: cats.map((c) => ({ id: c.id })) },
        tags: { connect: tags.map((t) => ({ id: t.id })) },
      },
      update: {
        title: decodeHtml(post.title?.rendered || ''),
        content,
        excerpt: stripHtml(post.excerpt?.rendered || '') || null,
        status: post.status,
        featuredId: featured?.id || null,
        categories: { set: cats.map((c) => ({ id: c.id })) },
        tags: { set: tags.map((t) => ({ id: t.id })) },
      },
    });
  }
  console.log(`  imported ${items.length} posts`);
}

async function importMenus() {
  console.log('Importing menus...');
  try {
    const menus = await http.get('/menus', { baseURL: WP_API!.replace('/wp/v2', '/wp-api-menus/v2') });
    console.log(`  found ${menus.data?.length || 0} menus (wp-api-menus plugin)`);
  } catch {
    console.log('  menus endpoint not available — skipping (install WP-REST-API V2 Menus plugin or import manually)');
  }
}

async function rewriteImages(html: string): Promise<string> {
  let out = html;
  const all = await prisma.media.findMany();
  for (const m of all) {
    if (!m.filename) continue;
    const regex = new RegExp(`https?:[^"' ]*${escapeRegex(m.filename)}[^"' ]*`, 'g');
    out = out.replace(regex, m.url);
  }
  return out;
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"');
}

async function main() {
  console.log(`Importing from ${WP_API}`);
  await importMedia();
  await importCategories();
  await importTags();
  await importPages();
  await importPosts();
  await importMenus();
  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
