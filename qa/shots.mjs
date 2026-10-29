// Real-browser screenshots of the production preview. Usage:
//   node qa/shots.mjs [widths=1440,390] [pages=key,...] [browser=chromium|webkit|firefox] [scheme=light|dark] [full=1]
// Output: qa/screenshots/<browser>-<scheme>/<v>-<page>-<width>.png
import { chromium, webkit, firefox } from "@playwright/test";
import { mkdirSync } from "node:fs";
const BASE = process.env.SHOT_URL || "http://localhost:4330/reverse-reduktor-v5-ab/";
export const PAGES = {
  home: "", products: "produkciya/", rr300: "produkciya/rr-300/", parts: "zapchasti/", nodes: "zapchasti/rr-300/",
  node: "zapchasti/rr-300/ris-05/", docs: "dokumentaciya/", tenders: "zakupki/", request: "zapros/", contacts: "kontakty/",
  services: "uslugi/", d3d6: "zapchasti/3d6/", privacy: "konfidencialnost/",
};
const [w = "1440,390", p = Object.keys(PAGES).join(","), br = "chromium", scheme = "light", full = "1"] = process.argv.slice(2);
const engine = { chromium, webkit, firefox }[br];
const browser = await engine.launch();
const dir = `qa/screenshots/${br}-${scheme}`; mkdirSync(dir, { recursive: true });
// The request page is filled by real clicks (node page, variant -010, positions 4 and 6; one line from the 3Д6 list).
async function fillRequest(ctx, v) {
  const p = await ctx.newPage();
  await p.goto(BASE + v + "/zapchasti/rr-300/ris-05/", { waitUntil: "networkidle" });
  await p.selectOption("[data-isp-select]", "-010");
  for (const pos of [4, 6]) await p.click(`#poz-${pos} [data-rfq-add]`);
  await p.goto(BASE + v + "/zapchasti/3d6/", { waitUntil: "networkidle" });
  await p.locator("tbody tr [data-rfq-add]").first().click();
  await p.close();
}
for (const width of w.split(",").map(Number)) {
  for (const v of ["a", "b"]) {
  // separate context per design: A and B share one origin, so they share the request list
  const ctx = await browser.newContext({ viewport: { width, height: width < 700 ? 844 : 900 }, colorScheme: scheme, deviceScaleFactor: 1 });
  if (p.includes("request")) await fillRequest(ctx, v);
  for (const key of p.split(",")) {
    const page = await ctx.newPage();
    await page.goto(BASE + v + "/" + PAGES[key], { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (ov > 0) console.log(`OVERFLOW ${v} ${key} ${width}: ${ov}px`);
    await page.screenshot({ path: `${dir}/${v}-${key}-${width}.png`, fullPage: full === "1" });
    await page.close();
  }
  await ctx.close();
  }
}
await browser.close();
console.log("done", dir);
