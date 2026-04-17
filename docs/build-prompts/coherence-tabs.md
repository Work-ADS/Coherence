# Build — Coherence Tabs primitive (`libs/ui/tabs/`)

**Source:** `docs/plan.md`
**Surface:** in-page section navigation. CDK tablist pattern.
**Prereqs:** scaffolding + tokens + Button.

## Scope

One primitive (pair), `<afi-tabs>` + `<afi-tab>`, following the ARIA tablist → tab → tabpanel relationship.

## Required reads

1. `docs/clean-code.md`
2. `docs/accessibility.md` — Tabs section (arrow keys, Home/End, role wiring)
3. `docs/component-skill.md`
4. `docs/token-skill.md` — Action (active indicator), Control-neutral (inactive)
5. `docs/plan.md` — Angular CDK a11y module is a locked dependency

## When to use

- Multiple related views of the same entity (tabs in a settings page, tabs in a row-detail drawer)
- AWM Import main navigation: Importaciones / Datos Entrantes / Historial / Configuración de Reglas
- Data grouped by category where user switches view often

## When NOT to use

- Primary app navigation → `<afi-sidebar>`
- Mutually-exclusive form options → Radio (future) or `<afi-select>`
- Progressive disclosure of one item's details → accordion (future) or `<afi-drawer>`

## Composition patterns

- **Top-level page tabs:** horizontal tab strip above the content area.
- **Contextual tabs in a drawer:** narrower tab set showing "Detail / History / Notes" for a single row.
- **Tabs with Badge:** each tab can render a Badge showing count ("Datos Entrantes (12)").
- **Lazy-load tab content:** content of inactive tab is not mounted until first activation (via `[lazy]` input).

## API

```ts
<afi-tabs [(activeIndex)]="tab" (activeChange)="onTabChange($event)">
  <afi-tab label="Importaciones">…</afi-tab>
  <afi-tab label="Datos Entrantes" [badge]="12">…</afi-tab>
  <afi-tab label="Historial">…</afi-tab>
  <afi-tab label="Configuración de Reglas">…</afi-tab>
</afi-tabs>
```

**`<afi-tabs>` inputs:**

| Input | Type | Default | Notes |
|---|---|---|---|
| `activeIndex` | `number` | `0` | Two-way via `activeChange` |
| `size` | `'sm' \| 'md'` | `'md'` | sm = 32px tab height (in-drawer), md = 40px (page-level) |
| `lazy` | `boolean` | `false` | When true, only the active tab's content is mounted |
| `ariaLabel` | `string \| null` | `null` | Label for the tablist if no visible heading precedes it |

**`<afi-tab>` inputs:**

| Input | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | *(required)* | Visible text |
| `icon` | `string \| null` | `null` | Optional start icon |
| `badge` | `number \| string \| null` | `null` | Count or status pill; uses Badge primitive internally |
| `disabled` | `boolean` | `false` | |

**Outputs:**

```ts
// on <afi-tabs>:
activeChange = output<number>();
```

## Key behavior

1. Rendered structure: `<div role="tablist">` → `<button role="tab">` × N + `<div role="tabpanel">` × N (one visible at a time).
2. ARIA wiring: each `role="tab"` has `aria-controls` pointing at its panel's `id`; each `role="tabpanel"` has `aria-labelledby` pointing at its tab's `id`.
3. **Keyboard (CDK a11y):**
   - Left/Right arrows cycle through tabs.
   - Home jumps to first; End jumps to last.
   - Enter or Space activates focused tab.
   - Tab moves focus into the active tab's panel.
4. Active tab underline (or background, per design): 2px `action.500` bottom border, animates position across underline when active tab changes (200ms ease-out).
5. Inactive tab hover: `surface.100` background.
6. Disabled tab: 50% opacity, skipped by keyboard nav.
7. Badge in tab: rendered using `<afi-badge>` primitive with `size="sm"` inline.
8. `lazy=true`: tab panels use `*ngIf="index === activeIndex()"`.

