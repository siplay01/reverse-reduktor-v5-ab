// A vs B review sheet: the same page in both designs side by side, colour and grayscale.
// Usage (preview running): node qa/compare.mjs  -> qa/screenshots/compare/<page>-<width>[-gray].png
import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync } from "node:fs";
const dir = "qa/screenshots/compare"; mkdirSync(dir, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1800, height: 1000 } });
for (const [key, w] of [["home", 1440], ["home", 390], ["node", 1440], ["node", 390], ["parts", 1440], ["parts", 390], ["tenders", 1440], ["tenders", 390], ["docs", 1440], ["request", 1440], ["request", 390], ["rr300", 1440]]) {
  const src = (v) => "data:image/png;base64," + readFileSync(`qa/screenshots/chromium-light/${v}-${key}-${w}.png`).toString("base64");
  for (const gray of [false, true]) {
    await p.setContent(`<body style="margin:0;background:#888;font:600 20px system-ui"><div style="display:flex;gap:24px;padding:16px;align-items:flex-start;${gray ? "filter:grayscale(1)" : ""}">
      ${["a", "b"].map((v) => `<figure style="margin:0;width:${w < 700 ? 420 : 860}px"><figcaption style="color:#fff;padding-bottom:8px">${v.toUpperCase()} · ${key} · ${w}px</figcaption><img style="width:100%;max-height:2400px;object-fit:cover;object-position:top" src="${src(v)}"></figure>`).join("")}</div></body>`);
    await p.waitForLoadState("load");
    await p.screenshot({ path: `${dir}/${key}-${w}${gray ? "-gray" : ""}.png`, fullPage: true });
  }
}
await b.close();
console.log("done", dir);
