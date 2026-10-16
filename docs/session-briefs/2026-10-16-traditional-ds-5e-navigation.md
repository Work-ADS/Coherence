# Chunk 5e — Navigation

**Project:** [index](2026-10-14-traditional-ds-0-index.md) · **Parent:** [chunk 5](2026-10-15-traditional-ds-5-components-update-existing.md) · **Evidence:** [appendix C](2026-10-15-traditional-ds-4-audit-detail-C-navigation-shell.md) · **Builds on:** [5d](2026-10-15-traditional-ds-5d-overlays.md) (Tooltip, floating panel) and [5f](2026-10-16-traditional-ds-5f-table.md) (method) · **Branches:** `traditional-ds-5e-1-navigation` and one per later slice · **Source:** the newer zip, `~/Downloads/Afi Wealth Planner (19).zip` (exported 2026-10-16), compared with `~/Downloads/Afi_Wealth_Planner_clean.zip` (2026-10-14).

## Goal

Bring nav-item, nav-section, sidebar, tabs, stepper and the top-bar slot shell to the zip's look and API, and write the PlannerShell composite spec that chunk 7 needs. Restyle ships before API growth in each primitive. Token-only styling. `npm run build` after every API commit. Additive and opt-in wherever a page depends on today's behaviour.

## Out of scope

`*-v2` primitives, `foundations-modern/`, white-label brand files (frozen; the one brand check stays the segmented-control Unicaja playground), the Wealth Planner pages (chunk 7), the `planner-top-bar` composite (chunk 7), the PlannerShell component itself (spec only here), the catch-up of other primitives (its own brief).

## Facts that shape the work

