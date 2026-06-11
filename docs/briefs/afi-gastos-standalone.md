# AFI — Situacion Actual · Gastos Page (standalone)

**Status:** active
**Client:** AFI Wealth Planner
**Product:** Wealth Planner V2
**Feature:** Gastos standalone page (separated from combined Ingresos y Gastos)
**Started:** 2026-06-11
**Last updated:** 2026-06-11
**Branch:** feature/gastos-standalone-v2

---

## Context

- **Client / team:** AFI internal product team. Wealth Planner is a client-facing financial planning tool used by AFI gestores.
- **Project type:** Iteration on a live product. Previously Ingresos and Gastos shared a combined page (`/ingresos-y-gastos`). We are splitting them into standalone pages.
- **Existing design system:** Coherence DS — Angular 17+ standalone components, token-driven, BEM + CSS custom properties, OnPush change detection. Lives in this repo (`libs/ui/`).
- **Existing Figma / mocks:** Yes — Figma file `888lN7vbJSc4gLYt7nP3DW` (V2). Node `15:169270` = Gastos page, node `23:21303` = modal. Approved and current. Treated as starting point.
- **Stakeholders:** Borja — product/design (confirmed V2 flow, retired IPC per 2026-02-27). Richard — builder, sign-off on implementation.

---

## Frame

### Pains
1. The combined Ingresos/Gastos page forces users to scroll between two unrelated data sets. Separating them improves information architecture.
2. Without a visual chart, gestores cannot see the *projection* of gastos over time — they are blind to when future expenses hit.
3. The modal uses switches instead of radios (inconsistent with newer V2 patterns elsewhere in the product).
4. "Valor" label is unclear — "Importe" is the correct financial term.

### North star
> A gestor can see at a glance how projected gastos evolve over time, and add/edit them without leaving the page.

### References
- **Patrimonio page (existing)** — same page header + table + modal pattern. Same sidebar navigation, same `<afi-page-header>` + `<afi-table>` primitives.
- **Evolucion Patrimonial chart** — line chart pattern with legend below, multiple series. Same visual language (data-viz palette, SVG hand-written).
- **Sociedades page** — modal pattern (add/edit, summary card, footer with Cancel/Guardar).

### Users
- **Primary:** AFI gestor (financial advisor). Uses this during client meetings. Needs to quickly add client expenses and show the client how they project. Time-pressured, needs visual clarity.
- **Secondary:** Client (view-only in reports, but the page is built for the gestor).

### Success metrics
- **Leading:**
  - Time to add a new gasto (target: < 30 seconds from page load to save)
  - Chart interaction rate (% of page visits where user hovers the line chart)
- **Lagging:**
  - Page completion rate (% of client plans where Gastos section has at least 1 row)
  - Error rate in gastos modal (validation failures / incomplete submissions)

---

## Scope

### v1 surfaces

| # | Surface | Justification |
|---|---|---|
| 1 | **Gastos page shell** (`gastos.page.ts/html/scss`) | The standalone page wrapper. Without it, nothing renders. |
| 2 | **Gastos projection chart** (`<afi-chart-line>`) | Single red line: total projected gastos per year (ages on X-axis, amount on Y-axis). Simple, readable, existing primitive. Without it, the north star ("see how gastos evolve") fails. |
| 3 | **Chart tooltip on hover** | Built into `<afi-chart-line>` via marker interaction + `dataPointActivated` event. Required for reading exact values. |
| 4 | **V2 table** (`<afi-table>` configured in the page) | Lists all gastos with Inicio/Fin/Incremento columns. Without it, the page is just a chart with no detail. |
| 5 | **Add/Edit modal** (restyled `ingreso-gasto-form-modal.*`) | The only way to CRUD gastos. Without it, the page is read-only. |
| 6 | **Store update** (`incrementaIPC` field + seed data) | Data model change required for the modal and table to display correctly. |

### Surfaces cut from v1 (Phase 4 / v2 candidates)

