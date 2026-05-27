# AWP 2026 — Pre-flow · Listado de planificaciones

**Status:** drafted 2026-05-27, awaits user "go"
**Branch:** `feature/awp-listado-planificaciones` (to be created)
**Created:** 2026-05-27
**Activates:** independent — can ship any time. Does NOT block on the §5/§6 chore.
**Plan reference:** [`/Users/richardgriner/.claude/plans/okay-now-let-s-plan-concurrent-quiche.md`](../../.claude/plans/okay-now-let-s-plan-concurrent-quiche.md) — Brief 4

---

## Why this exists

Every AWP page header carries an `Ir al listado de planificaciones` link in the top-right (visible in every screen in `Afi brand/Wealth manager screens 2026/`). The link is currently a dead end — there's no listado page. This brief lands that page.

**Per-client model (locked 2026-05-27):** A single cliente can have multiple planificaciones (simulaciones) over time. The listado is the per-client hub showing those plans — created date, name, status, advisor, an action to open. The header on the listado itself still shows `Cliente: Manuel González Sánchez · Gestor: Juan García Pérez` — same cliente context as the rest of the planner, just a different surface.

## What this session ships

New top-level page at `/listado-planificaciones` (NOT under `/wealth-planner-2026` — the link explicitly points "out" of the simulación flow).

Page composition:

```
┌─ Header bar (same chrome as planner: cliente · gestor · etc., minus the "Ir al listado" link)
├─ <afi-page-header title="Planificaciones" subtitle="Manuel González Sánchez">
│   slot="actions" → <afi-button variant="primary">+ Nueva planificación</afi-button>
├─ Table:
│   Columns: Fecha creación · Nombre · Estado · Gestor · Acciones
│   Rows: each planificación (seeded with 2–3 examples)
└─ Empty state when list is empty
```

Each table row's actions: `Abrir` (primary link), `Duplicar` (ghost), `Archivar` (danger ghost).

## Coding standards

