# Chunk 5 — Components: update existing primitives to the zip's look

**Project:** [index](2026-10-14-traditional-ds-0-index.md) · **Depends on:** [chunk 4 report](2026-10-15-traditional-ds-4-components-audit-report.md) (read it first, plus the appendix for the family you are working on) · **Source:** `~/Downloads/Afi_Wealth_Planner_clean.zip` (extract into a fresh empty directory outside the repo). A second zip with the sidebar flows and templates is coming; ask Richard for it before 5e.

## Goal

Bring the 41 v1 primitives in `libs/ui/src/` to the zip's look and API, in six sub-chunks (5a to 5f), one session each with a plan-mode gate. Chunk 4 found that no primitive is a pure token swap: every mapped primitive needs at least one new input, variant or size. Restyle (SCSS and token swaps) ships before API growth inside each sub-chunk, per the visual-parity rule.

## Out of scope

- `*-v2` primitives, `foundations-modern/`, white-label brand files (frozen, AFI only).
- New zip components (chunk 6), except the pulls-forward listed under 5b.
- Chart parity. The zip's multi-mode `Chart` becomes a new `afi-chart` in its own brief (6a-sized). Only the token repoint (`--data-*` to `--chart-*`, divergent tokens, legend pattern defs) rides 5a.
- Wealth Planner pages (chunk 7).

## Decisions locked (Richard, 2026-10-15)

1. Component-scoped tokens for **button, checkbox, menu, sidebar, table** are created in chunk 5 with their primitive. Insight, tour, statuspill and meter tokens stay in chunk 6.
2. `--radius-section` (12px) stays; `--section-radius` (16px) is retired in 5c with the `afi-section` deprecation. page-header moves from `--radius-lg` to `--radius-section`.
3. Chart: a new `afi-chart` modelled on the zip's `Chart` (own brief). Existing bar and line stay until it ships.
4. Sidebar hover-expand and pin are not decided now. The Wealth Planner sidebar uses `mode="static"`. Decide when building the sidebar in 5e, with the second zip.
5. **Touch floor.** 44px is a touch *area*, not the visible size. Buttons keep the zip's 24 to 40px range; small sizes get an invisible hit area to 44px. A general responsive rule steps controls up on mobile (zip `--control-h-*` is 40/44/48 there). Product is desktop-first, so this is a safety rule. Written into `accessibility.md` and `component-skill.md` in 5a.

## Still open (decide when the sub-chunk arrives)

- Stepper done colour: zip brand-primary vs our action colour (brand-secondary). Recommended: keep ours. (5e)
- nav-section tree lines: delete or keep behind a flag. (5e)
- Tabs and stepper APIs: add value-based and 0-based alongside the index ones, migrate later. Recommended. (5e)
- Card variants: zip `default` = `--surface-default`, ours `default` = `--surface-subtle`, our `quiet` = zip `default`. Renaming breaks about 30 files. Alias or migrate. (5c)
- Drawer row-nav (`1 de 5`): keep as an extension of the rewritten Drawer? (5d)
- Zip table densities: `Table.d.ts` says 36/52/64px, its CSS uses 32/44/56. Follow the CSS unless the zip authors say otherwise. (5f)

## Sub-chunks

