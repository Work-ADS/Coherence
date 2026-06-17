---
title: Visual Polish Pass
date: 2026-06-17
branch: feat/visual-consistency-pass
status: in-progress
---

# Visual Polish Pass — 2026-06-17

Source of truth for **Sprint 1 — Visual Consistency Pass**. Track findings, decisions, and progress here. Update checkboxes as work lands; log dated notes at the bottom.

## Goal

Make the product feel visually intentional and consistent before investing in larger design-system and graph work.

**Success criteria**
- Navigation feels aligned and polished
- Layout widths are consistent
- Forms behave consistently
- Visual polish issues are cleaned up
- No new functionality is introduced

---

## Checkpoint 1 — Navigation

### Side menu alignment
- [ ] Review spacing and alignment throughout side menu
- [ ] Ensure icons, labels, and states are visually aligned
- [ ] Fix any inconsistent padding or spacing

**Findings**
- Nav items inside a category (`afi-nav-section` children) are not left-aligned with their parent — they sit at an in-between inset that lines up with neither the section's icon nor its label.
  - Current math: section label text sits at ~48px from the section's left edge; child label text sits at ~36px. The 12px gap is the "weird" alignment.
  - Primitives involved: `libs/ui/src/sidebar/`, `libs/ui/src/nav-section/`, `libs/ui/src/nav-item/`

**Decisions**
- Children align to the **section label text** anchor. Most common sidebar pattern; child labels read as belonging to the section's word.
- Chevron moves to the **right** end of the section trigger row. Icon becomes the leftmost mark; children indent ~28px (lighter) instead of ~48px.

### Side menu tooltips
- [ ] Review tooltip positioning
- [ ] Verify hover behavior
- [ ] Verify tooltip content and readability

**Findings**
- Tooltip is positioned at `left: 100%; top: 50%` (right of the row). Works clean in collapsed sidebar; in expanded state it may extend past the sidebar bounds — verify no clipping when implementing.

**Decisions**
- Tooltip continues to show **always on hover** (label hint even when sidebar is expanded). Behavior intentional — keep current trigger.

**Acceptance**
- Side menu feels visually consistent
- Tooltips appear correctly in all menu states

---

## Checkpoint 2 — Layout Consistency

### Page width
- [ ] Main page content width should align with navbar width

**Findings**
- "Navbar" here = the simulator/demo top bar (back chevron + client name + simulation name + settings button on the right).
- At wider viewports the content area is narrower than the navbar; at ~1280px the content's left edge drifts to the LEFT of the back button. Mismatch is visible at all widths.

**Decisions**
- Content left edge aligns to the **visible chevron's left edge** of the back button (not the button bounding box). Same optical / leading-flush rule as `afi-tabs`.
- Content right edge aligns to the **visible settings button's right edge**.
- Holds responsively — drop any max-width that lets content drift away from the navbar anchors. Navbar and content use the SAME outer inset, derived from the icon shapes.

### Banner alignment
- [ ] Banner aligns correctly with page header
- [ ] Consistent spacing between banner and surrounding elements

**Findings**
- "Banner" = `apps/site/src/app/pages/demos/wealth-planner-2026/shared/diagnostico-banner.component.*` (Objetivos diagnóstico bar).
- Today: the first letter of the banner's leading copy ("O…") does NOT optically align with the back chevron above it. The right edge happens to align with the settings button — accidental, but acceptable.

**Decisions**
- Banner shares the **same grid as page content** (chevron-left ↔ settings-right). Banner's first character must sit at the chevron's X, not the banner container's left padding.
- If the banner has internal padding, treat the inner content's first glyph as the anchor — same optical rule as the navbar and tabs.

**Acceptance**
- Layout grid feels consistent across screens
- No visible width mismatches

---

## Checkpoint 3 — Form Cleanup

### Settings updates
File: `apps/site/src/app/pages/demos/shared/settings-dropdown.{ts,html}`

**Remove**
- [ ] Redondeo — full delete (section + `rounding` signal + field on `SimulationSettings` + handler)

**Update**
- [ ] Perfil de Riesgo: swap `afi-segmented-control` → `afi-select`. Keep same 3 options (Conservador / Moderado / Agresivo).

**Convert**
- [ ] Inflación Esperada: swap raw `<input type="number">` → `afi-stepper`. Keep `min=0`, `max=20`, `step=0.1`, default `2.1`, `%` suffix.
- [ ] Esperanza de Vida: swap raw `<input type="number">` → `afi-stepper`. Keep `min=50`, `max=120`, `step=1`, default `88`, `años` suffix.

**Decisions**
- Pure primitive swaps. No changes to limits, steps, or defaults. Just chrome.

### Radio button alignment
- [ ] Review all radio button implementations
- [ ] Ensure circle aligns correctly with label text
- [ ] Verify alignment across sizes and states

**Findings**
- `libs/ui/src/radio-group/radio-group.component.ts`: outer label uses `items-start` + a hardcoded `pt-[var(--dimension-2-5)]` on the label-text wrapper to fake center. Brittle — breaks at non-default sizes or when label-text token changes.

