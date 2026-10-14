# Chunk 1 — Primitive tokens

**Project:** [index](2026-10-14-traditional-ds-0-index.md) · **Branch:** `traditional-ds-update` · **Plan-mode gate before editing.**

## Goal

Bring the primitive token layer of the default (traditional) brand in line with the zip's `tokens/{colors,typography,spacing,elevation,motion,fonts}.css`. Primitives only. Nothing visible changes in this chunk, because semantic doesn't point at the new values yet.

## Out of scope

- `semantic.scss`, `aliases.scss`, `components.scss`, `charts.scss` (chunks 2 and 3)
- `foundations-modern/`, and every `colors-<brand>.scss` (frozen)
- Any component or page

## Work

1. **Colors (`libs/tokens/colors.scss`)**
   - Replace the 7 warning-ramp steps (25, 50, 100, 200, 300, 500, 700, 900) with the zip's orange values.
   - Update `info-700` to the zip value.
   - Add `azul-profundo-450`.
   - Add the ~30 new `--color-data-viz-*` primitives: category 1–7, scale 1–4 with `-dark` twins, scale ink on-light / on-dark, caution default / strong / subtle with dark twins, negative strong / ink, neutral annotation (4).
   - Keep `data-viz-monochrome-1..6` and the `white-a*` steps. Grep first to see who reads them; they're code-only and removal is a follow-up.
2. **Typography (`libs/tokens/typography.scss`)**
   - Add `--font-family-sans` (Roboto), `--font-brand-display`, `--font-brand-text`, `--tracking-control`.
   - Add the 11 new role names from the zip (`type-display`, `type-title`, `type-subtitle`, `type-subtitle-body`, `type-section`, `type-section-figure`, `type-button-400`, ...) using the zip's values.
   - Do not repoint existing `--type-*` roles to sans yet. That is the visible swap and belongs to chunk 2.
   - Keep `--font-family-serif`.
3. **Fonts (`apps/site/src/styles.scss`)**: add the Roboto Google Fonts import (weights 300, 400, 500, 600, 700 and italic 400) next to Roboto Serif. Check `angular.json` and the CSP/preconnect setup for anything that lists font hosts.
4. **Dimensions (`dimensions.scss`)**: add `--dimension-65`, `--radius-ms`, `--radius-ml`. Don't touch the rest.
5. **Elevation (`elevation.scss`)**: add `--elevation-button`, `-button-hover`, `-button-pressed`, `--elevation-card-on-brand`.
6. **Motion (`motion.scss`)**: add the four `--reveal-cascade-*` tokens and the `afi-reveal-cascade` / `afi-reveal-fade` keyframes. The modern foundation already has the equivalent as `--motion-reveal-*` (normal 500ms / 10px, heavy blur 14px), so don't copy from modern. Check whether our existing `--reveal-*-normal/heavy` can supply the values and only add what's missing.

## Method

- Re-extract the zip into a fresh directory outside the repo and re-diff each primitive file (name and value). The audit script from the index session isn't kept; rewrite it as a throwaway in the scratchpad.
- Follow `libs/tokens` layer discipline: primitives hold raw values, never `var(--semantic)`.
- Run the `ds-token-guardian` agent on the diff before commit.

## Done when

- `preflight` is green (clean-code, types, build).
- A re-diff shows zero new names and zero value differences for the primitive files, except the deliberate code-only keeps listed above.
- A screenshot of any existing page is unchanged (nothing visible should move).
- The brief's keep list (monochrome set, white-a steps, serif family) is noted in the commit message so removals are traceable.
