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

### Overshoot: why distance decides the mechanism (added 2026-07-29)

Follow-through — ending **past** the target and settling back — is what makes a move read as carrying weight instead of snapping to a stop. There are two ways to get it, and **the travel distance decides which one is even possible.**

**A CSS easing curve overshoots by a PERCENTAGE, never by a distance.** An easing is normalised over whatever distance it is given, so `--motion-easing-spring` (`cubic-bezier(0.34, 2, 0.64, 1)`, ~25% past, peaking at 50%) resolves to:

| Travel | Overshoot with `spring` |
|---|---|
| 16px (a toggle thumb) | 4px — tactile |
| 235px (a tab bar hop) | 59px — absurd |

That is why `--motion-easing-spring` is scoped to **short travel — roughly under 20px**: press feedback and small thumbs (§4.8, §4.9). It is not a general-purpose bounce.

**For long travel, use a fixed-distance overshoot keyframe instead of a curve.** Aim for an overshoot the eye registers but cannot measure — **4–10px, constant, whatever the distance** — expressed as a three-keyframe animation (start → target + reach → target) with the reach taken from `--motion-reveal-rise-light` (6px) and both segments on `--motion-easing-standard`. See §4.13 for the implementation.

The trap this replaced: reaching for a *tamer curve* (`cubic-bezier(0.34, 1.3, 0.64, 1)`, ~3%) looks like it solves the problem, and it does at one distance — 7px on a 235px hop. But it is still a percentage, so the same curve yields 2.4px across a narrow 81px tab bar (invisible) and 10.4px across a wide one. A curve cannot hold a distance constant. Do not re-add that token; **weight is a property of the moving object, not of how far it happened to travel.**

### Reveal / stagger (added 2026-07-17)

Backs the `stagger-reveal` pattern (§4.7). Three intensity tiers — the tier tracks **element count**, not taste (see §4.7).

| Tier | Duration | Stagger | Rise | Blur |
|---|---|---|---|---|
| `light` | `--duration-reveal-light` 400ms | `--reveal-stagger-light` 40ms | `--reveal-rise-light` 6px | `--reveal-blur-light` 4px |
| `normal` | `--duration-reveal-normal` 500ms | `--reveal-stagger-normal` 70ms | `--reveal-rise-normal` 10px | `--reveal-blur-normal` 8px |
| `heavy` | `--duration-reveal-heavy` 600ms | `--reveal-stagger-heavy` 100ms | `--reveal-rise-heavy` 14px | `--reveal-blur-heavy` 14px |

### Decode (added 2026-07-24)

Backs the `text-decode-scramble` pattern (§4.10). Two tokens, modern-layer only, and — unusually — **consumed by JavaScript, not SCSS** (the directive reads them once via `getComputedStyle` and drives an rAF loop). No px/ms is duplicated as a TS constant.

| Token | Value | When |
|---|---|---|
| `--motion-decode-duration` | 1150ms | Total scramble-to-resolve run length, length-independent. |
| `--motion-decode-blur` | 2.5px | Peak of the per-character blur band that travels with the resolve front. |

The envelope SHAPE (band width, peak position, easing) stays as directive code constants by design — those are curve-shape numbers, not brand values. Only the two knobs above are tokens. Both live only in the foundations-modern (v2) layer; there is no legacy `motion.scss` equivalent, so this pattern is v2-only.

### Ambient loop (added 2026-07-28)

Backs the `ambient-loop` pattern (§4.11). Two tokens, modern-layer only.

| Token | Value | When |
|---|---|---|
| `--motion-duration-ambient-loop` | 10000ms | Full cycle length of a decorative, self-restarting loop. The whole choreography lives inside one pass of this. |
| `--motion-easing-ambient` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Fast-out, long-settle curve for ambient motion. Calmer than `--motion-easing-enter`, no overshoot like `--motion-easing-spring`. |

**Why these are outside the interaction ramp.** `--duration-fast|base|slow` are *response* durations — how long the UI takes to answer the user. 10s is not a response; it is the length of a piece of ambient choreography that runs whether or not anyone touches it. Putting it on the interaction ramp would misread it, so it gets its own role name. Same precedent as `--motion-duration-slower` (500ms) and `--motion-decode-duration` (1150ms): motion values that pair with a named pattern, not with a component's weight.

