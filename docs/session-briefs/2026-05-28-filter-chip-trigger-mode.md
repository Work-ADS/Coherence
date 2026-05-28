# Session brief — Extend `<afi-filter-chip>` to support dropdown-trigger mode

**Status:** Open · **Author:** Richard · **Date:** 2026-05-28
**Spun off from:** `table-design` branch (post-WP migration)

## Why this exists

Patrimonial's filter strip uses three "filter chips" that are functionally **dropdown triggers** — not the binary toggles the current `<afi-filter-chip>` primitive models. Each one:

- **Idle**: shows just the filter name ("Entidad"). Click opens a dropdown panel with multi-select checkboxes.
- **Active** (has selections): shows the filter name + a separator + a count label ("Entidad · 2"). An **X on the left edge** clears all selections (without closing the dropdown). The rest of the chip still opens the dropdown.
- **Chevron** on the right indicates "click for more options."

`<afi-filter-chip>`'s current API:

```ts
readonly selected = input<boolean>(false);
readonly selectedChange = output<boolean>();  // click → toggle boolean
readonly dismissable = input<boolean>(false);
readonly dismissed = output<void>();           // X on the right
```

It's a **toggle**, with the X on the right. The patrimonial pattern is a **trigger** with the X on the left. The two patterns share visual chrome (pill, count badge, active tint) but have different click semantics + X position.

The 2026-05-28 patrimonial migration sweep stopped here rather than:

1. Force-fitting (wrap `<afi-filter-chip>` with bespoke logic that ignores its `selected` semantics + overrides X position via CSS), or
2. Extending the primitive properly.

This brief specs option (2) so a follow-up session can land it.

## Scope

**Primitive changes** (in `libs/ui/src/filter-chip/`):

1. **Add `mode: 'toggle' | 'trigger'` input** (default `'toggle'`). In trigger mode:
   - `selectedChange` does NOT fire on click; instead, a new `triggered: output<void>` fires.
   - The X (when shown) moves to the **leading edge** (left of label).
   - A chevron icon renders at the **trailing edge**.
   - `selected` reflects "does this filter have active selections?" — consumer manages externally.
2. **Add `clearable: boolean` input** (default `false`). Mirrors `dismissable` but explicitly for trigger mode: when true + `selected=true`, renders a leading X button whose click emits `cleared: output<void>` and stops propagation (does NOT also fire `triggered`).
3. **Slot for the count/label suffix**: `<ng-content select="[slot=value]">`. When present, replaces the count badge with consumer-provided content (allows "Entidad · 2" vs "Min. 100k €" vs date range labels — heterogeneous formats).

**Patrimonial migration** (in `apps/site/src/app/pages/demos/patrimonial/`):

- Replace each bespoke filter chip (Entidad, Min, Max — see `patrimonial-proposal.page.html` lines 251–660 approx) with `<afi-filter-chip mode="trigger" [selected]="..." clearable [count]="..." (triggered)="openMenu()" (cleared)="clearFilter()">`.
- Use `<afi-dropdown-panel>` (already a primitive) for the dropdown contents.
- Delete the bespoke chip pill markup + state-based class toggles.

## Out of scope

- The dropdown PANEL contents (checkboxes, range sliders, date pickers). Those compose with existing primitives (`<afi-checkbox>`, `<afi-input>`, etc.).
- The search input + autocomplete (separate piece — could migrate to `<afi-input>` + a popover but doesn't belong to filter-chip scope).
- Truly bespoke chips like the "Activos · 25 sel." pill on bulk-selection (that's a status indicator, not a filter).

## Acceptance criteria

- [ ] `<afi-filter-chip mode="trigger" selected>` renders without firing `selectedChange` on click; fires `triggered` instead.
- [ ] `<afi-filter-chip mode="trigger" clearable selected>` shows a leading X button; click emits `cleared` and stops propagation.
- [ ] `<afi-filter-chip mode="trigger">` shows a trailing chevron icon.
- [ ] `slot=value` content replaces the default count badge.
- [ ] Default mode (`'toggle'`) preserves all current behavior — no breaking changes for existing consumers.
- [ ] `/demos/wealth-planner-2026/patrimonial` filter strip visually + behaviorally identical to today.
- [ ] No bespoke chip pill markup remains in patrimonial.
- [ ] `bash scripts/clean-code-check.sh` green.
- [ ] `/componentes/filter-chip` docs page demos both modes.

## References

- Patrimonial bespoke filter strip: `apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.html` lines 251–660 (approx).
- Current `<afi-filter-chip>` API: `libs/ui/src/filter-chip/filter-chip.component.ts`.
- Companion primitive: `libs/ui/src/dropdown-panel/dropdown-panel.component.ts`.
- Component skill: `docs/rules/component-skill.md` § 3 inputs, § 6 variants.
