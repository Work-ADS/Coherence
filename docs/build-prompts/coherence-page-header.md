# Build — Coherence PageHeader primitive (`libs/ui/page-header/`)

**Source:** `docs/strategy/plan.md`
**Surface:** the page-level chrome that sits above every route's content. Adaptive height. Carries breadcrumb, title, estado chip, primary action, tabs, filters — whichever slots the page populates.
**Prereqs:** scaffolding + tokens + Button + Tabs + StatusChip + Sidebar (shell composes these).

## Scope

One primitive: `<afi-page-header>`. Slot-driven, sticky-capable, scroll-fade on stick, estado-aware.

**Not in scope:** hero layouts, marketing-style headers, docs TOC right-rail (handled by the Docs shell, not this primitive). Those compose Page-header alongside other slots — the primitive itself stays focused.

## Required reads (in order)

1. `docs/rules/clean-code.md`
2. `docs/rules/accessibility.md` — landmark + skip-link discipline
3. `docs/rules/component-skill.md` — slot + signal input pattern
4. `docs/rules/copy-skill.md` — RAE Spanish; every hardcoded string in this primitive is `usted`-register
5. `docs/rules/token-skill.md` — Surface tonal ladder (base / quiet / elevated); scroll-fade rules
6. `docs/strategy/plan.md` — Pure-C chrome lock (no top strip above Page-header); estado pattern (page-scoped, not global)
7. `docs/build-prompts/coherence-tabs.md` — Tabs slot embeds the existing primitive
8. `docs/build-prompts/coherence-status-chip.md` — the chip rendered when `estado` input is set

## When to use

- Every product route. PageHeader is required in Workspace, Canvas, and Docs shells.
- Focus shell uses a compact variant (progress row instead of breadcrumb).
- Auth shell does NOT use PageHeader (centered card, no chrome above content).

## When NOT to use

- Hero sections on marketing — different primitive, different system (marketing is out of v1 scope).
- In-page section dividers — use heading + `<afi-tabs>` directly.
- Modal / Drawer headers — those primitives own their own header bar.

## Composition patterns

- **List/index page:** breadcrumb + title + count-meta + rightActions (filter, export). Height ~56px.
- **Data view / dashboard:** breadcrumb + title + subtitle + filters-row + tabs. Height ~112-128px.
- **Detail / single resource:** breadcrumb + title + `<afi-status-chip [estado]="…">` + primaryAction. Height ~80px.
- **Simple page:** title only. Height ~48px.
- **Route with tabs:** title + tabs row (collapses title on scroll if `stickyTitle=false`).

## `<afi-page-header>` API

| Input | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | *(required)* | Main heading; renders as `<h1>` |
| `subtitle` | `string \| null` | `null` | Secondary descriptor under title |
| `estado` | `string \| null` | `null` | Renders `<afi-status-chip [estado]="…" />` inline after title |
| `sticky` | `boolean` | `true` | Sticks to top of content scroll container |
| `scrollFade` | `boolean` | `true` | Applies `backdrop-blur` + hairline border when `scrollY > 8px` (sticky only) |
| `density` | `'compact' \| 'default'` | `'default'` | `compact` = 48px min; `default` = 56px min; grows with populated slots |
| `ariaLabel` | `string \| null` | `null` | Overrides default landmark label for assistive tech |

**Outputs:**

```ts
stickyChange = output<boolean>(); // fires when scroll-fade toggles
```

**Slots:**

- `[slot=breadcrumb]` — breadcrumb trail (row 1, left)
- `[slot=globalActions]` — right-side pins in row 1 (search, notifications). See "Notifications" below.
- `[slot=primaryAction]` — right-side button in row 2 (`Enviar ajuste`, `Guardar`, etc.)
- `[slot=meta]` — left-of-primary metadata (counts, timestamps, author)
- `[slot=filters]` — row 3 left, filter chips / segmented controls
- `[slot=tabs]` — `<afi-tabs>` row; bottom of the header
- default slot — falls through to the title row right-side when no explicit `primaryAction`

PageHeader does not prescribe *which* slots you populate — the height adapts to what's there.

## Key behavior

### Height adapts to populated slots

The primitive renders rows conditionally:

```
Row 1 (always): breadcrumb   |   globalActions
Row 2 (always): title · estado-chip · meta   |   primaryAction
Row 3 (if filters): filters                  |
Row 4 (if tabs):   tabs
```

Empty slots collapse their row. A "simple page" (title only) renders rows 1 + 2 with row 1 being a thin 28px row (breadcrumb can still show) or collapsed entirely if `breadcrumb` slot is unused.

### Sticky + scroll-fade

When `sticky=true` (default):
- `position: sticky; top: 0; z-index: 10`
- `scrollFade=true`: listens to the nearest scroll container; when `scrollTop > 8px`, applies `backdrop-filter: blur(8px)` + `border-bottom: 1px solid var(--border-hairline)`.
- Fade-in transition: `duration.fast` (150ms), `easing.enter`. No motion on the content itself — only the chrome attributes.
- Reduced-motion: fade applies instantly (no transition).

Notifies via `stickyChange` output when the faded state toggles — consumers rarely use this, but it's there for shell-level effects.

