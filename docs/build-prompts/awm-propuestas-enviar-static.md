# Build — AWM Propuestas Enviar para firma, static (`apps/awm-propuestas/src/app/enviado/`)

**Brief:** `docs/briefs/awm-propuestas.md`
**Surface:** Enviar para firma success state (Phase 2 surface #6)
**Golden-flow step(s):** 7 (Signaturit handoff) and 8 (state transition to Enviado para firma, back to list)

## Scope of this prompt

Route `/propuestas/:id/enviado`. A short success surface that confirms the propuesta was "sent to Signaturit" (stubbed), updates the local store, and offers the gestor a clean path back to the list.

**Not in scope:** real Signaturit integration, real state persistence (the in-memory store from the app scaffolding is enough for concept), SMS redirect flow.

## Required reads

1. `docs/briefs/awm-propuestas.md` — Phase 2 user story for Enviar para firma.
2. Five skills.
3. `docs/build-prompts/coherence-button.md`, `coherence-status-chip.md`, `coherence-loading-badge.md`.

## Primitives used

- `StatusChip` — shows the new state "Enviado para firma" prominently.
- `LoadingBadge` — brief "Enviando a Signaturit…" spinner state for ~1.5s to simulate the handoff (then transitions to success).
- `Button` — "Volver a propuestas" (primary), "Ver propuesta" (ghost secondary).

## Layout (prose)

Workspace shell. Centered content card (max-width ~640px). Sequence of states over ~1.5 seconds:

**State 1 — "sending" (0–1200ms):**
- Large LoadingBadge with "Enviando a Signaturit…"
- Sub-copy: "Estamos preparando la propuesta para la firma del cliente."

**State 2 — "sent" (after 1200ms):**
- Large success iconography (use `status.positive` semantic token).
- Heading (Roboto Serif, h2): "Propuesta enviada para firma"
- Sub-copy: "{client name} recibirá un SMS con el enlace de firma en los próximos minutos."
- Propuesta summary card (name, state chip "Enviado para firma", client, cartera).
- Actions: "Volver a propuestas" (primary), "Ver propuesta" (ghost).

## Behavior requirements

1. On route entry, mark the propuesta's state as `'enviado-para-firma'` in the in-memory store (so when user returns to `/propuestas`, the row reflects the new state).
2. Simulated loading runs for 1200ms (use a signal + `setTimeout`; respect `prefers-reduced-motion` by jumping straight to "sent" state without the delay).
3. "Volver a propuestas" → routes to `/propuestas`.
4. "Ver propuesta" → routes to `/propuestas/:id/ajustes` (read-only mode in post-concept v1; in Tuesday concept, same screen).
5. If the user navigates back via browser-back after state 2, don't re-run the simulated loading.

## Golden-flow instrumentation

- `propuestas.enviado.step-start` — stepOrdinal: 7 (fires immediately on route entry).
- `propuestas.enviado.handoff-complete` — fires after the simulated 1200ms (or immediately with `prefers-reduced-motion`).
- `propuestas.enviado.action-clicked` — carries action name (volver / ver).

## File structure

```
apps/awm-propuestas/src/app/enviado/
├── enviado.component.ts
├── enviado.component.spec.ts
└── signaturit-stub.service.ts  # fake async handoff — real service swaps here in v1.5
```

## Pre-flight

Shared `_pre-flight.md`. Plus:

- `prefers-reduced-motion: reduce` skips the 1200ms delay entirely.
- Focus moves to the "Volver a propuestas" Button when state transitions to "sent".
- Screen reader announces state change via `aria-live="polite"` on the main content container.

## Out-of-scope

- Real Signaturit SDK integration.
- SMS delivery (Signaturit handles on the real integration).
- Persisting state beyond the in-memory store.
- Email confirmation / audit trail.

## What success looks like

- Routing from Formalizar → `/propuestas/:id/enviado` → 1.2s of "Enviando a Signaturit…" → transitions to success state with the client's name quoted in the sub-copy.
- Back on `/propuestas`, the propuesta row's state chip now reads "Enviado para firma" — proves the in-memory store updated.
- Golden-flow step 7 event fires on entry; step 8 event (return to list) fires when "Volver a propuestas" is clicked — this closes the metric-D time window.

## If stuck

- If there's no `LoadingBadge` primitive built, check `coherence-loading-badge.md` — if it exists as a prompt, build it first.
- Don't cheat the 1200ms — use a real `setTimeout` with a signal update. The simulated latency is part of selling the "Signaturit is real" illusion during the Tuesday demo.
