# Chunk 5e-3 — Tabs

**Project:** [index](2026-10-14-traditional-ds-0-index.md) · **Parent:** [5e navigation](2026-10-16-traditional-ds-5e-navigation.md) · **Evidence:** [appendix C, tabs](2026-10-15-traditional-ds-4-audit-detail-C-navigation-shell.md) · **Branch:** `traditional-ds-5e-3-tabs` (cut from Azure `main`, stands alone) · **Source:** the zips' `components/navigation/Tabs.jsx` (byte-identical in both exports). This slice has its own file so it does not collide with the 5e brief, which the sidebar branches also edit.

## Goal

Bring `afi-tabs` to the zip's look and add its value-based API next to our index API, without touching the 24 files that use it. Restyle first, then API.

## Consumers (multi-line aware, 2026-10-16)

`afi-tabs` in 24 files, 21 with `afi-tab-item`, all on the index API (`activeIndex`, `activeChange`). Inputs in use: `lazy` (4), `size="sm"` (1, patrimonio pattern), `ariaLabel`, tab-item `badge` (3) and `disabled` (3). `icon` is never used. Nothing outside the primitive read `slideDirection`, `animationKey` or `currentIndex`.

## Decisions

1. Index and value APIs coexist; no migration of the 24 consumers.
2. The zip's per-child result cascade becomes one block animation on the panel (same keyframes and tokens): Angular's emulated encapsulation cannot style `> *` of projected content.
3. `badge` becomes the zip's neutral count chip (`count` is the new name; both work).
4. Not built: the zip's composed `onKeyDown` (a consumer vetoing arrow navigation); no consumer needs it.

## Findings from the session

- **5e-3 done 2026-10-16** (three commits: restyle, API, doc page and fixes).
  - **Restyle.** TABS tokens in `components.scss` (`--tab-gap`, `--tab-item-*`, `--tab-count-*`; the old `--tab-item-*` were unread). Gap between tabs 24px, trigger padding 2px with the first tab still flush (locked rule), inactive 500 in tertiary ink, hover secondary, active 600 in brand ink, disabled by ink instead of opacity, 18px neutral count chip (brand-neutral on the active tab), outward focus ring through the shared mixin, indicator 1px over the hairline, panel change on `afi-reveal-cascade` with `backwards` fill (nothing left behind; measured `transform: none`, `filter: none` after it ends), no animation on first render (the old one animated), reduced motion = 80ms fade, indicator re-measured by `ResizeObserver` on the list and every trigger, on `document.fonts.ready` and on tab changes, with the first paint un-transitioned. The four duplicated slide keyframes are gone.
  - **Height change to know about:** `--tab-height` is the responsive control height, so `md` tabs are **32px from the `lg` width up** (they were 44px at every width) and 44px below. Measured 32px on the doc page, the patrimonio pattern and the Wealth Planner demo. This is the zip's value and the 5a control scale, and it shifts every page that uses tabs by 12px at desktop.
  - **API (additive).** `value` / `valueChange` / `defaultValue` on `afi-tabs` and `value` on `afi-tab-item` (default: its position as a string; `value` wins over `activeIndex`; `null` = nothing selected, keyboard entry at the first enabled tab, indicator hidden, panels hidden). `fullWidth`. `count` on tab items. `icon` through `afi-icon` (its type is now `IconName`; nothing used it). `items` for a bar-only mode with no projected panels, `idPrefix` to give those tabs stable ids, and a new `afi-tab-panel` (`value`, `idPrefix`, `ariaLabel`) with the same enter animation for consumers that own their panels. A bound `value` is truly controlled: the selection follows the input, not the click. Enter and Space no longer re-activate the current tab. Roving tabindex, arrows wrap and select, Home and End, disabled skipped; arrows now start from the focused tab.
  - **Doc page** (`/componentes/tabs`): selection (index, value, none selected), width, count chip, and a bar-only example with `afi-tab-panel`; token tables rewritten.
  - **Measured:** tab height 32, gap 24, first tab flush, indicator left and width equal to the active trigger, active font 600/14/20; first render has no animation, a click starts `afi-reveal-cascade`, End jumps, ArrowRight wraps; bar-only tabs render with icons, counts, a disabled tab and ids `demo-bar-<value>` that the panel's `aria-labelledby` resolves; `value = null` leaves no tab selected with entry at the first; lazy panels stay empty when hidden (patrimonio pattern); Wealth Planner demo renders its two bars.
  - **Guardian fixes (same slice):** disabled tab ink equalled the rest ink in dark (`--foreground-tertiary-disabled` had no dark value): it now steps to control-600 in the dark block, which also dims disabled tertiary text elsewhere in dark. The consumer-owned `afi-tab-panel` was an unnamed tabpanel: it takes `idPrefix` or `ariaLabel`. Arrow navigation started from the selected tab, not the focused one (wrong when a consumer ignores `valueChange`). The indicator settles one frame after its first measurement and the lifecycle is guarded against server rendering. The `animationKey` comment and the `value` collision note on tab-item were corrected.
  - **Accepted, for Richard to veto:** the indicator uses `--brand-secondary-background-default` while the active text uses `--foreground-brand-default`, which differ in dark (azul-profundo-300 against azul-300); a type-level change: `afi-tab-item` `icon` went from `string` to `IconName` (no consumer passes it); the APG advice to make a panel focusable when it holds no focusable content is not applied to the existing panels either.
  - **Not verified:** a bar that starts inside a hidden panel getting its indicator when shown (the hidden Browser pane pauses `ResizeObserver`; the old code never re-measured, the new one should), the cascade frame by frame, reduced motion, a real screen reader, dark mode in the browser (contrast read from tokens by the guardian: tertiary about 7:1, chip about 5.7:1).
