# Chunk 5a — Foundations

**Project:** [index](2026-10-14-traditional-ds-0-index.md) · **Parent:** [chunk 5](2026-10-15-traditional-ds-5-components-update-existing.md) · **Evidence:** [chunk 4 report](2026-10-15-traditional-ds-4-components-audit-report.md) + [appendix A](2026-10-15-traditional-ds-4-audit-detail-A-buttons-forms.md) · **Branch:** `traditional-ds-5a-foundations` (from `traditional-ds-components-audit`; the chunk 4 commits are not on `main` yet) · **Source:** `~/Downloads/Afi_Wealth_Planner_clean.zip`, extracted outside the repo.

## Goal

Settle the scale and the dead tokens every later sub-chunk reads. Token, mixin, icon and docs work only. No primitive gets a new input or variant. The only restyle is what new token values do to primitives that already read them.

## Out of scope

`*-v2`, `foundations-modern/`, white-label brand files, any primitive API change, sidebar and table tokens (see Decisions), `afi-chart`, using the icons inside Button or Sidebar (5b, 5e).

## Decisions (defaults set 2026-10-15; Richard can overrule)

1. Sidebar (~28) and table (24) tokens move out of 5a. Sidebar tokens need the second zip and the hover-expand decision (5e); table tokens ride the 5f restyle slice. 5a creates button, checkbox, menu and control-label tokens only.
2. The SidebarIcon set ships as a generic `afi-icon` primitive. Button, Table row actions and FieldHelp need it, not only the sidebar.
3. `--radius-xs` is defined, not removed: 16 consumers with a clear intended name.
4. Primary hover follows the zip (`azul-profundo-450`) through `--button-primary-background-hover`. The `--brand-secondary-background-*` tokens are untouched.

## Locked fix list (verified against source 2026-10-15)

| Token | Consumers | Fix |
|---|---|---|
| `--focus-ring` | icon-button, status-chip, inline-edit, `componentes/filter-chip.page` | Define `0 0 0 var(--border-width-thick) var(--border-focus)` in `semantic.scss`. |
| `--duration-normal` | toast, tabs.variants, segmented-control.variants | Rename to `--duration-base` at consumers. |
| `--elevation-2` | toast, chart-composition | `--elevation-md` (toast), `--elevation-lg` (chart tooltip), checked per consumer. |
| `--type-body-sm` | toast, chart-instructions, editable-text, status-chip.variants | `--type-body-sm-400`. |
| `--space-3`, `--space-4` | page-header, four demo-shared components | `--space-sm`, `--space-md`. |
| `--font-family-display` | logo.component.html | Drop it; use `--font-family-sans`. |
| `--radius-xs` | table, logo, animated-chart, chart-composition, doc-page-shared, eight blog pages | Define in `semantic.scss`. |
| `--border-thin`, `--border-base` | download-md-button, `styles.scss`, page-template | `--border-width-hairline`, `--border-width-thick`. |
| `--data-diverge-pos/neg-300/500/700` | chart.variants, heatmap page | Define in `charts.scss` from the `--chart-positive-*` / `--chart-negative-*` ramps. The zip has no diverge tokens. |
| Legend `url(#afi-pattern-…)` | chart-legend | Emit one shared `<defs>` block from the chart family. |
| `--data-*` neutral/highlight | chart family (13 uses) | Repoint `aliases.scss` to the `--chart-*` names. Negative marks read `--chart-negative`. |

## Work items (one commit each)

1. This brief.
2. Control scale: `--control-h-sm/md/lg` mobile 40/44/48, desktop (≥ 992px) 28/32/40; `--control-size-sm..2xl` 24/28/32/36/40; `--icon-button-size-sm..2xl` re-pointed to them. Every field, tab, chip and nav item shrinks 4 to 8px on desktop; screenshots gate it.
3. Dead-token pass per the table.
4. `--button-*` (14), `--checkbox-size/glyph-*`, `--menu-item-*` (6), `--control-label-font-*`; dark values from the zip's dark block.
5. `focus-ring` and `touch-area` mixins in `libs/ui/src/styles/` (v2 `_focus-ring.scss` stays).
6. `afi-icon`: 33 Lucide glyphs plus the 11 milestone glyphs, data-only registry, spec, `/componentes/icon` doc page.
7. Touch-area and responsive rule in `accessibility.md` and `component-skill.md`.
8. Chart token repoint and pattern defs.

## Acceptance

- Zero v1 consumers of any name in the table that is not defined.
- Icon-button shows a keyboard focus ring; divergent heatmap paints; legend swatches show hatch.
- `clean-code-check.sh`, `tsc`, `npm run build` (850kB budget) green; `ds-token-guardian` clean; `preflight` per commit.
- Before/after screenshots (Patrimonio, button, icon-button, toast, heatmap, legend), dark mode, 375px viewport; one modern page pixel-identical; Unicaja segmented-control still renders radio cards.

## Findings from the session

_(filled as work lands)_
