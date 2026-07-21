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

### Reveal / stagger (added 2026-07-17)

Backs the `stagger-reveal` pattern (§4.7). Three intensity tiers — the tier tracks **element count**, not taste (see §4.7).

| Tier | Duration | Stagger | Rise | Blur |
|---|---|---|---|---|
| `light` | `--duration-reveal-light` 400ms | `--reveal-stagger-light` 40ms | `--reveal-rise-light` 6px | `--reveal-blur-light` 4px |
| `normal` | `--duration-reveal-normal` 500ms | `--reveal-stagger-normal` 70ms | `--reveal-rise-normal` 10px | `--reveal-blur-normal` 8px |
| `heavy` | `--duration-reveal-heavy` 600ms | `--reveal-stagger-heavy` 100ms | `--reveal-rise-heavy` 14px | `--reveal-blur-heavy` 14px |

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

### 4.7 `stagger-reveal`

**When** — **cold entries only**: first paint, app load, a hard refresh, an empty state filling for the first time. The moment the user is *arriving*, where a beat of choreography reads as considered.

**When NOT to use** — **warm transitions** inside an active session: route changes, tab switches, filter/data refreshes, any in-place re-render while the user is heads-down working. There the blur + stagger stops being polish and becomes latency you are adding on purpose. Warm transitions get `opacity-fade` (§4.2) at `--duration-fast`, or nothing. **Rule of thumb: the more often a user will see a motion, the less of it it earns** — a first load happens once; a route change happens dozens of times an hour.

**Properties** — `opacity` (0→1) + `transform: translateY()` (rise→0) + `filter: blur()` (→0), sequenced per element via a `--index` (or `--col` for grids) multiplied by the tier's stagger delay.

**Tiers** — intensity tracks **element count**, not taste. `light` for *many* small elements (table rows, grid cells, menu items); `normal` (default) for cards, metric tiles, panels; `heavy` **only** for a *few* hero elements on first paint — it drags on long lists. Grids/long lists always use `light` so the cascade never overruns. Tokens: §3 "Reveal / stagger" table.

**Tokens** — `var(--duration-reveal-<tier>) var(--easing-enter)`, `var(--reveal-stagger-<tier>)`, `var(--reveal-rise-<tier>)`, `var(--reveal-blur-<tier>)`.

```scss
@keyframes reveal-blur-fade-rise {
  from { opacity: 0; transform: translateY(var(--_rise)); filter: blur(var(--_blur)); }
  to   { opacity: 1; transform: translateY(0);            filter: blur(0); }
}

.reveal {
  // defaults = normal tier; --reveal--light / --reveal--heavy override
  --_dur: var(--duration-reveal-normal);
  --_stagger: var(--reveal-stagger-normal);
  --_rise: var(--reveal-rise-normal);
  --_blur: var(--reveal-blur-normal);

  opacity: 0; // hold hidden until the animation runs (no flash)
  animation: reveal-blur-fade-rise var(--_dur) var(--easing-enter) both;
  animation-delay: calc(var(--index, 0) * var(--_stagger));
}

.reveal--light {
  --_dur: var(--duration-reveal-light);
  --_stagger: var(--reveal-stagger-light);
  --_rise: var(--reveal-rise-light);
  --_blur: var(--reveal-blur-light);
}
.reveal--heavy {
  --_dur: var(--duration-reveal-heavy);
  --_stagger: var(--reveal-stagger-heavy);
  --_rise: var(--reveal-rise-heavy);
  --_blur: var(--reveal-blur-heavy);
}

// grids sweep by column, not source order — set --col per cell, force light
.reveal--grid {
  --_stagger: var(--reveal-stagger-light);
  animation-delay: calc(var(--col, 0) * var(--_stagger));
}

@media (prefers-reduced-motion: reduce) {
  .reveal { animation: reveal-fade-only 80ms linear both; animation-delay: 0ms; }
  @keyframes reveal-fade-only { from { opacity: 0; } to { opacity: 1; } }
}
```

**Currently used in** — none yet. Tokens + pattern landed 2026-07-17 ahead of the first consumer. Apply per-element `--index`/`--col` by hand for now; promote to a `[dsStaggerReveal]` directive (auto-sets `--index` from list index) when the first dynamic list/grid needs it.

---

### 4.8 `press-squish`

**When** — a small interactive control that should feel physically pressable: the control dips smaller while the pointer is actively pressing it, then springs back on release. Checkboxes, radios, and other compact form controls where a press deserves tactile feedback. **Not** for large surfaces (a drawer or modal does not squish) and not a substitute for `hover-tint` — this is the *press* moment specifically.

**Properties** — `transform: scale()` only. The element scales down (`0.95`, per the Animate UI checkbox recipe) while `:active` and returns to `1` on release. Optionally pair with a hover-grow companion (`scale(1.05)` on `:hover`, press rule after hover at equal specificity so `:active` wins) for the full Animate UI feel. No position change — the control never leaves its box; the spring's overshoot briefly carries scale a few percent past the resting size on the way back, which reads as the "bounce".

**Tokens** — `var(--motion-duration-base) var(--motion-easing-spring)`. `--motion-easing-spring` (`cubic-bezier(0.34, 2, 0.64, 1)`) is the overshoot curve; **it exists only in the foundations-modern (v2) layer** — there is no legacy `libs/tokens/motion.scss` equivalent, so this pattern is v2-only for now. (Tuned a touch bouncier than the legacy `afi-checkbox` 1.56 curve for a feel distinctly separate from `--motion-easing-standard`.)

