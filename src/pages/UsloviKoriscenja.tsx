// USLOVI KORIŠĆENJA — a real page of the site (batch 59). Identity block per Zakon o
// elektronskoj trgovini čl. 6, pre-contract information per čl. 12. The VAT sentence in
// tačka 2 is the owner's own confirmation (2026-08-13: „no im not in pdv system") — it was
// deliberately absent until he said so, because a wrong tax claim on a legal page is worse
// than a missing one.
import { Link } from 'react-router-dom'
import { LegalLayout, Clause, SubClause, Facts, Bullets } from '../components/LegalLayout'
import { usePageMeta } from '../lib/meta'
import { LEGAL } from '../lib/marks'

export default function UsloviKoriscenja() {
  usePageMeta({
    title: 'Uslovi korišćenja — DreamSign',
    description:
      'Uslovi korišćenja sajta DreamSign, podaci o privrednom subjektu propisani Zakonom o elektronskoj trgovini i pravila saradnje — kako se zaključuje posao, autorska prava i odgovornost.',
    path: '/uslovi-koriscenja',
  })

  return (
    <LegalLayout
      title="Uslovi korišćenja"
      updated="13.08.2026."
      intro={
        <p>
          Korišćenjem ovog sajta prihvatate uslove navedene ispod. Ako se sa njima ne slažete, molimo
          vas da sajt ne koristite. Podaci u tački 1 objavljeni su u skladu sa članom 6.{' '}
          <strong>Zakona o elektronskoj trgovini</strong>, a tačke 3 i 4 sadrže obaveštenja iz člana
          12. istog zakona.
        </p>
      }
    >
      <Clause n="1" title="Podaci o privrednom subjektu">
        <p>
          Sajt vodi sledeći privredni subjekt, upisan u Registar privrednih subjekata koji vodi
          Agencija za privredne registre:
        </p>
        <Facts
          rows={[
            ['Poslovno ime', LEGAL.name],
            ['Skraćeno poslovno ime', LEGAL.shortName],
            ['Pravna forma', LEGAL.form],
            ['Sedište', LEGAL.seatOfficial],
            ['Matični broj', LEGAL.registrationNo],
            ['PIB', LEGAL.pib],
            ['Pretežna delatnost', LEGAL.activity],
            ['Registar', `${LEGAL.registeredAt}, ${LEGAL.registeredOn}`],
            ['Zastupnik', LEGAL.owner],
            ['E-pošta', <a href={`mailto:${LEGAL.registeredEmail}`}>{LEGAL.registeredEmail}</a>],
            ['Telefon', <a href={LEGAL.phoneHref}>{LEGAL.phone}</a>],
          ]}
        />
        <SubClause n="1.1" title="Nadzorni organi">
          <p>
            Nadzor nad primenom propisa o elektronskoj trgovini i zaštiti potrošača vrši{' '}
            <strong>tržišna inspekcija</strong> ministarstva nadležnog za poslove trgovine. Nadzor
            nad zaštitom podataka o ličnosti vrši <strong>Poverenik za informacije od javnog značaja
            i zaštitu podataka o ličnosti</strong>, Bulevar kralja Aleksandra 15, 11120 Beograd (
            <a href="https://www.poverenik.rs" target="_blank" rel="noopener">www.poverenik.rs</a>).
          </p>
        </SubClause>
      </Clause>

      <Clause n="2" title="Namena sajta">
        <p>
          Sajt služi za predstavljanje usluga izrade i održavanja internet prezentacija i za
          uspostavljanje kontakta sa zainteresovanim klijentima. Sadržaj sajta ima informativni
          karakter i <strong>ne predstavlja obavezujuću ponudu</strong> u smislu Zakona o obligacionim
          odnosima. Obim posla, rok i cena utvrđuju se isključivo pisanim ugovorom između naručioca i
          izvršioca.
        </p>
        <p>
          Na sajtu nema cenovnika: svaki projekat se procenjuje posebno, pa ponuda stiže posle prvog
          razgovora. Iznosi i način plaćanja navode se u ponudi i ugovoru.{' '}
          <strong>Privredni subjekt nije u sistemu PDV-a</strong> — u skladu sa članom 33. Zakona o
          porezu na dodatu vrednost, PDV nije obračunat i ne iskazuje se na ponudama i računima.
        </p>
      </Clause>

      <Clause n="3" title="Kako se zaključuje posao">
        <p>
          Poruka poslata putem WhatsApp-a, e-pošte ili telefonom <strong>ne zasniva poslovni
          odnos</strong> i ne obavezuje nijednu stranu. Postupak je uvek isti:
        </p>
        <ol className="space-y-2.5 pl-5">
          {[
            'javljate nam se porukom, pozivom ili zakazivanjem termina;',
            'na razgovoru utvrđujemo cilj, obim posla i realan rok;',
            'dobijate pisanu ponudu — šta se radi, do kada i za koliko;',
            'ugovor se potpisuje pre početka rada i tek tada nastaje obaveza za obe strane.',
          ].map((s) => (
            <li key={s} className="list-decimal marker:font-semibold marker:text-accent/70">{s}</li>
          ))}
        </ol>
        <p>
          Ugovor se zaključuje na <strong>srpskom jeziku</strong>, u pisanoj ili elektronskoj formi, i
          čuva se kod obe strane. Broj rundi revizija, rokovi i način plaćanja definišu se tim
          ugovorom. Pre potpisivanja imate pravo da tražite ispravku svih podataka koje ste nam dali,
          kao i izmenu ponude.
        </p>
      </Clause>

      <Clause n="4" title="Zakazivanje termina">
        <p>
          Kartica za zakazivanje na stranicama <em>Radovi</em> i <em>Kontakt</em> koristi uslugu{' '}
          <strong>Cal.com, Inc.</strong> i učitava se tek kada je sami otvorite klikom. Zakazan termin
          znači dogovoren razgovor — <strong>ne predstavlja zaključenje ugovora</strong> niti bilo
          kakvu finansijsku obavezu. Termin možete otkazati ili pomeriti putem linka koji dobijate u
          potvrdi. Kako se postupa sa podacima koje tada unesete opisano je u{' '}
          <Link to="/politika-privatnosti">Politici privatnosti</Link>.
        </p>
      </Clause>

      <Clause n="5" title="Veštačka inteligencija u izradi">
        <p>
          U izradi sajtova koristimo alate zasnovane na <strong>veštačkoj inteligenciji</strong>:
          njima nastaju delovi dizajna, koda, ilustracija i predloga teksta. Šta to znači u praksi:
        </p>
        <Bullets
          items={[
            'svaki rezultat pre isporuke pregleda i odobrava čovek — odgovornost za isporučeno je naša, a ne alatova;',
            'prava na isporučeni sajt prelaze na naručioca pod uslovima iz tačke 6, bez obzira na to kojim je alatom deo posla nastao;',
            <>
              materijale koje nam dostavite koristimo isključivo za vaš projekat, kako je opisano u{' '}
              <Link to="/politika-privatnosti">Politici privatnosti</Link>;
            </>,
            'ne tvrdimo i ne garantujemo da je bilo koji deo sadržaja nastao bez pomoći takvih alata.',
          ]}
        />
      </Clause>

      <Clause n="6" title="Autorska prava">
        <p>
          Celokupan sadržaj ovog sajta — tekst, ilustracije, animacije, logo i izvorni kod — zaštićen
          je autorskim pravom i vlasništvo je navedenog privrednog subjekta. Umnožavanje, distribucija
          ili objavljivanje bilo kog dela sadržaja bez prethodne pisane saglasnosti nije dozvoljeno.
        </p>
        <p>
          Autorska prava na materijale koje naručilac dostavi (logo, tekstovi, fotografije) ostaju kod
          naručioca. Prava na isporučeni sajt prelaze na naručioca u skladu sa ugovorom.
        </p>
      </Clause>

      <Clause n="7" title="Usluge i linkovi trećih strana">
        <p>
          Sajt vodi ka aplikaciji WhatsApp (Meta Platforms Ireland Limited) i sadrži karticu za
          zakazivanje koju pruža Cal.com, Inc. Za rad, dostupnost i uslove korišćenja tih usluga ne
          odgovaramo — na njih se primenjuju njihovi uslovi i njihove politike privatnosti. Način
          postupanja sa podacima prilikom tog kontakta opisan je u{' '}
          <Link to="/politika-privatnosti">Politici privatnosti</Link>.
        </p>
      </Clause>

      <Clause n="8" title="Ograničenje odgovornosti">
        <p>
          Trudimo se da podaci na sajtu budu tačni i ažurni, ali ne garantujemo da su u svakom
          trenutku potpuni ni da će sajt raditi bez prekida. Ne odgovaramo za eventualnu štetu nastalu
          korišćenjem ili nemogućnošću korišćenja sajta, osim u slučajevima predviđenim prinudnim
          propisima.
        </p>
      </Clause>

      <Clause n="9" title="Izmene uslova">
        <p>
          Uslove možemo izmeniti u bilo kom trenutku. Važeća je verzija objavljena na ovoj stranici,
          sa datumom poslednje izmene na vrhu. Na već zaključene ugovore izmene ovih uslova nemaju
          dejstvo.
        </p>
      </Clause>

      <Clause n="10" title="Merodavno pravo i sporovi">
        <p>
          Na ove uslove primenjuje se pravo Republike Srbije. Sporove pokušavamo da rešimo dogovorom;
          ako to ne uspe, nadležan je stvarno nadležni sud prema sedištu privrednog subjekta. Ako je
          naručilac potrošač u smislu Zakona o zaštiti potrošača, zadržava sva prava koja mu po tom
          zakonu pripadaju, uključujući pravo na vansudsko rešavanje potrošačkog spora.
        </p>
        <p className="pt-2">
          <Link to="/politika-privatnosti">Politika privatnosti →</Link>
        </p>
      </Clause>
    </LegalLayout>
  )
}
