// Typed domain shared by designs A and B. Raw JSON comes from V4 (src/data, exported by v4/scripts/prepare.py);
// this file decides what the client sees. Every exclusion is listed in ../CONTENT_DECISIONS.md.
import partsJson from "../data/parts.json";
import modelsJson from "../data/models.json";
import asmJson from "../data/assemblies.json";
import scansJson from "../data/scans.json";
import sitePhotosJson from "../data/site-photos.json";

export interface Img { src: string; w: number; h: number }
export interface Pic { t: Img; f: Img }
interface RawPart {
  id: string; designation: string; name: string; spellings: string[]; models: string[]; type: string;
  assemblies: { figure: number; pos: number | null }[]; confidence: string;
}
interface RawVariant { code: string; rot: string; hp: number; fwd: string; rev: string; fingers: number; full: string }
interface RawModel {
  id: string; slug: string; name: string; designation: string; kind: string; variants: RawVariant[];
  specsClient: { label: string; value: string }[];
}
export interface Row {
  pos: number | null; designation: string; name: string; qty: (number | null)[] | null;
  mass: string | null; material: string | null; note: string | null; part: string | null;
}
interface RawAsm {
  figure: number; slug: string; title: string; designation: string; variants: string[];
  footnotes: Record<string, string>; drawing: Pic; spec: Pic; rows: Row[];
}

// ------------------------------------------------------------------ models
export type ModelId = "rr300" | "rr238" | "3d6" | "3d12";
export interface Variant extends RawVariant { label: string }
export interface Drawing extends Pic { title: string }
export interface Model {
  id: ModelId; slug: string; name: string; designation: string; kind: string;
  photo: (Pic & { alt: string; caption: string }) | null;
  drawings: Drawing[];
  text: string[];
  specs: { label: string; value: string }[];
  key: { label: string; value: string }[];
  variants: Variant[];
  hasNodeCatalog: boolean;
}

const pic = (s: string, w: number, h: number, fs: string, fw: number, fh: number): Pic =>
  ({ t: { src: s, w, h }, f: { src: fs, w: fw, h: fh } });
const sp = (k: keyof typeof sitePhotosJson) => sitePhotosJson[k] as Pic;
const DRAW: Record<string, Drawing> = {
  fig1: { ...pic("img/draw/man-fig1-700.webp", 700, 619, "img/draw/man-fig1-1400.webp", 1400, 1238), title: "Продольный разрез. Руководство по эксплуатации, рисунок 1" },
  fig2: { ...pic("img/draw/man-fig2-700.webp", 700, 732, "img/draw/man-fig2-1400.webp", 1400, 1463), title: "Общий вид. Руководство по эксплуатации, рисунок 2" },
  fig3: { ...pic("img/draw/man-fig3-700.webp", 700, 597, "img/draw/man-fig3-1400.webp", 1400, 1193), title: "Исполнение РР-300-238 с двигателем ЯМЗ-238. Руководство, рисунок 3" },
  fig4: { ...pic("img/draw/man-fig4-700.webp", 700, 552, "img/draw/man-fig4-1400.webp", 1400, 1103), title: "Исполнение РР-300-7514 с двигателем ЯМЗ-7514. Руководство, рисунок 4" },
};

// The «Производитель: Барнаултрансмаш» line of the old store contradicts the owner (ООО «Дело» is the manufacturer): hidden.
const HIDDEN = new Set(["Производитель"]);
const TEXT: Record<ModelId, string[]> = {
  rr300: [
    "Гидравлический реверс-редуктор для дизелей 3Д6, 3Д12, ЯМЗ и их модификаций. Гидравлическое управление муфтами переднего и заднего хода.",
    "Применяется на катерах, малых буксирах, разъездных и патрульных судах, вспомогательных плавсредствах.",
  ],
  rr238: [
    "Гидравлический реверс-редуктор для силовых установок с дизелями ЯМЗ-238 и их модификациями.",
    "Применяется на судах различного назначения: от малых рабочих катеров до средних буксиров и рыболовецких судов.",
  ],
  "3d6": [
    "Механический реверс-редуктор в составе дизель-редукторных агрегатов с двигателями 3Д6.",
    "Устанавливается на буксирах, малых грузовых судах, рыболовецких катерах и пассажирских теплоходах местного сообщения.",
  ],
  "3d12": [
    "Механический реверс-редуктор для работы с двигателями 3Д12.",
    "Применяется на буксирах, вспомогательных судах портового флота, рыбопромысловых судах, пассажирских и грузопассажирских судах.",
  ],
};
// Only РР-300 has a photo whose model is confirmed (owner photo hero-rr300-pair). Other photos are not shown under a model name.
const PHOTO: Partial<Record<ModelId, Model["photo"]>> = {
  rr300: { ...sp("hero-rr300-pair"), alt: "Два гидравлических реверс-редуктора РР-300 на поддонах в цехе", caption: "Реверс-редукторы РР-300" },
};
const KEY: Record<ModelId, string[]> = {
  rr300: ["Полная мощность", "Передаточное отношение, передний ход", "Масса"],
  rr238: ["Полная мощность", "Передаточное отношение, передний ход", "Масса"],
  "3d6": ["Полная мощность", "Передаточное отношение, передний ход", "Масса"],
  "3d12": ["Полная мощность", "Передаточное отношение, передний ход", "Масса"],
};
const SHORT: Record<string, string> = { "Полная мощность": "Мощность", "Передаточное отношение, передний ход": "Передний ход", "Масса": "Масса" };
// Short key values; the full wording stays in the spec table.
const KEYVAL: Partial<Record<ModelId, Record<string, string>>> = {
  rr300: { "Полная мощность": "150–300 л.с.", "Передаточное отношение, передний ход": "1:2,04 / 1:2,95", "Масса": "430–460 кг" },
};

