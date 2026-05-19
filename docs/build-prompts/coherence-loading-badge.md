# Build — Coherence LoadingOverlay + Badge primitives (`libs/ui/loading-overlay/` + `libs/ui/badge/`)

**Source:** `docs/strategy/plan.md`
**Surface:** two small primitives that ship together — LoadingOverlay (transient state) + Badge (status indicator). Different concerns, sibling utility.
**Prereqs:** scaffolding + tokens + Button. Light dependencies; can ship after Button and alongside the rest.

## Scope

Two primitives:

- `<afi-loading-overlay>` — covers a container while loading. Two variants (motion-context-aware).
- `<afi-badge>` — status / count indicator with multi-state transitions.

Both are in one prompt because they're small and thematically paired (state-display utilities).

## Required reads

1. `docs/rules/clean-code.md`
2. `docs/rules/accessibility.md` — Toast section (LoadingOverlay's a11y model is closest to Toast's `aria-busy` + live region); Badge's only rule is "color is never the only cue"
3. `docs/rules/component-skill.md`
4. `docs/rules/token-skill.md` — System bucket (status colors for Badge)
5. `docs/strategy/plan.md` — **Motion context rule (LOCKED 2026-04-16)** — decorative motion lives in DS site, consumer apps stay spare. LoadingOverlay must ship two variants accordingly.
6. `docs/strategy/plan.md` — motion.dev multi-state-badge reference
7. `docs/build-prompts/coherence-button.md` — class-variance pattern

---

## LoadingOverlay

### When to use

- Transient fetch state over a Table, Card, or any bounded container
- Form save-in-progress over the form surface
- Full-page app init (DS site uses the decorative `line-reveal` variant; consumer products use `quiet-spinner`)

### When NOT to use

- Indicating a button's own loading → Button's `loading` prop
- Very short operations (< 300ms) → avoid flicker; don't show the overlay
- Blocking user attention → that's a Modal concern

### Composition patterns

- **Over a Table:** LoadingOverlay covers the `<tbody>` area while new rows fetch.
- **Over a Card:** LoadingOverlay covers the card body while a save resolves.
- **Full page (DS site only):** `variant="line-reveal"` on app shell init — the motion.dev-inspired page-load effect.
- **Full page (consumer apps, e.g., AWM):** `variant="quiet-spinner"` — centered spinner, subtle fade.

### API

