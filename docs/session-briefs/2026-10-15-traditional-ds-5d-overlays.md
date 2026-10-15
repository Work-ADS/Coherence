# Chunk 5d — Overlays

**Project:** [index](2026-10-14-traditional-ds-0-index.md) · **Parent:** [chunk 5](2026-10-15-traditional-ds-5-components-update-existing.md) · **Evidence:** [appendix B](2026-10-15-traditional-ds-4-audit-detail-B-display-feedback.md) (modal, drawer, toast, tooltip, loading-overlay), [appendix C](2026-10-15-traditional-ds-4-audit-detail-C-navigation-shell.md) (menu) · **Builds on:** [5b](2026-10-15-traditional-ds-5b-controls.md) (no-CDK portal debt), [5c](2026-10-15-traditional-ds-5c-display.md) · **Branch:** `traditional-ds-5d-overlays` · **Source:** `~/Downloads/Afi_Wealth_Planner_clean.zip`, extracted outside the repo (`components/feedback/`, `tools/*-tests.html`).

## Goal

Bring modal, drawer, toast, tooltip, menu and loading-overlay to the zip's look and API, and replace the hand-rolled portals with one shared floating panel and one overlay protocol. Restyle ships before API growth in every primitive. Token-only styling. `npm run build` after every API commit (`tsc` does not check templates). Grep consumers with multi-line attributes in mind.

## Out of scope

`*-v2`, `foundations-modern/`, white-label brand files (frozen; the one check is the segmented-control Unicaja playground still rendering radio cards). ProgressOverlay, TourSpotlight, InlineNotice, EmptyState (chunk 6d). Chart tooltips. Wealth Planner pages (chunk 7).

## Facts that shape the work

- No `@angular/cdk`. Select (`select.component.ts` ~186-218) and MultiSelect (~369) each portal by hand: `appendChild` to the open `<dialog>` else `body`, own backdrop, own positioning. Search, FilterChip and DropdownPanel use `position:absolute` + `z-index:50`; Menu hard-codes 50 and 1000; Tooltip is CSS-only, absolute, z 60.
- Modal uses native `<dialog>.showModal()` (top layer, focus trap, scroll lock, inert page). We keep it. Anything that must appear above a modal portals *into* the dialog; the shared panel keeps that rule.
- Drawer is Tailwind-class with inline template and styles (breaks the 3-file rule), no scrim, `role=region`. Zip Drawer is 30KB (pin, expand, tabs, groups). Rewrite.
- Toast is stateless; its enter animation never runs today (`--duration-normal`, `--elevation-2`, `--type-body-sm` are undefined).
- Consumers (multi-line aware grep, 2026-10-15): modal 14, drawer 3, toast 13, tooltip 13, menu 12, loading-overlay 8, dropdown-panel 9, select 30, multi-select 2.
- Tokens that exist: `--overlay-blur`, `--overlay-blanket`, `--overlay-blanket-drawer`, `--overlay-modal`, `--overlay-dropdown`, `--radius-modal`, `--radius-panel`, `--layout-shell-inset`, `--z-dropdown` (40), `--z-floating` (1050). Missing: `--z-drawer|modal|tooltip|toast|overlay`, `--dimension-modal-*`, `--font-mono`.

## Decisions

