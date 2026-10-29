# Source audit (V5 A/B, 2026-10-29)

Paths are relative to `~/Documents/Projects/Reductor/` unless absolute. Nothing in this list was modified by V5.

## 1. Brief inputs: what was found and what was not

| Named in the brief | Found | Used as |
| --- | --- | --- |
| `REDUKTOR_V5_AB_HANDOFF/README_START_HERE.md`, `spec/01…08`, `spec/tokens_AB.json`, `checklists/RELEASE_CHECKLIST.md`, `assets/reference/design_lab_4_concepts.html` | **Not on disk.** Searched `~/Downloads`, `~/Documents`, `~/Desktop` (depth 4) and Spotlight. Only `~/Downloads/BRANDBOOK_AB.pdf` and `~/Downloads/REDUKTOR_V5_CLAUDE_CODE_PROMPT.md` exist. | Tokens, rhythm, components and bans were taken from `BRANDBOOK_AB.pdf` pages 2-6 instead. The release checklist was replaced by the checks in `QA_REPORT.md`. |
| `sources/RKO_06552_2026.pdf` | Same document as `~/Downloads/Reductor/СВИДЕТЕЛЬСТВО РКО 2026.pdf` (V4 copied it to `v4/public/docs/svidetelstvo-rko-06552.pdf`). SHA-256 `c1626dbe…0f8461c77`, identical in all three places. | Published PDF, certificate scan, scope text. |
| Owner's site scheme | Hand-written page, embedded in `BRANDBOOK_AB.pdf` p. 6 and as `~/Downloads/Reductor/PHOTO-2026-10-25-22-25-30.jpg`. | Main navigation and section list (see 3). |
| Owner correspondence | `~/Downloads/Reductor/Screenshot 2026-10-29 at 9.44.22 AM.png` (WhatsApp, 4 messages). | Client rules (see 2). |
| `BRANDBOOK_AB.pdf` | Yes, 6 pages, WeasyPrint. | Design source for A and B. |

## 2. Owner statements (WhatsApp screenshot)

1. «Сайт от ООО ДЕЛО, предприятие Изготовитель реверс-редукторных передач, с обслуживанием их (ремонт и тех поддержка), и продажей запасных частей к ним.»
2. Header need not be the company name; part photos are superfluous; photos only of gearboxes «с габаритными чертежами и кратким описанием»; spare parts only as catalogs; requisites of ООО «Дело» (address, phone, e-mail) at the bottom.
3. Header «реверс-редуктор» or similar. «Упоминание Сибфлотсервис - исключено!!!!!»
4. Earlier line in the same chat: «Наш сайт: revers-reduktor.ru».

## 3. Owner's hand-drawn site scheme (read, not over-read)

Top: «Реверс-редуктор / судовое оборудование». Sections: «Наша продукция», «Запасные части», «Услуги», «Техническая поддержка / документация».

| Line as written | Readable? | V5 decision |
| --- | --- | --- |
| реверс-редуктор РРП и РРП-300 (2-7 шт) | Partly: the model letters are unclear | РР-300 shown from documents; «РРП» not shown |
| реверс-редуктор механический 3Д6 (2 шт) | Yes | 3Д6 shown |
| реверс-редуктор механический 3Д12 (2 шт) | Yes | 3Д12 shown |
| муфта сцепления МС-… (2 шт) | Model number illegible | «Муфты сцепления» shown with the two designations from the old repair page only |
| реверс-редуктор гидравлический NEW | Meaning unclear | Not shown; owner question |
| Запасные части: для гидравлического (в 60 страниц), 3Д6, 3Д12, муфты сцепления | Yes | РР-300 factory catalog; lists for 3Д6, 3Д12, РР-238; clutch parts via manual request line |
| Услуги: ремонт судовых реверс-редукторов; ремонт рулевых машин РГ-0,25; техническая поддержка; изготовление деталей судового машиностроения; разработка технической документации судового машиностроения | Yes | Five services, wording kept |

РР-238 is not on the scheme but is in every earlier source (old store, letterhead OCR «PP-238 (С5238-25-01-13)»). Kept; owner question.

## 4. Local sources inspected

