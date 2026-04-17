# Build — AWM Propuestas Restrictions side-panel, static (`apps/awm-propuestas/src/app/restrictions-panel/`)

**Brief:** `docs/briefs/awm-propuestas.md`
**Surface:** Restrictions side-panel (Phase 2 surface #6 — Restrictions — real-time LOCKED for v1; **static read-only for Tuesday concept**)
**Golden-flow step(s):** 5 (stays visible while gestor edits)

## Scope of this prompt

A side-panel component composed into the Ajustes route from the previous prompt. Static read-only display of regulatoria / ESG / contrato restrictions.

**Not in scope:** real-time validation (post-concept v1), blocking/enforcing actions, editing restrictions.

## Required reads

1. `docs/briefs/awm-propuestas.md` — Phase 2 Restrictions user story.
2. Five skills.
3. `docs/build-prompts/coherence-status-chip.md`, `coherence-tooltip.md`, `coherence-tabs.md`.

## Primitives used

- `Tabs` — Regulatoria | ESG | Contrato (three segments of restrictions).
- `StatusChip` — per-restriction status: `ok` (green), `atención` (amber), `restringido` (red).
- `Tooltip` — on hover over a restriction row, shows the regulation reference code (e.g., MIFID II Art. 24).

## Layout (prose)

A docked panel inside the Ajustes route's right column. Width ~320px. Header: "Restricciones" (Roboto Serif, h3). Below header: Tabs with 3 segments. Active segment shows a list of restrictions, each row: StatusChip + restriction name + optional amount threshold (e.g., "Exposición a renta variable ≤ 70%"). Hover reveals tooltip with regulation reference.

Sticky header + scrollable body.

## Fake data

`apps/awm-propuestas/src/assets/data/restrictions.json`:

```ts
interface RestrictionsView {
  propuestaId: string;
  regulatoria: Array<Restriction>;
  esg: Array<Restriction>;
  contrato: Array<Restriction>;
}
interface Restriction {
  id: string;
  name: string;                  // e.g. 'Exposición a renta variable'
  threshold: string | null;      // e.g. '≤ 70%' or null for qualitative
  status: 'ok' | 'atencion' | 'restringido';
  reference: string;             // e.g. 'MIFID II Art. 24' — shown in Tooltip
  rationale?: string;            // e.g. 'Perfil conservador del contrato'
}
```

Seed ~5 items per tab with a mix of statuses — enough to show the panel isn't trivial but not overwhelming.

## Behavior requirements

1. Static display only. No inputs, no actions.
2. Tabs switch segment content.
3. Hovering a row reveals Tooltip with `reference` + `rationale`.
4. Status colors use semantic status tokens — `status.positive` / `status.warning` / `status.negative`. Never hex.
5. "Close panel" is NOT in scope for Tuesday concept — the panel is always docked.

## Golden-flow instrumentation

- `propuestas.restrictions-panel.tab-switched` — carries segment name.
- `propuestas.restrictions-panel.hovered` — carries restriction id.

## File structure

```
apps/awm-propuestas/src/app/restrictions-panel/
├── restrictions-panel.component.ts
├── restrictions-panel.component.spec.ts
└── restrictions-data.service.ts
```

## Pre-flight

Shared `_pre-flight.md`. Plus:

- Three Tabs are keyboard-navigable (Tab to enter the tablist, arrow keys between segments).
- Tooltip is screen-reader accessible (use `aria-describedby` pattern per `coherence-tooltip.md`).
- Status colors respect the `prefers-contrast` media query where Coherence tokens support it.

## Out-of-scope

- Real-time validation logic.
- Editing restrictions.
- Bulk action on restrictions.
- Backend data wiring.

## What success looks like

- Inside the Ajustes route, a 320px panel docks right, headed "Restricciones".
- Three tabs cycle: Regulatoria (5 items) / ESG (5 items) / Contrato (5 items).
- Each row shows a status chip + name + threshold; hover → tooltip with MIFID II Art. 24 style reference.
- Nothing blocks or warns the user — the panel is passive.

## If stuck

- If Tooltip primitive is missing, build it first via `coherence-tooltip.md`.
- If no semantic status color exists for "atención" (warning), check `libs/tokens/semantic/status.json` — if missing, escalate as a Token Guardian gap; do not invent a color.
