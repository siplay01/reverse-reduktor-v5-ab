// Contact sheet of first screens: node qa/_sheet.mjs <out.png> <width> <file...>
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
const [out, w, ...files] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2400, height: 1000 } });
const cols = Number(process.env.COLS || (Number(w) < 700 ? 6 : 3));
await p.setContent(`<body style="margin:0;background:#777;font:600 22px system-ui;color:#fff"><div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:20px;padding:20px">${files.map((f) => `<figure style="margin:0"><figcaption style="padding-bottom:6px">${f.split("/").pop()}</figcaption><img style="width:100%;display:block" src="data:image/png;base64,${readFileSync(f).toString("base64")}"></figure>`).join("")}</div></body>`);
await p.screenshot({ path: out, fullPage: true }); await b.close();
