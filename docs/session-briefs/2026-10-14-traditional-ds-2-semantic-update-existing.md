# Chunk 2 — Semantic tokens: update existing

**Project:** [index](2026-10-14-traditional-ds-0-index.md) · **Branch:** `traditional-ds-update` · **Depends on:** [chunk 1](2026-10-14-traditional-ds-1-primitive-tokens.md) (read its "Findings from the session" first)

## Goal

Repoint the **existing** semantic names in the default (traditional) brand so they take the zip's values. This is the first chunk where the UI visibly changes: Roboto lands, nav and sidebar go light, corners get rounder, and the warning ramp (already live from chunk 1) is wired through.

## Out of scope

- New semantic names (211 in the zip). They go to chunk 3 (cross-cutting) or chunk 6 (component-scoped). Exception: a new name that an existing repoint depends on (`--overlay-dropdown`, `--control-size-*`). Pull in only those and list them in the findings.
- `foundations-modern/` and every `colors-<brand>.scss` (frozen). We don't test against white-label.
- Any component or page code, except the `fundamentos/` docs pages that hard-code token values.

## Audit (2026-10-14, read from the zip, names and values only)

Zip `tokens/semantic.css`: 452 names. 241 shared with us, **31 differ**, 211 new. The zip has its own `[data-theme='dark']` blocks, not yet diffed against our §4.

| Group | Tokens | Change | Consumers |
|---|---|---|---|
| Surface / border | `surface-default`, `border-hairline`, `border-width-hairline`, `border-width-thick` | white-25 → white-0. Hairline moves off `color-banco-cooperativo-neutral-variant-100` (a white-label leak) to `color-afi-control-200`. Widths become 1px / 2px. | 61 / 91 files |
| Inputs | `input-background-default`, `-disabled` | → white-0 / control-100 | 2 |
| Nav | `nav-sidebar`, `nav-navbar`, `nav-toolbar`, `nav-item-background-*` (5), `nav-item-foreground-*` (4), `nav-item-icon-*` (4) | Navbar and toolbar go from dark (control-900) to white-0. Active and selected go azul-700. | 9 / 13 / 1 |
| Overlay | `overlay-blanket`, `overlay-popover` | `0.60` → `0.6` (cosmetic). Popover → `var(--overlay-dropdown)`. | 2 |
| Icon button | `icon-button-size-sm/md/lg` | → `control-size-*` | 2 |
| Shape | `radius-control`, `section-radius`, `sidebar-width` | sm → ml, lg → xl, dimension-16 → dimension-65 | 25 / 4 / 2 |
| Status | `status-pending-fg`, `status-pending-dot` | → `feedback-warning-text` / `-foreground` | few |
| Type | 14 `--type-*` roles, 5 heading roles | Roboto sans throughout. Title 500 → 400, fixed 24/32. Section 500 fixed 18/28. `type-section-title` 16/20 → 16/24. Serif eyebrow, title, subtitle and button-400 → sans. | everything |

## Work

1. Extract the zip into a fresh empty scratchpad directory. Rewrite the throwaway diff (name and value) for semantic, aliases and typography, plus the zip's dark blocks against our §4.
2. **Typography.** Define `--font-brand-display` and `--font-brand-text` at `:root` as `var(--font-family-sans)`. Chunk 1 held these back on purpose, because defining them flips the button, insights header, bc-footer and the brand-mixin fallbacks to Roboto in one move. Repoint the `--type-*` roles to sans and update the five heading roles in `typography.scss`. Keep `--font-family-serif` defined. Leave `_mixins.scss` brand blocks alone (frozen white-label) and note any clash.
3. **Semantic repoints** in `semantic.scss` and `aliases.scss` per the table. Fix the banco-cooperativo leak. Apply the zip's dark-mode differences to §4.
4. **Visible blast radius.** Before and after screenshots of Patrimonio demo, a component page, a modal, and a nav/sidebar page. Confirm `[data-foundation="modern"]` is unchanged.
5. Update `fundamentos/` pages that hard-code values.
6. Run `ds-token-guardian` on the diff, then `preflight`.

## Method

- Primitives hold raw values; semantic points at primitives, never the other way round.
- One commit for the chunk. Commit message lists deliberate keeps (serif family) so removals stay traceable.

## Done when

- A re-diff shows zero value differences for shared names in semantic and typography, apart from the listed keeps.
- `preflight` is green (clean-code, types, build). The bundle budget is a decision; see below.
- Screenshots show the intended shifts and nothing else. Modern is pixel-identical.

## Open decisions (Richard)

1. **Bundle budget.** Chunk 1 left the production build over the error limit. Raise now or at chunk 3?
2. **Small new cross-cutting names** (radius ×5, overlay ×3, z ×2, canvas ×2, a handful more): default is chunk 3.
3. **Nav and radii are large visible changes.** Default: land them in this one commit and review by screenshot, not a separate nav commit.

## Findings from the session

- **The first audit overcounted.** It took the last declaration of each name across brand and dark blocks, so it reported 31 differences and some were artefacts (for example `border-hairline` was a white-label brand block, not a leak). Comparing root with root and dark with dark gives **29 root and 8 dark** differences. The audit script is a throwaway; the rule is root-vs-root, dark-vs-dark, and cut our file at the first line-start `[data-brand`, not the header comment that mentions it.
- **Bundle budget raised** in `apps/site/angular.json`: initial warning 1.1 MB, error 1.25 MB (was 900 kB / 1 MB).
- **Typography:** `--font-brand-display` and `--font-brand-text` now resolve to `--font-family-sans` at `:root`, and every `--type-*` role is sans. Title is 400 fixed 24/32, section is 500 fixed 18/28, `type-section-title` is 16/24. `--font-family-serif` stays defined and unused outside frozen brands.
- **Semantic repoints done:** surface, hairline widths, input backgrounds, nav (sidebar, items, icons), overlay, shape (`radius-control` 10px, `section-radius` 16px, `sidebar-width` 260px), pending status, plus 8 dark-mode nav and overlay values.
- **Added because existing repoints need them:** `--nav-navbar` and `--nav-toolbar` at root (previously dark-only, now white-0) and `--feedback-warning-text` (light and dark).
- **Deferred: `--icon-button-size-*`.** The zip moves them to `--control-size-*`, which are new and shrink icon buttons from 32/40/48 to 24/28/32. That is a component sizing decision, so it goes with the button update in chunk 5 along with `--control-size-*`.
- **`--sidebar-width` has no code consumer** beyond the generated manifest, so the 64 → 260 change is invisible until the new sidebar lands.
- **Docs data updated:** the typography page and the Fundamentos landing no longer say Roboto Serif, and the heading-scale notes match the new fixed sizes.
- **Verified:** build green, tsc clean, clean-code check clean. Preview confirms Roboto, `--radius-control` 10px, white nav. Not screenshotted: a modal, a nav/sidebar page, the Patrimonio demo.
