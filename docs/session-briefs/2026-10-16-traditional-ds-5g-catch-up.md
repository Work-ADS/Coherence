# Chunk 5g — Catch-up (newer zip)

**Project:** [index](2026-10-14-traditional-ds-0-index.md) · **Builds on:** [5d](2026-10-15-traditional-ds-5d-overlays.md), [5e](2026-10-16-traditional-ds-5e-navigation.md), [5f](2026-10-16-traditional-ds-5f-table.md) (method) · **Branches:** `traditional-ds-5g-1-focus-field`, `traditional-ds-5g-2-table-leaving` · **Source:** `~/Downloads/Afi Wealth Planner (19).zip` (exported 2026-10-16) compared with `~/Downloads/Afi_Wealth_Planner_clean.zip` (2026-10-14).

## Goal

Bring across what the newer zip changed after we ported it, and only what is real. Restyle-free: both slices are additive and opt-in. Token-only styling. `npm run build` after every API commit.

## Out of scope

Sidebar, TopBar, PlannerShell, NotesPopover (5e session). `*-v2`, `foundations-modern/`, white-label brand files. EmptyState, InlineNotice, SummaryPanel, Sparkline, Meter: these primitives do not exist in `libs/ui` yet (chunk 6a/6d), so nothing to catch up.

## What the diff showed (`diff -rq`, every changed file read, 2026-10-16)

**Portable (this chunk):**

- `FocusField` helper (`focusField`, `focusFirstInvalid`, namespace `FocusField.focus/firstInvalid`), and Modal / Drawer `initialFocusRef` placed with it. Slice 5g-1.
- Table `leavingKeys` and the «Eliminar registros» pattern. Slice 5g-2.

**Carry-forward notes (build with these from day one in chunk 6):**

- 6a SummaryPanel: item `meta` (reference line), `tone` + `status` (chip, FigureStrip anatomy; ✓ ok / ✕ problem), `visual` (a Sparkline or Meter under the line). Meta ink is secondary, not tertiary, to hold AA on the tinted surface.
- 6d EmptyState (page kind only): `choices: { key, label, icon?, onSelect?, disabled? }[]`, `onChoice(key)`, `choicesLabel` («Empezar por»); secondary buttons in an auto-fit grid (min 200px). `preview` stays legacy and is not allowed on gate pages.
- 6d InlineNotice: `targets`, `navigateLabel` («Ir al siguiente»), `onNavigate(index)`; the button calls FocusField (scroll `center`), starts after the target that holds focus, skips gone, hidden or disabled targets, wraps.

**Not ported, on purpose (the newer zip is behind the first zip here):**

- Menu, NotesPopover, Search: Escape revert (capture-phase `preventDefault` removed). We keep Escape-once from 5d.
- Chart: the only diff reverts `smallTick` (axis ticks under 1000 print raw floats; open in its `ds-gaps.md`).
- `semantic.css` / `summary.css`: drop `[data-theme]` selectors (nested dark themes stop re-resolving) and revert `--status-pending-fg` to the failing token.
- `Table.prompt.md`: loses the `selectionMode="leaves"` sentence though the code keeps it. We keep 5f-3.
- `typography.css`: legacy `--font-family-serif` alias; we already keep the token defined.

## Slices

| Slice | Branch | Scope | Status |
|---|---|---|---|
| **5g-1** | `traditional-ds-5g-1-focus-field` | FocusField module and global ring styles, Modal and Drawer `initialFocusRef` through it, doc page. | in progress |
| 5g-2 | `traditional-ds-5g-2-table-leaving` | Table `leavingKeys`, «Eliminar filas» demo with undo toast, brief closeout. | planned |

## Method

Plan gate before each slice. Full AGENTS.md read order, reuse before building, `_pre-flight.md`, `ds-token-guardian` on token and SCSS diffs, `bash scripts/clean-code-check.sh`, `npm run build` after every API commit, browser verification in light and dark, Unicaja segmented-control check at the end, push to `origin-afi` only.

## Findings from the session

- **2026-10-16, planning.** Plan approved by Richard at the gate.
