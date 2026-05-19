# Build — Coherence NavSection primitive (`libs/ui/nav-section/`)

**Source:** `docs/strategy/plan.md` (LOCKED 2026-04-17-rev3)
**Surface:** expandable parent nav row with collapsible children. Calibration: Granola's "Richard HQ" workspace group — chevron + label + hover `+` trailing action + nested folder rows below. Used inside `<afi-sidebar>`. Extends the nav family (Sidebar + NavItem) — composes NavItem for both the parent row and its children.
**Prereqs:** scaffolding + tokens + Sidebar + NavItem (same-PR or earlier).

## Scope

One primitive: `<afi-nav-section>`. Renders:

- A **parent row** — label, optional icon, expand/collapse chevron, optional trailing-action slot (the `+` button Granola shows on hover).
- A **children slot** — usually a list of `<afi-nav-item>` or nested `<afi-nav-section>` instances, visually indented.
- Expand / collapse state with auto-expand when the active route is inside the section.

**Not in scope:**
- Drag-reorder of children (backlog).
- Arbitrary-depth third-level nesting as a primary use case — the primitive supports it structurally (a NavSection can contain a NavSection), but deep hierarchies (>2 levels) should surface a refactor conversation, not more nesting.
- Accordion content (FAQ, info disclosure) — that's a different primitive. This one is navigation only.

## Required reads

1. `docs/rules/clean-code.md`
2. `docs/rules/accessibility.md` — `aria-expanded`, disclosure widget pattern, `aria-current` inheritance
3. `docs/rules/component-skill.md`
4. `docs/rules/copy-skill.md`
5. `docs/rules/token-skill.md` — Surface tonal ladder, nav item active state tokens
6. `docs/build-prompts/coherence-sidebar.md` — the shell this primitive lives inside
7. `docs/build-prompts/coherence-menu.md` — the `⋮` menu used for section-level actions (composed, not inlined)

## When to use

- Sidebar groups with children: Workspaces / Collections / Folders / Teams / Pinned items (Granola, Notion, Linear patterns)
- Hierarchical navigation where the parent may also be a destination (`routerLink` on the parent label) AND children are destinations themselves

## When NOT to use

- Flat nav lists → plain `<afi-nav-item>` suffices
- Accordion / disclosure content → future accordion primitive, not this
- Tab-like section switching → `<afi-tabs>`
- Dropdown menus triggered by a `⋮` button → `<afi-menu>`

## Composition patterns

### Granola-style workspace section

```html
<afi-sidebar mode="static">
  <afi-nav-section label="Richard HQ" [expanded]="true">
    <afi-button
      slot="trailingAction"
      variant="ghost"
      size="sm"
      iconStart="plus"
      ariaLabel="Crear carpeta en Richard HQ"
      (clicked)="onCreateFolder()" />

    <afi-nav-item label="Design system" icon="folder" routerLink="/hq/design-system">
      <afi-button
        slot="rowAction"
        variant="ghost"
        size="sm"
        iconStart="more-vertical"
        ariaLabel="Acciones para Design system"
        #menuTrigger
        (clicked)="menu.open = !menu.open" />
      <afi-menu [triggerRef]="menuTrigger" [(open)]="menu.open">
        <afi-menu-item iconStart="folder-plus"  label="Crear subcarpeta" (clicked)="…" />
        <afi-menu-item iconStart="star"         label="Añadir a favoritos" (clicked)="…" />
        <afi-menu-item iconStart="edit"         label="Renombrar"         (clicked)="…" />
        <afi-menu-item iconStart="user-plus"    label="Ajustes de uso compartido" (clicked)="…" />
        <afi-menu-divider />
        <afi-menu-item iconStart="trash"        label="Eliminar carpeta"  variant="danger" (clicked)="…" />
      </afi-menu>
    </afi-nav-item>

    <afi-nav-item label="KT360"          icon="folder" routerLink="/hq/kt360" />
  </afi-nav-section>
</afi-sidebar>
```

This is the Granola screenshot, composed.

### Coherence site use (after this primitive graduates from site-local to DS)

Replaces the site-local `<afi-nav-section>` referenced in `coherence-site.md`. Six top-level sections in the Coherence docs sidebar each render as a NavSection.

## `<afi-nav-section>` API