const ORDER: ModelId[] = ["rr300", "rr238", "3d6", "3d12"];
const rawModels = modelsJson as RawModel[];
export const variantLabel = (v: RawVariant) =>
  `${v.full}: ${v.rot} вращение, ${v.hp} л.с., передний ход ${v.fwd}, задний ${v.rev}, муфта ${v.fingers} пальцев`;

export const models: Model[] = ORDER.map((id) => {
  const m = rawModels.find((x) => x.id === id)!;
  const specs = m.specsClient.filter((s) => !HIDDEN.has(s.label));
  return {
    id, slug: m.slug, name: m.name, designation: m.designation, kind: m.kind,
    photo: PHOTO[id] ?? null,
    // Manual drawings belong to РР-300 only (the manual is «Реверс-редуктор РР-300. РЭ»); V4 also showed them on РР-238.
    drawings: id === "rr300" ? [DRAW.fig1, DRAW.fig2, DRAW.fig3, DRAW.fig4] : [],
    text: TEXT[id],
    specs,
    key: KEY[id].map((l) => ({ label: SHORT[l], value: KEYVAL[id]?.[l] ?? specs.find((s) => s.label === l)?.value ?? "" })).filter((k) => k.value),
    variants: m.variants.map((v) => ({ ...v, label: variantLabel(v) })),
    hasNodeCatalog: id === "rr300",
  };
});
export const modelById = new Map(models.map((m) => [m.id, m]));
export const rr300 = modelById.get("rr300")!;
export const FACTORY_VARIANTS = rr300.variants;

// ------------------------------------------------------------------ РР-300 nodes (26 figures of the factory catalog)
export interface Node extends RawAsm {
  /** true when the node's quantity columns are the 10 factory variants of the whole gearbox */
  byFactoryVariant: boolean;
}
const factoryCodes = FACTORY_VARIANTS.map((v) => v.code).join("|");
export const nodes: Node[] = (asmJson as RawAsm[]).map((a) => ({ ...a, byFactoryVariant: a.variants.join("|") === factoryCodes }));
export const nodeByFigure = new Map(nodes.map((n) => [n.figure, n]));

// ------------------------------------------------------------------ parts index (search across everything)
export interface Use { figure: number; pos: number | null; slug: string }
export interface Entry {
  key: string;              // stable id for the request list
  designation: string;      // factory designation exactly as printed ("БЧ" = standard part without drawing)
  name: string;
  model: ModelId;
  uses: Use[];              // positions on РР-300 drawings
  spellings: string[];      // extra search keys
}
const rawParts = partsJson as RawPart[];
const byPartId = new Map(rawParts.map((p) => [p.id, p]));