- **Patrimonio overlay** — dual-axis not supported by `<afi-chart-line>`. Requires bespoke primitive or two separate charts. Cut for v1.
- **Stacked bar breakdown by concept** — user explicitly chose line chart (Option C). Cut.
- **Click-to-filter table** — clicking a chart segment filters the table below to that concept. Nice, but the table has its own search/sort. Cut for v1.
- **Export chart / download CSV** — not in Figma V2. Cut.
- **Animated chart entrance** — bars grow on mount. Cut; static render is fine for v1.
- **Ingresos page changes** — separate branch, separate brief. Cut.

### User stories

| Surface | Story |
|---|---|
| Page shell | *As a gestor, I want the Gastos page to live under its own sidebar item, so that I can navigate directly without scrolling through Ingresos.* |
| Line chart | *As a gestor, I want to see projected gastos as a line over my ages, so that I can explain to the client when big expenses hit.* |
| Chart tooltip | *As a gestor, I want to hover a point to see its exact value, so that I don't need to read the legend and do mental math.* |
| V2 table | *As a gestor, I want to see Inicio/Fin/Incremento in the table, so that I can quickly verify whether a gasto is current or future and how it grows.* |
| Modal | *As a gestor, I want to add/edit a gasto using a modal with Sí/No radios and an "Importe" field, so that the form matches the rest of the V2 product.* |
| Store update | *As a system, I want to store whether a gasto grows with IPC or a manual rate, so that the chart projection is accurate and the table shows the correct incremento.* |

### Out of scope (explicitly NOT doing)

- Ingresos page changes — separate branch, separate brief.
- Combined "Ingresos y Gastos" page — being retired, but not in this scope.
- Chart interactions beyond hover tooltip (click, zoom, pan) — not in Figma.
- Backend persistence — stays in-memory only.
- IPC rate configuration UI — passed as `@Input` to the chart, hardcoded constant in the page for v1.
- Patrimonio overlay on the chart — requires dual-axis primitive, out of scope.

### Golden flow (the 90-second demo)

```
1. Gestor clicks "Gastos" in sidebar
2. Page loads → line chart renders (ages 55–90)
3. Gestor hovers a marker → tooltip shows value
4. Gestor clicks "+ Anadir gasto"
5. Modal opens → gestor fills concepto, importe, frecuencia
6. Gestor toggles "Es un gasto futuro?" → Si → Inicio/Finalizacion appear
7. Gestor toggles "Incrementa con IPC?" → No → manual % input appears
8. Gestor clicks "Aceptar" → modal closes, chart + table update
9. Gestor clicks a table row → modal opens in edit mode
10. Gestor clicks "Borrar" in overflow menu → row removed, chart updates
```

**Branch points:**
- Step 5: gestor might close modal without saving (no instrumentation needed for v1).
- Step 6: gestor might leave "Es futuro" as No → Inicio stays hidden.
- Step 7: gestor might leave IPC as Si → no manual % needed.

---

## Spec

### Technical requirements

| Constraint | Type | Detail |
|---|---|---|
| Angular 17+ standalone components | **Hard** | Repo standard. Every new component must be `standalone: true`. |
| 3-file rule (ts + html + scss) | **Hard** | AGENTS.md section 2. No inline `template:` or `styles:`. |
| Coherence DS primitives only | **Hard** | `<afi-page-header>`, `<afi-table>`, `<afi-button>`, `<afi-input>`, `<afi-select>`, `<afi-modal>`, `<afi-badge>`, `<afi-kbd>`, `<afi-chart-line>`. No bespoke form controls. |
| BEM + CSS custom properties | **Hard** | All SCSS must use BEM naming and reference semantic tokens. |
| OnPush change detection | **Hard** | All components. |
| Chart: `<afi-chart-line>` | **Hard** | Existing primitive from `@coherence/ui`. No custom SVG chart needed for v1. |
| Tooltip on hover | **Hard** | Use `<afi-chart-line>` `dataPointActivated` event + tooltip overlay. |
| IPC rate as `@Input` | **Hard** | Page component receives `ipcRate` (default `0.015`). Passed to projection computed signal. |
| Browser support: last 2 Chrome, Firefox, Safari, Edge | **Negotiable** | Current repo target. |
| Responsive: 3 viewport presets | **Hard** | Desktop (1440), tablet (768), mobile (375). |

