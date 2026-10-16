# Chunk 5e-5 — Top bar and the PlannerShell composite spec

**Project:** [index](2026-10-14-traditional-ds-0-index.md) · **Parent:** [5e navigation](2026-10-16-traditional-ds-5e-navigation.md) · **Evidence:** [appendix C, top-bar and shell](2026-10-15-traditional-ds-4-audit-detail-C-navigation-shell.md) · **Branch:** `traditional-ds-5e-5-shell-bar` (from Azure `main`) · **Source:** `components/navigation/TopBar.jsx` and `.d.ts`, `components/layout/PlannerShell.jsx`, `.d.ts`, `.prompt.md`, `plannershell-focus.card.html` (newer zip, 2026-10-16) and `tools/topbar-brand-tests.html`. Own file so it cannot collide with the 5e brief.

## Goal

Take the zip's bar geometry, `on-brand` variant and `exit` slot into our generic `afi-top-bar` without moving the site's own bar, and write down what the PlannerShell composite has to be so chunk 7 can build it.

## Decision (audit option A)

`afi-top-bar` stays the generic three-slot shell. The Wealth Planner bar (breadcrumb trail, state menu, indicators, inline rename, hand-off, notes) is a **separate composite, `planner-top-bar`**, built in chunk 7 on top of it. Everything below that touches size is opt-in, because the site's own bar (`app.component.html`, glass, 56px, 16px gutter) and the modern workbench use `afi-top-bar` today.

## Findings from the session

- **5e-5 done 2026-10-16** (three commits: bar, doc page, fix; plus this brief).
  - **`shellBand` (opt-in, default off).** Fills the shell header band (`--layout-shell-header`, 48px: the same band the sidebar brand row uses), insets by the content rail (`--layout-rail-inset`, 24px; `--layout-rail-inset-sm`, 16px when the bar is 40rem wide or less, measured on the bar through a container on the host), keeps the hairline under glass (`borderless` drops it) and makes glass sticky. The container is declared only in this mode: a size container is a containing block for fixed descendants, which is what clipped the zip's own bar toast. **Measured:** with it off the site's bar is unchanged (56px, 16px gutter, glass tint); with it on the demo bar is 48px, 24px gutter, glass `sticky` with its 1px hairline.
  - **`variant="on-brand"`.** No surface, no hairline, light ink from a fixed-polarity component token (`--top-bar-on-brand-foreground`: the page-relative inverse flips to dark ink in dark mode and would vanish on the brand canvas); slotted controls get the inverse focus ring (`--border-focus-inverse`) and hover and active wash. The text roles are deliberately not rebound, so a control with its own surface (the secondary exit button) keeps its ink: a first version rebound them and painted white text on a white button.
  - **`[slot=exit]`.** One control after the end zone, behind its own hairline rule (24px, inverse wash on-brand), never hidden at narrow widths, and the whole zone (rule included) disappears while nothing is projected (`:has(.top-bar__exit-slot:empty)`). Measured: rule 24px, button «Salir del asistente»; hidden when empty.
  - **Also:** the redundant `role="banner"` is gone (a `header` is already the banner landmark; two bars no longer declare two explicit banners) and `ariaLabel` names a bar when a page has more than one. `TopBarVariant` is exported. The old `/componentes/top-bar` redirect to the site-nav pattern was removed: the route is now the primitive's doc page (variant, shell band, borderless, exit, tokens, a11y); the composed site bar stays at `/patrones/cabeceras/top-bar`.
  - **Not verified:** a real narrow bar (the 16px gutter at 40rem and under, the hidden pane does not resize containers), dark mode of on-brand in the browser, the exit rule on a glass bar over moving content, a screen reader pass.

## PlannerShell composite spec (for chunk 7; no code here)

**What it is.** The Wealth Planner application shell: a persistent Sidebar, the bar at the top of the content card, one independently scrolling content region with the content rail inside it, and an overlays layer. `afi-app-shell` (zip `AppShell`: ground, bar, one raised card, no sidebar) is the sibling for screens without persistent navigation.

