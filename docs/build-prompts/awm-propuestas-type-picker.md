# Build — AWM Propuestas type picker (`apps/awm-propuestas/src/app/type-picker/`)

**Brief:** `docs/briefs/awm-propuestas.md`
**Surface:** Propuesta-type picker (Phase 2 surface #2)
**Golden-flow step(s):** 2 (type picker opens) and 3 (type selected → Ajustes loads)
**Status:** interactive for Tuesday 2026-04-21.

## Scope of this prompt

The type-picker modal that opens at `/propuestas/new`. Four options as **visual preview cards** — not a plain dropdown.

**Not in scope:** auto-naming logic (runs invisibly on type select; the actual name-generation utility lives in a shared helper). Ajustes surface (next prompt).

## Required reads (in order)

1. `docs/briefs/awm-propuestas.md` — Phase 2 user story for type picker.
2. `docs/clean-code.md` · `docs/accessibility.md` · `docs/component-skill.md` · `docs/token-skill.md` · `docs/copy-skill.md`.
3. `docs/build-prompts/coherence-modal.md` — the hosting primitive.
4. `docs/build-prompts/coherence-card.md` — each type is a Card variant.
5. `docs/build-prompts/coherence-button.md` — cancel + "Continuar" actions.

## Primitives used

- `Modal` (host).
- `Card` (the 4 type options — selectable variant).
- `Button` (primary Continuar, ghost Cancelar).
- `StatusChip` — optional "próximamente" chip on Reembolso + Modificación libre if v1 happens to defer them. (For the post-concept v1 they're real; for the Tuesday concept they're functional, not "coming soon" — confirm at build time against brief state.)

## Behavior requirements

1. Opens as a modal overlay on top of `/propuestas` — list page stays visible behind a backdrop.
2. Title (Roboto Serif, h2): "Nueva propuesta".
3. Subtitle (Roboto sans, body-sm): "¿Qué tipo quieres crear?"
4. 4 Cards in a 2×2 grid:
   - **Nueva** — "Crear una cartera desde cero." Icon: sparkles.
   - **Rebalanceo** — "Ajustar una cartera existente a sus pesos objetivo." Icon: scale.
   - **Modificación libre** — "Editar posiciones sin ceñirte a un modelo." Icon: edit.
   - **Reembolso** — "Solicitar una retirada parcial o total." Icon: download.
5. Click on a Card → selects it (visual "selected" variant + radio semantics: `aria-checked="true"` on the chosen one). Only one can be selected.
6. "Continuar" Button bottom-right — disabled until a type is selected.
7. On Continuar: call `generatePropuestaName(type, client)` helper → stash the new propuesta in a local in-memory store → route to `/propuestas/:id/ajustes` with the generated id.
8. "Cancelar" Button bottom-left or `Esc` → close modal, return to `/propuestas`.
9. Keyboard navigation: Tab cycles through the 4 Cards + Continuar + Cancelar. Enter on a focused Card selects it. Arrow keys also move between Cards (like a radiogroup).

## Golden-flow instrumentation

- `propuestas.type-picker.opened` — on modal open.
- `propuestas.type-picker.type-selected` — carries type name.
- `propuestas.type-picker.continued` — carries type + generated id.
- `propuestas.type-picker.cancelled` — on Esc / Cancelar.

## File structure

```
apps/awm-propuestas/src/app/type-picker/
├── type-picker.component.ts
├── type-picker.component.spec.ts
├── propuesta-name.util.ts   # generatePropuestaName helper
└── propuesta-types.data.ts  # the 4 type definitions (title, description, icon key)
```

## Out-of-scope

- Actual auto-naming rule logic (use a stub that returns `PROP-{YYYY}-{MMDD}-{sequential}` — real convention per Granola is contrato + client initials + year + day + sequential; post-concept refinement).
- Ajustes destination (separate prompt).
- "Coming soon" states for Reembolso / Modificación libre — v1 scope says these are real.

## Pre-flight

Run `_pre-flight.md`. Plus:

- Modal traps focus inside; Esc closes; restore focus to the trigger Button after close.
- All 4 Cards are reachable by keyboard; arrow keys move between them; screen reader announces them as a radiogroup.
- Continuar stays disabled visually AND in the DOM until a selection is made.

## What success looks like

- Click "Nueva propuesta" on the list page → modal opens with 4 Cards and focused on the first one.
- Arrow-down moves focus to the second Card; Enter selects it; Continuar becomes enabled.
- Click Continuar → modal closes, route transitions to `/propuestas/new-id/ajustes`.
- Esc at any point closes and returns to the list.

## If stuck

- If Card doesn't have a "selectable" variant yet, add it to `libs/ui/card/` via a change to `coherence-card.md` first. Don't fork locally.
- If the radiogroup pattern conflicts with Card's default role, use `role="radiogroup"` on the 2×2 container and `role="radio"` on each Card — overriding the Card's default role is fine here per `accessibility.md`.
