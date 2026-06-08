# Banco Cooperativo — Demo visual redesign

**Status:** superseded 2026-06-08
**Superseded by:** [`2026-06-08-banco-cooperativo-welcome-figma-align.md`](2026-06-08-banco-cooperativo-welcome-figma-align.md) — the team handed over the official Sarevi Figma after this brief shipped. The chrome inferred here (dark verde-oscuro band + espiga-yellow underlines) was reverted on the same branch and rebuilt to match the Figma.
**Branch:** `banco-cooperativo-redesign` (cut from `main` at `0b89996`, pushed to `github` 2026-06-08)
**Created:** 2026-06-08
**Plan reference:** [`/Users/richardgriner/.claude/plans/this-is-a-different-nested-rain.md`](../../.claude/plans/this-is-a-different-nested-rain.md)

---

## Why this exists

The Banco Cooperativo (BC) demo at `/demos/sarevi-banco-cooperativo/demo` shares the `LaboralKutxaSareviPage` component with Laboral Kutxa and Unicaja — a 4-screen Sarevi 360 energy-retrofit wizard differentiated by route data + BC brand tokens. The whitelabel plumbing works, but BC's chrome was never tuned to *look* like an authentic Banco Cooperativo product. Today it reads as "Sarevi with green colors" instead of "Banco Cooperativo".

This session restyles the chrome — and only the chrome — on the BC route so it matches the visual language of BC's live mortgage product (green header, espiga-yellow accent stripes, card-based forms, light canvas surfaces). Sarevi's screens, fields, and flow are untouched. LK + Unicaja chrome is untouched. We change values inside the existing token architecture; we do not rearchitect anything.

This is also the whitelabel proof: if BC tokens applied to the same shared component produce an authentic-feeling BC product, the architecture is validated for the next brand.

## What this session ships

A BC-only visual restyle of the existing 4-screen Sarevi wizard, scoped via `[data-sarevi-brand="banco-cooperativo"]` so LK + Unicaja remain untouched. No new screens, no rearranged fields, no new primitives.

**Locked styling targets:**
- **Header** — green BC bar, BC logo left (matches `Banco Cooperativo screens-1.png`)
- **Stepper** — existing `<afi-stepper>` markup unchanged; espiga-yellow current-state via token value
- **Form chrome** — existing markup (cards, inputs, selects, segmented controls, checkboxes) unchanged; restyled via BC token values for canvas, surface, border, control-foreground, accent
- **Results bento** — existing markup unchanged; chrome moved to BC card pattern (white surfaces on light canvas, espiga accent stripes on section heads)
- **Footer** — BC cooperativa link block + Ruralvía logo, brand-conditional. Allowed as a small site-local 3-file component if reused; otherwise a template-conditional block. Markup-level, not structural.

Plus: an iteracion-5 page snapshot and a novedades card.

## Coding standards

Non-negotiable, inherited from prior briefs:

- **3-file rule** — `.ts` + `.html` + `.scss`, no inline template / styles. Applies to any new component (e.g. an optional `<site-bc-footer>`).
- **Reuse primitives** — every UI element keeps its existing `<afi-*>` primitive. No bespoke HTML to mimic a primitive. No new libs/ui primitives.
- **Tokens only in SCSS** — no hex / rgb / bare px in `.scss` outside `libs/tokens`. Every color, radius, spacing, border, shadow flows through a semantic token.
- **Sarevi markup is locked** — `.html` for the shared simulator gets edited *only* if a template-level slot is required (e.g. footer block). No fields added, removed, rearranged, or restyled structurally.

## Token strategy (locked)

Work *inside* the existing `libs/tokens/` architecture. No new architecture, no one-off SCSS values outside the token system. Order of preference for any styling change:

1. **Adjust the BC value bound to an existing semantic role** in the `[data-brand="banco-cooperativo"]` block of [`libs/tokens/semantic.scss`](../../libs/tokens/semantic.scss) (lines 688–744). Re-bind via the `coherence-brand-bind` mixin args first; explicit overrides only when the mixin doesn't reach the role.
2. **Add a new BC color step** to [`libs/tokens/colors-banco-cooperativo.scss`](../../libs/tokens/colors-banco-cooperativo.scss) if a value isn't in the existing ramps (verde-oscuro / verde-cooperativo / amarillo-espiga / neutral / neutral-variant).
3. **Add a new semantic role** to `libs/tokens/semantic.scss` *only* if multiple brands would use it. If BC-only, the override lives inside the BC binding block.
4. **One-off SCSS values in the page file are forbidden.** Every value goes through a token.

## Pre-flight reads (in order)

1. [`AGENTS.md`](../../AGENTS.md)
2. [`docs/strategy/plan.md`](../strategy/plan.md)
3. [`docs/rules/component-skill.md`](../rules/component-skill.md)
4. [`docs/rules/token-skill.md`](../rules/token-skill.md)
5. [`docs/agents/planner.md`](../agents/planner.md) + [`docs/agents/ds-token-guardian.md`](../agents/ds-token-guardian.md)
6. [`apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.{ts,html,scss}`](../../apps/site/src/app/pages/demos/laboral-kutxa-sarevi/) — the shared simulator; this is what gets restyled
7. [`apps/site/src/app/pages/demos/sarevi-banco-cooperativo-overview/sarevi-banco-cooperativo-overview.page.{ts,html}`](../../apps/site/src/app/pages/demos/sarevi-banco-cooperativo-overview/) — overview wrapper (not edited here, but explains the demo entry)
8. [`libs/tokens/colors-banco-cooperativo.scss`](../../libs/tokens/colors-banco-cooperativo.scss) + [`libs/tokens/semantic.scss`](../../libs/tokens/semantic.scss) lines 688–744 — BC token block
9. [`apps/site/src/app/pages/blog/iteracion-4/iteracion-4.page.{ts,html,scss}`](../../apps/site/src/app/pages/blog/iteracion-4/) — template for iteracion-5

