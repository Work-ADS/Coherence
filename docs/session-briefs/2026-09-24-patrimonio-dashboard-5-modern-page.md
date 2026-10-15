# Patrimonio resumen (modern) — session brief

**Status:** blocked on chunks 1–4 · **Branch:** `feat/patrimonio-resumen-moderno`
**Project:** [Patrimonio dashboard](2026-09-24-patrimonio-dashboard-0-index.md), chunk 5 of 5
**Prerequisite reading:** full AGENTS.md required-read order, then the chunk 4 brief, then this one. Before starting, open the traditional page as shipped, plus `panel-asesor` and `demo-1`.

## What we're building

The same page as chunk 4, in the modern brand, at `/demos/wealth-planner-2026/patrimonio-resumen-moderno`.

## Files

- `apps/site/src/app/pages/demos/patrimonio-resumen/patrimonio-resumen-moderno.page.{ts,html,scss}`. It reuses `patrimonio-resumen.data.ts`.
- `demos.routes.ts`: new entry.
- `demos.landing.ts` `DEMOS`: new card with `system: 'v2'`.

## Composition

```
site-demo-shell
└ div data-foundation="modern"
  └ site-planner-navbar-v2 currentView="Patrimonio" clientName simName advisorName
  └ afi-page-header level="page"        (modern-themed by chunk 3)
      slot="actions" → afi-button-v2 "+ Añadir patrimonio"
  └ afi-page-header level="section"  "Evolución del patrimonio"
      slot="filters" → afi-segmented-control-v2 T1–T4 · afi-select-v2 métrica
      body → hero (--type-display-metric-*) · afi-chart-bar (monochrome via bridge) · .kpi-grid of afi-card-v2 [showHeader]="false"
  └ site-patrimonio-assets …
```

The navbar-v2 is the reference's top bar: client and sim switcher, icons and avatar, with tab-style view navigation.

On each KPI card, the right-aligned meta is an `afi-badge-v2`:

- `tone="success"` for the delta
- `tone="warning"` for "3 pendientes"
- `tone="neutral"` for "+ 2 nuevos"

The badge label always carries the meaning, not the colour alone.

## Known limit (say it in the handoff)

`site-patrimonio-assets` still renders v1 `afi-table` and chips. Inside the modern page they'll look traditional. Swapping to table-v2 and chip-v2 is a follow-up and not part of this chunk.

## Verification

Same as chunk 4, plus:

- There are no serif titles anywhere in the dashboard top.
- The chart is monochrome, with the range in monochrome strong.
- Screenshot the traditional and modern pages side by side next to the reference.

## Out of scope

- A v2 asset block.
- `stat-tile-v2`.
