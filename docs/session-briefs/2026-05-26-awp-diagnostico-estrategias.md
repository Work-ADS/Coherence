# AWP 2026 — Diagnóstico · Brief J: Estrategias

**Status:** parked, awaits user "go" — **blocked by Brief I** (shared `Scenario` type)
**Branch:** `feature/awp-diagnostico-estrategias` (to be created)
**Created:** 2026-05-26
**Activates:** second of the Diagnóstico chunk (Brief I → J)
**Plan reference:** [`/Users/richardgriner/.claude/plans/add-the-flow-to-robust-cherny.md`](../../.claude/plans/add-the-flow-to-robust-cherny.md) — Deliverable 3

---

## What this session ships

The second of two Diagnóstico pages: **Estrategias** at `/demos/wealth-planner-2026/estrategias`. Read-only recommendation surface — derives "what the patrimonio needs to do" from the Objetivos + Patrimonio previsto inputs.

Four sections, all numeric read-outs (no user inputs):

1. **Rentabilidad objetivo** — small line chart + caption with "para llegar a edad de seguridad: X% rentabilidad mínima necesaria"
2. **Gasto anual máximo** — 4×4 table (4 scenarios × Total / Previo a retiro / Posterior a retiro)
3. **Ingreso anual mínimo** — table by scenario
4. **Edad de retiro mínima** — row of 4 KPI cards (one per scenario)

This brief is mostly tables — the heaviest UI is the small line chart in section 1.

## Pre-flight reads

Same six as Brief I, plus:
7. Brief I's seeded `Scenario` type and color palette decisions
8. Brief I's chart wiring for `afi-chart-line`

## Sources of truth