- **The newer zip barely changed navigation.** NavItem, Tabs, Stepper and AppShell are byte-identical between the two zips. Changed: Sidebar (`dotLabel`, `expandMotion`, rail-mark `:has(:focus-visible)` fix), TopBar (`exit` slot), PlannerShell (`focusMode`, `focusExit`, `focusSidebar`), Menu and NotesPopover. The sidebar tokens in `semantic.css` did not change. Appendix C stays the evidence; the newer zip only adds focus mode, dot meaning and expand motion.
- **Consumers (multi-line aware, 2026-10-16):** `afi-tabs` 24 files (21 with `afi-tab-item`); `afi-sidebar` 4 (preview page, `patrones/sidebar-ia-comparison`, demo `planner-sidebar`, plus the modern workbench uses `-v2`); `afi-nav-section` 2 (doc page, ia-comparison with 7 tags); `afi-nav-item` 5 (preview, doc page, library docs); `afi-stepper` 4 (preview, proteccion-familiar, optimizacion-asset, laboral-kutxa-sarevi which is white-label frozen); `afi-top-bar` 2 (the site's own bar in `app.component.html`, and the modern workbench); `afi-shell` 1.
- Doc pages exist for nav-item, nav-section, tabs, shell. Sidebar, stepper and top-bar are shown only on the `/preview` page. A slice that restyles a primitive without a doc page adds one.
- `--menu-item-*` already exist (5d). `--sidebar-*` (about 28) do not; zip `semantic.css:352-384`. Our `--sidebar-width` (260, editorial) is a different token and stays.
- nav-item, nav-section and the shell templates are inline (`template:` and `styles:`), which breaks the 3-file rule; the shell also uses Tailwind utility classes. nav-item and nav-section move to three files when touched; the shell is covered by the PlannerShell spec.
- **For the catch-up:** the newer zip's Menu and NotesPopover REVERTED the capture-phase `preventDefault` on Escape (its own `ds-gaps.md` lists «Nested Escape» as open). We shipped Escape-once in 5d; do not port the revert.

## Decisions (proposed 2026-10-16, for Richard to confirm or flip at the plan gate)

1. **Sidebar modes.** Keep the slot composition and keep `hover-expand` and pin working and as the default. Add the zip's model on top: 72px rail (ours 64), explicit collapse toggle, `static` as the planner mode, variants `flush-light` and `inset-dark` beside `neutral` and `secondary-azul` (kept until chunk 7 retires `planner-sidebar`). No new work on hover-expand or pin; revisit when chunk 7 lands.
2. **Tree lines.** `showTreeLines` default flips to false (the zip has none); the machinery stays behind the flag this chunk. The ia-comparison page sets the flag so it looks the same. Delete the ~120 lines later if nobody opts in.
3. **Stepper done colour.** Keep ours (AFI action colour, brand-secondary). The zip's `--button-primary-background-default` is not created.
4. **Tabs and Stepper APIs.** Value-based `tabs`/`value` and 0-based `current` are added beside the index ones. No migration of the 24 tab consumers.
5. **TopBar.** The generic slot shell stays; geometry (48px, 24px gutter, glass hairline) is opt-in, plus `on-brand` and the `exit` slot. Trail, state menu and indicators live in a future `planner-top-bar` composite (chunk 7).
6. **PlannerShell.** Spec only in this chunk, written at the end of 5e-5.

## Slices

| Slice | Branch | Scope | Status |
|---|---|---|---|
| **5e-1** | `traditional-ds-5e-1-navigation` | `--sidebar-*` tokens; nav-item restyle then API (`step`, `trailing`, `as`/`href`, focusable `aria-disabled`, `selected`); nav-section restyle (uppercase title, chevron after label, flat default, inert collapsed children) and 3-file conversion. Mines `chevron-selection-spacing-tests` and `sidebar-section-geometry-tests`. | in progress |
| 5e-2a | `traditional-ds-5e-2-sidebar` | Sidebar tokens, variants `flush-light` and `inset-dark`, 72 rail, scroll thumb, `max-content` width in static mode; landmark and list fixes; a SIDEBAR injection token so rows and sections know the rail; doc page. | in progress |
| 5e-2b | `traditional-ds-5e-2b-sidebar-api` | `dot`, `dotLabel`, `disabledReason` with tooltips, rail tooltips, `product`, logo, `user`, `header`, rail mark, `expandMotion`. | planned |
| 5e-3 | `traditional-ds-5e-3-tabs` | Tabs restyle (gap, weights, inks, count chip, indicator, `--tab-height`, `backwards` fill, no first-render animation, resize and font refresh), then `value`, `tabs`, `fullWidth`, `count`, `icon`, `TabPanel`. Checked against all 24 consumers. | planned |
| 5e-4 | `traditional-ds-5e-4-stepper` | A11y rewrite per `stepper-a11y-regression`, current ring, `sub`, `state`, `compact`, zip `inline`, 0-based `current`, click gating. | planned |
| 5e-5 | `traditional-ds-5e-5-shell-bar` | TopBar opt-in geometry, `on-brand`, `exit` slot; PlannerShell spec incl. focus mode; open items. | planned |

A catch-up slice (Modal, Drawer, FocusField, Table `leavingKeys`, Menu, Search, Chart, SummaryPanel, EmptyState, InlineNotice) gets its own brief after 5e-1.

## Method

Plan mode with a section here before each slice's code. Full AGENTS.md read order, reuse before building, `_pre-flight.md`, `ds-token-guardian` on token and SCSS diffs, `bash scripts/clean-code-check.sh`, `npm run build` after every API commit, before and after measurements in light and dark, the Unicaja segmented-control check at the end, push to `origin-afi` only.

## Findings from the session

- **2026-10-16, planning.** Branch cut from Azure `main` (PR 53939). Plan approved by Richard at the gate.
- **5e-1 done 2026-10-16** on `traditional-ds-5e-1-navigation` (three commits after the brief: nav-item restyle, nav-section restyle, API).
  - **Tokens** in `libs/tokens/components.scss`: NAV ITEM gained `--nav-item-font`, `--nav-item-font-selected`, `--nav-item-rule-width`, `--nav-item-rule-background`, `--nav-item-step-size`; a new SIDEBAR block holds only what nav-section reads today (`--sidebar-foreground`, `-foreground-hover`, `-icon`, `-background-hover`, `-item-height`) with dark values in the file's dark block. **Deviation from the plan:** the other ~23 `--sidebar-*` tokens wait for 5e-2, where the sidebar reads them (declaring them now would leave unused tokens, the 5f precedent). `--button-primary-background-default` already exists, so the stepper needs no new token.
  - **Nav item restyle:** padding 8/12, `--radius-control`, 500 at rest and 600 selected, 3px leading rule on the selected row, 16px icon, disabled through the `--nav-item-*-disabled` roles instead of opacity, outward focus ring through the shared `focus-ring` mixin, the 11px hard-coded badge font removed. Measured on the doc page: 36px rows, 8px 12px padding, 10px radius, 16px icon box. Template moved to its own `.html` (3-file rule).
  - **Nav item API (additive):** `selected` (alias of `active`, both mark the current page), `step` (numbered chip instead of the icon), `as` (`button` default or `a`, with `href`; the class property is `tag` because `as` is a reserved word in Angular templates), `disabledReason` (a disabled row stays focusable with `aria-disabled` and `aria-describedby` to a visually hidden reason; unset it is disabled as before), a `[slot=trailing]` slot.
  - **Nav section restyle:** uppercase 12/500 title at 36px with `--tracking-wider`, hover and focus surface inset 4px from the full-width button, child rows 36px two apart with 400 weight (500 selected) and no selected rule, collapsed children `inert` (they were still in the tab order), the English default `aria-label` «Section: …» removed (the visible label names the button). Template moved to its own `.html`.
  - **Nav section API:** `chevronPosition` gains `after-label` and it is the new default (20px box, 4px after the label; no shift between open and closed); `showTreeLines` default is now false. Consumers: only the ia-comparison page sets these, and it sets both explicitly, so it keeps tree lines and the right chevron; nothing else in the apps renders the primitive.
  - **Sidebar `secondary-azul`** rebinds the new sidebar roles and the disabled roles (a pale disabled fill on navy otherwise).
  - **Measured (nav-section doc page):** title 36px, chevron box 20x20, label to box 4px, label x 12 equals child text x 12, surface inset 4px, rows 36px, the chevron box stays put when the section collapses, collapsed wrapper `inert`. Matches `sidebar-section-geometry` and `chevron-selection-spacing`. ia-comparison and `/preview` render (6 rows at 36px, one selected, no console errors). Unicaja segmented-control radio cards still render.
  - **Dark mode (nav-section doc page, transitions off because the hidden Browser pane freezes them):** title 12.04:1, child rows 16.98:1, selected row 5.54:1 on the control-900 panel.
  - **Not verified:** the preview sidebar in its collapsed rail, a real keyboard walk with a screen reader, `as="a"` rendering in a sidebar, the `step` chip look in a real wizard nav.
  - **Guardian fixes (same slice):** the selected rule defaulted to the azul panel's own colour, so on `secondary-azul` it vanished; that variant now rebinds `--nav-item-rule-background` to the ink. An undefined hook `--nav-item-gap-inline` is gone: the row now reads the existing `--nav-item-gap` (changed from `--space-xs` to `--space-sm`, nothing else read it) and `--nav-item-padding-x`. Every `afi-nav-item` inside a section renders as a child row (weight 400, 500 selected, no rule); the doc page says so.
  - **Accepted, for Richard to veto:** the new SIDEBAR tokens bind to `--color-afi-control-*` primitives, like `--table-row-background-hover` and `--switch-track-off` in the same file; a non-AFI brand gets AFI greys in its sidebar until a semantic role exists. `--sidebar-icon` colours only the chevron today (a slotted title icon inherits the title ink); the sidebar slice will use it for page icons.
- **5e-2 planned 2026-10-16.** Richard chose to keep `hover-expand` (still the default) and pin and add the zip model beside them. Split into 5e-2a (restyle, tokens, a11y; the new variants carry the zip look, `neutral` and `secondary-azul` stay as they are so `/preview`, the IA page and `planner-sidebar` do not move) and 5e-2b (API). The zip's prompt text says 40px rows and an 88px brand row; its CSS and tokens say 36px rows, a 48px brand band and a 52px pitch, and we follow the tokens.
