# Build — Coherence Table primitive (`libs/ui/table/`)

**Source:** `docs/plan.md`
**Surface:** interactive data table. Notion + Stripe reference behavior. The v1 stress test for the DS — if Table ships clean, the DS earns credibility.
**Prereqs:** scaffolding + tokens + Button + Checkbox + Drawer (Table composes all three heavily).

## Scope

One primitive, `<afi-table>`, + its supporting column / cell directives. Covers: sortable columns, row selection (single + multi + indeterminate header), empty state, loading state, horizontal scroll when forced, compact 36px row default.

**Not in scope:** virtualization (v1.1 — composes Angular CDK Virtual Scroll when row count warrants), column resize (v2), column hide/show UI (v2; the API supports hidden columns but no user UI yet), inline cell editing (v2; AWM uses the inline-edit row expansion pattern, handled by a composed surface, not by Table itself).

## Required reads

1. `docs/clean-code.md`
2. `docs/accessibility.md` — Table section (scope, aria-sort, selection)
3. `docs/component-skill.md`
4. `docs/token-skill.md` — Surface bucket (row hover, selection), border hairline for dividers
5. `docs/plan.md` — Notion + Stripe reference locks; 36px row default; horizontal scroll only when forced
6. `docs/build-prompts/coherence-checkbox.md` — row selection uses Checkbox with `indeterminate`
7. `docs/build-prompts/coherence-drawer.md` — row detail opens Drawer

## When to use

- Tabular data with > 2 columns and > 3 rows
- Bulk operations (selection + mass action)
- Sortable / filterable data display
- The AWM Import "Datos Entrantes" surface

## When NOT to use

- Single-entity display (≤ 1 row) → `<afi-card>` with labeled fields
- Key-value display (no multi-row) → Description list pattern (future primitive)
- Image gallery → Grid layout (not a Table)
- Very small lists (< 4 rows, < 3 cols) → simple HTML or Card list

## Composition patterns

- **Standard data table:** columns for identity + status + date + actions. Checkbox column first when bulk ops enabled.
- **Row-detail drawer:** click row → opens `<afi-drawer>` with the row's full data.
- **With filters above:** `<afi-select>` + `<afi-input>` in a filter bar that updates `rows` via consumer logic.
- **With bulk-action toolbar:** when selection count > 0, render a Button toolbar above the Table with `Importar`, `Ignorar`, `Eliminar`.
- **With status Badge in cells:** Badge primitive used inline in a "status" column; color maps to System bucket.
- **With LoadingOverlay:** wrap the Table in LoadingOverlay during fetch; use the `quiet-spinner` variant in consumer products.

## API

