# Build — Coherence Menu + MenuItem primitives (`libs/ui/menu/`)

**Source:** `docs/strategy/plan.md` (LOCKED 2026-04-17-rev3)
**Surface:** contextual action list triggered by a button — typically `⋮`. Calibration: Granola's folder-context menu (Create folder / Add to favorites / Rename / Sharing settings / Delete folder). CDK Overlay-based. Sibling to `<afi-modal>` and `<afi-drawer>` in the overlay family; distinct from `<afi-select>` which is a form control.
**Prereqs:** scaffolding + tokens + Button (triggers) + Modal or Drawer already shipped (CDK Overlay infrastructure reused).

## Scope

Two primitives in one prompt — they co-design and ship together.

- `<afi-menu>` — the overlay shell. Anchored to a trigger element via CDK Overlay; positions itself; manages open state, focus trap, dismiss behavior.
- `<afi-menu-item>` — a single action row inside the menu. Icon + label + optional shortcut + optional `danger` variant.

Plus one trivial helper:
- `<afi-menu-divider>` — a hairline between grouped items (e.g., before a destructive Delete).

**Not in scope:** submenus (cascading menus) — park until a real consumer needs it. Checkbox / radio items — those are form-control territory; compose inside a Drawer or Card if that pattern surfaces. Keyboard-shortcut *registration* — the `shortcut` input is display-only; actual shortcut binding is a product concern.

## Required reads

1. `docs/rules/clean-code.md`
2. `docs/rules/accessibility.md` — Menu + Menubar ARIA patterns (WAI-ARIA Authoring Practices)
3. `docs/rules/component-skill.md` — CVA variant pattern + §13 integration sanity
4. `docs/rules/copy-skill.md`
5. `docs/rules/token-skill.md`
6. `docs/build-prompts/coherence-modal.md` — CDK Overlay + FocusTrap pattern, reused here
7. `docs/build-prompts/coherence-button.md` — trigger button variants (`ghost` + icon-only is the default trigger)

## When to use

- **Row-level contextual actions** — `⋮` on a nav-section, table row, card (Granola pattern)
- **Per-object operations** — Delete / Rename / Duplicate / Share / Export
- **Overflow menus on toolbars** when actions don't fit inline
- **Workspace / brand pickers** — combine Menu with a trigger chip showing current selection

## When NOT to use

- **Form-control selection** — that's `<afi-select>`; Menu is actions, not values
- **Navigation (routes)** — `<afi-nav-item>` / `<afi-sidebar>`
- **Modal dialogs with forms** — `<afi-modal>`; Menu is action triggers, not input surfaces
- **Temporary notifications** — toast (backlog)
- **Context menus on right-click** — browser / OS concern; if you need it, build on top of Menu but don't suppress native

## Composition patterns

- **Row menu:** Table row hover reveals `⋮` Button → clicking opens Menu with row-specific actions.
- **Nav-section menu:** `<afi-nav-section>` shows `⋮` on hover → Menu with Create folder / Rename / Delete (exact Granola pattern).
- **Toolbar overflow:** inline actions until the toolbar runs out of room; remainder collapse into a `⋮` Menu.
- **Workspace picker:** trigger is a chip `[Richard HQ ▾]`; Menu shows workspaces + "New workspace" at the bottom.

## `<afi-menu>` API

| Input | Type | Default | Notes |
|---|---|---|---|
| `triggerRef` | `ElementRef \| null` | `null` | Anchor element for CDK Overlay. Required unless `open` is controlled externally and the consumer positions the menu themselves. |
| `open` | `boolean` | `false` | Two-way via `openChange`. Controlled pattern is preferred — consumer owns `open` state. |
| `placement` | `MenuPlacement` | `'bottom-start'` | `bottom-start \| bottom-end \| top-start \| top-end \| right-start \| left-start` |
| `offset` | `number` | `4` | px gap between trigger and menu edge |
| `minWidth` | `string` | `'12rem'` | CSS value; menu auto-grows to longest item |
| `ariaLabel` | `string` | `'Menú contextual'` | Root aria-label (RAE default) |

**Outputs:**

```ts
openChange = output<boolean>();  // fires on every open/close transition
dismissed  = output<'escape' | 'click-outside' | 'item-select'>();
```

