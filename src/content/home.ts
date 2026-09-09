import type { Locale, LocalisedText } from "@/content/i18n";

export type PhotoTone = "sea" | "harbour" | "sand" | "dusk" | "olive" | "stone";

export type PhotoAsset = {
  src: string;
  alt: LocalisedText;
  objectPosition?: string;
};

export type Captain = {
  name: LocalisedText;
  location?: LocalisedText;
  languages?: LocalisedText;
  introduction?: LocalisedText;
  imageLabel: LocalisedText;
  image?: PhotoAsset;
  tone: PhotoTone;
};

export type Story = {
  title: LocalisedText;
  excerpt: LocalisedText;
  imageLabel: LocalisedText;
  image: PhotoAsset;
  tone: PhotoTone;
};

export type Destination = {
  slug: string;
  name: LocalisedText;
  actionName?: LocalisedText;
  description: LocalisedText;
  imageLabel: LocalisedText;
  image?: PhotoAsset;
  tone: PhotoTone;
};

export type SeaPractice = {
  title: LocalisedText;
  text: LocalisedText;
  imageLabel: LocalisedText;
  image: PhotoAsset;
  tone: PhotoTone;
};

export const homeCopy = {
  en: {
    skipLink: "Skip to content",
    navLabel: "Primary",
    mobileNavLabel: "Mobile",
    menu: "Menu",
    languageSwitcherLabel: "Choose language",
    logoHref: "/",
    nav: [
      ["Captains", "#captains"],
      ["Stories", "#stories"],
      ["Destinations", "#destinations"],
      ["About", "#trust"],
    ],
    footer: {
      description:
        "Introductions to local captains who know their waters, their limits and the value of a quiet day at sea.",
      navLabel: "Footer",
      links: [
        ["Manifest", "/docs/Manifest.md"],
        ["How We Verify Captains", "#trust"],
        ["Editorial Principles", "/docs/Editorial_Style_Guide.md"],
        ["Contact", "mailto:hello@fishwithlocals.com"],
      ],
    },
    hero: {
      eyebrow: "Bar & Budva · Montenegro",
      heading: "Choose the person who knows the sea.",
      body: "Meet local captains we know personally. Learn how they fish, teach, cook and care for these waters—then speak with them directly.",
      primaryAction: "Meet the Captains",
      barAction: "Explore Bar",
      budvaAction: "Explore Budva",
      imageLabel:
        "Hero placeholder — a captain preparing gear beside a small boat in early natural light",
      image: {
        src: "/images/home/hero-svitanje-bar.jpg",
        alt: "Calm sea at dawn near Bar, seen from a small boat before the day begins.",
        objectPosition: "50% 52%",
      },
      imageNote:
        "Temporary photography slot. The final image will come from a real morning with a verified captain.",
    },
    trust: {
      eyebrow: "Trust before conversation",
      heading: "Known personally.\nRepresented honestly.",
      body: "A photograph of a boat tells very little about the person at the helm. We meet every captain, check what matters and write each profile from a real conversation.",
      steps: [
        ["01", "We meet", "Time in the marina, on the boat and in conversation comes before publication."],
        ["02", "We verify", "Identity, vessel, safety, experience and public claims are checked and reviewed."],
        ["03", "You speak directly", "FishWithLocals makes the introduction. Captain and guest decide together what feels right."],
      ],
    },
    captains: {
      eyebrow: "The people at the helm",
      heading: "Meet the captains",
      body: "Choose a person whose temperament, knowledge and way of sharing the sea feel right for you.",
      note: "Prototype profiles: names, words and photographs will be replaced after real conversations and verification.",
      verified: "Verified profile",
      action: "Meet the Captain",
    },
    stories: {
      eyebrow: "Things worth remembering",
      heading: "Stories from the water",
      body: "Not every story needs a large catch. Sometimes the moment that stays is a lesson, a change in weather, or the silence after something passes beneath the boat.",
      action: "Read the Story",
    },
    destinations: {
      eyebrow: "Two places, their own rhythms",
      heading: "Bar and Budva",
      body: "Destinations are more than departure points. They hold working mornings, local food, remembered weather and people who have learnt these waters over time.",
      action: "Explore",
    },
    sea: {
      eyebrow: "Respect in ordinary actions",
      heading: "The sea is not a backdrop.",
      body: "Responsible fishing is not a badge. It appears in what a captain keeps, what they release, what they bring back to shore and how much room they leave for others.",
    },
    seaLog: {
      title: "Sea Log",
      heading: "Seen something unusual at sea?",
      body: "Our captains and guests often notice changes while they are out on the water. Unusual or invasive species, marine litter, abandoned fishing gear, wildlife in distress and other unusual observations can all help us understand what is happening at sea.",
      action: "Report an observation",
      href: "/sea-log",
    },
    invitation: {
      eyebrow: "A conversation, not a checkout",
      heading: "Find the person you would like to spend a day with.",
      body: "Take your time. Read their stories. When someone feels right, start a direct conversation about the day.",
      action: "Meet the Captains",
    },
  },
  cg: {
    skipLink: "Preskoči na sadržaj",
    navLabel: "Glavna navigacija",
    mobileNavLabel: "Mobilna navigacija",
    menu: "Meni",
    languageSwitcherLabel: "Izaberi jezik",
    logoHref: "/?lang=cg",
    nav: [
      ["Kapetani", "#captains"],
      ["Priče", "#stories"],
      ["Destinacije", "#destinations"],
      ["O nama", "#trust"],
    ],
    footer: {
      description:
        "Upoznavanje sa lokalnim kapetanima koji poznaju svoje more, njegove granice i vrijednost mirnog dana na vodi.",
      navLabel: "Podnožje",
      links: [
        ["Manifest", "/docs/Manifest.md"],
        ["Kako provjeravamo kapetane", "#trust"],
        ["Urednička načela", "/docs/Editorial_Style_Guide.md"],
        ["Kontakt", "mailto:hello@fishwithlocals.com"],
      ],
    },
    hero: {
      eyebrow: "Bar i Budva · Crna Gora",
      heading: "Izaberi kapetana koji poznaje more.",
      body: "Upoznaj lokalne kapetane koje lično poznajemo. Saznaj kako pecaju, prenose znanje, spremaju hranu i brinu o moru — a onda razgovaraj direktno sa njima.",
      primaryAction: "Upoznaj kapetane",
      barAction: "Istraži Bar",
      budvaAction: "Istraži Budvu",
      imageLabel:
        "Mjesto za fotografiju — kapetan priprema opremu pored malog broda u ranom prirodnom svjetlu",
      image: {
        src: "/images/home/hero-svitanje-bar.jpg",
        alt: "Mirno more u zoru kod Bara, viđeno sa malog broda prije početka dana.",
        objectPosition: "50% 52%",
      },
      imageNote:
        "Privremeno mjesto za fotografiju. Konačna slika doći će iz stvarnog jutra sa provjerenim kapetanom.",
    },
    trust: {
      eyebrow: "Povjerenje prije razgovora",
      heading: "Lično ih poznajemo.\nIskreno ih predstavljamo.",
      body: "Fotografija broda govori vrlo malo o osobi za kormilom. Upoznajemo svakog kapetana, provjeravamo ono što je važno i pišemo svaki profil iz stvarnog razgovora.",
      steps: [
        ["01", "Upoznajemo se", "Vrijeme u marini, na brodu i u razgovoru dolazi prije objavljivanja."],
        ["02", "Provjeravamo", "Identitet, plovilo, sigurnost, iskustvo i javne tvrdnje provjeravaju se i pažljivo pregledaju."],
        ["03", "Razgovarate direktno", "FishWithLocals pravi uvod. Kapetan i gost zajedno odlučuju šta ima smisla za taj dan."],
      ],
    },
    captains: {
      eyebrow: "Ljudi za kormilom",
      heading: "Upoznaj kapetane",
      body: "Izaberi osobu čiji temperament, znanje i način dijeljenja mora odgovaraju onome što tražiš.",
      note: "Prototip profila: imena, tekst i fotografije biće zamijenjeni nakon stvarnih razgovora i provjere.",
      verified: "Provjeren profil",
      action: "Upoznaj kapetana",
    },
    stories: {
      eyebrow: "Ono što se pamti",
      heading: "Priče sa mora",
      body: "Ne mora svaka priča imati veliki ulov. Ponekad ostane lekcija, promjena vremena ili tišina poslije nečega što je prošlo ispod broda.",
      action: "Pročitaj priču",
    },
    destinations: {
      eyebrow: "Dva mjesta, svaki sa svojim ritmom",
      heading: "Bar i Budva",
      body: "Destinacije su više od mjesta polaska. U njima su radna jutra, lokalna hrana, zapamćeno vrijeme i ljudi koji su ovo more učili godinama.",
      action: "Istraži",
    },
    sea: {
      eyebrow: "Poštovanje u običnim postupcima",
      heading: "More nije pozadina.",
      body: "Odgovoran ribolov nije značka. Vidi se u tome šta kapetan zadrži, šta pusti, šta vrati na obalu i koliko prostora ostavi drugima.",
    },
    seaLog: {
      title: "Dnevnik mora",
      heading: "Jesi li primijetio nešto neobično na moru?",
      body: "Naši kapetani i gosti često primijete promjene dok su na moru. Neuobičajene ili invazivne vrste, otpad u moru, napuštena ribarska oprema, životinje u nevolji i druga neobična opažanja mogu nam pomoći da bolje razumijemo šta se dešava u moru.",
      action: "Prijavi opažanje",
      href: "/sea-log?lang=cg",
    },
    invitation: {
      eyebrow: "Razgovor, ne plaćanje na brzinu",
      heading: "Pronađi kapetana sa kojim bi volio da provedeš dan.",
      body: "Uzmi vrijeme. Pročitaj njihove priče. Kada pronađeš kapetana koji ti odgovara, razgovaraj direktno sa njim.",
      action: "Upoznaj kapetane",
    },
  },
} as const;

