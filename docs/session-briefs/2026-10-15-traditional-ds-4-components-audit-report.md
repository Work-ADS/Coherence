# Chunk 4 — Component audit report

**Brief:** [chunk 4](2026-10-15-traditional-ds-4-components-audit.md) · **Index:** [project](2026-10-14-traditional-ds-0-index.md) · **Date:** 2026-10-15 · **Read-only:** nothing under `libs/`, `apps/` or `scripts/` changed.

Per-primitive detail (API gap, look gap, behaviour and a11y gap, acceptance criteria cited from the zip's `tools/*-tests.html`, file:line evidence) lives in four appendices. This file is the synthesis.

- [A: buttons and forms](2026-10-15-traditional-ds-4-audit-detail-A-buttons-forms.md) (13 primitives)
- [B: display and feedback](2026-10-15-traditional-ds-4-audit-detail-B-display-feedback.md) (15)
- [C: navigation and shell](2026-10-15-traditional-ds-4-audit-detail-C-navigation-shell.md) (9)
- [D: data and charts](2026-10-15-traditional-ds-4-audit-detail-D-data-charts.md) (4 folders, chart split by sub-component)

## Headline

41 v1 folders audited. **None is a match, and none is a pure token swap.** Every primitive that maps to a zip component needs at least one new input, variant or size, so chunk 5 is not "restyle". The SCSS half of most rows is restyle-sized and can ship first; the API half is a separate pass (visual-parity rule).

| Verdict | Count | Folders |
|---|---|---|
| restyle | 2 | status-chip, styles (focus-ring mixin) |
| API gap | 15 | avatar, badge, button, card, icon-button, input, menu, modal, nav-item, search, segmented-control, select, switch, table, tabs |
| restyle + API gap | 2 | nav-section, stepper (stepper also needs an a11y template rewrite) |
| structural | 10 | checkbox, radio-group, filter-chip, page-header, drawer, toast, tooltip, sidebar, top-bar, shell (workspace type) |
| no zip equivalent | 11 | animated-chart, copy, download-md-button, dropdown-panel, editable-text, inline-edit, kbd, loading-overlay, logo, section, table-apron |
| mixed (chart) | 1 | chart: line, bar, tooltip structural; legend, keyboard API gap; axis restyle + API; heatmap, dumbbell, composition no equivalent |

## Summary table (every v1 folder, once)

| Folder | Zip match | Verdict | Size | Appendix |
|---|---|---|---|---|
| animated-chart | none | no equivalent (token hygiene) | S | D |
| avatar | Avatar, AvatarGroup | API gap | S-M | B |
| badge | Badge | API gap | M | B |
| button | Button | API gap | M | A |
| card | Card | API gap | M | B |
| chart | Chart (line, bar, tooltip, legend, axis, a11y) | structural (line, bar, tooltip L); API gap (legend M, keyboard S-M); restyle+API (axis M); no equivalent (heatmap, dumbbell, composition, instructions, data-table) | L | D |
| checkbox | Checkbox | structural | L | A |
| copy | none | no equivalent (keep) | S | B |
| download-md-button | none | no equivalent (docs utility; should consume afi-button) | S | B |
| drawer | Drawer | structural | L | B |
| dropdown-panel | none | no equivalent | S | A |
| editable-text | none | no equivalent (dedupe with inline-edit) | S | A |
| filter-chip | FilterChip, MultiSelect chip trigger | structural | L | A |
| icon-button | IconButton | API gap | M | A |
| inline-edit | none | no equivalent | S | A |
| input | Input | API gap | M | A |
| kbd | none | no equivalent | S | B |
| loading-overlay | none (ProgressOverlay is different) | no equivalent | S | B |
| logo | none (zip uses assets) | no equivalent | S | B |
| menu | Menu | API gap | L | C |
| modal | Modal | API gap | M | B |
| nav-item | NavItem | API gap + restyle | M | C |
| nav-section | Sidebar group | restyle + API gap | M | C |
| page-header | PageHeader, PageSection, PageActions (3 fused) | structural | L | B |
| radio-group | Radio, RadioGroup | structural | L | A |
| search | Search | API gap | M | A |
| section | none (closest PageSection framed) | no equivalent; deprecation candidate | M | B |
| segmented-control | SegmentedControl | API gap | L | A |
| select | Select | API gap | M-L | A |
| shell | AppShell, PlannerShell (partial) | structural (workspace); rest no equivalent | L | C |
| sidebar | Sidebar | structural | L | C |
| status-chip | StatusChip | restyle | S | B |
| stepper | Stepper | restyle + API gap, a11y rewrite | M | C |
| styles | none | restyle (focus-ring mixin) | S | C |
| switch | Switch | API gap | M | A |
| table | Table | API gap (restyle slice M first) | L | D |
| table-apron | none (modern-only) | no equivalent | n/a | D |
| tabs | Tabs, TabPanel | API gap + restyle | M | C |
| toast | Toast | structural (needs service, timer, portal) | M-L | B |
| tooltip | Tooltip | structural (portal, positioning, Esc protocol) | M | B |
| top-bar | TopBar | structural (S if only the slot shell is restyled) | L | C |

Spot-checked against source: `--focus-ring` is read by icon-button, inline-edit and status-chip and defined nowhere; badge puts `role="status"` on every instance; `--top-bar-height` is 56px; `--duration-normal`, `--elevation-2`, `--type-body-sm`, `--space-3`, `--font-family-display`, `--radius-xs`, `--border-base`, `--border-thin`, `--control-size-*`, `--menu-item-*`, `--sidebar-*` have no definition outside `foundations-modern/`.

## Cross-cutting findings

1. **Control scale.** The zip's Button, IconButton and FilterChip read a fixed chrome scale (`--control-size-sm..2xl`, 24 to 40px). It does not exist here. Our `--control-h-*` is 32/40/48 on desktop against the zip's 28/32/40, so every field and button is 4 to 8px taller. This is the deferred chunk 5 token work; it sets the size of almost everything below. The zip's 24 to 40px buttons sit under our 44px touch floor (`accessibility.md`), so chunk 5 needs the documented dense-desktop opt-out and the touch sizes (`xl`, `2xl`) for mobile.
2. **Silent token failures (fix first, no visual decision needed).** Components reference tokens that do not exist, so declarations drop: `--focus-ring` (icon-button has no visible keyboard focus), `--duration-normal`, `--elevation-2`, `--type-body-sm` (toast loses animation, shadow and font), `--space-3`, `--font-family-display`, `--radius-xs`, `--border-base`, `--border-thin`, `--data-diverge-pos/neg-*` (divergent heatmap paints nothing), legend `url(#afi-pattern-…)` fills with no pattern defs emitted.
3. **Legacy colour routes.** Badge, Drawer and StatusChip variants ride Tailwind legacy aliases (`neutral-*`, `action-*`, `system-*`), which bypass the semantic layer and do not flip in dark mode. Checkbox and Radio are inline-template Tailwind with raw motion values (breaks the 3-file rule). Charts read old `--data-*` aliases, not the 47 new `--chart-*` names; negative bars use a hex that does not switch in dark.
4. **Component-scoped tokens are needed by existing primitives, not only new ones.** Missing and consumed by v1 primitives: `--button-*` (14), `--checkbox-size-*`/`--checkbox-glyph-*`, `--menu-item-*` (6), `--control-label-*`, `--sidebar-*` (~28), `--table-*` (24). The index put these in chunk 6. See decision 1.
5. **Fields skip the ported tokens.** Input, Select, Search read `--control-background-default`, `--border-hairline`, `--radius-md` instead of the `--input-*` set, and none has `help`, `required`, `shape=pill`, `numeric`, `unit` or the zip's shared field anatomy and ARIA wiring.
6. **Overlay family is legacy.** Modal, drawer, toast, tooltip and loading-overlay have no blur scrim (`--overlay-blur`, `--overlay-blanket-drawer` exist, unconsumed), no `initialFocusRef` / `returnFocusRef`, no Escape-consumed protocol, z-index hard-coded (50 and 1000) instead of `--z-dropdown` / `--z-floating`, no portal. Modal's `closeOnEsc` is never wired. Drawer is a different component (Tailwind, no scrim, no 8px frame, no tabs, expand or pin).
7. **Radius inputs for the 12 vs 16 decision.** `--section-radius` (16px) has one consumer, `afi-section`, used almost only by frozen iteracion-N blog pages. The zip reads `--radius-section` (12px) for framed PageSection, bordered Card, MetricCard and DataSection; ours has no libs/ui consumer, and page-header hard-codes `--radius-lg` (also 12px). Evidence points to 12px.
8. **Chart is not a restyle.** The zip has one multi-mode `Chart` (~45 props: bar, line, donut, line-comparison, stacked-bar, series, tooltip, selection, milestones, soft hatch, scale, reference lines). We have five unrelated per-shape components on fixed viewBoxes with no hover readout. Parity is a new primitive. The demo-local `LiquidezEvolucionChartComponent` hand-builds the pin popover, legend and keyboard stepping the primitive lacks. This conflicts with the "allowed, not built" table in the uncommitted `data-viz-skill.md` edit.
9. **Bars and shells are different products.** Our top-bar is a generic 3-slot shell; the zip TopBar is a data-driven planner bar (breadcrumb, state menu, indicators, rename). Our shell has no bar slot, card, drawer or overlay slot. Our sidebar has hover-expand and pin modes and a 64px rail; the zip has a 72px manual rail, `flush-light` / `inset-dark` variants and an `items` list. Chunk 7 cannot be a 1:1 swap; it needs a PlannerShell composite and the sidebar variants first.
10. **A11y and behaviour contracts the zip tests encode that we fail.** Stepper (`stepper-a11y-regression`), tabs panel animation leaves a transform that traps fixed popovers, menu Escape also closes a parent drawer and loses focus return, sidebar `aria-expanded` on `nav` and `role=list` without listitems, nav-section collapsed children stay focusable, badge `role=status` (zip `pageheader-meta` test requires none), sidebar section geometry (`sidebar-section-geometry-tests`).

## Unmatched zip components (feeds chunk 6 lists)

Beyond the index's 6a to 6d lists, the audit found these zip exports that no list names:

- **Display and feedback:** Accordion, DataList, Leaving.
- **Buttons:** InsightTrigger (opens InsightCard; needs `--insight-*`).
- **Data:** ChartPanel (6a).
- **Navigation:** SidebarIcon (33-glyph Lucide registry plus `milestone-icons`; we have no icon set, and Button, Table row actions and Sidebar all depend on it), TabPanel (ships with Tabs, not separate).
- **Forms helper:** `field-help` (FieldHelp, RequiredMark, `withHelp()`), already listed as FieldHelp in 6b but shared by Input/Select/Search in chunk 5.
- **Layout:** AppShell (PlannerShell is in 6d).

Already in the index and confirmed: SplitButton, FloatingActionButton, MultiSelect, DatePicker, ControlBar, ExpandableCheckRow, PercentageSplit, FormGrid, FieldReveal, ValueField, EmptyState, InlineNotice, InsightCard, Meter, MetricCard, PageActions, ProgressOverlay, StatusPill, TourSpotlight, ValuePill, VerdictBlock, FigureStrip, RankedBars, ReturnRuler, Sparkline, SummaryPanel, DataSection, Pagination, NotesPopover.

Sequencing dependencies the audit surfaced: **SidebarIcon before Button's icon story and Sidebar; FieldHelp and MultiSelect before Select and FilterChip finish** (Select's `trigger` slot needs FilterChip trigger mode; FilterChip dropdown mode wants a MultiSelect). So chunk 5 cannot fully finish select/filter-chip without pulling those two from 6b forward.