Both live only in the foundations-modern (v2) layer — the current consumer's SVG carries `data-foundation="modern"`, and the legacy layer has no consumer. Added via `tools/figma-sync/foundations-modern.json` → regenerate with `node tools/figma-sync/generate-foundations.mjs`; never hand-edit `libs/tokens/foundations-modern/primitive-motion.scss`.

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

**When NOT to use** — **warm transitions** inside an active session: route changes, tab switches, filter/data refreshes, any in-place re-render while the user is heads-down working. There the blur + stagger stops being polish and becomes latency you are adding on purpose. Warm transitions get `opacity-fade` (§4.2) at `--duration-fast`, `swap-slide-blur` (§4.12) when the user clicked through an *ordered* set and direction is worth encoding, or nothing. **Rule of thumb: the more often a user will see a motion, the less of it it earns** — a first load happens once; a route change happens dozens of times an hour.

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

### 4.10 `text-decode-scramble`

**When** — a user-initiated ES/EN language switch on **headings only**. It reads as a warm-but-deliberate "decode" of the new-language text. **Never** on auto re-renders, route changes, data refreshes, or first paint — the trigger is strictly the user flipping the language (`LanguageService.switched`), and the per-language `@if` branches re-mount the heading on that flip.

**Properties** — per-character JS/rAF scramble (each character cycles random letters, then locks left-to-right) + a per-character `filter: blur()` band that travels L→R with the resolve front (0 behind the front, a raised-cosine bump just ahead, 0 far ahead). This is the **first Tier-3, JS-driven entry in the catalog** — the others are CSS/keyframe patterns; this one cannot be expressed in CSS because the scramble and the moving blur band are computed per character per frame.

**Tokens** — `--motion-decode-duration` (1150ms, run length) + `--motion-decode-blur` (2.5px, blur-band peak) — see §3 "Decode". The directive reads these token VALUES once via `getComputedStyle` at the start of the run. The envelope shape — band width, peak position, easing — lives as directive code constants by design (curve-shape numbers, not brand values).

**Reduced motion** — `prefers-reduced-motion: reduce` skips the animation entirely and renders the final text. The same fallback fires if the tokens do not resolve (host outside the modern scope): no animation, no hardcoded numeric fallback.

**Structure-preserving** — only text-node characters are wrapped in transient per-character `<span>`s; inline element nodes (e.g. `<em>`) stay in place, whitespace is never scrambled, opacity is never touched, and the spans unwrap back to plain text nodes on completion (clean final DOM).

**Currently used in** — the `[siteHyperText]` directive (`apps/site/src/app/directives/hyper-text.directive.ts`) on the blog title + section headings (`apps/site/src/app/pages/blog/ui-moderno-2026/`).

---

### 4.11 `ambient-loop`

**When** — **decorative motion nobody triggered**: an illustrative thumbnail that draws itself, a diagram that builds and resets, a marketing glyph that breathes. The motion is content, not feedback — it carries no state, nothing waits on it, and clicking nothing starts it. It is the only pattern in the catalog that runs `infinite`.

**When NOT to use** —
- **Anything the user acted on.** A press, a hover, an open, a submit: those are one-shot patterns (§4.1–§4.5, §4.8). A loop as feedback reads as "still working" forever.
- **Real progress or pending state.** A spinner or skeleton loops too, but it means *something is happening* — that is a loading affordance with its own timing, not ambient decoration. Do not borrow this 10s cadence for it.
- **Anything in the reading path.** Ambient motion beside body copy competes with it. Keep it inside its own frame — a thumbnail, a card media slot, a hero panel.
- **More than one at a time in view.** Two independent loops in the same viewport read as a glitch, not as craft. If a grid needs several, either give them one shared timeline or animate only the hovered one.

**Properties** — `opacity`, `transform`, `stroke-dashoffset`, `stroke`, `fill`. Never `width`/`height`/`top`/`left` (layout thrash on an endless loop) and never `filter: blur()` for the full cycle (a permanently compositing blur is the most expensive thing you can loop).

**Cadence** — the whole choreography fits inside ONE pass of `--motion-duration-ambient-loop`, with every stage a percentage window of that single keyframe timeline rather than its own duration. That is what keeps a multi-element build-up in sync: same duration, same easing, same start, different `%` windows. Reserve the last ~8% for the fade-out that hides the restart, so the loop has no visible seam.

