# Build — Wealth Planner Diagnóstico teaser, static (`apps/awm-propuestas/src/app/teaser-diagnostico/`)

**Brief:** `docs/briefs/awm-propuestas.md` — Team + Timeline section (Tuesday concept epilogue).
**Surface:** Wealth Planner Diagnóstico teaser (lives inside the awm-propuestas app as a sibling route for 4-day speed).
**Golden-flow step:** epilogue — not part of the Propuestas flow. Shown at the end of the Tuesday pitch to make the "this DS is for every AFI product" extrapolation explicit.

## Scope of this prompt

One route (`/teaser/diagnostico`) inside the awm-propuestas app. A **high-fidelity static** rendering of what Wealth Planner's Diagnóstico screen looks like built from Coherence primitives. Not interactive beyond hover microinteractions.

**Not in scope:** real scenario projection logic, real-time recalculation, input parameters panel (post-concept). The Wealth Planner product itself (this is a teaser, not the product).

## Required reads

1. `docs/briefs/awm-propuestas.md` — context on why this teaser exists.
2. `docs/briefs/awm-propuestas-demo-script.md` — the handoff moment ("one more thing…").
3. `docs/plan.md` — Diagnóstico is the locked v1 composed-flow proof target for Wealth Planner. The 3 charts + EscenarioTable are its canonical shape.
4. Five skills.
5. `docs/build-prompts/coherence-charts.md` — the 3 chart types (line, bar, donut).
6. `docs/build-prompts/coherence-table.md`, `coherence-page-header.md`, `coherence-card.md`.

## Primitives used

- **Charts** (from `libs/ui/charts/`): EvolucionChart (line), CashflowChart (bar), AssetAllocationChart (donut). If the Charts primitive isn't built yet, **use static inline SVG placeholders** that visually match the intended chart — the Tuesday demo needs the pitch moment, not the chart logic.
- `Table` — EscenarioTable.
- `PageHeader` — title "Diagnóstico".
- `Card` — each chart sits inside a Card for shape + elevation.

## Layout (prose)

Workspace shell with a prominent "Concept · Wealth Planner" chip near the page header (signals: this is the teaser, not the real product, and it's a concept artifact).

PageHeader: "Diagnóstico" + subtitle "Tu trayectoria financiera en 10 años".

Main grid:
- Top row (2 columns): EvolucionChart (line, full-width spanning 2/3 of row) + donut AssetAllocationChart (1/3).
- Middle row (full width): CashflowChart (bar).
- Bottom row (full width): EscenarioTable — 3 columns (Optimista / Base / Pesimista) × several rows (patrimonio en 10 años, primera jubilación, compra vivienda, cobertura contingencia).

Each chart in a Card with subtle hover elevation (`hover-lift`). Hover over a chart reveals a faint data-point highlight if the charts primitive supports it; otherwise no hover interaction.

Fake realistic data — numbers that survive scrutiny from financially literate stakeholders. E.g., patrimonio projection from €120k today → €480k optimistic / €320k base / €210k pessimistic at 10 years.

## Fake data

`apps/awm-propuestas/src/assets/data/diagnostico.json`:

```ts
interface DiagnosticoView {
  evolucion: Array<{ year: number; optimista: number; base: number; pesimista: number }>;
  cashflow: Array<{ year: number; income: number; expense: number; net: number }>;
  assetAllocation: Array<{ class: string; percentage: number; color: string }>;
  escenarios: {
    columns: ['Optimista', 'Base', 'Pesimista'];
    rows: Array<{ label: string; values: [string, string, string] }>;
  };
}
```

Seed with realistic 10-year projections.

## Behavior requirements

1. Route loads → renders all 4 visualizations from fake data.
2. No interactions beyond hover microinteractions (fully static in that sense).
3. "← Volver al demo" ghost button top-left (routes back to `/propuestas/:id/enviado` — lets the gestor bounce back to the Propuestas flow during the pitch walkthrough).
4. A subtle "Concepto — generado en 4 días" footer badge (the "speed moment" from the demo script — **this is the one page the badge is most on-brand**).

## Golden-flow instrumentation

- `teaser.diagnostico.viewed` — fires on route entry.
- `teaser.diagnostico.volver-clicked` — on back button.

These aren't golden-flow steps (teaser isn't the flow) — they're pitch-specific events for the case study.

## File structure

```
apps/awm-propuestas/src/app/teaser-diagnostico/
├── teaser-diagnostico.component.ts
├── teaser-diagnostico.component.spec.ts
└── diagnostico-data.service.ts
```

## Pre-flight

Shared `_pre-flight.md`. Plus:

- Charts render with Coherence typography tokens (tabular figures, serif headings if any).
- Color palette: use `semantic/data-viz.json` tokens only — never hardcode chart colors.
- On a 1440px viewport, the layout holds without horizontal scroll.
- Fallback SVG placeholders (if Charts primitive isn't ready) pass the `prefers-reduced-motion` check — no gratuitous animation.

## Out-of-scope

- Real projection math.
- Scenario input parameters (the panel you'd need to edit the diagnosis inputs is post-concept).
- Wealth Planner's other surfaces (planificador de vida, retirement calculator, etc.).
- Multi-client / household modeling.

## What success looks like

- `/teaser/diagnostico` opens to a clean 4-viz layout — line + donut + bar + table — visibly rendered from real Coherence tokens (same type, same motion, same color discipline as Propuestas).
- The "Concepto — generado en 4 días" badge is visible.
- The back button returns to `/propuestas/:id/enviado` so the demo can return to the main flow.
- Stakeholders see this screen and think: "This is the same DS. If it works here, it works for Wealth Planner."

## If stuck

- If the Charts primitive is only partially built, prioritize the line chart (EvolucionChart) — it's the single most visually-convincing placeholder for the pitch. Donut and bar can be static SVG for Tuesday.
- If the data-viz palette doesn't have enough distinct colors for the 4 asset classes, escalate as a Token Guardian gap — do not invent colors.
- If a timeline squeeze happens, cut CashflowChart first (it's the least-remarkable of the three); keep EvolucionChart + AssetAllocationChart + EscenarioTable.
