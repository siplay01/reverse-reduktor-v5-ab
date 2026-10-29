// End-to-end scenarios for both designs on the production preview. Every test runs for A and B.
import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const VS = ["a", "b"] as const;
const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1280) < 1180;
async function openMenuIfMobile(page: Page) {
  if (isMobile(page)) { await page.locator("[data-menu]").click(); await expect(page.locator("#nav")).toBeVisible(); }
}

test("demo chooser links to both designs", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator("h1")).toContainText("V5");
  for (const v of VS) await expect(page.locator(`a[href$="/${v}/"]`).first()).toBeVisible();
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("node table shows every variant column and the parts list is complete", async ({ page }) => {
    for (const v of VS) {
      await page.goto(`./${v}/zapchasti/rr-300/ris-05/`);
      await expect(page.locator("thead [data-vc]")).toHaveCount(10);
      await expect(page.locator("thead [data-vc]").nth(9)).toBeVisible();
      await expect(page.locator("thead .sel")).toBeHidden();
      await page.goto(`./${v}/zapchasti/`);
      expect(await page.locator("[data-finder] tbody tr").count()).toBe(314);
    }
  });
});

test("B home: live results under the search field, add without leaving the page", async ({ page }) => {
  await page.goto("./b/");
  await page.fill("#b-q", "525-16-110");
  const first = page.locator("[data-live-list] li").first();
  await expect(first.locator(".sku")).toHaveText("525-16-110");
  await expect(page.locator("[data-live-count]")).toContainText("Найдено");
  await first.locator("[data-rfq-add]").click();
  await expect(page.locator("[data-rfq-panel-list] li").first()).toContainText("525-16-110");
  await page.fill("#b-q", "нет-такой-детали-zzz");
  await expect(page.locator("[data-live-count]")).toContainText("ничего не найдено");
  await expect(page.locator("[data-live-list]")).toBeHidden();
});