| Input | Type | Default | Notes |
|---|---|---|---|
| `visible` | `boolean` | `false` | Two-way via `visibleChange` |
| `variant` | `'quiet-spinner' \| 'line-reveal'` | `'quiet-spinner'` | **Default restrained per motion context rule.** DS site opts in to `line-reveal`. |
| `message` | `string \| null` | `null` | Optional text below spinner; otherwise `Cargando…` SR-only |
| `blocking` | `boolean` | `true` | When true, overlay catches pointer events (clicks can't pass through) |
| `delay` | `number` | `300` | ms to wait before showing; prevents flicker on fast responses |

**Outputs:**

```ts
visibleChange = output<boolean>();
```

### Key behavior

1. **`quiet-spinner` variant:** centered SVG spinner, `action.500` color, fade-in 150ms ease-out after delay. Backdrop is `surface.quiet` at 80% opacity.
2. **`line-reveal` variant:** horizontal line grows from left to right (translateX width 0 → 100%, 400ms ease-out). As line completes, the container's content reveals (opacity 0 → 1, 200ms ease-out). DS-site-only by default.
3. `aria-busy="true"` set on the host container while overlay is visible.
4. `aria-live="polite"` announces `Cargando…` (or `message` if set).
5. `prefers-reduced-motion`: both variants collapse to a static spinner + fade; line-reveal becomes a simple fade.
6. `blocking=false`: overlay is visual-only; pointer events pass through. Use for non-critical feedback.
7. `delay`: suppresses the overlay for fast operations. If `visible=true` and `visible=false` fire within `delay` ms, nothing renders.

### Accessibility

- `aria-busy` on the container being covered.
- `role="status"` + `aria-live="polite"` on the spinner/line container.
- Focus is NOT trapped — user can still Tab within or around a `blocking=false` overlay.

### Motion context compliance

- `quiet-spinner` is the consumer-safe default.
- `line-reveal` is DS-site-only by default. If a consumer product uses it, they're explicitly opting in — document it in the consumer's motion decision log (future artifact).

---

## Badge

### When to use

- Status indicator in a Table cell (`En revisión`, `Listo para importar`, `Error`, `Importado`, `Ignorado`)
- Count on a NavItem, Tab, or Button ("Datos Entrantes (12)")
- Form validation inline ("Guardado", "Error")
- Tag-like metadata (not a full Chip — Chip is backlog)

### When NOT to use

- Full-size status message → system-bucket Toast or inline alert
- Interactive (dismissible / clickable) → future `<afi-chip>`
- Numerical KPI on a dashboard → render as typography, not Badge

### Composition patterns

- **Inside Table cells:** `<afi-badge intent="info">En revisión</afi-badge>`
- **On NavItem:** count via NavItem's `badge` input (internally renders `<afi-badge size="sm">`)
- **On Tab:** same as NavItem
- **Multi-state transition:** as an entity's status progresses, the Badge morphs between colors with a transition. Motion.dev multi-state-badge reference.

### API

| Input | Type | Default | Notes |
|---|---|---|---|
| `intent` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'neutral'` | Maps to System bucket + neutral |
| `size` | `'sm' \| 'md'` | `'md'` | sm for inline in Tabs / NavItem; md for Table cells |
| `dot` | `boolean` | `false` | When true: dot-only (no text); 8px circle; use for "has update" indicators |
| `icon` | `string \| null` | `null` | Optional start icon |

**Outputs:** none (Badge is presentational).

### Key behavior

1. Rendered as `<span>` with inline-flex layout; icon + text content.
2. Color mapping:
   - `neutral` → `surface.200` bg + `canvas.fg` text
   - `info` → `action.100` bg + `action.700` text
   - `success` → system-success bg + text
   - `warning` → system-warning bg + text
   - `error` → system-error bg + text
3. **Multi-state transition:** when `intent` changes, animate:
   - Background color transition (200ms ease-out)
   - Icon crossfade if `icon` changes (150ms ease-out, swap at midpoint)
   - Width transition if text length changes (200ms ease-out)
4. `dot` mode: 8px circle, colored per intent, no text/icon. Used for presence indicators.
5. Text content wraps ONLY if the Badge is full-width (rare); default is nowrap.
6. `prefers-reduced-motion`: color transitions preserved (state clarity), width changes instant.

### Accessibility

- Color alone does NOT carry meaning. Text or icon accompanies every intent state.
- Dot-mode Badge: the parent element MUST have an `aria-label` explaining the dot's meaning (e.g., `aria-label="Tiene actualizaciones sin leer"`).
- When used inside an interactive element (NavItem with badge count), the count is part of the interactive element's accessible name.

---

## Shared file structure

```
libs/ui/loading-overlay/
├── loading-overlay.component.ts
├── loading-overlay.variants.ts
├── loading-overlay.component.spec.ts
└── index.ts

libs/ui/badge/
├── badge.component.ts
├── badge.variants.ts
├── badge.component.spec.ts
└── index.ts
```

## Copy (hardcoded)

- LoadingOverlay default SR text: `Cargando…`
- Badge has no hardcoded strings (consumer-provided).

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `loading-overlay` AND `<primitive>` = `badge` (two runs).

LoadingOverlay-specific additions:
- Verify `delay` suppresses flicker — set visible true then false within delay, nothing renders.
- Verify `variant="line-reveal"` animation matches motion.dev choreography (line grows, content reveals).
- Verify `variant="quiet-spinner"` is the default.
- Verify `aria-busy="true"` applied to parent container.

Badge-specific additions:
- Verify all five intents render correct token-backed colors.
- Verify intent change transitions (200ms) without jarring jumps.
- Verify `dot=true` renders 8px circle with no text.
- Verify icon crossfade at intent change if icon changes.

## What success looks like

- AWM Import Table: status column renders `<afi-badge intent="warning">En revisión</afi-badge>` → on import, Badge morphs to `<afi-badge intent="success">Importado</afi-badge>` with smooth color + width transition.
- AWM Table load: `<afi-loading-overlay variant="quiet-spinner" [(visible)]="isFetching" />` shows a subtle spinner after 300ms delay; short fetches don't flicker.
- Coherence DS site init: `<afi-loading-overlay variant="line-reveal" [(visible)]="appInit" />` — line sweeps across, content reveals with the manifesto's tone of restrained performance.
- Reduced motion user: Badge still morphs color; LoadingOverlay collapses animation to a static fade.

## If stuck

- LoadingOverlay delay: `setTimeout` in an `effect()` or a signal-driven `of(visible).pipe(debounceTime(delay))`. Ensure cleanup on destroy.
- Badge width transition: `width: fit-content` + a CSS `transition: width 200ms ease-out` works for most cases. If text changes dramatically, consider a FLIP animation — but prefer the simpler CSS until it demonstrably breaks.
- Line-reveal motion: transform-based (scaleX 0 → 1 with `transform-origin: left`), not `width 0 → 100%`. GPU-accelerated, smoother at scale.
- Don't nest LoadingOverlay inside Button's loading state — Button owns its own loading affordance. Overlay is for larger containers.