**Decisions**
- Drop the `pt-[var(--dimension-2-5)]` hack.
- Circle vertically centers with the **label line only** (not the hint). Hint hangs below at the same left edge. Matches GitHub/Stripe/Linear.
- Implementation hint: `grid` with `grid-template-rows: auto auto` + `align-items: center` on the first row, OR a flex-row that centers on the first line.

**Acceptance**
- Inputs follow consistent interaction patterns
- Settings page feels cleaner
- Radio controls are visually aligned

---

## Checkpoint 4 — Visual Polish

### Card eyebrow design
- [ ] Review hierarchy and styling

**Findings**
- Two competing styles in the codebase: section primitive (`--type-section-eyebrow`, 400 / 0.04em) and bespoke uses in `patrimonio-add-dialog` + `diagnostico-banner` (`--type-body-sm-600`, 0.08em). All serif, all uppercase, all secondary fg color — only weight + tracking differ.

**Decisions**
- Canonical eyebrow = **dialog style: serif 12px, weight 600, uppercase, letter-spacing 0.08em, foreground-secondary**.
- Execution path: update `--type-section-eyebrow` token to `600 12px/16px serif` and `letter-spacing` rule on `.afi-section__eyebrow` to `0.08em`. Section primitive becomes the canonical surface; bespoke uses migrate to the token / class.

### Eyebrow audit
Review every eyebrow implementation and standardize to the canonical above:
- [ ] Patrimonio cards (currently no explicit eyebrow — likely missing or inheriting section)
- [ ] Sidebar (currently no eyebrow seen — add if needed for category labels)
- [ ] Dialogs (`patrimonio-add-dialog` already matches canonical — migrate to token)
- [ ] `diagnostico-banner` (matches canonical — migrate to token)
- [ ] Any additional eyebrow usage found during audit

### Línea media
- [ ] Review color and visibility

**Findings**
- "Línea media" = the past ↔ projection vertical divider on the wealth-planner evolución charts. Drawn per-page (not in `libs/ui/src/chart` primitives).
- Audit result: **the divider does not exist in code yet** — no `stroke-dasharray`, no past/projection markers in shared chart components, optimizacion-liquidez, or optimizacion-asset. Nothing named "línea media" or "media" appears anywhere in the wealth-planner sources.

**Decisions**
- Treatment when built: **dashed, 1px, `--foreground-secondary-default`**.
- Status: **deferred** — needs `referenceLine` input on `afi-chart-line` primitive (and consumer wiring) before there's anything to polish. Outside the visual-consistency-pass scope; flag for follow-up.

### Rentabilidad objetivo
- [ ] Apply final visual adjustments

**Findings**
- File: `apps/site/src/app/pages/demos/wealth-planner-2026/shared/rentabilidad-objetivo-chart.component.scss`.
- Current `.rentabilidad-chart__column-label` = `--type-body-sm-400`, secondary fg, centered. Feels under-styled vs the chart's deliberate gradient bar.

**Decisions**
- Promote column labels to the **canonical eyebrow** (serif 12px / weight 600 / uppercase / letter-spacing 0.08em / foreground-secondary). Ties the chart into the standardized visual system from CP4 above.
- Pointer line, value/label typography, and band colors all stay as-is.

**Acceptance**
- Components feel consistent with design language
- Eyebrows follow a single visual pattern
- No obvious visual outliers remain

---

## Deliverables
- Updated navigation
- Updated settings experience
- Improved layout consistency
- Standardized eyebrow treatment
- Improved visual consistency across cards, dialogs, and sidebar
- Visual polish improvements

## Explicitly out of scope
- Responsive design
- Graph library changes
- Graph redesign
- Table redesign
- Backend work
- User flow redesign
- Component architecture changes

---

## Progress log

