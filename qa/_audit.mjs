import { chromium } from "@playwright/test";
const V = { v1: "https://siplay01.github.io/reverse-reduktor-demo/", v1b: "https://siplay01.github.io/reverse-reduktor-demo/?v=b", v3: "https://siplay01.github.io/reverse-reduktor-v3/", v4: "https://siplay01.github.io/reverse-reduktor-v4/", replica: "https://siplay01.github.io/revers-remont-replica/", v5a: "https://siplay01.github.io/reverse-reduktor-v5-ab/a/", v5b: "https://siplay01.github.io/reverse-reduktor-v5-ab/b/" };
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  for (const [k, u] of Object.entries(V)) {
    const p = await ctx.newPage();
    try { await p.goto(u, { waitUntil: "networkidle", timeout: 45000 }); } catch (e) { console.log(k, e.message.slice(0, 80)); }
    await p.waitForTimeout(800);
    await p.screenshot({ path: `review/audit/${k}-${w}-fold.png` });
    await p.screenshot({ path: `review/audit/${k}-${w}-full.png`, fullPage: true });
    await p.close();
  }
  await ctx.close();
}
await b.close();
