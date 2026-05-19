# Build — Coherence Sidebar + NavItem primitives (`libs/ui/sidebar/` + `libs/ui/nav-item/`)

**Source:** `docs/strategy/plan.md`
**Surface:** primary navigation shell. Hover-expand default (Instagram / Linear / Notion pattern). `surface-quiet` background.
**Prereqs:** scaffolding + tokens + Button + Tabs (related a11y patterns).

## Scope

Two primitives in one prompt — they co-design and ship together.

- `<afi-sidebar>` — the shell
- `<afi-nav-item>` — the repeatable row

## Required reads

1. `docs/rules/clean-code.md`
2. `docs/rules/accessibility.md` — keyboard focus = hover for collapsed mode (locked)
3. `docs/rules/component-skill.md`
4. `docs/rules/token-skill.md` — new `surface-quiet` semantic token (Surface bucket); also needs Action for active state
5. `docs/strategy/plan.md` — sidebar primitives lock 2026-04-16 (full spec: variants, animation, a11y, color)
6. `docs/build-prompts/coherence-button.md` — class-variance pattern for variants
7. `docs/build-prompts/coherence-tabs.md` — CDK `FocusKeyManager` pattern reused

## When to use

- Primary product navigation (AWM, Coherence DS site itself, future banks)
- Persistent chrome that holds the app's top-level IA

## When NOT to use

- In-page section nav → `<afi-tabs>`
- Quick actions / toolbar → not a Sidebar (toolbar primitive is backlog)
- Contextual drill-down → breadcrumbs (future) or Drawer

## Composition patterns

- **App shell:** Sidebar on the left, content area on the right. Sidebar owns logo at top, user/settings at bottom.
- **Coherence DS site IA:** Foundations / Tokens / Components / Charts / Flows as NavItems.
- **AWM IA:** Importaciones / Datos Entrantes / Historial / Configuración as NavItems.
- **With NavItem groups:** section headers inside the Sidebar using a `<afi-nav-item-group>` wrapper (future; v1 uses plain `<h3>` dividers).
- **With Badge on NavItem:** unread / pending count rendered as Badge, visible even when collapsed.

## `<afi-sidebar>` API

| Input | Type | Default | Notes |
|---|---|---|---|
| `mode` | `'static' \| 'collapsible' \| 'hover-expand'` | `'hover-expand'` | See variant spec in plan.md |
| `expanded` | `boolean \| null` | `null` | Two-way via `expandedChange` — overrides `mode` logic when set (manual control) |
| `pinned` | `boolean` | `false` | `hover-expand` mode: when user clicks pin button, stays expanded; persists via consumer |
| `ariaLabel` | `string` | `'Navegación principal'` | Tablist label |
| `width` | `{ collapsed: string; expanded: string }` | `{ collapsed: '64px', expanded: '240px' }` | Responsive overrides |

**Outputs:**

```ts
expandedChange = output<boolean>();
pinnedChange   = output<boolean>();
```

**Slots:**

- `[slot=top]` — logo area (64px height)
- default slot — NavItem list (consumer places `<afi-nav-item>` children)
- `[slot=bottom]` — user / settings / theme toggle

## `<afi-nav-item>` API

| Input | Type | Default | Notes |
|---|---|---|---|
| `icon` | `string` | *(required)* | Lucide icon name; always visible (collapsed + expanded) |
| `label` | `string` | *(required)* | Text; visible when expanded; also used for `aria-label` when collapsed |
| `href` | `string \| null` | `null` | If set, renders `<a>`; else `<button>` |
| `routerLink` | `string \| any[] \| null` | `null` | Angular router integration |
| `active` | `boolean` | `false` | Visual active state + `aria-current="page"` |
| `badge` | `number \| string \| null` | `null` | Notification / count |
| `disabled` | `boolean` | `false` | |

**Outputs:**

```ts
clicked = output<{ event: MouseEvent }>();
```

## Key behavior

### Sidebar

1. **`mode="hover-expand"` (default):**
   - Starts collapsed (64px).
   - On mouse enter: expand to full width (200ms ease-out). Label opacity cross-fade (150ms ease-out, 50ms stagger).
   - On mouse leave: collapse (200ms ease-in). Asymmetric per motion discipline.
   - On keyboard focus entering any NavItem: sidebar expands (focus = hover equivalent). Critical for keyboard users.
   - Pin button appears on hover near top; clicking pins expanded state.
