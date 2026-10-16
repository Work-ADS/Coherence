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
| 5f-2 Defaults and small API | `density` third step `default` (zip CSS 32/44/56, not its `.d.ts` 36/52/64), `hover` auto, `reference` row variant, `footer` totals row, a11y names that include the row label («Seleccionar X», «Expandir X»), keyboard-operable group rows, checkbox size follows density. | planned |
| 5f-3 Selection | `selectionMode: 'leaves'` (tri-state groups, leaf-only keys), `selectOnRowClick`, `selectionVisible`, `row.disabled`, selection by keys (migration for the selection consumers), focus-within reveal. Mines `table-selection-leaves-tests`. | planned |
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