### Estado

When `estado` is set:
- Renders `<afi-status-chip [estado]="estado()" />` directly after the `title`'s last word.
- Chip picks up its color tokens from the `status-*` semantic bucket (see `coherence-status-chip.md`).
- Screen-reader announces title + state: `<h1>{title}, {estado-localized-label}</h1>` pattern via `sr-only` inline text.

### Notifications (only persistent global action)

Per Pure-C lock: the notifications bell is the only global action that lives in Page-header chrome. Consumers place `<afi-notifications-bell>` (future primitive) or a simple Button in `[slot=globalActions]`. The primitive does not hardcode a bell — it accepts whatever the consumer puts there — but the *convention* is documented here so every product puts notifications in the same slot.

Search follows the same rule if the product has a global search: also in `[slot=globalActions]`, to the left of notifications.

### Tabs integration

When `[slot=tabs]` contains `<afi-tabs>`, PageHeader:
- Renders the tabs row flush with its bottom edge — no padding below.
- Removes its own bottom border (Tabs' active underline becomes the visual bottom boundary).
- Tabs inherit scroll-fade: when PageHeader goes sticky, tabs stick with it.

### Focus order

Tab order through PageHeader:
1. Breadcrumb links (left to right)
2. Global actions (left to right)
3. Primary action
4. Filter slot contents
5. Tabs

Skip-link target: the primitive exposes an `id="page-header"` anchor consumers can reference in a "Saltar a contenido" skip-link.

## Accessibility

- `<header role="banner" aria-label="Encabezado de página">` — unique per page (use `aria-label` to differentiate if multiple Page-headers ever stack, which shouldn't happen).
- `title` renders as `<h1>` — only one per page; assert via dev-mode warning if a route renders more than one PageHeader.
- `estado` announced via SR: the `<afi-status-chip>`'s internal `aria-label` carries the localized state label.
- Scroll-fade has no a11y impact — it's purely visual.
- `prefers-reduced-motion`: fade transitions collapse to instant.
- Touch targets in global actions row ≥ 44×44pt.

## File structure

```
libs/ui/src/page-header/
├── page-header.component.ts         # class only — templateUrl + (optional) styleUrls
├── page-header.component.html       # template (always external)
├── page-header.variants.ts          # density + sticky class maps
├── page-header.component.spec.ts
└── index.ts
```

3-file shape mandatory. `.component.scss` is added only if page-header needs styles beyond Tailwind classes mapped to tokens (currently it doesn't — Tailwind only, token-driven). See `docs/rules/component-skill.md` § 2.

## Copy (hardcoded, RAE, `usted`)

- Default landmark label: `Encabezado de página`
- Skip-link target id: `page-header` (not user-facing but locked for cross-route consistency)
- Scroll-to-top button aria-label (if you add one via `[slot=globalActions]`): consumer provides; convention is `Volver al inicio de la página`

No user-facing strings originate in this primitive — it's a chrome host, not a copy surface.

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `page-header`.

Page-header-specific additions:
- Verify rows collapse when their slots are empty (no ghost whitespace).
- Verify sticky behavior on a scrollable parent (test in showcase route, not just isolation).
- Verify scroll-fade appears at `scrollY > 8px`, disappears at `scrollY ≤ 8px`.
- Verify `estado` input renders the status-chip with the right color token (check `data-estado` attribute on the chip).
- Verify `<h1>` is exactly one per page (dev-mode warning fires if nested PageHeaders).
- Verify reduced-motion: no fade animation on scroll.
- Verify tabs slot integration: tabs sit flush, bottom border collapses, they stick with the header.
- Verify touch targets ≥ 44×44pt in global-actions slot.

## What success looks like

- AWM Propuestas detail page: breadcrumb `Personas / Cliente / Propuestas`, title `Nombre de propuesta 2`, estado chip `Pendiente` (amber), primary action `Enviar ajuste`. Tabs `General · Detalles · Archivos · Analítica`. Scroll: fades in. All Spanish. All token-driven.
- Simple settings page: title only, 48px, no visual bulk.
- Keyboard user: Tab reaches breadcrumb first, then global actions, then primary action, then filters, then tabs. Skip-link from sidebar lands on page content below the header.
- Reduced-motion: no fade animation, chrome state changes are instant, everything stays usable.

## If stuck

- **Sticky container:** the primitive uses CSS `position: sticky`, not JS scroll math. Just `top: 0; z-index: 10` and let the browser handle it. JS only for the scroll-fade detection (IntersectionObserver or scroll listener on the nearest scroll parent).
- **Slot detection for row collapsing:** use Angular's `contentChildren` + a signal that counts populated slots. Rows are `@if` blocks driven by that signal.
- **Estado propagation:** don't recreate `<afi-status-chip>` — just instantiate it with the `estado` input. One source of truth.
- **Multiple scroll containers:** if consumer nests PageHeader inside a non-`window` scroll container, the scroll-fade listener must attach to the nearest ancestor with `overflow-y` — traverse up in `ngAfterViewInit`.
- **Tabs bottom border:** the primitive applies `data-has-tabs="true"` when `[slot=tabs]` has content; CSS selector removes the header's bottom border in that case.
