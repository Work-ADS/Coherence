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
   - Keep `data-viz-monochrome-1..6` and the `white-a*` steps. `semantic.scss` and the modern foundation still read the monochrome set; removal is a follow-up.
2. **Typography (`libs/tokens/typography.scss`)**
   - Add `--font-family-sans` (Roboto), `--tracking-control`, `--type-button-400`, `--type-section-figure`.
   - Do **not** define `--font-brand-display` / `--font-brand-text` at `:root` yet. The button, insights header and bc-footer read them with a serif fallback, and the brand mixin falls back through them, so defining them switches those to Roboto early. They land in chunk 2 with the `--type-*` repoint.
   - The five heading roles (`type-display`, `type-title`, `type-subtitle`, `type-subtitle-body`, `type-section`) already exist, built with `responsive-token`, and the zip's values differ (title is 400 and fixed; section is 18/28 and fixed). They are changes to existing roles, so they belong to chunk 2.
   - Do not repoint existing `--type-*` roles to sans yet. That is the visible swap and belongs to chunk 2.
   - Keep `--font-family-serif`.
3. **Fonts (`apps/site/src/index.html`)**: fonts load from the Google Fonts link in `index.html`, not `styles.scss`. Add Roboto (weights 300, 400, 500, 600, 700 and italic 400) to that URL. The preconnect links are already there.
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

## Findings from the session (2026-10-14)

- **The warning swap is not invisible.** `semantic.scss` (feedback-warning-*), `aliases.scss` (amber, system-warning-base, data-semantic-warning, status-pending-dot), the rentabilidad chart and the demo-shell comment outlines all read the ramp, so warning surfaces turn orange as soon as chunk 1 lands. Modern is unaffected: it redefines its own ramp under `[data-foundation="modern"]`.
- **`fundamentos/color/color.page.ts` hard-codes hex values** for the info and warning ramps. We updated them with the tokens. It doesn't list the new data-viz tokens yet.
- **Bundle budget:** the baseline initial bundle was 998.27 kB against a 1 MB error limit. The primitives add about 2.5 kB, which tips the production build over. Chunks 2 and 3 add far more, so the budget needs a decision before they start.
- **`--dimension-65` fixes a latent bug.** `components.scss` already read it as `--dropdown-min-width` while it was undefined, so the dropdown pattern page now gets a 260px min-width.
- **Open naming question for chunk 3:** the data-viz dark twins use a `-dark` suffix (`scale-ink-on-dark-dark` reads badly), and no other primitive does. Dark mode is normally remapped in `semantic.scss`. We kept the zip's names for parity; chunk 3 decides whether they move to the semantic dark block.
- **Guardian review (ds-token-guardian)** found one real issue (the font-brand aliases, fixed above). It also suggested moving the annotation tokens next to the `data-viz/neutral` block; not done.