- **2026-06-17** — Doc created. Captured sidebar finding: nav-section children sit at an inset that aligns with neither the section icon nor the section label.
- **2026-06-17** — Planning pass complete. All 13 tasks have decisions logged; doc is ready to execute against. Status of every checkpoint subitem is "decided, pending execution."
- **2026-06-17** — Execution pass. 12 of 13 tasks shipped; Task 12 (línea media) deferred because the feature doesn't exist in code yet.
- **2026-06-17** — Radio follow-up. First pass left the circle wrapper width unset (only `h-5`), so the ring bled 10px LEFT of the grid column and the gap was 8px not 4px. Wrapper now sized `h-5 w-5` / `h-4 w-4`, ring is no longer absolutely positioned, and the column gap is `--space-1` (4px). Verified: ring left edge x=327.5 = fieldset x = section title x.
- **2026-06-17** — Planner sidebar follow-up. The earlier audit only fixed `afi-nav-section`; the planner sidebar uses a bespoke `.ds-progress` grouping (separator titles + a plain `<ul>` of `afi-nav-item`s). Section title "S" was at x=54 but child label "F" was at x=44 — 10px misaligned. Fix: introduced a shared `--ds-progress-icon-size` var on the wrapper, switched `.ds-progress__list` indent to `calc(title-pad + icon + gap)`, and set `--nav-item-leading-pad: 0` so the nav-item's own padding-inline-start collapses. Verified: both first chars now at x=54.
- **2026-06-17** — Round 2 of follow-ups (banner/page-title/tooltips/steppers):
  - **Nav-item tooltips**: dropped the `@if (!sidebarExpanded())` gate so the DS tooltip is rendered for every nav-item state. Added a native `[attr.title]` fallback so truncated labels in the expanded planner sidebar (e.g. "Optimización de la liquidez") reveal on hover.
  - **Page-header / content alignment**: title and content (empty-state box, sections) were double-padded — `.ops__page` added `--space-lg` and `afi-page-header` added another `--space-lg`, so the title's "I" sat 24px inside the empty box. Fix: exposed `--page-header-padding-inline` on the page-header primitive and set it to `0` on `.ops__page` (CSS-var inheritance, no `::ng-deep`). Title "I" and empty box now share x=286.5 on `/demos/wealth-planner-2026/inversiones-futuras`.
  - **Banner chevron alignment**: banner first glyph was at navbar rail (24px) while the visible chevron sits 8px deeper into its icon-button. Bumped banner padding-inline to `calc(var(--space-lg) + var(--space-xs))` = 32px so the banner's "O" lands at the chevron's x.
  - **Banner wrap stack**: dropped `justify-content: space-between` and switched to `gap: var(--space-md) var(--space-lg)`. When the row wraps, "Legado estimado" now stacks under "Objetivos" at the same x. Trade-off: on very wide rows, the two columns sit packed at the left with the column gap instead of edge-to-edge spread — easy to add a media-query for spread back if you want it.
  - **Settings steppers**: replaced the `afi-input type=number` swap with the patrimonio min/max stepper pattern — minus `afi-icon-button` + centered native `<input type="number">` + plus `afi-icon-button` + the suffix (`%` or `años`) as an inline sibling. Added `stepInflation(delta)` and `stepLife(delta)` handlers with clamping. Verified: dropdown shows "− 2,1 % +" and "− 88 años +" rows.
  - **RO scale labels inside the bar**: scale labels (10/7/4/2/0 %) were colliding with the right-side "Rentabilidad mínima necesaria" pointer whenever its value drifted close to a band boundary. Moved labels INSIDE each band (top of band, centered) and widened the bar from `--space-lg` (24px) to `--dimension-12` (48px) so labels fit. Topmost band ("10 %") uses `--foreground-inverse-default` on the red surface; everywhere else the default dark text has enough contrast.

### Files changed
- `libs/tokens/typography.scss` — `--type-section-eyebrow` weight 400 → 600
- `libs/ui/src/section/section.component.scss` — eyebrow letter-spacing 0.04em → 0.08em
- `libs/ui/src/input/input.component.{ts,html}` — added `min`/`max`/`step` inputs to support numeric usage
- `libs/ui/src/nav-section/nav-section.component.ts` — chevron default 'left' → 'right'
- `libs/ui/src/nav-section/nav-section.component.scss` — trigger gap `--space-xs` → `--space-sm`; children expose `--nav-item-leading-pad: 0` so child labels align with the section label above
- `libs/ui/src/nav-item/nav-item.component.scss` — `padding-inline-start` reads the `--nav-item-leading-pad` CSS var
- `libs/ui/src/radio-group/radio-group.component.ts` — dropped the `pt-[var(--dimension-2-5)]` hack; grid layout with a line-height-matched circle wrapper so the circle centers with the label line only
- `apps/site/src/app/pages/demos/shared/settings-dropdown.component.{ts,html}` — Redondeo deleted; Perfil swapped to `afi-select`; Inflación + Esperanza swapped to `afi-input type="number"` with `min`/`max`/`step` + suffix
- `apps/site/src/app/pages/demos/shared/planner-top-bar.component.{ts,scss}` — `rounding` field dropped from defaults; `.ptb` padding-inline `--space-md` → `--space-lg` so the navbar shares the page content rail
- `apps/site/src/app/pages/demos/wealth-planner-2026/shared/diagnostico-banner.component.scss` — padding-inline `--space-xl` → `--space-lg` so banner sits on the same rail
- `apps/site/src/app/pages/demos/wealth-planner-2026/shared/rentabilidad-objetivo-chart.component.scss` — column labels adopt the canonical eyebrow

### Verification
- `npx tsc -p apps/site/tsconfig.app.json --noEmit` → exit 0
- `npm run build` → exit 0 (pre-existing Sass deprecation warnings and one pre-existing budget warning on Sarevi)
- `bash scripts/clean-code-check.sh` → exit 0; reported findings are all pre-existing violations in files we touched, no new ones introduced
- Preview verified at 1440×900 on `/demos/wealth-planner-2026/familia`: settings dropdown opens with Redondeo gone, Perfil as select, Inflación/Esperanza with suffixes; sidebar eyebrows render in the new heavier style; navbar back chevron sits ~6px from page-header title (down from ~14px+ before).
