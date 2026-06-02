# AWP — Empty-state + per-page import dialog (follow-up)

**Status:** parked 2026-06-02 — needs activation + Phase 0 walk
**Depends on:** Brief 1 (listado, shipped #4) + the deferred `:simulationId` route migration chore
**Created:** 2026-06-02

---

## Why this exists

User direction during Brief 2 build (2026-06-02): the current "new planificación inherits cliente data" default (locked in Brief 1, decision #3) feels wrong on second look. The mental model should be:

> Each planificación is its own workspace. When you create a new one, it starts EMPTY. On every page, if the page is empty, you get a dialog that asks: "Import data from another planificación?" — and you pick, page by page, which sections + which fields to bring over.

This **inverts** Brief 1's prefill default. It also forces real per-plan data isolation, which today's store does not support (cliente, patrimonio, ingresos, etc. all live as global signals shared across plans).

## What this would ship

End-to-end empty-state-with-import flow, per simulation page (Familia · Sociedades · Patrimonio · Ingresos · Gastos · the 4 Objetivos pages · Diagnóstico · Plan · Conclusiones · Informe).

### Architectural shift

1. **Per-plan data isolation.** Each `Planificacion` carries its own `ClienteData`, `Sociedad[]`, `IngresoGastoRow[]`, etc. — replacing the global `cliente()`, `sociedades()`, `ingresos()`, … signals on `WealthPlannerStore`. The store grows a `currentPlanId` signal and the existing signals become `computed()` views derived from `planificaciones().find(p => p.id === currentPlanId())`.
2. **`:simulationId` route migration.** Routes change from `/demos/wealth-planner-2026/familia` to `/demos/wealth-planner-2026/:simulationId/familia` (etc.). The listado's `Abrir` action threads the planificación id. ~12 files: every page + sidebar `activeKey` derivation + every cross-link inside briefs. This work was already called out as a deferred chore in Brief 1 — it stops being deferrable when this brief activates.
3. **`Nueva planificación` flow inversion.** Modal still asks for nombre; on submit, creates a planificación with all data fields blank. No prefill. No toast about prefill.

### New components / services

- **`<site-empty-state-import>`** — site-local widget that mounts at the top of every simulation page when its slice is empty. Inputs: the current empty section name (e.g. "Familia · Información básica"), the list of available source planificaciones + persona seeds. Outputs: the selected fields to import. Internally opens an `<afi-modal>`.
- **`<site-import-source-picker>`** — list view inside the dialog. Shows source planificaciones (most-recent first) + persona seeds as a separate group. User selects one source.
- **`<site-import-field-picker>`** — checkbox tree under the source. Tree shape matches the page's sections (e.g. for Familia: Información básica → alias, residencia fiscal, año nacimiento, …; Miembros → cónyuge, hijos, ascendientes). Sane defaults: stable identity fields checked, plan-scoped fields unchecked.
- **`ImportService`** (or extend `WealthPlannerStore`) — `importIntoCurrentPlan(sourcePlanId, fieldMap)` that walks the field map and writes into the current plan's slice.

### Per-page wiring

Every simulation page gains:
- `isPageEmpty()` computed signal — true when none of the page's fields are set
- `<site-empty-state-import [open]="isPageEmpty()" [page]="'familia'" ... />` mounted near the top
- The dialog auto-opens on initial visit when empty; user can dismiss to start blank

## Locked decisions (filled at activation)

To resolve when this activates (one at a time per Planner agent):

1. **Source ordering** — most-recent planificación first, then persona seeds? Or both groups always visible?
2. **Default field selections** — what's checked vs unchecked by default for each page? Identity fields are obviously checked; plan-scoped (patrimonio, ingresos…) obviously unchecked. The middle (familia composition, sociedades?) is the design call.
3. **Persistence after dismiss** — if user dismisses on Familia and goes to Sociedades, does the import dialog auto-open again on Sociedades? Or one dismiss = all dismissed?
4. **Per-field granularity** — checkbox at each field (verbose) vs at each section (coarser, simpler). 

## Out of scope (called out explicitly)

- Cross-plan diff view — "show me what differs between plan A and plan B"
- Bulk operations across plans
- Plan-level metadata import (estado / gestor / etc.) — only data-shape fields

## Risks

- The `:simulationId` migration is wide and touchy. Sidebar links, cross-page anchors, the Ir-al-listado link, the back arrow's deeplinks (Brief 1 wired via `plan.route`). Plan to land in a single dedicated PR before activating this brief; treat it as a chore that has to ship first.
- Inverting the prefill changes Brief 1's UX. The "Información del cliente prerellenada" toast (Brief 1 commit `b9cbc7a`) gets removed; the NotificationStore stays as infrastructure for future cross-route notices.

## Activation checklist

When the user says "activate empty-state import":
- Phase 0 walk through the 4 locked decisions above.
- Confirm the `:simulationId` route migration chore is the first PR.
- Cut a fresh branch `richard/empty-state-import` off `main`.
- Iteration record: this is iteracion-5 (or later) territory; do NOT fold into iteracion-4.
