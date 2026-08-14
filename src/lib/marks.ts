// The pen. One nib shape, used twice on the page: under "Potpišite svoj san" where the
// scroll draws it, and under the owner's name in the footer where it just sits signed.
// Points at both ends, weight through the belly, off the page in a rising flick.
export const SIGNATURE_VIEWBOX = '0 0 520 60'
export const SIGNATURE_STROKE =
  'M 8 40 C 64 24, 146 19, 226 28 C 296 36, 358 45, 416 33 C 452 25, 482 15, 515 2 ' +
  'C 486 17, 456 27, 414 37 C 356 51, 294 42, 225 34 C 145 25, 64 30, 8 40 Z'
/** the clip has to travel a little past the viewBox so the flick's tip is not shaved */
export const SIGNATURE_SWEEP = 520 * 1.06

/**
 * The registered business, exactly as it stands in the APR Register of Business Entities
 * (rešenje BP 110097/2026, 03.07.2026) and the Tax Administration's PIB confirmation.
 * Serbian law (Zakon o privrednim društvima čl. 25) requires the business name, seat,
 * registration number and PIB to appear on business documents — this page included.
 *
 * NOTHING personal belongs in here. The founding documents also carry a JMBG, a date of
 * birth and a parent's name; those are identity data, not company data, and must never
 * reach a public page.
 */
export const LEGAL = {
  /** poslovno ime — the full registered name */
  name: 'Nikola Šukunda preduzetnik Računarsko programiranje DREAMSIGN Ruma',
  /** skraćeno poslovno ime — the registered short form */
  shortName: 'Nikola Šukunda preduzetnik DREAMSIGN',
  form: 'Preduzetnik',
  /** batch 4: "Srbija", not "Republika Srbija" — footer display form. The legal pages keep
      the official register wording; this is the shop window, not the certificate. */
  seat: 'Dušana Jerkovića 42, 22400 Ruma, Srbija',
  /** the certificate wording — what the two legal pages declare (batch 59) */
  seatOfficial: 'Dušana Jerkovića 42, 22400 Ruma, Republika Srbija',
  registrationNo: '68643627',
  pib: '115798587',
  activity: '6201 — Računarsko programiranje',
  registeredAt: 'Agencija za privredne registre',
  registeredOn: '03.07.2026.',
  owner: 'Nikola Šukunda',
  /**
   * The public contact address (batch 4, Nick's instruction). KNOWN LIMITATION, on the
   * record: dreamsign.rs is not purchased yet, so this mailbox DOES NOT EXIST — mail sent
   * here bounces until the Stage 8 domain purchase creates it. The legal pages keep the
   * APR-registered gmail, so a working address is always published somewhere on the site.
   */
  email: 'podrska@dreamsign.rs',
  /** the address registered with APR for receiving electronic mail — the legal pages use it */
  registeredEmail: 'nicolasukunda@gmail.com',
  phone: '+381 63 773 6963',
  phoneHref: 'tel:+381637736963',
} as const
