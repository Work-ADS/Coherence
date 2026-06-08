# Banco Cooperativo — Welcome page (Figma alignment)

**Status:** shipped 2026-06-08 on `banco-cooperativo-redesign`
**Branch:** `banco-cooperativo-redesign`
**Created:** 2026-06-08
**Supersedes:** [`2026-06-08-banco-cooperativo-redesign.md`](2026-06-08-banco-cooperativo-redesign.md) — the prior brief reverse-engineered chrome from the live BC mortgage product. The team confirmed the official Sarevi Figma is the source of truth, so that work was reverted and rebuilt here.

---

## Why this exists

Prior chunk shipped a BC restyle inferred from the live BC mortgage product (dark verde-oscuro brand band, espiga-yellow underlines, stepper accent). When the team handed over the **official Sarevi Figma** ([file `rw0MpBWVyKNmLZIkLJ9oyS`, node `2:20973`](https://www.figma.com/design/rw0MpBWVyKNmLZIkLJ9oyS/Banco-Cooperativo---Sarevi---DEV?node-id=2-20973)), it became clear the proper design language was different: **verde-cooperativo (#007a5d) is the primary chrome**, not verde-oscuro; the welcome opens with an **edge-to-edge hero image with green overlay**; no espiga-yellow accents; large illustrated choice cards; official multi-link footer.

This chunk realigns to that design. Page-by-page, starting with the welcome.

## What this session ships

- Rolled back the prior chunk's chrome additions (two-band topbar, espiga underlines, stepper restyle).
- **Re-bound BC tokens** in [`libs/tokens/semantic.scss`](../../libs/tokens/semantic.scss): `coherence-brand-bind($accent: 'verde-cooperativo', …)`. Brand-secondary, control-foreground, border-default, focus rings all cascade to #007a5d. Verde-oscuro stays available for accents that need extra contrast.
- **Welcome page rebuilt** to match the Figma — flat verde-cooperativo topbar (centered BC logo), full-bleed hero band (kitchen photo + green overlay baked into the asset), centered "¿Qué necesitas?" question + helper, two illustrated choice cards, BC site footer.
- **`<site-bc-footer>` 3-file component** at `apps/site/src/app/components/bc-footer/`. Verde-cooperativo band with BC wordmark left, link list center, Ruralvía right, copyright row below. Renders on every BC route via a brand-conditional template block.

The datos / medidas / resumen routes inherit the re-bound tokens for free — their chrome is already mid-green-correct after this commit. They still need page-specific Figma alignment in follow-up chunks.

## Coding standards

- **3-file rule** — bc-footer ships as `.ts` + `.html` + `.scss` + `index.ts` barrel.
- **Tokens only in SCSS** — no raw hex / rgb / rgba / px in the new code (grep verified).
- **Brand-conditional scope** — every welcome SCSS rule keys on `.lk-sarevi--banco-cooperativo` so LK + Unicaja are untouched.
- **`<site-bc-footer>` renders conditionally** via `@if (brand() === 'banco-cooperativo')` in the simulator template — invisible to LK + Unicaja.
- **Sarevi flow unchanged** — same screens, same data, same DS primitives.

## Pre-flight reads (in order)

1. [`AGENTS.md`](../../AGENTS.md)
2. [`docs/strategy/plan.md`](../strategy/plan.md)
3. [`docs/rules/component-skill.md`](../rules/component-skill.md)
4. [`docs/rules/token-skill.md`](../rules/token-skill.md)
5. [`docs/agents/planner.md`](../agents/planner.md) + [`docs/agents/ds-token-guardian.md`](../agents/ds-token-guardian.md)
6. [`libs/tokens/semantic.scss`](../../libs/tokens/semantic.scss) lines 688–746 — re-bound BC block
7. [`libs/tokens/colors-banco-cooperativo.scss`](../../libs/tokens/colors-banco-cooperativo.scss) — color steps reference
8. [`apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.{ts,html,scss}`](../../apps/site/src/app/pages/demos/laboral-kutxa-sarevi/) — shared simulator
9. [`apps/site/src/app/components/bc-footer/`](../../apps/site/src/app/components/bc-footer/) — site footer component

## Sources of truth

- **Figma (primary)** — [Banco Cooperativo · Sarevi · DEV](https://www.figma.com/design/rw0MpBWVyKNmLZIkLJ9oyS/Banco-Cooperativo---Sarevi---DEV?node-id=2-20973) — welcome page is node `2:20973`. Figma variables: `Primary/primary-color: #007a5d` is the chrome anchor; `primary-color-dark: #004b3a` is the accent helper; `primary-color-light: #6ec5af` is mint; `secondary-color: #febd53` is a soft warm yellow.
- **Hero photo** — [`apps/site/src/assets/banco-cooperativo/hero-welcome.png`](../../apps/site/src/assets/banco-cooperativo/hero-welcome.png), copied from `Afi brand/Banco Cooperativo example screens/Banco cooperativo/page 1 header photo/container.png`. The green overlay is already baked into the asset.

## Locked decisions (2026-06-08)

1. **Token re-bind is cascading** — `coherence-brand-bind($accent: 'verde-cooperativo')` sets the BC chrome primary at the token layer. Every downstream BC component picks up the change without further edits.
2. **`<site-bc-footer>` is site-local** — lives at `apps/site/src/app/components/bc-footer/`, not in `libs/ui`. It bakes BC-specific content (link list, Ruralvía partner mark) so it's a consumer component, not a DS primitive.
3. **Welcome content is brand-conditional in the template** — `@if (brand() === 'banco-cooperativo') { bc-welcome } @else { welcome-wrap }`. Sarevi flow + data are not duplicated; only the welcome screen markup branches.
4. **Hero break-out uses `:has()`** — `.lk-sarevi--banco-cooperativo:has(.bc-welcome) .lk-shell` strips the shell's max-width + padding so the hero spans the viewport. Non-welcome BC routes keep the standard `.lk-shell` constraints automatically.
5. **No espiga-yellow accents on Sarevi** — the live BC mortgage product uses them; the official Sarevi Figma does not. Don't reintroduce.
6. **BC footer renders on every BC route**, not just welcome. Matches the live BC chrome pattern and reads as part of the brand chrome.

## Files

**New:**
- `apps/site/src/app/components/bc-footer/bc-footer.component.{ts,html,scss}` + `index.ts`
- `apps/site/src/assets/banco-cooperativo/hero-welcome.png` (copied from `Afi brand/…/container.png`)

**Edit:**
- `libs/tokens/semantic.scss` — BC block re-bind ($accent: verde-cooperativo) + foreground-brand → verde-oscuro accent + control / border / input slot adjustments
- `apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.ts` — import + register `BcFooterComponent`
- `apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.html` — brand-conditional welcome split + `<site-bc-footer>` render before closing `.lk-sarevi` div
- `apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.scss` —
  - Removed the prior chunk's "live-product visual restyle" trailing block
  - Removed the prior stepper-on-dark accessibility tweaks + the footer pseudo
  - Re-aimed `--bere` / `--mag` aliases to verde-cooperativo
  - Added the BC welcome block: flat topbar, hero band, question block, choice cards

## Out of scope (called out)

- Datos / medidas / resumen page Figma alignment — separate per-page briefs to come.
- Reintroducing the recover-simulation entry point on BC welcome — the Figma doesn't show one. Modal still triggers via other paths.
- Building a real Ruralvía logo asset — for now the footer uses a stylized SVG glyph + text. Swap to the official mark when available.
- Sourcing higher-fidelity Vivienda / Edificio illustrations from Figma — the inline SVGs are a sufficient match for MVP; refine if the team wants a closer transcription.

## Follow-ups (queued)

- `2026-XX-XX-banco-cooperativo-datos-figma-align.md` — port the datos screen to the Figma reference (stepper position + form chrome).
- `2026-XX-XX-banco-cooperativo-medidas-figma-align.md` — same for medidas.
- `2026-XX-XX-banco-cooperativo-resumen-figma-align.md` — same for resumen.
- Optional: lift `<site-bc-footer>` to a `libs/ui` primitive if a second consumer (e.g. a future BC product surface) emerges.

## Exit criteria

- [x] `/demos/sarevi-banco-cooperativo/demo` welcome renders the Figma composition end-to-end (mid-green topbar, hero band, question block, illustrated cards, footer).
- [x] `/demos/sarevi-unicaja/demo` and `/demos/laboral-kutxa-sarevi/demo` welcome screens render the legacy `welcome-wrap` markup, unchanged.
- [x] BC datos / medidas / resumen routes inherit the re-bound mid-green chrome with no per-page edits.
- [x] `grep -nE "#[0-9a-fA-F]{3,8}|rgb\(|rgba\(" libs/tokens/semantic.scss apps/site/src/app/components/bc-footer apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.scss` against the additions returns 0 hits.
- [x] 3-file rule clean on `bc-footer`.
- [x] PR notes which files changed, what was reverted, and queues the per-page follow-up briefs.
