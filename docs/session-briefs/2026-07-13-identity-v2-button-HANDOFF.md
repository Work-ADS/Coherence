# Identity v2 — Button · session HANDOFF (pick up here)

**Date:** 2026-07-13 · **Branch:** `feat/identity-v2`
**Companion brief:** [2026-07-13-identity-v2-button-input.md](2026-07-13-identity-v2-button-input.md) (see its "Build notes" section too)
**State:** Button built + verified in the browser. **Nothing is committed yet** — the working tree holds all of it. Input not started (on hold, see below).

---

## 1. Where we are

`afi-button-v2` is done: 4 variants (primary / secondary / ghost / destructive) × 4 sizes (xs / sm / lg / md) × states default / hover / focus / pressed / disabled / loading. It renders only inside a `[data-foundation="modern"]` scope; the legacy `afi-button` is untouched. Verified live at `/demos/foundations-modern/workbench` (dev server was on port 4203 this session): computed styles match Figma exactly, focus ring works via `:focus-visible`, loading sets `aria-busy` + announces "Cargando…", destructive hover brightens, press-nudge fires.

Two post-review changes Richard asked for on 2026-07-13 are **already applied**: a real **destructive hover** and a **press-nudge** on all buttons. Both are documented as code proposals below and need the Figma file updated to match (prompt in §5).

---

## 2. Files in the working tree (uncommitted)

**New primitive** — `libs/ui/src/button-v2/`
- `button-v2.component.ts` — `ButtonV2Component`, selector `afi-button-v2`
- `button-v2.component.html` — label wrapped in `.btn-v2__label` span (so the press-nudge can move content)
- `button-v2.component.scss` — all variant/size/state styling
- `button-v2.variants.ts` — `ButtonV2Variant`, `ButtonV2Size` type exports
- `index.ts` — barrel

**New token file** — `libs/tokens/foundations-modern/component-button.scss`
Hand-authored (NOT generated). Holds the Figma effect styles + gradient fills that can't be Figma variables (raised/pressed shadows, face gradients, destructive hover gradient, XS type overrides). Lives here — not in the component SCSS the brief suggested — because the pre-commit hook blocks raw hex inside `libs/ui/**`. Same values, one layer down, hook-exempt.

**Wiring**
- `libs/ui/public-api.ts` — exports `ButtonV2Component` + types
- `apps/site/src/styles.scss` — imports `foundations-modern/index` + `foundations-modern/component-button` (both inert for legacy pages; everything scoped under `[data-foundation="modern"]`)
- `apps/site/src/app/pages/demos/demos.routes.ts` — route `foundations-modern/workbench`
- `apps/site/src/app/pages/demos/demos.landing.ts` — "Identidad v2 — workbench" card
- `apps/site/src/app/pages/demos/foundations-modern-workbench/` — the workbench page (3 files)

**Docs**
- This file + the "Build notes" appended to the companion brief.

