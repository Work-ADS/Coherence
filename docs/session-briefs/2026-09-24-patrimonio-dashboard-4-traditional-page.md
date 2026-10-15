# Patrimonio resumen (traditional) — session brief

**Status:** blocked on chunks 1 and 2 · **Branch:** `feat/patrimonio-resumen`
**Project:** [Patrimonio dashboard](2026-09-24-patrimonio-dashboard-0-index.md), chunk 4 of 5
**Prerequisite reading:** full AGENTS.md required-read order, `docs/rules/page-structure-skill.md`, `docs/rules/data-viz-skill.md`, then this brief. Open the [reference](assets/2026-09-24-patrimonio-dashboard-reference.jpg) and Gastos (`demos/gastos/gastos.page.html`) before writing chart chrome.

## What we're building

The reference dashboard's layout, done for Patrimonio in the traditional (v1) brand, at `/demos/wealth-planner-2026/patrimonio-resumen`. That route is depth 3, so there's no site chrome.

## Files

- `apps/site/src/app/pages/demos/patrimonio-resumen/patrimonio-resumen.page.{ts,html,scss}`
- `patrimonio-resumen.data.ts`: a year of daily series for 2026, one each for Patrimonio neto, Activos and Deudas. Deterministic (seeded, no `Math.random` at runtime), ending at Patrimonio's 1.240.000 €. The modern page (chunk 5) reuses this file.
- `demos.routes.ts`: new entry.
- `demos.landing.ts` `DEMOS`: new card with `system: 'traditional'`.

## Composition

```
site-demo-shell
└ site-planner-sidebar activeKey="patrimonio" + site-planner-top-bar   (same as Patrimonio)
  └ afi-page-header level="page"  title="Patrimonio"  subtitle=…
      slot="actions" → "+ Añadir patrimonio"   (Patrimonio's v3 category menu + site-patrimonio-add-dialog)
  └ afi-page-header level="section"  title="Evolución del patrimonio"   (Gastos scaffold)
      slot="filters" → afi-segmented-control T1 T2 T3 T4  ·  afi-select Patrimonio neto / Activos / Deudas
      body →
        hero figure   1.240.000 ,12 €   + delta "↑ 2,1 % frente al mes anterior"
        afi-chart-bar [data] [(range)] categoryTicks="month" readoutLabel=…   (+ docked readout)
        .kpi-grid → 3 × afi-card: Patrimonio neto · Liquidez disponible · Patrimonio invertido
  └ site-patrimonio-assets [sections] …
```

- **Period control.** Choosing T1–T4 sets `range` to that quarter's indices. Dragging the brush afterwards leaves the segmented control showing no selection, unless the range still matches a quarter exactly.
- **Metric select.** Swaps the series. The range stays where it is.
- **Hero figure.**
  - Reuse the decimal split from `panel-asesor.page.ts:67-75`.
  - The whole part uses the display type token and the decimals are smaller, in the tertiary colour.
  - The delta is an arrow plus text. Positive and negative take the semantic tones. Colour is never the only cue.
- **KPI cards.**
  - Each has an inline-SVG icon with its label, a right-aligned meta ("↑ 2,1 % frente al mes anterior", "3 movimientos pendientes", "+ 2 activos nuevos") and a big value.
  - Use the `.kpi-grid` from page-structure §8: `@container viewport`, 1 column below 48rem and 3 above.
- **Documented deviation.** The KPI grid sits under the chart, as in the reference, rather than in `slot="cards"`. Say so in a template comment.

## Copy

Spanish, following RAE (`copy-skill.md`). Sentence case. Euros as `1.240.000 €`, percentages as `2,1 %`.

## Verification

In the preview:

- T1–T4 move the range.
- The select swaps the series.
- The brush works with drag, click and keyboard.
- The readout updates without flicker.
- Add, edit and delete in the asset block all work.
- No console errors.
- Check at a mobile width and in dark mode.

Also:

- Take a screenshot next to the reference.
- Run the clean-code check, tsc and build.

## Out of scope

- The modern version (chunk 5).
- Changing `/demos/wealth-planner-2026/patrimonial`.
