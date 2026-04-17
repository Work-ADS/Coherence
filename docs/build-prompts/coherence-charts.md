# Build — Coherence Chart primitives (`libs/ui/chart/`)

**Source:** `docs/data-viz-skill.md` (primary) + `docs/plan.md`
**Surface:** four v1 chart primitives that share axes, legend, tooltip, data-table fallback, a11y contract, color palette, motion. Visa PDS alignment. Ships last in the v1 sequence.
**Prereqs:** scaffolding + tokens + all 14 primitives (charts compose Modal for the keyboard-instructions dialog, Card for wrapping, LoadingOverlay for fetch state, Table for the data-table fallback).

## Scope

One library, `libs/ui/chart/`, with:

- Shared infrastructure: axes, legend, tooltip, data-table fallback dialog, keyboard-instructions dialog, color resolver, a11y region.
- Four chart primitives: `<afi-chart-bar>`, `<afi-chart-line>`, `<afi-chart-heatmap>`, `<afi-chart-dumbbell>`.

**Not in scope (v1.1+):** area, scatter, stacked bar, treemap, pie/donut, sparkline, geo/spatial, combo charts.

## Required reads

1. `docs/data-viz-skill.md` — the spec
2. `docs/clean-code.md`
3. `docs/accessibility.md` — global a11y rules
4. `docs/copy-skill.md` — RAE Spanish labels, es-ES number formatting
5. `docs/component-skill.md`
6. `docs/token-skill.md` — `data-*` token bucket (new; see Tokens section below)
7. `docs/plan.md` — motion context rule
8. `docs/build-prompts/coherence-modal.md` — keyboard-instructions dialog
9. `docs/build-prompts/coherence-table.md` — data-table fallback uses Table primitive
10. `docs/build-prompts/coherence-loading-badge.md` — fetch state uses `quiet-spinner` variant

## When to use (any chart primitive)

- Encoding numeric relationships that are faster to interpret visually than as a table
- Dashboards, reports, KPI summary views
- Side-by-side comparison of categories or series over a continuous axis

## When NOT to use

- Fewer than 3 data points → render as numbers in a `<afi-card>`.
- Precise decimal lookup → use `<afi-table>`.
- Decorative purpose → remove.
- Shape not covered by the v1 set → wait for v1.1 rather than inventing a variant.

## New tokens required

