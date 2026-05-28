export type PlaceholderPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: Date;
  featuredUrl: string;
  category: string;
};

/**
 * Used when the Prisma DB has no published posts yet — so /blog and
 * the homepage news section always have something to show.
 */
export const PLACEHOLDER_POSTS: PlaceholderPost[] = [
  {
    slug: 'sfanta-cuvioasa-teodora-de-la-sihla',
    title: 'Sfânta Cuvioasă Teodora de la Sihla — pildă de smerenie',
    excerpt:
      'Floare aleasă a pustiei și rugătoare neîncetată înaintea lui Hristos, Cuvioasa Teodora ne învață ce înseamnă răbdarea desăvârșită și viața în post și rugăciune.',
    publishedAt: new Date(2025, 7, 7),
    featuredUrl:
      'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1779909922/Screenshot_98_uqff8q.png',
    category: 'Vieți de sfinți',
  },
  {
    slug: 'cum-iti-redirectionezi-3-5-din-impozit',
    title: 'Cum redirecționezi 3,5% din impozit către parohie',
    excerpt:
      'Un gest care nu te costă nimic, dar care zidește. Iată pașii simpli prin care poți alege ca o parte din impozitul tău să sprijine construirea bisericii.',
    publishedAt: new Date(2025, 5, 20),
    featuredUrl:
      'https://www.parohiasfteodoradelasihla.ro/wp-content/uploads/2025/06/Screenshot_60-2.webp',
    category: 'Redirecționează',
  },
  {
    slug: 'zidim-cu-credinta-fiecare-caramida-conteaza',
    title: 'Zidim cu credință — fiecare cărămidă contează',
    excerpt:
      'Parohia noastră nu are încă un lăcaș de închinare. Cu ajutorul vostru, punem temelia. Fiecare dar adus cu inimă curată devine o cărămidă vie.',
    publishedAt: new Date(2025, 4, 15),
    featuredUrl:
      'https://www.parohiasfteodoradelasihla.ro/wp-content/uploads/2025/06/WhatsApp-Image-2025-11-03-at-15.27.15.jpeg',
    category: 'Campanii',
  },
  {
    slug: 'asezarea-sfintei-cruci-temelia-bisericii',
    title: 'Așezarea Sfintei Cruci — temelia bisericii',
    excerpt:
      'Cu binecuvântarea Înaltpreasfințitului Părinte Teofan, s-a săvârșit slujba de așezare a Sfintei Cruci pe locul unde se va înălța biserica parohiei.',
    publishedAt: new Date(2025, 9, 14),
    featuredUrl:
      'https://res.cloudinary.com/dghmoelly/image/upload/f_auto,q_auto:best/v1779910523/594401053_122229437516091213_3614555738436750498_n_yn7qvr.jpg',
    category: 'Vești din parohie',
  },
  {
    slug: 'programul-slujbelor-de-praznice-imparatesti',
    title: 'Programul slujbelor de praznice împărătești',
    excerpt:
      'Iată rânduiala slujbelor pentru praznicele împărătești care urmează — Buna Vestire, Schimbarea la Față și Adormirea Maicii Domnului.',
    publishedAt: new Date(2025, 2, 24),
    featuredUrl:
      'https://www.parohiasfteodoradelasihla.ro/wp-content/uploads/2025/06/Screenshot_80-1-1.webp',
    category: 'Program slujbe',
  },
  {
    slug: 'voluntariat-in-parohie-cum-te-poti-implica',
    title: 'Voluntariat în parohie — cum te poți implica',
    excerpt:
      'Biserica are nevoie de oameni, nu doar de bani. Iată cum poți pune umărul la lucrarea parohiei prin timpul și priceperea ta.',
    publishedAt: new Date(2025, 1, 10),
    featuredUrl:
      'https://www.parohiasfteodoradelasihla.ro/wp-content/uploads/2025/06/ChatGPT-Image-Jun-19-2025-09_17_21-PM-1.webp',
    category: 'Comunitate',
  },
];
