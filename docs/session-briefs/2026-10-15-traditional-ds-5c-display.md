# Chunk 5c — Display

**Project:** [index](2026-10-14-traditional-ds-0-index.md) · **Parent:** [chunk 5](2026-10-15-traditional-ds-5-components-update-existing.md) · **Builds on:** [5b](2026-10-15-traditional-ds-5b-controls.md) · **Evidence:** [appendix B](2026-10-15-traditional-ds-4-audit-detail-B-display-feedback.md) · **Branch:** `traditional-ds-5c-display` (from `traditional-ds-5b-controls`; neither is merged) · **Source:** `~/Downloads/Afi_Wealth_Planner_clean.zip`, extracted outside the repo.

## Goal

Bring badge, status-chip, avatar, card and page-header to the zip's look and API, deprecate `afi-section`, and settle `--section-radius`. Restyle (SCSS and token swaps) ships before API growth in each primitive.

## Split (approved 2026-10-15)

- **5c-1 (this session):** badge, status-chip, avatar (+ group), card, and the `afi-section` deprecation note.
- **5c-2 (own plan-mode gate):** page-header level=page (`icon`, `meta`, `titleAccessory`, `backAction`, `compactActionPlacement`, title look, banner role) and level=section|subsection (`appearance`, `actionsPlacement`, space-after). 46 consumer files, and the page title look changes everywhere.

## Out of scope

`*-v2`, `foundations-modern/`, white-label (frozen), the chunk 6 display components (MetricCard, InsightCard, VerdictBlock, ValuePill, StatusPill, PageSection port, PageActions), overlays (5d), navigation (5e), table (5f).

## Decisions (approved 2026-10-15)

1. **Card variants:** keep our three names, add the zip names as aliases (`subtle` = ours `default`, `raised` = ours `elevated`, `bordered` new) and document the mapping. The swap of `default`/`quiet` waits for the last consumer. Eight files use Card.
2. **Badge:** add `tone` (with `brand`), keep `intent` as a deprecated alias for one release (22 consumer files).
3. **`--section-radius`:** deprecate, keep its value until the last `afi-section` consumer is gone (six files, nearly all versioned `blog/iteracion-N` snapshots that must not change). `page-header` moves to `--radius-section` in 5c-2.
4. **Page title look** (zip h1 weight 400, 24/32) is for 5c-2, gated on before/after screenshots.

## Plan for 5c-1

1. **Badge.** New scss on semantic tokens (soft, solid, outline; `--type-body-sm-600`; `--radius-pill`; warning text `--feedback-warning-text`); sizes 16/20; `tone`, `variant`, leading `indicator` dot (the bare `dot` stays), icon as an `afi-icon` name; no `role="status"` (a bare dot keeps `ariaLabel` as `role="img"`).
2. **StatusChip.** 22 px, 6 px dot, 600 weight, `flex: none`, focus ring through the 5a mixin, hover by opacity, `label` override; no `role="status"`, no `aria-haspopup`.
3. **Avatar + `afi-avatar-group`.** `square`, `neutral`, action-tinted default fill at weight 600, two-letter initials; group with `size`, `max` (4), "+N" chip, overlap and canvas ring.
4. **Card.** `bordered`, `elevation="default|on-brand"`, `tight`, optional `eyebrow`/`title`/`actions` header inputs, `--radius-card`, hover lift with `--elevation-card-hover`, ring focus, `--surface-context` redeclared.
5. **`afi-section`.** Deprecation comment and doc-page note only; no change to the six consumers.
6. **Close.** Doc pages show the real components; dark and 375 px sweep; `ds-token-guardian`; findings here and in the chunk 5 brief; push to both remotes.

## Acceptance (from appendix B)

- **Badge:** no live region; warning text 4.5:1 in light and dark; sizes 16/20; outline is an inset hairline.
- **StatusChip:** never shrinks or clips; keyboard focus ring visible.
- **Avatar:** group overflow chip; initials 600.
- **Card:** interactive hover lifts and focus draws a ring; Enter and Space activate.
- `clean-code-check.sh` and `npm run build` green after every commit; modern `-v2` untouched; guardian clean.

## Findings from the session

_(filled as the work lands)_
