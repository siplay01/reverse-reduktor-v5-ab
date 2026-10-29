# QA report (2026-10-29, local, macOS, Node 26.8, Playwright 1.64.1)

States reached: code written, production build passed, scenarios verified in real browsers locally and in CI, **published** 2026-10-29 at https://siplay01.github.io/reverse-reduktor-v5-ab/ (A: `/a/`, B: `/b/`), live suite passed.

## Commands and results

| Check | Command | Result |
| --- | --- | --- |
| Install | `rm -rf node_modules && npm ci` | ok (npm notes that the esbuild postinstall script was not approved; build and tests run without it) |
| Typecheck | `npx astro check` | 0 errors, 0 warnings, 0 hints (40 files) |
| Lint | none configured | not run |
| Build | `npm run build` | 90 HTML pages: 44 per design + chooser + 404; `rekvizity.txt`, `robots.txt` |
| Unit | `node --experimental-strip-types qa/unit.test.ts` | all assertions pass (search scoring, line identity, quantity clamps, sanitising stored data, letter text) |
| Static | `node qa/links.mjs` | 90 pages, 3831 internal links/assets, 369 images, **0 problems**. Also checks: one h1, unique title/description per design, `noindex` on every page, `robots.txt Disallow`, no em dash, no СибФлотСервис / revers-remont.ru / Барнаултрансмаш, no part or store photos, alt + size on every image, no «отправлено», РКО PDF SHA-256 equals the owner's file |
| Browser tests | `npx playwright test --project=chromium --project=webkit --project=iphone-webkit --project=android-chromium` | **124 passed, 0 failed, 16 skipped** (skips: axe runs only on Chromium engines; Tab-to-link test off on desktop WebKit; mobile-menu test off on desktop) |
| Firefox | `npx playwright test --project=firefox` | Not runnable on this Mac (the Playwright Firefox build exits on start, also outside the sandbox). **Runs in CI:** GitHub Actions run 40942234177, all five projects incl. Firefox: 153 passed, 0 failed, 22 skipped. |
| CI type check | `npx astro check` in CI | first run failed (no Node types for `playwright.config.ts`, `qa/unit.test.ts`); fixed with `@types/node`, now 47 files, 0 errors |
| Live site | `PW_URL=https://siplay01.github.io/reverse-reduktor-v5-ab/ npx playwright test` (Chromium, WebKit, iPhone, Android) | 124 passed, 0 failed, 16 skipped; 404 for unknown paths, РКО PDF 200 |
| Security | `gitleaks dir .` | no leaks |

## Scenarios covered by the browser tests (each for A and B)

Home (brand, operator, РКО PDF 200 + `application/pdf`, noindex, no former brand) · every main section through the nav, mobile via the menu, `aria-current` · mobile menu open / Escape · home search → exact designation first (`СБ 525 12 104` → `СБ525-12-104`) · finder: model filter, node filter (disabled for other models), empty state, reset, URL state · deep links `?q=`, `?isp=-004#poz-18` · variant selector: fig. 5 pos. 18 «–» in the base variant and 1 in -014, pos. 4 the reverse, comparison shows 10 columns, choice remembered on the next node · viewer opens only from «Увеличить», zoom modes, Escape · request list: add without navigation, toast, counter, variant and per-unit quantity carried, requested quantity edited, manual line, contact validation, mailto href contains the lines, status says the site sends nothing, no «отправлено», .txt download, copy, survives reload, two-step clear · privacy: delete stored data · requisites and `rekvizity.txt` · no horizontal scroll on 7 key pages · skip link first + visible focus · no console errors, CSP violations, failed requests or 4xx on 14 pages · no-JS: all variant columns and all 314 parts rendered · chooser and 404 (status 404).

## Accessibility (WCAG 2.2 AA)

- axe-core (`wcag2a/aa`, `wcag21a/aa`, `wcag22aa`) on 15 pages per design, light and dark, Chromium desktop and Pixel 7 emulation: 0 violations. Fixed on the way: brand link `aria-label` mismatch; A dark: active nav link and drawing caption contrast.
- Keyboard: skip link, visible 3 px focus, Escape closes menu and viewer, all actions are buttons or links, quantity inputs labelled per line, live region for list changes.
- Not done: screen-reader pass with VoiceOver/NVDA by a person; 200 % zoom check by eye.

## Responsive

`node qa/shots.mjs 320,360,390,430,768,1024,1440,1920` (Chromium, 13 page types × 2 designs × 8 widths = 208 full-page renders): **no horizontal page overflow**. Fixed on the way: absolute-positioned cells escaping table scroll containers, grid items without `min-width: 0`, header width at 320-360 px, A requisites strip at 320 px. WebKit renders at 390 and 1440 (6 page types) and dark theme renders checked by eye.

## Lighthouse 12.8.2 (local preview, headless Chromium, one run each unless noted)

| Page | Mobile perf / a11y / BP / SEO | Mobile LCP | Desktop perf / a11y / BP / SEO | Desktop LCP |
| --- | --- | --- | --- | --- |
| A home | 95 / 100 / 100 / 66 | 2.9 s (3 runs) | 100 / 100 / 100 / 66 | 0.6 s |
| A parts | 98 / 100 / 100 / 63 | 2.0 s | 100 / 100 / 100 / 66 | 0.4 s |
| A node fig. 5 | 99 / 100 / 100 / 66 | 2.0 s | 100 / 100 / 100 / 66 | 0.4 s |
| B home | 96 / 100 / 100 / 66 | 2.6 s (3 runs) | 100 / 100 / 100 / 66 | 0.6 s |
| B parts | 98 / 100 / 100 / 63 | 2.0 s | 100 / 100 / 100 / 66 | 0.4 s |
| B node fig. 5 | 99 / 100 / 100 / 66 | 2.0 s | 100 / 100 / 100 / 66 | 0.4 s |

SEO below 100 only because of `is-crawlable` (intended `noindex`). CLS ≤ 0.012, TBT 0 ms. Home mobile LCP is above the 2.5 s target in the simulated slow-4G lab run (render delay of the hero photo; an image preload and inlined CSS did not move it). No field data exists; these are lab numbers from a local server.

## Known limits

- No backend: the request leaves only by copy, .txt or the user's mail program; very long lists may be cut by some mail programs (warning shown above 4000 characters).
- The comparison table on a 320 px phone scrolls sideways inside its container.
- Content gaps are owner questions (NEEDS_OWNER_INPUT.md), not defects.
