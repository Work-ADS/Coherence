# Build — AWM Propuestas list page (`apps/awm-propuestas/src/app/list-page/`)

**Brief:** `docs/briefs/awm-propuestas.md`
**Surface:** Propuestas list page (Phase 2 surface #1)
**Golden-flow step(s):** 1 (entry) and 8 (return after enviar)
**Status:** interactive for the Tuesday 2026-04-21 concept demo.

## Scope of this prompt

One Angular app + one route. The app is `apps/awm-propuestas/` (new workspace consumer of `libs/ui/*` and `libs/tokens/*`); this prompt scaffolds the app AND builds the list route.

**Not in scope:** Ajustes / Restrictions / Formalizar / Enviar static surfaces (separate prompts). Real AWM backend wiring. Real Signaturit call. PrimeNG baseline capture instrumentation.

## Required reads (in order, before writing code)

1. `docs/briefs/awm-propuestas.md` — Phase 2 (Scope) + Phase 3 (Spec). The full list-page user stories live there.
2. `docs/briefs/awm-propuestas-demo-script.md` — the walkthrough cues tell you which moments are load-bearing for the pitch.
3. `docs/clean-code.md` — Angular + Tailwind + strict TS + token-only.
4. `docs/accessibility.md` — Table, Button, Menu, Checkbox a11y checklists.
5. `docs/component-skill.md` — how to compose primitives without redefining them.
6. `docs/token-skill.md` — use semantic tokens only; never primitive hex.
7. `docs/copy-skill.md` — RAE Spanish + glossary.
8. `docs/plan.md` — shell catalog (this route uses the **Workspace shell**); motion templates.

## Primitives / components used

All consumed from `libs/ui/*`. If a primitive isn't built yet when this prompt runs, **block** and run the primitive prompt first.

- `Button` (`docs/build-prompts/coherence-button.md`) — "Nueva propuesta" primary, row-level actions.
- `Checkbox` (`docs/build-prompts/coherence-checkbox.md`) — per-row + header bulk select.
- `Table` (`docs/build-prompts/coherence-table.md`) — rows, columns, sort, hover actions.
- `StatusChip` (`docs/build-prompts/coherence-status-chip.md`) — propuesta state tags (5 variants, color-coded).
- `Menu` (`docs/build-prompts/coherence-menu.md`) — row-level 3-dot overflow.
- `Kbd` (`docs/build-prompts/coherence-kbd.md`) — visual keyboard-shortcut hint.
- `Modal` (`docs/build-prompts/coherence-modal.md`) — confirm dialogs for bulk-delete and state transitions.
- Shell: `Workspace` shell from `docs/build-prompts/coherence-shell.md` — this is the hosting layout (sidebar + page header + content area).

## App scaffolding (first-time — if `apps/awm-propuestas/` doesn't exist)

Generate an Angular app in `apps/awm-propuestas/` using the workspace's tooling. Standalone components, Angular 17.1+ signals, TypeScript strict, Tailwind preset from `libs/tokens/dist/tailwind-preset.js`. Routes declared in `app.routes.ts`. Wealth Planner teaser route lives inside this same app (no second app for the 4-day concept).

Routes:

| Path | Component |
|---|---|
| `/propuestas` | `ListPageComponent` (this prompt) |
| `/propuestas/new` | Type-picker modal overlay (next prompt) |
| `/propuestas/:id/ajustes` | Ajustes static (later prompt) |
| `/propuestas/:id/formalizar` | Formalizar static modal (later prompt) |
| `/propuestas/:id/enviado` | Enviar success static (later prompt) |
| `/teaser/diagnostico` | Wealth Planner Diagnóstico teaser (later prompt) |

## Data

Fake realistic data at `apps/awm-propuestas/src/assets/data/propuestas.json`. ~30 rows covering all 5 states (Borrador / Enviado para firma / Ejecutado / Formalizada / Cancelada), ~5 clients, 1 cartera each for the happy-path. Each row has:

```ts
interface PropuestaRow {
  id: string;                 // e.g. 'PROP-2026-0417-0001'
  name: string;               // auto-name convention — see brief
  client: string;             // e.g. 'María García López'
  cartera: string;            // e.g. 'Cartera conservadora'
  state: 'borrador' | 'enviado-para-firma' | 'ejecutado' | 'formalizada' | 'cancelada';
  type: 'nueva' | 'rebalanceo' | 'modificacion-libre' | 'reembolso';
  createdAt: string;          // ISO date
  updatedAt: string;          // ISO date
  tags?: string[];            // e.g. ['ESG', 'Urgente']
}
```

Copy-skill rule applies to all strings — Spanish, formal register, no English fallbacks.

## Behavior requirements (verbatim from brief Phase 2 user stories)

1. **Browsing.** Render the table of propuestas. Every row shows: selection checkbox, name, client + cartera, state chip, context tags, per-row primary action (state-sensitive) + 3-dot overflow, last-updated timestamp. All 5 states render. Column sort on name + updatedAt.

2. **Keyboard shortcut to start new propuesta.** Global shortcut `cmd+k` (macOS) / `ctrl+k` (Windows). Opens `/propuestas/new`. Show a visible `<afi-kbd>⌘</afi-kbd><afi-kbd>K</afi-kbd>` hint next to the "Nueva propuesta" primary button in the page header — the discoverability affordance. This is load-bearing for **metric B** (shortcut usage ≥ 40%). Emit event `propuestas.shortcut.new-propuesta.invoked` on each keystroke-triggered open.

3. **Presenter-mode toggle.** Toggle in the Workspace shell's top-right. When on: amounts hide (if displayed), type scale +2 steps, density widens. State persists in `localStorage` as `awm-propuestas.presenter-mode`. On page load, reads stored value.

4. **Per-state actions.** Action set per state follows the brief's Phase 2 list: Borrador → Editar / Eliminar / Enviar para firmar. Enviado para firma → Cancelar firma / Ver propuesta. Ejecutado → Ver propuesta / Eliminar. Formalizada → Volver a borrador / Solicitar propuesta inversión. Cancelada → Volver a solicitar propuesta inversión. Primary = first; rest in the 3-dot menu. For the Tuesday concept, wire the click handlers to **console-log the action + emit a golden-flow event**; the destination surface is scaffolded by later prompts.

5. **Bulk delete.** Header checkbox selects all visible rows. When ≥ 1 row selected, a bulk-action bar appears above the table with a "Eliminar seleccionadas" Button. Click opens a confirm Modal. Ver propuesta is explicitly NOT a bulk action (per Granola).

6. **Filter by name.** Search Input above the table filters rows client-side by `name` OR `client` (case-insensitive substring). Debounced 150ms.

## Golden-flow instrumentation

Emit `step-start` event on entry to this surface.

```ts
{
  event: 'propuestas.list-page.step-start',
  userId, sessionId, timestamp,
  stepOrdinal: 1,
  metadata: { rowCount, presenterMode }
}
```

Additional events per Phase 3 Spec:

- `propuestas.shortcut.new-propuesta.invoked` — on cmd-K.
- `propuestas.bulk-delete.invoked` — on bulk delete confirm.
- `propuestas.filter.applied` — on filter input debounce settle.
- `propuestas.presenter-mode.toggled` — on toggle, carries new state.
- `propuestas.row-action.clicked` — on per-row action, carries action name + propuesta state.

For the Tuesday concept: events emit to `console.info` with a structured prefix. Real event sink wires in v1.5.

## Layout (prose; no inline HTML spec beyond this)

Workspace shell. Page header: title ("Propuestas") on the left; filter Input center-left; presenter-mode toggle center-right; "Nueva propuesta" primary Button with Kbd hint on the right.

Below header: bulk-action bar (hidden until selection). Below: the Table. Below: pagination stub (static; pagination wiring is v1.5).

Table column widths per the Figma frame (`1776:296268`): checkbox 42px, name 155px, client/cartera ~175px, state 175px, tags 265px, last-updated 175px, actions 52px.

Motion: row hover uses `hover-tint` template; button hover uses `hover-lift`; row-action click uses `press-scale`; all per `motion-templates.md`.

## File structure

```
apps/awm-propuestas/
├── src/
│   ├── app/
│   │   ├── list-page/
│   │   │   ├── list-page.component.ts
│   │   │   ├── list-page.component.spec.ts
│   │   │   ├── list-page.styles.ts        # Tailwind class maps
│   │   │   └── propuestas-data.service.ts # loads the fake JSON
│   │   ├── shared/
│   │   │   ├── presenter-mode.service.ts  # shared with other surfaces
│   │   │   └── telemetry.service.ts       # console-based event emitter (v1.5 swap)
│   │   └── app.routes.ts
│   └── assets/data/propuestas.json
└── (angular.json / project.json entries added)
```

## Pre-flight before commit (non-negotiable)

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = each touched primitive path. Then run this **surface-specific** addendum:

- Keyboard-walk the full page: Tab reaches every interactive, Enter/Space actuate, Esc closes modals, cmd-K opens new-propuesta route.
- Screen-reader: VoiceOver announces row state, action names in Spanish, bulk-action bar role.
- Presenter mode: verify amounts are hidden at every size; toggle persists across reload.
- Filter: 30-row dataset, type `"garcía"` → rows filter within 250ms of last keystroke.
- All 5 `StatusChip` variants render correctly in their row context.

## Out-of-scope for this prompt (restated so Builder doesn't drift)

- Reembolso / Modificación libre flows (type picker routes to "coming soon" — next prompt).
- Real Signaturit call, real PDF engine, live AWM backend.
- Tablet-responsive polish (desktop-first at 1440px).
- Per-state action destination screens beyond console-log — Ajustes + Formalizar + Enviar are separate prompts.
- Metrics dashboard visualization (events fire; dashboards are backlog).

## What success looks like

- Open `localhost:{port}/propuestas` → Workspace shell with the Propuestas table, 30 rows, 5 state colors, densely scannable.
- Cmd-K anywhere on the page → routes to `/propuestas/new` and emits the shortcut event.
- Toggle presenter mode → amounts hide (even though fake data), type jumps two steps, layout stays composed.
- Select 3 rows via checkboxes → bulk-action bar appears with "Eliminar seleccionadas" Button; click → confirm Modal; confirm → rows remove client-side + event fires.
- Type `"garcía"` in filter → table narrows to matching rows within 150ms debounce.
- No hex in any component file. No `any`. No `EventEmitter`. No hardcoded Spanish outside the glossary.

## If stuck

- If a primitive API is ambiguous, the primitive prompt wins — re-read it before editing.
- If brief + skill conflict, the skill wins. Flag drift in `docs/briefs/awm-propuestas.md` under a new "## Build notes" section.
- Escalate to Planner (back in Claude) if the brief is silent on a decision — don't guess.