**Tokens** — `var(--motion-duration-ambient-loop) var(--motion-easing-ambient)` plus `infinite both`. Reuse the reveal tokens (`--motion-reveal-rise-*`) for any spatial travel inside the keyframes rather than inventing offsets.

```scss
.thumb__stage {
  // one shared timeline; each stage differs only by its keyframe windows
  animation: var(--motion-duration-ambient-loop) var(--motion-easing-ambient) infinite both;
}

.thumb__stage--first  { animation-name: thumb-loop-first; }
.thumb__stage--second { animation-name: thumb-loop-second; }

@keyframes thumb-loop-first {
  0%, 2%    { opacity: 0; transform: translateX(calc(-1 * var(--motion-reveal-rise-light))); }
  7%, 91%   { opacity: 1; transform: translateX(0); }
  97%, 100% { opacity: 0; transform: translateX(0); } // fade covers the restart
}

@keyframes thumb-loop-second {
  0%, 14%   { opacity: 0; transform: translateX(calc(-1 * var(--motion-reveal-rise-light))); }
  22%, 91%  { opacity: 1; transform: translateX(0); }
  96%, 100% { opacity: 0; transform: translateX(0); }
}

@media (prefers-reduced-motion: reduce) {
  .thumb__stage { animation: none; } // resting state must be the FINISHED artwork
}
```

**Reduced motion** — `animation: none` on every looping selector, no fade-in substitute. Unlike the one-shot patterns, there is no state to communicate, so the collapsed variant is simply the artwork at rest. This only works if the un-animated DOM is already the complete, legible end state — build the markup that way (full diagram, `both` fill for the animated case) instead of hiding elements and revealing them by keyframe. An `opacity: 0` default plus a killed animation is an invisible thumbnail.

**Currently used in** — the design-process stepper thumbnail on the Design at Afi landing ([blog.landing.scss](../../apps/site/src/app/pages/blog/blog.landing.scss), `.thumb-proc`): a spine that draws top→bottom plus six stage groups landing in sequence, all phase-locked to one shared pass. Its `@media (prefers-reduced-motion: reduce)` block is the reference implementation — it lists every animated selector, drops them to `none`, and restores `stroke-dashoffset: 0` so the spine is drawn rather than absent.

**Prior art** — the retired IA-sitemap thumbnail ran the same cadence before commit `0b6ff3e` replaced it. Two consumers of the same improvised `10s` / `cubic-bezier(0.2, 0.8, 0.2, 1)` is what turned this from a one-off into a token.

---

### 4.12 `swap-slide-blur`

**When** — one region swaps its whole content for a peer view **on the user's click**: a tab panel, a step in a wizard, a paged carousel. The region's frame stays put and the content slides through it, so the swap reads as lateral movement along a strip rather than a hard cut. Direction carries meaning: forward through the set enters from the trailing edge, backward from the leading edge, which is what tells the user *which way* they moved.

**When NOT to use** —
- **Anything the user did not click.** A data refresh, a route change, a re-render: those are `opacity-fade` (§4.2) or nothing. This pattern's whole justification is that a deliberate lateral gesture deserves lateral feedback.
- **A set with no order.** Filters, toggles, unordered switches — there is no forward or backward to encode, so the slide is decoration and the direction is a lie. Use `hover-tint` + an instant swap.
- **Tall content.** A panel taller than the viewport slides its off-screen parts too; you get motion the user cannot see paid for at full cost. Cap it at content that fits in view.
- **A frame that resizes with its content.** The slide assumes a stable box. If the panels differ in height, the frame jumps under the motion and the swap reads as a glitch — fix the height first.

**Relationship to `stagger-reveal` (§4.7)** — §4.7 bars blur from *warm* transitions, and this pattern is warm. The distinction that lets both stand: §4.7 is a multi-element cascade at 400–600ms with per-element delays, which on a tab switch is latency you added on purpose. This is ONE element at `--motion-duration-base` (200ms) with a light 4px blur — inside the interaction-response budget of component-skill §11 rule 4, and short enough that the blur reads as a soft edge on the movement rather than as a load. If you find yourself staggering the contents of a swapped panel, you have left this pattern and §4.7's prohibition applies again.

**Properties** — `opacity` (0→1) + `transform: translateX()` (±travel→0) + `filter: blur()` (→0), on the container only. Container-first (component-skill §11 rule 1): the panel moves as one unit, never its children individually.

