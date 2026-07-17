# chart-line year / plain-integer x-axis format — session brief

**Status:** ready to build (deliverable 4 of 4) · **Branch:** `feat/chart-line-year-axis`
**Sequence:** independent — slot in wherever convenient (Richard 2026-07-17). Smallest, lowest-risk of the batch.
**Prerequisite reading:** full AGENTS.md required-read order, `docs/build-prompts/coherence-charts.md`, then this brief.

## ⚠ This is NOT a v2 primitive

Unlike stat-tile / meter / donut, this touches **shared, brand-neutral chart code** — `libs/ui/src/chart/chart-line.component.ts` + `chart-format.ts` — which has no `data-foundation` scoping and no `-v2` variant. It is an additive enhancement to the existing chart, used by the v2 Overview but benefiting every consumer. It does **not** go on the foundations-modern workbench as a v2 component. Flagged so we don't mislabel it.

## Why this exists

`chart-line` can only format its x-axis as compact-number (`formatNumber`) or full-date (`formatDate`). A year axis therefore renders as either **"2 k"** (number → RAE abbreviation kicks in above 1000) or **"01 ene 2026"** (date → full day/month/year). Neither is right for a year axis. The Overview's projection charts need clean year ticks: `2026`, `2030`, `2035`, …

## What this session produces

A new x-axis format option — a **year / plain-integer** formatter — selectable on `chart-line` (and any axis that shares the format enum via `chart-axis.component.ts`).

## Sources of truth

1. **`libs/ui/src/chart/chart-format.ts`** — `formatNumber` / `formatNumberFull` / `formatDate` / percent. Add a `formatYear` (or `formatInteger`) that renders the raw integer with es-ES grouping **suppressed** for years (a year is `2030`, never `2.030`). Use `Intl.NumberFormat('es-ES', { useGrouping: false, maximumFractionDigits: 0 })` — do not hand-concatenate.
2. **`chart-line.component.ts` / `chart-axis.component.ts` / `chart.types.ts`** — where the axis-format option is declared and selected. Extend the existing format enum/union (e.g. `'number' | 'date' | 'year'`) rather than adding a parallel boolean input.

## Proposed API — lock first thing

Extend the existing axis-format enum with `'year'` (renders `2030`) and/or `'integer'` (renders grouped integers like `1.234` with no k/M abbreviation). Confirm with Richard: is one `'year'` value enough, or does he also want a general no-abbreviation `'integer'` axis? Recommend adding both if cheap — `'year'` = no grouping, `'integer'` = grouped, both no abbreviation. Default axis behavior unchanged (backward-compatible).

## Constraints

- **Backward-compatible:** existing `chart-line` consumers must render identically unless they opt into the new format. Do not change the default.
- No raw formatting strings (Intl only, per the file's own rule). No raw hex/px.
- Pre-flight before handoff; tester verifies the three axis modes (number / date / year) on a demo.

## Out of scope

New chart types (donut is its own brief), tick-density/interval control, locale switching, the Overview recompose.