export const captains: Captain[] = [
  {
    name: { en: "Feta", cg: "Feta" },
    introduction: {
      en: "He begins with strong coffee, explains every knot without hurrying, and never pretends a quiet sea owes anyone a fish.",
      cg: "Počinje jakom kafom, objašnjava svaki čvor bez žurbe i nikad se ne ponaša kao da mirno more nekome duguje ribu.",
    },
    imageLabel: {
      en: "Feta temporary profile photograph",
      cg: "Fetina privremena profilna fotografija",
    },
    image: {
      src: "/images/home/captain-feta-ulov-5.webp",
      alt: {
        en: "Feta on board with a catch, used as a temporary profile photograph.",
        cg: "Feta na brodu sa ulovom, korišćeno kao privremena profilna fotografija.",
      },
      objectPosition: "50% 50%",
    },
    tone: "harbour",
  },
  {
    name: { en: "Captain #2", cg: "Kapetan #2" },
    imageLabel: {
      en: "Neutral captain placeholder",
      cg: "Neutralno mjesto za kapetana",
    },
    tone: "sea",
  },
  {
    name: { en: "Captain #3", cg: "Kapetan #3" },
    imageLabel: {
      en: "Neutral captain placeholder",
      cg: "Neutralno mjesto za kapetana",
    },
    tone: "dusk",
  },
];