**Tokens** — `var(--motion-duration-base)` + `var(--motion-easing-standard)` (back-and-forth movement, per §3), `var(--motion-reveal-rise-normal)` for the lateral travel, `var(--motion-reveal-blur-light)` for the blur peak. No new tokens: `reveal-rise` carries any spatial travel in this family (same reuse rule as §4.11), and the light blur tier is the softest one in the set.

```scss
// CSS form — for a panel INSIDE the primitive's own style scope.
.panel--swap-forward { animation: swap-slide-blur-forward var(--motion-duration-base) var(--motion-easing-standard) both; }
.panel--swap-back    { animation: swap-slide-blur-back    var(--motion-duration-base) var(--motion-easing-standard) both; }

@keyframes swap-slide-blur-forward {
  from { opacity: 0; filter: blur(var(--motion-reveal-blur-light)); transform: translateX(var(--motion-reveal-rise-normal)); }
  to   { opacity: 1; filter: blur(0);                               transform: translateX(0); }
}

@keyframes swap-slide-blur-back {
  from { opacity: 0; filter: blur(var(--motion-reveal-blur-light)); transform: translateX(calc(-1 * var(--motion-reveal-rise-normal))); }
  to   { opacity: 1; filter: blur(0);                               transform: translateX(0); }
}

@media (prefers-reduced-motion: reduce) {
  .panel--swap-forward,
  .panel--swap-back { animation: none; }
}
```

**Replay caveat** — a CSS class cannot replay an animation it is already carrying. v1 `afi-tabs` solved that with an `animationKey % 2` parity hack that doubles every keyframe block (`--enter-left` / `--enter-left-alt`); do not copy it. Either re-mount the element, or drive the pattern from the Web Animations API, where each `element.animate()` call is a fresh replay — see the directive below.

**Reduced motion** — skip the animation entirely. The content still changes, instantly; selection is already communicated by the tab label colour and the underline. No opacity-only substitute — a fade here would be motion the user asked not to have, on a transition they trigger dozens of times a session.

**Currently used in** — [tab-panel-v2.directive.ts](../../libs/ui/src/tabs-v2/tab-panel-v2.directive.ts), the WAAPI form: `[afiTabPanelV2]="activeIndex"` on the consumer's panel element. `afi-tabs-v2` is bar-only, so the panel lives outside the primitive's style scope where scoped keyframes cannot reach it and `::ng-deep` is banned — the directive reads the four tokens with `getComputedStyle` and calls `element.animate()`, the same read-tokens-into-JS approach as §4.10. Consumers: the brand-strategy page ([estrategia-marca](../../apps/site/src/app/pages/estrategia-marca/estrategia-marca.page.html), four panels kept mounted and toggled with `[hidden]`) and the [foundations-modern workbench](../../apps/site/src/app/pages/demos/foundations-modern-workbench/foundations-modern-workbench.page.html) (a single swapping panel).

**Prior art** — v1 [afi-tabs](../../libs/ui/src/tabs/tabs.component.scss), which invented this motion inline with spacing tokens standing in for motion distances (`--space-sm` travel, `--space-2xs` blur). The v2 port is what turned it into a named pattern.

---

### 4.13 `selection-slide`

**When** — a **single marker shared by a set of options** travels to whichever one the user just picked: the tab underline, the segmented-control pill, a nav rail highlight. One marker moving is the whole point — it says *the selection moved from there to here*, which N independent fade-in/fade-out markers cannot say.

**When NOT to use** — a set whose options each own their own indicator (checkboxes, a multi-select filter bar). Nothing travels between them, so there is no path to animate; those get `control-fill-fade` (§4.9).

**Properties** — `transform: translateX()` for position + `width` for size, both measured off the target's bounding rect by the component. Never `left`/`inset-inline-start` for the travel: `transform` composites, `left` re-layouts every frame.

**Tokens** — `var(--motion-duration-base)` for both properties, `var(--motion-easing-standard)` for both animation segments, and `var(--motion-reveal-rise-light)` (6px) as the overshoot reach (reveal-rise carries spatial travel in this family, per §4.11).

**The position overshoots by a fixed distance; the width does not overshoot at all.** Three calls, each of which cost something to learn:

