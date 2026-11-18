/**
 * Articole duhovnicești scrise de parohie, afișate pe blog alături de
 * postările importate de pe Facebook. Spre deosebire de PLACEHOLDER_POSTS
 * (care apar doar când baza de date e goală), acestea apar MEREU — sunt
 * conținut editorial propriu, nu un substitut.
 *
 * Fiecare are pagină proprie la /blog/<slug>.
 */
export interface ArticolStatic {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: Date;
  category: string;
  /** URL imagine principală (Cloudinary). null → placeholder parohie. */
  featuredUrl: string | null;
  featuredAlt: string;
  /** Conținut HTML sigur (scris de noi, nu input de utilizator). */
  contentHtml: string;
}

export const ARTICOLE_STATICE: ArticolStatic[] = [
  {
    slug: 'citirea-psaltirii-in-postul-nasterii-domnului-2026',
    title: 'Citirea Psaltirii în Postul Nașterii Domnului – 2026',
    excerpt:
      'Vă chemăm să ne unim inimile și glasurile în rugăciunea Psaltirii, în fiecare seară între orele 21:00–21:30, în perioada 15 noiembrie – 24 decembrie 2026. Înscrierea se face telefonic la 0754 857 903.',
    publishedAt: new Date('2026-11-18T08:00:00Z'),
    category: 'Rugăciune',
    featuredUrl:
      'https://pub-49f4280024fa4ca2b8a4f6323442efe8.r2.dev/parhioa/blog/citirea-psaltirii-poster.jpg',
    featuredAlt: 'Citirea Psaltirii în Postul Nașterii Domnului',
    contentHtml: `
<p class="lead"><em>„Să ne unim în rugăciunea Psaltirii, ca într-un singur glas al Bisericii, cerând Domnului milă pentru cei bolnavi, mângâiere pentru cei întristați, iertare pentru cei păcătoși și pace pentru întreaga lume!"</em></p>

<p>Dreptmăritori creștini, dragi credincioși ai Parohiei „Sfânta Cuvioasă Teodora de la Sihla" din Botoșani,</p>

<p>Cu binecuvântarea și ajutorul Bunului Dumnezeu, în perioada <strong>15 noiembrie – 24 decembrie 2026</strong>, vă chemăm să ne unim inimile și glasurile în rugăciunea sfântă a Psaltirii, în această vreme binecuvântată de pregătire pentru marele praznic al Nașterii Domnului nostru Iisus Hristos.</p>

<p>Ne dorim ca, în aceste patruzeci de zile de post, să alcătuim împreună o familie duhovnicească unită în rugăciune, în care fiecare psalm rostit să fie o mijlocire înaintea lui Dumnezeu pentru cei bolnavi, pentru cei singuri și întristați, pentru familiile noastre, pentru cei aflați în necazuri și pentru pacea întregii lumi.</p>

<p>În mod deosebit, avem nevoie de rugăciune acum, când, cu ajutorul lui Dumnezeu, am început construirea bisericii parohiei noastre. Să cerem împreună binecuvântarea Domnului peste această sfântă lucrare, peste cei care o sprijină și peste toți cei care se ostenesc pentru ridicarea ei. Să zidim, odată cu biserica din piatră, și Biserica cea vie din sufletele noastre, unite în credință și dragoste.</p>

<h3>Rânduiala citirii Psaltirii</h3>
<ul>
  <li>Citirea se desfășoară <strong>zilnic</strong>, în perioada 15 noiembrie – 24 decembrie 2026.</li>
  <li>Program: în fiecare seară, între orele <strong>21:00 – 21:30</strong>.</li>
  <li>Se citesc câte <strong>două catisme</strong> în fiecare zi, după rânduiala stabilită.</li>
  <li>Fiecare credincios citește Psaltirea în propria locuință, în liniștea colțului său de rugăciune, înaintea sfintelor icoane și a candelei aprinse.</li>
</ul>

<p>Chiar dacă ne vom afla în case diferite, la aceeași oră ne vom uni duhovnicește într-o singură rugăciune, ca mădulare ale aceluiași Trup al lui Hristos — Biserica Sa.</p>

<p>Citirea să se facă cu binecuvântarea duhovnicului, cu evlavie, smerenie și luare-aminte, însoțită de post, spovedanie, împărtășire cu pregătirea cuvenită, iertarea aproapelui și fapte de milostenie.</p>

<h3>Înscrierea credincioșilor</h3>
<p>Acest îndemn se adresează în mod deosebit credincioșilor Parohiei „Sfânta Cuvioasă Teodora de la Sihla" din Botoșani. Cei care doresc să participe se pot înscrie telefonic, prin SMS sau WhatsApp, la numărul:</p>

<blockquote>
  <p><strong>☎ 0754 857 903</strong> — Pr. Ailenei Cătălin</p>
</blockquote>

<p>Numele tuturor celor înscriși vor fi trecute într-un acatist și pomenite în fiecare seară, cerând Bunului Dumnezeu sănătate, pace, ajutor și binecuvântare pentru ei și pentru familiile lor.</p>

<p><em>Doamne, ajută-ne să fim una în rugăciune și în dragostea Ta!</em></p>

<p>Cu dragoste părintească și binecuvântare, al dumneavoastră împreună rugător,<br/>
<strong>Pr. Ailenei Cătălin</strong></p>

<p style="text-align:center;margin-top:2rem;">Slavă lui Dumnezeu pentru toate!</p>
`.trim(),
  },
];

export function gasesteArticolStatic(slug: string): ArticolStatic | undefined {
  return ARTICOLE_STATICE.find((a) => a.slug === slug);
}
