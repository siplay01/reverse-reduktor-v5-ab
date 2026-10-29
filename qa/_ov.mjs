import { chromium } from "@playwright/test";
const b = await chromium.launch();
for (const [w, u] of [[320, "a/"], [360, "a/"]]) {
  const p = await b.newPage({ viewport: { width: w, height: 844 } });
  await p.goto("http://localhost:4330/reverse-reduktor-v5-ab/" + u, { waitUntil: "networkidle" });
  const r = await p.evaluate(() => [...document.querySelectorAll("body *")].filter((e) => e.getBoundingClientRect().right > innerWidth + 0.5).map((e) => `${e.tagName}.${e.className} ${Math.round(e.getBoundingClientRect().right)}`).slice(0, 8));
  console.log(w, u, r); await p.close();
}
await b.close();
