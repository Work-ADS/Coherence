# Banco Cooperativo — Datos page (Figma alignment)

**Status:** shipped 2026-06-08 on `banco-cooperativo-redesign`
**Branch:** `banco-cooperativo-redesign`
**Created:** 2026-06-08
**Follows:** [`2026-06-08-banco-cooperativo-welcome-figma-align.md`](2026-06-08-banco-cooperativo-welcome-figma-align.md)

---

## Why this exists

After the welcome page landed in `549a51d`, the team handed over the **datos** Figma node: [file `rw0MpBWVyKNmLZIkLJ9oyS`, node `3:5975`](https://www.figma.com/design/rw0MpBWVyKNmLZIkLJ9oyS/Banco-Cooperativo---Sarevi---DEV?node-id=3-5975). The Figma surfaces several things that the welcome chunk didn't:

- A distinct **stepper component** sitting *below* the page title (not in the chrome bar), with mid-green outlined circles, solid green connecting lines, and a soft-yellow brushstroke under the active step's label.
- Section/card titles (h2) carry a similar soft-yellow brushstroke — that accent IS part of the system, just with a softer yellow (`#FEBD53`) than the bright `amarillo-espiga` (`#F2C40A`) I'd reverted entirely in the welcome chunk.
- A neutral gray **alert panel**, not the LK warning yellow.
- The full BC palette includes both yellows: bright **amarillo-espiga** is the LOGO color; soft **amarillo-suave** is the chrome accent.

This chunk applies those refinements to the BC route and gives the `<afi-stepper>` primitive a clean, opt-in accent slot so any brand theme can paint a stripe under the current label without forking the primitive.

## What this session ships

- **New color ramp** — `--color-banco-cooperativo-amarillo-suave-*` (anchor `#FEBD53`, 12 steps) in [`libs/tokens/colors-banco-cooperativo.scss`](../../libs/tokens/colors-banco-cooperativo.scss). The existing `amarillo-espiga` ramp stays reserved for the BC LOGO only — comment updated to make the distinction explicit.
- **Stepper swap** — BC datos no longer uses the inline `.steps` markup. The shared simulator page renders `<afi-stepper>` (the DS primitive) below the surface header, gated by `@if (brand() === 'banco-cooperativo')`. LK + Unicaja keep their in-topbar custom `.steps`.
- **afi-stepper primitive enhancement** (one cross-cutting edit) — [`libs/ui/src/stepper/stepper.component.scss`](../../libs/ui/src/stepper/stepper.component.scss) gains an optional current-step accent slot driven by `--stepper-current-accent-thickness` + `--stepper-current-accent-color`. Both default to `0` / `transparent`, so every existing consumer (LK, Unicaja, AFI, AWM, every primitive demo page) renders exactly the same. Brand themes opt in.
- **BC datos chrome** — scoped to `.lk-sarevi--banco-cooperativo`:
  - `.bc-stepper` overrides `--border-subtle`, `--foreground-tertiary-default`, and the new `--stepper-current-accent-*` slot to paint green connectors, green todo outlines + numbers, and the amarillo-suave brushstroke under "Datos".
  - `.card__title` — verde-cooperativo color + amarillo-suave underline (`--dimension-32` wide × `--dimension-0-75` tall). The page H1 (`.surface-header__title`) stays plain ink, matching Figma.
  - `.alert` — neutral gray panel (`--color-banco-cooperativo-neutral-100` background + ink-default text), replacing the LK warning yellow.
- **Welcome cards now use the real BC SVG illustrations** (`Property 1=Vivienda.svg` + `Property 1=Edificio.svg` from `Afi brand/.../assets/`, copied to `apps/site/src/assets/banco-cooperativo/`). Inline placeholder SVGs are gone.
- **"Datos actuales estimados" metric cards** at the bottom of the datos page are intentionally untouched per the user's request — they inherit BC tokens via the cascade.

## Coding standards

- **3-file rule** — no new components in this chunk; existing 3-file shape preserved.
- **Tokens only in SCSS** — every value in the new code flows through a CSS custom property (grep verified).
- **Brand-conditional scope** — every new SCSS rule keys on `.lk-sarevi--banco-cooperativo` or the `.bc-stepper` class (which only renders for BC).
- **No `::ng-deep`** — the stepper internals are reached only via CSS custom properties that cascade through view encapsulation. The primitive change is a token-driven opt-in slot, not a style leak.
- **Backward-compatible** — the primitive's new `--stepper-current-accent-*` slot defaults to invisible. Existing consumers unchanged.

## Pre-flight reads (in order)

1. [`AGENTS.md`](../../AGENTS.md)
2. [`docs/strategy/plan.md`](../strategy/plan.md)
3. [`docs/rules/component-skill.md`](../rules/component-skill.md)
4. [`docs/rules/token-skill.md`](../rules/token-skill.md)
5. [`libs/tokens/semantic.scss`](../../libs/tokens/semantic.scss) lines 688–746 — BC binding
6. [`libs/tokens/colors-banco-cooperativo.scss`](../../libs/tokens/colors-banco-cooperativo.scss) — both yellow ramps
7. [`libs/ui/src/stepper/stepper.component.{ts,html,scss}`](../../libs/ui/src/stepper/) — primitive + new accent slot
8. [`apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.{ts,html,scss}`](../../apps/site/src/app/pages/demos/laboral-kutxa-sarevi/) — shared simulator + BC overrides

## Sources of truth

- **Figma (primary)** — [Banco Cooperativo · Sarevi · DEV, node `3:5975`](https://www.figma.com/design/rw0MpBWVyKNmLZIkLJ9oyS/Banco-Cooperativo---Sarevi---DEV?node-id=3-5975). Variables: `Primary/primary/base = #007a5d`, `secondary/base = #febd53`, `Alert/background/default = #f2f2f2`, `Border/default = #dddddd`.
- **Brand-authored choice card illustrations** — `Afi brand/Banco Cooperativo example screens/Banco cooperativo/assets/Property 1=Vivienda.svg` + `Property 1=Edificio.svg`. Colors baked into the SVGs (#007A5D primary + #6EC5AF mint) per the Figma.

## Locked decisions (2026-06-08)

1. **Two yellows in BC** — `amarillo-espiga` (#F2C40A) is the LOGO color; `amarillo-suave` (#FEBD53) is the chrome accent. They never mix in chrome.
2. **Stepper is a DS primitive on BC** — the shared page renders `<afi-stepper>` below the surface header. LK + Unicaja remain on the legacy `.steps` markup in the topbar (their visual contract still works there).
3. **`<afi-stepper>` accent slot is opt-in via tokens** — `--stepper-current-accent-thickness` + `--stepper-current-accent-color`. Default invisible. Any brand can adopt the stripe by setting the tokens on a wrapper.
4. **Connectors stay verde-cooperativo on BC** even between todo segments — achieved by overriding `--border-subtle` inside `.bc-stepper`. CSS variable scoping handles it cleanly; no ::ng-deep.
5. **Card titles get the accent, page H1 does not** — Figma reserves the brushstroke for section heads (`.card__title`, h2), not the page hero (`.surface-header__title`, h1).
6. **Alert goes neutral gray on BC** — matches the Figma's `Alert/background/default` panel.

## Files

**New:**
- `apps/site/src/assets/banco-cooperativo/icon-vivienda.svg`
- `apps/site/src/assets/banco-cooperativo/icon-edificio.svg`

**Edit:**
- `libs/tokens/colors-banco-cooperativo.scss` — added `amarillo-suave` ramp; clarified `amarillo-espiga` comment to mark it LOGO-only.
- `libs/ui/src/stepper/stepper.component.scss` — added optional `--stepper-current-accent-*` token slot under the active label. Backward-compatible default.
- `apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.ts` — imports `StepperComponent` + `StepperItem`; exposes `stepperItems`, `currentStepIndex`, `onStepperClicked`.
- `apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.html` — gates the legacy `<nav class="steps">` to non-BC brands; renders `<afi-stepper class="bc-stepper">` inside the datos `.surface` for BC; swaps welcome choice-card inline SVGs for real `<img>` references to the BC SVG assets.
- `apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.scss` — `.bc-stepper` token overrides; `.card__title` espiga underline; `.alert` gray panel; choice-card image rule (`.bc-choice-card__img`) replacing the prior `svg-fill` / `svg-line` rules.

## Out of scope (called out)

- **`<afi-segmented-control>`** (the Piso / Chalet adosado / Chalet independiente switcher; the Sí / No toggles) — the Figma renders these as larger radio-cards with yellow dots, which would require a primitive variant. Not in this chunk. The current segmented control still works, just doesn't look like the Figma's radio-cards yet.
- **Numeric input unit suffix in espiga yellow** (e.g. "m²", "habitantes") — the `<afi-input>` primitive doesn't expose a suffix slot we can token-drive yet. Logged as a follow-up.
- **Medidas + resumen page Figma alignment** — separate per-page briefs. The token + chrome work here (card title underline, alert, stepper accent slot) will cascade automatically when those routes get their per-page restyle.
- **Energy ramp A→G styling** — the existing `.energy-label` styling is intentionally untouched in this chunk.

## Follow-ups (queued)

- `2026-XX-XX-segmented-control-radio-card-variant.md` — add a `variant: 'radio-card'` to `<afi-segmented-control>` so BC can render Sí/No and the housing-type picker as large cards with corner radio dots.
- `2026-XX-XX-afi-input-suffix-slot.md` — token-driven suffix color so BC numeric inputs can color "m²" / "habitantes" in amarillo-suave.
- `2026-XX-XX-banco-cooperativo-medidas-figma-align.md`
- `2026-XX-XX-banco-cooperativo-resumen-figma-align.md`

## Exit criteria

- [x] `/demos/sarevi-banco-cooperativo/demo` → click Vivienda → datos route shows `<afi-stepper>` below the section title; "Datos" current with amarillo-suave underline; "Medidas" + "Resumen" todo with green outline.
- [x] Card titles ("Caso de reformas", "Certificado de eficiencia energética", etc.) render in verde-cooperativo with the amarillo-suave brushstroke.
- [x] Alert panel is neutral gray.
- [x] Welcome choice cards show the real BC SVG illustrations (Vivienda + Edificio).
- [x] LK + Unicaja datos: legacy `.steps` markup, no `<afi-stepper>`, no `.bc-stepper`. Token grep over the new code: 0 hex/rgb/rgba hits.
- [x] `<afi-stepper>` consumers outside BC (any other route, any primitive page): unchanged — the accent slot is opt-in.