1. **Split into four sessions**, each with its own plan gate (recommended; awaiting Richard's confirmation at the gate).
2. Modal stays on native `<dialog>`.
3. Drawer row-nav (`1 de 5`) is kept as an ours-only extension unless Richard drops it.
4. Modal `closeOnBackdrop`: keep `false` for `type=form`, `true` for `type=confirm`; revisit at 5d-3.
5. Z-ladder: Drawer 900/901, Modal 1000, `--z-floating` 1050, Tooltip 1100, Toast and ProgressOverlay above; named tokens replace the zip's raw numbers.

## Sequence

### 5d-1 Protocol, floating panel, Tooltip
- Z-ladder tokens in `libs/tokens` (guardian review).
- `libs/ui/src/floating-panel/`: portal target (open dialog else body), fixed positioning, flip, 8px viewport clamp, reposition on scroll and resize, outside mousedown. No backdrop.
- Escape-once helper: capture phase, sets `defaultPrevented`; Modal and Drawer close only if not prevented.
- Select and MultiSelect move onto the panel (drops their portal code and the mirrored panel literals).
- Tooltip: portal + fixed position, restyle (control-900 bubble, body-sm-500, `--elevation-lg`, 6px gap), `maxWidth`, Escape protocol. `text`/`position` stay; add `label`/`placement` aliases.
- Acceptance (zip tests): `select-portal`, `field-help`, `control-height-floating`, `drawer-dropdown-layer`: panel inside viewport, flips up when no room, no `scrollWidth` growth in `.afi-table-wrap`, Escape closes the tooltip/select first and leaves a Drawer/Modal open.
- Ends with the Unicaja segmented-control check.

### 5d-2 Menu (+ Search, FilterChip, DropdownPanel panels)
- Restyle: `--menu-item-*`, `--radius-panel`, `--overlay-dropdown`, `--nav-item-*`, padding 4px all sides, extrude + row stagger; delete the hover `translateX` lean.
- Move to the shared panel (always portalled, flips, no auto-dismiss on scroll), return focus to trigger, Escape protocol, fix nested interactive item host, 3-file for the divider.
- API growth as separate commits: `checked/indeterminate`, `count`, `info`, `active`, `strong`, `selectable`/`closeOnSelect`. Ours-only kept: `danger`, `shortcut`, `secondaryLabel`, `matchAnchorWidth`.
- Search, FilterChip dropdown, DropdownPanel switch to the shared panel and the z tokens.

### 5d-3 Modal, Toast, Loading overlay
- Modal restyle: blur scrim, `--overlay-modal`, `--radius-modal`, sizes 400/540/760 (`--dimension-modal-*`), in-flow 32px close, `--type-subtitle`, footer without hairline, rise motion. Then API: `initialFocusRef`/`returnFocusRef`, omit X when blocking, wire `closeOnEsc`, fix the double `closed` emit, Escape protocol, `--surface-context` redeclared.
- Toast: fix the three dead tokens, restyle to the 40px pill, then `ToastService` + host (one at a time, 5000ms, pause on hover/focus, `tone`, `role=status`/`alert`, Escape). `afi-toast` stays as a wrapper. Acceptance: `toast-tests`.
- Loading overlay: token cleanup only (`--control-track-background`, `--brand-secondary-background-default`, `--foreground-tertiary-default`).

### 5d-4 Drawer rewrite
- 3-file component, zip geometry (8px `--layout-shell-inset`, `--radius-modal`, `--elevation-xl`, `--overlay-blanket-drawer` + blur, slide-in), `role=dialog` `aria-modal=false`, panel-first focus, `initialFocusRef`/`returnFocusRef`, scroll lock, Escape protocol.
- API slices after the restyle: `description`, `width`, pinned `footer`, tabs, `groupDividers`, expand, pin (`DRAWER_PIN_MIN_WIDTH` 1440). Row-nav kept.
- Acceptance: `drawer-framing`, `drawer-width` (375px, content ≥280, no h-overflow), `drawer-focus`, `drawer-full`, `drawer-pin`, `drawer-groups`, `drawer-dropdown-layer`.

## Method (every sub-chunk)

Plan mode with a short section here before code. Full AGENTS.md read order, reuse before building, 3-file convention, `_pre-flight.md`, `ds-token-guardian` on token diffs, `preflight` before commit, before/after screenshots of one page per family plus dark mode, doc pages preview the real component. The repo has no test runner: each zip test becomes a browser check recorded in the findings.

## Done when

Every audit row for these six primitives is closed, deferred with a reason, or moved to chunk 6; no hand-rolled portal remains in `libs/ui`; no raw `z-index` numbers in overlay primitives; `preflight` and `npm run build` green; guardian clean.

## Findings from the session

- **2026-10-15, planning only.** Branch cut from Azure `main`; zip extracted outside the repo; no code written. Plan approved by Richard; the four-way split is the recommendation carried here.

### 5d-1 done 2026-10-15 on `traditional-ds-5d-1-floating-panel`

- **Built:** `libs/ui/src/floating-panel/` (`FloatingPanel`: portal to the open `<dialog>` else `body`, fixed placement by side + align, flips and clamps to the viewport from the measured panel, follows scroll and resize, optional outside-mousedown; `overlay-escape.ts`: capture-phase stack, newest layer takes the Escape and marks it `defaultPrevented`). Z-ladder tokens `--z-drawer|modal|tooltip|toast|overlay`. Tooltip tokens `--tooltip-background|foreground|gap|max-width` (fixed polarity: `--foreground-inverse-*` flips in dark). `component-skill.md` Overlays section rewritten (no CDK).
- **Select and MultiSelect** lost their portal code, backdrop element, mirrored 288/256 literals, scroll listeners and the destroy yank. The panel is still rendered by the template and handed to `FloatingPanel` from an `effect`; the panel's CSS supplies `margin-block` (the gap, read by the helper) and reads `--floating-anchor-width` for its minimum width.
- **Tooltip** is portalled, fixed, `--z-tooltip`, zip look (`--type-body-sm-500`, `--radius-control`, `--elevation-lg`, 6px gap), new `maxWidth`, JS delay replaces the CSS transition-delay. The bubble stays in the DOM (`display:none` until shown) so `aria-describedby` always resolves.
- **Verified in the browser:** Select panel on `body`, 4px below the trigger, flips above in a 380px viewport and follows page scroll; outside mousedown and Escape close it; inside a modal it portals to the dialog and sits on top; with real keys, the first Escape closes only the list and the second closes the modal; MultiSelect panel, Escape and outside click; Tooltip shows on hover, Escape dismisses, bubble on `body` with `z-index` 1100, a multiline click-tooltip in a 200px scroll box adds no `scrollWidth`; Unicaja segmented control still renders radio cards. `tsc` and `npm run build` green.
- **Behaviour changes to know:** no backdrop under Select/MultiSelect (the closing click now reaches the page); MultiSelect no longer right-aligns near the right edge, it clamps; Select's keyboard scroll-into-view now finds rows in the portalled panel (it never did before: it searched the host).
- **Found while here:** Select's old `scrollFocusedIntoView` queried the host for a listbox that had already been portalled out, so keyboard scrolling in long lists never worked.
- **Deferred:** the Tooltip `label`/`placement` aliases (not needed for the 13 consumers); a Drawer part of `drawer-dropdown-layer` waits for 5d-4.

### 5d-2 done 2026-10-15 on `traditional-ds-5d-2-menu-panels`

- **Menu restyle** (SCSS only): panel `--overlay-dropdown` / `--border-subtle` / `--radius-panel` / `--elevation-lg`, 4px padding all round, min width 124 (`--dimension-31`) or the trigger's (`matchAnchorWidth`); rows on `--menu-item-*` and `--nav-item-*` roles, inset focus ring, disabled by token roles, full-bleed divider, icon lean-in deleted, panel extrudes from its trigger edge and rows rise in a stagger (each row reads its own `:nth-child` position, so projected content needs no index).
- **Menu behaviour:** always portalled through `FloatingPanel` (the old auto-dismiss on scroll and the backdrop are gone), flips and clamps, outside `mousedown` closes, `onOverlayEscape` (Escape no longer closes a Drawer or Modal behind), focus goes to the first enabled row on open and back to the opener on close, arrows wrap and skip disabled rows (they work again for anchored menus: the old code searched the host after the panel had been portalled out). One interactive element per row: the host is `role="none"`, the inner button is the `menuitem`, so Enter and Space no longer double-emit. Menu and item now use `.html` files; the divider got the 3-file split.
- **Search** suggestions, **FilterChip** built-in dropdown and **DropdownPanel** moved onto `FloatingPanel` (fixed, `--z-floating`, the margin is the gap). DropdownPanel keeps its click-outside by `click` (not `mousedown`) so a consumer's trigger click still toggles; its shell is now the shared panel shell.
- **Without `[anchor]`** the menu sits against its host and treats the element just before it as the trigger (all repo consumers put the trigger directly before the menu). Pass `[anchor]` when the trigger is elsewhere.
- **Doc pages:** Menu page labels fixed (it projected text the row never rendered); Dropdown Panel page now previews a real trigger and panel (it was an empty always-open box).
- **Verified in the browser:** Menu opens on `body` at z 1050, rows 40px, focus on the first row, ArrowDown moves, Escape closes and returns focus to the trigger, outside mousedown closes, a row click closes once; anchored Menu (Patrimonial add button, `bottom-end`) lines its right edge with the trigger, 4px below, trigger click toggles closed; Dropdown Panel inside click keeps open, outside click, trigger toggle and Escape; Search typeahead panel under the field at the field's width, Escape closes the list and keeps focus and text. `tsc` and `npm run build` green.
- **Not verified:** the FilterChip built-in dropdown (its only consumer, `legado-retiro`, needs seeded patrimonio data; the code path is the same helper) and a Menu inside a native dialog.
- **Deferred to 5d-2b:** Menu API growth (`checked`/`indeterminate`, `count`, `info`, `active`, `strong`, `selectable`, data-driven `items`).
