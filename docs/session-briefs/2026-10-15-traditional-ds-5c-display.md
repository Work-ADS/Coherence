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

**5c-1 (badge, status-chip, avatar, card, afi-section note) done 2026-10-15** on `traditional-ds-5c-display`. `clean-code-check.sh` and `npm run build` green after each commit; browser-verified on each doc page; 375 px: no horizontal scroll on badge, status-chip, avatar and card.

- **Badge.** Own stylesheet on semantic tokens (the Tailwind aliases that did not flip in dark are gone). `tone` (with `brand`), `variant` soft/solid/outline, `indicator`, `icon` as an `afi-icon` name, sizes 16/20 (was 20/24: every badge got smaller), `intent` kept as a deprecated alias. No `role="status"`; only the bare `dot` is `role="img"` and now warns in dev without `ariaLabel`. Warning text contrast measured 8.83:1 light and 6.92:1 dark.
- **StatusChip.** 22 px (was 24), 6 px dot (was 4), weight 600, `flex: none`, `label` override, chevron via `afi-icon`, no `role="status"` and no `aria-haspopup`: the parents that wrap the interactive chip in a menu must supply popup semantics themselves. Tokens changed in `components.scss` (`--status-chip-height-md`, `--status-chip-dot-size`, new `--status-chip-padding-x-end`). **Not visually checked:** the nine consumer pages (page-header, planner-top-bar, top-bar/top-nav patterns, dropdown) inherit the new size; they need a pass.
- **Avatar.** `square`, `neutral`, action-tinted fill at weight 600, two-letter initials; `size` is now nullable so a group can set it. New `afi-avatar-group` through an `AVATAR_GROUP` token (children cannot be cloned in Angular): `max`, overlap, canvas ring, «+N» chip. Initial font steps use the nearest type token (sm-600 for xs and sm, md-600, lg-600 for lg and xl), not the zip's 10/12/14/18/24.
- **Card.** `bordered`, `elevation="on-brand"`, `eyebrow`/`title` header with a `[slot=actions]`, aliases `subtle` and `raised`, `--radius-card`, hover lift with `--elevation-card-hover`, focus ring through the mixin, `--surface-context` redeclared. The zip's `tight` is not added: its default body (24) is `padding="lg"` and `tight` (16) is `padding="md"`. The `default`/`quiet` swap waits for the last consumer.
- **afi-section.** `@deprecated` comment and `--section-radius` comment only; nothing else changed, the six consumers are versioned snapshots.
- **Guardian fixes.** Dark values for the card shadows (`--elevation-card-hover`, `--elevation-card-on-brand` in `components.scss`), a lighter dark `--status-draft-dot` (in `aliases.scss`, which loads after `components.scss` and so wins the cascade: the first attempt in `components.scss` lost), `role="img"` on the avatar-group chip, a dev warning for an unnamed badge dot, and a card-page note that an interactive card needs `ariaLabel` (a heading inside `role="button"` is lost to assistive tech).
- **Known and deferred.** Light-mode white-on-dot contrast of the solid status chip (success 2.81, info 3.2, error 3.92:1) was already below AA and is unchanged. `--surface-context` is only read by Card and resolves at `:root` (nested themes will not re-resolve it). `--elevation-sm` has no dark value (pre-existing).
- **5c-2 still to do:** page-header (level=page API and look, section levels) behind its own gate.
