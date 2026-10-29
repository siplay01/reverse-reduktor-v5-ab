# Design decisions A / B

Both designs follow `~/Downloads/BRANDBOOK_AB.pdf` (A = concept №1 «Naval Authority», B = concept №4 «Steel & Cobalt»). The handoff `tokens_AB.json` and `design_lab_4_concepts.html` were not available, so tokens were typed from the brandbook palette tables (pp. 2-4). Nothing from a design prototype was copied.

## Architecture

One Astro project, two route trees: `/a/…` and `/b/…`, identical paths, plus a chooser at `/` and a shared `404`.

| Layer | Shared | Per design |
| --- | --- | --- |
| Data and rules | `src/lib/domain.ts` (models, 26 nodes, 314 index entries, services), `src/lib/site.ts` (company, certificate, requisites) | none |
| Behaviour | `src/engine/core.ts` (search scoring, request list, letter text; unit-tested), `src/engine/client.ts` (variant selector, finder, request page, viewer, menu, privacy) | none: designs talk to the engine through `data-*` attributes |
| Working components | `NodeSpec`, `Finder`, `RfqPage`, `Requisites`, `CertFeature`, `Figure` | look and layout via `a.css` / `b.css` |
| Composition | page templates under `src/pages/[v]/` | `components/a/{Header,Footer,Home}`, `components/b/{Header,Footer,Home}`; products page, node index and node page branch on the design |
| Tokens and type | `base.css` structure | `[data-v="a"]` / `[data-v="b"]` tokens, light and dark |

A and B share one origin, so they share the request list and the chosen variant. That is the behaviour of one site with two skins; review screenshots use separate browser contexts.

## A · Naval Authority

- Idea: «инженерная репутация». A limited dark hero, then light working surfaces; quality from contrast and one real photo, not from gold.
- Header: thin navy line with a bronze rule (operator, РКО, phone), white header, wordmark with a bronze left bar and «Судовое оборудование», four main sections bold, «Закупки / Контакты» small on the right, request counter.
- Home: split hero 55/45 (H1 + two CTAs on navy, РР-300 photo full height; on mobile H1 and CTAs first, photo after), certificate rail directly under the hero, «Наша продукция» as one large РР-300 block (cross-section drawing from the manual + key figures) and three compact rows, catalog teaser with a real node drawing and a search field, asymmetric services (list / workshop photo / quote from the РКО scope), the full certificate block, procurement strip with ИНН/ОГРН.
- Products page: photo-led lead block + technical rows. Node index: drawing thumbnails. Node page: drawing left, title right, full-width table.
- Type: Golos Text 700, H1 hero up to 56 px, tight tracking; bronze text `#795328` only for kickers. Radius 2-3 px. Tables light with a navy rule under the header.
- Brandbook bans respected: no brass gradients or gold buttons (dark theme uses a pale blue accent, not bronze), no serif, no dark band on every page (navy only in hero, top line, footer).

## B · Steel & Cobalt

- Idea: «рациональная инженерия». A light, nearly typographic portal; cobalt markers; search and the request list always in reach.
- Header: ink strip (operator, РКО with date, e-mail, phone), header with a cobalt bar mark, a working search field (desktop) and a bordered «Список запроса» button that fills with cobalt once it has lines; second row with all six sections.
- Home: light hero with H1, a large working search (examples link to real designations) and the photo in a technical frame with corner ticks and a designation strip; info strip of three white panels overlapping the hero (certificate thumbnail + dates + PDF, procurement, contact); «Оборудование» as a specification table; «Запасные части РР-300» as a two-column index of all 26 nodes; services as a definition list next to a documentation list.
- Products page: comparison table first, framed photo second. Node index: compact numbered list. Node page: 400 px sticky drawing column next to the table on wide screens.
- Type: Golos Text 650, JetBrains Mono for labels, kickers, table headers and designations. Radius 4-5 px. Rules: 2 px ink lines over sections, 4 px cobalt left edges on the certificate and the main catalog route.
- Brandbook bans respected: tables are not the whole page (photo frame, panels, index); one blue family; no modal except the explicit drawing viewer.

## Common rules

- Real images only, `object-fit: contain` on white for drawings and scans, explicit «Увеличить» actions (the image itself is not a click target), viewer with «По размеру окна / Исходный размер / В новой вкладке».
- Mobile tables keep position, designation (name under it), quantity and action on screen; mass and material behind a toggle; comparison columns scroll inside the table container.
- Touch targets 44 px (36 px small buttons, 44 px on coarse pointers), visible 3 px focus ring, `prefers-reduced-motion` respected (only colour transitions, 150 ms).
- Dark theme per design via `prefers-color-scheme`, no JS.