| Folder | State | Role for V5 |
| --- | --- | --- |
| `site/` (V1 prototype) | 257 files; untouched | Reference only. Contains the expired РКО № 06483 image and V1 copy with «гарантия 12 месяцев». |
| `deploy/` (public V1 repo copy) | git clean | Not used. |
| `original-replica/` | 366 pages, replica of revers-remont.ru incl. Tilda code | Visual history only. Tilda terms forbid hosting its code; nothing reused. |
| `restored-reference/` | Research reference site | Not used directly. |
| `reconstruction/` | Normalized catalog, manifests, `conflicts.csv` (43 rows) | Indirect: V4 JSON is generated from it. Conflicts in 5. |
| `src_extract/rr300_catalog/` | 89 scan pages of «Каталог деталей и сборочных единиц РР-300» | All drawings and spec scans (via V4 WebP export). |
| `research/` | OCR of screenshots, manual text, owner policy text | Letterhead OCR (requisites), manual text (titles of figs 1-4, masses), `research/docs/policy.txt` (owner's privacy policy). |
| `results/` | Owner memos 01-13 | Open-question history. |
| `v3/` | Astro, git clean, live at siplay01.github.io/reverse-reduktor-v3 | Superseded. |
| `v4/` | Astro, git clean at `9be7e93`, live at siplay01.github.io/reverse-reduktor-v4 | **Data base for V5**: `src/data/*.json`, media in `public/img/{scan,draw,cert,site}`, PDFs. |

GitHub (checked with `gh api`, 2026-10-29): `siplay01/reverse-reduktor-demo` (public, last push 2026-10-27), `siplay01/revers-remont-replica` (2026-10-28), `siplay01/reverse-reduktor-v3` (2026-10-28), `siplay01/reverse-reduktor-v4` (2026-10-29). Local v3/v4 heads match their last pushes; no V5 repository exists yet.

## 5. Conflicting facts

| Subject | Values | V5 choice |
| --- | --- | --- |
| Operator contacts | Letterhead of ООО «Дело» (OCR of `54254653…JPG`): тел. +7-960-966-55-77, sudosnab_delo@mail.ru, ул. Зоотехническая, 24 · V1/V3: +7 996 704-22-05, sibflot.servis@yandex.ru (СибФлотСервис), Зоотехническая 24ж / 26 | Letterhead set only. СибФлотСервис contacts banned by the owner. |
| РР-300 power for 16-pin variants | Manual: 110 kW (150 hp) for 10- and 16-pin couplings · Catalog table 2: 16-pin variants 300 hp | Variant table shows catalog table 2 values (the catalog is the parts source); owner question. |
| Reverse ratio РР-300 | Manual: 1:2,04 / 1:2,95 / 1:2,18 · catalog table 2: 1:2,18 and 1:2,61 | Variant table from catalog; spec line «1:2,18 / 1:2,61 (по исполнениям)». |
| «Производитель: Барнаултрансмаш» (old store spec line) | Contradicts the owner (ООО «Дело» is the manufacturer) | Hidden (as V4). Owner question. |
| Dimensions 781 × 650 × 799 mm | Same number for all four models on the old site | Not shown (as V4). |
| 3Д6 card text on the old site | Contained the 3Д12 text | Own short text per model (as V4). |
| Manual coverage | Manual title «Реверс-редуктор РР-300. Руководство по эксплуатации РР-300.РЭ»; fig. 3 is the РР-300-238 version for ЯМЗ-238 | **V4 error:** V4 titled it «…РР-300 и РР-238» and showed figs 1-3 on the РР-238 page. РР-238 (СБ238-25-01-13) is a different designation. V5 shows the manual and drawings on РР-300 only. |

## 6. Functional matrix V3 / V4 / V5

| Function | V3 | V4 | V5 A and B |
| --- | --- | --- | --- |
| Brand «Реверс-редуктор», operator ООО «Дело» | partly (СибФлотСервис contacts) | yes | yes |
| No part photos | no (199 part photos) | yes | yes, enforced by `qa/links.mjs` |
| Gearbox photos only under a confirmed model | no (РР-300 shown with 3Д6/3Д12 units) | no (unconfirmed units as 3Д6/3Д12; РР-238 photo with revers-remont.ru watermark) | yes: РР-300 only |
| РКО № 06552 with original PDF | no (expired № 06483) | yes, on 6 places | rail/panel near the first screen + one full block + documentation page |
| Global part search across models | yes | per table only | yes: designation, name, model, node; URL state |
| 26 РР-300 node pages with drawing + spec | yes | yes | yes |
| Factory variant selector, one quantity per variant | no (10 columns) | no (10 columns) | yes, remembered across nodes; comparison table on request; no-JS fallback shows all columns |
| Position / designation / qty per unit / requested qty kept apart | partly | partly | yes, in table, list and letter text |
| Request list: copy, mailto | yes | yes | yes + .txt download + manual lines; long-letter warning; never «sent» |
| Requisites with bank details, copy/print/download | no | partly (no copy/download) | yes |
| Tenders page as document center | text only | text + requisites | documents table + requisites + EIS search link |
| Privacy page with stored-data control | no | no | owner policy + «Удалить сохранённые данные» |
| Light + dark | yes | yes (3 palettes) | yes per design |

## 7. Critical errors found in earlier versions (not fixed there: V1-V4 stay as they are)

1. V4: РР-300 manual and drawings presented as covering РР-238 (section 5).
2. V4: photos `rr300-flange` / `rr300-side` (black mechanical units, model not confirmed) captioned as 3Д6 / 3Д12; brandbook p. 5 forbids this.
3. V4: РР-238 photo `99135878458a` carries the revers-remont.ru watermark.
4. V3: СибФлотСервис phone/e-mail; expired certificate; part photos with third-party watermarks.
5. V1: «гарантия 12 месяцев» without a document; expired certificate.
6. V4 parts tables: 9 OCR-only designations published «as read» (e.g. `353-201`, `584-28-80-`). V5 leaves out every OCR-only record.
