# Motion skill — catalog of named motion patterns + token reference

> Companion to [component-skill.md §11](./component-skill.md).
> §11 has the RULES (tiers, choreography, durations by component weight).
> This file is the CATALOG — named, reusable patterns + the tokens that back them.
> When you build motion, check here first. If your need matches a pattern, use the catalog version. If it does not, follow Stage 3 in [component-design-skill.md](./component-design-skill.md) — and if the new motion is likely to recur, add it here as part of the same PR.

---

## 1. Purpose & scope (LOCKED 2026-05-20)

This skill exists so primitives stop reinventing the same hover, the same fade, the same slide. Naming a pattern once and pointing every primitive at it does three things:

- **Cheaper brand swaps** — motion lives in tokens, not in component code.
- **Consistent reduced-motion behavior** — every pattern is responsible for its own collapsed variant.
- **A vocabulary for Builder** — instead of guessing, the build prompt cites a pattern by name.

It pairs with three other documents:

- [component-skill.md §11](./component-skill.md) — the RULES (tiers, choreography, duration-weight pairing, reduced motion)
- [component-design-skill.md §6](./component-design-skill.md) — Stage 3 of the design process (when to use animation, where to source it)
- `libs/tokens/motion.scss` — the actual token values

---

## 2. What this skill is NOT

- **Not the rules.** Tiers, choreography, duration-by-weight live in [component-skill.md §11](./component-skill.md).
- **Not the design process.** Deciding *whether* something needs motion is [component-design-skill.md §6](./component-design-skill.md).
- **Not a museum.** If a pattern lives here and no primitive uses it after six months, delete it.

---

## 3. Token reference (LOCKED 2026-05-20)

Source: [libs/tokens/motion.scss](../../libs/tokens/motion.scss).

### Durations

| Token | Value | When |
|---|---|---|
| `--duration-fast` | 150ms | Hover, press, focus state changes. Chips, buttons, micro-interactions. |
| `--duration-base` | 200ms | Standard component transitions. Toasts, popovers, tabs. |
| `--duration-slow` | 300ms | Larger surface moves. Drawers, modals opening, sidebar collapse. |

### Easings

| Token | Curve | When |
|---|---|---|
| `--easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Balanced ease-in-out — back-and-forth interactions (hover that may un-hover). |
| `--easing-enter` | `cubic-bezier(0.16, 1, 0.3, 1)` | Decelerate — elements appearing, settling in. |
| `--easing-exit` | `cubic-bezier(0.7, 0, 0.84, 0)` | Accelerate — elements leaving, dismissing. |

Choreography pairing rule: **enters use `--easing-enter`, exits use `--easing-exit`, hover/active use `--easing-standard` or `--easing-enter`.** The full discipline is in [component-skill.md §11](./component-skill.md).

### Tailwind mapping

`tailwind.config.js` (lines 209–220) maps these to utility classes (`duration-fast`, `ease-enter`, etc.). Use either layer — the values resolve to the same custom property.

---

## 4. Pattern catalog (LOCKED 2026-05-20)

Each pattern: **name → when to use → properties → tokens → snippet → currently used in.**

### 4.1 `hover-tint`

**When** — any interactive element that changes color on pointer hover (segmented option, icon button, dropdown item, list row).

**Properties** — `background-color`, optionally `color`. **Never** `transform`, `scale`, or `box-shadow` — those belong to other patterns.

**Tokens** — `var(--duration-fast) var(--easing-enter)`.

```scss
.thing {
  transition:
    background-color var(--duration-fast) var(--easing-enter),
    color var(--duration-fast) var(--easing-enter);

  &:hover { background-color: var(--action-quiet-hover); }
}
```

**Currently used in** — [segmented-control](../../libs/ui/src/segmented-control/segmented-control.component.scss), [editable-text](../../libs/ui/src/editable-text/editable-text.component.scss), [icon-button](../../libs/ui/src/icon-button/icon-button.component.scss), [download-md-button](../../libs/ui/src/download-md-button/download-md-button.component.scss).

---

### 4.2 `opacity-fade`

**When** — non-blocking overlays, supplementary UI, tooltips, progressive-disclosure icons. The thing appears or disappears without spatial change.

**Properties** — `opacity` only. Never paired with transform unless the pattern is `slide-fade-enter` (§4.4).

**Tokens** — enter: `var(--duration-fast) var(--easing-enter)`. Exit: `var(--duration-fast) var(--easing-exit)`.

```scss
.tooltip {
  opacity: 0;
  transition: opacity var(--duration-fast) var(--easing-enter);

  &.is-open { opacity: 1; }
}
```

**Currently used in** — [tooltip](../../libs/ui/src/tooltip/tooltip.component.scss), [editable-text](../../libs/ui/src/editable-text/editable-text.component.scss) (trigger-icon reveal).

---

### 4.3 `focus-ring`

**When** — every focusable element. Universal. See [component-skill.md §10](./component-skill.md).

**Properties** — `box-shadow`. **No transition** — the ring is instant on `:focus-visible` and removed instantly on blur. Animating focus rings causes flicker and undermines a11y.

**Tokens** — `var(--border-focus)` for the color; 2px width, 2px offset.

```scss
.thing:focus-visible {
  outline: none;
  box-shadow: 0 0 0 0.125rem var(--border-focus);
}
```

**Currently used in** — every primitive (per [component-skill.md §10](./component-skill.md)).

**Pattern note** — `focus-ring` lives in the motion catalog despite being non-animated by design. It is here because it is part of the interaction-feedback vocabulary, and Builders should not reach for a transition on it.

---

### 4.4 `slide-fade-enter`

**When** — notification-style enters: toast pill, popover from a trigger, snackbar from below. Combines spatial + opacity for the appear motion.

**Properties** — `opacity` + `transform: translateY()` (or `translateX()` for edge-anchored UI).

**Tokens** — `var(--duration-base) var(--easing-enter)`.

```scss
@keyframes slide-fade-enter {
  from { opacity: 0; transform: translateY(0.75rem); }
  to   { opacity: 1; transform: translateY(0); }
}

