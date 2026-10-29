# Asset provenance (internal; never shown on client pages)

Every file under `public/` and every fact source in `src/`. Paths relative to `~/Documents/Projects/Reductor/`. Rights: none of the owner's photos, scans or the manual has a written publication permission yet (see NEEDS_OWNER_INPUT.md, item 1); the demo is `noindex` and `robots.txt Disallow` for that reason.

## Media

| Published file | Origin | Where shown | Model claim | Notes |
| --- | --- | --- | --- | --- |
| `img/site/79a88550a41c-900.webp`, `-1400.webp` | `site/img/site/hero-rr300-pair.jpg`, owner photo from `~/Downloads/Reductor` (V1 session copy), WebP by `v3/scripts/prepare.py` | A hero, B hero frame, products, РР-300 page | «Реверс-редукторы РР-300» | Red hydraulic units with aluminium covers. Identified as РР-300 in V1-V4 and by the owner's file name; no watermark. Confirm with the owner (item 2). |
| `img/site/6ae2894a4d94-900.webp`, `-1163.webp` | `site/img/site/rr300-flange.jpg`, owner photo | A home services block, Услуги page | none: «Реверс-редуктор на участке предприятия» | Black mechanical unit, model not confirmed. V4 showed it as 3Д6; V5 does not attach a model. |
| `img/draw/man-fig1..4-{700,1400}.webp` | Manual `Руководство РР300 А4.pdf`, pages 6, 8, 14, 15, cropped at 200 dpi in the V4 session | РР-300 page, A home (fig. 1) | РР-300 (figs 3, 4: РР-300-238 and РР-300-7514 versions) | Captions quote the manual's figure titles. |
| `img/scan/*-{420,900,2000}.webp` (89 pages + crops) | `src_extract/rr300_catalog/` = owner scan of «Каталог деталей и сборочных единиц РР-300», WebP by `v3/scripts/prepare.py` | Node pages (drawing + spec scan), catalog viewer, A home, parts hub | РР-300 | Never re-cropped in V5; full pages open at 2000 px. |
| `img/cert/rko-06552-{600,1200}.webp` | Render of the owner's certificate PDF (V4 session) | Certificate block, B panel | ООО «Дело» | Seal and signature are the original raster; nothing redrawn. |
| `docs/svidetelstvo-rko-06552.pdf` | `~/Downloads/Reductor/СВИДЕТЕЛЬСТВО РКО 2026.pdf`, byte-identical, SHA-256 `c1626dbe71c6480bfbfa25e74326bb723d715aa62f3bdaa362e227f0f8461c77` (checked by `qa/links.mjs` on every build) | All РКО links | | |
| `docs/rr300-rukovodstvo.pdf` | `~/Downloads/Reductor/Руководство РР300 А4.pdf`, byte-identical (`cmp`, 2026-10-29) | РР-300 page, documentation, tenders | РР-300 | |
| `img/v5/rr300-section-{1200,2400}.webp` | Manual `Руководство РР300 А4.pdf` page 6 (vector), rendered at 400 dpi grey by `scripts/drawings.py`, crop 25/48/552/515 pt | A home, A РР-300 page (interactive section) | РР-300 | Callout positions (48, numbers 1-47) and the 38-line legend extracted from the PDF text by the same script → `src/data/cutaway.json`; legend lines whose numbers are only on the manual's sectional details (48-58) are not offered. |
| `img/v5/rr300-front-{1200,2400}.webp` | Same manual, page 8 (fig. 2, vector), 400 dpi | B home, B РР-300 page | РР-300 | |
| `img/v5/rr300-side-{1200,2400}.webp` | Same manual, page 15 (fig. 4), 400 dpi | not used yet | РР-300-7514 | |
| `img/v5/rr300-unit-{480,780}.webp` | Crop of `hero-rr300-pair.jpg` (x 620-1400, y 100-720): the right-hand unit only | A home ledger, both РР-300 pages, B register | «РР-300, фото предприятия» | Max 780 px wide, so never shown full-bleed. |
| `img/v5/flange-detail-{600,1080}.webp` | Crop of `rr300-flange.jpg` | A home services | none | Model not confirmed; caption «Фото предприятия». |
| `favicon.svg` | Drawn for V5 (two circles, neutral colours) | Browser tab | | Not a logo or trademark. |
| Fonts Golos Text, JetBrains Mono | `@fontsource-variable/*` npm packages, SIL Open Font License 1.1 | All pages | | Self-hosted, no font CDN. |
| Icons | `@tabler/icons` (MIT), inlined SVG | All pages | | |

Not published (deliberately): the three studio photos of whole gearboxes from revers-reduktor.ru (`5eca7786c1465192`, `6de6d66dfa996fc5`, `a2e20f1bc0604431`, all with the «СибФлотСервис» watermark); `rr300-side` (model unconfirmed), `parts.jpg` (photo of loose parts, banned by the owner, looks staged), every part photo of the old store, the РР-238 store photo `99135878458a` (revers-remont.ru watermark), the expired certificate № 06483, the old site's AI-generated pictures.

## Data

| Site content | Source |
| --- | --- |
| Models, specs, 10 РР-300 factory variants | `src/data/models.json` (from V4 = `reconstruction/normalized/models.json`; variants from catalog table 2); presentation rules in `src/lib/domain.ts` |
| 26 node tables (253 rows: position, designation, name, qty per variant, mass, material, footnotes) | `src/data/assemblies.json` (V4): 7 tables checked against the scan earlier, 19 typed by eye from the scans on 2026-10-27 (`v3/data-src/specs_transcribed.txt`) |
| РР-300 parts index (194 entries) | Built in `src/lib/domain.ts` only from the 26 tables above |
| РР-238 / 3Д6 / 3Д12 lists (3 / 82 / 35 entries) | `src/data/parts.json` (V4), records from the old store (Tilda API) and revers-reduktor.ru; OCR-only records excluded |
| Model texts | V4 texts (last revers-remont.ru version, phone screenshots `bb3acfc8`, `062d7867`, `673d6eab`), shortened; claims removed |
| Services | Owner scheme + РКО scope; repair steps and clutch designations from repair-page screenshots `a541dec8`, `dfd1f6f3`, `f07f3eb4` |
| Requisites | Letterhead OCR in `research/screens/54254653-….txt` (address, phone, e-mail, bank, accounts, BIK); ИНН also on the certificate; КПП and ОГРН from V1 `site/config.js` (origin not re-traced in V5, item 4) |
| Privacy policy | Owner file `политика новая без чата! .docx` → `research/docs/policy.txt`; only em dashes replaced by en dashes |