### Integration / data

| Requirement | Detail |
|---|---|
| `WealthPlannerStore` inject | Page + modal both inject the store. Modal reads `hijos()` for "edad de hijo" finalizacion. |
| `IngresoGastoRow` shape | Add `incrementaIPC: boolean`. All other fields stay. |
| Chart projection | Horizon: current age → +35 years (same as Patrimonio previsto). Active-year logic respects `isFuturo`, `inicio`, `finalizacion`. Compound growth applied. Values normalized to annual. |

### Instrumentation

| Metric | Event | Metadata |
|---|---|---|
| Time to add gasto | `gasto_modal_open` → `gasto_modal_save` | `mode: 'add' \| 'edit'`, `duration_ms` |
| Chart interaction | `gasto_chart_point_activated` | `age`, `value` |
| Page completion | `gasto_page_visit` + `gasto_row_count` | `count` |
| Modal validation errors | `gasto_modal_error` | `field`, `message` |
| Golden flow step | `gasto_golden_step_N` | `step_ordinal: 1-10`, `session_id` |

### Golden-flow tracking

Emit `gasto_golden_step_{N}` at each of the 10 steps in the golden flow, with `session_id`, `user_id`, `timestamp`, `step_ordinal`. SQL dashboard tracks adherence (% of sessions reaching step 10).

### Non-technical requirements

| Requirement | Type | Detail |
|---|---|---|
| WCAG 2.1 AA | **Hard** | Keyboard navigation, focus trap in modal, screen-reader labels on chart. |
| Spanish only (es-ES) | **Hard** | No i18n framework needed. |
| Financial data privacy | **Hard** | In-memory only, no PII leakage to logs. |
| GDPR / financial regs | **Nice-to-have** | Not applicable for in-memory demo. |

### Team + timeline

| | |
|---|---|
| Builder | Richard |
| Review | Self-review + user test |
| Timeline | Single session (today) |
| Blockers | None — store exists, primitives exist, Figma approved |

---

## Parked

### v2 candidates (post-v1)

| | Why cut |
|---|---|
| Patrimonio overlay on chart | Requires dual-axis primitive not in `libs/ui`. |
| Stacked bar breakdown by concept | User explicitly chose line chart (Option C) for v1. |
| Click-to-filter table | Nice UX synergy, but table has independent search/sort. |
| Animated chart entrance | Bars grow on mount. Cut; static render is fine for v1. |
| Export chart / download CSV | Not in Figma V2. Cut. |
| Ingresos page mirror | Separate branch, separate brief. |
| Combined "Ingresos y Gastos" retirement | Need to update sidebar + routing, out of Gastos scope. |

### Backlog

- Ingresos page update (standalone, same pattern)
- Retirement of old combined page
- Multi-axis chart primitive in `libs/ui` for overlay series (Patrimonio vs Gastos)
- Chart zoom/pan for long horizons
- IPC rate configuration UI (gestor-editable)

### Still to determine (ordered by leverage)

1. **Canonical IPC rate** — Locked at 1.5% for v1. May become gestor-editable in v2.
2. **X-axis: years or ages?** — Locked at ages for v1. Gestor preference confirmed.
3. **Chart color for Gastos line** — Red line (`var(--chart-negative)` or data-viz series-5). Single series = one color.
4. **Color cycling for multi-concept charts** — Not applicable until v2 stacked breakdown.

---

## Notes

- **IPC removed per Borja 2026-02-27:** The existing store uses `incrementoManualPct`. The V2 modal adds a boolean `incrementaIPC` (default `true`). When `true`, the projection uses the system IPC rate (1.5%). When `false`, it uses `incrementoManualPct`.
- **Modal shared with Ingresos:** The `ingreso-gasto-form-modal` component is shared between Ingresos and Gastos. Changes must not break the Ingresos page (which uses `mode="ingreso"`).
- **Existing shared component:** The old `<site-ingresos-gastos-list>` is NOT used by the new Gastos page. It stays untouched for the Ingresos branch.
