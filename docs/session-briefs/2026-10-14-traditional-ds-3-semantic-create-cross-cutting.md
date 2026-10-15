# Chunk 3 — Semantic tokens: create new, cross-cutting

**Project:** [index](2026-10-14-traditional-ds-0-index.md) · **Branch:** `traditional-ds-update` · **Depends on:** [chunk 2](2026-10-14-traditional-ds-2-semantic-update-existing.md) (read its "Findings from the session" first)

## Goal

Add the zip's **new** cross-cutting semantic names to the default (traditional) brand in `libs/tokens/semantic.scss`: chart, canvas, layout, color, plus the ~20 small names deferred from chunk 2. Nothing consumes them yet, so chunk 3 is invisible. Chunks 5 and 6 are the consumers.

## Out of scope

- Component-scoped names: sidebar 26, table 26, insight 15, tour 10, statuspill 9, button 14, checkbox 6, menu 6, `--meter-fill-muted` (chunk 6).
- `--control-size-*`, `--control-h-*`, `--icon-button-size-*` (chunk 5, with the button update).
- `foundations-modern/` and every `colors-<brand>.scss` (frozen). Any component or page code.

## Audit (2026-10-14, zip read in place, names and values)

Method: root vs root, dark vs dark, our files cut at the first line-start `[data-brand`, comments stripped. Every `var()` the new names point at already exists in our tokens, so no new primitives are needed.

**82 new names in scope:**

| Group | Count | Names |
|---|---|---|
| Chart | 47 | category 1–7, range outer/inner, data-comparison (+1–3), data-muted (+gradient), gradient-start-opacity, soft-fill-mix, data-primary-subtle, negative-strong, caution subtle/default/strong, value-* (positive/negative/caution × base/fill/ink, three marks, negative-label), scale 1–4 (+ink), annotation ink ×4, reference-neutral |
| Layout | 13 | page-header-gap, rail-max/inset/inset-sm/block/converge, bp-grid/handoff/compact, drawer-width, shell-header/brand-gap/inset |
| Radius | 5 | section, chart-bar, panel, table, shell |
| Overlay | 3 | blanket-drawer, blur, menu |
| Z | 2 | dropdown, floating |
| Section | 3 | section-space-after, subsection-space-after, section-content-gap |
| Colour and other | 9 | canvas-brand, surface-context, border-focus-inverse, feedback-warning-indicator, control-background-hover/active-inverse, control-track-background, panel-padding |

**Chunk 2 audit gap.** The chunk 2 throwaway regex only saw plain `--name: value;` lines, so tokens set through the `responsive-token` mixin were invisible. Real differences on existing names:

| Name | Ours | Zip |
|---|---|---|
| `--canvas-padding-inline` | 16 / 20 / 24 / 32 / 40 / 48 across six breakpoints | 16, then 32 from 992px |
| `--canvas-padding-block` | 16, 20 from sm | 16 flat |
| `--gap-section-to-section` | 32, 40 from md | 32 flat |
| `--control-h-sm/md/lg` | sm 44→32, md 44→40, lg 48 | sm 40→28, md 44→32, lg 48→40 |
| `--surface-hover` dark | no dark value (falls back to light control-50) | control-800 |
| `--nav-item-border-selected` dark | no dark value | control-700 |
| `--chart-data-primary` dark | no dark value (series-1 is 1.23:1 on the dark surface) | azul-profundo-400 |

"Canvas ×2" in the handoff note was `canvas-padding-inline/block`, which are existing names. The new canvas name is `--canvas-brand`.

## Decisions (Richard, 2026-10-14)

1. **2b commit first.** Canvas padding, section gap and the two dark values go in their own commit before chunk 3 proper. `--control-h-*` goes to chunk 5 because it resizes every button, input, tab and chip on desktop.
2. **Data-viz dark twins keep the zip's primitive names.** The semantic dark block is where theme remapping already lives and it points at them as the zip does. Six are consumed (`scale-1…4-dark`, `scale-ink-on-light-dark`, `scale-ink-on-dark-dark`). The zip uses no `caution-subtle`, `caution-strong` or `caution-*-dark` anywhere; dark caution reads the warning ramp. Those five stay as chunk 1 left them, and removal is a follow-up.
3. **New names live in `semantic.scss`**, next to the existing `--chart-data-*` block, because the manifest generator only reads that file. `charts.scss` stays for chart chrome.
4. **Modern.** Root names inherit into `[data-foundation="modern"]` but nothing consumes them. `foundations-modern/` is not edited.
5. **Zip inconsistency, shipped verbatim:** `--radius-section` is `--radius-lg` (12px), while its comment says "one step rounder than a card" and `--section-radius` is `--radius-xl` (16px). Nothing consumes either. Revisit in chunk 5.