Inherited from [chore-sidebar brief § Coding standards](2026-05-27-awp-chore-sidebar-section-5-6-split.md#coding-standards-locked-from-brief-i):

- **3-file rule** — `.ts` + `.html` + `.scss`, NO inline template / styles.
- **Reuse libs/ui primitives** — `<afi-page-header>`, `<afi-button>`, `<afi-table>` (or hand-rolled per the `desinversiones-futuras` precedent), `<afi-status-chip>` for estado (activa / borrador / archivada), `<afi-modal>` for the new-planificación flow.
- **Tokens only in SCSS** — zero hex / rgb / bare px.
- **Tailwind utilities for layout** matching Brief I (`mx-space-8 mt-space-6 …`).
- **Visual anchor:** the listado is OUT of the simulación flow, so it doesn't inherit the planner-sidebar chrome. Header bar + content area still use the same primitives + tokens — feel like a Coherence-skinned hub, not a separate look.

## Pre-flight reads

1. `AGENTS.md` + `docs/strategy/plan.md` + `docs/rules/component-skill.md` + `docs/rules/token-skill.md`
2. `apps/site/src/app/pages/demos/shared/planner-top-bar.component.{ts,html}` — the existing header bar; the listado reuses the same chrome (cliente + gestor display)
3. `apps/site/src/app/pages/demos/desinversiones-futuras/desinversiones-futuras.page.{ts,html}` — closest existing pattern for a list page with "+ Añadir" CTA and per-row actions
4. `libs/ui/src/table/` — the `<afi-table>` primitive (decision below: use `<afi-table>` or hand-rolled like `desinversiones-futuras`)

## Sources of truth

- **Figma:** node `408-52670` ([Figma link](https://www.figma.com/design/888lN7vbJSc4gLYt7nP3DW/Afi-wealth-planner-V2-DEV?node-id=408-52670)) — the user-supplied design reference. **Pull during activation** (no screenshot copied into the screens folder yet).
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) — listado is NOT documented in the PDF (the doc focuses on the in-simulation flow §1–§6). This brief is sourced from the Figma + the user's per-client direction.
- **Screen evidence in repo:** the `Ir al listado de planificaciones` link appears in every screen header in `Afi brand/Wealth manager screens 2026/`, confirming the page is a sibling-out destination.

## Chrome wrapping

Does NOT use `<site-objetivos-page-shell>` (that shell is for in-simulation pages with the §1-§6 sidebar). The listado has different chrome:

- Top bar: same `<site-planner-top-bar>` — cliente + gestor + Configuración + Notas
- **No sidebar** (or a minimal one — the §1-§6 doesn't apply when you haven't picked a simulación yet)
- Main content centered, `<afi-page-header>` + table + empty state

Two implementation options for the chrome:

- (a) Build a new lean shell component `<site-listado-shell>` that wraps `site-planner-top-bar` + no sidebar.
- (b) Use the existing `<site-demo-shell>` directly (the same wrapper `<site-objetivos-page-shell>` uses internally) without the planner sidebar.

**Default proposal: (b)** — composes existing pieces; one less component to maintain. Confirm at activation.

## Store extensions

```ts
// ── Listado — Planificaciones per cliente (Brief Listado) ─────────────────
export type PlanificacionEstado = 'borrador' | 'activa' | 'archivada';

export interface Planificacion {
  id: string;
  nombre: string;          // "Planificación 2026 Q1"
  createdAt: string;       // ISO
  estado: PlanificacionEstado;
  gestor: string;          // "Juan García Pérez"
  /** Route the "Abrir" action navigates to. v1 hardcodes the flat AWP routes. */
  route: string;
}

readonly planificaciones = signal<Planificacion[]>([
  {
    id: 'plan-current',
    nombre: 'Planificación 2026 Q1',
    createdAt: '2026-01-15T10:00:00Z',
    estado: 'activa',
    gestor: 'Juan García Pérez',
    route: '/demos/wealth-planner-2026/familia',
  },
  {
    id: 'plan-draft-q2',
    nombre: 'Planificación 2026 Q2 — revisión',
    createdAt: '2026-04-03T14:30:00Z',
    estado: 'borrador',
    gestor: 'Juan García Pérez',
    route: '/demos/wealth-planner-2026/familia',
  },
  {
    id: 'plan-archived-2025',
    nombre: 'Planificación 2025 final',
    createdAt: '2025-12-20T09:00:00Z',
    estado: 'archivada',
    gestor: 'Juan García Pérez',
    route: '/demos/wealth-planner-2026/familia',
  },
]);

addPlanificacion(): Planificacion { /* push borrador with current timestamp */ }
archivarPlanificacion(id: string): void { /* mutate estado → 'archivada' */ }
```

Note: `route` is hardcoded in v1 because every planificación points at the same flat `/demos/wealth-planner-2026/...` routes. When the `:simulationId` migration lands (see Out of scope), `route` becomes derived from `id`.

## Routes

```ts
{
  path: 'listado-planificaciones',
  loadComponent: () =>
    import('./listado-planificaciones/listado-planificaciones.page').then(
      (m) => m.ListadoPlanificacionesPage,
    ),
},
```

The page lives under `apps/site/src/app/pages/demos/listado-planificaciones/`. Top-level URL because it's the entry point into the simulación flow, not part of it.

## Sidebar wiring

The listado page **does not appear in the planner sidebar** (the planner sidebar is for in-simulation navigation). Linkage is via the top-bar `Ir al listado de planificaciones` action, which already exists in every page header.

## Empty state

When `planificaciones().length === 0`:

```
─────────────────────────────────────────
                  ⊕
        No hay planificaciones aún
  Crea la primera para empezar a planificar
        el patrimonio del cliente.

         [+ Crear primera planificación]
─────────────────────────────────────────
```

Centered card, secondary CTA. Use the same empty-state pattern from `desinversiones-futuras.page.html` for consistency.

## Open work — execution order

1. **Add `Planificacion` type + signal + mutations** to the store.
2. **Build page (3 files):**
   - `apps/site/src/app/pages/demos/listado-planificaciones/listado-planificaciones.page.{ts,html,scss}`
3. **Register route**.
4. **Wire the `Ir al listado de planificaciones` link** in `planner-top-bar.component.html` to point at the new route (currently it's likely a `href="#"` or missing).
5. **Verify** at three viewport presets. Test all three row states (borrador / activa / archivada) render with the correct estado chip.

## Open decisions (need user input before build)

1. **Chrome composition.** Wrap with `<site-demo-shell>` directly (proposed default) OR build a new lean `<site-listado-shell>` component? Resolves the "no sidebar" question.

2. **Action set per row.** Default: `Abrir` · `Duplicar` · `Archivar`. Confirm — could also include `Editar nombre` inline, or `Eliminar` (vs. just archive).

3. **`+ Nueva planificación` flow.** Default: a modal asking only for the new planificación's name, then pushes to `/demos/wealth-planner-2026/familia` (the new flat route). Confirm: should it duplicate the active planificación's state by default, or always start blank?

4. **Estado chip styling.** Default proposal: `<afi-status-chip>` with intent mapping — `activa` = success, `borrador` = neutral, `archivada` = muted.

5. **Sort order / filter.** Default: reverse-chronological (newest at top), no filter. Confirm.

## Out of scope (called out explicitly)

- **`:simulationId` route migration.** Every existing AWP demo route currently lives at the flat `/demos/wealth-planner-2026/...` path, implicitly one simulation per client. Migrating to `:simulationId`-scoped routes (`/wealth-planner-2026/:simulationId/familia` etc.) touches 12+ files (every page + sidebar + cross-links between briefs) and gets its own follow-up brief: **`2026-XX-XX-awp-chore-simulation-id-route-migration.md`** (write AFTER Listado v1 lands and the simulación-as-entity model is concrete). For Listado v1: every row's `route` field hardcodes the flat `/demos/wealth-planner-2026/familia` URL.
- **Multi-client / gestor view** — explicitly per-client per the locked decision (the listado is for ONE cliente, not a cross-client book).
- **Search / advanced filters** — v1 ships with a static seeded list.
- **Permission model** (who can archive / duplicate) — out of scope; v1 is gestor-only.

## Follow-ups (tracked for after this ships)

- Write `2026-XX-XX-awp-chore-simulation-id-route-migration.md` once Listado is real.
- Decide whether the planner top bar's `Ir al listado` link should become route-aware (highlight when active, hide when on the listado itself).

## Exit criteria

- [ ] `/listado-planificaciones` routes and renders
- [ ] Three seeded rows visible with correct estado chips (activa · borrador · archivada)
- [ ] `+ Nueva planificación` adds a row in `borrador` state and navigates into the flow (per Open decision #3 default)
- [ ] `Abrir` action navigates to `/demos/wealth-planner-2026/familia`
- [ ] `Archivar` action transitions the row's estado (and surfaces a confirmation)
- [ ] Empty state renders when the seed is cleared
- [ ] `Ir al listado de planificaciones` link in the planner top bar lands here (regression check from every in-simulation page)
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] PR notes the chrome composition decision (1) + action set (2) + new-planificación flow (3)
