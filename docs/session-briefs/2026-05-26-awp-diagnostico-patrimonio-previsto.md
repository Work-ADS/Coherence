# AWP 2026 — Diagnóstico · Brief I: Patrimonio previsto

**Status:** parked, awaits user "go" — **blocked by Brief E** (banner) AND Deliverable 0 ([shell refactor](2026-05-26-awp-chore-shell-refactor-header-slot.md))
**Branch:** `feature/awp-diagnostico-patrimonio-previsto` (to be created)
**Created:** 2026-05-26
**Activates:** first of the Diagnóstico chunk (Brief I → J)
**Plan reference:** [`/Users/richardgriner/.claude/plans/add-the-flow-to-robust-cherny.md`](../../.claude/plans/add-the-flow-to-robust-cherny.md) — Deliverable 2

---

## What this session ships

The first of two Diagnóstico pages: **Patrimonio previsto** at `/demos/wealth-planner-2026/patrimonio-previsto`. Read-only Diagnóstico output. Three pieces:

1. **Evolución patrimonial prevista** — hero line chart, 4 scenario series (Objetivo / Optimista / Medio / Pesimista) from current year through edad de seguridad, with markers at vital milestones (edad de retiro, hijos cumplen 18, etc.)
2. **Scenario read-out table** — 4 rows × 3 cols. Per-scenario values for `Cobertura vital`, `Legado inmobiliario`, `Legado financiero`. PDF p.7-8 mock values used as seed.
3. **Liquidez cashflow chart** — bar chart of net annual cashflows + total patrimony overlay.

This brief introduces the shared `Scenario` type used by Briefs J / K / L too.

## Pre-flight reads

1. [`docs/strategy/plan.md`](../../docs/strategy/plan.md) line 49 (Diagnóstico chart trio) + line 641 (9-screen map)
2. [`docs/rules/component-skill.md`](../../docs/rules/component-skill.md) and [`docs/rules/token-skill.md`](../../docs/rules/token-skill.md)
3. Reference chart wiring: [`apps/site/src/app/pages/demos/evolucion-patrimonial/`](../../apps/site/src/app/pages/demos/evolucion-patrimonial/) (`EvolucionBarChartComponent`) and [`apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.ts`](../../apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.ts) (afi-animated-chart)
4. DS chart primitives: [`libs/ui/src/chart-line/`](../../libs/ui/src/chart-line/) for evolution, [`libs/ui/src/chart-bar/`](../../libs/ui/src/chart-bar/) for cashflow
5. The shell (post-refactor): [`apps/site/src/app/pages/demos/wealth-planner-2026/shared/objetivos-page-shell.component.ts`](../../apps/site/src/app/pages/demos/wealth-planner-2026/shared/objetivos-page-shell.component.ts)
6. The banner: [`apps/site/src/app/pages/demos/wealth-planner-2026/shared/objetivos-banner.component.ts`](../../apps/site/src/app/pages/demos/wealth-planner-2026/shared/objetivos-banner.component.ts)

## Sources of truth

- **Figma:** TBD — pull the Diagnóstico node from file `888lN7vbJSc4gLYt7nP3DW` before activation (likely under "Diagnóstico" frame).
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) pp. 7–8 — "Patrimonio previsto" section.
- **Granola:** sessions 2026-02-26 + 2026-02-27 (Diagnóstico chart trio discussion).

## Chrome wrapping

Reuses the shared [`<site-objetivos-page-shell>`](../../apps/site/src/app/pages/demos/wealth-planner-2026/shared/objetivos-page-shell.component.ts) (post Deliverable 0 refactor). Pass `breadcrumb="DIAGNÓSTICO"` on the inline page-header. Banner continues to mount on `store.legadoRetiroEstablished()` — the gestor sees scenario context across Objetivos + Diagnóstico + Plan.

## Page composition (locked)

```html
<site-objetivos-page-shell
  [views]="['Patrimonio previsto']"
  demoSlug="patrimonio-previsto"
  demoRoute="/demos/wealth-planner-2026/patrimonio-previsto"
  activeKey="patrimonio-previsto"
  [showBanner]="store.legadoRetiroEstablished()"
>
  <afi-page-header
    title="Patrimonio previsto"
    subtitle="Proyección del patrimonio bajo cuatro escenarios. Marca cobertura vital y legado por escenario."
    [sticky]="false" [scrollFade]="false"
  >
    <span slot="breadcrumb">DIAGNÓSTICO</span>
  </afi-page-header>

  <!-- ─── 1. Evolución patrimonial prevista (hero chart) ─────────── -->
  <section class="pp-section">
    <header class="pp-section__head">
      <h2 class="pp-section__title">Evolución patrimonial prevista</h2>
      <p class="pp-section__hint">Proyección anual desde {{ anioActual }} hasta {{ anioSeguridad }}.</p>
    </header>
    <afi-chart-line
      [series]="evolucionSeries()"
      [markers]="vitalMarkers()"
      ariaLabel="Evolución del patrimonio por escenario"
    />
  </section>

  <!-- ─── 2. Scenario read-out table ─────────────────────────────── -->
  <section class="pp-section">
    <header class="pp-section__head">
      <h2 class="pp-section__title">Por escenario</h2>
    </header>
    <afi-table
      [columns]="scenarioColumns"
      [rows]="store.patrimonioPrevisto()"
      density="comfortable"
      [rowHoverable]="false"
    />
  </section>

  <!-- ─── 3. Liquidez cashflow ───────────────────────────────────── -->
  <section class="pp-section">
    <header class="pp-section__head">
      <h2 class="pp-section__title">Liquidez</h2>
      <p class="pp-section__hint">Cashflows netos anuales y evolución del patrimonio total.</p>
    </header>
    <afi-chart-bar [series]="liquidezSeries()" ariaLabel="Liquidez anual" />
  </section>
</site-objetivos-page-shell>
```

