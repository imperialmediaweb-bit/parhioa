import { SITE_URL, DEFAULT_OG_IMAGE } from './site';

/**
 * Schema.org JSON-LD builders. Google's knowledge panel for a local church
 * pulls heavily from ReligiousOrganization + PostalAddress + OpeningHoursSpec,
 * and rich-result Article cards in Search pull from BlogPosting. We keep the
 * shapes small and only emit what we can defend — empty fields hurt more
 * than they help (mark up only what's visible on the page).
 *
 * Inject by passing the returned object to <JsonLd> (components/site/jsonld.tsx).
 */

const PARISH_NAME = 'Parohia Sf. Cuvioasă Teodora de la Sihla';
const PARISH_PHONE = '+40754857903';
const PARISH_EMAIL = 'contact@parohiasfteodoradelasihla.ro';
const PARISH_LOGO = DEFAULT_OG_IMAGE;
const PARISH_ADDRESS = {
  street: 'Strada Pacea, Nr. 45B',
  city: 'Botoșani',
  region: 'Botoșani',
  postalCode: '710001',
  countryCode: 'RO',
};

/**
 * Weekly schedule mirrors components/site/program-slujbe.tsx — if you change
 * one, update the other. Keeping the source-of-truth in the component (where
 * the parish actually edits it) and reproducing it here for the crawler
 * avoided a bigger refactor; in practice the schedule changes ~once a year.
 */
const WEEKLY_SERVICES: Array<{ dow: string; opens: string; name: string }> = [
  { dow: 'Monday', opens: '08:00', name: 'Acatistul Sf. Arhangheli' },
  { dow: 'Tuesday', opens: '08:00', name: 'Acatistul Sf. Ioan Botezătorul' },
  { dow: 'Wednesday', opens: '08:00', name: 'Acatistul Maicii Domnului' },
  { dow: 'Thursday', opens: '08:00', name: 'Acatistul Sf. Nicolae' },
  { dow: 'Friday', opens: '08:30', name: 'Sf. Maslu' },
  { dow: 'Saturday', opens: '10:00', name: 'Pomenirea morților' },
  { dow: 'Sunday', opens: '08:00', name: 'Utrenia + Sfânta Liturghie' },
];

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ReligiousOrganization',
    '@id': `${SITE_URL}/#organization`,
    name: PARISH_NAME,
    alternateName: 'Parohia Sf. Teodora',
    url: SITE_URL,
    logo: PARISH_LOGO,
    image: PARISH_LOGO,
    description:
      'Comunitate creștin-ortodoxă din Botoșani sub ocrotirea Sfintei Cuvioase Teodora de la Sihla.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: PARISH_ADDRESS.street,
      addressLocality: PARISH_ADDRESS.city,
      addressRegion: PARISH_ADDRESS.region,
      postalCode: PARISH_ADDRESS.postalCode,
      addressCountry: PARISH_ADDRESS.countryCode,
    },
    telephone: PARISH_PHONE,
    email: PARISH_EMAIL,
    sameAs: [
      'https://www.facebook.com/profile.php?id=61573108296072',
    ],
    openingHoursSpecification: WEEKLY_SERVICES.map((s) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: s.dow,
      opens: s.opens,
      description: s.name,
    })),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: PARISH_NAME,
    inLanguage: 'ro-RO',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function blogPostingJsonLd(post: {
  slug: string;
  title: string;
  excerpt?: string | null;
  publishedAt: Date | string | null;
  updatedAt?: Date | string | null;
  imageUrl?: string | null;
}) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const published =
    post.publishedAt instanceof Date
      ? post.publishedAt.toISOString()
      : post.publishedAt || undefined;
  const modified =
    post.updatedAt instanceof Date
      ? post.updatedAt.toISOString()
      : post.updatedAt || undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title,
    description: post.excerpt || undefined,
    image: [post.imageUrl || PARISH_LOGO],
    datePublished: published,
    dateModified: modified || published,
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}