## Accessibility

Per `accessibility.md` Tabs section. Primitive-specific:

- Never lose the role relationship (tablist / tab / tabpanel).
- If tabs wrap to two rows (narrow viewport), arrow keys still work in linear order; don't switch to 2D grid semantics.
- `activeChange` fires on user action (click or keyboard); consumer's bound signal syncs.

## File structure

```
libs/ui/tabs/
├── tabs.component.ts
├── tab.component.ts
├── tabs.variants.ts
├── tabs.component.spec.ts
└── index.ts
```

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `tabs`.

Tabs-specific additions:
- Verify arrow / Home / End keyboard nav.
- Verify `activeChange` fires on both click and keyboard activation.
- Verify `lazy=true` unmounts inactive panels.
- Verify ARIA `aria-controls` / `aria-labelledby` wired correctly.

## What success looks like

- AWM Import page: `<afi-tabs>` with four tabs, second has badge 12. Keyboard-only: Tab into tablist → Right arrow advances focus → Enter activates.
- Drawer with contextual tabs: `size="sm"`, three tabs, panels contain `<afi-input>` fields.
- Reduced motion: underline still shifts position on active change, but transition near-zero duration.

## If stuck

- CDK a11y `FocusKeyManager` handles arrow / Home / End for you — wire it to the tab list.
- Underline animation: transform-based position, not `left` — GPU-accelerated.
- Panel mounting: use Angular control flow `@if (active)` or `*ngIf`; don't use `hidden` attribute only (screen readers may still read hidden content).

---

## Variants + sliding indicator (LOCKED 2026-04-17-rev9)

Calibration: Animate UI `<Tabs>` sliding-indicator + content-crossfade pattern, translated to Tier 1 CSS + Angular signals. No Framer, no Motion One.

### Three variants

Add a `variant` input on `<afi-tabs-list>`:

| Variant | Used where | Visual |
|---|---|---|
| `underline` | Default. Page-level tabs (Code / Design on every primitive page), section nav inside surfaces. | Bottom-border hairline on the list; active indicator = 2px `action-500` bar that slides. |
| `pill` | **Preview / Code toggle inside `<afi-component-playground>`**. Segmented controls where binary/ternary selection reads as "settings." | List background = `surface-quiet`, padding `space-1`. Active indicator = a `surface-base` pill with `shadow-sm` that slides between triggers. |
| `subtle` | Dense contexts where chrome must stay minimal (future: tab switching inside Drawer, inside Table column-group headers). | No moving indicator. Active state is font-weight shift + `canvas-fg` color. |

```ts
readonly variant = input<'underline' | 'pill' | 'subtle'>('underline');
```

### The sliding indicator — Tier 1 CSS implementation

One absolutely-positioned `<span>` inside `<afi-tabs-list>` drives the animation. Its `transform: translateX(var(--indicator-x))` and `width: var(--indicator-w)` are set by signals that update when the active tab changes. CSS `transition` handles the slide.

```html
<div role="tablist" [attr.data-variant]="variant()" class="afi-tabs-list">
  <ng-content />  <!-- triggers project here -->
  <span
    class="afi-tabs-list__indicator"
    [style.--indicator-x.px]="indicatorX()"
    [style.--indicator-w.px]="indicatorW()"
    aria-hidden="true"></span>
</div>
```

`TabsListComponent` exposes an `updateIndicator(activeEl: HTMLElement)` method. Each `<afi-tab>` calls it on mount and whenever it becomes active — the method measures the trigger's rect, subtracts the list's rect, writes the two signals.

### CSS per variant

