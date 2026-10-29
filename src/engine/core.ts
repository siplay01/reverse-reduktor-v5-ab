// Pure logic shared by both designs: designation search and the request list. No DOM here, so qa/unit.test.ts can run it.

const LAT: Record<string, string> = { A: "А", B: "В", C: "С", E: "Е", H: "Н", K: "К", M: "М", O: "О", P: "Р", T: "Т", X: "Х", Y: "У", D: "Д" };
/** Search key only (never shown): Latin look-alikes -> Cyrillic, one dash type, no spaces, upper case. */
export function key(s: string): string {
  return String(s || "").toUpperCase().replace(/Ё/g, "Е")
    .replace(/(^|[^A-ZА-Я])(SB|CB)/g, "$1СБ").replace(/(^|[^A-ZА-Я])(RR|PP)/g, "$1РР").replace(/3D/g, "3Д")
    .replace(/[A-Z]/g, (c) => LAT[c] ?? c)
    .replace(/[‐-―−_]/g, "-").replace(/\s+/g, "");
}
const bare = (s: string) => key(s).replace(/[-./]/g, "");
const words = (s: string) => s.toLowerCase().replace(/ё/g, "е").split(/\s+/).filter(Boolean);

/** 100 exact designation, 60 prefix, 40 substring, 20 every word found in name/designation, 0 no match. */
export function score(keys: string[], name: string, q: string): number {
  const bq = bare(q);
  if (!bq) return 1;
  let best = 0;
  for (const k of keys) {
    const b = bare(k);
    if (!b) continue;
    if (b === bq) return 100;
    if (bq.length >= 2 && b.startsWith(bq)) best = Math.max(best, 60);
    else if (bq.length >= 3 && b.includes(bq)) best = Math.max(best, 40);
  }
  if (best) return best;
  const n = name.toLowerCase().replace(/ё/g, "е");
  const ok = words(q).every((w) => n.includes(w) || (bare(w).length >= 2 && keys.some((k) => bare(k).includes(bare(w)))));
  return ok ? 20 : 0;
}

// ------------------------------------------------------------------ request list
/** One line of the request. `per` = quantity on one gearbox (from the specification), `q` = what the client asks for. */
export interface Item {
  k: string;      // stable key
  d: string;      // factory designation as printed
  n: string;      // name
  m: string;      // model, e.g. «РР-300»
  at: string;     // place in the catalog, e.g. «рис. 5, поз. 3»; "" if none
  isp: string;    // chosen factory variant (full designation) or ""
  per: number | null;
  q: number;
  href?: string;
}
export const MAXQ = 99999;
export const clampQ = (n: unknown) => Math.min(MAXQ, Math.max(1, Math.round(Number(n) || 1)));

/** Same designation in another variant or place is a separate line: the buyer must see what each line means. */
export const lineId = (it: Pick<Item, "k" | "isp" | "at">) => [it.k, it.isp, it.at].join("#");

export function addItem(list: Item[], it: Item): Item[] {
  const id = lineId(it);
  const x = list.find((i) => lineId(i) === id);
  if (x) return list.map((i) => (i === x ? { ...i, q: clampQ(i.q + it.q) } : i));
  return [...list, { ...it, q: clampQ(it.q) }];
}

export function sanitize(v: unknown): Item[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => x && typeof x.k === "string" && typeof x.d === "string").map((x) => ({
    k: x.k, d: x.d, n: String(x.n ?? ""), m: String(x.m ?? ""), at: String(x.at ?? ""), isp: String(x.isp ?? ""),
    per: typeof x.per === "number" ? x.per : null, q: clampQ(x.q), href: typeof x.href === "string" ? x.href : undefined,
  }));
}

export interface Contact { name?: string; org?: string; tel?: string; email?: string; note?: string }
export function requestText(list: Item[], f: Contact): string {
  const lines = ["Запрос коммерческого предложения", ""];
  list.forEach((x, i) => {
    lines.push(`${i + 1}. ${x.d}  ${x.n}`);
    const ctx = [x.m, x.at].filter(Boolean).join(", ");
    if (ctx) lines.push(`   Каталог: ${ctx}`);
    if (x.isp) lines.push(`   Исполнение: ${x.isp}`);
    if (x.per != null) lines.push(`   Количество на одно изделие по спецификации: ${x.per} шт.`);
    lines.push(`   Запрашиваемое количество: ${x.q} шт.`);
  });
  lines.push("");
  if (f.note) lines.push(`Комментарий: ${f.note}`, "");
  ([["Контактное лицо", f.name], ["Организация", f.org], ["Телефон", f.tel], ["E-mail", f.email]] as const)
    .forEach(([k, v]) => v && lines.push(`${k}: ${v}`));
  return lines.join("\n");
}

/** Mail clients and browsers cut long mailto: links; above this the page asks to copy or download instead. */
export const MAILTO_LIMIT = 4000;
export const mailtoHref = (to: string, list: Item[], text: string) =>
  `mailto:${to}?subject=${encodeURIComponent(`Запрос КП: ${list.length} поз.`)}&body=${encodeURIComponent(text)}`;