**Slots:**
- default slot — `<afi-menu-item>` and `<afi-menu-divider>` children.

## `<afi-menu-item>` API

| Input | Type | Default | Notes |
|---|---|---|---|
| `iconStart` | `string \| null` | `null` | Lucide icon name; 16px rendered |
| `label` | `string` | *(required)* | Item text |
| `shortcut` | `string \| null` | `null` | Display-only hint, e.g. `'⌘ K'`, `'Supr'` — right-aligned, monospace |
| `variant` | `'default' \| 'danger'` | `'default'` | `danger` → `text-system-error` + `hover:bg-system-error-50` |
| `disabled` | `boolean` | `false` | Non-focusable, no click emission |
| `ariaLabel` | `string \| null` | `null` | Overrides the label for SR when needed (e.g., label is an icon-only action) |

**Outputs:**

```ts
clicked = output<{ event: MouseEvent | KeyboardEvent }>();
```

## `<afi-menu-divider>` API

No inputs. Renders a 1px `border-border-hairline` separator with `space-xs` vertical margin. `role="separator"`.

## Behavior

### Menu

1. **Open:** controlled via `open` signal input. Consumer toggles → CDK Overlay attaches → FocusTrap activates → first enabled `<afi-menu-item>` receives focus.
2. **Close:** `openChange.emit(false)` on any of: `Escape` key · click outside · item `clicked` (auto-close unless the item sets `[preventClose]="true"` — v2 feature, out of scope here) · trigger button clicked again.
3. **Position:** CDK Overlay positioning strategy `flexibleConnectedTo(triggerRef)` with fallbacks if there's not enough room (`bottom-start` → falls back to `top-start` → `bottom-end`).
4. **Animation:** Tier 1 CSS. Enter: `opacity` 0→1 + `transform: translateY(-4px)` → `translateY(0)`, `duration-fast` (150ms), `easing-enter`. Exit: reverse, `duration-fast`, `easing-exit`.
5. **Reduced motion:** collapse enter/exit to instant; only `opacity` transitions at 0–80ms.

### MenuItem

1. **Click / Enter / Space:** emits `clicked`; parent Menu auto-closes.
2. **Hover:** `bg-surface-muted` tint.
3. **Focus:** `focus-visible:ring-border-focus` — never plain `focus:` alone.
4. **Disabled:** opacity 50, no pointer events, skipped by keyboard navigation.
5. **Danger variant:** `text-system-error` + icon inherits color; on hover `bg-system-error-50`; focus ring uses the same `border-focus` token (not system-error — keep focus ring brand-consistent).
6. **Hover micro-animation (LOCKED 2026-04-17-rev5).** On hover/focus-visible, the leading icon shifts right by 2px (`transform: translateX(2px)`). Subtle "lean-in" gesture — signals the item is alive without being showy. Transition: `transform 120ms var(--easing-enter)`, paired with the `bg` color transition on the row. **Reduced motion:** icon does NOT translate (`@media (prefers-reduced-motion: reduce) { transform: none; }`); bg color still transitions instantly to maintain state communication. Calibration: Radix Files + Animate UI hover feel, adjusted quiet.

### Keyboard (matches ARIA Authoring Practices menu pattern)

| Key | Action |
|---|---|
| `Arrow Down` | Next enabled item (wraps at end) |
| `Arrow Up` | Previous enabled item (wraps at start) |
| `Home` | First item |
| `End` | Last item |
| `Enter` / `Space` | Activate focused item |
| `Escape` | Close menu, return focus to trigger |
| `Tab` | Close menu, let Tab flow naturally (unlike Modal, Menu does not trap Tab — Tab dismisses) |

## File structure

```
libs/ui/menu/
├── menu.component.ts              # <afi-menu> — overlay shell
├── menu-item.component.ts         # <afi-menu-item>
├── menu-divider.component.ts      # <afi-menu-divider>
├── menu.variants.ts               # item variant class maps
├── menu.types.ts                  # MenuPlacement type
├── menu.component.spec.ts
├── menu-item.component.spec.ts
└── index.ts                        # barrel: Menu, MenuItem, MenuDivider + types
```

## Accessibility