| # | Scope | Notes |
|---|---|---|
| 5a Foundations | Control scale tokens (`--control-h-*` desktop 28/32/40, mobile 40/44/48; `--control-size-sm..2xl` 24 to 40; `--icon-button-size-*` incl. xl/2xl). Define or remove the nine undefined tokens (`--focus-ring`, `--duration-normal`, `--elevation-2`, `--type-body-sm`, `--space-3`, `--font-family-display`, `--radius-xs`, `--border-base`, `--border-thin`) plus `--data-diverge-*` and the legend pattern defs. `focus-ring` mixin in `styles`. `--button-*`, `--checkbox-size/glyph-*`, `--menu-item-*`, `--control-label-*`. Chart token repoint. SidebarIcon set (33 Lucide glyphs plus milestone icons). Touch-area and responsive rules in the docs. | Nothing below is right until the scale and dead tokens settle. Run `ds-token-guardian`. |
| 5b Controls | button, icon-button, input, select, search, checkbox, radio-group, switch, segmented-control, filter-chip. Pull forward from 6b: FieldHelp and MultiSelect (select's `trigger` slot and filter-chip dropdown mode need them). | Shared field anatomy (`help`, `required`, `shape=pill`, `numeric`, `unit`). Checkbox and radio are inline Tailwind: rewrite to the 3-file shape. **Unicaja check at the end:** segmented-control playground must still render radio cards. |
| 5c Display | badge, status-chip, avatar, card, page-header (add `icon`, `meta`, `titleAccessory`, role slots; split section levels), `afi-section` deprecation, `--section-radius` retire. | Drop `role=status` on badge. Replace legacy Tailwind colour aliases with semantic tokens. |
| 5d Overlays | modal, drawer, toast, tooltip, menu, loading-overlay. | Shared protocol: blur scrim (`--overlay-blur`, `--overlay-blanket-drawer`), `initialFocusRef`/`returnFocusRef`, Escape-consumed, z-ladder (`--z-dropdown`, `--z-floating`), portal. Drawer is a rewrite. Toast needs a service. |
| 5e Navigation | nav-item, nav-section, sidebar (`--sidebar-*` about 28), tabs, stepper (a11y rewrite), top-bar slot shell, shell variants. | Ends with the PlannerShell composite spec for chunk 7. Needs the second zip. Sidebar section geometry and stepper regression tests from the zip. |
| 5f Table | Restyle slice first (header 600, body ink, hover token, radius, info highlight), then API slices as separate briefs: leaves selection, tree column, reference row and footer, planning appearance. `--table-*` (24). | Largest single gap. |

## Method (every sub-chunk)

- Each sub-chunk starts with plan mode and a short brief in `docs/session-briefs/`, written before the work.
- Read the chunk 4 appendix block for each primitive: API gap, look gap, a11y gap and the cited zip test acceptance criteria. Mine the zip's `tools/*-tests.html` for regressions to carry into specs.
- Full AGENTS.md read order. Reuse before building. 3-file convention. `_pre-flight.md` per primitive. Token-only styling: semantic tokens, no raw values.
- `ds-token-guardian` on any token diff; `preflight` before commit; before and after screenshots of one page per touched family plus a dark-mode check.
- Compare mixin-aware. Brand-specific structure goes behind `[data-brand]`, never an input.
- White-label stays frozen. The one brand check is the segmented-control playground (Unicaja renders radio cards), at the end of 5b.
- Update this brief's "Findings from the session" per sub-chunk.

## Done when

- Per sub-chunk: its primitives pass the chunk 4 acceptance criteria, `preflight` is green, guardian review clean, screenshots show the intended shifts only, modern pixel-identical.
- Whole chunk: every audit row for a v1 primitive is closed, deferred with a reason, or moved to chunk 6.

## Findings from the session

- **5a:** see the 5a brief.
- **5b (Controls) done 2026-10-15** on `traditional-ds-5b-controls` (five commits groups: restyle, buttons and field anatomy, Select/Search/Switch/Checkbox/Radio, Segmented/Filter Chip/MultiSelect). Full findings, deviations from the zip and open items are in the [5b brief](2026-10-15-traditional-ds-5b-controls.md). Headlines: `tsc` does not check templates, so every API commit needs `npm run build`; plans that count consumers need a correct grep (two consumers were missed); the segmented-control Unicaja cards survived every step; the no-CDK panel duplication is the main debt going into 5d.
- **5c-1 (display, small primitives) done 2026-10-15** on `traditional-ds-5c-display`: badge, status-chip, avatar (+ group), card, `afi-section` deprecation. Page-header (5c-2) is next. See the [5c brief](2026-10-15-traditional-ds-5c-display.md).
- **5c-2 (page header) done 2026-10-15** on `traditional-ds-5c-display`, except the h1 title look, which waits for review as its own unpushed commit. See the [5c brief](2026-10-15-traditional-ds-5c-display.md).

