# The Eyes rig

Grade the build before any human sees it (factory law: EYES BEFORE HUMANS). These run headless
Chrome against a served build and **measure** — they never ask you to trust a screenshot.

## Run it

```bash
npm run build && npx vite preview --port 5178 --strictPort
```

Then, in another shell, from `clients/dreamsign/site`:

| command | what it does |
|---|---|
| `node tools/eyes-junctions.mjs` | every `data-beat` seam, desktop + 390px, scored, plus the jank meter and console errors |
| `node tools/checks.mjs` | the standing behaviour checks (hero, nav, marquee, ground, footer contrast, entrance, reduced motion) |
| `JUMP=573 node tools/find-line.mjs` | kill-test: which layer is drawing that line |

Env: `BASE` (default `http://localhost:5178` — point it at the live URL to verify a deploy),
`TAG` (names the shot files), `EYES_OUT` (default `.eyes/`, gitignored), `CHROME_PATH`,
`WFACT_MODULES` (a `node_modules` holding `puppeteer-core` + `pngjs`; the factory root has both).

## The two things that make this rig honest

**A section line is a full-width step.** Scoring by "biggest row-to-row change" counts every
line of text as a failure — useless. `fullWidthStep` takes the **median across x** of the
row-to-row delta: text moves some columns, a seam moves all of them. 0–255 scale, under 4
passes, 4–8 is a watch, 8+ fails.

**A number is not a diagnosis.** When a junction scores badly, run `find-line.mjs` before
changing any CSS. Every WATCH left on this build was traced that way to a feature painted
inside an asset (B7's cloud-deck edge, the landing plain's horizon) rather than a boundary.

## The dev contract the site must keep

- `?jump=<scrollY>` lands the scroll immediately and **skips the entrance**
- `window.__ready === true` once fonts and media have settled
- every scroll beat carries `data-beat="<name>"` (hero, opis, promise, marquee, stats, finale, footer)

Break any of those and the rig goes blind.

## Headless quirk worth remembering

Headless Chrome reports `prefers-reduced-motion: reduce`, which correctly makes the site skip
its motion — so captures come out "broken" until you force it. `openPage()` sets
`no-preference` for you; pass `'reduce'` when you actually want to test the a11y path.