## Proposed chunk 5 split

Order matters; each sub-chunk is one session with a plan gate. Run the Unicaja segmented-control check at the end of 5b.

| Sub-chunk | Scope | Why here |
|---|---|---|
| 5a Foundations | Control scale tokens (`--control-h-*`, `--control-size-*`, `--icon-button-size-*`), the radius decision, define or remove every silent-fail token (finding 2), `focus-ring` mixin, `--button-*`, `--checkbox-*`, `--menu-item-*` if decision 1 is yes, SidebarIcon set | Nothing below is correct until the scale and dead tokens are settled. Small visible change except the control sizes. |
| 5b Controls | button, icon-button, input, select, search, checkbox, radio-group, switch, segmented-control, filter-chip, FieldHelp, MultiSelect trigger pieces | One family, shared field anatomy. Unicaja check closes it. |
| 5c Display | badge, status-chip, avatar, card, page-header (+ split level=section, `afi-section` deprecation) | Shared tone and surface decisions. |
| 5d Overlays | modal, drawer, toast, tooltip, menu, loading-overlay | Shared protocol (scrim, focus refs, Esc, z-ladder, portal). Drawer is a rewrite. |
| 5e Navigation | nav-item, nav-section, sidebar, tabs, stepper, top-bar slot shell, shell variants | Needs `--sidebar-*` and the sidebar decisions. Ends with the PlannerShell composite spec for chunk 7. |
| 5f Table | restyle slice, then selection, tree column, reference row and footer, planning appearance as separate briefs | Largest single API gap; needs `--table-*`. |
| Chart | Decide strategy first (new `afi-chart` per the zip model vs retire bar/line); not a chunk 5 restyle | Re-home to a chunk 6a-sized brief. Token repoint (`--data-*` to `--chart-*`, divergent tokens, legend pattern defs) can ride 5a. |

