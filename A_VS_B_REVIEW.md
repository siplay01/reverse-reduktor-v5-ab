# A vs B review

Same pages, same data, same viewport, Chromium, light theme, real browser renders of the production build (2026-10-29). Images are local files in `review/` (not committed). Grayscale sheets show that the layouts differ without colour.

| Page | Desktop 1440 | Mobile 390 | Grayscale |
| --- | --- | --- | --- |
| Home | `review/compare/home-1440.jpg` | `review/compare/home-390.jpg` | `review/compare/home-1440-gray.jpg`, `home-390-gray.jpg` |
| Parts search (catalog) | `review/compare/parts-1440.jpg` | `review/compare/parts-390.jpg` | `parts-*-gray.jpg` |
| Node РР-300, fig. 5 | `review/compare/node-1440.jpg` | `review/compare/node-390.jpg` | `node-*-gray.jpg` |
| Tenders / requisites | `review/compare/tenders-1440.jpg` | `review/compare/tenders-390.jpg` | `tenders-*-gray.jpg` |
| Documentation / РКО | `review/compare/docs-1440.jpg` | single files in `review/mobile-390/` | `docs-1440-gray.jpg` |
| Request list (filled by real clicks: fig. 5 pos. 4 and 6 in variant -010, one 3Д6 line) | `review/compare/request-1440.jpg` | `review/compare/request-390.jpg` | `request-*-gray.jpg` |
| РР-300 product | `review/compare/rr300-1440.jpg` | `review/mobile-390/{a,b}-rr300-390.jpg` | `rr300-1440-gray.jpg` |

Single full-page files: `review/desktop-1440/`, `review/mobile-390/`; WebKit renders `review/webkit/`; dark theme `review/dark/`. All 8 widths (320, 360, 390, 430, 768, 1024, 1440, 1920) for 13 page types per design are in `qa/screenshots/chromium-light/` after `node qa/shots.mjs 320,360,390,430,768,1024,1440,1920`.

## What differs

| | A · Naval Authority | B · Steel & Cobalt |
| --- | --- | --- |
| First screen | Dark split hero, photo as the visual anchor, two CTAs | Light hero, search box as the anchor, framed photo |
| РКО near first screen | Full-width rail under the hero | White panel with thumbnail in an overlapping info strip |
| Path to the catalog | Teaser block with a real node drawing and search | Header search on every page, hero search, 26-node index on the home page |
| Models | One large + three compact rows | Specification table |
| Rhythm | Few large sections, 88 px gaps, bronze accents | Denser sections, 2 px ink section rules, mono labels |
| Node page | Large drawing beside the title, table full width | Sticky 400 px drawing column next to the table |
| Footer | Navy, brand-first | Ink, four columns with mono requisites |

## What is the same on purpose

Data, URLs, the finder, the variant selector, the request list and letter text, requisites, the certificate block content, accessibility and mobile behaviour.

## Recommendation

For the owner's stated audience (procurement departments and fleet engineers who come for a part number or a tender document) **B** is the better default: search is on every page, the request list is always visible, and the home page reaches all 26 nodes in one click. **A** reads as the more representative company page and suits a first meeting with a new owner or a buyer who does not yet know the range. Both carry the same catalog, so the choice is about the first impression, not about function. If one is picked, the other's best part is cheap to borrow: A's certificate rail and editorial product block would fit B's home page without changing its structure.
