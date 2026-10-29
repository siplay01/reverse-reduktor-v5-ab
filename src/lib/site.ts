// Company, certificate and build settings shared by both designs. Every value: ../ASSET_PROVENANCE.md, ../CONTENT_DECISIONS.md.

export const VARIANTS = ["a", "b"] as const;
export type V = (typeof VARIANTS)[number];
export const VARIANT_NAME: Record<V, string> = { a: "A · Naval Authority", b: "B · Steel & Cobalt" };

export const COMPANY = {
  brand: "Реверс-редуктор",
  tagline: "Судовое оборудование",
  operator: "ООО «Дело»",
  full: "Общество с ограниченной ответственностью «Дело»",
  inn: "2225060059",
  kpp: "222501001",
  ogrn: "1032202271309",
  phone: "+7 960 966-55-77",
  tel: "+79609665577",
  email: "sudosnab_delo@mail.ru",
  address: "656609, Алтайский край, г. Барнаул, р.п. Южный, ул. Зоотехническая, 24",
  city: "г. Барнаул",
  bank: "Банк ГПБ (АО), г. Москва",
  account: "40702810200000030619",
  corr: "30101810200000000823",
  bik: "044525823",
};

/** Requisites in the order a procurement form asks for them. Used by the page, the copy button and rekvizity.txt. */
export const REQUISITES: [string, string][] = [
  ["Полное наименование", COMPANY.full],
  ["Сокращённое наименование", COMPANY.operator],
  ["ИНН", COMPANY.inn],
  ["КПП", COMPANY.kpp],
  ["ОГРН", COMPANY.ogrn],
  ["Адрес", COMPANY.address],
  ["Телефон", COMPANY.phone],
  ["E-mail", COMPANY.email],
  ["Банк", COMPANY.bank],
  ["Расчётный счёт", COMPANY.account],
  ["Корреспондентский счёт", COMPANY.corr],
  ["БИК", COMPANY.bik],
];

// Owner file «СВИДЕТЕЛЬСТВО РКО 2026.pdf» (byte-identical copy in public/docs). Scope is quoted, never widened.
export const CERT = {
  no: "06552",
  kind: "Свидетельство о признании",
  issuer: "Российское Классификационное Общество",
  branch: "Западно-Сибирский филиал Российского Классификационного Общества",
  from: "20.07.2026",
  to: "20.07.2028",
  scope: [
    "разработка технической документации на изделия судового машиностроения;",
    "дефектация и капитальный ремонт судовых реверс-редукторов по согласованной с Российским Классификационным Обществом документации;",
    "изготовление и ремонт изделий судового машиностроения по согласованной с Российским Классификационным Обществом документации.",
  ],
  pdf: "docs/svidetelstvo-rko-06552.pdf",
  pdfKb: 273,
  img: { t: { src: "img/cert/rko-06552-600.webp", w: 600, h: 851 }, f: { src: "img/cert/rko-06552-1200.webp", w: 1200, h: 1701 } },
};

export const MANUAL = {
  href: "docs/rr300-rukovodstvo.pdf",
  title: "Реверс-редуктор РР-300. Руководство по эксплуатации РР-300.РЭ",
  pages: 24,
  mb: 3.6,
};

export const SETTINGS = {
  // Demo: rights to photos and scans are not confirmed, so search engines are kept out. INDEXABLE=1 on a real domain.
  indexable: import.meta.env.INDEXABLE === "1",
};

/** Site-root link (GitHub Pages base aware). */
export const root = (path = "") => import.meta.env.BASE_URL + path.replace(/^\//, "");
/** Link inside one design: /a/... or /b/... */
export const link = (v: V, path = "") => root(`${v}/${path.replace(/^\//, "")}`);