| Input | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | *(required)* | Parent row text |
| `icon` | `string \| null` | `null` | Lucide icon, 16px, rendered before the label in the parent row |
| `routerLink` | `string \| any[] \| null` | `null` | If set, the parent label is clickable and navigates. If null, the parent label is non-clickable — the whole row's job is to expand/collapse. |
| `expanded` | `boolean \| null` | `null` | Two-way via `expandedChange`. `null` = auto mode: starts expanded if the active route matches any child's `routerLink`, else collapsed. |
| `defaultExpanded` | `boolean` | `false` | Used when `expanded` is `null` AND no child matches active route — lets consumers pick the "initial open" state for stable sections. |
| `disabled` | `boolean` | `false` | Parent row is non-interactive; children still render but the chevron is suppressed |
| `ariaLabel` | `string \| null` | `null` | Overrides default (`'Sección: {label}'`) for SR |

**Outputs:**

```ts
expandedChange = output<boolean>();  // fires on user toggle or auto-expand trigger
parentClicked  = output<{ event: MouseEvent }>();  // fires when label is clicked (only when routerLink is set)
```

**Slots:**
- default slot — children (usually `<afi-nav-item>`).
- `[slot=trailingAction]` — hover-revealed action button on the parent row (e.g., `+` for Granola's "Create folder in workspace").

## Behavior

### Parent row

1. **Layout:** `chevron | icon? | label | trailingAction?` — horizontal flex, `gap-space-2`, padding matching `<afi-nav-item>` for visual continuity.
2. **Chevron:** `chevron-right` rotated `90deg` when expanded (smooth rotation, `duration-fast`, `easing-enter`). Rotation only; no size change.
3. **Click on chevron OR on the non-link portion of the row:** toggles `expanded` (emits `expandedChange`).
4. **Click on the label (when `routerLink` is set):** navigates; does NOT toggle expand (chevron handles expand; label handles nav). Prevents the common "I wanted to visit the section, not collapse it" frustration.
5. **Hover:** `bg-surface-muted` tint on the row.
6. **Active state:** when any descendant route is active, parent row shows a subtle indicator (`text-canvas-fg font-medium` — NOT the full action-colored active treatment reserved for the leaf NavItem).
7. **Trailing action:** rendered absolute-right; opacity 0 at rest, opacity 1 on row hover or keyboard focus; always visible on touch devices (no `hover:` on touch).

### Children region

1. **Indentation:** `pl-space-8` — establishes hierarchy without needing a visual guide line. Can add a hairline guide later if users get lost.
2. **Expand / collapse animation:** Tier 1 CSS. `max-height: 0 → auto` is expensive (forces layout); use `grid-template-rows: 0fr → 1fr` on a wrapping div — modern CSS trick, no JS measurement, GPU-safe. `duration-base` (200ms), `easing-enter`. Opacity cross-fade on the child rows in lockstep.
3. **Reduced motion:** `max-height` snaps instantly; opacity transitions collapse to 0–80ms.
4. **Auto-expand on route change:** `ngOnInit` + `Router.events` subscription (filtered to `NavigationEnd`) — if active URL matches any child's `routerLink`, set `expanded = true`. Only when `expanded()` input is `null` (auto mode).

### Keyboard

| Key | Action |
|---|---|
| `Tab` | Enters the section — focuses parent row (chevron if no routerLink, else label). |
| `Arrow Right` | Expand (if collapsed); else move focus to first child. |
| `Arrow Left` | Collapse (if expanded); else move focus to parent row (when already on a child). |
| `Arrow Down` / `Arrow Up` | Navigate between parent row and children (via Sidebar's FocusKeyManager). |
| `Enter` on chevron | Toggles expand. |
| `Enter` on label | Navigates (if routerLink) or toggles expand (if no routerLink). |
| `Space` | Same as `Enter` for consistency. |

---

## Tree-line visual treatment (LOCKED 2026-04-17-rev5)

Calibration: Radix Files + Animate UI Files component — connecting lines between parent and children, hover trail, sliding "you are here" marker. This is the signature visual of the nav family; Granola-quiet, structural, on-brand.

### Three visual pieces

**1. Connecting lines (structural, always visible)**

Vertical guide: 1px `border-hairline` on the children container's `::before` pseudo-element, positioned `left-3` (aligns with parent icon center). Horizontal stubs: 8px `border-top` `border-hairline` on each child row's `::before`, extending from the vertical guide to the child's left padding.

```css
.nav-section__children {
  position: relative;
}
.nav-section__children::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--border-hairline);
}
.nav-section__child {
  position: relative;
  padding-left: var(--space-8);
}
.nav-section__child::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 50%;
  width: 12px;
  height: 1px;
  background: var(--border-hairline);
}
```

**2. Hover/focus trail — path from parent to hovered item**

When a child is hovered OR keyboard-focused, the horizontal stub for that child AND the vertical segment from parent trigger down to the child's Y-center transition from `border-hairline` to `border-action-300`. Segments below the hovered item stay neutral.

Implementation: the children container tracks the currently-hovered/focused child's index via a local signal (`hoveredIndex`). A CSS custom property `--trail-end-y` is set to that child's Y-center in px. The vertical guide's `::before` uses a `linear-gradient` that tints from top to `--trail-end-y` with `action-300` and from there to bottom with `hairline`.

```css
.nav-section__children[data-trail="true"]::before {
  background: linear-gradient(
    to bottom,
    var(--action-300) 0,
    var(--action-300) var(--trail-end-y, 0),
    var(--border-hairline) var(--trail-end-y, 0),
    var(--border-hairline) 100%
  );
}
.nav-section__child[data-hovered="true"]::before {
  background: var(--action-300);
}
```

Transition: `background 120ms var(--easing-enter)`. Reduced motion: color swap instant.

**3. "You are here" marker — sliding position bar**

A 2px × 16px bar with rounded ends, fill `action-500`, overlays the vertical guide at the hovered/focused child's Y-center. Slides smoothly to the new Y when hover/focus moves. Opacity 0 when nothing is hovered/focused.

```html
<span
  class="nav-section__marker"
  aria-hidden="true"
  [style.--marker-y.px]="markerY()"
  [class.is-visible]="markerVisible()">
</span>
```

```css
.nav-section__marker {
  position: absolute;
  left: 11px;               /* centered on the 1px guide */
  top: var(--marker-y, 0);
  width: 2px;
  height: 16px;
  transform: translateY(-50%);
  background: var(--action-500);
  border-radius: 1px;
  opacity: 0;
  pointer-events: none;
  transition: top 200ms var(--easing-enter), opacity 120ms var(--easing-enter);
}
.nav-section__marker.is-visible { opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .nav-section__marker { transition: none; }
}
```

### State wiring

NavSection maintains three signals for the visual treatment:

```ts
protected readonly hoveredChildIndex = signal<number | null>(null);
protected readonly markerY            = computed(() => this.resolveChildY(this.hoveredChildIndex()));
protected readonly markerVisible      = computed(() => this.hoveredChildIndex() !== null);
protected readonly trailEndY          = this.markerY;  // alias for CSS var
```

Wired to children via `contentChildren(NavItemComponent)` + per-child `(mouseenter)` / `(mouseleave)` / `(focus)` / `(blur)` handlers that set `hoveredChildIndex`. Leaving and blurring both clear the index (unless another child gained focus — then the index updates).

### Control input

New NavSection input:

| Input | Type | Default | Notes |
|---|---|---|---|
| `showTreeLines` | `boolean` | `true` | Set to `false` to suppress the tree-line treatment for flat lists (e.g., top-level nav with no hierarchy to show). |

### A11y

- Pseudo-elements and the marker span are `aria-hidden="true"` — purely visual.
- Semantic hierarchy comes from the existing `role="group"` + `aria-expanded` wiring.
- Keyboard focus triggers the trail + marker identically to mouse hover.
- Reduced motion preserved across all three pieces.

### Visual check

When built correctly, the NavSection looks like this during keyboard navigation:

```
▾ Foundations
│ ─ Principios
│ ─ Color
┃ ▮── Tipografía     ← focused: marker visible, trail tinted from parent to here
│ ─ Espacio
│ ─ Movimiento
```

Moving focus to Espacio shifts the marker to Espacio's row and extends the trail by one more segment. Movimiento shifts marker further. Backing out to Principios retracts the trail to just one segment.


## Accessibility

- **Parent row:** `role="button"` when no routerLink (it's a disclosure toggle); plain `<a>` when routerLink is set. Either way, `aria-expanded` reflects expand state.
- **Children container:** `role="group"` + `aria-label` matching the section label.
- **`aria-controls`** on the parent row pointing at the children container's `id`.
- **Trailing action button** is a separate focusable element; its `ariaLabel` must describe the action with the section context (e.g., `Crear carpeta en Richard HQ`, not just `Crear carpeta`).
- **Active descendant:** when a child is the active route, the parent row shows a subtle style but does NOT claim `aria-current="page"` — that belongs to the leaf NavItem alone. This matches nested-nav guidance.
- **Reduced motion:** chevron rotation + expand/collapse collapse to instant or minimal fade.
- **Touch targets:** parent row ≥ 44×44pt including the chevron; trailing action ≥ 32×32pt (opt-out per `component-skill.md §10`; touch devices always render trailing action visible).

## File structure

```
libs/ui/nav-section/
├── nav-section.component.ts
├── nav-section.variants.ts       # padding + indentation class maps
├── nav-section.component.spec.ts
└── index.ts                       # exports NavSectionComponent
```

## Copy (hardcoded, RAE, formal `usted`)

- Default aria-label (when `ariaLabel` input is null): `Sección: {label}`
- Chevron aria-label: `Expandir sección` / `Contraer sección` (state-dependent)
- Empty-children placeholder (when `<ng-content>` produces nothing): none — the primitive simply doesn't render a children region. No "empty state" copy.

## Integration with Menu

When a section row hosts its own `⋮` menu (Granola pattern), the menu trigger goes in the `[slot=trailingAction]` on the parent row OR on a specific child's `[slot=rowAction]` (supported by NavItem — verify NavItem's build prompt has this slot; add it if missing). The Menu primitive handles overlay, focus, keyboard. NavSection doesn't reimplement any of that — it just reserves the slot.

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `nav-section`.

NavSection-specific additions:
- Verify auto-expand triggers when active route matches a child's routerLink.
- Verify chevron click toggles expand; label click navigates (when routerLink set) without toggling.
- Verify expand/collapse animation uses the grid-template-rows trick — no `max-height: auto` forcing layout.
- Verify reduced-motion → instant expand/collapse.
- Verify keyboard map (Arrow Right/Left/Up/Down, Enter on chevron vs label).
- Verify `aria-expanded`, `aria-controls`, `role="group"` on children region.
- Verify trailing action is keyboard-focusable and its `ariaLabel` includes section context.
- Verify parent row shows subtle active indicator when any child is active, but `aria-current="page"` stays on the leaf NavItem only.
- Verify visual calibration against the Granola screenshot: chevron on left, icon next, label, trailing action far-right.

## What success looks like

- Granola-calibrated sidebar: expandable workspaces with chevron + hover `+` + nested folder rows, each folder row showing `⋮` on hover which opens a contextual Menu with Delete/Rename/Share.
- Coherence site: the six top-level sections (Design at Coherence / Foundations / Components / Patterns / Resources / Blog) render as NavSections. Clicking `Foundations` expands to show Principios / Color / Tipografía / etc. Only the active section auto-expands.
- Keyboard-only user: Tab to parent row → Arrow Right to expand → Arrow Down to first child → Arrow Down through children → Arrow Left collapses the section → focus returns to parent.
- Screen reader: announces "Sección: Foundations, 8 elementos, contraída" (or expanded); navigating into children announces each child independently; active child announces "actual, página" (`aria-current="page"`).
- Reduced motion: chevron doesn't rotate smoothly, children don't slide in — everything snaps. Still usable.

## If stuck

- **Expand/collapse animation without JS measurement:** the `grid-template-rows: 0fr → 1fr` trick on a wrapper div lets CSS animate between "collapsed" and "content-sized" without knowing the height. The child content goes inside a `min-height: 0; overflow: hidden` inner wrapper. Search "CSS grid auto-height transition" for the pattern.
- **Auto-expand subscription:** listen on `Router.events`, filter to `NavigationEnd`, check active URL against child `routerLink`s. Do NOT manually walk the DOM to find children — use `contentChildren` signal.
- **`aria-controls` wiring:** the children region needs a stable `id`. Generate with Angular's `inject(DOCUMENT).defaultView!.crypto.randomUUID()` at init, or a simple counter service. Don't use Math.random.
- **Label click vs chevron click:** the click target split is important for UX. Implement with two separate click handlers on two separate elements, not a single handler with conditional logic — clearer, simpler, more accessible.
- **Trailing action spacing:** the parent row needs room for the chevron (left), label (flex-grow), and trailing action (right). Use `justify-between` on a flex row + `gap-space-2`. The trailing action uses `ml-auto` as belt-and-suspenders.
- **Don't duplicate NavItem's active styling.** The parent row's active indicator is *lighter* than a leaf NavItem's active state — a font-weight bump + maybe a subtle bg, not the full `action-50` fill. This reads the hierarchy correctly.
