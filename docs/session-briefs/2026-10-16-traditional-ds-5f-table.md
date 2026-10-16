# Chunk 5f — Table

**Project:** [index](2026-10-14-traditional-ds-0-index.md) · **Parent:** [chunk 5](2026-10-15-traditional-ds-5-components-update-existing.md) · **Evidence:** [appendix D §3](2026-10-15-traditional-ds-4-audit-detail-D-data-charts.md) · **Builds on:** [5d](2026-10-15-traditional-ds-5d-overlays.md) (Menu portal, Tooltip, Escape-once) · **Branch:** `traditional-ds-5f-table` · **Source:** `~/Downloads/Afi_Wealth_Planner_clean.zip` (`components/data/Table.jsx`, `Table.prompt.md`, `table-*.card.html`, `tools/table-*-tests.html`, `checkbox-sizing-tests.html`).

## Goal

Bring `afi-table` to the zip's look and API. The table is the largest single gap in chunk 4 and the most widely used primitive (about 20 consuming files: the Wealth Planner demos, Patrimonial, the component and preview pages), so a visual shift here shows on nearly every page. Work in small slices, each reviewable on its own. Restyle first (SCSS and tokens, no API), then API slices as separate briefs written when their session starts.

## Out of scope

`afi-table-apron` (modern-only, no zip equivalent), `*-v2`, `foundations-modern/`, white-label brand files, charts, Wealth Planner pages (chunk 7).

## Slices

| Slice | Scope | Status |
|---|---|---|
| **5f-1 Restyle** | `--table-*` tokens (header, cell, child, hover), header 600, body ink secondary, hover token and `--radius-table`, info highlight and `tone-info`, quiet sort glyph. No new input, no markup or a11y change, row heights unchanged. | done 2026-10-16 |
| 5f-2 Defaults and small API | `density` third step `default` (zip CSS 32/44/56, not its `.d.ts` 36/52/64), `hover` auto, `reference` row variant, `footer` totals row, a11y names that include the row label («Seleccionar X», «Expandir X»), keyboard-operable group rows, checkbox size follows density. | done 2026-10-16 |
| 5f-3 Selection | `selectionMode: 'leaves'` (tri-state groups, leaf-only keys), `selectOnRowClick`, `selectionVisible`, `row.disabled`, selection by keys (migration for the selection consumers), focus-within reveal. Mines `table-selection-leaves-tests`. | done 2026-10-16 |
| 5f-4 Tree | `treeColumn` plus selection column, chevron after the label, group/child inks and indent, controlled and uncontrolled expansion. Mines `table-tree-column-tests`. | planned |
| 5f-5 Planning and actions | `appearance="planning"` (`--table-planning-*`), action icons from the icon set (not a closed enum), `disabled`, `inlineActions`, highlight end output and scroll-into-view. | planned |

## Decisions

1. Five slices, one session each, plan gate between.
2. Body ink moves to secondary as in the zip: every table reads a step lighter.
3. Row heights stay in 5f-1. The zip's `.d.ts` says 36/52/64 and its CSS says 32/44/56; follow the CSS in 5f-2 unless the zip authors say otherwise.
4. The zip's `--afi-row-h`, `--afi-cell-px`, `--afi-tree-indent`, `--afi-content-inset`, `--afi-sel-gutter`, `--afi-sel-pad` are component-local custom props, not tokens.

## Method

Plan mode with a short section here before each slice's code. Full AGENTS.md read order, reuse before building, `_pre-flight.md`, `ds-token-guardian` on token diffs, `preflight`, before/after screenshots in light and dark, `npm run build` after every API commit, Unicaja segmented-control check at the end.

## Findings from the session

- **2026-10-16, planning only.** Branch cut from Azure `main`; no code written.
- **5f-1 done 2026-10-16** on `traditional-ds-5f-table` (SCSS and tokens only, one commit).
  - **Tokens** in `components.scss` TABLE block: `--table-header-font` (`--type-body-sm-600`), `--table-header-foreground` (tertiary), `--table-header-divider` (`--border-subtle`), `--table-cell-font`, `--table-cell-foreground` (secondary), `--table-child-foreground`, `--table-row-background-hover` (control-100; control-800 in the dark block of the same file).
  - **Component:** header 500 to 600 on the hairline divider token; body ink primary to secondary; child rows on the child token; hover fill on `--table-row-background-hover` with `--radius-table` (4px, was `--radius-md` 8px) corners, same pseudo-element implementation so the page-header flush host vars still apply; row highlight success tint to info tint; `tone-info` from `--color-action-500` (a primitive) to `--feedback-info-foreground`; sort glyph at 0.4 opacity at rest and brand ink at full opacity while the column is the sort (`aria-sort` ascending or descending).
  - **Deferred from the plan, on purpose:** the 20px chevron box (already 20px), the 32px action target and 20px action icon (would raise action-row heights; they ride with the actions work in 5f-5), and the group and footer tokens (no markup yet marks a group row; they arrive with 5f-4 and 5f-2). Declaring them now would leave unused tokens.
  - **Measured before and after** (table doc page and Ingresos): column widths identical, header height 40.5, row height 49 unchanged; header weight 500 to 600 (cell widths +0.1px from the bolder header); body ink `rgb(0,0,0)` to `rgb(31,35,40)` on plain cells (cells with `emphasis` keep primary ink on purpose). Dark mode: body ink 16.98:1 and header 6.89:1 against the surface, hover `#1D2939`.
  - **Not verified:** hover and highlight visually with a real pointer, Patrimonial flush mode, the row action menu inside the scroll area, status tones in dark.
