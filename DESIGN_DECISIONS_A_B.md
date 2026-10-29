# Design decisions A / B (second pass, 2026-10-29)

The first V5 pass was rejected by Dmitry: V1-V5 looked like one template. This file records the diagnosis and the two concepts that replaced it. Tokens still come from `BRANDBOOK_AB.pdf` (A = concept №1 «Naval Authority», B = concept №4 «Steel & Cobalt»).

## Why V1-V5 looked the same (visual audit, `review/audit/before-after-1440.jpg`, `before-after-390.jpg`)

1. **One skeleton.** Every version: thin top bar, white header with a horizontal menu and a counter button, then an H1 at 700-800 weight on the left and the same phone photo (`hero-rr300-pair`, two units on a concrete floor) at about 4:3 on the right, then a row of bordered boxes (certificate, facts, cards). Only palette, radius and accent changed.
2. **The weakest asset as the hero.** The lead image was a 1400 px phone snapshot with pallets and clutter. At hero size it looks cheap, and it was the first thing every version showed.
3. **Template components.** Bordered card + small button + grey table header, all at one scale; heading sizes between 26 and 50 px everywhere; generous but uniform spacing. Nothing had a strong typographic or structural idea.
4. **The real strength was unused.** The owner's manual contains vector drawings (pages 6, 8, 14, 15 have no raster images). Rendered at 400 dpi they are razor sharp and carry the authentic engineering character that the photos cannot.

What was checked about photos: the 90 full-size photos of revers-reduktor.ru include three good studio shots of whole gearboxes (`5eca7786…`, `6de6d66d…`, `a2e20f1b…`), but all three carry the «СибФлотСервис» watermark, so they cannot be used (NEEDS_OWNER_INPUT item 16). The remaining honest photos were re-cropped: one РР-300 unit fills the frame (`img/v5/rr300-unit-*`), and the flange close-up of the black unit is used without a model name.

## A · «Паспорт изделия» (technical dossier)

- **Skeleton:** no top header. A fixed 272 px navy rail on the left holds the wordmark, the contents (4 main sections, then Закупки, Контакты), a part-number field, the request list, an РКО stamp, phone and e-mail. Pages read like sheets of a document on porcelain paper. On phones the rail becomes a slim navy bar and a full-screen menu.
- **Type:** Golos Text at weight 500 (not bold), very large: home H1 up to 112 px with −0.04 em tracking, product title up to 180 px. Small caps labels in bronze text (12 px, +0.14 em). Body 17 px.
- **Visual:** the РР-300 longitudinal section (manual fig. 1) on a drawing sheet with a double frame and a title block («Изделие / Обозначение / Вид / Источник»). Its 47 callouts are linked to the manual's own legend: choosing «22 ведомый вал» marks the number on the drawing. Nothing is invented: the positions come from the PDF's text coordinates, the names from the legend.
- **Home order:** opening statement + three real figures (10 variants, 26 nodes, РКО № 06552) → drawing sheet → product ledger (РР-300 as a large entry with the cropped unit photo, other models as ledger rows in 30 px type) → parts block with six real node drawings → one dark spread with the certificate (number at 112 px, dates, verbatim scope) → services as a typographic list → procurement.
- **Rhythm:** 88-128 px between sections, hairlines (1 px) instead of boxes, bronze only as rules and labels. Tables have no fill, only rules.
- **Inner pages:** huge page titles, node drawings in the same sheet frame, tenders as one continuous document with the company card at full width.

## B · «Каталожный терминал» (parts lookup application)

- **Skeleton:** a single 64 px command bar (brand, six short section names, phone, filled «Запрос» button with counter). The home page is a working console, not a landing page.
- **First screen:** on an engineering-grid background, H1 (48 px, weight 650), a 60 px mono search field with **live results under it** (designation, name, model, place on the drawing, «В запрос» per line), four model routes, and a side column with the live request list (last lines and quantities), the certificate thumbnail and contacts.
- **Visual:** a wall of all 26 node drawings in a precise 6-column grid with mono figure numbers, plus the manual's front view (fig. 2) in a technical frame with corner ticks next to the equipment register table.
- **Type:** Golos Text 650 for headings, JetBrains Mono for labels, numbers, designations and table headers. Denser rhythm (48-72 px), 2 px ink rules over sections, cobalt markers.
- **Inner pages:** parts search as an application with a sticky filter column next to the results; product page as a spec sheet with a sticky framed drawing; node page with a sticky drawing column.

## Shared on purpose

Data, URLs, the catalog engine (variant selector, finder, request list and letter text), requisites, accessibility behaviour. The brandbook allows a shared catalog engine; everything a visitor sees first (navigation, first screen, imagery, type scale, rhythm, page composition) is different.

## Rules kept

Real images only, drawings `object-fit: contain` on white with `mix-blend-mode: multiply` on paper colours, explicit zoom actions, 44 px touch targets, visible focus, `prefers-reduced-motion`, light and dark themes per design, no em dashes, no part photos, no former brand.