export const stories: Story[] = [
  {
    title: { en: "The knot tied twice", cg: "Čvor vezan dvaput" },
    excerpt: {
      en: "A child forgets the first knot before the line reaches the water. The captain starts again, more slowly this time.",
      cg: "Dijete zaboravi prvi čvor prije nego što najlon dodirne vodu. Kapetan počinje ponovo, ovoga puta sporije.",
    },
    imageLabel: {
      en: "Story placeholder — hands teaching a simple fishing knot",
      cg: "Mjesto za priču — ruke pokazuju jednostavan ribarski čvor",
    },
    image: {
      src: "/images/home/story-zalazak-sunca-bar-2.jpg",
      alt: {
        en: "Evening light over the sea near Bar, seen from a small boat.",
        cg: "Večernje svjetlo nad morem kod Bara, viđeno sa malog broda.",
      },
      objectPosition: "50% 54%",
    },
    tone: "stone",
  },
  {
    title: { en: "A tuna, there for a second", cg: "Tuna, tu samo na sekund" },
    excerpt: {
      en: "No photograph, no catch. Just one dark shape breaking the surface and three people seeing it at the same time.",
      cg: "Bez fotografije, bez ulova. Samo tamna silueta koja probija površinu i troje ljudi koji je vide u istom trenutku.",
    },
    imageLabel: {
      en: "Story placeholder — quiet open water beyond the boat",
      cg: "Mjesto za priču — mirno otvoreno more iza broda",
    },
    image: {
      src: "/images/home/experience-bar-stap-penudlanje.jpg",
      alt: {
        en: "A fishing rod set over the water during a day out near Bar.",
        cg: "Ribarski štap postavljen iznad vode tokom dana na moru kod Bara.",
      },
      objectPosition: "52% 50%",
    },
    tone: "sea",
  },
  {
    title: { en: "Coffee before the harbour wakes", cg: "Kafa prije nego što se luka probudi" },
    excerpt: {
      en: "The rods can wait. First comes a small metal pot, two cups and the weather moving down from the hills.",
      cg: "Štapovi mogu da sačekaju. Prvo dolazi mala metalna džezva, dvije šoljice i vrijeme koje se spušta sa brda.",
    },
    imageLabel: {
      en: "Story placeholder — coffee beside rope on a working boat",
      cg: "Mjesto za priču — kafa pored konopa na radnom brodu",
    },
    image: {
      src: "/images/home/story-maljevik-bar.jpg",
      alt: {
        en: "A quiet coastal view at Maljevik, Bar.",
        cg: "Miran pogled na obalu kod Maljevika, Bar.",
      },
      objectPosition: "50% 50%",
    },
    tone: "sand",
  },
];