## Sources of truth

- **Figma layout/genre reference** — [VidaCaixa — Aportamás PRO](https://www.figma.com/design/kT1aoFGrLqm1gahh0dLUmn/VidaCaixa---Aportam%C3%A1s---PRO?node-id=379-50190) — modern Spanish-banking visual language. Use for spacing, hierarchy, card patterns.
- **Live BC visual reference** — 8 PNGs at `Afi brand/Banco Cooperativo example screens/Banco Cooperativo screens{,-1..-7}.png` — header chrome, stepper accent, form patterns, results comparison, footer.
- **BC brand tokens (existing)** — `colors-banco-cooperativo.scss`: verde-oscuro #1D4A3B (primary), verde-cooperativo #007A5D (secondary), amarillo-espiga #F2C40A (accent), Open Sans family.
- **BRAND_CONFIG entry** — `laboral-kutxa-sarevi.page.ts` lines 101–146 — `banco-cooperativo` slug, demoRoute, refCode `BC2026`, logo path, chart colors.

## DS primitive audit

**Confirmed present in `libs/ui/src/`** — used by the simulator today, no additions required for scope A:
afi-button · afi-input · afi-select · afi-segmented-control · afi-checkbox · afi-modal · afi-tabs · afi-card · afi-table · afi-radio-group · afi-stepper.

**Gaps flagged (do not block scope A; defer to future briefs):**
- No "radio-card" variant on `<afi-radio-group>` (large clickable card with radio + body). Visible in live BC mortgage screens but not used in the Sarevi flow.
- No espiga-yellow underline utility — solved via brand SCSS + a token, not a new primitive.

## Locked decisions (2026-06-08)

1. **Scope is visual-only on BC route.** Sarevi structure (screens, fields, components, flow) is untouched. LK + Unicaja chrome untouched.
2. **Token architecture is locked.** Changes happen as BC values inside the existing `[data-brand="banco-cooperativo"]` block, with new color steps added to `colors-banco-cooperativo.scss` only when an existing ramp doesn't cover a needed value. No new semantic roles unless multi-brand.
3. **Brand-conditional CSS is scoped to `[data-sarevi-brand="banco-cooperativo"]`** so the shared component delivers a different look without forking.
4. **The BC footer block is markup-level.** If reused enough to warrant its own component, it lives at `apps/site/src/app/components/bc-footer/` (3-file, site-local) — *not* in `libs/ui`.

## Files

**New:**
- `apps/site/src/app/pages/blog/iteracion-5/iteracion-5.page.{ts,html,scss}` — versioned snapshot of the BC restyle (per the "iteration pages are versioned snapshots" rule)
- (optional) `apps/site/src/app/components/bc-footer/bc-footer.component.{ts,html,scss}` + barrel — only if the footer block is reused

**Edit:**
- `libs/tokens/semantic.scss` — BC block (lines 688–744): adjust mixin args / add explicit overrides for header, stepper current-state, card surfaces, form control foreground, accent stripes
- `libs/tokens/colors-banco-cooperativo.scss` — add a new color step *only if* a needed value isn't already in the ramps
- `apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.scss` — brand-conditional rules under `[data-sarevi-brand="banco-cooperativo"]` consuming the BC tokens
- `apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.html` — *only* if a footer slot is required; otherwise untouched
- `apps/site/src/app/pages/blog/novedades/` index — append the iteracion-5 card

## Out of scope (called out explicitly)

- New BC mortgage simulator flow (preaprobado check + simulador de hipotecas) — separate future brief
- Any Sarevi structural change (screens, fields, components, flow, copy)
- LK + Unicaja chrome adjustments
- New `libs/ui` primitives (radio-card variant, anything else)
- New token architecture (new mixins, new layers, restructured roles)
- Adding personas / overview tabs to BC — AWP-only per the prior brief

## Follow-ups (tracked for after this ships)

- `2026-XX-XX-bc-mortgage-simulator-demo.md` — *separate* new flow matching the live BC product (preaprobado check + simulador de hipotecas), as its own route. Larger scope; explicitly not in this brief.
- `2026-XX-XX-radio-card-variant.md` — add `variant: 'card'` to `<afi-radio-group>` if the mortgage-simulator brief activates.

## Exit criteria

- [ ] `/demos/sarevi-banco-cooperativo/demo` chrome matches the BC visual language across all 4 screens (welcome → datos → medidas → resumen) at desktop / tablet / mobile widths
- [ ] Side-by-side preview screenshots vs `Afi brand/Banco Cooperativo example screens/` PNGs confirm the chrome is recognizably BC
- [ ] `/demos/sarevi-unicaja/demo` and `/demos/laboral-kutxa-sarevi/demo` are visually unchanged (regression check)
- [ ] All styling values flow through tokens — `git grep -nE "#[0-9a-fA-F]{3,8}|rgb\(|rgba\(" apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.scss` returns 0 hits
- [ ] 3-file rule clean for any new component
- [ ] iteracion-5 page lives at `/novedades/iteracion-5` with a card on the novedades index
- [ ] PR notes the 4 locked decisions + lists the 2 follow-up briefs queued
