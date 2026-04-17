# Build — AWM Propuestas Formalizar PDF preview, static (`apps/awm-propuestas/src/app/formalizar/`)

**Brief:** `docs/briefs/awm-propuestas.md`
**Surface:** Formalizar → PDF preview (Phase 2 surface #5)
**Golden-flow step(s):** 6 (PDF preview opens)

## Scope of this prompt

A Modal overlay at route `/propuestas/:id/formalizar`. Renders a styled HTML preview of the propuesta as-if-it-were-a-PDF. In v1.5 the HTML swaps for a real PDF engine — UI stays the same.

**Not in scope:** real PDF generation, binary download, print-dialog integration, email the PDF. Enviar para firma (next prompt — the primary action on this modal routes there).

## Required reads

1. `docs/briefs/awm-propuestas.md` — Phase 2 user story for Formalizar.
2. Five skills.
3. `docs/build-prompts/coherence-modal.md`, `coherence-button.md`.

## Primitives used

- `Modal` (host, large size — `size="xl"` or equivalent).
- `Button` — "Enviar para firma" (primary), "Volver a ajustes" (ghost).

## Layout (prose)

Modal at 960×720 (letter-size-ish ratio). Inside the modal, a vertically scrollable "PDF-styled" page with:

- Letterhead: AFI Wealth Manager logo top-left (reuse from `Coherence/Afi brand/`), date top-right.
- Propuesta ID + name.
- Client block: name, cartera, modelo (if present).
- Positions table (re-render from the Ajustes data — same JSON source).
- Summary block: totals, weighted average expected return (calculated from fake data), restrictions summary (read off restrictions JSON).
- Disclosures: Spanish legalese placeholder paragraph at the bottom.
- Signature block: "Firma del cliente" line (empty).

Modal action bar: "Volver a ajustes" (ghost, left), "Enviar para firma" (primary, right).

Motion: modal entry uses `enter-slide-up` template per `motion-templates.md`. Exit uses `exit-fade-contract`.

## Behavior requirements

1. Route navigated from Ajustes "Formalizar" Button → Modal opens with the PDF preview.
2. Modal traps focus. Esc closes and routes back to `/propuestas/:id/ajustes`.
3. Scrollable content area; the action bar stays sticky at the bottom of the modal.
4. "Volver a ajustes" → routes back (same as Esc).
5. "Enviar para firma" → routes to `/propuestas/:id/enviado` (next prompt handles the success state).
6. No download / print actions in concept — neither button renders.

## Fake rendering

The propuesta content re-renders from the same `ajustes.json` that backs the Ajustes route. Visual shape of the "PDF page" should read as a formal document — wider top margin, Roboto Serif for headings, tabular figures for numbers, hairline borders on the positions table. Deliberately different from the Ajustes UI — this is the "formal artifact" register.

## Golden-flow instrumentation

- `propuestas.formalizar.step-start` — on modal open, stepOrdinal: 6.
- `propuestas.formalizar.confirmed` — on Enviar para firma click (this is the `time-to-enviar` metric D stop-clock event).
- `propuestas.formalizar.cancelled` — on Volver a ajustes / Esc.

## File structure

```
apps/awm-propuestas/src/app/formalizar/
├── formalizar.component.ts
├── formalizar.component.spec.ts
└── formalizar.styles.ts  # the "PDF page" Tailwind class map
```

## Pre-flight

Shared `_pre-flight.md`. Plus:

- Modal is at least 960px wide — but on narrower viewports falls back to full-screen (per `coherence-modal.md` default).
- Body scroll locks while modal is open.
- Focus returns to the "Formalizar" Button on the Ajustes screen when the Modal closes via Esc or Volver.

## Out-of-scope

- Real PDF engine.
- Downloadable PDF link.
- Print dialog.
- Signaturit integration (next prompt).

## What success looks like

- Click "Formalizar" on Ajustes → Modal slides up from bottom with the PDF-styled preview rendered from real fake data.
- Scroll the preview; content is formally typeset, Roboto Serif headings, tabular numbers.
- "Enviar para firma" → routes to success state, emits the metric-D stop event.
- Esc closes cleanly and returns to Ajustes.

## If stuck

- If `Modal` size `"xl"` isn't a variant yet, add it via an edit to `coherence-modal.md` — don't fork local styles.
- If the AFI logo SVG isn't in the app assets, copy from `/Users/richardgriner/Desktop/Coherence/Afi brand/` at build time (don't bundle the whole folder; just the needed SVG).
