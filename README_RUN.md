# Реверс-редуктор V5: two designs A / B

Static Astro site of ООО «Дело» in two independent designs over one data base and one catalog/request engine.
V1-V4 are untouched; this folder is its own git repository.

- A · Naval Authority: `/a/`  ·  B · Steel & Cobalt: `/b/`  ·  chooser: `/`
- Same paths in both, e.g. `/a/zapchasti/rr-300/ris-05/` and `/b/zapchasti/rr-300/ris-05/`

## Run locally

```
cd ~/Documents/Projects/Reductor/v5-ab
npm ci
npm run build
npx astro preview --port 4330
```

Open http://localhost:4330/reverse-reduktor-v5-ab/ (chooser), http://localhost:4330/reverse-reduktor-v5-ab/a/ and http://localhost:4330/reverse-reduktor-v5-ab/b/.
`npm run dev` gives a dev server with reload (not for measurements).

## Test

```
npm run build
node --experimental-strip-types qa/unit.test.ts      # engine
node qa/links.mjs                                    # static rules on dist/
npx playwright test                                  # all browsers; Firefox does not start on this Mac, CI runs it
node qa/shots.mjs 1440,390 home,node chromium light  # screenshots (preview on :4330 running)
node qa/compare.mjs                                  # A|B sheets from the screenshots
```

## Published

Live since 2026-10-29: https://siplay01.github.io/reverse-reduktor-v5-ab/ (repo siplay01/reverse-reduktor-v5-ab). `git push` from this folder redeploys through the workflow. The repo was created with:

```
! cd ~/Documents/Projects/Reductor/v5-ab && gh repo create siplay01/reverse-reduktor-v5-ab --public --source . --push
! gh api -X POST repos/siplay01/reverse-reduktor-v5-ab/pages -f build_type=workflow
```

After that `git push` from this folder redeploys. The workflow builds, runs the type check, unit, static and all browser tests (incl. Firefox) and publishes:
https://siplay01.github.io/reverse-reduktor-v5-ab/a/ and https://siplay01.github.io/reverse-reduktor-v5-ab/b/.
Two separate Pages sites are possible too (one per design) but need two repositories; one repo with `/a/` and `/b/` keeps one source and one deploy.

The demo is `noindex` with `robots.txt Disallow` until the owner confirms rights. On an own domain: repository variables `SITE_URL`, `BASE_PATH=/`, `INDEXABLE=1`, plus `public/CNAME`.

## Where things are

```
src/lib/site.ts          company, requisites, certificate, links (/a/, /b/)
src/lib/domain.ts        typed domain: models, 26 nodes, parts index, services; what is shown and why
src/engine/core.ts       search + request list (pure, unit-tested)
src/engine/client.ts     browser behaviour via data-* attributes
src/components/shared/   NodeSpec, Finder, RfqPage, Requisites, CertFeature, Figure, Icon
src/components/a|b/      Header, Footer, Home per design
src/styles/              base.css (structure), a.css, b.css (tokens + looks, light/dark)
src/pages/[v]/           44 routes per design
src/data/                V4 JSON (catalog, models, scans), owner privacy policy
qa/                      unit, static and browser tests, screenshot tools, Lighthouse JSON
review/                  screenshots for A_VS_B_REVIEW.md (local, not committed)
```

Docs: SOURCE_AUDIT.md, ASSET_PROVENANCE.md, NEEDS_OWNER_INPUT.md, CONTENT_DECISIONS.md, DESIGN_DECISIONS_A_B.md, A_VS_B_REVIEW.md, QA_REPORT.md.

## Backend later

Replace the mail link handler in `rfqPage()` (`src/engine/client.ts`) with a POST of `rfq.get()` plus the contact fields. Show success only after the server answers.
