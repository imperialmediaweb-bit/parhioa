import { Hero } from '@/components/site/hero';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import Link from 'next/link';

export const metadata = {
  title: 'Politică de confidențialitate',
  description:
    'Politica de confidențialitate a Parohiei „Sfânta Cuvioasă Teodora de la Sihla". Ce date colectăm, de ce, cât le păstrăm, ce drepturi aveți (GDPR).',
};

export default function PrivacyPage() {
  const updated = '14 iunie 2026';

  return (
    <>
      <Hero
        title="Politică de confidențialitate"
        subtitle="Ce date colectăm, de ce, și ce drepturi aveți."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Politică de confidențialitate' },
        ]}
      />

      <section className="container py-12 max-w-3xl prose-parish">
        <SectionEyebrow>GDPR · Regulamentul UE 679/2016</SectionEyebrow>
        <p className="text-sm text-ink-soft mb-8">
          Actualizat: <strong>{updated}</strong>
        </p>

        <Section title="Operator de date">
          <p>
            <strong>Parohia „Sfânta Cuvioasă Teodora de la Sihla" — Botoșani</strong>,
            sediul în Strada Pacea 45B, Botoșani. CIF: <strong>48801453</strong>.
            Contact: <a href="mailto:contact@parohiasfteodoradelasihla.ro">contact@parohiasfteodoradelasihla.ro</a>,
            tel. <a href="tel:+40754857903">+40 754 857 903</a>.
          </p>
          <p>
            Persoana de contact pentru chestiuni privind datele personale: Pr. Cătălin Ailenei.
          </p>
        </Section>

        <Section title="Ce date colectăm">
          <p>Colectăm doar datele necesare pentru lucrarea parohiei:</p>
          <ul>
            <li>
              <strong>Donații:</strong> nume (opțional), email, telefon (opțional),
              suma, metoda (card / transfer bancar), data, dacă doriți să apăreți
              public sau anonim în lista de ctitori.
            </li>
            <li>
              <strong>Plăți cu cardul:</strong> Stripe procesează datele cardului. Noi
              NU vedem și NU stocăm numărul cardului, CVV-ul sau data expirării.
              Primim doar confirmarea că plata a reușit.
            </li>
            <li>
              <strong>Mesaje prin formularul de contact:</strong> nume, email,
              telefon (opțional), subiect, mesaj, adresa IP de la care a venit
              mesajul (pentru protecție anti-spam).
            </li>
            <li>
              <strong>Abonare la foaia parohială:</strong> doar adresa de email
              (opțional și numele).
            </li>
            <li>
              <strong>Tehnice:</strong> log-uri server (IP, browser, ora cererii)
              pentru securitate și debugging — păstrate maximum 30 de zile.
            </li>
          </ul>
        </Section>

        <Section title="De ce le folosim (temei legal)">
          <ul>
            <li>
              <strong>Donații</strong> — executarea contractului (donația în sine) și
              interesul legitim al parohiei de a ține evidența contributorilor +
              obligația legală de pomenire la slujbe.
            </li>
            <li>
              <strong>Emailul de mulțumire</strong> și actualizările despre proiect — interesul
              legitim de a comunica cu cei care au donat.
            </li>
            <li>
              <strong>Foaia parohială</strong> — consimțământul explicit (bifa la
              abonare). Vă puteți dezabona oricând cu un click în orice email primit
              de la noi.
            </li>
            <li>
              <strong>Formular contact</strong> — răspuns la solicitarea
              dumneavoastră.
            </li>
            <li>
              <strong>Pomelnice</strong> — interesul legitim al practicii liturgice
              ortodoxe.
            </li>
          </ul>
        </Section>

        <Section title="Cine vede aceste date">
          <p>Datele dvs. NU sunt vândute, NU sunt cedate către agenții de marketing, NU sunt folosite pentru profiling comercial. Sunt accesate doar de:</p>
          <ul>
            <li>Pr. Cătălin Ailenei și personalul administrativ al parohiei.</li>
            <li>
              <strong>Procesatori terți (sub contract GDPR):</strong>
              <ul>
                <li><strong>Stripe Payments Europe</strong> — procesare card; nu vede emailul, doar id-ul tranzacției.</li>
                <li><strong>Resend</strong> (Resend, Inc.) — trimitere emailuri de mulțumire și foaie parohială.</li>
                <li><strong>Cloudinary</strong> — stocare imagini blog și icoane.</li>
                <li><strong>Railway</strong> — găzduire aplicație și bază de date.</li>
                <li><strong>OpenAI</strong> — rescriere editorială articole importate de pe Facebook (doar textul postării publice, fără date personale).</li>
              </ul>
            </li>
          </ul>
          <p>
            În cazuri excepționale (anchete legale, fraudă), datele pot fi furnizate
            autorităților competente în baza unei cereri scrise.
          </p>
        </Section>

        <Section title="Cât timp le păstrăm">
          <ul>
            <li><strong>Donații</strong> — minimum 10 ani (obligație contabilă) sau cât durează proiectul; numele ctitorilor pot fi păstrate permanent pentru pomenire liturgică.</li>
            <li><strong>Mesaje contact</strong> — 2 ani de la primire.</li>
            <li><strong>Abonări newsletter</strong> — până la dezabonare, plus 30 zile pentru audit.</li>
            <li><strong>Log-uri tehnice</strong> — 30 de zile.</li>
          </ul>
        </Section>

        <Section title="Drepturile dumneavoastră (GDPR)">
          <p>Aveți, în orice moment:</p>
          <ul>
            <li><strong>Dreptul de acces</strong> — să cereți ce date avem despre dvs.</li>
            <li><strong>Dreptul la rectificare</strong> — să corectați datele incorecte.</li>
            <li><strong>Dreptul la ștergere</strong> („dreptul de a fi uitat") — cu excepția datelor pe care suntem obligați legal să le păstrăm (contabilitate).</li>
            <li><strong>Dreptul la portabilitate</strong> — să primiți datele într-un format pe care îl puteți duce altundeva.</li>
            <li><strong>Dreptul la opoziție</strong> — să spuneți „nu mai vreau".</li>
            <li><strong>Dreptul de a vă dezabona</strong> de la newsletter cu un click în orice email primit.</li>
            <li><strong>Dreptul de a face plângere</strong> la ANSPDCP (Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal) — <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer">www.dataprotection.ro</a>.</li>
          </ul>
          <p>
            Pentru oricare din aceste cereri, scrieți la{' '}
            <a href="mailto:contact@parohiasfteodoradelasihla.ro">
              contact@parohiasfteodoradelasihla.ro
            </a>{' '}
            cu subiectul „Cerere date personale". Răspundem în maximum 30 zile.
          </p>
        </Section>

        <Section title="Cookie-uri">
          <p>
            Site-ul folosește cookie-uri tehnice (sesiune, preferințe limbă). Stripe
            poate seta cookie-uri proprii pe pagina lor de plată — vedeți{' '}
            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
              politica Stripe
            </a>.
          </p>
          <p>
            Nu folosim cookie-uri de marketing, retargeting sau analytics agresive
            (Google Analytics, Facebook Pixel etc.).
          </p>
        </Section>

        <Section title="Copii">
          <p>
            Site-ul nu este destinat copiilor sub 16 ani. Nu colectăm conștient date
            despre minori. Părinții care observă că un copil a trimis date prin site
            ne pot scrie să le ștergem imediat.
          </p>
        </Section>

        <Section title="Modificări la această politică">
          <p>
            Putem actualiza ocazional această politică. Versiunea curentă este cea de
            pe această pagină. Schimbările substanțiale vor fi anunțate prin email
            abonaților, dacă este cazul.
          </p>
        </Section>

        <Section title="Contact pentru date personale">
          <p>
            Email: <a href="mailto:contact@parohiasfteodoradelasihla.ro">contact@parohiasfteodoradelasihla.ro</a><br />
            Telefon: <a href="tel:+40754857903">+40 754 857 903</a><br />
            Adresă: Strada Pacea 45B, Botoșani<br />
            Sau prin <Link href="/contact" className="underline">formularul de contact</Link>.
          </p>
        </Section>

        <p className="text-center text-xs text-ink-soft italic mt-10">
          „Adevărul vă va face liberi." — Ioan 8, 32
        </p>
      </section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="font-display text-xl sm:text-2xl text-burgundy mb-3">{title}</h2>
      <div className="text-ink-muted leading-relaxed space-y-3 [&_a]:text-burgundy [&_a:hover]:underline [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-1 [&_ul_ul]:list-[circle] [&_ul_ul]:mt-1">
        {children}
      </div>
    </div>
  );
}