Add to `libs/tokens/` under a new `data` bucket (Coherence extension — Visa's exact hexes are behind auth):

```
data.neutral.strong
data.neutral.medium
data.neutral.muted
data.highlight.primary     # aliases action.500
data.highlight.secondary   # aliases action.300
data.diverge.neg.{100,300,500,700}
data.diverge.pos.{100,300,500,700}
data.semantic.positive
data.semantic.negative
data.semantic.warning
data.texture.dots
data.texture.lines
data.texture.crosshatch
```

Texture fills are SVG `<pattern>` refs, not colors. Chart components apply texture + color together on every encoded series.

## Shared API (all chart primitives)

| Input | Type | Default | Notes |
|---|---|---|---|
| `data` | `Array<Datum>` | `[]` | Shape varies per chart (see each section) |
| `loading` | `boolean` | `false` | Renders `<afi-loading-overlay variant="quiet-spinner">` |
| `title` | `string \| null` | `null` | Sentence case, RAE |
| `subtitle` | `string \| null` | `null` | Context (date range, filter, unit) |
| `longDescription` | `string` | *(required)* | a11y — what the chart shows + data type |
| `statisticalNotes` | `string` | *(required)* | a11y — key insights |
| `contextExplanation` | `string` | *(required)* | a11y — active filters / selections |
| `structureNotes` | `string` | *(required)* | a11y — sort, grouping, axis direction |
| `locale` | `string` | `'es-ES'` | Number + date formatting |
| `height` | `string` | `'320px'` | CSS height; width is container-driven |
| `focus` | `number \| string \| null` | `null` | Index/key of the focus element (Visa "focus element" concept) |

**Shared outputs:**

```ts
dataPointActivated = output<{ index: number; datum: Datum }>();
dataTableToggled   = output<boolean>();
instructionsOpened = output<void>();
```

**Shared slots:**

- `[slot=action]` — top-right action buttons (filter toggle, export, etc.)
- `[slot=footer]` — source citation, last-updated stamp

## Per-chart API

### `<afi-chart-bar>`

```ts
interface BarDatum {
  key: string;           // category
  value: number;
  label?: string;        // optional direct label (else formatted value)
}
```

Additional inputs:
- `orientation: 'vertical' | 'horizontal'` — default `'vertical'`
- `sort: 'asc' | 'desc' | null` — default `null` (data order)

Must start y-axis at 0. No override.

### `<afi-chart-line>`

```ts
interface LineSeries {
  key: string;
  points: Array<{ x: number | Date; y: number | null }>;   // null = gap
}
```

Additional inputs:
- `baselineZero: boolean` — default `false`. When true, y-axis starts at 0. When false, axis bottom = nice-number at/below dataset min.
- `showMarkers: boolean` — default `false`. Markers at each point.

Straight segments only — no curve interpolation setting exposed.

### `<afi-chart-heatmap>`

```ts
interface HeatmapCell {
  x: string | number;
  y: string | number;
  value: number;
}
```

Additional inputs:
- `scale: 'sequential' | 'divergent'` — default `'sequential'`
- `showCellLabels: boolean` — default `false`. If true, legend may be hidden.

### `<afi-chart-dumbbell>`

```ts
interface DumbbellDatum {
  key: string;
  valueA: number;
  valueB: number;
  labelA?: string;   // e.g., 'Actual'
  labelB?: string;   // e.g., 'Objetivo'
}
```

Additional inputs:
- `orientation: 'vertical' | 'horizontal'` — default `'horizontal'`

## Key behavior (shared)

1. **Render:** SVG root, `role="img"` with `aria-labelledby` pointing at title + `aria-describedby` pointing at the four descriptive-text properties' composite region.
2. **Descriptive-text region:** visually hidden `<div>` containing the four properties concatenated; lives adjacent to the SVG.
3. **Keyboard-instructions button:** small `<afi-button variant="ghost" size="sm" iconStart="keyboard">` in the chart's action slot (auto-added). Opens `<afi-modal>` with the keyboard map from `data-viz-skill.md`.
4. **Data-table fallback:** toggle button (auto-added) reveals an `<afi-table>` beneath the chart with all data. Toggle state exposed via `dataTableToggled`.
5. **Tooltip:** on hover and keyboard focus. Contains higher-precision numbers than on-chart labels. Dismiss via `Esc`.
6. **Focus:** each data point is tabbable via the keyboard map (`←/→` between siblings, `↑/↓` between series on line).
7. **Motion:** per `data-viz-skill.md` — enter 200ms ease-out, update 180ms ease-out, tooltip 120ms fade, reduced-motion collapses.
8. **Color resolver:** internal service that maps series index → `{color, texture}` tuple. Never returns color alone.
9. **Number + date formatting:** uses `Intl.NumberFormat('es-ES', …)` and `Intl.DateTimeFormat('es-ES', …)` with RAE abbreviations for `k/M/MM`.
10. **Loading:** wrap SVG in `<afi-loading-overlay variant="quiet-spinner" [visible]="loading">`.

## Accessibility

Per `data-viz-skill.md` — primitive-specific:

- SVG root: `role="img"` + `aria-labelledby` + `aria-describedby`.
- Four descriptive-text properties rendered in an sr-only region, RAE Spanish.
- Keyboard map fixed and shared. Instructions modal opens on button click or `?` key.
- Data-table fallback required on bar/line/dumbbell; optional on heatmap.
- Focus-visible ring: `var(--border-focus)`, 2px offset.
- Color never alone — texture + color together on every encoded series.

## File structure

```
libs/ui/chart/
├── chart-bar.component.ts
├── chart-line.component.ts
├── chart-heatmap.component.ts
├── chart-dumbbell.component.ts
├── chart.types.ts                 # BarDatum, LineSeries, HeatmapCell, DumbbellDatum, shared types
├── chart.variants.ts              # color + texture resolver
├── chart-axis.component.ts        # shared axis render
├── chart-legend.component.ts      # shared legend (hidden by default; direct labels preferred)
├── chart-tooltip.component.ts     # shared tooltip
├── chart-instructions.component.ts  # shared keyboard-instructions modal
├── chart-data-table.component.ts    # shared data-table fallback (wraps afi-table)
├── chart-a11y.ts                  # sr-only region builder from 4 descriptive-text props
├── chart-format.ts                # es-ES number + date formatters
├── chart-bar.component.spec.ts
├── chart-line.component.spec.ts
├── chart-heatmap.component.spec.ts
├── chart-dumbbell.component.spec.ts
└── index.ts
```

## Copy (hardcoded, RAE)

- Keyboard instructions button aria-label: `Instrucciones de teclado`
- Data-table toggle button: `Ver datos en tabla` / `Ocultar tabla de datos`
- Data-table dialog title: `Datos del gráfico`
- Instructions modal title: `Atajos de teclado`
- Loading sr-text: `Cargando gráfico`
- No data fallback: `Sin datos para mostrar`
- Axis defaults — no hardcoded label (consumer-provided)

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `chart-bar`, `chart-line`, `chart-heatmap`, `chart-dumbbell` (four runs; shared infrastructure is covered under each).

Chart-specific additions (apply to every primitive):

- Verify the four descriptive-text properties render in an sr-only region.
- Verify keyboard map works: `Enter`/`Shift+Enter`/`←→`/`↑↓`/`Esc`/`Tab`.
- Verify keyboard-instructions modal opens and announces.
- Verify data-table fallback mirrors the chart data exactly.
- Verify color + texture applied together on every series (screenshot in grayscale and confirm distinguishable).
- Verify bar charts start at zero; attempts to set non-zero are ignored or errored.
- Verify line chart with `null` points renders a break, not a connected line.
- Verify `prefers-reduced-motion` collapses enter/update.
- Verify `Intl.NumberFormat('es-ES')` output: `1.234,56`, `1,2 k`, `EUR 1.234,56`, `0,01 %`.
- Verify no hex/rgba/hardcoded px outside `libs/tokens/data/`.

## What success looks like

- AWM dashboard: `<afi-chart-bar>` showing monthly importaciones. Y-axis starts at 0. Bars are neutral gray by default; focused month (current) is `action-500`. Keyboard user tabs in → arrow keys navigate → `Enter` drills to that month's detail drawer.
- Coherence DS site `/componentes/chart-line`: line chart demo + data-table fallback open side-by-side; user toggles reduced-motion and sees updates go instant.
- Finance reviewer asks "why isn't the line chart y-axis at zero?" — chart's subtitle says `Eje no inicia en cero; mínimo de datos 87 %` — reviewer nods and moves on.
- Grayscale print of a dashboard: every series still distinguishable via texture.

## If stuck

- **SVG lib choice:** write the SVG by hand for v1 — four chart types is tractable. Don't pull d3 or ECharts yet; revisit at v1.1 when area/scatter arrive. The cost of owning the SVG is lower than the cost of fighting a lib's defaults on a11y and motion.
- **Axes math:** nice-number algorithm for tick stops is well-documented; steal a 30-line version. Don't over-engineer.
- **Texture patterns:** SVG `<pattern>` elements defined once in a `<defs>` block, referenced via `fill="url(#dots-strong)"`. Three textures is enough for v1.
- **Data-table fallback:** don't rebuild Table semantics — render `<afi-table>` with the chart's data. One source of truth.
- **Instructions modal:** reuse `<afi-modal>` — do not build a bespoke dialog.
- **Tooltip:** CDK Overlay with a flexible connected position strategy. Same pattern as NavItem's collapsed tooltip.
- **Locale:** don't hardcode format strings. `Intl.NumberFormat` + a small abbreviation helper for `k/M/MM` — that's it.
- **Don't implement interaction helpers like brush/zoom/crossfilter.** v1.1+.