## Spot-checks carried over from chunk 2 (done 2026-10-14, nothing wrong)

- Workbench (`/workbench`, modern): renders; `--radius-control` 10px, `--section-radius` 16px inside the modern scope.
- Nueva simulación overview (modern, mixes v1 primitives): renders, Roboto.
- Patrimonial (Wealth Planner): navy sidebar, nav items transparent (no white box on the navy parent), the hidden tooltip has opacity 0.
- Modal (`/componentes/modal`): white surface, rounded, scrim, danger button.

## Work

1. **2b commit:** repoint `canvas-padding-inline/block` and `gap-section-to-section`; add dark `--surface-hover` and `--nav-item-border-selected`. Verify computed values at 375, 800 and 1280px.
2. **Colour and other:** the nine names above, with the zip's dark pairs (canvas-brand azul-profundo-800, control-background-*-inverse 10% / 16%, border-focus-inverse azul-300, control-track-background control-800).
3. **Chart:** 47 names in the zip's order. Dark block: primary override, categories, ranges, comparison, muted, gradient opacity 0.9, soft-fill mix 25%, marks, caution, scale reversal, annotation swap. Re-declare the caution `value-*` and `data-primary-subtle` in dark, because a custom property resolves where it is declared.
4. **Layout, section spacing, radius, panel-padding, overlay, z.** `--overlay-blanket-drawer` dark is `hsla(0, 0%, 0%, 0.45)`.
5. **Verify**, run `ds-token-guardian` on the diff, run `preflight`, commit.

## Method

- Semantic points at primitives, never the other way round. No raw hex in `semantic.scss` except where the zip itself carries one (overlay blanket, the 0.45 dark drawer scrim).
- Every new root name with a zip dark value gets a dark value. The guardian caught five tokens in chunk 2 that lost dark parity.
- Build for AFI only. White-label stays frozen.

## Done when

- A mixin-aware re-diff of in-scope names shows zero root and zero dark differences, except the listed keeps.
- `preflight` green; the manifest includes the new names.
- Light and dark computed values spot-checked on a chart consumer page and the Patrimonio demo; modern pixel-identical.
- Guardian review clean, or findings fixed in a follow-up commit.

## Deliberate keeps and deferrals (for the commit message)

- Dark-twin primitives keep the zip names; five unused caution primitives stay.
- `--control-h-*`, `--control-size-*`, `--icon-button-size-*` wait for chunk 5.
- `--radius-section` (12px) next to `--section-radius` (16px) as in the zip.

## Findings from the session (2026-10-14)

- **2b landed first** as its own commit (`436cf1f`): canvas padding, section gap, two dark values. Guardian approved. It flagged that tablet widths (576 to 991px) now pad 16px where they were 20 or 24px, and that `--canvas-padding-block` drops 20 to 16px from sm. Intended, matches the zip.
- **82 names added** to `semantic.scss`, generated from the zip text so values and comments cannot drift. A mixin-aware compile and re-diff shows zero root and zero dark differences, except the keeps: `--border-width-hairline/thick` (kept as dimension tokens) and `--control-h-*` (chunk 5). `--meter-fill-muted` was left out on purpose (Meter, chunk 6a); `--border-hairline` lives in `aliases.scss`.
- **Dark:** every new name with a zip dark value has one, plus `--chart-data-primary` (azul-profundo-400, series 1 was 1.23:1 on the dark surface) and `--feedback-warning-indicator`. Computed values checked in light and dark; modern's own values are untouched.
- **Guardian (ds-token-guardian): approve, no blockers.** Taken: reworded the dark CHART comment. Left as the zip has them: `--surface-context` has no dark re-alias (same element, so it resolves; only a nested dark scope would inherit light), and three layout lengths could alias existing primitives (`--layout-drawer-width` to `--dimension-72`, `--layout-bp-handoff` to `--bp-md`, `--layout-rail-converge` to `--layout-rail-max`). Revisit when chunk 5 consumes them.
- **Naming:** `--radius-table`, `--radius-shell` and `--panel-padding` are tied to a component even though they sit in the cross-cutting list. Don't treat them as general tokens.
- **Manifest:** `--chart-soft-fill-mix` (45%) is classified as `length`. Harmless today.
- **Open for Richard:** `--radius-section` is 12px next to `--section-radius` at 16px, as in the zip. Pick one in chunk 5.
- **Build:** green. One transient failure inlining Google Fonts (network), fixed by retry. The Sarevi stylesheet budget warning predates this chunk.