test("404 page", async ({ page }) => {
  const r = await page.goto("./a/net-takoy-stranicy/");
  expect(r?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Страница не найдена");
});

for (const v of VS) {
  test.describe(`design ${v.toUpperCase()}`, () => {
    test("home: brand, operator, РКО near first screen, real PDF", async ({ page, request }) => {
      await page.goto(`./${v}/`);
      await expect(page.locator(".a-word, .b-brand").first()).toContainText("Реверс-редуктор");
      await expect(page.locator("body")).toContainText("ООО «Дело»");
      const pdf = page.locator('a[href$="svidetelstvo-rko-06552.pdf"]').first();
      await expect(pdf).toBeVisible();
      const r = await request.get(await pdf.getAttribute("href") as string);
      expect(r.status()).toBe(200);
      expect(r.headers()["content-type"]).toContain("pdf");
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      await expect(page.locator("body")).not.toContainText(/СибФлот/i);
    });

    test("navigation: every main section opens (mobile: through the menu)", async ({ page }) => {
      for (const [path, h1] of [["produkciya/", "Наша продукция"], ["zapchasti/", "Запасные части"], ["uslugi/", "Услуги"], ["dokumentaciya/", "Техническая документация"], ["zakupki/", "Закупки и тендеры"], ["kontakty/", "Контакты и реквизиты"]]) {
        await page.goto(`./${v}/`);
        await openMenuIfMobile(page);
        await page.locator(`#nav a[href$="/${v}/${path}"]`).first().click();
        await expect(page.locator("h1")).toHaveText(h1);
        await expect(page.locator(`#nav a[aria-current="page"]`).first()).toHaveAttribute("href", new RegExp(`/${v}/${path}$`));
      }
    });

    test("mobile menu opens and closes with Escape", async ({ page }) => {
      test.skip(!isMobile(page), "desktop layout has no menu button");
      await page.goto(`./${v}/`);
      const btn = page.locator("[data-menu]");
      await btn.click();
      await expect(btn).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape");
      await expect(btn).toHaveAttribute("aria-expanded", "false");
      await expect(page.locator("#nav")).toBeHidden();
    });

    test("search from the home page finds the exact designation", async ({ page }) => {
      await page.goto(`./${v}/`);
      const form = page.locator(v === "a" ? ".a-search" : ".b-search");
      await form.locator("input").fill("СБ 525 12 104");
      await form.locator("button").click();
      await expect(page).toHaveURL(/zapchasti\/\?q=/);
      const first = page.locator("[data-finder] tbody tr:not([hidden])").first();
      await expect(first.locator(".des .sku")).toHaveText("СБ525-12-104");
    });

    test("finder: model and node filters, empty state, reset, URL state", async ({ page }) => {
      await page.goto(`./${v}/zapchasti/`);
      const all = await page.locator("[data-finder] tbody tr").count();
      await page.selectOption('[data-finder] select[name="m"]', "3d6");
      await expect(page.locator('[data-finder] select[name="uzel"]')).toBeDisabled();
      const shown = page.locator("[data-finder] tbody tr:not([hidden])");
      expect(await shown.count()).toBeGreaterThan(10);
      expect(await shown.evaluateAll((rows) => rows.every((r) => (r as HTMLElement).dataset.m === "3d6"))).toBe(true);
      await expect(page).toHaveURL(/m=3d6/);
      await page.selectOption('[data-finder] select[name="m"]', "rr300");
      await page.selectOption('[data-finder] select[name="uzel"]', "5");
      expect(await shown.count()).toBeGreaterThan(5);
      await expect(page.locator('[data-finder] a[href*="ris-05/#poz-4"]').first()).toBeVisible();
      await page.fill('[data-finder] input[name="q"]', "zzzz-нет-такой");
      await expect(page.locator("[data-empty]")).toBeVisible();
      await page.locator("[data-empty] [data-reset]").click();
      await expect(page.locator("[data-finder] tbody tr:not([hidden])")).toHaveCount(all);
    });

    test("deep links: ?q, ?isp and #poz", async ({ page }) => {
      await page.goto(`./${v}/zapchasti/?q=525-16-110`);
      await expect(page.locator("[data-finder] tbody tr:not([hidden])").first().locator(".sku").first()).toHaveText("525-16-110");
      await page.goto(`./${v}/zapchasti/rr-300/ris-05/?isp=-004#poz-18`);
      await expect(page.locator("[data-isp-select]")).toHaveValue("-004");
      await expect(page.locator("#poz-18 [data-sel]")).toHaveText("1");
      expect(await page.evaluate(() => location.hash)).toBe("#poz-18");
    });

    test("variant selector: one quantity per variant, comparison on request", async ({ page }) => {
      await page.goto(`./${v}/zapchasti/rr-300/ris-05/`);
      const sel = page.locator("[data-isp-select]");
      await sel.selectOption("-");
      // 525-16-400 is not in the base variant (catalog fig. 5, footnote 2), 525-16-110 is
      await expect(page.locator("#poz-18 [data-sel]")).toHaveText("–");
      await expect(page.locator("#poz-4 [data-sel]")).toHaveText("1");
      await sel.selectOption("-014");
      await expect(page.locator("#poz-18 [data-sel]")).toHaveText("1");
      await expect(page.locator("#poz-4 [data-sel]")).toHaveText("–");
      await expect(page.locator("[data-sel-head]")).toHaveText("СБ525-01-13-014");
      await expect(page.locator("thead [data-vc]").first()).toBeHidden();
      await page.locator("[data-compare]").click();
      await expect(page.locator("thead [data-vc]")).toHaveCount(10);
      await expect(page.locator("thead [data-vc]").nth(9)).toBeVisible();
      // the variant is remembered on the next node
      await page.goto(`./${v}/zapchasti/rr-300/ris-07/`);
      await expect(page.locator("[data-isp-select]")).toHaveValue("-014");
    });

    test("drawing viewer opens only on the explicit zoom action", async ({ page }) => {
      await page.goto(`./${v}/zapchasti/rr-300/ris-05/`);
      await page.locator(".node-drawing .fig-img img").click();
      await expect(page.locator("[data-viewer]")).not.toHaveAttribute("open", "");
      await page.locator(".node-drawing .fig-zoom").first().click();
      const dlg = page.locator("[data-viewer]");
      await expect(dlg).toHaveAttribute("open", "");
      await expect(dlg.locator("img")).toHaveAttribute("src", /2000\.webp$/);
      await dlg.locator('[data-zoom-set="1"]').click();
      await expect(dlg).toHaveAttribute("data-zoom", "1");
      await page.keyboard.press("Escape");
      await expect(dlg).not.toHaveAttribute("open", "");
    });

    test("request list: per-unit vs requested quantity, copy/txt/mailto only on explicit action", async ({ page, context, browserName }) => {
      if (browserName === "chromium") await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      await page.goto(`./${v}/zapchasti/rr-300/ris-05/`);
      await page.selectOption("[data-isp-select]", "-010");
      const url = page.url();
      await page.locator("#poz-6 [data-rfq-add]").click();
      await expect(page.locator("[data-toast]")).toContainText("556-07");
      await expect(page.locator("#poz-6 [data-rfq-add]")).toHaveAttribute("aria-pressed", "true");
      expect(page.url()).toBe(url); // adding never navigates or opens mail
      await expect(page.locator("[data-rfq-count]").first()).toHaveText("1");

      await page.goto(`./${v}/zapros/`);
      const row = page.locator("[data-rows] tr").first();
      await expect(row.locator("[data-d]")).toHaveText("556-07");
      await expect(row.locator("[data-isp]")).toHaveText("СБ525-01-13-010");
      await expect(row.locator("[data-per]")).toHaveText("6");
      await row.locator("input").fill("24");
      await row.locator("input").dispatchEvent("change");
      await expect(page.locator("[data-preview]")).toContainText("Количество на одно изделие по спецификации: 6 шт.");
      await expect(page.locator("[data-preview]")).toContainText("Запрашиваемое количество: 24 шт.");

      // manual line
      await page.locator(".manual summary").click();
      await page.fill("#m-d", "СБ525-01-14");
      await page.fill("#m-n", "Муфта сцепления");
      await page.locator(".manual-form button").click();
      await expect(page.locator("[data-rows] tr")).toHaveCount(2);

      // mailto needs a contact; never claims «sent»
      const mail = page.locator("[data-mail]");
      await page.evaluate(() => document.querySelector("[data-mail]")!.addEventListener("click", (e) => e.preventDefault()));
      await mail.click();
      await expect(page.locator("[data-err]")).toBeVisible();
      await page.fill("#r-email", "buyer@example.ru");
      await mail.click();
      await expect(page.locator("[data-err]")).toBeHidden();
      expect(decodeURIComponent((await mail.getAttribute("href"))!)).toContain("556-07");
      await expect(page.locator("[data-status]")).toContainText("Сайт ничего не отправляет сам");
      await expect(page.locator("body")).not.toContainText(/отправлено|успешно/i);

      const dl = page.waitForEvent("download");
      await page.locator("[data-download]").click();
      const file = await dl;
      expect(file.suggestedFilename()).toBe("zapros-kp.txt");
      await page.locator("[data-copy]").click();
      await expect(page.locator("[data-status]")).toContainText(/скопирован|выделен/);

      // the list survives a reload; clear needs two clicks
      await page.reload();
      await expect(page.locator("[data-rows] tr")).toHaveCount(2);
      await page.locator("[data-clear]").click();
      await expect(page.locator("[data-rows] tr")).toHaveCount(2);
      await page.locator("[data-clear]").click();
      await expect(page.locator("[data-empty-list]")).toBeVisible();
    });

    test("privacy: stored data can be deleted", async ({ page }) => {
      await page.goto(`./${v}/zapchasti/3d6/`);
      await page.locator("[data-finder] [data-rfq-add]").first().click();
      await page.goto(`./${v}/konfidencialnost/`);
      await expect(page.locator(".policy")).toContainText("ООО «Дело»");
      await page.locator("[data-clear-storage]").click();
      await expect(page.locator("[data-storage-status]")).toContainText("удалены");
      expect(await page.evaluate(() => localStorage.getItem("rr5-request"))).toBeNull();
    });

    test("requisites and tenders: full requisites, txt card, РКО document", async ({ page, request }) => {
      await page.goto(`./${v}/kontakty/`);
      for (const s of ["2225060059", "222501001", "1032202271309", "40702810200000030619", "044525823"]) await expect(page.locator("#rekvizity")).toContainText(s);
      const txt = await request.get("rekvizity.txt");
      expect(await txt.text()).toContain("ИНН: 2225060059");
      await page.goto(`./${v}/zakupki/`);
      await expect(page.locator("#docs + .tbl-wrap")).toContainText("06552");
    });

    test("cross-section legend marks callouts on the drawing", async ({ page }) => {
      await page.goto(`./${v}/produkciya/rr-300/`);
      const cut = page.locator("[data-cutaway]");
      test.skip(v === "b", "B shows the front view instead of the section on this page");
      await cut.locator('button[data-cut="22"]').click();
      await expect(cut.locator('button[data-cut="22"]')).toHaveAttribute("aria-pressed", "true");
      await expect(cut.locator('.cut-pt.on')).toHaveCount(1);
      await expect(cut.locator('.cut-pt[data-n="22"]')).toHaveClass(/on/);
      await cut.locator('button[data-cut="2 11 24 39 42"]').click();
      await expect(cut.locator('.cut-pt.on')).toHaveCount(5);
    });

    test("no console errors, CSP violations or failed requests", async ({ page }) => {
      const errs: string[] = [];
      page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
      page.on("pageerror", (e) => errs.push(e.message));
      page.on("requestfailed", (r) => errs.push(`failed ${r.url()}`));
      page.on("response", (r) => r.status() >= 400 && errs.push(`${r.status()} ${r.url()}`));
      for (const p of ["", "produkciya/", "produkciya/rr-300/", "zapchasti/", "zapchasti/rr-238/", "zapchasti/rr-300/", "zapchasti/rr-300/ris-20/", "uslugi/", "dokumentaciya/", "dokumentaciya/katalog-rr-300/", "zakupki/", "kontakty/", "zapros/", "konfidencialnost/"]) {
        await page.goto(`./${v}/${p}`, { waitUntil: "networkidle" });
      }
      expect(errs).toEqual([]);
    });

    test("no horizontal page scroll on key pages", async ({ page }) => {
      for (const p of ["", "zapchasti/", "zapchasti/rr-300/ris-05/", "produkciya/rr-300/", "zapros/", "zakupki/", "kontakty/"]) {
        await page.goto(`./${v}/${p}`);
        const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        expect(over, `${v}/${p}`).toBeLessThanOrEqual(0);
      }
    });

    test("keyboard: skip link first, visible focus", async ({ page, browserName }) => {
      test.skip(browserName === "webkit", "WebKit does not Tab to links by default");
      await page.goto(`./${v}/`);
      await page.keyboard.press("Tab");
      await expect(page.locator(".skip")).toBeFocused();
      await page.keyboard.press("Tab");
      const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
      expect(outline).not.toBe("none");
    });

    for (const scheme of ["light", "dark"] as const) {
      test(`axe WCAG 2.2 AA, ${scheme}`, async ({ page, browserName }) => {
        test.skip(browserName !== "chromium", "axe runs once per design and scheme");
        await page.emulateMedia({ colorScheme: scheme });
        const found: string[] = [];
        for (const p of ["", "produkciya/", "produkciya/rr-300/", "produkciya/3d6/", "zapchasti/", "zapchasti/3d12/", "zapchasti/rr-300/", "zapchasti/rr-300/ris-05/", "uslugi/", "dokumentaciya/", "dokumentaciya/katalog-rr-300/", "zakupki/", "kontakty/", "zapros/", "konfidencialnost/"]) {
          await page.goto(`./${v}/${p}`);
          if (p === "zapchasti/rr-300/ris-05/") await page.locator("[data-compare]").click();
          const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
          for (const x of r.violations) found.push(`${v}/${p} ${x.id}: ${x.nodes.slice(0, 4).map((n) => n.target.join(" ")).join(" | ")}`);
        }
        expect(found.join("\n")).toBe("");
      });
    }
  });
}
