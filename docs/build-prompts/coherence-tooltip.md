# Build — Coherence Tooltip primitive (`libs/ui/tooltip/`)

**Source:** `docs/strategy/plan.md` (LOCKED 2026-04-17-rev7 — primitive #23, made explicit — was implicit v1 dependency of Sidebar's collapsed-mode NavItem tooltip)
**Surface:** supplementary text/content shown on hover or focus of a trigger. CDK Overlay-based. Two forms: directive (sugar for simple text) + component (rich content). Sibling to Modal / Drawer / Menu in the overlay family; distinct in that it's non-interactive (no clicks, no dismiss on content-click).
**Prereqs:** scaffolding + tokens + Button + CDK Overlay infrastructure (same as Modal / Drawer / Menu).

## Scope

Three artifacts in one prompt — all ship together:

- `<afi-tooltip>` — root component (rich-content form)
- `[afiTooltip]` — attribute directive (sugar form for simple strings)
- `TooltipService` — singleton that ensures only one tooltip is live at a time (hovering across the UI never produces ghost tooltips)

Plus one internal component:
- `TooltipPanelComponent` — rendered into the Overlay by both the directive and component forms

**Not in scope (v1):**
- **`followCursor`** — the cursor-tracking variant from Animate UI. The API input is reserved (see below) but v1 ignores it; v1.1 implements via throttled `mousemove` → Overlay position update.
- **Tooltip with a close button** — not a tooltip. If you need a close button, it's a Popover (backlog).
- **Tooltip nesting** — one tooltip per trigger. Never nest.

## Required reads

1. `docs/rules/clean-code.md`
2. `docs/rules/accessibility.md` — tooltip ARIA pattern (`role="tooltip"`, `aria-describedby`, touch considerations)
3. `docs/rules/component-skill.md`
4. `docs/rules/copy-skill.md`
5. `docs/rules/token-skill.md` — Surface-elevated + shadow-md for the panel; Motion bucket for transitions
6. `docs/build-prompts/coherence-modal.md` — CDK Overlay + positioning reference (same infrastructure, different policy)
7. `docs/build-prompts/coherence-sidebar.md` — Sidebar's collapsed-mode NavItem tooltip consumes this primitive explicitly

## When to use

- **Explaining icon-only buttons** (the `⋮` menu trigger, a trash icon, a filter icon)
- **Collapsed-sidebar NavItem labels** — Sidebar primitive depends on this
- **Keyboard-shortcut hints** — "Pulse ⌘K para buscar" (often combined with `<afi-kbd>`)
- **Clarifying truncated text** — tooltip shows the full string
- **Help text next to an `info` icon** in dense interfaces

## When NOT to use

- **Primary information** — if losing the tooltip means losing critical context, surface it inline.
- **On mobile-only surfaces** — touch lacks hover; tooltip is supplementary.
- **Dismiss flows (toast, banner)** — use a toast primitive (backlog).
- **Rich forms, buttons, cross-interactive content** — use a Popover (backlog).
- **Error messages under inputs** — `<afi-input>` has its own error state pattern; don't use a tooltip for form validation.

## Composition patterns

### Directive form (90% of cases)

```html
<!-- Icon-only button -->
<afi-button variant="ghost" iconStart="trash"
            [afiTooltip]="'Eliminar propuesta'"
            ariaLabel="Eliminar propuesta">
</afi-button>

<!-- Sidebar collapsed NavItem (inside sidebar primitive) -->
<afi-nav-item icon="inbox" label="Bandeja"
              [afiTooltip]="'Bandeja de entrada'"
              tooltipSide="right">
</afi-nav-item>

<!-- Help icon inline -->
<span>Nivel de riesgo global <lucide-icon name="info" [afiTooltip]="helpText" /></span>
```

### Component form (rich content)

```html
<afi-tooltip side="top" [sideOffset]="8">
  <button afiTooltipTrigger>Hover</button>
  <ng-template afiTooltipPanel>
    <div class="flex items-center gap-space-2">
      <span class="text-body-sm">Añadir a biblioteca</span>
      <afi-kbd [keys]="['⌘', 'D']" size="sm" />
    </div>
  </ng-template>
</afi-tooltip>
```

### Keyboard-shortcut hint pattern

```html
<afi-button
  [afiTooltip]="'Buscar (⌘ K)'"
  (clicked)="openSearch()">
  <lucide-icon name="search" />
</afi-button>
```

## `[afiTooltip]` directive API

| Input | Type | Default | Notes |
|---|---|---|---|
| `afiTooltip` | `string` | *(required)* | The tooltip text |
| `tooltipSide` | `Side` | `'top'` | `top \| bottom \| left \| right` |
| `tooltipOffset` | `number` | `8` | px distance from trigger edge |
| `tooltipAlign` | `Align` | `'center'` | `start \| center \| end` |
| `tooltipAlignOffset` | `number` | `0` | px offset along the alignment axis |
| `delayShow` | `number` | `500` | ms delay before showing on hover-in (focus shows immediately — no delay) |
| `delayHide` | `number` | `0` | ms delay before hiding on hover-out |
| `tooltipDisabled` | `boolean` | `false` | Suppresses the tooltip without removing the directive (useful for conditional help) |

## `<afi-tooltip>` component API

Same input set as the directive, named without the `tooltip` prefix:

| Input | Type | Default | Notes |
|---|---|---|---|
| `side` | `Side` | `'top'` | |
| `sideOffset` | `number` | `8` | |
| `align` | `Align` | `'center'` | |
| `alignOffset` | `number` | `0` | |
| `delayShow` | `number` | `500` | |
| `delayHide` | `number` | `0` | |
| `followCursor` | `'none' \| 'x' \| 'y' \| 'both'` | `'none'` | **v1: accepted but ignored** (no-op). v1.1: implements. API stays stable. |
| `disabled` | `boolean` | `false` | |

**Outputs (component form only):**

```ts
openChange = output<boolean>();
```

**Slots (component form):**
- `[afiTooltipTrigger]` — the element that triggers the tooltip (button, icon, anything focusable)
- `[afiTooltipPanel]` — `<ng-template>` with the rich content

## Motion (Tier 1 CSS)

Panel enters with opacity + small translate from the "side" direction:

```css
.afi-tooltip-panel {
  background: var(--surface-elevated);
  color: var(--canvas-fg);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  font-size: var(--type-body-sm-size);
  line-height: var(--type-body-sm-line);
  max-width: 280px;
  pointer-events: none;   /* tooltip content is non-interactive */

  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity var(--duration-fast) var(--easing-enter),
    transform var(--duration-fast) var(--easing-enter);
}

.afi-tooltip-panel[data-state="open"] {
  opacity: 1;
  transform: translateY(0);
}

/* Direction-aware entry — panel rises from the side opposite its pointing side */
.afi-tooltip-panel[data-side="top"]    { transform: translateY(4px);  }
.afi-tooltip-panel[data-side="bottom"] { transform: translateY(-4px); }
.afi-tooltip-panel[data-side="left"]   { transform: translateX(4px);  }
.afi-tooltip-panel[data-side="right"]  { transform: translateX(-4px); }
.afi-tooltip-panel[data-state="open"]  { transform: translate(0, 0); }

@media (prefers-reduced-motion: reduce) {
  .afi-tooltip-panel {
    transition: opacity 80ms linear;
    transform: none !important;
  }
}
```

**Motion summary:**
- Enter: 150ms (`duration-fast`) opacity + 4px translate, `easing-enter`
- Exit: 150ms, `easing-exit`
- Delay-show on hover: 500ms default (configurable)
- Delay-show on focus: **0ms** — keyboard users need immediate feedback
- Reduced motion: opacity fade only, 80ms linear, no transform

## Behavior

### Show triggers

- **Hover:** `mouseenter` on trigger → start `delayShow` timer → if still hovering at end of delay, attach Overlay.
- **Focus:** `focus` on trigger (via keyboard, Tab) → show immediately (no delay). Focus via mouse click does NOT trigger the tooltip — use `:focus-visible` behavior.
- **Touch:** long-press (500ms hold) shows; tap elsewhere dismisses. On touch devices where `@media (hover: none)`, hover is ignored.

### Hide triggers

- **Mouseleave** of trigger (not of the panel — panel is `pointer-events: none`, never receives mouse) → start `delayHide` timer → if still outside at end, detach.
- **Blur** of trigger → hide immediately.
- **`Escape` key** → dismiss, even while still hovering/focused.
- **Any other tooltip showing** → hide this one (single-instance rule via `TooltipService`).

### TooltipService

A root-provided Angular service that tracks the currently-live tooltip. Before a new tooltip attaches, it dismisses the previous one. Prevents:
- Ghost tooltips when the mouse moves fast across the UI.
- Stale tooltips when a trigger is destroyed (directive's `ngOnDestroy` calls `service.dismissFrom(this)`).
- Multiple tooltips racing to the same Overlay container.

```ts
@Injectable({ providedIn: 'root' })
export class TooltipService {
  private readonly active = signal<TooltipAttachment | null>(null);

  show(attachment: TooltipAttachment): void { /* dismiss previous + attach */ }
  hide(attachment: TooltipAttachment): void { /* detach if matches */ }
  dismissAll(): void { /* for Escape + route changes */ }
}
```

### Positioning (CDK Overlay)

- `OverlayPositionBuilder.flexibleConnectedTo(triggerRef)`
- Primary position from `side` + `align` + offsets
- Fallback positions if primary has insufficient room (e.g., `top` falls back to `bottom`)
- Re-position on viewport scroll/resize via `withScrollableContainers`

## Accessibility

- **`role="tooltip"`** on the panel.
- **`aria-describedby`** on the trigger pointing at the panel's generated `id`. NOT `aria-labelledby` — tooltip supplements, doesn't name. The trigger keeps its own accessible name via its text or `ariaLabel`.
- **Keyboard parity:** focus shows = hover shows. Blur hides = mouseleave hides. Zero delay on focus so keyboard isn't second-class.
- **Escape dismisses** unconditionally — even while still hovered/focused, regardless of delay timers.
- **Touch:** long-press pattern via CDK's touch detection (`@angular/cdk/platform`); tap-outside dismisses. Don't gate critical info behind a tooltip on touch — it's supplementary only.
- **Focus target preservation:** tooltip never steals focus. The trigger keeps focus; panel is `pointer-events: none` and not in the tab order.
- **Reduced motion:** transform collapses; opacity fades at 80ms linear.
- **Contrast:** `text-canvas-fg` on `surface-elevated` + `shadow-md` passes WCAG AA at `body-sm` size. Verify against the lightest and darkest brand backdrops.

## File structure

```
libs/ui/tooltip/
├── tooltip.component.ts              # <afi-tooltip> component form
├── tooltip.directive.ts              # [afiTooltip] directive form
├── tooltip-panel.component.ts        # internal — rendered into Overlay
├── tooltip.service.ts                # singleton instance manager
├── tooltip.types.ts                  # Side + Align unions, shared types
├── tooltip.component.spec.ts
├── tooltip.directive.spec.ts
└── index.ts                           # exports TooltipComponent, TooltipDirective, Side, Align
```

## Copy (hardcoded, RAE)

- **Default directive text:** none — `afiTooltip` is required.
- **Panel aria-label:** none (role="tooltip" is semantic; the text itself is the accessible content).
- **Consumer-provided strings (glossary anchors — use verbatim where the pattern applies):**
  - `Eliminar` (destructive action tooltip on a trash icon)
  - `Editar` (pencil icon)
  - `Compartir` (share icon)
  - `Más opciones` (the `⋮` icon)
  - `Buscar` (search icon, often paired with ⌘K kbd)
  - `Cerrar` (close icon)
  - `Filtrar` (filter icon)

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `tooltip` (covers directive + component + service).

Tooltip-specific additions:
- Verify directive form: `[afiTooltip]="'text'"` shows tooltip on hover after `delayShow`; hides on mouseleave after `delayHide`.
- Verify focus shows tooltip immediately (0ms delay).
- Verify keyboard-only user: Tab to trigger → tooltip appears; Tab away → dismisses.
- Verify Escape dismisses even while hovering.
- Verify positioning falls back when primary side has no room (test near each viewport edge).
- Verify reduced motion: opacity-only fade at 80ms; no transform.
- Verify `TooltipService` single-instance: rapid hover across 5 triggers produces exactly one live tooltip at any instant.
- Verify `aria-describedby` on the trigger + matching `id` on the panel.
- Verify `role="tooltip"` on the panel.
- Verify panel has `pointer-events: none` (hovering the panel does NOT count as hovering the trigger).
- Verify contrast AA on `surface-elevated` bg.
- Verify `followCursor` input is accepted without erroring (v1 no-op; v1.1 implements).
- Verify touch long-press shows tooltip; tap-outside dismisses.

## What success looks like

- Designer hovers an icon-only `<afi-button variant="ghost" iconStart="trash" [afiTooltip]="'Eliminar'">` → after 500ms, tooltip fades + slides in from below the button saying "Eliminar". Mouse leaves → tooltip fades out.
- Keyboard user Tabs to the same button → tooltip appears immediately (no delay). Tab to next element → dismisses.
- Collapsed `<afi-sidebar>` + NavItem: hovering an icon-only NavItem shows its label via Tooltip. Expanded sidebar: Tooltip suppressed (label is visible).
- Screen reader: the icon-button announces "Eliminar, botón" (from `aria-label`) + "Eliminar" (from `aria-describedby` → tooltip content). Not double-announced because tooltip is described, not labeled.
- Reduced motion: tooltip pops in at 80ms opacity; no slide.
- Mobile: long-press the icon → tooltip appears. Tap elsewhere → dismisses. Tap the icon normally → fires the button's `clicked` without showing the tooltip.
- Rapid hover across 5 icons: exactly one tooltip visible at any moment (TooltipService serializes).

## If stuck

- **CDK Overlay + positioning:** `OverlayPositionBuilder.flexibleConnectedTo(triggerEl).withPositions([...])`. Don't compute positions manually.
- **Directive + component sharing logic:** extract the panel-attach / detach logic into `TooltipService` or a shared base class. Both directive and component consume it.
- **Delay timers:** use `setTimeout`; clear on mouseleave-before-show or mouseenter-during-hide. Test rapid mouse movement to ensure no leaks.
- **Portal the panel into Overlay container:** use `TemplatePortal` for the component form (consuming the `[afiTooltipPanel]` `<ng-template>`); use `ComponentPortal` for the directive form (stamping out `TooltipPanelComponent` with the text as an input).
- **Don't use native `title` attribute.** Browser-native title is inaccessible on touch, unfocusable, and ignores our styling. Always our primitive.
- **Don't animate `transform` on the Overlay container** — that moves the tooltip relative to its anchor. Animate on the panel inside the Overlay.
- **Touch detection:** `@angular/cdk/platform` → `Platform.IOS || Platform.ANDROID`, OR the CSS media query `(hover: none) and (pointer: coarse)`. Don't sniff user agent.
- **`followCursor` is reserved for v1.1** — accept the input, ignore it. When v1.1 implements, consumers don't change their API.