```css
.afi-tabs-list {
  position: relative;
  display: inline-flex;
  gap: var(--space-1);
  isolation: isolate;  /* indicator stays beneath tab text via z-index */
}

/* UNDERLINE (default) */
.afi-tabs-list[data-variant="underline"] {
  border-bottom: 1px solid var(--border-hairline);
}
.afi-tabs-list[data-variant="underline"] .afi-tabs-trigger {
  padding: var(--space-3) var(--space-4);
  font: var(--type-body-md-500);
  color: var(--canvas-fg-muted);
  transition: color 120ms var(--easing-enter);
}
.afi-tabs-list[data-variant="underline"] .afi-tabs-trigger[data-state="active"] {
  color: var(--canvas-fg);
}
.afi-tabs-list[data-variant="underline"] .afi-tabs-list__indicator {
  bottom: -1px;
  height: 2px;
  background: var(--action-500);
}

/* PILL — playground Preview/Code toggle */
.afi-tabs-list[data-variant="pill"] {
  background: var(--surface-quiet);
  border-radius: var(--radius-md);
  padding: var(--space-1);
}
.afi-tabs-list[data-variant="pill"] .afi-tabs-trigger {
  padding: var(--space-2) var(--space-4);
  font: var(--type-body-sm-500);
  color: var(--canvas-fg-muted);
  border-radius: calc(var(--radius-md) - var(--space-1));
  z-index: 1;
  transition: color 120ms var(--easing-enter);
}
.afi-tabs-list[data-variant="pill"] .afi-tabs-trigger[data-state="active"] {
  color: var(--canvas-fg);
}
.afi-tabs-list[data-variant="pill"] .afi-tabs-list__indicator {
  top: var(--space-1);
  bottom: var(--space-1);
  background: var(--surface-base);
  border-radius: calc(var(--radius-md) - var(--space-1));
  box-shadow: var(--shadow-sm);
}

/* SUBTLE — no indicator */
.afi-tabs-list[data-variant="subtle"] .afi-tabs-trigger[data-state="active"] {
  color: var(--canvas-fg);
  font-weight: 600;
}
.afi-tabs-list[data-variant="subtle"] .afi-tabs-list__indicator {
  display: none;
}

/* Shared indicator animation */
.afi-tabs-list__indicator {
  position: absolute;
  transform: translateX(var(--indicator-x, 0));
  width: var(--indicator-w, 0);
  transition:
    transform 220ms var(--easing-enter),
    width     220ms var(--easing-enter);
  pointer-events: none;
  z-index: 0;
}

@media (prefers-reduced-motion: reduce) {
  .afi-tabs-list__indicator { transition: none; }
}
```

### Content panel crossfade

Between panel switches, old panel fades out + new panel fades in with a 4 px translateY. 150 ms, `easing-enter`. Under reduced-motion, it collapses to an 80 ms linear opacity fade with no transform.

```css
.afi-tabs-panel {
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 150ms var(--easing-enter),
    transform 150ms var(--easing-enter);
}
.afi-tabs-panel[data-state="active"] {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .afi-tabs-panel {
    transition: opacity 80ms linear;
    transform: none !important;
  }
}
```

### Accessibility notes (additive)

- Indicator span is `aria-hidden="true"` — purely visual, doesn't affect SR.
- `aria-selected` + `tabindex` on triggers stays as specified elsewhere; variant is pure CSS.
- Under `prefers-reduced-motion: reduce`, the indicator still moves (the active-state still needs to show) — just instantly, not animated. State communication preserved; movement cut.

### Where each variant ships

- **`underline`** (default) — every primitive page's top Code/Design tabs; most in-page tabs.
- **`pill`** — `<afi-component-playground>`'s internal Preview/Code toggle. Hardcoded in that site-local component; consumers don't pick it.
- **`subtle`** — reserved; use when a surface is too dense to afford any indicator chrome.

### Observer-based re-measurement

If the active-tab's size can change after mount (e.g., a badge count updates, content reflow), attach a `ResizeObserver` to the active trigger and call `updateIndicator` on resize. Also re-run on viewport resize via a single debounced window listener. Don't measure on every animation frame.