- **5f-2 done 2026-10-16** on `traditional-ds-5f-2-table-defaults` (all additive; defaults unchanged).
  - **`density="default"`** added as a third value (the base `--space-sm` padding the plain row already had); the input default stays `compact`. Heights stay padding-driven, so they include the actions column: the doc table measures 49 / 57 / 65 px for compact / default / comfortable. The zip's 32 / 44 / 56 minimums are not forced.
  - **`hover`** input (`on` default, `auto`, `off`); `rowHoverable=false` still means off. `auto` fills only for selectable, action or expandable tables; it cannot see a `rowClicked` listener, so such tables should use `on` (documented on the type).
  - **`variant: 'reference'`** row key: pinned first by `orderedRows`, inert (no hover class, no click, no checkbox, empty actions cell), hairline above, subtle surface, italic secondary text, tabular figures; left out of select-all. `muted` is unchanged.
  - **`footer`** input: a `tfoot` row keyed by column key, 600 weight, primary ink, 2px rule above, tabular figures; `--table-footer-font` and `--table-footer-foreground` added.
  - **A11y, no visual change:** the checkbox is «Seleccionar {row label}» (`rowLabel` function input, else the first column's text), the expand toggle «Expandir {label}» / «Contraer {label}» with `aria-expanded`, a group row has `tabindex=0` and Enter or Space (only when the key is on the row itself) toggles it, with a focus ring.
  - **Checkbox size** follows density: `md` for comfortable, `sm` otherwise.
  - **Doc page:** controls for density (3), hover (3) and reference plus totals; token tables rewritten to the `--table-*` roles; accessibility notes updated.
  - **Verified in the browser:** unchanged compact table (columns and heights identical to 5f-1), the three densities, the three hover modes, the reference row pinned and inert, the footer, and the checkbox names on the Gastos page («Seleccionar Dependencia y cuidados»). `tsc` and `npm run build` green.
  - **Not verified:** the expand toggle name and the Enter or Space on a group row (no seeded page with children was reachable), Space on a checkbox not toggling the row, the comfortable `md` checkbox.
- **5f-3 done 2026-10-16** on `traditional-ds-5f-3-table-selection` (additive; the four object-API consumers are untouched).
  - **Consumers counted:** Patrimonial, Desinversión detail, Gastos and Optimización de asset flujo bind `[selectable]`, `[selected]` (row objects) and `(selectedChange)`. That path keeps its original code; only select-all now skips a row with `disabled: true`.
  - **Keyed selection:** `selectedKeys` input (array or Set) plus `selectedKeysChange`. Set means keys; unset means the object API as before.
  - **`selectionMode`:** `rows` (default) or `leaves`. In leaves mode child rows carry the boxes, a group box is tri-state over its selectable leaves (select or clear them), the header covers all leaves, a childless top-level row is a leaf, and only leaves are emitted. Works with keys or objects (objects come back through a key lookup, so stale objects are not preserved on this path).
  - **`row.disabled`:** box disabled, skipped by clicks, group and select-all; a group with no selectable leaf and a table with nothing selectable disable their boxes.
  - **`selectOnRowClick`:** a click outside the row's own controls (zip skip list plus `[data-no-row-select]`, matched only inside the row) toggles the row; on selectable rows it replaces `rowClicked`. Space on a focused group row selects, Enter expands; leaf rows get no tab stop.
  - **`selectionVisible`** plus focus-within reveal, and a box stays visible once its row is ticked or partial. A table-level custom property overrides the page-header host's hide.
  - **Doc page:** a grouped sample with controls for mode, row click and visibility, and a live readout of the emitted keys.
  - **Verified in the browser:** empty-cell click selects a leaf, group box mixed then checked as leaves are ticked, header indeterminate then select-all skips the disabled leaf and emits no group key, group box selects its leaves, the chevron does not select, the disabled leaf's box is disabled and its row ignores clicks, a collapsed group keeps its dash and a full-opacity box, Space on a group row selects and Enter expands, the leaf has no `tabindex`, checkbox names «Seleccionar {row}»; Gastos (object API) selects one, all and none as before. `tsc` and `npm run build` green.
  - **Not verified:** a Switch or Input inside a selectable row (skip list is `closest`-based; no such row in the dev data), `selectionVisible` inside the page-header flush context, Patrimonial and Optimización flujo end to end.
  - **Guardian fixes (same slice):** `disabled` as a reserved row key checked against the repo (no `afi-table` row data carries a `disabled` field outside the new demo); `selectedKeys` treated as keyed only when non-null (`!= null`, so an undefined binding does not flip the mode); the header box stays enabled on an empty or loading table; reference children and a disabled group are excluded from a group's leaves; `selectOnRowClick` makes selectable top-level rows focusable so Space has a keyboard path; the leaves-mode object-API caveat (rows no longer shown are dropped) is documented on `selectedKeys`; type docs reordered. Side effect noted: focus-within now reveals the selection box in every table, not only the new modes.