- **Fixed distance, not a curve** — see §3. A CSS easing's overshoot is a percentage of the travel, so it collapses to nothing on a narrow bar and goes loose on a wide one. Drive the position with a three-keyframe WAAPI animation whose middle keyframe is `target + reach`, and the bounce feels identical in a 3-tab bar and an 8-tab one.
- **Position vs width** — overshooting the width alongside the position lets the trailing edge cross the leading one on a hop to a narrower target. That reads as a wobble, not as weight. Width stays a plain CSS transition on the standard curve, so the box arrives clean while the position does the follow-through.
- **Open marker vs bounded marker** — a hairline underline sits on an open baseline with nothing to hit, so it can overshoot freely. A **filled pill inside a track** (segmented-control) has hard walls a few pixels away; overshooting drives it into the track edge or clips it. Bounded markers get no overshoot — plain transitions on both properties.

```scss
// Width only. Position is animated by the component (WAAPI) — with no transform
// transition here, skipping that animation lands the marker instantly, which is
// exactly the reduced-motion behaviour.
.indicator {
  will-change: transform, width;
  transition: width var(--motion-duration-base) var(--motion-easing-standard);

  @media (prefers-reduced-motion: reduce) { transition: none; }
}
```

```ts
// reach = --motion-reveal-rise-light; capped so a very short hop does not fling
// the full distance. OVERSHOOT_AT (0.62) and the 0.3 cap are curve-shape
// constants, not brand values — the reach is the token.
const overshoot = Math.sign(travel) * Math.min(reach, Math.abs(travel) * 0.3);
el.animate(
  [
    { transform: `translateX(${start}px)`, easing },
    { transform: `translateX(${to + overshoot}px)`, offset: 0.62, easing },
    { transform: `translateX(${to}px)` },
  ],
  { duration },
);
```

**Re-target mid-flight from where the marker actually is** (`getComputedStyle(el).transform` → `DOMMatrix.m41`) rather than from the last committed position, or a fast second click snaps the marker back to the previous item before starting again.

**Animate on selection change only.** A measured marker also moves on resize and on web-font reflow. Bouncing for those is motion nobody asked for — gate the animation on the index having changed, and let the first pass establish the resting position. (`segmented-control-v2` solves the same first-paint problem with an `--animated` class so its pill lands under the initial selection instead of growing in from zero width.)

**Measure the overshoot, don't eyeball it.** CSS transitions and WAAPI animations are both `Animation` objects, so `element.getAnimations()` returns them — pause and scrub `currentTime` to read the exact travel at any instant. Do that across the narrowest AND widest hop the bar allows; a single measurement is what hides a percentage-based bounce.

**Reduced motion** — no animation, no transition. The marker jumps straight to the new selection, which still communicates the state; the travel is the non-essential part.

**Currently used in** — [tabs-v2](../../libs/ui/src/tabs-v2/tabs-v2.component.ts) (`slideIndicator`; underline on an open baseline → fixed-distance overshoot on the position, width on a plain CSS transition) and [segmented-control-v2](../../libs/ui/src/segmented-control-v2/segmented-control-v2.component.scss) (pill inside a track → plain transitions, no overshoot). v1 [afi-tabs](../../libs/ui/src/tabs/tabs.component.scss) predates the pattern and runs `--easing-standard` on both properties.

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