```scss
.control__box {
  transition: transform var(--motion-duration-base) var(--motion-easing-spring);
}

// optional hover-grow companion — press rule sits after it at equal specificity so :active wins
.control:hover:not(.control--disabled) .control__box {
  transform: scale(1.05);
}

// drive from the row/label :active so pressing the label or the control both squish
.control:active:not(.control--disabled) .control__box {
  transform: scale(0.95);
}

@media (prefers-reduced-motion: reduce) {
  .control:active .control__box { transform: none; } // drop the spatial move entirely
}
```

**Reduced motion** — remove the transform outright. A scale with no transition would snap-jump, which is worse than staying still; state is already communicated by fill/border.

**Taste note** — the overshoot is the first bouncy easing in the v2 family (button-v2 / toggle-v2 use `--motion-easing-standard`, no overshoot). It's a deliberately playful-but-contained micro-interaction; if a surface wants the calmer house feel instead, use `--motion-easing-standard` on the same `transform` and drop the bounce.

**Currently used in** — [checkbox-v2](../../libs/ui/src/checkbox-v2/checkbox-v2.component.scss) (press-squish on the box; ported from the legacy `afi-checkbox`, where the rule existed but was never wired to a pressed state), [radio-v2](../../libs/ui/src/radio-v2/radio-v2.component.scss) (press-squish on the ring).

---

### 4.9 `control-fill-fade`

**When** — a small selection control (checkbox, radio) transitioning between its empty and filled states. The brand fill crossfades in/out slowly enough to read as a soft "bloom" rather than an instant flip — the Animate UI checkbox signature. Pairs with `press-squish` (§4.8) and, on checkbox/radio, the icon draw-in.

**Properties** — `background-color` + `border-color` only. Deliberately the *slowest* colour transition in the system; never applied to hover-only tints (those stay on `--duration-fast`, `hover-tint` §4.1) — this is the *selected-state* crossfade specifically.

**Tokens** — `var(--motion-duration-slower) var(--motion-easing-standard)`. `--motion-duration-slower` (500ms) exists only in the foundations-modern (v2) layer; it matches animate-ui's exact 500ms fill fade.

```scss
.control__box {
  transition:
    background-color var(--motion-duration-slower) var(--motion-easing-standard),
    border-color var(--motion-duration-slower) var(--motion-easing-standard);

  &--active { background: var(--brand-background-default); border-color: var(--brand-background-default); }
}
```

**Reduced motion** — drop the transition (`transition: none`); the fill still changes instantly, and colour alone communicates the state.

**Currently used in** — [checkbox-v2](../../libs/ui/src/checkbox-v2/checkbox-v2.component.scss), [radio-v2](../../libs/ui/src/radio-v2/radio-v2.component.scss).

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
- ~~**Stagger / sequential patterns** — when staggered list reveals are needed (afi-insights cards, table row entries), define a `stagger` pattern with explicit delay tokens. Not in V1.~~ **Done 2026-07-17** — see `stagger-reveal` (§4.7). Directive (`[dsStaggerReveal]`) still pending a first consumer.
- **Loading shimmer** — likely needed for skeleton loaders. Build the primitive first, then catalog.

---

## 8. Changelog

- **2026-07-21 (later still)** — toggle-v2 joined the press-feedback family with two variations: the thumb slide moved to `--motion-easing-spring` (overshoot "thunk" into the track wall), and press-down flattens the thumb height-only (`scaleY(0.8)`, width holds — Fluid Functionalism switch recipe) composed with the slide via a `--_travel` var. If a third primitive wants the height-only squish, promote it to a named §4 pattern.
- **2026-07-21 (later)** — `press-squish` retuned to the Animate UI checkbox recipe: press dips to `0.95` (was `0.9`) with an optional `1.05` hover-grow companion; checkbox-v2 also gained the delayed check draw (fill lands first, check draws one `--motion-duration-base` beat later, opacity fade riding along) and a `--motion-duration-slower` (500ms) colour fade (see §4.9 `control-fill-fade`). Source: animate-ui.com base checkbox (whileHover 1.05 / whileTap 0.95 / pathLength draw at .2s + .2s delay).
- **2026-07-21** — Added `press-squish` (§4.8): tactile press feedback — a control scales down while `:active` and springs back on release via the overshoot curve. Requires the foundations-modern `--motion-easing-spring` token (`cubic-bezier(0.34, 2, 0.64, 1)`), added to `tools/figma-sync/foundations-modern.json` → `primitive-motion.scss`. First consumer: `checkbox-v2`. First bouncy easing in the v2 family — taste note flags the alternative calm treatment.
- **2026-07-17** — Added `stagger-reveal` (§4.7): staggered "blur-and-fade" entrance with three intensity tiers (light/normal/heavy). New tokens in `motion.scss` (`--duration-reveal-*`, `--reveal-stagger-*`, `--reveal-rise-*`, `--reveal-blur-*`). Un-parked from §7. Directive still pending a first consumer.
- **2026-05-20** — V1 LOCKED. Six named patterns (`hover-tint`, `opacity-fade`, `focus-ring`, `slide-fade-enter`, `panel-slide`, `reduced-motion-collapse`). Token reference for `--duration-*` and `--easing-*` consolidated. Three known gaps + two token violations flagged.
