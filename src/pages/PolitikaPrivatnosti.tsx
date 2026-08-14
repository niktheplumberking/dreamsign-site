// POLITIKA PRIVATNOSTI — a real page of the site (batch 59). The text is the batch-58
// document, researched against the Zakon o zaštiti podataka o ličnosti (87/2018), the Zakon o
// elektronskoj trgovini and the Zakon o elektronskim komunikacijama; only its housing changed.
import { Link } from 'react-router-dom'
import { LegalLayout, Clause, SubClause, Facts, Bullets } from '../components/LegalLayout'
import { usePageMeta } from '../lib/meta'
import { LEGAL } from '../lib/marks'

export default function PolitikaPrivatnosti() {
  usePageMeta({
    title: 'Politika privatnosti — DreamSign',
    description:
      'Kako DreamSign postupa sa podacima o ličnosti posetilaca sajta — šta se prikuplja, na kom osnovu, kome se prosleđuje, koliko se čuva i koja su vaša prava.',
    path: '/politika-privatnosti',
  })

  return (
    <LegalLayout
      title="Politika privatnosti"
      updated="13.08.2026."
      intro={
        <p>
          Ova politika objašnjava kako se postupa sa podacima o ličnosti prilikom posete ovom sajtu i
          prilikom kontakta sa nama. Pisana je u skladu sa <strong>Zakonom o zaštiti podataka o
          ličnosti</strong> („Službeni glasnik RS“, br. 87/2018), a u delu koji se odnosi na uređaj
          posetioca i u skladu sa <strong>Zakonom o elektronskim komunikacijama</strong>.
        </p>
      }
    >
      <Clause n="1" title="Ko je rukovalac podacima">
        <Facts
          rows={[
            ['Poslovno ime', LEGAL.name],
            ['Skraćeno poslovno ime', LEGAL.shortName],
            ['Sedište', LEGAL.seatOfficial],
            ['Matični broj', LEGAL.registrationNo],
            ['PIB', LEGAL.pib],
            // the APR-registered address, not podrska@dreamsign.rs: that mailbox does not
            // exist until the domain is bought, and a legal page must publish an address
            // that actually receives (marks.ts says so too)
            ['E-pošta', <a href={`mailto:${LEGAL.registeredEmail}`}>{LEGAL.registeredEmail}</a>],
            ['Telefon', <a href={LEGAL.phoneHref}>{LEGAL.phone}</a>],
          ]}
        />
        <p>
          Nemamo obavezu da imenujemo lice za zaštitu podataka o ličnosti — za sva pitanja u vezi sa
          ovom politikom obraćate se direktno na kontakte iznad.
        </p>
      </Clause>

      <Clause n="2" title="Šta ovaj sajt prikuplja sam od sebe">
        <p>
          Sajt <strong>nema kontakt formular, nema korisničke naloge za posetioce, ne koristi alate
          za analitiku, ne postavlja reklamne piksele i ne prati vas kroz internet</strong>. Ako samo
          čitate stranice, od vas se ne traži nijedan podatak.
        </p>
        <SubClause n="2.1" title="Tehnički zapisi servera">
          <p>
            Kao i svaki sajt na internetu, server na kome je sajt postavljen automatski beleži
            podatke neophodne za isporuku stranice i njenu bezbednost: IP adresu, vreme pristupa, tip
            pregledača i traženu adresu. Ovi zapisi se koriste isključivo za rad i zaštitu sajta, na
            osnovu našeg legitimnog interesa da sajt bude dostupan i bezbedan.
          </p>
        </SubClause>
        <SubClause n="2.2" title="Lokalno skladište u vašem pregledaču">
          <p>
            Sajt upisuje <strong>jednu tehničku vrednost</strong> u <em>sessionStorage</em> vašeg
            pregledača, kako se uvodna animacija ne bi ponavljala pri svakom otvaranju stranice. Ta
            vrednost ne sadrži nikakav podatak o vama, ne prati vas i briše se automatski kada
            zatvorite karticu pregledača.
          </p>
        </SubClause>
      </Clause>

      <Clause n="3" title="Zakazivanje termina (cal.com)">
        <p>
          Na stranicama <em>Radovi</em> i <em>Kontakt</em> nalazi se kartica za zakazivanje
          razgovora. Kalendar pruža <strong>Cal.com, Inc.</strong> (Sjedinjene Američke Države) i on
          se <strong>ne učitava dok ga vi ne zatražite klikom</strong> na dugme „Prikaži slobodne
          termine“. Dok ne kliknete, nijedan podatak ne odlazi sa ovog sajta ka cal.com-u.
        </p>
        <p>
          Kada kalendar otvorite i zakažete termin, podatke koje unesete (ime, adresa e-pošte,
          izabrani termin i, ako ga upišete, kratak opis posla) prima cal.com kao naš obrađivač i
          prosleđuje ih nama, kako bismo termin potvrdili i razgovor održali. Otvaranjem kalendara
          vaš pregledač ostvaruje vezu sa cal.com-om, pa toj kompaniji postaju vidljivi i vaša IP
          adresa i osnovni podaci o pregledaču; cal.com tada može upisati i sopstvene kolačiće na vaš
          uređaj, u okviru svog dela stranice.
        </p>
        <p>
          <strong>Pravni osnov:</strong> preduzimanje radnji pre zaključenja ugovora, na vaš zahtev —
          zakazivanje razgovora tražite vi. <strong>Rok čuvanja:</strong> podaci o zakazanom terminu
          čuvaju se najduže 12 meseci od održanog razgovora, osim ako iz razgovora ne proistekne
          saradnja, kada važe rokovi iz tačke 8. Uslove cal.com-a možete pročitati na{' '}
          <a href="https://cal.com/privacy" target="_blank" rel="noopener">cal.com/privacy</a>.
        </p>
      </Clause>

      <Clause n="4" title="Kontakt putem WhatsApp-a">
        <p>
          Dugme „Započnite razgovor“ vas vodi na aplikaciju <strong>WhatsApp</strong>. Klikom na to
          dugme razgovor započinjete vi, a vaš broj telefona i sadržaj poruke obrađuje kompanija{' '}
          <strong>Meta Platforms Ireland Limited</strong> u skladu sa svojim uslovima i politikom
          privatnosti, na koje mi ne možemo uticati.
        </p>
        <p>
          Podatke koje nam pošaljete u tom razgovoru (ime, broj telefona, opis posla) koristimo
          isključivo da bismo odgovorili na vaš upit i, ako do saradnje dođe, pripremili ponudu i
          ugovor. Pravni osnov je <strong>preduzimanje radnji pre zaključenja ugovora na vaš
          zahtev</strong>, odnosno naš legitimni interes da odgovorimo na primljeni upit.
        </p>
      </Clause>

      <Clause n="5" title="E-pošta i telefon">
        <p>
          Ako nam pišete na e-poštu ili nas pozovete, obrađujemo ono što nam sami pošaljete —
          najčešće ime, kontakt i opis posla — radi odgovora na upit i pripreme saradnje. Naš
          poštanski sandučić trenutno vodi <strong>Google Ireland Limited</strong> (usluga Gmail).
        </p>
      </Clause>

      <Clause n="6" title="Veštačka inteligencija">
        <p>
          U izradi sajtova koristimo alate zasnovane na <strong>veštačkoj inteligenciji</strong> —
          dizajn, kod, ilustracije i predlozi teksta nastaju uz njihovu pomoć, a svaki rezultat pre
          isporuke pregleda i odobrava čovek. Zbog toga izričito naglašavamo dve stvari:
        </p>
        <Bullets
          items={[
            <>
              <strong>Podatke o ličnosti posetilaca ovog sajta ne prosleđujemo AI alatima.</strong>{' '}
              Ovaj sajt nema formular niti bazu posetilaca iz koje bi se takav podatak mogao
              proslediti.
            </>,
            <>
              Materijali koje nam <strong>klijent</strong> dostavi tokom projekta (tekstovi, slike,
              podaci o firmi) mogu biti obrađeni uz pomoć AI alata isključivo radi izrade tog
              projekta. Ako takvi materijali sadrže podatke o ličnosti, o tome klijenta obaveštavamo
              unapred i način obrade uređujemo ugovorom.
            </>,
          ]}
        />
        <p>
          Nijedna odluka koja bi proizvodila pravne posledice po vas ne donosi se automatizovano,
          niti vršimo profilisanje.
        </p>
      </Clause>

      <Clause n="7" title="Kolačići i pristup vašem uređaju">
        <p>
          Ovaj sajt <strong>ne postavlja kolačiće</strong> u statističke, reklamne ni bilo koje druge
          svrhe. Jedini upis u vaš pregledač je tehnička vrednost iz tačke 2.2, neophodna da bi sajt
          radio onako kako ste ga otvorili.
        </p>
        <p>
          Jedini sadržaj treće strane koji može pisati po vašem uređaju jeste kalendar iz tačke 3 — i
          on se, kao što je tamo objašnjeno, učitava tek na vaš klik. Time vam prethodi jasno
          obaveštenje i sopstvena radnja, u skladu sa zahtevima Zakona o elektronskim komunikacijama.
        </p>
      </Clause>

      <Clause n="8" title="Koliko dugo se podaci čuvaju">
        <Bullets
          items={[
            <>Prepiska o upitima iz koje ne proistekne saradnja — najduže <strong>12 meseci</strong>.</>,
            <>Podaci o zakazanim terminima — najduže <strong>12 meseci</strong> od razgovora.</>,
            <>Podaci vezani za zaključen ugovor — u rokovima koje propisuju poreski i računovodstveni propisi.</>,
            <>Tehnički zapisi servera — u kratkim rokovima koje primenjuje pružalac usluge hostinga.</>,
          ]}
        />
      </Clause>

      <Clause n="9" title="Kome se podaci prosleđuju">
        <p>
          Vaše podatke <strong>ne prodajemo</strong> i ne ustupamo trećim licima radi marketinga.
          Pristup im imaju samo pružaoci usluga bez kojih sajt i komunikacija ne mogu da rade, svaki
          u granicama svoje uloge:
        </p>
        <Facts
          rows={[
            ['Hosting sajta', 'Vercel Inc. (SAD) — isporuka stranica i tehnički zapisi servera. Po prelasku na produkcioni domen hosting preuzima drugi pružalac, a ova stranica se tada ažurira.'],
            ['Zakazivanje termina', 'Cal.com, Inc. (SAD) — samo ako sami otvorite kalendar'],
            ['Poruke', 'Meta Platforms Ireland Limited (WhatsApp) — samo ako sami započnete razgovor'],
            ['E-pošta', 'Google Ireland Limited (Gmail)'],
            ['Uređivanje sadržaja', 'Supabase (baza za prijavu vlasnika sajta) — obrađuje isključivo podatke o prijavi vlasnika, nikada podatke posetilaca'],
            ['Državni organi', 'samo kada to zakon izričito zahteva'],
          ]}
        />
        <SubClause n="9.1" title="Iznošenje podataka iz Republike Srbije">
          <p>
            Deo navedenih pružalaca usluga nalazi se van Republike Srbije, uključujući Sjedinjene
            Američke Države. U tim slučajevima prenos se vrši na osnovu <strong>standardnih ugovornih
            klauzula</strong>, odnosno drugog odgovarajućeg osnova predviđenog Zakonom o zaštiti
            podataka o ličnosti, uz obavezu pružaoca da podatke obrađuje samo po našem nalogu i uz
            odgovarajuće mere zaštite. Kopiju osnova za prenos možete tražiti na kontakt e-poštu iz
            tačke 1.
          </p>
        </SubClause>
      </Clause>

      <Clause n="10" title="Vaša prava">
        <p>U skladu sa Zakonom o zaštiti podataka o ličnosti imate pravo da:</p>
        <Bullets
          items={[
            'tražite pristup podacima koje o vama imamo;',
            'tražite ispravku netačnih ili dopunu nepotpunih podataka;',
            'tražite brisanje podataka;',
            'tražite ograničenje obrade i uložite prigovor na obradu;',
            'tražite prenosivost podataka;',
            'opozovete pristanak, kada se obrada zasniva na pristanku — opoziv ne utiče na zakonitost obrade pre opoziva.',
          ]}
        />
        <p>
          Zahtev možete poslati na <a href={`mailto:${LEGAL.registeredEmail}`}>{LEGAL.registeredEmail}</a>. Odgovaramo
          najkasnije u roku od 30 dana.
        </p>
      </Clause>

      <Clause n="11" title="Pritužba nadzornom organu">
        <p>
          Ako smatrate da su vaša prava povređena, možete se obratiti Povereniku za informacije od
          javnog značaja i zaštitu podataka o ličnosti, Bulevar kralja Aleksandra 15, 11120 Beograd —{' '}
          <a href="https://www.poverenik.rs" target="_blank" rel="noopener">www.poverenik.rs</a>.
        </p>
      </Clause>

      <Clause n="12" title="Izmene ove politike">
        <p>
          Politiku možemo povremeno izmeniti — na primer kada uvedemo novu uslugu ili promenimo
          pružaoca hostinga. Važeća je verzija objavljena na ovoj stranici, sa datumom poslednje
          izmene na vrhu.
        </p>
        <p className="pt-2">
          <Link to="/uslovi-koriscenja">Uslovi korišćenja →</Link>
        </p>
      </Clause>
    </LegalLayout>
  )
}