**Slots (as elements, not wrappers).** `sidebar` (an `afi-sidebar`, `variant="flush-light"` or `inset-dark`, `mode="collapsible"`), `bar` (an `afi-top-bar` with `shellBand`, or the future `planner-top-bar`), default content, `rail` (cap on or off), `overlays` (Drawer, Modal, tour spotlights, mounted at frame level, never inside the scroller). The shell completes the slotted elements by providing context (an injection token, as the sidebar does for its rows), not by cloning.

**Alignment rule.** Sidebar and main column are siblings under one `--layout-shell-inset` padding, so both start at the same block edge. The bar fills the shell header band and the sidebar brand lockup centres in the same band, so lockup and bar content share one centre line. No product may add a margin, transform or offset to correct it.

**Bar and scrolling.** A glass bar sits inside the scroll region, sticky at its top, so content travels under it; other variants are a fixed row above the scroller (`stickyBar` forces either). The bar stays uncapped and takes the rail inset, so the bar and the capped content converge into one rail at narrow widths; `rail` caps content at `--layout-rail-max`, `flush` removes cap and padding.

**Hand-off at 768 (`--layout-bp-handoff`), measured on the shell's own width.** The persistent sidebar leaves and the same navigation returns as a drawer (expanded, not collapsible, never duplicated; Escape closes it, focus returns to the opener, a scrim sits behind); the bar re-forms into its compact composition and its menu button opens the drawer. The breakpoint reads the shell's content width inside the inset, so a full window switches at about 784px; keep that known quirk or fix it deliberately.

**Collapsed state.** The shell forwards `collapsed` and `collapsedChange` to the sidebar only when the sidebar does not set it; omitted, the sidebar owns it. In our Sidebar that is `mode="collapsible"` plus the `expanded` input and `expandedChange`.

**Focus mode** (guided flows and wizards; default off, the shell is unchanged):
- `focusMode: boolean`, `focusExit: node` (one control, normally a secondary button «Salir del asistente») and `focusSidebar: 'rail' | 'hidden'` (default `rail`).
- While on: the sidebar is forced to the rail with no collapse toggle (`rail`) or leaves the frame (`hidden`); the breadcrumb stays; `focusExit` goes into the bar's `exit` slot unless the bar sets its own; the bar's menu hand-off and the navigation drawer are off, so the exit is the only way out. One exit only: no «Cancelar» in the page header as well.
- When it ends: the sidebar returns to its own collapsed state, and if that is expanded it opens with `expandMotion="reveal"` for that render (width in `--duration-slow` on `--easing-enter`, none under reduced motion).
- In rail focus mode the rail icons still navigate; use `hidden` when a flow must not be left that way.

**What the DS already has for it (after 5e).** Sidebar: `flush-light` and `inset-dark`, 72px rail, `isRail` context, `expandMotion`, dot, `disabledReason`, `user`, `product`, `header`. Top bar: `shellBand`, `on-brand`, `exit`. Tokens: `--layout-shell-header`, `--layout-shell-inset`, `--layout-rail-*`, `--layout-bp-handoff`, `--canvas-brand`.

**What chunk 7 still has to build.** (1) The shell component itself in the 3-file shape with tokens only: `afi-shell`'s workspace, focus and canvas templates are inline with Tailwind-style classes and the focus type is a stub; the new component should replace the workspace template rather than extend it. (2) The 768 hand-off: a drawer that reuses the sidebar and a bar menu button. (3) `planner-top-bar` (trail, state menu, indicators, rename, notes) on `afi-top-bar`. (4) Replace the demo-local `site-planner-sidebar` and `site-planner-top-bar` with the DS pieces. (5) The `overlays` layer and focus return rules.

## Open items after 5e

- Menu API growth (5d-2b) and Drawer growth (5d-4b), only when a page needs them.
- Tabs: composed `onKeyDown` (consumer veto), migrating consumers to `value`.
- Nav section tree lines (kept behind `showTreeLines`, default off): delete the ~120 lines if nobody opts in.
- Sidebar: the data-driven `items` shape is intentionally not built; hover-expand and pin stay, unchanged.
- Stepper and sidebar token inks bind to `--color-afi-control-*` primitives in `components.scss` (no semantic role yet; a non-AFI brand gets AFI greys).
- Hidden-pane limits: `ResizeObserver` and transitions do not run while the Browser pane is hidden, so reveal motion, indicator re-measure on show, narrow container gutters and reduced motion are unverified across 5e.
