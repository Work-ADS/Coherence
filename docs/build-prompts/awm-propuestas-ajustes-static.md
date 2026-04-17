# Build — AWM Propuestas Ajustes de cartera, static (`apps/awm-propuestas/src/app/ajustes/`)

**Brief:** `docs/briefs/awm-propuestas.md`
**Surface:** Ajustes de cartera (Phase 2 surface #3)
**Golden-flow step(s):** 4 (Ajustes loads, gestor edits) and 5 (Restrictions panel visible read-only)
**Status:** **static high-fidelity walkthrough surface for Tuesday 2026-04-21.** Full interactivity is post-concept v1.

## Scope of this prompt

One route (`/propuestas/:id/ajustes`). Renders a high-fidelity layout of the Ajustes screen for a given propuesta id. No real editing — the UI is walkable, not operable. This prompt also hosts the Restrictions side-panel (next prompt composes it in).

**Not in scope:** real weight editing, real add/remove asset, Reclasificación sub-flow, multi-cartera tab interactivity (visual tabs render but clicks no-op), Formalizar action (separate prompt — but the entry button lives here).

## Required reads

1. `docs/briefs/awm-propuestas.md` — Phase 2 user stories for Ajustes: core adjustments, multi-cartera, cartera-modelo integration, Reembolso + Reclasificación (all static in concept).
2. `docs/briefs/awm-propuestas-demo-script.md` — walkthrough cues for this surface.
3. Five skills (`clean-code` / `accessibility` / `component-skill` / `token-skill` / `copy-skill`).
4. `docs/build-prompts/coherence-tabs.md`, `coherence-table.md`, `coherence-input.md`, `coherence-button.md`, `coherence-status-chip.md`, `coherence-page-header.md`.

## Primitives used

- `Tabs` — multi-cartera switcher (visually shows 1 or 2 tabs; for static surface, 1 cartera is default, 2nd tab visible but disabled with a tooltip "Multi-cartera: post-concepto").
- `Table` — positions list (asset, peso actual, peso objetivo, desviación, acciones).
- `Input` — weight fields (all `readonly` for the static surface).
- `Button` — page-level: Formalizar (primary), Guardar como borrador (ghost), Descartar (ghost danger). Row-level: Añadir activo (secondary).
- `StatusChip` — cartera-modelo connection indicator ("Modelo: Conservadora" or "Sin modelo asignado").
- `PageHeader` — title ("{propuesta name}"), breadcrumb back to Propuestas.

## Layout (prose)

Workspace shell. PageHeader at top with breadcrumb `Propuestas / {propuesta name}`.

Below header:
- Left (flex ~70%): the Ajustes body.
  - Top: cartera-modelo chip + "Ajustes de cartera" section title.
  - Middle: Tabs (one per cartera; for static, show 1 active + 1 disabled-with-tooltip).
  - Tab content: Table of positions. ~8 rows of realistic fake assets (ISIN, name, class). Columns: Activo | Peso actual | Peso objetivo | Desviación | ⋯. "Peso objetivo" shows editable-looking Input fields but `readonly`. Row-hover reveals a 3-dot Menu button.
  - Bottom-left: "Añadir activo" secondary Button.
- Right (flex ~30%): Restrictions side-panel (separate prompt composes here).

Bottom action bar: Guardar como borrador (ghost) · Descartar (ghost danger) · Formalizar (primary, right).

Motion: row hover → `hover-tint`; table sort animations → `list-reorder`; Formalizar button → `hover-lift`.

## Fake data

`apps/awm-propuestas/src/assets/data/ajustes.json` — one object per propuesta id, shape:

```ts
interface AjustesView {
  propuestaId: string;
  propuestaName: string;
  client: string;
  carteraModelo: string | null;   // 'Conservadora' | 'Moderada' | 'Agresiva' | null
  carteras: Array<{
    id: string;
    name: string;
    positions: Array<{
      isin: string;
      name: string;
      class: 'Renta variable' | 'Renta fija' | 'Monetario' | 'Alternativos';
      pesoActual: number;    // percentage 0-100
      pesoObjetivo: number;  // percentage 0-100
    }>;
  }>;
}
```

## Behavior requirements

1. Route resolves id → loads matching Ajustes object from fake JSON.
2. Tabs render; first is active, second (if present) disabled with tooltip.
3. Table renders positions; `pesoActual` + `pesoObjetivo` both display; `desviación` computed client-side.
4. All Inputs `readonly`. Click-on-Input emits `propuestas.ajustes.edit-attempt-static` event so we can count friction during the Tuesday demo.
5. "Añadir activo" Button emits `propuestas.ajustes.add-asset-attempt-static` event; does nothing visible (no-op for concept).
6. "Formalizar" Button → routes to `/propuestas/:id/formalizar`.
7. "Guardar como borrador" → routes back to `/propuestas` with a toast "Propuesta guardada como borrador." (use Coherence's Toast primitive if it exists; otherwise inline success banner).
8. "Descartar" → confirm Modal → on confirm, returns to `/propuestas`.

## Golden-flow instrumentation

- `propuestas.ajustes.step-start` — on route entry, stepOrdinal: 4.
- `propuestas.ajustes.edit-attempt-static` — each time a readonly Input is focused.
- `propuestas.ajustes.add-asset-attempt-static` — on "Añadir activo" click.
- `propuestas.ajustes.formalizar-clicked` — on Formalizar Button click.

## File structure

```
apps/awm-propuestas/src/app/ajustes/
├── ajustes.component.ts
├── ajustes.component.spec.ts
├── ajustes-data.service.ts
└── position-row.component.ts   # extracted row renderer if the template grows
```

## Pre-flight

Shared `_pre-flight.md`. Plus:

- Inputs have both `readonly` attribute AND visual styling that makes the read-only nature obvious (subtle, not a full grey-out — we want it to look *editable* so the surface doesn't read as broken).
- PageHeader breadcrumb is keyboard-reachable.
- No hardcoded hex anywhere even in the fake-data styling — all class-based.

## Out-of-scope

- Real weight editing logic.
- Multi-cartera actual switching (the disabled tab is the concept signal).
- Reclasificación sub-flow — surface it visually via a static banner at the top of the positions table ("Este tipo de operación puede implicar reclasificación fiscal"); no interactive Reclasificación UI in Tuesday concept.
- Cartera-modelo deviation flagging logic beyond the visual Chip.

## What success looks like

- `/propuestas/PROP-2026-0417-0001/ajustes` loads the Workspace shell with the full Ajustes layout populated from fake data, realistic content (real ISIN formats, real asset names, realistic peso percentages).
- Readonly Inputs display the pesos but don't let the user edit.
- Formalizar routes forward; Guardar as borrador returns to list; Descartar opens confirm.
- Restrictions side-panel (from the next prompt) docks cleanly on the right.

## If stuck

- If PageHeader doesn't yet support breadcrumb, build it per `docs/build-prompts/coherence-page-header.md` and back-link here.
- If the "look editable but readonly" visual is ambiguous, default to the `Input` primitive's `readonly` variant as-is — don't invent a custom style.