export const destinations: Destination[] = [
  {
    slug: "bar",
    name: { en: "Bar", cg: "Bar" },
    description: {
      en: "A working port, old fishing habits and mornings that begin while the town is still quiet. Bar faces open water and keeps its stories close to the marina.",
      cg: "Radna luka, stare ribarske navike i jutra koja počinju dok je grad još tih. Bar gleda prema otvorenom moru i drži svoje priče blizu marine.",
    },
    imageLabel: {
      en: "Destination placeholder — Bar harbour in early morning light",
      cg: "Mjesto za destinaciju — barska luka u ranom jutarnjem svjetlu",
    },
    image: {
      src: "/images/home/destination-bar-panorama.jpg",
      alt: {
        en: "The Bar coastline seen from the water.",
        cg: "Barska obala viđena sa mora.",
      },
      objectPosition: "50% 50%",
    },
    tone: "harbour",
  },
  {
    slug: "budva",
    name: { en: "Budva", cg: "Budva" },
    actionName: { en: "Budva", cg: "Budvu" },
    description: {
      en: "Small boats leave beside a waterfront that changes character before the streets fill. Here, local knowledge lives between the old coast and busy summer water.",
      cg: "Mali brodovi isplovljavaju pored obale koja promijeni lice prije nego što se ulice napune. Ovdje lokalno znanje živi između stare obale i užurbanog ljetnjeg mora.",
    },
    imageLabel: {
      en: "Destination placeholder — Budva shoreline from a small boat",
      cg: "Mjesto za destinaciju — budvanska obala viđena sa malog broda",
    },
    tone: "dusk",
  },
];

export const seaPractices: SeaPractice[] = [
  {
    title: { en: "Bring back what does not belong", cg: "Vrati ono što ne pripada moru" },
    text: {
      en: "A rubbish bag travels on every boat. Floating plastic comes ashore when it can be collected safely.",
      cg: "Kesa za otpad ide na svaki brod. Plastika koja pluta vraća se na obalu kada se može bezbjedno pokupiti.",
    },
    imageLabel: {
      en: "Photography placeholder — hands collecting floating plastic",
      cg: "Mjesto za fotografiju — ruke skupljaju plastiku koja pluta",
    },
    image: {
      src: "/images/home/sea-respect-dobre-vode-bar.jpg",
      alt: {
        en: "Calm sea looking towards Dobre Vode, Bar.",
        cg: "Mirno more prema Dobrim Vodama, Bar.",
      },
      objectPosition: "50% 50%",
    },
    tone: "olive",
  },
  {
    title: { en: "Leave room on the water", cg: "Ostavi prostor na vodi" },
    text: {
      en: "Other boats, working lines and quiet fishing grounds are given the space they need.",
      cg: "Drugim brodovima, postavljenim najlonima i tihim ribarskim mjestima ostavlja se prostor koji im treba.",
    },
    imageLabel: {
      en: "Photography placeholder — two working boats with clear water between them",
      cg: "Mjesto za fotografiju — dva radna broda sa čistim morem između njih",
    },
    image: {
      src: "/images/home/sea-respect-ratac-bar.jpg",
      alt: {
        en: "Calm water and coast near Ratac, Bar.",
        cg: "Mirno more i obala kod Ratca, Bar.",
      },
      objectPosition: "50% 50%",
    },
    tone: "sea",
  },
  {
    title: { en: "Take only what will be used", cg: "Uzmi samo ono što će se iskoristiti" },
    text: {
      en: "Fish are handled with care, released when appropriate, and never kept merely to make a photograph.",
      cg: "Riba se drži pažljivo, pušta kada je to ispravno i nikada se ne zadržava samo zbog fotografije.",
    },
    imageLabel: {
      en: "Photography placeholder — careful release beside a small boat",
      cg: "Mjesto za fotografiju — pažljivo puštanje ribe pored malog broda",
    },
    image: {
      src: "/images/home/destination-bar-panorama.jpg",
      alt: {
        en: "The Bar coast seen quietly from the water.",
        cg: "Barska obala mirno viđena sa mora.",
      },
      objectPosition: "50% 50%",
    },
    tone: "stone",
  },
];

export function getHomeCopy(locale: Locale) {
  return homeCopy[locale];
}