## Store extensions (foundational — used by Briefs J / K / L too)

```ts
// Shared scenario type — used across all Diagnóstico + Plan pages
export type Scenario = 'objetivo' | 'optimista' | 'medio' | 'pesimista';

export interface ScenarioRow {
  scenario: Scenario;
  coberturaVital: number;         // € — años cubiertos × gasto anual estimado
  legadoInmobiliario: number;     // €
  legadoFinanciero: number;       // €
}

// Seeded from PDF p.7-8 examples
readonly patrimonioPrevisto = signal<ScenarioRow[]>([
  { scenario: 'objetivo',   coberturaVital: 3_020_000, legadoInmobiliario: 1_520_000, legadoFinanciero: 0 },
  { scenario: 'optimista',  coberturaVital: 4_120_000, legadoInmobiliario: 1_930_000, legadoFinanciero: 0 },
  { scenario: 'medio',      coberturaVital: 2_730_000, legadoInmobiliario: 1_220_000, legadoFinanciero: 0 },
  { scenario: 'pesimista',  coberturaVital: 1_030_000, legadoInmobiliario:         0, legadoFinanciero: 0 },
]);

readonly patrimonioPrevistoState = computed<SectionState>(() => 'complete');
```

Plus the chart-series builders (live in the page, not the store, since they're pure transforms):

```ts
// On the page:
readonly evolucionSeries = computed<ChartLineSeries[]>(() => /* derive from scenario × year */);
readonly vitalMarkers   = computed<ChartMarker[]>(() => /* edad de retiro, edad de seguridad */);
readonly liquidezSeries = computed<ChartBarSeries[]>(() => /* net cashflows year-over-year */);
```

Mock data inline for v1; real simulation engine is Conclusiones territory.

## Sidebar wiring

Replace the hardcoded `'empty'` for `patrimonio-previsto` in [`planner-sidebar.component.ts`](../../apps/site/src/app/pages/demos/shared/planner-sidebar.component.ts):

```ts
{
  key: 'patrimonio-previsto',
  label: 'Patrimonio previsto',
  state: this.store.patrimonioPrevistoState(),
  route: '/demos/wealth-planner-2026/patrimonio-previsto',
},
```

## Routes

```ts
{
  path: 'wealth-planner-2026/patrimonio-previsto',
  loadComponent: () =>
    import('./patrimonio-previsto/patrimonio-previsto.page').then(
      (m) => m.PatrimonioPrevistoPage,
    ),
},
```

## Open work — execution order

1. **Shared Scenario type** — add to store before the slice. Briefs J/K/L will import it.
2. **Patrimonio previsto slice** — type, signal, computed state.
3. **Page (3 files)** — chrome + 3 sections. Chart series computed inline.
4. **Route registered**.
5. **Sidebar wired**.
6. **Mock data** — seed both `patrimonioPrevisto` and the in-page chart computeds with PDF values.

## Verification

Standard 5-point check, plus:
- Navigate from sidebar → page renders all 3 sections
- Hero line chart shows 4 distinct series with legend chips matching scenario colors
- Table renders 4 rows × 3 cols with right-aligned numeric cells (€-formatted)
- Liquidez bar chart renders without overflowing the section
- Sidebar chip shows `complete` immediately (it's a read-only Diagnóstico output)
- Banner mounts iff `legadoRetiroEstablished()` is true (toggle the gate on the Legado y retiro page to confirm)

## Decisions still open

- **Year range** — proposal: current year → `legadoRetiro().edadSeguridad`-derived horizon (default 2025→2065). Confirm with Borja.
- **Vital marker set** — proposal: edad de retiro (from store) + edad de seguridad. Add hijos cumplen 18 / 65 if requested.
- **Chart colors** — reuse the same 4-scenario palette as the banner so the gestor sees coherent color-coding across the simulator. Pick from existing semantic tokens; document the mapping in the brief's completion notes.

## Exit criteria

- [ ] `/demos/wealth-planner-2026/patrimonio-previsto` routes and renders
- [ ] Shared `Scenario` type added to store and imported by the page
- [ ] All 3 sections render with seeded PDF data
- [ ] Sidebar Patrimonio previsto chip + route wired
- [ ] Banner mounts iff Legado y retiro is established
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] PR notes the year-range + vital-marker open questions