```ts
<afi-table
  [columns]="columns"
  [rows]="rows"
  [(selected)]="selectedRows"
  [sortBy]="sort"
  (sortChange)="sort = $event"
  [loading]="isFetching"
  [emptyText]="'No hay datos entrantes pendientes.'"
  (rowClicked)="openDrawer($event)"
>
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `columns` | `Array<TableColumn>` | `[]` | See type below |
| `rows` | `Array<Row>` | `[]` | Row = any record; row id via `trackByKey` input |
| `trackByKey` | `string` | `'id'` | Field to track identity |
| `selected` | `Array<Row>` | `[]` | Two-way via `selectedChange` |
| `selectable` | `boolean` | `false` | When true, renders checkbox column first |
| `sortBy` | `{ column: string; direction: 'asc' \| 'desc' } \| null` | `null` | Single-column sort for v1 |
| `loading` | `boolean` | `false` | Renders LoadingOverlay + skeleton rows |
| `emptyText` | `string` | `'Sin datos'` | Rendered when `rows` is empty and not loading |
| `rowHoverable` | `boolean` | `true` | Hover state on rows |
| `density` | `'compact' \| 'comfortable'` | `'compact'` | compact = 36px row (default), comfortable = 48px |

**Outputs:**

```ts
selectedChange = output<Array<Row>>();
sortChange     = output<{ column: string; direction: 'asc' | 'desc' } | null>();
rowClicked     = output<{ row: Row; event: MouseEvent }>();
```

**Types:**

```ts
export interface TableColumn<Row = unknown> {
  key: string;                          // matches Row field OR synthetic for computed/action columns
  label: string;                        // header text (Spanish, RAE)
  sortable?: boolean;
  align?: 'start' | 'center' | 'end';   // end for numeric
  width?: string;                       // CSS width; default auto
  hidden?: boolean;                     // hide without removing from data (future UI)
  render?: (row: Row) => TemplateRef;   // custom cell render (Badge, Button, etc.)
}
```

## Key behavior

1. **Rendering:** `<table>` + `<thead>` + `<tbody>` semantic. Row = `<tr>`, cell = `<td>` or `<th scope="col">` for headers.
2. **Borders:** horizontal dividers only (hairline token). No external borders. No vertical dividers (column alignment carries the structure).
3. **Header:** lighter background (`surface.100`), smaller text (`type.body-sm` weight 500), sticky on vertical scroll.
4. **Rows:** 36px compact (default), 48px comfortable. Hover state uses `surface.100` overlay. Selected state uses `action.50` tint + left accent border.
5. **Horizontal scroll:** only when column content forces it. Don't set a min-width on the Table itself. Columns can set explicit widths; Table respects.
6. **Row click:** fires `rowClicked` — consumer decides (open Drawer, navigate, etc.). Suppress when click target is a Checkbox or Button (those handle themselves).
7. **Selection:** Checkbox column first. Header checkbox reflects indeterminate correctly (some selected but not all).
8. **Sort:** click header toggles asc → desc → null (cycle). Emit `sortChange`; consumer re-sorts and passes fresh `rows`. Table does NOT sort internally.
9. **Empty state:** full-width row showing `emptyText` + optional CTA slot (future).
10. **Loading state:** overlay + skeleton rows (3–5 rows of shimmering gray placeholders).

## Accessibility

Per `accessibility.md` Table section. Primitive-specific:

- `<table>` + `<thead>` + `<th scope="col">` + `<tbody>` + `<tr>` / `<td>` — semantic structure, not divs-with-roles.
- `aria-sort="ascending" | "descending" | "none"` on sortable `<th>`.
- Row-selection Checkbox has `aria-label` referencing row identity (consumer provides via Column render or default to the first column's value).
- Empty state announced: `<tr role="row" aria-live="polite">`.
- Loading state announced: `aria-busy="true"` on `<tbody>`.

## File structure

```
libs/ui/table/
├── table.component.ts
├── table.types.ts                # TableColumn + related
├── table.variants.ts
├── table-cell.directive.ts       # for custom cell render via TemplateRef
├── table.component.spec.ts
└── index.ts
```

## Copy (hardcoded)

- Default empty text: `Sin datos`  (RAE)
- Loading announcement: `Cargando`  (used via `aria-busy` + SR string)
- Sort direction aria: `ascending` / `descending` / `none` (ARIA spec; not translated)

Consumer overrides `emptyText` per context: `No hay datos entrantes pendientes.` for AWM Import.

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `table`.

Table-specific additions:
- Semantic HTML: `<table>` / `<thead>` / `<tbody>` present; no `role="grid"` hacks.
- `aria-sort` updates on header click.
- Indeterminate header checkbox behaves correctly with partial selection.
- Row `rowClicked` suppresses when click target is interactive (Checkbox, Button within row).
- No horizontal scroll with default data; horizontal scroll only when columns force it.
- Loading state renders skeleton + sets `aria-busy`.

## What success looks like

- AWM Import: 6-column Table (checkbox, provider value, interpretation, AWM value, final value, status). 36px rows. Click row → Drawer opens with row detail.
- Header checkbox: half-filled when 3 of 10 rows selected; aria-label `Seleccionar todas las filas`.
- Sort on "status" column: cycles through En revisión → Listo para importar → Error visually (via consumer re-sort).
- Empty state shows `No hay datos entrantes pendientes.` with optional CTA "Conecte un proveedor."

## If stuck

- Don't reach for `<afi-cdk-table>` or `<mat-table>`. Build on plain semantic HTML + Tailwind.
- Virtualization is v1.1 — until then, consumers pass reasonable-sized datasets (< 500 rows). Document this in the component docstring.
- Custom cell render via `TemplateRef` — `table-cell.directive.ts` accepts a `<ng-template afiTableCell>` from the consumer.
- Column alignment: `text-align` on `<th>` and `<td>` per column's `align`. Don't use flex; break the table model.
