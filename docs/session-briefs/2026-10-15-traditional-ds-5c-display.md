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

## 5c-2 plan (approved 2026-10-15)

Scope: `afi-page-header` only (54 consumer files; `level="section"` in 5 of them). Every API step ends with `npm run build` (templates), and the page-header is grepped again per step for multi-line attributes.

1. **Restyle, behaviour-neutral:** `--radius-lg` to `--radius-section` (both 12 px, so pixel-identical; `page-structure-skill.md` §3 wrongly says `--section-radius`, which is 16), count chip on `--brand-secondary-neutral-*` instead of azul primitives, `role="banner"` and the generic aria-label only at level page, subsection h3 on `--type-section-title`.
2. **Level=page API:** `icon` (`afi-icon` name, 32 px medallion), `[slot=meta]` (compact line under the h1 in a heading column, never between title and actions, never in the subtitle), `titleAccessory` as an alias of the `extraInfo` slot, ranked `[slot=backAction]` / `[slot=secondaryActions]` / `[slot=actions]` / `[slot=primaryAction]` (layout only: Angular cannot recolour projected buttons, so consumers keep choosing variants), `compactActionPlacement="after-title|after-description"`, `description` as an alias of `subtitle` (max width, `text-wrap: pretty`).
3. **Section levels:** `appearance="framed|plain"` (framed is today's outline box; plain is today's `borderless`, which stays as a deprecated alias), `actionsPlacement="inline|end"`.
4. **Docs:** `page-structure-skill.md` §3 and §5, and the `/componentes/page-header` page with the real component.
5. **Close:** guardian, dark and 375 px sweeps, findings, push.
6. **Title look, held until Richard has seen the screenshots:** h1 from `--type-subtitle` (500, 20/28 growing to 24/32) to `--type-title` (400, 24/32) as the zip has it. Committed last and not pushed until the before/after pairs for three pages (Sociedades, Patrimonio, a wealth-planner page) are approved.

Decisions: `role="banner"` stays at level page only. Not adopted: the zip's space-after tokens (page rhythm is locked at 12 px by §6 and §12) and "the rail owns the side inset" (§4b parity rule keeps header and body on the same padding). `PageActions`, a standalone PageSection and the collapsible header's real-button rewrite are out of scope.

Done when: `framed` is visually identical to today's section, `plain` to `borderless`, no-meta headers keep their geometry, build and clean-code check green after each commit, guardian review clean, dark and 375 px swept.

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

**5c-2 (page header) done 2026-10-15 except the title look.** `clean-code-check.sh` and `npm run build` green after each commit.

- **Restyle (behaviour-neutral).** Section radius is `--radius-section` (12 px, identical to the old `--radius-lg`). Count chip on `--brand-secondary-neutral-*` (a slightly different tint than the old azul primitives), subsection h3 on `--type-section-title`, `role="banner"` and the generic `aria-label` only at level page. Measured on Patrimonio, Gastos and Familia: one banner and one h1 per page, section headers carry no role, radius 12, no console errors.
- **Level page API.** `icon` (32 px medallion), `[slot=meta]` (heading column; verified: aligned with the title text, 8 px under it, never inside the h1, actions never between them), `titleAccessory` as an alias of `extraInfo`, ranked `backAction`, `secondaryActions`, `actions`, `primaryAction` (layout only; consumers keep choosing button variants), `compactActionPlacement` (`after-description` verified at a narrow container), `description` as an alias of `subtitle` with an 84ch cap. No consumer used `primaryAction` together with `actions`, so the ordering change affects none; the `maxInlineActions` warning now counts all four slots.
- **Section levels.** `appearance="framed|plain"` (plain = what `borderless` did, which stays as a deprecated alias) and `actionsPlacement="end"` (one row, title ellipsizes). Verified on the doc page.
- **Guardian fixes.** `after-description` is not applied to a collapsible header (its chevron and count would drop onto their own rows); a collapsible header's button is named by `ariaLabel`, defaulting to the title; the undefined `--type-body-xs-500` fallback is gone; the medallion uses the paired foreground token; `page-structure-skill.md` no longer teaches `borderless` or cites a stale line number. The skill now documents the role slots, the meta rule and the radius (§3, §5.1, changelog v1.4). It also corrects §3, which called the 12 px radius `--section-radius` (a 16 px token the code never used).
- **Not adopted, on purpose.** The zip's space-after tokens (the 12 px page rhythm is locked, §6/§12) and its "rail owns the inset" model (§4b).
- **Known and deferred.** The sibling selector `:host(.page-header--borderless) + :host(...)` in the scss is an invalid pattern that predates 5c-2. The collapsible header is still a `div role="button"` that contains action buttons (a real button/Accordion rewrite is an appendix B finding, out of scope). With `after-description` the visual order (title, description, actions) differs from the DOM order (title, actions, description): harmless today since the description is not focusable.
- **Title look held.** The h1 change from `--type-subtitle` (500, 20/28 growing to 24/32) to `--type-title` (400, 24/32) is a separate commit that is not pushed. Measured on Sociedades at desktop width: only the weight changes (500 to 400, same 24/32). Below the `lg` breakpoint the size also grows from 20/28 to 24/32.

