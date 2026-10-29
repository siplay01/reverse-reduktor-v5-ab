# Content decisions

Rules applied to all client copy (both designs share it).

## Kept out of the client UI

- СибФлотСервис, sibflot, revers-remont.ru, «Барнаултрансмаш»: checked on every build by `qa/links.mjs`.
- Part photos and old-store photos: checked by `qa/links.mjs` (no `img/p/` or `img/m/`).
- Source names, «проверено/OCR» badges, archive remarks: in `ASSET_PROVENANCE.md` only.
- Prices: the only prices are 2025 archive prices of the former seller. A procurement buyer would read them as current offers; every page says «по запросу» through the request flow instead.
- Warranty («гарантия 12 месяцев»), «официальный представитель», «оригинальные запчасти», delivery times, stock: no document.
- Tender history and «активно участвуем»: no list of contracts exists. Text: «принимает приглашения к участию в закупках и запросах котировок».
- OCR-only designations (9 РР-300 records such as `353-201`, `584-28-80-`): an unchecked reading is not a designation.
- The «РРП», «МС-…», «NEW» lines of the scheme: illegible or unclear.

## Shown, and how

- Manufacturer status: «Изготовление, ремонт и запасные части…; изготовление и ремонт выполняет ООО «Дело»». Based on the owner's statement and the РКО scope («изготовление и ремонт изделий судового машиностроения по согласованной … документации»). No founding year, volumes or customer names.
- РКО certificate: number, dates, branch and the three scope lines quoted verbatim. The «РКО» tag on services appears only on the three services that match a scope line (repair of reverse gears, manufacturing, technical documentation); not on steering-gear repair or support.
- Model specs: one value per line; the «Производитель» line hidden. RR-300 mass and oil data from the manual; variants from catalog table 2.
- Factory designations, positions and «БЧ» (standard parts without drawing) exactly as printed. Search keys normalise Latin look-alikes and dashes but the shown text is never rewritten.
- Quantity vocabulary, everywhere: «Поз.» (position on the drawing), «Заводское обозначение», «Кол. на изделие» / «Количество на одно изделие по спецификации» (from the table, read-only), «Запрашиваемое количество» (the buyer's number). Adding a line pre-fills the requested quantity with the per-unit quantity of the chosen variant, or 1, and the toast says so.
- A dash in the quantity column means «не входит в это исполнение» (screen readers get that text).
- Request: copy, .txt download, or an explicit «Открыть письмо в почтовой программе» click; the status text says the site sends nothing itself. Long letters (> 4000 characters of mailto URL) get a warning to copy or attach the file.
- Owner's privacy policy published as received; em dashes replaced by en dashes (house rule); a short factual block above it explains browser storage and offers deletion.
- Typography: no em dashes in any client copy (checked); designations in JetBrains Mono at 14 px minimum because «Б» reads as «6» below that.

## Edge cases handled

- No JavaScript: every page, link, table and the full parts list render; node tables show all variant columns; the request page explains it needs JavaScript and gives the e-mail.
- Blocked storage (private mode): the list lives in memory until reload.
- Empty search: message with what to check and the manual-line route.
- Same designation in different variants or places: separate request lines.