- **Figma:** TBD — pull from `888lN7vbJSc4gLYt7nP3DW` "Estrategias" frame before activation.
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) pp. 8–9 — "Estrategias" section. Four tabs: Rentabilidad objetivo · Gasto anual máximo · Ingreso anual mínimo · Edad de retiro mínima.
- **Screens (added 2026-05-27):** `Afi brand/Wealth manager screens 2026/daignóstico/` (folder name has a typo in the source — "daignóstico" not "diagnóstico"; don't rename):
  - `rentabilidad objetivo.png` — Rentabilidad objetivo tab (gradient probability bar)
  - `capacidad de gasto anual.png` — Gasto anual máximo tab (4×4 table)
  - `salario bruto anual objetivo.png` + `-1.png` — Ingreso anual mínimo tab variants
- **Granola:** sessions 2026-02-26 + 2026-02-27.

## Coding standards

Inherited from [chore-sidebar brief § Coding standards](2026-05-27-awp-chore-sidebar-section-5-6-split.md#coding-standards-locked-from-brief-i):

- **3-file rule** — `.ts` + `.html` + `.scss`, NO inline template / styles.
- **Reuse libs/ui primitives** — `<afi-page-header>`, `<afi-tabs>` + `<afi-tab-item>` for the 4-tab layout, `<afi-chart-line>` for the Rentabilidad objetivo gradient (or hand-rolled per the gradient design), `<afi-table>` or hand-rolled `.pp-table` (Brief I) for the comparison tables. Grep `libs/ui/src/` before authoring markup.
- **Tokens only in SCSS** — zero hex / rgb / bare px. Pre-commit hook enforces.
- **Tailwind utilities for layout** matching Brief I (`mx-space-8 mt-space-6 …`).
- **Visual anchor:** Patrimonio previsto (Brief I) — Estrategias is its read-only Diagnóstico sibling.

## Chrome wrapping

Same as Brief I — `<site-objetivos-page-shell>` with inline `<afi-page-header>` carrying `breadcrumb="DIAGNÓSTICO"`. Banner gated on `legadoRetiroEstablished()`.

## Page composition (locked)

```html
<site-objetivos-page-shell
  [views]="['Estrategias']"
  demoSlug="estrategias"
  demoRoute="/demos/wealth-planner-2026/estrategias"
  activeKey="estrategias"
  [showBanner]="store.legadoRetiroEstablished()"
>
  <afi-page-header
    title="Estrategias"
    subtitle="Lo que debe hacer el patrimonio financiero para cubrir los objetivos del cliente."
    [sticky]="false" [scrollFade]="false"
  >
    <span slot="breadcrumb">DIAGNÓSTICO</span>
  </afi-page-header>

  <!-- ─── 1. Rentabilidad objetivo ───────────────────────────────── -->
  <section class="es-section">
    <header class="es-section__head">
      <h2 class="es-section__title">Rentabilidad objetivo</h2>
      <p class="es-section__hint">
        Para llegar a los {{ store.legadoRetiro().edadSeguridad }} años, la
        rentabilidad mínima necesaria es de
        <strong>{{ rentabilidadMinima() | percent }}</strong>.
      </p>
    </header>
    <afi-chart-line [series]="rentabilidadObjetivoSeries()" />
  </section>

  <!-- ─── 2. Gasto anual máximo ──────────────────────────────────── -->
  <section class="es-section">
    <header class="es-section__head">
      <h2 class="es-section__title">Gasto anual máximo</h2>
    </header>
    <afi-table [columns]="gastoCols" [rows]="store.gastoAnualMaximo()"
      density="comfortable" [rowHoverable]="false" />
  </section>

  <!-- ─── 3. Ingreso anual mínimo ────────────────────────────────── -->
  <section class="es-section">
    <header class="es-section__head">
      <h2 class="es-section__title">Ingreso anual mínimo</h2>
    </header>
    <afi-table [columns]="ingresoCols" [rows]="store.ingresoAnualMinimo()"
      density="comfortable" [rowHoverable]="false" />
  </section>

  <!-- ─── 4. Edad de retiro mínima — KPI row ──────────────────── -->
  <section class="es-section">
    <header class="es-section__head">
      <h2 class="es-section__title">Edad de retiro mínima</h2>
    </header>
    <div class="es-kpi-row">
      @for (row of store.edadRetiroMinima(); track row.scenario) {
        <div class="es-kpi-card" [class]="'es-kpi-card--' + row.scenario">
          <span class="stat__label">{{ scenarioLabel(row.scenario) }}</span>
          <span class="stat__value">{{ row.edad }}<span class="stat__unit">años</span></span>
        </div>
      }
    </div>
  </section>
</site-objetivos-page-shell>
```

## Data — seed from PDF p.8 mock values

```ts
// Gasto anual máximo — k€
{ scenario: 'actual',     total: 125, previoRetiro: 135, posteriorRetiro: 154 },
{ scenario: 'optimista',  total: 154, previoRetiro: 172, posteriorRetiro: 140 },
{ scenario: 'medio',      total: 123, previoRetiro: 138, posteriorRetiro: 102 },
{ scenario: 'pesimista',  total:  97, previoRetiro: 125, posteriorRetiro:  67 },

// Ingreso anual mínimo — k€
{ scenario: 'actual',     optimista: 225, medio: 225, pesimista: 225 },
{ scenario: 'optimista',  optimista: 225, medio: 140, pesimista:   0 },
{ scenario: 'medio',      optimista: 225, medio: 202, pesimista:   0 },
{ scenario: 'pesimista',  optimista: 225, medio: 182, pesimista:   0 },

// Edad de retiro mínima
{ scenario: 'objetivo',   edad: 52 },
{ scenario: 'optimista',  edad: 48 },
{ scenario: 'medio',      edad: 54 },
{ scenario: 'pesimista',  edad: 64 },
```

Note: "Gasto anual máximo" and "Ingreso anual mínimo" tables include an "Actual" scenario row in addition to the standard 4 — flag this divergence from `Scenario` type during build. Options: (a) extend the type to `'actual' | Scenario`, or (b) define a separate `ScenarioWithActual` type. Default proposal: (a) — broaden the union so this stays a single concept.

## Store extensions

```ts
// Extends Brief I's shared types
export type ScenarioWithActual = Scenario | 'actual';

export interface GastoAnualMaximoRow {
  scenario: ScenarioWithActual;
  total: number;            // k€
  previoRetiro: number;     // k€
  posteriorRetiro: number;  // k€
}

export interface IngresoAnualMinimoRow {
  scenario: ScenarioWithActual;
  optimista: number;        // k€
  medio: number;            // k€
  pesimista: number;        // k€
}

export interface EdadRetiroMinimaRow {
  scenario: Scenario;
  edad: number;
}

readonly gastoAnualMaximo     = signal<GastoAnualMaximoRow[]>([... seed ...]);
readonly ingresoAnualMinimo   = signal<IngresoAnualMinimoRow[]>([... seed ...]);
readonly edadRetiroMinima     = signal<EdadRetiroMinimaRow[]>([... seed ...]);
readonly rentabilidadMinima   = computed<number>(() => 0.045); // 4.5% v1 mock

readonly estrategiasState = computed<SectionState>(() => 'complete');
```

The chart series for Rentabilidad objetivo is a simple diagonal — implement inline on the page.

## Sidebar wiring

Replace hardcoded `'empty'` for `estrategias`:

```ts
{
  key: 'estrategias',
  label: 'Estrategias',
  state: this.store.estrategiasState(),
  route: '/demos/wealth-planner-2026/estrategias',
},
```

## Routes

```ts
{
  path: 'wealth-planner-2026/estrategias',
  loadComponent: () =>
    import('./estrategias/estrategias.page').then((m) => m.EstrategiasPage),
},
```

## Open work — execution order

1. **Extend Brief I's shared types** with `ScenarioWithActual` and the 3 row interfaces.
2. **Seed signals** with the PDF k€ values.
3. **Page (3 files)** — 4 sections.
4. **KPI card pattern** — replicate `.stat__label / .stat__value / .stat__unit` scoped to this page's SCSS for now. When Brief K or a third consumer wants the same shape, extract to a primitive.
5. **Route + sidebar**.

## Verification

Standard 5-point check, plus:
- All 4 sections render with seeded data
- Rentabilidad objetivo diagonal chart renders + caption interpolates `edadSeguridad` from store
- KPI row: 4 cards visible at 1440 wide; stack to 2×2 at 768; full-stack at 375
- Edad de retiro per-card values match: Objetivo 52 · Optimista 48 · Medio 54 · Pesimista 64
- Sidebar chip shows `complete` on first load
- Banner mounts iff `legadoRetiroEstablished()` is true

## Decisions still open

- **`ScenarioWithActual` vs separate type** — broaden the union (default proposal) or keep `Scenario` clean and add a separate type. Resolve when extending the store.
- **KPI card extraction** — second use of `.stat__*` pattern in the codebase (Sarevi is first). Resolve: keep scoped or extract to `libs/ui/src/metric-card/` now? Default proposal: extract when Brief K also needs it — three consumers triggers extraction.

## Exit criteria

- [ ] `/demos/wealth-planner-2026/estrategias` routes and renders
- [ ] 4 sections render with seeded PDF data
- [ ] Shared types extended without breaking Brief I
- [ ] KPI row responsive at 1440 / 768 / 375
- [ ] Sidebar Estrategias chip + route wired
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] PR notes the `ScenarioWithActual` typing decision