- **Root:** `role="menu"` + `aria-orientation="vertical"` + `aria-label` (from input or default `'Menú contextual'`).
- **Item:** `role="menuitem"` + `aria-disabled` when disabled. Danger items get the same role (color is not the semantic — label is).
- **Divider:** `role="separator"`, no focus, no interaction.
- **Trigger (consumer responsibility, documented here for the pattern):** `aria-haspopup="menu"` + `aria-expanded` bound to Menu's `open` state.
- **FocusTrap** while open; `Escape` + `Tab` both close and restore focus to trigger.
- **Click outside** dismisses via CDK Overlay's `backdropClick` (transparent backdrop — no scrim for menus, unlike modals).
- **Reduced motion:** enter/exit animations collapse to instant.
- **Contrast:** every item × state (default/hover/focus/disabled/danger-hover) passes WCAG AA. Danger items on hover — verify the `system-error-50` bg + `system-error-600` text meets AA.

## Copy (hardcoded, RAE, formal `usted`)

- Default Menu aria-label: `Menú contextual`
- Divider: no copy (role alone suffices)
- Common item labels (glossary-controlled — product consumers pull from here for consistency across AFI):
  - `Crear carpeta`
  - `Añadir a favoritos`
  - `Quitar de favoritos`
  - `Renombrar`
  - `Duplicar`
  - `Compartir`
  - `Ajustes de uso compartido`
  - `Exportar`
  - `Mover a…`
  - `Archivar`
  - `Eliminar` — danger variant default label

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `menu` (with sub-runs for `menu-item` and `menu-divider`).

Menu-specific additions:
- Verify CDK Overlay positioning: open at each of the 6 placements; verify fallback kicks in when trigger is near viewport edge.
- Verify FocusTrap: Tab inside menu stays inside (or dismisses per keyboard spec); first item focused on open; trigger focused on close.
- Verify Escape / click-outside / item-select all dismiss + emit `dismissed` with correct reason.
- Verify keyboard map (Arrow Up/Down wraps, Home/End, Enter/Space).
- Verify danger variant contrast (axe on hover state).
- Verify reduced-motion: enter/exit collapse to instant.
- Verify item `clicked` emits before Menu close (order matters — consumer handler must fire before overlay detaches).
- Verify every item is keyboard-operable; disabled items skipped.

## What success looks like

- Granola-calibrated: right-click (or `⋮` click) on a nav-section → menu appears below-start with `12rem` min-width, items render with icon + label aligned, Delete at bottom separated by a divider and colored red.
- Keyboard-only user: trigger Button → Enter → menu opens, focus on first item → Arrow Down to Delete → Enter → `clicked` emits with `event.type === 'keyboard'` (consumer decides) → menu closes → focus returns to trigger Button.
- Screen reader: VoiceOver announces "Menú contextual" → navigates items with "menuitem" role + label + optionally "atajo ⌘ K" when shortcut set.
- Reduced motion: menu appears / disappears instantly; no translate-y animation.
- AWM row hover: `⋮` appears → click → Menu with 5 actions + divider + Eliminar (red). Calibration matches Granola's folder menu 1:1.

## If stuck

- **Overlay positioning:** CDK's `OverlayPositionBuilder.flexibleConnectedTo()` with `withPositions([...])` array. Don't roll your own math.
- **FocusKeyManager for arrow nav:** use `@angular/cdk/a11y` `FocusKeyManager` on a QueryList of MenuItem components. Same pattern as Tabs.
- **Trigger integration:** consumer pattern is `#trigger` template ref + `(click)="menu.open = !menu.open"` + `<afi-menu [triggerRef]="trigger" [(open)]="menuOpen">`. Document this in the showcase page.
- **Auto-close on item select:** MenuItem emits `clicked`; Menu listens via `contentChildren` subscription → emits `openChange(false)`. Don't use DOM events.
- **Placement fallback:** CDK handles it if you provide multiple positions in `withPositions`. Don't hand-roll viewport detection.
- **Don't reuse Select.** Tempting, because both are "dropdowns." They diverge on semantics (actions vs. values), role (menu vs. listbox), keyboard behavior (Tab dismisses vs. Tab moves focus). Build Menu as its own primitive.
