# AWP 2026 — Objetivos · Brief G: Desinversiones futuras (list + detail)

**Status:** ✅ complete — landed on `main` in `<this commit>`
**Branch:** `feature/awp-objetivos-desinversiones-futuras` → merged + deleted
**Created:** 2026-05-25
**Completed:** 2026-05-26
**Plan reference:** [`/Users/richardgriner/.claude/plans/okay-we-are-going-ethereal-wilkinson.md`](../../.claude/plans/okay-we-are-going-ethereal-wilkinson.md) — Objetivos addendum

## Completion notes (2026-05-26)

- **List page** at [`apps/site/src/app/pages/demos/desinversiones-futuras/desinversiones-futuras.page.{ts,html,scss}`](../../apps/site/src/app/pages/demos/desinversiones-futuras/desinversiones-futuras.page.ts) — empty state + table with Nombre / Objetivo / Importe bruto / Importe neto / row actions. Row click routes to detail via `[routerLink]`. The "+ Añadir desinversión" CTA creates a new row in the store and navigates straight to its detail page (no inline add modal — same Sociedades pattern).
- **Detail page** at [`apps/site/src/app/pages/demos/desinversiones-futuras/desinversion-detail.page.{ts,html,scss}`](../../apps/site/src/app/pages/demos/desinversiones-futuras/desinversion-detail.page.ts) — full-page edit (not a modal, per Borja 2026-02-27). Reads `:id` via `ActivatedRoute.paramMap` as a signal, finds the matching row in the store, and binds every field through `setNombre / setObjetivo / setFrecuencia / setPlazoAnios`. The Frecuencia + Plazo controls only render when `objetivo === 'rentas'`.
- **Sortable asset table** — first real consumer of `afi-table`'s sort. `sortBy` lives as a local `signal<TableSortState | null>` on the page; `sortedAssetRows()` is a computed that takes the asset rows + the current sort and returns a fresh array (numeric columns use numeric compare, the rest use Spanish locale string compare). Third click on a sortable header emits `null` which clears the sort.
- **Dynamic columns** — `assetColumns()` computed swaps between 3 base columns (Tipo / Cuenta / Nombre), the **liquidez** set (+ Patrimonio esperado 2027 / Después de impuestos / Coste fiscal), and the **rentas** set (+ Patrimonio esperado 2027 / Renta mensual bruta / Renta mensual neta / Coste fiscal). Verified live: changing the dropdown swaps the column set instantly.
- **Asset value mocks** — `enrich(asset)` computes values from `patrimonio.valor`: `+5%` for the 2027 projection, `−10%` for fiscal cost, `4% / 12` for monthly gross renta, `−15%` retention for net. Real values are Diagnóstico/backend territory, recorded in the open-decisions list.
- **Selection** — `[selected]` bound to `selectedAssetRows()` (filters asset rows by the row's `activosAsignados`); `onAssetSelectionChange` maps the table's selectedChange output back to the store. Verified: row-level border accent shows up for the seeded `Apartamento en Cádiz` on first load.
- **Store** — `DesinversionObjetivo` type, `DesinversionFutura` interface, `desinversiones` signal seeded with the two PDF p.5 examples (Venta vivienda Cádiz · liquidez · 280k bruto / 247.8k neto; Venta cartera Renta 4 · rentas · mensual · 5 años · 62.3k bruto / 51.8k neto), `desinversionesState` computed (empty / in-progress only — section is optional, never reaches complete), plus `addDesinversion` / `updateDesinversion` / `removeDesinversion` / `toggleActivoAsignado`.
- **Routes** — list + detail (`:id`) both registered in [`demos.routes.ts`](../../apps/site/src/app/pages/demos/demos.routes.ts).
- **Sidebar** — `desinversiones-futuras` entry now reads `store.desinversionesState()` with a real `route` field, replacing the hardcoded `'empty'` placeholder.
- **Not-found state** — if the `:id` doesn't match any row (e.g. deleted then deep-linked back), the page shows a "Desinversión no encontrada" card with a "Volver al listado" CTA.
- **Section 2 (Detalles de la simulación)** — parked as a `dd-placeholder` card with copy explaining it will reuse the Evolución patrimonial pattern per PDF p.6. Confirmed with the brief: waits on Jaime input.
- **Layout deviation, same as Brief F (RESOLVED 2026-05-26):** the `+ Añadir desinversión` and `← Volver al listado` buttons briefly lived in body-level toolbars (`.df-toolbar` / `.dd-toolbar`) because the old shell-wrapped `<afi-page-header>` dropped projected `slot="actions"` content. **Brief 0 (shell refactor) resolved this**: both the list page's `+ Añadir desinversión` and the detail page's `← Volver al listado` now live in the page-header's actions slot directly. Both toolbar SCSS rules deleted. See [`docs/session-briefs/2026-05-26-awp-chore-shell-refactor-header-slot.md`](2026-05-26-awp-chore-shell-refactor-header-slot.md).
- Console clean, no compile errors. Verified live at 1440 wide: list → click row → detail → switch objetivo → sortable headers (asc/desc/clear) → selection persists → "Volver" returns to list.

---

## What this session ships

The largest of the 4 Objetivos pages: **Desinversiones futuras**. Two routes:
1. **List page** at `/demos/wealth-planner-2026/desinversiones-futuras` — table of planned divestments + add button + per-row edit/delete
2. **Detail / edit page** at `/demos/wealth-planner-2026/desinversiones-futuras/:id` — full-page edit (NOT a modal — this is the "Simulación" pattern per Borja Feb 27). Contains: Objetivo y patrimonio asignado section (with sortable asset-selection table) + Detalles section (parked TODO pending Jaime).

This brief introduces the **first real `<afi-table>` sort consumer** in the codebase.

## Pre-flight reads

Same six as Brief E, plus:
7. [`libs/ui/src/table/table.types.ts`](libs/ui/src/table/table.types.ts) — `TableColumn`, `TableSortState` shapes
8. [`libs/ui/src/table/table.component.ts`](libs/ui/src/table/table.component.ts) — `sortBy` input + `sortChange` output
9. [`apps/site/src/app/pages/demos/evolucion-patrimonial/evolucion-patrimonial-proposal.page.{ts,html}`](apps/site/src/app/pages/demos/evolucion-patrimonial/) — the "Simulación" reference for the Detalles section (you'll strip + reuse part of this)
10. [`apps/site/src/app/pages/demos/sociedades/sociedades.page.{ts,html}`](apps/site/src/app/pages/demos/sociedades/) — list+modal pattern (for the list page)

## Sources of truth

- **Figma:** node `32:275620` ("↳ Desinversiones futuras"). PDF p.5 also references a separate Figma file "Mutua—Contigo-360" for the detail page — do NOT chase that link; mirror the locked structure below.
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) pp.5–6.
- **Granola:** sessions 2026-02-26 + 2026-02-27 + 2026-03-05 (especially Borja's sortability quote: *"cuando tú vendes, vas a querer ordenar"*).

## Chrome wrapping (LOCKED — every demo page)

Both routes (list + detail) wrap in `<site-demo-shell>`. List page passes `views: ['Desinversiones futuras']`, detail passes `views: ['Detalle de desinversión']` (or similar).

## List page composition

```
<site-demo-shell …>
  <div class="h-screen flex bg-canvas-base overflow-hidden">
    <site-planner-sidebar activeKey="desinversiones-futuras" />
    <div class="flex-1 flex flex-col min-w-0">
      <site-planner-top-bar … />
      @if (store.legadoRetiroEstablished()) { <site-objetivos-banner /> }
      <main>
        <afi-page-header
          title="Desinversiones futuras"
          subtitle="Plan de venta o retirada de activos en el futuro (opcional)."
        >
          <span slot="breadcrumb">OBJETIVOS</span>
          <afi-button slot="actions" variant="primary" size="sm" (clicked)="openAdd()">+ Añadir desinversión</afi-button>
        </afi-page-header>
        <site-version-toggle … />

        @if (store.desinversiones().length === 0) {
          <!-- Empty state — same shape as Sociedades empty -->
        } @else {
          <table class="df-list">
            <thead><tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th class="df-list__th--num">Importe bruto</th>
              <th class="df-list__th--num">Importe neto</th>
              <th class="df-list__th--actions"><span class="sr-only">Acciones</span></th>
            </tr></thead>
            <tbody>
              @for (d of store.desinversiones(); track d.id) {
                <tr [routerLink]="['/demos/wealth-planner-2026/desinversiones-futuras', d.id]">
                  <td>{{ d.nombre || 'Sin nombre' }}</td>
                  <td>{{ objetivoLabel(d.objetivo) }}</td>
                  <td class="df-list__td--num">{{ formatEuro(d.importeBruto) }}</td>
                  <td class="df-list__td--num">{{ formatEuro(d.importeNeto) }}</td>
                  <td class="df-list__td--actions">
                    <afi-icon-button variant="ghost" ariaLabel="Editar" [routerLink]="['./', d.id]">…</afi-icon-button>
                    <afi-icon-button variant="destruction" ariaLabel="Borrar" (clicked)="removeRow(d.id, $event.event)">…</afi-icon-button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </main>
    </div>
  </div>
</site-demo-shell>
```

The "Add" button creates a new (empty) Desinversión in the store and routes to the detail page for that id — same pattern as Sociedades' inline-add. No add-modal on this page.

## Detail page composition

```
<site-demo-shell …>
  <div class="h-screen flex bg-canvas-base overflow-hidden">
    <site-planner-sidebar activeKey="desinversiones-futuras" />
    <div class="flex-1 flex flex-col min-w-0">
      <site-planner-top-bar … />
      @if (store.legadoRetiroEstablished()) { <site-objetivos-banner /> }
      <main>
        <afi-page-header
          [title]="currentDesinversion()?.nombre || 'Nueva desinversión'"
          subtitle="Define qué se vende, con qué objetivo y qué activos se asignan."
        >
          <span slot="breadcrumb">
            OBJETIVOS · <a routerLink="/demos/wealth-planner-2026/desinversiones-futuras">Desinversiones futuras</a>
          </span>
          <afi-button slot="actions" variant="ghost" routerLink="/demos/wealth-planner-2026/desinversiones-futuras">← Volver</afi-button>
        </afi-page-header>
        <site-version-toggle … />

        <!-- ─── Section 1: Objetivo y patrimonio asignado ─────────────── -->
        <section class="dd-section">
          <header><h2>OBJETIVO Y PATRIMONIO ASIGNADO</h2></header>
          <div class="dd-form-row">
            <afi-input label="Nombre de la desinversión" [value]="…" />
            <afi-select label="Objetivo" [options]="objetivoOptions" [value]="…" />
          </div>
          @if (currentDesinversion()?.objetivo === 'rentas') {
            <div class="dd-form-row">
              <afi-select label="Frecuencia de las rentas" [options]="frecuenciaOptions" />
              <afi-input label="Plazo de las rentas (años)" type="number" />
            </div>
          }

          <!-- Sortable asset-selection table -->
          <h3>Activos asignados</h3>
          <afi-table
            [columns]="assetColumns()"
            [rows]="sortedAssetRows()"
            [sortBy]="sortBy()"
            (sortChange)="sortBy.set($event)"
            [selectable]="true"
            [selected]="selectedAssetRows()"
            (selectedChange)="onAssetSelectionChange($event)"
            density="compact"
          />
        </section>

        <!-- ─── Section 2: Detalles (Simulación) — TODO ────────────────── -->
        <section class="dd-section">
          <header><h2>DETALLES</h2></header>
          <!-- TODO: reuse evolucion-patrimonial Simulación pattern, stripped per PDF p.6:
               quitando toda la parte de la izquierda, el cuadro de renta alcanzada / esperada,
               y metiendo los detalles del plan de desinversión.
               needs Jaime input — park as TODO. -->
          <div class="dd-detalles-placeholder">
            <p>Detalles de la simulación — pendiente de definir (Jaime).</p>
          </div>
        </section>
      </main>
    </div>
  </div>
</site-demo-shell>
```

## Data — Objetivo + Frecuencia options

```ts
readonly objetivoOptions: SelectOption[] = [
  { value: 'liquidez', label: 'Generar liquidez' },
  { value: 'rentas',   label: 'Generar rentas' },
];

readonly frecuenciaOptions: SelectOption[] = [
  { value: 'mensual',     label: 'Mensual' },
  { value: 'trimestral',  label: 'Trimestral' },
  { value: 'semestral',   label: 'Semestral' },
  { value: 'anual',       label: 'Anual' },
];
```

## Sortable asset table — columns

Per PDF p.5–6. Common columns always shown; conditional columns added based on `objetivo`:

```ts
readonly assetColumns = computed<TableColumn[]>(() => {
  const common: TableColumn[] = [
    { key: 'tipo',   label: 'Tipo de activo', sortable: true },
    { key: 'cuenta', label: 'Cuenta',          sortable: true },
    { key: 'nombre', label: 'Nombre',          sortable: true },
  ];
  const objetivo = this.currentDesinversion()?.objetivo;
  if (objetivo === 'liquidez') {
    return [
      ...common,
      { key: 'patrimonioEsperado2027',   label: 'Patrimonio esperado 2027',   sortable: true, align: 'end' },
      { key: 'patrimonioDespuesImpuestos', label: 'Después de impuestos',     sortable: true, align: 'end' },
      { key: 'costeFiscal',              label: 'Coste fiscal',               sortable: true, align: 'end' },
    ];
  }
  if (objetivo === 'rentas') {
    return [
      ...common,
      { key: 'patrimonioEsperado2027', label: 'Patrimonio esperado 2027', sortable: true, align: 'end' },
      { key: 'rentaMensualBruta',      label: 'Renta mensual bruta',      sortable: true, align: 'end' },
      { key: 'rentaMensualNeta',       label: 'Renta mensual neta',       sortable: true, align: 'end' },
      { key: 'costeFiscal',            label: 'Coste fiscal',             sortable: true, align: 'end' },
    ];
  }
  return common;
});
```

`sortedAssetRows()` computed sorts `store.patrimonio()` rows (or a stub if Brief C hasn't shipped) by the current `sortBy()` signal. PDF examples: 8.000 € (patrimonio después de impuestos), 2.000 € (renta mensual bruta), 1.700 € (renta mensual neta). Mock these inline per asset id; real-data integration is out of scope.

## Store extensions

```ts
export type DesinversionObjetivo = 'liquidez' | 'rentas';

export interface DesinversionFutura {
  id: string;
  nombre: string;
  objetivo: DesinversionObjetivo | null;
  frecuencia: Frecuencia | null;
  plazoAnios: number | null;
  /** asset ids selected for this desinversion */
  activosAsignados: string[];
  importeBruto: number;
  importeNeto: number;
}

readonly desinversiones = signal<DesinversionFutura[]>([
  // PDF p.5 seed examples — keep for demo
  {
    id: 'desinv-seed-1',
    nombre: 'Venta vivienda Cádiz',
    objetivo: 'liquidez',
    frecuencia: null,
    plazoAnios: null,
    activosAsignados: ['inmobiliario-cadiz'],
    importeBruto: 420000,
    importeNeto: 372324,
  },
  {
    id: 'desinv-seed-2',
    nombre: 'Venta fondos mixtos',
    objetivo: 'rentas',
    frecuencia: 'mensual',
    plazoAnios: 5,
    activosAsignados: ['fondos-mixtos'],
    importeBruto: 300000,
    importeNeto: 1500,  // monthly net per PDF
  },
]);

readonly desinversionesState = computed<SectionState>(() =>
  this.desinversiones().length === 0 ? 'empty' : 'in-progress',
);

addDesinversion(): DesinversionFutura { ... }
updateDesinversion(id: string, partial: Partial<DesinversionFutura>): void { ... }
removeDesinversion(id: string): void { ... }
toggleActivoAsignado(desinversionId: string, activoId: string): void { ... }
```

## Routes (2 new)

```ts
{
  path: 'wealth-planner-2026/desinversiones-futuras',
  loadComponent: () => import('./desinversiones-futuras/desinversiones-futuras.page').then((m) => m.DesinversionesFuturasPage),
},
{
  path: 'wealth-planner-2026/desinversiones-futuras/:id',
  loadComponent: () => import('./desinversiones-futuras/desinversion-detail.page').then((m) => m.DesinversionDetailPage),
},
```

## Open work — execution order

1. **Store extensions** — types + signal + CRUD + state computed. Seed both PDF examples.
2. **List page** (3 files) — table + empty state + add button (creates new + navigates to detail).
3. **Detail page** (3 files) — full-page edit with two sections. Sortable asset table is the centerpiece.
4. **Routes** (both list + detail).
5. **Sidebar wire** — `desinversiones-futuras` route + state computed.
6. **Mock asset values** — define a per-asset-id map for `patrimonioEsperado2027`, `costeFiscal`, `rentaMensualBruta`, `rentaMensualNeta`. Park real-data integration.

## Verification

Standard 5-point check, plus:
- List page: clicking a row routes to detail with the right id
- Detail page: changing Objetivo dropdown swaps the asset table's columns dynamically
- Sortable column headers — clicking sorts ascending, clicking again descending, third click clears (`sortChange` emits `null`)
- Selected assets sum to the row's importe (verify mocked sums make sense)
- "← Volver" link routes back to list
- Sidebar chip flips `empty` → `in-progress` on first add

## Decisions still open

- **Real asset data** — currently mocked per asset id. Real integration is Diagnóstico/backend territory; flag in PR.
- **Detalles (simulación) reuse** — needs Jaime input per PDF p.6. Park as a stub.
- **importeBruto / importeNeto** — should these be computed from selected assets + fiscal cost, or stored as user-entered? Default v1: computed from selected assets via a helper; expose as readonly cells.
- **Asset-table empty state** — if no assets selected yet, show a "Selecciona los activos a desinvertir" hint instead of an empty table. Confirm.

## Exit criteria

- [ ] List page routes + renders empty + populated states
- [ ] Detail page routes via `:id` param + reads / writes the right desinversion
- [ ] Two sections render; second is parked TODO
- [ ] Sortable asset table works — clicking headers updates sort
- [ ] Dynamic columns: liquidez vs rentas changes column set
- [ ] Both PDF seed examples render correctly on first load
- [ ] Banner appears (when Legado y retiro is established)
- [ ] Sidebar Desinversiones chip + route wired
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] PR notes the Detalles TODO + asset-mock open question