## Decisions (Richard, 2026-10-15)

- **Decided 1:** button, checkbox, menu, sidebar and table component-scoped tokens move from chunk 6 into chunk 5, created alongside their primitive (5a to 5f). Insight, tour, statuspill and meter tokens stay with chunk 6.
- **Decided 3:** keep `--radius-section` (12px) and retire `--section-radius` (16px). The retire step lands with the `afi-section` deprecation in 5c; page-header switches from `--radius-lg` to `--radius-section`.
- **Decided 2 (2026-10-15):** chart strategy follows the zip's `Chart` (multi-mode, ~45 props, plus ChartPanel, DataSection, Sparkline etc.), built as a new `afi-chart` in its own brief. The existing per-shape charts stay until it ships.
- **Decided 4 (2026-10-15):** sidebar hover-expand and pin are not touched now. The primitive has `mode: static | collapsible | hover-expand`, but the Wealth Planner sidebar (`planner-sidebar.component.html`) uses `mode="static"`, so the planner never exercises them. Decision waits until the sidebar is built in 5e, using the sidebar flows in the second zip Richard is attaching.
- **Decided 10 (2026-10-15):** the 44px floor is a touch *area*, not the visible size. Buttons keep the zip's 24 to 40px range on desktop; chunk 5a adds an invisible hit area to 44px (padding or pseudo-element) on the small sizes. A general responsive rule steps controls up on mobile (the zip's `--control-h-*` already goes 40/44/48 there). The product is desktop-first, so this is a safety rule, not a design driver. The rule gets written into `accessibility.md` and `component-skill.md` in 5a.

