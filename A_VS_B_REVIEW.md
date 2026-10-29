# A vs B review (second pass, 2026-10-29)

Real browser renders of the production build, Chromium, light theme. Images are local in `review/` (not committed).

## Before / after

| | Desktop 1440 | Mobile 390 |
| --- | --- | --- |
| V1, V3, V4, V5 first pass, old Tilda site, new A, new B: first screens side by side | `review/audit/before-after-1440.jpg` | `review/audit/before-after-390.jpg` |

V1, V3, V4 and the first V5 pass share one first screen (header bar, H1 left, the same phone photo right). The new A opens with a navy contents rail, a 112 px statement and the engineering drawing; the new B opens with a search console, live results and the request panel. Diagnosis in `DESIGN_DECISIONS_A_B.md`.

## Same page, both designs (full page, colour and grayscale)

| Page | Desktop 1440 | Mobile 390 |
| --- | --- | --- |
| Home | `review/compare/home-1440.jpg`, `home-1440-gray.jpg` | `review/compare/home-390.jpg`, `home-390-gray.jpg` |
| Parts search | `review/compare/parts-1440.jpg` | `review/compare/parts-390.jpg` |
| Node РР-300, fig. 5 | `review/compare/node-1440.jpg` | `review/compare/node-390.jpg` |
| РР-300 product | `review/compare/rr300-1440.jpg` | `review/mobile-390/{a,b}-rr300-390.jpg` |
| Tenders | `review/compare/tenders-1440.jpg` | `review/compare/tenders-390.jpg` |
| Documentation / РКО | `review/compare/docs-1440.jpg` | `review/mobile-390/{a,b}-docs-390.jpg` |
| Request list (filled by real clicks) | `review/compare/request-1440.jpg` | `review/compare/request-390.jpg` |

Single files: `review/desktop-1440/`, `review/mobile-390/`.

## What differs

| | A · «Паспорт изделия» | B · «Каталожный терминал» |
| --- | --- | --- |
| Navigation | Fixed left rail (contents of a dossier) | One-line command bar |
| First screen | Statement in 112 px type, three real figures, then the drawing sheet | Search console with live results, model routes, request panel |
| Main visual | Interactive РР-300 section (fig. 1) on a framed sheet with a title block | Wall of all 26 node drawings; front view (fig. 2) in a technical frame |
| Photo use | Cropped РР-300 unit as a document of the product | Same crop, small, beside the register |
| Type | Weight 500, very large, tight tracking, small caps labels | Weight 650, mid sizes, mono labels and numbers |
| Rhythm | 88-128 px gaps, hairlines, one dark spread | 48-72 px, 2 px ink rules, white panels on a grid background |
| РКО | Rail stamp on every page + a full dark spread on the home page | Thumbnail panel on the first screen; full block on the documentation page |
| Parts search | Search form above the list (document) | Sticky filter column beside the results (application) |
| Product page | 180 px title, the section drawing, two-column data sheet | Spec sheet with a sticky framed drawing and photo |

## Recommendation

**B** for daily use by procurement and fleet engineers: the first screen answers «есть ли деталь и где она на чертеже» without a click, the request list is always in view, and all 26 nodes are one click from the home page.

**A** for representing the company (a new owner, a first meeting, a tender committee that does not know the range): it reads as a serious manufacturer's technical dossier, and the interactive section explains the product better than any photo the owner has today.

Either design becomes noticeably stronger once the owner supplies the studio photos without the «СибФлотСервис» watermark (NEEDS_OWNER_INPUT item 16).