**Commit when ready** (Richard's convention — plain, no `--no-ff`; print both remotes):
```bash
git add -A && git commit   # message describing the v2 button + workbench
git push github feat/identity-v2
# Azure (origin-afi): open PR via the web UI — PR-only, no direct push
```

---

## 3. The two 2026-07-13 changes, in detail

### Destructive hover (was broken in Figma)
In Figma, `Destructive/Hover` renders pixel-identical to `Destructive/Default` — pixel-sampled to confirm. The opaque face gradient (error/700 → error/500) covers the base-fill swap (700 → 500) bound underneath, so the hover never shows.

**Code fix (proposal):** added `--button-face-destructive-hover` in `component-button.scss` — the same gradient structure shifted one error step brighter:
- default face: `error-700 0%` → `error-700 63.5%` → `error-500 100%`
- hover face:   `error-500 0%` → `error-500 63.5%` → `error-300 100%`

Applied via `&--destructive:hover:not(:disabled)::before { background: var(--button-face-destructive-hover); }`. Verified: hovered destructive reads clearly brighter than resting, not washed out. **Figma still needs updating to match — see §5.** Once Figma is fixed and re-synced, this proposal token can be reconciled with whatever the designer finalizes.

### Press-nudge ("letters go down a bit")
On press, the label + icons sink one hairline step (`--dimension-0-25`) via `transform: translateY(...)`, pairing with the inset pressed shadow so the button reads as physically depressed. This deliberately moves only the projected content (not the whole box) for the "inset" feel — pseudo-elements stay put. Currently on **press only** (`:active`), not hover — that's the standard tactile meaning. If Richard wants it on hover too, add the same transform under `&:hover:not(:disabled) > *`.

---

## 4. Answers to Richard's open questions

**"No spec file / zero test infra?"** — The build pre-flight (`docs/build-prompts/_pre-flight.md`) has a checkbox: "Spec file exists and runs" (`ng test`). But this repo has **no test runner configured at all** — zero `*.spec.ts` files anywhere in `libs/` or `apps/`, no `karma`/`jest`/`jasmine` in `package.json`, and no `test` script. So that pre-flight box is impossible to close for *any* primitive right now, not just the button. It's a repo-wide gap (test tooling was never set up), not something the button is missing. Nothing to fix in this session — just flagging that "add a spec" isn't actionable until someone wires up a runner.

**"Secondary gets the hover of surface, right?"** — Almost: secondary uses the **control** hover, not the surface hover. Secondary is a neutral filled control, so it lives in the Control-neutral token bucket: default `--control-background-default` (#f9fafb) → hover `--control-background-hover` (#f2f4f7) → pressed `--control-background-active` (#e4e7ec). That's the neutral-control equivalent of a surface hover — the right token for a control. (The surface hover `--background-hover` resolves to #f5f5f5, a hair different.) It's already wired and working.

---

## 5. Figma update prompt (paste into the Figma-connected session)

> In the file **AFI-FOUNDATIONS-MODERN** (`xa3QosoCWiPdvRvgfQ5FaE`), Button component set (node `2383:5319`), fix the **Destructive / Hover** state. Right now Destructive/Hover is visually identical to Destructive/Default because the opaque face gradient hides the base-fill swap underneath.
>
> Make the hover clearly brighter than the default. Preferred approach (matches the shipped code): give the Destructive/Hover frame its own face gradient fill, one error step brighter than default —
> - default face gradient: `error/700` at 0%, `error/700` at 63.5%, `error/500` at 100% (180°)
> - **hover face gradient: `error/500` at 0%, `error/500` at 63.5%, `error/300` at 100% (180°)**
>
> Alternative (more consistent with Primary): make the destructive face gradient semi-transparent like Primary's sheen so the bound base swap (`brand`/error 700 → 500) shows through on hover instead of a second explicit gradient. Pick one; the code currently implements the explicit-gradient approach.
>
> Also add a **press micro-detail to the Pressed frames** (optional, for design ↔ code parity): the label + left/right icon slots offset down by 1px in the Pressed state, matching the code's press-nudge. This is a static representation of a code-only transition.
>
> After the change, re-sync tokens: `node tools/figma-sync/generate-foundations.mjs` regenerates the scoped token mirror; the destructive hover gradient may then move from the hand-authored `libs/tokens/foundations-modern/component-button.scss` into the generated set if it becomes variable-bound.

---

## 6. Next: input (ON HOLD)

The Figma **Input page (`2280:1134`) is empty** — Richard deleted those pages; input work now happens out of a separate "component playground," not this foundations file. So the input build waits on either (a) the playground's input component, or (b) building from the Granola spec in the companion brief: sizes SM/MD/LG, states default/hover/focus/error/disabled/read-only, label + help text + prefix/suffix (text and icon). The legacy `afi-input` (`libs/ui/src/input/`) is a good structural reference — same 3-file shape, label/hint/error a11y wiring, prefix/suffix adornment shell — rebuild it against foundations-modern tokens as `afi-input-v2`.

---

## 7. Quick-reference token values (so a fresh session needn't re-read Figma)

Effect styles (in `component-button.scss`, commented with Figma names):
- **Raised/primary:** `inset 0 -1px 0 1px #000000cc, inset 0 0 0 1px #303030, inset 0 0.5px 0 1px #ffffff40`
- **Raised/neutral (secondary):** `inset 0 -1px 0 0 #b5b5b5, inset 0 0 0 1px #0000001a, inset 0 0.5px 0 1.5px #ffffff`
- **Raised/danger (destructive):** `inset 0 -1px 0 1px #8e1f0bcc, inset 0 0 0 1px #b5260bcc, inset 0 0.5px 0 1.5px #ffffff59`
- **Pressed/primary:** `inset 0 1px 8px 0 #000000e5, 0 4px 10px 0 #00000029` (inner blur 8)
- **Pressed/secondary:** `inset 0 1px 2px 0 #3e3e3ee5, 0 4px 10px 0 #00000029` (inner blur 2 — intentionally different)

Sizes → `--height-component-{xs|sm|md|lg}` = 24 / 28 / 32 / 40px. Padding-inline → `--pad-control-{xs|sm|lg}` = 6 / 8 / 12px (md+lg both use `pad-control-lg`). Gap → `--gap-control-{xs|sm|md}` = 2 / 4 / 6px. Radius `--radius-md` = 6px. Type = IBM Plex Sans Medium 13/18 (SM–LG), 12/16 (XS via `--button-font-size-xs` / `--button-line-height-xs`). Focus ring = `--stroke-focus` (2px) solid `--borders-focus` (#4c8dff, placeholder until Borja's brand accent).
