// Static checks of the production build (run after `npm run build`):
// internal links/assets resolve; one h1, unique title and description per page; noindex; no em dash in copy;
// client rules: no former brand, no part photos, no third-party scripts, every <img> has alt and size;
// the РКО PDF is the owner's file byte for byte.
import { readFileSync, existsSync, statSync, globSync } from "node:fs";
import { createHash } from "node:crypto";
const BASE = process.env.BASE_PATH ?? "/reverse-reduktor-v5-ab/";
const RKO_SHA256 = "c1626dbe71c6480bfbfa25e74326bb723d715aa62f3bdaa362e227f0f8461c77";
const pages = globSync("dist/**/*.html");
const bad = [], titles = new Map(), descs = new Map();
let links = 0, imgs = 0;
const resolve = (u) => {
  const path = decodeURIComponent(u.split(/[?#]/)[0]);
  if (!path.startsWith(BASE)) return `outside base: ${u}`;
  let f = "dist/" + path.slice(BASE.length);
  if (f.endsWith("/")) f += "index.html";
  return existsSync(f) && statSync(f).isFile() ? null : `missing: ${u}`;
};
for (const p of pages) {
  const html = readFileSync(p, "utf8");
  const text = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const u = m[1].replace(/&amp;/g, "&");
    if (/^(mailto:|tel:|data:|#)/.test(u)) continue;
    if (/^https?:/.test(u)) { if (/<script[^>]+src="https?:/.test(m[0])) bad.push(`${p}: external script ${u}`); continue; }
    links++;
    const err = resolve(u);
    if (err) bad.push(`${p}: ${err}`);
  }
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) for (const part of m[1].split(",")) { links++; const err = resolve(part.trim().split(" ")[0]); if (err) bad.push(`${p}: ${err}`); }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    imgs++;
    const t = m[0];
    if (!/\salt="/.test(t)) bad.push(`${p}: img without alt ${t.slice(0, 80)}`);
    if (!/\swidth="\d+"/.test(t) || !/\sheight="\d+"/.test(t)) { if (!/data-viewer-img/.test(t)) bad.push(`${p}: img without size ${t.slice(0, 80)}`); }
    if (/src="[^"]*\/img\/(p|m)\//.test(t)) bad.push(`${p}: part/store photo ${t.slice(0, 80)}`);
  }
  if (/сибфлот|sibflot|revers-remont\.ru|барнаултрансмаш/i.test(text)) bad.push(`${p}: former brand or manufacturer name in copy`);
  if (/—/.test(text)) bad.push(`${p}: em dash in copy`);
  if (/отправлено|успешно отправ/i.test(text)) bad.push(`${p}: «sent» wording`);
  if (!/<meta name="robots" content="noindex/.test(html)) bad.push(`${p}: no noindex`);
  if (p.endsWith("404.html")) continue;
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) bad.push(`${p}: ${h1} h1`);
  const t = html.match(/<title>([^<]*)<\/title>/)?.[1], d = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!t || !d) bad.push(`${p}: no title/description`);
  // titles repeat across the two designs on purpose; they must be unique within one design
  const scope = p.split('/')[1].length === 1 ? p.split('/')[1] : 'root';
  titles.set(scope + t, [...(titles.get(scope + t) || []), p]); descs.set(scope + d, [...(descs.get(scope + d) || []), p]);
}
for (const [t, ps] of titles) if (ps.length > 1) bad.push(`duplicate title "${t}": ${ps.join(", ")}`);
for (const [, ps] of descs) if (ps.length > 1) bad.push(`duplicate description: ${ps.join(", ")}`);
if (!/Disallow: \//.test(readFileSync("dist/robots.txt", "utf8"))) bad.push("robots.txt does not disallow the demo");
const sha = createHash("sha256").update(readFileSync("dist/docs/svidetelstvo-rko-06552.pdf")).digest("hex");
if (sha !== RKO_SHA256) bad.push(`РКО PDF differs from the owner's file: ${sha}`);
console.log(`pages ${pages.length}, internal links/assets ${links}, images ${imgs}, problems ${bad.length}`);
bad.slice(0, 50).forEach((b) => console.log("  " + b));
process.exit(bad.length ? 1 : 0);
