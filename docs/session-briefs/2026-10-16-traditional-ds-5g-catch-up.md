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
| **5g-1** | `traditional-ds-5g-1-focus-field` | FocusField module and global ring styles, Modal and Drawer `initialFocusRef` through it, doc page. | done 2026-10-16 |
| 5g-2 | `traditional-ds-5g-2-table-leaving` | Table `leavingKeys`, «Eliminar filas» demo with undo toast, brief closeout. | done 2026-10-16 |

## Method

Plan gate before each slice. Full AGENTS.md read order, reuse before building, `_pre-flight.md`, `ds-token-guardian` on token and SCSS diffs, `bash scripts/clean-code-check.sh`, `npm run build` after every API commit, browser verification in light and dark, Unicaja segmented-control check at the end, push to `origin-afi` only.

## Findings from the session

- **2026-10-16, planning.** Plan approved by Richard at the gate.
- **5g-1 done 2026-10-16** on `traditional-ds-5g-1-focus-field`.
  - **FocusField** is a plain module in `libs/ui/src/focus-field/` (`focusField`, `focusFirstInvalid`, `FocusField.focus/firstInvalid`), exported from the public API. Targets: element, `ElementRef` or selector; a wrapper resolves to its first control.
  - **Ring styles** are a global partial (`_focus-field.scss`) imported from `apps/site/src/styles.scss`, because the helper marks controls owned by other components. Two `!important` declarations (the ring) because encapsulated component rules outrank a global attribute selector. **Deviation from the zip:** the 300ms settle animates `outline` (a halo that fades), not `box-shadow`, because an `!important` declaration beats a running animation, so the zip's version could never play.
  - **Painted boxes:** only the controls whose ring is not on the focused element are listed (`.afi-input__shell`, `.afi-search`, `.afi-check__box`, `.afi-radio__ring`); a plain input, select and multi-select triggers, switch track and segmented buttons draw the ring on themselves.
  - **One ring at a time:** a new jump clears any ring left behind, because a document without focus never fires blur.
  - **Modal and Drawer** `initialFocusRef` go through `focusField` (scroll `nearest`, inside the body), falling back to plain focus. Consumers: zero templates set `initialFocusRef`, so nothing changes for existing pages.
  - **Doc page** `/componentes/focus-field` with a scrolling form (jump, first invalid) and a Drawer that opens on a field below the fold; Modal and Drawer pages link to it.
  - **Verified in the browser:** jump to the last field scrolls the form container (page scroll 0) and rings the field; «Guardar con errores» focuses the first invalid field with the error ring, light and dark; the drawer opens on its last field with the ring visible; no console errors; `tsc`, `npm run build` green (the one budget warning is the frozen Sarevi page).
  - **Not verified:** the Modal path in the browser (same code shape as the drawer), blur clearing the ring in a focused window (the Browser pane has no document focus), the halo animation (the pane freezes animations), reduced motion, checkbox and radio ring boxes.
  - **Guardian:** all tokens exist and resolve in dark. Fixed: a "24px" in a comment, and the two timing constants now say which token they mirror. Accepted: the error ring uses `--feedback-error-border`, the same pairing the input's own error focus ring uses.
- **5g-2 done 2026-10-16** on `traditional-ds-5g-2-table-leaving` (cut from the 5g-1 branch because 5g-1 was not merged yet; merge 5g-1 first).
  - **API (additive):** `leavingKeys` (array or `Set` of `trackByKey` values, default empty). A matching row gets `data-leaving` and `aria-hidden="true"`; its cells fade over `--duration-fast` on `--easing-exit`, take no pointer events, and have no transition under reduced motion. The consumer owns the 150ms timer and drops the row from `rows` itself; the rows below close the gap with no slide (a `<tr>` cannot be FLIPped). No new token. Consumers: 23 files render `afi-table`, none sets `leavingKeys`.
  - **Doc page:** an «Eliminar filas» demo on the table page with the real component, the built-in delete row action, and `ToastService` («Fila eliminada», «Deshacer», 5s); undo puts the row back at its old position.
  - **Verified in the browser:** delete marks the row `data-leaving` with `aria-hidden="true"`, pointer events none, `opacity 0.15s` transition; after the fade the row count goes 4 to 3, the toast reads «Fila eliminada Deshacer», undo restores 4 rows with the row back in second place; no console errors; `tsc` and `npm run build` green.
  - **Not verified:** the fade itself on screen (the Browser pane freezes animations), reduced motion, dark mode of the fade, a keyboard walk of the delete action.
  - **Not done on purpose:** the «Eliminar registros» pattern page (needs a Modal that names dependent records; its own piece of work if Richard wants it).
  - **Carry-forward for chunk 6** is the list at the top of this brief (SummaryPanel `meta/tone/status/visual`, EmptyState `choices`, InlineNotice `targets` with FocusField). 5g is complete once both PRs are merged.
  - **Guardian (approve):** tokens exist, specificity beats every cell rule with no conflict, reduced motion correct. Accepted: the demo's `DELETE_FADE_MS = 150` is tied to `--duration-fast` by a comment only (fine for a doc page); a highlighted row that is deleted keeps its tint for the 150ms.
