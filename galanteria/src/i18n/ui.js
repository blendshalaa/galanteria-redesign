/**
 * UI chrome strings — loading, empty, error, buttons, labels.
 *
 * These were previously hardcoded inline at their call sites, which meant a
 * number of them leaked the wrong language to visitors. English and German
 * users saw "Duke ngarkuar...", "Nuk ka produkte në këtë kategori për
 * momentin." and "Produkti nuk u gjet!"; Albanian and German users saw
 * "Client", "Socials" and "Top".
 *
 * `src/lang.js` holds the marketing copy and has an awkward array-of-one-object
 * shape (`language[lang].contact[0].title`). This file is deliberately separate
 * and flat: it is for interface furniture, and it is the thing every component
 * needs on every render.
 */

const strings = {
  // ---- generic ------------------------------------------------------------
  loading:        { sq: 'Duke ngarkuar...',  en: 'Loading...',       de: 'Wird geladen...' },
  retry:          { sq: 'Provo sërish',      en: 'Try again',        de: 'Erneut versuchen' },
  back:           { sq: 'Kthehu',            en: 'Back',             de: 'Zurück' },
  home:           { sq: 'Ballina',           en: 'Home',             de: 'Startseite' },
  close:          { sq: 'Mbyll',             en: 'Close',            de: 'Schließen' },
  seeAll:         { sq: 'Shiko të gjitha',   en: 'See all',          de: 'Alle anzeigen' },
  loadMore:       { sq: 'Shfaq më shumë',    en: 'Load more',        de: 'Mehr laden' },
  skipToContent:  { sq: 'Kalo te përmbajtja', en: 'Skip to content', de: 'Zum Inhalt springen' },

  // ---- homepage sections --------------------------------------------------
  // The homepage previously rendered the *same* lang.js string as both the
  // small accent kicker and the large heading directly beneath it, so every
  // section title appeared twice. These are the kickers — deliberately a
  // different word from the heading they sit above.
  eyebrowCollection: { sq: 'Koleksioni',    en: 'Collection',      de: 'Kollektion' },
  eyebrowClients:    { sq: 'Dëshmi',        en: 'Testimonials',    de: 'Referenzen' },
  eyebrowPartners:   { sq: 'Bashkëpunime',  en: 'Collaborations',  de: 'Kooperationen' },
  eyebrowContact:    { sq: 'Kontakti',      en: 'Get in touch',    de: 'Kontakt' },
  eyebrowProjects:   { sq: 'Portofoli',     en: 'Portfolio',       de: 'Portfolio' },

  heroCta:      { sq: 'Shiko koleksionin', en: 'View collection', de: 'Kollektion ansehen' },
  contactUs:    { sq: 'Na kontaktoni',     en: 'Contact us',      de: 'Kontakt aufnehmen' },
  requestQuote: { sq: 'Kërko ofertë',      en: 'Request a quote', de: 'Angebot anfordern' },

  // Were three inline `lang === 'sq' ? … : lang === 'de' ? … : …` ternaries
  // sitting in the middle of the homepage JSX.
  statsProjects: { sq: 'Projekte të realizuara', en: 'Completed projects', de: 'Abgeschlossene Projekte' },
  statsClients:  { sq: 'Klientë të kënaqur',     en: 'Satisfied clients',  de: 'Zufriedene Kunden' },
  statsYears:    { sq: 'Vite eksperiencë',       en: 'Years of experience', de: 'Jahre Erfahrung' },

  // ---- error / empty states ----------------------------------------------
  errorTitle: {
    sq: 'Diçka shkoi keq',
    en: 'Something went wrong',
    de: 'Etwas ist schiefgelaufen',
  },
  errorBody: {
    sq: 'Nuk arritëm t’i marrim të dhënat. Kontrolloni lidhjen dhe provoni sërish.',
    en: 'We could not load this content. Check your connection and try again.',
    de: 'Die Inhalte konnten nicht geladen werden. Bitte Verbindung prüfen und erneut versuchen.',
  },

  // ---- catalogue ----------------------------------------------------------
  noProducts: {
    sq: 'Nuk ka produkte në këtë kategori për momentin.',
    en: 'There are no products in this category yet.',
    de: 'In dieser Kategorie gibt es noch keine Produkte.',
  },
  noProjects: {
    sq: 'Nuk ka projekte për momentin.',
    en: 'There are no projects yet.',
    de: 'Es gibt noch keine Projekte.',
  },
  productNotFound: { sq: 'Produkti nuk u gjet!', en: 'Product not found',  de: 'Produkt nicht gefunden' },
  projectNotFound: { sq: 'Projekti nuk u gjet!', en: 'Project not found',  de: 'Projekt nicht gefunden' },
  viewProduct:     { sq: 'Shiko Produktin',      en: 'View Product',       de: 'Produkt ansehen' },
  viewProject:     { sq: 'Shiko Projektin',      en: 'View Project',       de: 'Projekt ansehen' },
  gallery:         { sq: 'Galeria',              en: 'Gallery',            de: 'Galerie' },
  relatedProducts: { sq: 'Produkte të ngjashme', en: 'Related products',   de: 'Ähnliche Produkte' },
  allCategories:   { sq: 'Të gjitha kategoritë', en: 'All categories',     de: 'Alle Kategorien' },
  /* The project breadcrumb rendered the hardcoded English word "Projects" to
     Albanian and German visitors. */
  projects:        { sq: 'Projektet',            en: 'Projects',           de: 'Projekte' },
  productCount:    { sq: 'produkte',             en: 'products',           de: 'Produkte' },

  sortBy:      { sq: 'Rendit sipas',  en: 'Sort by',    de: 'Sortieren nach' },
  sortNewest:  { sq: 'Më të rejat',   en: 'Newest',     de: 'Neueste' },
  sortNameAsc: { sq: 'Emri (A–Z)',    en: 'Name (A–Z)', de: 'Name (A–Z)' },
  sortNameDesc:{ sq: 'Emri (Z–A)',    en: 'Name (Z–A)', de: 'Name (Z–A)' },

  // ---- search -------------------------------------------------------------
  search:            { sq: 'Kërko',                    en: 'Search',                  de: 'Suchen' },
  searchPlaceholder: { sq: 'Kërko produkte...',        en: 'Search products...',      de: 'Produkte suchen...' },
  searchHint: {
    sq: 'Shkruani të paktën 2 shkronja për të kërkuar.',
    en: 'Type at least 2 characters to search.',
    de: 'Geben Sie mindestens 2 Zeichen ein.',
  },
  searchNoResults: {
    sq: 'Asnjë rezultat për',
    en: 'No results for',
    de: 'Keine Ergebnisse für',
  },

  // ---- contact / quote form ----------------------------------------------
  contactFormTitle: {
    sq: 'Na shkruani',
    en: 'Send us a message',
    de: 'Schreiben Sie uns',
  },
  contactFormIntro: {
    sq: 'Plotësoni formën dhe ju kthehemi brenda 24 orësh.',
    en: 'Fill in the form and we will get back to you within 24 hours.',
    de: 'Füllen Sie das Formular aus, wir melden uns innerhalb von 24 Stunden.',
  },
  quoteTitle:   { sq: 'Kërko ofertë',        en: 'Request a quote',      de: 'Angebot anfordern' },
  quoteIntro:   { sq: 'Na tregoni çfarë ju nevojitet dhe ju kthehemi me çmim.',
                  en: 'Tell us what you need and we will come back with a price.',
                  de: 'Sagen Sie uns, was Sie brauchen — wir melden uns mit einem Preis.' },
  quoteAbout:   { sq: 'Interesuar për',      en: 'Interested in',        de: 'Interesse an' },

  // Contact page card labels — were inline ternaries, and the phone one read
  // `lang === 'de' ? 'Telefon' : lang === 'sq' ? 'Telefon' : 'Phone'`, i.e. two
  // branches returning the same string.
  labelLocation: { sq: 'Lokacioni', en: 'Location', de: 'Standort' },
  labelPhone:    { sq: 'Telefoni',  en: 'Phone',    de: 'Telefon' },

  fieldName:    { sq: 'Emri',                en: 'Name',                 de: 'Name' },
  fieldEmail:   { sq: 'Email',               en: 'Email',                de: 'E-Mail' },
  fieldPhone:   { sq: 'Telefoni (opsional)', en: 'Phone (optional)',     de: 'Telefon (optional)' },
  fieldMessage: { sq: 'Mesazhi',             en: 'Message',              de: 'Nachricht' },
  submit:       { sq: 'Dërgo',               en: 'Send',                 de: 'Senden' },
  submitting:   { sq: 'Duke dërguar...',     en: 'Sending...',           de: 'Wird gesendet...' },

  formRequired:     { sq: 'Kjo fushë është e detyrueshme.', en: 'This field is required.',       de: 'Dieses Feld ist erforderlich.' },
  formInvalidEmail: { sq: 'Email-i nuk duket i saktë.',     en: 'That email does not look right.', de: 'Diese E-Mail sieht nicht korrekt aus.' },
  formTooLong:      { sq: 'Teksti është shumë i gjatë.',    en: 'That text is too long.',        de: 'Der Text ist zu lang.' },
  formSuccess: {
    sq: 'Faleminderit! Mesazhi u dërgua — ju kontaktojmë së shpejti.',
    en: 'Thank you! Your message has been sent — we will be in touch shortly.',
    de: 'Vielen Dank! Ihre Nachricht wurde gesendet — wir melden uns in Kürze.',
  },
  formError: {
    sq: 'Mesazhi nuk u dërgua. Provoni sërish ose na telefononi.',
    en: 'Your message could not be sent. Please try again or call us.',
    de: 'Ihre Nachricht konnte nicht gesendet werden. Bitte erneut versuchen oder anrufen.',
  },

  // ---- footer -------------------------------------------------------------
  // These were inline `lang === 'sq' ? … : lang === 'de' ? … : …` ternaries in
  // Footer.jsx. Two of them were also incomplete: the "Navigation" and
  // "Kontakti" column labels only branched on Albanian, so a German visitor
  // got the English word and an English visitor got the Albanian one.
  footerCtaLead: { sq: 'Gati për të',                en: 'Ready to',              de: 'Bereit, Ihren' },
  footerCtaEmph: { sq: 'transformuar hapësirën?',    en: 'elevate your space?',   de: 'Raum zu verwandeln?' },
  footerTagline: {
    sq: 'Mobilim premium për hapësira pune moderne, duke sjellë inovacion dhe cilësi.',
    en: 'Premium furniture for modern workspaces, delivering innovation and uncompromising quality.',
    de: 'Premium-Möbel für moderne Arbeitsbereiche, mit Innovation und kompromissloser Qualität.',
  },
  navigation:      { sq: 'Navigimi', en: 'Navigation', de: 'Navigation' },
  contactLabel:    { sq: 'Kontakti', en: 'Contact',    de: 'Kontakt' },
  rightsReserved: {
    sq: 'Të gjitha të drejtat e rezervuara.',
    en: 'All rights reserved.',
    de: 'Alle Rechte vorbehalten.',
  },

  // ---- chrome -------------------------------------------------------------
  socials:      { sq: 'Rrjetet sociale', en: 'Socials',      de: 'Soziale Netzwerke' },
  backToTop:    { sq: 'Lart',            en: 'Top',          de: 'Nach oben' },
  client:       { sq: 'Klient',          en: 'Client',       de: 'Kunde' },
  openMenu:     { sq: 'Hap menynë',      en: 'Open menu',    de: 'Menü öffnen' },
  closeMenu:    { sq: 'Mbyll menynë',    en: 'Close menu',   de: 'Menü schließen' },

  // ---- 404 ----------------------------------------------------------------
  notFoundTitle: {
    sq: 'Faqja nuk u gjet',
    en: 'Page not found',
    de: 'Seite nicht gefunden',
  },
  notFoundBody: {
    sq: 'Faqja që kërkuat nuk ekziston ose është zhvendosur.',
    en: 'The page you are looking for does not exist or has moved.',
    de: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
  },
  backHome: { sq: 'Kthehu në ballinë', en: 'Back to home', de: 'Zurück zur Startseite' },

  // ---- lightbox -----------------------------------------------------------
  previousImage: { sq: 'Fotoja e mëparshme', en: 'Previous image', de: 'Vorheriges Bild' },
  nextImage:     { sq: 'Fotoja tjetër',      en: 'Next image',     de: 'Nächstes Bild' },
};

export const SUPPORTED_LANGS = ['sq', 'en', 'de'];

/**
 * @param {'sq'|'en'|'de'} lang
 * @param {string} key
 */
export function t(lang, key) {
  const entry = strings[key];
  if (!entry) {
    if (import.meta.env.DEV) console.warn(`[i18n] Missing UI string: "${key}"`);
    return key;
  }
  // Fall back to English rather than rendering `undefined`.
  return entry[lang] ?? entry.en;
}

/** Pick the right translated column off a Supabase row: name_sq / name_en / … */
export function localized(row, field, lang, fallbackField = null) {
  if (!row) return '';
  return (
    row[`${field}_${lang}`] ||
    row[`${field}_en`] ||
    row[`${field}_sq`] ||
    (fallbackField ? row[fallbackField] : '') ||
    ''
  );
}

export default strings;
