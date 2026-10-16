# Chunk 5f — Table

**Project:** [index](2026-10-14-traditional-ds-0-index.md) · **Parent:** [chunk 5](2026-10-15-traditional-ds-5-components-update-existing.md) · **Evidence:** [appendix D §3](2026-10-15-traditional-ds-4-audit-detail-D-data-charts.md) · **Builds on:** [5d](2026-10-15-traditional-ds-5d-overlays.md) (Menu portal, Tooltip, Escape-once) · **Branch:** `traditional-ds-5f-table` · **Source:** `~/Downloads/Afi_Wealth_Planner_clean.zip` (`components/data/Table.jsx`, `Table.prompt.md`, `table-*.card.html`, `tools/table-*-tests.html`, `checkbox-sizing-tests.html`).

## Goal

Bring `afi-table` to the zip's look and API. The table is the largest single gap in chunk 4 and the most widely used primitive (about 20 consuming files: the Wealth Planner demos, Patrimonial, the component and preview pages), so a visual shift here shows on nearly every page. Work in small slices, each reviewable on its own. Restyle first (SCSS and tokens, no API), then API slices as separate briefs written when their session starts.

## Out of scope

`afi-table-apron` (modern-only, no zip equivalent), `*-v2`, `foundations-modern/`, white-label brand files, charts, Wealth Planner pages (chunk 7).

## Slices

| Slice | Scope | Status |
|---|---|---|
| **5f-1 Restyle** | `--table-*` tokens (header, cell, group, child, footer, hover, action sizes), header 600, body ink secondary, hover token and `--radius-table`, info highlight and `tone-info`, dual sort glyph, 20px chevron box, 32px action target. No new input, no markup or a11y change, row heights unchanged. | this session |
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