.toast {
  animation: slide-fade-enter var(--duration-base) var(--easing-enter);
}
```

**Currently used in** — [toast.component.scss](../../libs/ui/src/toast/toast.component.scss) (with a known bug — see §6).

---

### 4.5 `panel-slide`

**When** — larger surface enters: drawer from the edge, sidebar collapse/expand, sheet from the bottom.

**Properties** — `transform: translateX()` or `translateY()` only. No opacity — the panel is opaque and the spatial move communicates the entrance.

**Tokens** — `var(--duration-slow) var(--easing-enter)` for the larger weight.

```scss
@keyframes panel-slide-in-right {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

.drawer {
  animation: panel-slide-in-right var(--duration-slow) var(--easing-enter);
}
```

**Currently used in** — [drawer.component.ts](../../libs/ui/src/drawer/drawer.component.ts) (keyframe defined but not yet applied to a shipping primitive).

---

### 4.6 `reduced-motion-collapse`

**When** — universal. Every animated pattern above must collapse cleanly when `prefers-reduced-motion: reduce` is active.

**Rule** — drop spatial motion. Keep opacity. Cap remaining transitions at 80ms.

```scss
.thing { transition: background-color var(--duration-fast) var(--easing-enter); }

@media (prefers-reduced-motion: reduce) {
  .thing { transition: none; }
  .thing.with-fade { transition: opacity 80ms linear; }
}
```

State communication must still work — opacity-only fades stay; spatial choreography collapses.

**Currently used in** — [tooltip.component.scss](../../libs/ui/src/tooltip/tooltip.component.scss), [toast.component.scss](../../libs/ui/src/toast/toast.component.scss). **Gap**: most other primitives do not yet have a reduced-motion block; this is required by [component-skill.md §11](./component-skill.md) but not yet audited.

---

## 5. How to use this catalog

1. **Designing a new primitive's motion** — open this file. If a pattern matches, copy the snippet, reference the section number in your build prompt.
2. **Designing motion that does NOT match a pattern** — follow [component-design-skill.md §6](./component-design-skill.md) Stage 3. If the new motion is likely to recur, propose a new entry in §4 of THIS file as part of the same PR. The PR description must say: *"adds motion pattern X."*
3. **Brand-swap impact** — every pattern references tokens, not raw values. A new brand inherits all motion automatically. Do not bake brand-specific timing into a pattern.
4. **Reduced-motion responsibility** — every pattern is responsible for its reduced-motion variant. The catalog snippet should include the `@media (prefers-reduced-motion: reduce)` block. If a snippet here omits it, that is a bug in the catalog, not a feature.

---

## 6. Known gaps + token violations (LOCKED 2026-05-20)

These are not blockers for the catalog — they ARE the catalog's first targets.

| Issue | File | Severity | Fix |
|---|---|---|---|
| `--duration-normal` referenced but not defined | [toast.component.scss:26](../../libs/ui/src/toast/toast.component.scss) | HIGH | Rename usage to `--duration-base`, or add `--duration-normal` as an alias in `motion.scss`. |
| Drawer uses Tailwind `transition-colors duration-fast` instead of SCSS + CSS custom properties | [drawer.component.ts:63,76,89](../../libs/ui/src/drawer/drawer.component.ts) | MEDIUM | Migrate to BEM SCSS with `transition: background-color var(--duration-fast) var(--easing-enter)`. |
| Most primitives lack a `prefers-reduced-motion` block | [libs/ui/src/**/*.component.scss](../../libs/ui/src/) | MEDIUM | Audit during next primitive review wave. |

---

## 7. Open questions / parked

- **Tier 2 (Angular animations) patterns** — none yet in the codebase. When the first Tier 2 pattern lands (likely sidebar collapse with coordinated width + opacity), document the trigger/state machine here.
- **Tier 3 (Motion One)** — reserved for DS site demonstrations. Not catalog-worthy until a real use case exists.
- **Stagger / sequential patterns** — when staggered list reveals are needed (afi-insights cards, table row entries), define a `stagger` pattern with explicit delay tokens. Not in V1.
- **Loading shimmer** — likely needed for skeleton loaders. Build the primitive first, then catalog.

---

## 8. Changelog

- **2026-05-20** — V1 LOCKED. Six named patterns (`hover-tint`, `opacity-fade`, `focus-ring`, `slide-fade-enter`, `panel-slide`, `reduced-motion-collapse`). Token reference for `--duration-*` and `--easing-*` consolidated. Three known gaps + two token violations flagged.
