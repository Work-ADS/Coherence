# AWP — Clientes flow + responsive chrome (Briefs 3+4 combined)

**Status:** active 2026-06-02 — building on `richard/clientes-flow`
**Branch:** `richard/clientes-flow` (cut from `main` after PR [#5](https://github.com/AfiDesigner/Afi-coherence/pull/5) merged via `b09417b`)
**Created:** 2026-06-02
**Activated:** 2026-06-02 — 5 Open decisions locked
**Plan reference:** [`/Users/richardgriner/.claude/plans/okay-continue-and-take-magical-thimble.md`](../../.claude/plans/okay-continue-and-take-magical-thimble.md) — combines Brief 3 (responsive chrome) + Brief 4 (multi-cliente flow)

---

## Why this exists

The umbrella plan kept Brief 4 (multi-cliente flow) deferred behind Brief 1 to avoid forcing a `:simulationId` migration prematurely. User direction during PR #5 review: **combine 3 + 4** so the chrome restructure, the new `/clientes` page, and the responsive sweep land as one coherent step. Closes out the `richard/listado` umbrella so subsequent work can focus on rebuilding the pages "correctly" with `<afi-section>` discipline.

User-stated nav structure (3 layers, identity stays consistent across all):

| Context | Title / Breadcrumb |
| --- | --- |
| `/clientes` | "Listado de clientes" |
| `/listado-planificaciones` (per-cliente) | "Listado del cliente [Name]" |
| In a simulation page | Existing planner-top-bar (cliente · sim ID · estado · notes · settings) |

## What this session ships

### A. New `<site-product-identity-bar>` chrome layer

Site-local 3-file widget at `apps/site/src/app/components/product-identity-bar/`. Renders persistently above the existing chrome (planner-top-bar / page header) on every AWP route. Inputs:
- `productLabel` (e.g. "Wealth Planner")
- `pageTitle` (e.g. "Listado de clientes")
- Optional `breadcrumb` array for deeper contexts

Visual: AFI logo (small) + product label · separator · page title. At <768 px, condenses to logo + abbreviated title (truncate breadcrumb with ellipsis).

### B. New `/clientes` page

`apps/site/src/app/pages/demos/clientes/clientes.page.{ts,html,scss}`. Top-level route. Renders the 2 personas as **interactive `<site-persona-card>` instances** in a grid (same layout as the User personas tab, but cards become clickable). Click → `WealthPlannerStore.activatePersona(id)` → navigates to `/listado-planificaciones`.

To make this work, `<site-persona-card>` gains an `interactive` input that forwards to `<afi-card>.interactive` and emits a `(activate)` event. The personas tab on the demo overview stays non-interactive (no behavior change there).

### C. Persona → cliente activation

`apps/site/src/app/pages/demos/wealth-planner-2026/data/personas.ts` extends `Persona` with `clienteSnapshot: Partial<ClienteData> & { conyugeStatus?: …, hijos?: …, ascendientes?: … }`. Two personas get realistic snapshots:

- **Marco Fernández Castro** (42, Acumulador) — alias, Madrid, 1984, `tipoActividad: activo`, ~5 años cotizados, 1 hijo
- **Carmen López Martín** (64, Patrimonio establecido) — alias, Madrid, 1962, `tipoActividad: jubilado`, anoJubilacion 2022, 2 hijos adultos

`WealthPlannerStore` grows:
- `activeClienteId = signal<string | null>(null)` — null on first visit so /clientes is the natural entry
- `activatePersona(id)` — writes the snapshot into `cliente()` + `conyuge()` + `hijos()` + `ascendientes()`, sets `activeClienteId`
- Default: when nothing has activated yet, the existing `cliente()` reads as Marco's snapshot so direct visits to `/listado-planificaciones` still work

### D. Breadcrumb mechanics

Each AWP page passes its own `pageTitle` + optional `breadcrumb` to the identity bar:
- `/clientes` → `pageTitle="Listado de clientes"`
- `/listado-planificaciones` → `pageTitle="Listado del cliente"`, `breadcrumb=[{label:'Clientes', route:'/clientes'}]`
- `/demos/wealth-planner-2026/familia` and siblings → planner-top-bar continues to render its own context (cliente name · sim ID · estado) directly below the identity bar; the identity bar shows `pageTitle="Simulación"` and `breadcrumb=[{label:'Clientes', route:'/clientes'}, {label: clienteName, route:'/listado-planificaciones'}]`

### E. Responsive chrome

- **`<site-product-identity-bar>`** — densifies at <768 (logo + abbreviated title; breadcrumb collapses to back-arrow)
- **`<site-planner-sidebar>`** — collapses to a hamburger trigger at <768. Drawer reveals via slide-in animation (use existing `<afi-modal>` patterns or a simpler off-canvas). The hamburger button mounts on the planner-top-bar's left edge.
- **Listado table** — at <768, rows stack as card-style entries (no horizontal scroll). Action icons appear inline at the bottom of each card.
- **AWP simulation pages padding sweep** — every `/demos/wealth-planner-2026/*` page's outer container uses the same padding tokens Familia uses. Page-by-page audit, but only for outer padding — NOT a full content rework (that's the `<afi-section>` follow-up brief).

## Coding standards

Inherited from the listado + overview-tabs briefs:
- **3-file rule** — `.ts` + `.html` + `.scss`
- **Reuse primitives** — `<afi-card>` (persona-card interactive), the existing `<afi-tooltip>` / `<afi-icon-button>` for the hamburger, native `<dialog>` for the drawer if `<afi-modal>` doesn't fit
- **Tokens only in SCSS** — no hex / px / rgba outside libs/tokens
- **Persona-card primitive stays site-local** (decided in Brief 2)

## Pre-flight reads

1. `AGENTS.md` + `docs/strategy/plan.md` + `docs/rules/component-skill.md` + `docs/rules/token-skill.md`
2. [`apps/site/src/app/pages/demos/wealth-planner-2026/store.ts`](../../apps/site/src/app/pages/demos/wealth-planner-2026/store.ts) — current ClienteData shape + planificaciones model
3. [`apps/site/src/app/pages/demos/shared/planner-top-bar.component.{ts,html}`](../../apps/site/src/app/pages/demos/shared/) — chrome to layer above
4. [`apps/site/src/app/pages/demos/shared/planner-sidebar.component.{ts,html}`](../../apps/site/src/app/pages/demos/shared/) — sidebar to make responsive
5. [`apps/site/src/app/components/persona-card/`](../../apps/site/src/app/components/persona-card/) — primitive to extend with interactive variant
6. [`apps/site/src/app/pages/demos/familia/familia.page.scss`](../../apps/site/src/app/pages/demos/familia/familia.page.scss) — the "good" padding reference

## Locked decisions (2026-06-02)

1. **Chrome architecture** → new `<site-product-identity-bar>` ABOVE existing chrome. Existing planner-top-bar stays in simulation context. No unified chrome refactor in this brief.
2. **Routing** → keep current routes. `/clientes` is new at top-level. `/listado-planificaciones` and `/demos/wealth-planner-2026/*` stay where they are; everything store-bound via `activeClienteId`. No `:simulationId` migration.
3. **/clientes layout** → interactive `<site-persona-card>` grid. `<site-persona-card>` gains an `interactive` input + `(activate)` output.
4. **Persona activation** → each persona carries a `clienteSnapshot` payload. Click → `WealthPlannerStore.activatePersona(id)` writes the snapshot + sets `activeClienteId` + navigates to `/listado-planificaciones`. Default `cliente()` reads Marco's snapshot on first visit so direct deep-links don't break.
5. **Responsive scope** → chrome + sidebar + listado table. AWP simulation pages get an OUTER padding-token sweep aligned with Familia. No full page-by-page densification (defer to follow-up).

## Files

**New:**
- `apps/site/src/app/components/product-identity-bar/product-identity-bar.component.{ts,html,scss}` + `index.ts`
- `apps/site/src/app/pages/demos/clientes/clientes.page.{ts,html,scss}`

**Edit:**
- `apps/site/src/app/pages/demos/wealth-planner-2026/data/personas.ts` — add `clienteSnapshot` field + 2 realistic snapshots
- `apps/site/src/app/pages/demos/wealth-planner-2026/store.ts` — add `activeClienteId` signal + `activatePersona(id)` action + default snapshot
- `apps/site/src/app/components/persona-card/persona-card.component.{ts,html,scss}` — add `interactive` input + `(activate)` output
- `apps/site/src/app/pages/demos/shared/planner-sidebar.component.{ts,html,scss}` — drawer/hamburger mode at <768
- `apps/site/src/app/pages/demos/shared/planner-top-bar.component.{ts,html,scss}` — hamburger trigger slot when sidebar collapsed
- `apps/site/src/app/pages/demos/listado-planificaciones/listado-planificaciones.page.{html,scss}` — stacked card layout at <768; mount identity bar
- Every AWP page that currently mounts `<site-planner-top-bar>` — wrap with `<site-product-identity-bar>` (familia, sociedades, patrimonial, evolucion-patrimonial, ingresos-gastos-list, objetivos-page-shell, patrimonio-previsto, …)
- Each simulation page's outer SCSS — sweep padding tokens to align with Familia
- `apps/site/src/app/app.routes.ts` — register `/clientes` route
- `apps/site/src/app/app.ts` — extend `matchFullScreen` to include `/clientes`
- `apps/site/src/app/pages/blog/iteracion-4/iteracion-4.page.ts` — populate Responsive + Multi-cliente surfaces (Hecho)

## Out of scope (called out explicitly)

- `:simulationId` URL migration — listado + simulation pages stay flat. Still tracked as a future chore brief.
- Full per-page densification — only outer padding sweep here. Internal layouts (tables, grids inside pages) keep current treatment.
- The empty-state + per-page import dialog (parked at `2026-06-02-awp-empty-state-import-dialog.md`) — still parked.
- "Build pages correctly with `<afi-section>`" — user-flagged execution work; lands AFTER this brief in its own pass.
- Adding personas to LK Sarevi / Unicaja — AWP only.

## Follow-ups (queued for after this ships)

- `2026-XX-XX-awp-section-component-audit.md` — page-by-page review where `<afi-section>` should wrap content blocks (user flagged: "I don't think we have been doing that"). Pure refactor / DS hygiene pass.
- `2026-XX-XX-awp-semantic-css-renderer.md` — replace the `<pre>` block with a proper token table (filterable, swatches per color).
- `2026-XX-XX-awp-persona-activate-extras.md` — confirmation modal when activating from inside a simulation (avoid silent data swap mid-edit).

## Exit criteria

- [ ] `/clientes` route renders with 2 interactive persona cards; click → store activates + navigates to `/listado-planificaciones`
- [ ] After activating Marco: Familia tab opens prefilled with Marco's data (Madrid · 1984 · activo · etc.). Same for Carmen
- [ ] `<site-product-identity-bar>` renders above the existing chrome on `/clientes`, `/listado-planificaciones`, and every AWP simulation page — with the right title/breadcrumb per context
- [ ] At <768 px: identity bar densifies (logo + abbreviated title); planner-sidebar collapses to a hamburger that opens a drawer; listado table rows stack as cards
- [ ] AWP simulation pages share the same outer padding scale as Familia
- [ ] iteracion-4's Responsive + Multi-cliente surfaces marked Hecho
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] PR notes the 5 locked decisions + lists the 3 follow-up briefs queued
