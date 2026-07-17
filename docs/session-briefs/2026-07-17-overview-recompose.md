# Overview recompose onto v2 primitives — session brief (GATED)

**Status:** GATED — do not start until deliverables 1–4 have shipped AND the Overview page exists on the working branch.
**Branch:** `feat/nueva-simulacion-overview` (the page's own branch)
**Prerequisite reading:** full AGENTS.md required-read order, then this brief + the four primitive briefs it depends on.

## Gate conditions

1. `stat-tile-v2`, `meter-v2`, `donut-v2` shipped (each through builder → pre-flight → ds-token-guardian → tester) and exported from `@coherence/ui`.
2. `chart-line` year-axis format shipped.
3. The Overview page (`apps/site/src/app/pages/demos/nueva-simulacion-overview/`) is present on the branch — as of 2026-07-17 it lives only on `feat/nueva-simulacion-overview` and is NOT on the v2 primitive branches. Confirm it's there before starting.

## What this session produces

Replace the inline bento compositions in the Overview with the real primitives:
- KPI tiles (Patrimonio neto, Tu dinero dura hasta, Año libre de deuda, Preparación jubilación) → `afi-stat-tile-v2`.
- Liquidez, Objetivo de legado → `afi-meter-v2`.
- Distribución de activos → `afi-donut-v2` (replacing the `chart-bar` stand-in).
- Projection chart x-axis → `chart-line` `'year'` format.

No new visual design — this is a swap of hand-written markup for primitives, preserving the current layout and copy. Any layout token that was inline becomes the primitive's concern. Per the visual-parity rule: swapping to primitives here must not grow the primitive APIs — if a tile needs something a primitive can't do, that's a gap to log against that primitive's brief, not a same-pass API change.

## Out of scope

Redesigning the Overview, new tiles, retiring anything v1.
