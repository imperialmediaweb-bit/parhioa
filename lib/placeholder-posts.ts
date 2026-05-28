export type PlaceholderPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: Date;
  featuredUrl: string;
  category: string;
};

const WP_BASE = 'https://www.parohiasfteodoradelasihla.ro';

/**
 * Real posts from the live WordPress site, used until the production
 * database is seeded via `npm run import:wp`. Once the DB has real
 * posts, prisma.post.findMany will take over and these are hidden.
 */
export const PLACEHOLDER_POSTS: PlaceholderPost[] = [
  {
    slug: '1-decembrie-2025-slujba-de-sfintire-a-locului-pentru-biserica-cu-hramul-sfanta-cuvioasa-teodora-de-la-sihla',
    title:
      '1 decembrie 2025 — Slujba de sfințire a locului pentru Biserica cu hramul „Sfânta Cuvioasă Teodora de la Sihla"',
    excerpt:
      'Ziua de 1 decembrie 2025 rămâne adânc întipărită în sufletele credincioșilor parohiei noastre. A fost o zi cu o încărcătură duhovnicească deosebită.',
    publishedAt: new Date('2025-12-05T14:39:36Z'),
    featuredUrl: `${WP_BASE}/wp-content/uploads/2025/12/594401053_122229437516091213_3614555738436750498_n-1024x683.jpg`,
    category: 'Vești din parohie',
  },
  {
    slug: '26-11-2025-pregatiri-pentru-sfintirea-locului-punerea-pietrei-de-temelie-si-sfintirea-troitei',
    title:
      '26.11.2025 — Pregătiri pentru Sfințirea Locului, Punerea Pietrei de Temelie și Sfințirea Troiței',
    excerpt:
      'Dragi credincioși și prieteni ai parohiei noastre, cu ajutorul lui Dumnezeu am început în aceste zile pregătirile pentru Slujba de Sfințire a locului.',
    publishedAt: new Date('2025-11-26T18:00:25Z'),
    featuredUrl: `${WP_BASE}/wp-content/uploads/2025/11/Screenshot_426.png`,
    category: 'Vești din parohie',
  },
  {
    slug: 'un-pas-important-spre-ctitorie-racordarea-electrica-a-fost-realizata',
    title: 'Un pas important spre ctitorie — racordarea electrică a fost realizată',
    excerpt:
      'Dragi credincioși și prieteni ai parohiei noastre, în aceste zile, cu ajutorul bunului Dumnezeu și prin osteneala celor cu inimă bună, au fost săvârșite lucrări importante.',
    publishedAt: new Date('2025-11-19T12:55:55Z'),
    featuredUrl: `${WP_BASE}/wp-content/uploads/2025/11/Screenshot_397.png`,
    category: 'Lucrări',
  },
  {
    slug: 'chemare-catre-inimile-celor-ce-iubesc-biserica-lui-hristos-devino-ctitor',
    title: 'Chemare către inimile celor ce iubesc Biserica lui Hristos — Devino ctitor',
    excerpt:
      'Cu ajutorul și binecuvântarea lui Dumnezeu, după doi ani de osteneli, rugăciuni și răbdare, am obținut documentul mult așteptat: Autorizația de Construire.',
    publishedAt: new Date('2025-10-30T06:58:13Z'),
    featuredUrl: `${WP_BASE}/wp-content/uploads/2025/10/Screenshot_298.png`,
    category: 'Chemare',
  },
  {
    slug: 'pe-acest-loc-se-va-ridica-o-biserica',
    title: 'Pe acest loc se va ridica o biserică',
    excerpt:
      'Prin rânduiala lui Dumnezeu, pe acest loc se trasează acum doar amprentele viitoarei biserici și ale paraclisului — semne smerite ale unei lucrări care începe.',
    publishedAt: new Date('2025-10-29T06:48:59Z'),
    featuredUrl: `${WP_BASE}/wp-content/uploads/2025/10/Screenshot_297.png`,
    category: 'Lucrări',
  },
  {
    slug: '13-septembrie-2025-o-troita-a-credintei-si-nadejdii-ridicata-pe-locul-viitoarei-biserici-parohiale',
    title:
      '13 septembrie 2025 — O Troiță a credinței și nădejdii, ridicată pe locul viitoarei biserici',
    excerpt:
      'Dragi credincioși, vă împărtășim cu bucurie ridicarea unei Troițe pe locul unde, cu ajutorul lui Dumnezeu, se va înălța biserica parohiei noastre.',
    publishedAt: new Date('2025-10-13T19:34:01Z'),
    featuredUrl: `${WP_BASE}/wp-content/uploads/2025/10/560667523_122224079870091213_5138230694830966099_n.jpg`,
    category: 'Vești din parohie',
  },
  {
    slug: 'pregatiri-pentru-zidirea-bisericii-un-pas-inainte-cu-nadejde-si-randuiala',
    title: '26.09.2025 — Pregătiri pentru zidirea bisericii: un pas înainte, cu nădejde',
    excerpt:
      'Septembrie 2025 aduce pentru parohia noastră noi pași în pregătirea locului unde, cu ajutorul lui Dumnezeu, se va înălța sfânta biserică.',
    publishedAt: new Date('2025-09-26T14:07:00Z'),
    featuredUrl: `${WP_BASE}/wp-content/uploads/2025/09/Screenshot_187.png`,
    category: 'Lucrări',
  },
  {
    slug: '11-09-2025-primii-pasi-pentru-biserica-parohiala-terenul-a-fost-curatat-si-pregatit',
    title: '11.09.2025 — Primii pași pentru biserica parohială: terenul a fost curățat și pregătit',
    excerpt:
      'Dragi credincioși și prieteni ai parohiei noastre, cu inimă plină de bucurie vă împărtășim că în aceste zile am curățat și pregătit terenul.',
    publishedAt: new Date('2025-09-11T18:27:41Z'),
    featuredUrl: `${WP_BASE}/wp-content/uploads/2025/09/546158569_122220546092091213_5960262916765349898_n-1024x768.jpg`,
    category: 'Lucrări',
  },
  {
    slug: 'sfanta-cuvioasa-teodora-de-la-sihla',
    title: 'Sfânta Cuvioasă Teodora de la Sihla',
    excerpt:
      'Sfânta Cuvioasă Teodora de la Sihla este prima femeie româncă trecută oficial în rândul sfinților de către Biserica Ortodoxă Română. Viața ei este o pildă de smerenie.',
    publishedAt: new Date('2025-06-20T18:53:15Z'),
    featuredUrl: `${WP_BASE}/wp-content/uploads/2025/06/Screenshot_60-2.webp`,
    category: 'Vieți de sfinți',
  },
  {
    slug: 'ajutor-si-milostenie-pentru-o-parohie-tanara',
    title: 'Ajutor și milostenie pentru o parohie tânără',
    excerpt:
      'Într-o lume în care multe se ridică din piatră și se prăbușesc în uitare, la Botoșani se naște o lucrare vie: Parohia „Sfânta Cuvioasă Teodora de la Sihla".',
    publishedAt: new Date('2025-06-20T18:46:17Z'),
    featuredUrl: `${WP_BASE}/wp-content/uploads/2025/06/Screenshot_85-removebg-preview-2.webp`,
    category: 'Chemare',
  },
  {
    slug: 'un-pas-mare-spre-zidirea-casei-domnului',
    title: 'Un pas mare spre zidirea casei Domnului',
    excerpt:
      'Dragi enoriași și prieteni ai parohiei noastre, cu mulțumire către Dumnezeu vă împărtășim împlinirea unui pas important în drumul zidirii bisericii.',
    publishedAt: new Date('2025-04-30T18:49:00Z'),
    featuredUrl: `${WP_BASE}/wp-content/uploads/2025/06/Screenshot_66.png`,
    category: 'Vești din parohie',
  },
];
