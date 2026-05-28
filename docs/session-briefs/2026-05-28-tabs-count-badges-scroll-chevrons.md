# Session brief — Extend `<afi-tabs>` for count badges + scroll chevrons

**Status:** Open · **Author:** Richard · **Date:** 2026-05-28
**Spun off from:** `table-design` branch (post-WP migration)

## Why this exists

Patrimonial (`/demos/wealth-planner-2026/patrimonial`) still ships a **bespoke tab strip** — ~80 lines of Tailwind `<button>` + a hand-rolled sliding indicator + scroll-edge chevrons that fade-in/fade-out when the strip overflows horizontally. The "use our components" sweep on 2026-05-28 stopped short of migrating this because `<afi-tabs>` is missing two real features:

1. **Per-tab count badges** — e.g. "Liquidez · 5", "Inversiones · 12". Each tab shows the row count of its section.
2. **Scroll-edge chevrons** — when the tab strip is wider than its container, left/right chevron buttons appear over a gradient fade and scroll the strip ±1 tab's width on click.

The bespoke strip also uses **key-based active state** (`activeTab() === 'liquidez'`) instead of `<afi-tabs>`'s **index-based** model (`activeIndex === 0`). Patrimonial's sections are keyed objects, not an ordered array; refactoring to indices would couple section data to display order in a brittle way.

Both gaps blocked a clean migration. This brief specs the primitive extensions so a follow-up session can land them cleanly + finish the patrimonial migration.

## Scope

**Primitive changes** (in `libs/ui/src/tabs/`):

1. **Add `count?: number | null` input to `<afi-tab-item>`.** When non-null, render a small pill badge to the right of the label. Token: same neutral pill style as the current `<afi-badge>` (`--surface-muted` bg, `--foreground-tertiary-default` text). Active-tab badge gets `--action-700` text + light tint. Badge respects `size` (sm/md/lg).
2. **Optional key-based mode** via new input `activeKey?: string | null` + `activeKeyChange` output. When provided, the tabs ignore `activeIndex` and match `<afi-tab-item key="...">` by string. Add `key?: string` input to `<afi-tab-item>`. Both index and key modes coexist; consumers pick one.
3. **Auto scroll-chevrons.** New input `overflowChevrons: boolean` (default `true`). When the tab strip's scroll-width exceeds its client-width, left/right chevron buttons fade in over a `linear-gradient` mask. Click ↔ scroll ±tab-width. Hide chevrons when at start/end edges. Uses `ResizeObserver` + `scroll` event for fade triggers.

**Patrimonial migration** (in `apps/site/src/app/pages/demos/patrimonial/`):

- Replace bespoke tab strip (`patrimonial-proposal.page.html` ~lines 65–144) with `<afi-tabs activeKey="..." overflowChevrons>` + `<afi-tab-item key="..." [count]="...">`.
- Delete the bespoke `onTabsScroll`, `scrollTabs`, `canScrollLeft`, `canScrollRight`, `indicatorStyle`, `tabRefs`, `tabsScroll` ViewChild from `patrimonial-proposal.page.ts`.
- Keep the existing tab data model (`tabs()` computed returning `{ key, label, count }[]`).

## Out of scope

- Vertical tabs orientation (separate brief if needed).
- Drag-to-reorder tabs (not in patrimonial's use case).
- Closeable tabs (`×` on each — Browser-style).

## Acceptance criteria

- [ ] `<afi-tab-item count="5">` renders a neutral pill badge `5` next to the label; updates reactively.
- [ ] `<afi-tabs activeKey="liquidez" (activeKeyChange)="setActiveTab($event)">` works as a drop-in for index-based mode.
- [ ] Tab strip wider than its container auto-renders left/right scroll chevrons over a fade mask; click scrolls ±1 tab; chevrons hide at edges.
- [ ] Reduced-motion: chevron fade collapses to instant; scroll uses `behavior: 'auto'`.
- [ ] `/demos/wealth-planner-2026/patrimonial` tabs visually + behaviorally identical to today, but powered by `<afi-tabs>`.
- [ ] No bespoke tab markup or scroll handlers remain in patrimonial.
- [ ] `bash scripts/clean-code-check.sh` green.
- [ ] All variants (with/without badge, with/without chevrons) shown on `/componentes/tabs` docs page demo.

## References

- Patrimonial bespoke implementation: `apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.html` lines 65–144.
- Current `<afi-tabs>` API: `libs/ui/src/tabs/tabs.component.ts` (index-based).
- Component skill: `docs/rules/component-skill.md` (sections § 3 inputs, § 6 variants).