## Open decisions (Richard)

Decisions 1 and 3 below are resolved above; the rest are still open.

1. **Component-scoped tokens for existing primitives.** Move button, checkbox, menu, sidebar and table tokens from chunk 6 into chunk 5, created alongside their primitive? Recommended: yes.
2. **Chart strategy.** New multi-mode `afi-chart` (own brief, 6a) vs retiring bar and line. Also settles the `data-viz-skill.md` "allowed, not built" row. Recommended: new primitive, keep existing charts until it ships.
3. **Radius.** Keep `--radius-section` (12px), retire `--section-radius` (16px) once `afi-section` is deprecated. Recommended.
4. **Sidebar hover-expand and pin.** The zip has neither. Keep as AFI extension or drop?
5. **Stepper done colour.** Zip uses brand-primary; AFI action is brand-secondary. Recommended: keep ours.
6. **nav-section tree lines.** Delete the machinery or keep behind a flag? Zip has none.
7. **Tabs and stepper APIs.** Add the zip's value-based and 0-based APIs alongside the index ones (tabs has many template consumers), migrate later. Recommended.
8. **Card variants.** Zip `default` is `--surface-default`; ours `default` is `--surface-subtle`, our `quiet` is the zip's `default`. Renaming breaks about 30 files. Alias or migrate?
9. **Drawer row-nav.** Our AFI-only row navigation (`1 de 5`): keep as an extension of the rewritten Drawer?
10. **Touch floor.** Accept the zip's 24 to 40px buttons on desktop with the documented opt-out (`aria-label` plus dense-context reason), using `xl`/`2xl` on touch?
11. **Zip question (not ours).** `Table.d.ts` says row densities 36/52/64px; the zip's own CSS uses 32/44/56. Chunk 5f follows the CSS unless the zip authors say otherwise.

## Method notes and limits

- Four read-only agents audited by family; I spot-checked the claims listed above plus per-family counts. Items marked "check" inside the appendices (table sort glyph, `aria-sort="none"`, action target size) were not verified.
- No zip test page was run; acceptance criteria are read from their source.
- The `liquidez-evolucion-chart.component.ts` edit in the working tree was already modified before this chunk; it was read for context only.
- Zip extraction lives in the session scratchpad, outside the repo.
