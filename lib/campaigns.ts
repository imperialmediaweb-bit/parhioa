import type { ImageKey } from './images';

export type Campaign = {
  /** Canonical slug — also the URL: /donations/<slug> */
  slug: string;
  /** Alternate slugs that should resolve to this campaign (for old links) */
  aliases?: string[];
  title: string;
  shortTitle: string;
  image: ImageKey;
  /** Quote shown in the poster area */
  posterQuote?: { text: string; author: string };
  /** Quote shown next to the story (body) */
  bodyQuote: { text: string; author: string };
  /** Body paragraphs */
  description: string[];
  /** Status: active campaigns get the donate form; archived show only history */
  status: 'active' | 'archived';
  /** Bank transfer details, shown next to / above the Stripe form */
  bankDetails: {
    holder: string;
    iban: string;
    bank: string;
  };
  /** Preset amounts shown in the donation form (RON) */
  presetAmounts: number[];
  /** Default selected amount */
  defaultAmount: number;
  /** Total fundraising target in RON, used by the church-progress visualization */
  goalRon: number;
};

export const CAMPAIGNS: Campaign[] = [
  {
    slug: 'strangere-de-fonduri-pentru-construirea-bisericii',
    aliases: ['zidirea-bisericii', 'devino-ctitor'],
    title: 'Strângere de fonduri pentru construirea bisericii',
    shortTitle: 'Zidirea bisericii',
    image: 'campaignPoster',
    posterQuote: {
      text: 'Dăruind pentru Biserică, te faci moștenitor al comorilor veșnice.',
      author: 'Sfântul Ioan Damaschin',
    },
    bodyQuote: {
      text: 'Nu zidurile fac Biserica, ci credința; dar fără ziduri, credința nu are unde se aduna.',
      author: 'Sfântul Ioan Gură de Aur',
    },
    description: [
      'Parohia „Sfânta Cuvioasă Teodora de la Sihla" – Botoșani începe lucrarea sfântă a ridicării primei biserici proprii – loc de rugăciune și binecuvântare pentru întreaga comunitate.',
      'Fiecare dar este o cărămidă vie. Donația ta — fie ea o singură dată sau lunară — devine parte din temelia unui loc unde generații întregi se vor ruga, se vor boteza, se vor cununa și vor primi binecuvântarea lui Dumnezeu.',
      'Slavă lui Dumnezeu pentru toate!',
    ],
    status: 'active',
    bankDetails: {
      holder: 'Parohia Sf. Cuv. Teodora de la Sihla – Botoșani',
      iban: 'RO13CECEB00030RON2913441',
      bank: 'CEC Bank',
    },
    presetAmounts: [10, 25, 50, 100, 250, 500],
    defaultAmount: 50,
    goalRon: 1_500_000,
  },
];

export function findCampaign(slug: string): Campaign | undefined {
  return CAMPAIGNS.find((c) => c.slug === slug || c.aliases?.includes(slug));
}

export const activeCampaigns = CAMPAIGNS.filter((c) => c.status === 'active');
