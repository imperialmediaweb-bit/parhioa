/**
 * Rugăciunile zilelor săptămânii — texte tradiționale, după cartea
 * „Dă-i voință, ia-i putere" (Protosinghel Nicodim Măndiță) și
 * Acatistul Maicii Domnului „Izbăvitoarea". Aceleași texte se regăsesc
 * la Biserica Ortodoxă Română „Nașterea Domnului" Luxembourg
 * (biserica.lu/rugaciuni/rugaciunile-zilelor-saptamanii).
 */

export interface DailyPrayer {
  /** 0 = Sunday, 1 = Monday, ... 6 = Saturday (JS Date.getDay) */
  dayIndex: number;
  dayName: string;
  title: string;
  paragraphs: string[];
}

export const DAILY_PRAYERS: DailyPrayer[] = [
  {
    dayIndex: 0,
    dayName: 'Duminică',
    title: 'Rugăciunea de Duminică',
    paragraphs: [
      'Ziua Duminicii îmi aduce aminte de atotputernicia Ta, Stăpâne, cu care ai zidit lumea și ai răscumpărat pe om. Ție, deci, Iubitorule de oameni Doamne, mă închin și-Ți mulțumesc foarte pentru darurile cele mari ce ai făcut și le faci tuturor făpturilor Tale.',
      'Inima mi se bucură și se desfătează când stau și cuget cum că numai Tu Însuți ești Dumnezeu Atotsfânt, Atotînțelept, Atotputernic, Necuprins, încât nicio bunătate și nicio mărire nu-Ți lipsește. Tu ești Unul Dumnezeu în trei fețe: Tatăl, Fiul și Sfântul Duh. Numai pe Tine Te cunosc Dumnezeu adevărat, Te mărturisesc și Te măresc, Ție mă închin și-Ți servesc pururea, cu toată inima și cu toată puterea.',
      'O, Părinte Sfinte, îndură-Te de noi! O, binecuvântate Fiule al lui Dumnezeu, miluiește-ne de iad! O, Duhule Sfinte, dă-mi darul și acoperământul Tău!',
      'Mult-îndurate Stăpâne, rogu-Te să uiți păcatele mele cele multe, după mulțimea îndurărilor Tale. Mulțumesc din toată inima pentru bunătățile ce-mi trimiți în toate zilele, mai vârtos însă pentru răbdarea Ta cea mare, că nu m-ai pedepsit după mulțimea păcatelor mele, ci aștepți căința mea, ca un iertător atotbun și îndurat.',
      'Doamne Iisuse Hristoase, dă-mi darul ca să petrec bine și creștinește în această săptămână și să nu mai păcătuiesc Ție, nici cu cugetarea, nici cu cuvântul și nici cu fapta, întru mărirea și onoarea Învierii Tale celei de a treia zi și a venirii Duhului Tău celui Sfânt asupra Apostolilor.',
      'Îndeosebi mă rog pentru ajutorul Tău, preabunule Stăpâne, ca să mă cunosc pe mine, să mă căiesc de păcatele mele și să mă îndrept cu mărturisirea; iar în ceasul morții să fiu aflat pregătit, cuminecat și cu inima curată, și să fiu aflat demn de împărăția Ta cea veșnică. Amin.',
    ],
  },
  {
    dayIndex: 1,
    dayName: 'Luni',
    title: 'Rugăciunea de Luni',
    paragraphs: [
      'Doamne Iisuse Hristoase, cu adâncă umilință recunosc și mărturisesc că în toată ziua păcătuiesc contra iubirii Tale dumnezeiești. Deci, astăzi, că este luni și începutul săptămânii, mă rog cu umilință îndurării Tale celei mari: iartă-mi păcatele cele de voie și fără de voie și-mi ajută să pun început bun și să port mai multă grijă de sufletul meu, pentru care ai răbdat atâtea dureri la Sfânta Ta Răstignire!',
      'O, Doamne, astăzi îți dau sufletul și trupul meu și voința mea, rugându-Te să fie voia Ta cu mine după buna plăcerea Ta. Pedepsește-mă, Doamne, după îndurarea Ta, în această lume, iară nu în cealaltă viață, și iartă pe cei vii și pe cei răposați, pentru rugăciunile Sfintei Tale Biserici și pe toți ne învrednicește de mărirea Ta în Rai.',
      'La aceasta pun mijlocitori pe Sfinții Tăi Îngeri, către care zic: O, cereștilor servitori și păzitori ai oamenilor, vouă mă închin și vă mulțumesc pentru ajutorul și conducerea ce ne-o dați în toate zilele, nouă, nevrednicilor și păcătoșilor! Izbăviți-mă de vrăjmașii cei văzuți și de cei nevăzuți, ca să nu mai păcătuiesc de acum înaintea Dumnezeului meu! Învredniciți-mă să vă văd la moartea mea stând în jurul meu și să duceți sufletul meu în cer, ca să se închine Măririi Feței lui Dumnezeu, iar vouă să vă mulțumesc acolo pentru purtarea de grijă ce ați făcut pentru mine și binele vostru să-l spun cu glas neîncetat în veci. Amin.',
    ],
  },
  {
    dayIndex: 2,
    dayName: 'Marți',
    title: 'Rugăciunea de Marți',
    paragraphs: [
      'Doamne, Dumnezeul meu, osândit stau înaintea Feței Tale celei Sfinte și-mi mărturisesc nevrednicia, neputința și sărăcia mea cea mare. Pentru aceasta mă rog Ție, o, Izvor dulce și noianul îndurării, deschide stăvilile cerului și ploua asupra mea bunătățile îndurării Tale, pentru ca să pot scoate lacrimi, să plâng, să spăl și să curățesc sufletul meu de întinăciunea păcatelor, cu căință tare și adevărată.',
      'Și ca să-mi dai acest dar, Stăpâne, pun mijlocitor pe Înainte-Mergătorul Ioan, către care zic: O, învățătorule al căinței și mărite Proorocule, care ești mai mare decât toți proorocii, precum Însuși Fiul lui Dumnezeu te-a numit în Sfânta Evanghelie, tu, care ai arătat poporului pe Stăpânul Hristos, tu, care l-ai botezat în Iordan și ai văzut cerurile deschizându-se, tu, care ai auzit glasul Părintelui ceresc și ai văzut pe Duhul Sfânt ca un porumbel pogorându-se peste El, rogu-te, ajută-mi cu mijlocirea ta, tu, care stai în cer înaintea Judecătorului veșnic și fă să se îndure de mine, căci ai multă îndrăzneală la iubirea Lui.',
      'Întinde mâna aceea cu care l-ai botezat și strică cugetele mele cele rele și mă întărește să-mi petrec viața pe calea cea bună a lui Dumnezeu. O, Proorocule, luminează-mi mintea cu poruncile Domnului, ca să le țin minte și să le păzesc până la sfârșitul vieții mele. Și să stai lângă mine în ora morții mele și să mă duci pocăit înaintea Stăpânului meu Dumnezeu.',
      'Roagă-te încă și pentru toată lumea, ca Dumnezeu să dea ajutor creștinilor, și celor vii și celor răposați, să-i odihnească de nevoile cele multe, să le dea toate cele de trebuință și să-i învrednicească Împărăției Sale. Amin.',
    ],
  },
  {
    dayIndex: 3,
    dayName: 'Miercuri',
    title: 'Rugăciunea de Miercuri',
    paragraphs: [
      'Doamne Atotputernice și mult Îndurate! Îmi aduc aminte că Te-ai născut Om din Sfânta Fecioară în peșteră și ai fost vândut cu treizeci de arginți de ucenicul cel viclean, ca să ne răscumperi pe noi, păcătoșii, de sub puterea diavolului. Pentru aceasta, te rog, îndură-Te de mine, vânzătorul.',
      'Primește, Doamne, această mică a mea rugăciune și umilință a mea, că mă întristez pentru că Te-am întristat și mă amărăsc pentru că Te-am supărat fără de număr. La Tine, preabunule Mântuitor, am toată nădejdea și cred că Tu, Care din iubirea către oameni ai primit să fii vândut pentru noi, te vei îndura și de mine acum, să mă mântuiești de chinurile cele de aici și să mă învrednicești Împărăției Tale.',
      'Nu te îndepărta de la mine, Doamne, ci ajută-mi ca în toate să fac voia Ta și să nu te mai răstignesc în toate zilele cu faptele mele cele păcătoase, nici să te batjocoresc cu cugetele mele cele rele, precum făceau iudeii cei necredincioși în timpul Sfintelor Tale Patimi, ci, ca femeia cea păcătoasă, să-ți spăl picioarele cu lacrimile ochilor mei, pentru ca să mă învrednicesc a auzi și eu din gura Ta cea dulce: „Iertate să-ți fie păcatele…" Amin.',
    ],
  },
  {
    dayIndex: 4,
    dayName: 'Joi',
    title: 'Rugăciunea de Joi',
    paragraphs: [
      'Doamne Iisuse Hristoase, Fiule și Cuvântul lui Dumnezeu Tatăl, Care în ziua de astăzi ai luat Cina cea de pe urmă cu ucenicii Tăi și cu mare umilință ai spălat picioarele lor și ale ucenicului ce Te-a vândut! Apoi luând pâine și vin în mâinile Tale cele Sfinte și binecuvântându-le cu puterea Ta cea dumnezeiască, le-ai făcut însuși Trupul și Sângele Tău, cu care i-ai împărtășit, zicând: „Luați, mâncați și beți, că acestea sunt Trupul și Sângele Meu, pentru ca să se ierte păcatele voastre".',
      'Cel ce tot în ziua aceasta Te-ai înălțat la cer și ai șezut de-a dreapta lui Dumnezeu Tatălui Tău, să împărățești împreună cu El în veci, ca Unul-Născut, Fiul Său preaiubit. Rogu-Te deci, pentru rugăciunile ucenicilor Tăi și cele ale Sfântului Nicolae, iartă păcatele noastre, ale tuturor, ale celor vii și ale celor morți.',
      'Dă-mi, Doamne, lacrimi fierbinți, ca să-mi plâng păcatele. Darul Tău cel curățitor care a spălat picioarele ucenicilor Tăi, să spele și să curățească inima mea cea necurată și sufletul meu, ca astfel, cu vrednicie, cu curăție și cu umilință să mă împărtășesc cu Sfintele Tale Taine, acum și în vremea morții mele, iar în timpul despărțirii mele, cu bucurie să se suie sufletul meu împreună cu Tine, și fără de nicio frică sau împiedicare să trec vămile văzduhului, intrând la mărirea Ta cea cerească.',
      'Ajută-mi, Doamne, ca să Te măresc și în veci să mă închin numelui Tău celui Sfânt. Amin.',
    ],
  },
  {
    dayIndex: 5,
    dayName: 'Vineri',
    title: 'Rugăciunea de Vineri',
    paragraphs: [
      'Doamne Iisuse Hristoase, Mântuitorul cel dulce al sufletului meu, în această zi a răstignirii Tale, în care pe Cruce ai pătimit și ai luat moarte pentru păcatele noastre, mă mărturisesc înaintea Ta, cum că eu sunt cel ce Te-am răstignit cu păcatele mele cele multe.',
      'Mă rog însă bunătății Tale celei nespuse, învrednicește-mă cu darul Tău, Doamne, ca și eu să pot răbda patimi pentru credința, speranța și iubirea ce le am către Tine, precum Tu, Cel îndurerat, ai răbdat pentru mântuirea mea. Întărește-mă, o, Doamne, ca de astăzi înainte să port Crucea Ta cu bucurie și cu mare căință, și să urăsc cugetele și voințele mele cele rele.',
      'Sădește în inima mea întristare de moartea Ta, pe care să o simt precum au simțit-o iubita Ta Maică, ucenicii Tăi și femeile purtătoare de mir, ce stăteau lângă Crucea Ta. Luminează-mi simțirile cele sufletești, ca să se miște și să priceapă moartea Ta, precum ai făcut de Te-au cunoscut făpturile cele neînsuflețite când s-au mișcat la Răstignirea Ta, și, mai vârtos, cum Te-a cunoscut tâlharul cel credincios, și, pocăit, Ți s-a plecat, de l-ai primit în Rai.',
      'Dă-mi, Doamne, și mie, tâlharului celui rău, darul Tău, precum atunci L-ai dat aceluia, și-mi iartă păcatele pentru Sfintele Tale Patimi și cu bună întoarcere și căință mă așază împreună cu el în Rai, ca un Dumnezeu și Ziditor ce-mi ești.',
      'Mă închin Crucii Tale, Hristoase, și pentru iubirea Ta către noi, zic către dânsa: Bucură-te, Sfântă Cruce a lui Hristos, pe care ridicat și pironit fiind Domnul, a mântuit lumea; Bucură-te, pom binecuvântat, pentru că tu ai ținut Rodul vieții, Care ne-a mântuit de moartea păcatului; Bucură-te, toiagul cel tare, care ai sfărâmat ușile iadului; Bucură-te, cheia împărătească, care ai deschis ușa raiului.',
      'O, Hristoase al meu răstignit, câte ai pătimit pentru noi! Câte răni, câte scuipări, câte batjocuri și câte ocări ai răbdat pentru păcatele noastre, și pentru ca să ne mai dai încă și pildă de adevărată răbdare în suferințele și necazurile vieții acesteia!',
      'Și fiindcă acestea ni le trimite Dumnezeu pentru păcatele noastre, ca să ne îndreptăm și să ne apropiem de El, și așa numai spre folosul nostru ne pedepsește în această viață, de aceea, rogu-mă Ție, Stăpâne, ca la necazurile, ispitele și durerile câte ar veni asupra mea, să-mi înmulțești împreună și răbdarea, puterea și mulțumirea, căci cunosc că neputincios sunt de nu mă vei întări, orb, de nu mă vei lumina, legat, de nu mă vei dezlega, fricos, de nu mă vei face îndrăzneț, pierdut, de nu mă vei căuta, sclav, de nu mă vei răscumpăra cu bogata și Dumnezeiasca Ta putere și cu darul Sfintei Tale Cruci, căreia mă închin și pe care o măresc, acum și pururea și în vecii vecilor. Amin.',
    ],
  },
  {
    dayIndex: 6,
    dayName: 'Sâmbătă',
    title: 'Rugăciunea de Sâmbătă',
    paragraphs: [
      'Doamne Iisuse Hristoase, Judecătorul meu preadrept, cunosc că păcatele mele sunt fără de număr. De aceea, Te rog în această zi, în care de Iosif și de Nicodim pus fiind în mormânt, Te-ai pogorât în iad cu Sfântul și Îndumnezeitul Tău suflet, și de acolo ai îndepărtat întunericul cu lumina Dumnezeirii Tale și ai adus bucurie nespus de mare strămoșilor noștri, căci i-ai mântuit din robia cea cumplită și i-ai suit în Rai, îngroapă păcatele și cugetele mele cele rele și viclene, ca să piară din mintea mea și să nu se mai lupte cu sufletul meu.',
      'Luminează întunecatul iad al inimii mele, alungă întunericul păcatelor mele și suie mintea mea la cer, ca să mă bucur de fața Ta.',
      'Așa, Doamne, primește umila mea rugăciune ca o tămâie mirositoare, pentru rugăciunile iubitei Tale Maice, care Te-a văzut pe Cruce pironit între doi tâlhari și de durerile Tale cumplite i s-a rănit inima, care împreună cu ucenicii și cu mironosițele Te-a pus în mormânt, care a treia zi Te-a văzut înviat din morți și la Înălțarea Ta Te-a văzut suindu-Te de la pământ la cer, însoțit de Sfinții Tăi Îngeri.',
      'Îndură-Te, Doamne, și de cei vii și de cei morți, pentru rugăciunile sfinților Tăi, către care zic și eu nevrednicul: O, fericiți servitori ai lui Dumnezeu, nu încetați a vă ruga Lui ziua și noaptea, pentru noi, nevrednicii, care pururea greșim cu atâtea nenumărate păcate! Mijlociți pentru noi darul și ajutorul lui Dumnezeu, pe care nu știm a-l cere după cuviință.',
      'Nu încetați a vă ruga, pentru ca prin rugăciunile voastre, păcătoșii să câștige iertare, săracii ajutor, întristații mângâiere, bolnavii sănătate, cei slabi la minte înțelepciune, cei tulburați liniște, cei asupriți ocrotire, și toți împreună darul lui Dumnezeu spre folosul cel sufletesc, în mărirea lui Dumnezeu Celui în Treime lăudat, Căruia I se cuvine cinste și închinare în veci. Amin.',
    ],
  },
];

export function getPrayerForDay(dayIndex: number): DailyPrayer {
  return DAILY_PRAYERS.find((p) => p.dayIndex === dayIndex) || DAILY_PRAYERS[0];
}