- **2026-07-29 (later)** — Added `selection-slide` (§4.13): the travelling selection marker now has follow-through, and §3 gained the rule that **travel distance decides the overshoot mechanism**. Went the wrong way first, which is why §3 says what it says: the initial attempt was a new easing token (`cubic-bezier(0.34, 1.3, 0.64, 1)`, ~3%), reached for because `--motion-easing-spring`'s 25% is fine on a 16px thumb but throws a 235px tab hop 59px past its mark. Measured, the tamer curve gave a clean 7px there — and 2.4px across the narrow 3-tab bar on the same page, i.e. invisible. A CSS easing is normalised, so its overshoot is *always* a percentage of the travel; no curve can hold a distance constant. The token was reverted (never shipped) and the position moved to a three-keyframe WAAPI animation overshooting a fixed `--motion-reveal-rise-light` (6px), which reads identically at every hop length. Width stays a plain CSS transition — overshooting it lets the trailing edge cross the leading one on a narrowing hop. Overshoot applies only to OPEN markers: `segmented-control-v2`'s pill is bounded by its track and keeps plain transitions.
- **2026-07-29** — Added `swap-slide-blur` (§4.12): the tab-panel content swap — a lateral slide + light blur whose direction encodes which way the user moved through an ordered set. Ported from v1 `afi-tabs`, where it had been improvising motion distances out of spacing tokens (`--space-sm`, `--space-2xs`) and replaying itself with an `animationKey % 2` parity hack that doubled every keyframe block. No new tokens — reuses `--motion-reveal-rise-normal` + `--motion-reveal-blur-light` on `--motion-duration-base`. First consumer is `TabPanelV2Directive`, the WAAPI form, because `afi-tabs-v2` is bar-only and the panel sits outside its style scope. §4.7's blur-on-warm-transitions prohibition is narrowed rather than broken: it governs multi-element cascades at 400–600ms, not a single 200ms container swap — both entries now say so.
- **2026-07-28** — Added `ambient-loop` (§4.11): the first `infinite` entry in the catalog — decorative, self-restarting motion in its own frame (illustrative thumbnails, self-drawing diagrams). Closes a token gap found by a DS audit of the Design at Afi landing, where the design-process stepper thumbnail had been improvising `10s cubic-bezier(0.2, 0.8, 0.2, 1)` in page code — as the retired IA-sitemap thumbnail did before it, which is what made the cadence worth naming. Two new modern-layer tokens, `--motion-duration-ambient-loop` (10000ms) + `--motion-easing-ambient` (`cubic-bezier(0.2, 0.8, 0.2, 1)`), added via `tools/figma-sync/foundations-modern.json` → `primitive-motion.scss`. Deliberately outside the `fast|base|slow` interaction ramp: a loop length is not a response time (see §3 "Ambient loop"). Reduced-motion variant is `animation: none` with no fade substitute, which only holds if the un-animated markup is already the finished artwork.
- **2026-07-24** — Added `text-decode-scramble` (§4.10): the language-switch "decode" on blog headings, reworked so the blur travels per-character with the resolve front (was a single uniform whole-element blur). First Tier-3, JS-driven catalog entry. Two new modern-layer tokens, `--motion-decode-duration` (1150ms) + `--motion-decode-blur` (2.5px), added via `tools/figma-sync/foundations-modern.json` → `primitive-motion.scss` and consumed by the `[siteHyperText]` directive by reading the token values into JS — the first pattern to do so.
- **2026-07-21 (later still)** — toggle-v2 joined the press-feedback family with two variations: the thumb slide moved to `--motion-easing-spring` (overshoot "thunk" into the track wall), and press-down flattens the thumb height-only (`scaleY(0.8)`, width holds — Fluid Functionalism switch recipe) composed with the slide via a `--_travel` var. If a third primitive wants the height-only squish, promote it to a named §4 pattern.
- **2026-07-21 (later)** — `press-squish` retuned to the Animate UI checkbox recipe: press dips to `0.95` (was `0.9`) with an optional `1.05` hover-grow companion; checkbox-v2 also gained the delayed check draw (fill lands first, check draws one `--motion-duration-base` beat later, opacity fade riding along) and a `--motion-duration-slower` (500ms) colour fade (see §4.9 `control-fill-fade`). Source: animate-ui.com base checkbox (whileHover 1.05 / whileTap 0.95 / pathLength draw at .2s + .2s delay).
- **2026-07-21** — Added `press-squish` (§4.8): tactile press feedback — a control scales down while `:active` and springs back on release via the overshoot curve. Requires the foundations-modern `--motion-easing-spring` token (`cubic-bezier(0.34, 2, 0.64, 1)`), added to `tools/figma-sync/foundations-modern.json` → `primitive-motion.scss`. First consumer: `checkbox-v2`. First bouncy easing in the v2 family — taste note flags the alternative calm treatment.
- **2026-07-17** — Added `stagger-reveal` (§4.7): staggered "blur-and-fade" entrance with three intensity tiers (light/normal/heavy). New tokens in `motion.scss` (`--duration-reveal-*`, `--reveal-stagger-*`, `--reveal-rise-*`, `--reveal-blur-*`). Un-parked from §7. Directive still pending a first consumer.
- **2026-05-20** — V1 LOCKED. Six named patterns (`hover-tint`, `opacity-fade`, `focus-ring`, `slide-fade-enter`, `panel-slide`, `reduced-motion-collapse`). Token reference for `--duration-*` and `--easing-*` consolidated. Three known gaps + two token violations flagged.