// РР-300: built from the 26 specification tables (typed by eye from the scans), one entry per designation.
// Standard parts marked «БЧ» are one entry per name. Designations are never rewritten.
const rrMap = new Map<string, Entry>();
for (const n of nodes) for (const r of n.rows) {
  if (r.designation === "СБ525-01-13") continue; // the gearbox itself (fig. 1-2, pos. 1) is a product, not a spare part
  const k = r.designation === "БЧ" ? `БЧ|${r.name}` : r.designation;
  const e = rrMap.get(k) ?? { key: `rr300:${k}`, designation: r.designation, name: r.name, model: "rr300" as ModelId, uses: [], spellings: [] };
  e.uses.push({ figure: n.figure, pos: r.pos, slug: n.slug });
  const p = r.part ? byPartId.get(r.part) : undefined;
  if (p) e.spellings.push(...p.spellings);
  rrMap.set(k, e);
}
// Old-store lists for РР-238, 3Д6, 3Д12 (no factory drawings in the sources). OCR-only records are left out:
// an unchecked OCR reading is not published as a designation.
const storeEntries: Entry[] = [];
for (const p of rawParts) {
  if (p.confidence.startsWith("OCR")) continue;
  for (const m of p.models as ModelId[]) {
    if (m === "rr300") continue;
    storeEntries.push({ key: `${m}:${p.designation}`, designation: p.designation, name: p.name, model: m, uses: [], spellings: p.spellings });
  }
}
const cmp = (a: Entry, b: Entry) => a.designation.localeCompare(b.designation, "ru", { numeric: true });
export const entries: Entry[] = [
  ...[...rrMap.values()].sort((a, b) => (a.uses[0].figure - b.uses[0].figure) || ((a.uses[0].pos ?? 0) - (b.uses[0].pos ?? 0))),
  ...ORDER.slice(1).flatMap((m) => storeEntries.filter((e) => e.model === m).sort(cmp)),
];
export const entriesOf = (m: ModelId) => entries.filter((e) => e.model === m);

// ------------------------------------------------------------------ documents and media
export interface Scan extends Pic { n: number; title: string }
export const scans = scansJson as Scan[];
export const workshopPhoto = { ...sp("rr300-flange"), alt: "Реверс-редуктор на поддоне в цехе, вид со стороны соединительного фланца" };

// ------------------------------------------------------------------ services (owner's site scheme + РКО scope)
export interface Service { id: string; title: string; text: string[]; rko: boolean }
export const services: Service[] = [
  { id: "remont", title: "Ремонт судовых реверс-редукторов", rko: true, text: [
    "Дефектация и капитальный ремонт реверс-редукторов РР-300, РР-238, 3Д6, 3Д12 и муфт сцепления.",
    "Порядок работ: диагностика, разборка и дефектовка с составлением дефектной ведомости, замена и восстановление деталей, сборка и испытания.",
  ] },
  { id: "izgotovlenie", title: "Изготовление деталей судового машиностроения", rko: true, text: [
    "Изготовление деталей и сборочных единиц по заводским обозначениям и согласованной документации.",
  ] },
  { id: "dokumentaciya", title: "Разработка технической документации", rko: true, text: [
    "Разработка технической документации на изделия судового машиностроения.",
  ] },
  { id: "rulevye-mashiny", title: "Ремонт рулевых машин РГ-0,25", rko: false, text: [
    "Ремонт рулевых гидравлических машин РГ-0,25.",
  ] },
  { id: "podderzhka", title: "Техническая поддержка", rko: false, text: [
    "Подбор запасных частей по заводским обозначениям и исполнению реверс-редуктора.",
  ] },
];

// ------------------------------------------------------------------ V5 rethink media: vector drawings of the manual, rendered at 400 dpi
import cutawayJson from "../data/cutaway.json";
export interface Callout { n: number; x: number; y: number }
const onDrawing = new Set((cutawayJson.callouts as Callout[]).map((c) => c.n));
export const cutaway = {
  src: { t: { src: "img/v5/rr300-section-1200.webp", w: 1200, h: 1120 }, f: { src: "img/v5/rr300-section-2400.webp", w: 2400, h: 2239 } } as Pic,
  callouts: cutawayJson.callouts as Callout[],
  // only legend entries whose numbers appear on fig. 1 (48-58 are on the manual's sectional details)
  legend: (cutawayJson.legend as { nums: number[]; name: string }[])
    .map((l) => ({ nums: l.nums.filter((n) => onDrawing.has(n)), name: l.name }))
    .filter((l) => l.nums.length),
};
export const frontView: Pic = { t: { src: "img/v5/rr300-front-1200.webp", w: 1200, h: 1328 }, f: { src: "img/v5/rr300-front-2400.webp", w: 2400, h: 2656 } };
export const sideView: Pic = { t: { src: "img/v5/rr300-side-1200.webp", w: 1200, h: 715 }, f: { src: "img/v5/rr300-side-2400.webp", w: 2400, h: 1429 } };
export const unitPhoto = { t: { src: "img/v5/rr300-unit-480.webp", w: 480, h: 382 }, f: { src: "img/v5/rr300-unit-780.webp", w: 780, h: 620 }, alt: "Гидравлический реверс-редуктор РР-300 на поддоне в цехе, вид со стороны соединительной муфты" };
export const flangePhoto = { t: { src: "img/v5/flange-detail-600.webp", w: 600, h: 556 }, f: { src: "img/v5/flange-detail-1080.webp", w: 1080, h: 1000 }, alt: "Реверс-редуктор на участке предприятия, соединительный фланец крупным планом" };
