import { Hero } from '@/components/site/hero';
import { SectionEyebrow } from '@/components/site/section-eyebrow';
import Link from 'next/link';

export const metadata = {
  title: 'Termeni și condiții',
  description:
    'Termenii și condițiile de utilizare a site-ului Parohiei „Sfânta Cuvioasă Teodora de la Sihla" din Botoșani.',
};

export default function TermsPage() {
  const updated = '14 iunie 2026';

  return (
    <>
      <Hero
        title="Termeni și condiții"
        subtitle="Reguli simple pentru folosirea site-ului parohial."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Termeni și condiții' },
        ]}
      />

      <section className="container py-12 max-w-3xl prose-parish">
        <SectionEyebrow>Document legal</SectionEyebrow>
        <p className="text-sm text-ink-soft mb-8">
          Actualizat: <strong>{updated}</strong>
        </p>

        <Section title="1. Cine suntem">
          <p>
            Acest site este administrat de{' '}
            <strong>Parohia „Sfânta Cuvioasă Teodora de la Sihla" — Botoșani</strong>,
            cu sediul în Strada Pacea 45B, Botoșani. Cod fiscal:{' '}
            <strong>48801453</strong>. Email de contact:{' '}
            <a href="mailto:contact@parohiasfteodoradelasihla.ro">
              contact@parohiasfteodoradelasihla.ro
            </a>.
          </p>
          <p>
            Site-ul are scop pastoral, informativ și de sprijinire a lucrării parohiei
            (zidirea bisericii, anunțuri, slujbe, donații, comunicare cu enoriașii).
          </p>
        </Section>

        <Section title="2. Folosirea site-ului">
          <p>
            Accesul și navigarea pe site sunt gratuite. Utilizatorul este de acord să
            folosească site-ul cu bună-credință, conform credinței ortodoxe și legilor
            în vigoare.
          </p>
          <p>Este interzis:</p>
          <ul>
            <li>să accesați părți ale site-ului care nu vă sunt destinate (panou administrare, conturi);</li>
            <li>să încercați să obțineți acces neautorizat la baza de date sau la conturile altor utilizatori;</li>
            <li>să trimiteți conținut ilegal, jignitor, defăimător sau care încalcă drepturi de autor;</li>
            <li>să folosiți site-ul pentru spam, fraudă sau atacuri automate (boti, scraper-e abuzive).</li>
          </ul>
        </Section>

        <Section title="3. Donații">
          <p>
            Donațiile efectuate prin acest site (card bancar sau transfer bancar) sunt
            voluntare, nerambursabile și sunt folosite pentru:
          </p>
          <ul>
            <li>zidirea și întreținerea bisericii parohiale;</li>
            <li>slujbe, pomelnice, activități pastorale și catehetice;</li>
            <li>sprijinirea persoanelor în nevoie din comunitate.</li>
          </ul>
          <p>
            <strong>Plăți cu cardul</strong> sunt procesate prin Stripe (Stripe Payments
            Europe, Ltd.). Parohia nu stochează datele cardului. Confirmarea plății se
            trimite automat pe email.
          </p>
          <p>
            <strong>Transferul bancar</strong> se reconciliază manual de parohie pe baza
            extrasului de cont. Donatorii care folosesc formularul „Am efectuat transferul"
            primesc o confirmare automată; sumele apar în lista publică de ctitori după
            verificare.
          </p>
          <p>
            <strong>Restituire / rambursare:</strong> donațiile sunt nerambursabile. În
            cazuri excepționale (eroare de sumă, dublă plată), scrieți la{' '}
            <a href="mailto:contact@parohiasfteodoradelasihla.ro">
              contact@parohiasfteodoradelasihla.ro
            </a>{' '}
            în maximum 14 zile de la plată — analizăm fiecare situație individual.
          </p>
        </Section>

        <Section title="4. Donații recurente (lunare)">
          <p>
            Dacă alegeți „Donație lunară", Stripe va debita automat cardul în aceeași zi
            din fiecare lună, cu suma aleasă, până la oprire. Puteți opri abonarea
            oricând trimițând un email la adresa noastră — îl anulăm imediat.
          </p>
        </Section>

        <Section title="5. Conținutul site-ului">
          <p>
            Textele, imaginile și materialele publicate aparțin parohiei sau sunt
            folosite cu permisiune. Le puteți distribui în scopuri non-comerciale, cu
            menționarea sursei.
          </p>
          <p>
            Postările importate de pe pagina de Facebook a parohiei sunt rezumate sau
            rescrise editorial pentru clarițate. Pentru postarea originală, urmați
            linkul către Facebook din articol.
          </p>
        </Section>

        <Section title="6. Pomenirea numelor">
          <p>
            Numele donatorilor care bifează „Doresc să apar în lista publică" sunt
            afișate în secțiunea „Ctitorii bisericii". Cei care nu bifează apar ca{' '}
            <em>„Anonim"</em>. Toți donatorii sunt pomeniți la Sfânta Liturghie,
            indiferent de preferința publică.
          </p>
        </Section>

        <Section title="7. Limita de răspundere">
          <p>
            Site-ul este oferit „așa cum este". Parohia depune toate eforturile pentru
            ca informațiile să fie corecte și actualizate, dar nu garantează absența
            erorilor sau întreruperilor. Nu suntem responsabili pentru pagube indirecte
            rezultate din folosirea site-ului.
          </p>
          <p>
            Programul slujbelor poate fi modificat la sărbători mari sau în situații
            excepționale. Pentru confirmare, sunați la{' '}
            <a href="tel:+40754857903">+40 754 857 903</a> sau scrieți-ne.
          </p>
        </Section>

        <Section title="8. Schimbări la acești termeni">
          <p>
            Putem actualiza acești termeni ocazional. Versiunea curentă este cea de pe
            această pagină, cu data marcată sus. Folosirea continuă a site-ului după o
            modificare înseamnă acceptarea noilor termeni.
          </p>
        </Section>

        <Section title="9. Legea aplicabilă">
          <p>
            Acești termeni sunt guvernați de legea română. Pentru orice litigiu,
            părțile vor încerca rezolvarea pe cale amiabilă; în lipsa acordului,
            sunt competente instanțele de la sediul parohiei.
          </p>
        </Section>

        <Section title="10. Contact">
          <p>
            Pentru întrebări legate de acești termeni, scrieți-ne la{' '}
            <a href="mailto:contact@parohiasfteodoradelasihla.ro">
              contact@parohiasfteodoradelasihla.ro
            </a>{' '}
            sau folosiți{' '}
            <Link href="/contact" className="underline">
              formularul de contact
            </Link>
            .
          </p>
        </Section>

        <p className="text-center text-xs text-ink-soft italic mt-10">
          „Slavă lui Dumnezeu pentru toate."
        </p>
      </section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="font-display text-xl sm:text-2xl text-burgundy mb-3">{title}</h2>
      <div className="text-ink-muted leading-relaxed space-y-3 [&_a]:text-burgundy [&_a:hover]:underline [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
}
