/**
 * Fetches and parses the parish's Facebook page RSS feed from rss.app.
 * Cached for 1 hour via Next.js fetch cache so we don't hit rss.app on
 * every visitor.
 *
 * The feed URL is the user-supplied rss.app feed. If RSS_FEED_URL is set
 * in env it wins; otherwise the hardcoded URL is used.
 */

const DEFAULT_FEED_URL =
  'https://rss.app/feeds/ZemTFxEkHGGMPWO2.xml';

const CLOUDINARY_CLOUD = process.env.CLOUDINARY_CLOUD_NAME || 'dghmoelly';

/**
 * Wrap an external image URL in Cloudinary's fetch delivery so the asset is
 * cached on Cloudinary's CDN. Facebook image URLs expire and rotate every
 * few days; wrapping through fetch keeps them alive on our domain.
 *
 * Requires "Fetched URLs" delivery to be allowed on the Cloudinary account
 * (Settings → Security → Allowed fetch domains, or leave open).
 */
function cdnify(url: string | null): string | null {
  if (!url) return null;
  if (url.includes('res.cloudinary.com')) return url; // already on CDN
  const encoded = encodeURIComponent(url);
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/fetch/f_auto,q_auto,w_1200,c_limit/${encoded}`;
}

export interface FeedItem {
  title: string;
  description: string;
  link: string;
  pubDate: Date | null;
  image: string | null;
  guid: string;
  /**
   * Soft tag inferred from text — used to route items into different
   * surfaces (blog / news / cronologie). Multiple tags possible.
   */
  tags: ('zidire' | 'eveniment' | 'liturgic' | 'general')[];
}

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function stripHtml(s: string): string {
  return decodeEntities(s)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pick(xml: string, tag: string): string | null {
  // Try CDATA first
  const cdataRe = new RegExp(
    `<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`,
    'i',
  );
  const cdata = cdataRe.exec(xml);
  if (cdata) return cdata[1];

  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = re.exec(xml);
  return m ? m[1] : null;
}

function pickImage(itemXml: string, description: string): string | null {
  // Collect ALL candidate images and prefer the largest / most specific.
  // rss.app often inserts the channel logo as first <img> in description,
  // so picking the last image inside the description tends to give the real
  // post photo.
  const candidates: string[] = [];

  // 1) <enclosure url="..." />
  const enc = /<enclosure[^>]+url=["']([^"']+)["']/i.exec(itemXml);
  if (enc) candidates.push(enc[1]);

  // 2) <media:content url="..." /> — can appear multiple times
  const mediaRe = /<media:content[^>]+url=["']([^"']+)["']/gi;
  let mm: RegExpExecArray | null;
  while ((mm = mediaRe.exec(itemXml)) !== null) candidates.push(mm[1]);

  // 3) <media:thumbnail url="..." />
  const thumb = /<media:thumbnail[^>]+url=["']([^"']+)["']/i.exec(itemXml);
  if (thumb) candidates.push(thumb[1]);

  // 4) ALL <img src="..."> inside description
  const imgRe = /<img[^>]+src=["']([^"']+)["']/gi;
  let im: RegExpExecArray | null;
  while ((im = imgRe.exec(description)) !== null) candidates.push(im[1]);

  // Filter out tiny tracking pixels and obvious channel/profile images
  const filtered = candidates.filter((u) => {
    if (!u) return false;
    if (/1x1|spacer|pixel|tracking|blank/i.test(u)) return false;
    // Facebook profile pictures usually have 's40x40', 's60x60', etc.
    if (/[?&_/](s|p)\d{2,3}x\d{2,3}\//.test(u)) return false;
    // Very small thumbnails often have these markers
    if (/s50x50|s32x32|s100x100/i.test(u)) return false;
    return true;
  });

  if (filtered.length === 0) return candidates[0] || null;

  // Prefer the last candidate (in feeds, channel/logo comes first,
  // content image comes later).
  return filtered[filtered.length - 1];
}

/**
 * Try to fetch the Open Graph image of the actual post URL — this is the
 * most reliable source of the post's main photo, since rss.app sometimes
 * substitutes the channel logo when the post has no inline media.
 */
async function fetchOgImage(url: string): Promise<string | null> {
  if (!url || !url.startsWith('http')) return null;
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; ParohiaBot/1.0; +https://parohiasfteodoradelasihla.ro)',
        Accept: 'text/html,*/*',
      },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m = /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i.exec(html) ||
              /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i.exec(html);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

function inferTags(text: string): FeedItem['tags'] {
  const t = text.toLowerCase();
  const tags: FeedItem['tags'] = [];
  if (
    /\b(zidire|cărămid|temelie|biseric.+ constru|sfinț.+ loc|piatră de temelie|șantier|construcț)/.test(
      t,
    )
  ) {
    tags.push('zidire');
  }
  if (/\b(conferinț|întâlnire|hram|pelerinaj|seminar|simpozion|eveniment|participă)/.test(t)) {
    tags.push('eveniment');
  }
  if (/\b(liturghie|vecernie|maslu|acatist|parastas|botez|cununie|spovedanie)/.test(t)) {
    tags.push('liturgic');
  }
  if (tags.length === 0) tags.push('general');
  return tags;
}

export async function fetchFeed(): Promise<FeedItem[]> {
  const url = process.env.RSS_FEED_URL || DEFAULT_FEED_URL;
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; ParohiaBot/1.0; +https://parohiasfteodoradelasihla.ro)',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    });
    if (!res.ok) {
      console.error('[rss] fetch failed', res.status, res.statusText);
      return [];
    }
    const xml = await res.text();

    const items: FeedItem[] = [];
    const itemRe = /<item[\s\S]*?<\/item>/gi;
    const matches = xml.match(itemRe) || [];
    for (const itemXml of matches) {
      const titleRaw = pick(itemXml, 'title') || '';
      const descRaw = pick(itemXml, 'description') || pick(itemXml, 'content:encoded') || '';
      const linkRaw = pick(itemXml, 'link') || '';
      const pubDateRaw = pick(itemXml, 'pubDate') || '';
      const guidRaw = pick(itemXml, 'guid') || linkRaw;

      const title = stripHtml(titleRaw).slice(0, 200);
      const description = stripHtml(descRaw).slice(0, 600);
      const link = decodeEntities(stripHtml(linkRaw));
      const pubDate = pubDateRaw ? new Date(pubDateRaw) : null;
      let image = pickImage(itemXml, descRaw);
      // If we only found something that looks like a small profile/icon
      // (or nothing), try the post's own Open Graph image.
      const looksLikeProfile =
        !image ||
        /profile|page_picture|avatar/i.test(image) ||
        /scontent.+\/[^/]*\.(?:jpg|png|webp)(?:\?|$)/i.test(image) === false;
      if ((looksLikeProfile || !image) && link) {
        const og = await fetchOgImage(link);
        if (og) image = og;
      }
      const tags = inferTags(`${title} ${description}`);

      if (!title) continue;
      items.push({
        title,
        description,
        link,
        pubDate: pubDate && !isNaN(pubDate.getTime()) ? pubDate : null,
        image,
        guid: stripHtml(guidRaw),
        tags,
      });
    }
    return items;
  } catch (err) {
    console.error('[rss] failed', err);
    return [];
  }
}

export async function fetchFeedByTag(tag: FeedItem['tags'][number]): Promise<FeedItem[]> {
  const all = await fetchFeed();
  return all.filter((i) => i.tags.includes(tag));
}