2. **`mode="collapsible"`:** explicit toggle button; no hover behavior.
3. **`mode="static"`:** always expanded; no collapse UI.
4. **Color:** background = `surface-quiet` (NOT `surface-base` — locked per user 2026-04-16 "less blue").
5. **Divider between top/nav/bottom slots:** hairline border-bottom / border-top.
6. **Reduced motion:** width change preserved (utility), opacity transitions collapse to 0–80ms.

### NavItem

1. **Rendering:**
   - `<a>` if `href` or `routerLink` set; else `<button>`.
   - Icon always visible (24px at md sidebar width).
   - Label visible only when parent Sidebar is expanded.
2. **Active state:** 2px `action.500` left border + `action.50` background + `action.900` icon/text color.
3. **Hover (inactive):** `surface.100` background.
4. **Focus:** `focus-visible` ring via `var(--border-focus)`.
5. **Collapsed mode tooltip:** when Sidebar is collapsed, NavItem renders `<afi-tooltip>` (see `coherence-tooltip.md`, primitive #23 added in rev7) on hover + focus showing the `label`. Attach via `[afiTooltip]="label()"` directive on the NavItem's root element with `tooltipSide="right"`. Suppressed when Sidebar is expanded — consumer binds `[tooltipDisabled]="sidebar.expanded()"` so the tooltip no-ops when labels are already visible.
6. **Badge:** positioned top-right of icon when collapsed; inline after label when expanded.

## Accessibility

- Sidebar: `<nav aria-label="Navegación principal">`; `aria-expanded` reflects state.
- NavItem: `aria-current="page"` when active; `aria-label={label}` always (even when visible text is present — tooltip suppression logic).
- **Keyboard = hover equivalence** is the a11y linchpin. A keyboard user Tab-ing through collapsed NavItems must see the full expanded sidebar.
- Arrow key navigation (up/down) between NavItems via CDK `FocusKeyManager`.
- `prefers-reduced-motion`: width state changes instantly; opacity near-zero transition.

## File structure

```
libs/ui/sidebar/
├── sidebar.component.ts
├── sidebar.variants.ts
├── sidebar.component.spec.ts
└── index.ts

libs/ui/nav-item/
├── nav-item.component.ts
├── nav-item.variants.ts
├── nav-item.component.spec.ts
└── index.ts
```

## Copy (hardcoded)

- Default ariaLabel: `Navegación principal` (RAE; formal)
- Pin button aria-label: `Fijar barra lateral`
- Unpin button aria-label: `Desfijar barra lateral`
- Expand toggle (collapsible mode): `Mostrar navegación` / `Ocultar navegación`

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `sidebar` AND `<primitive>` = `nav-item` (two runs).

Sidebar-specific additions:
- Verify all three modes (static / collapsible / hover-expand) render + behave per spec.
- Verify keyboard focus into NavItem expands sidebar in hover-expand mode.
- Verify `surface-quiet` is the background (no hex; only CSS var).
- Verify pinned state persists across mouse-leave.
- Verify reduced-motion: width changes, opacity near-instant.

NavItem-specific additions:
- Verify `<a>` rendering when href/routerLink set; `<button>` otherwise.
- Verify active state has `aria-current="page"`.
- Verify tooltip appears on collapsed sidebar, suppressed on expanded.
- Verify arrow keys navigate between items.

## What success looks like

- Coherence DS site: narrow 64px icon rail on page load. Move cursor over sidebar → expands to 240px with labels. Cursor away → collapses smoothly.
- Keyboard user: Tab reaches first NavItem → sidebar expands, label visible, tooltip suppressed. Arrow down moves to next item.
- AWM: hover-expand with 4 NavItems + a Badge on "Datos Entrantes". Claude-app-calibration visible — background is `surface-quiet`, not AFI blue.

## If stuck

- Don't animate `width` with `margin` tricks. Use CSS `width` transition on the sidebar root; children respond naturally.
- Label opacity cross-fade: transition `opacity` + `transform` (slight translateX). Both start after a small delay so the width transition leads.
- CDK Overlay tooltip: attach to NavItem root when sidebar is collapsed; detach when expanded. Use a signal + effect.
- Pin state persistence: Sidebar primitive exposes `pinnedChange` output; consumer saves to localStorage + restores on init. The primitive does not touch localStorage directly.
