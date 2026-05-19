# Build — Coherence Modal primitive (`libs/ui/modal/`)

**Source:** `docs/strategy/plan.md`
**Surface:** blocking overlay dialog. Distinct from Drawer (which is non-blocking, DS-specific).
**Prereqs:** scaffolding + tokens + Button + Card (Modal reuses Card's slot + variant conventions).

## Scope

One primitive, `<afi-modal>`, for blocking user flow until explicit dismissal.

## Required reads

1. `docs/rules/clean-code.md`
2. `docs/rules/accessibility.md` — Modal section (FocusTrap, dialog role, aria-modal)
3. `docs/rules/component-skill.md`
4. `docs/rules/token-skill.md` — Surface + border tokens
5. `docs/strategy/plan.md` — motion rules (enter 200-300ms, exit 150-200ms, container-first)
6. `docs/build-prompts/coherence-card.md` — header/body/footer slot convention reused here

## When to use

- Critical confirmation ("Eliminar 12 reglas. No se puede deshacer.")
- Complex form that needs user's full attention (multi-field + validation)
- Terms-of-service / consent interstitial
- Anything where letting the user continue interacting with the page behind would be harmful or confusing

## When NOT to use

- Row detail or secondary context → `<afi-drawer>` (page stays interactive)
- Transient notification → `<afi-toast>` (future primitive; backlog)
- Non-blocking guidance → inline hint on the triggering element

## Composition patterns

- **Destructive confirmation:** Modal with `size="sm"`, body = consequence text, footer = Cancel (secondary) + Delete (danger). Focus lands on Cancel by default (safer).
- **Form in modal:** `size="md"`, body = `<afi-input>` fields, footer = Cancel + primary Save. Enter in a field submits.
- **Wizard step:** `size="lg"`, body changes per step, footer has Back + Next.

## API

| Input | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | Two-way via `openChange` — consumer controls the modal's presence |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | sm = 400px, md = 560px, lg = 720px (max-width; responsive-shrinks below breakpoint) |
| `title` | `string \| null` | `null` | Renders in header; wired to `aria-labelledby` |
| `description` | `string \| null` | `null` | Renders below title; wired to `aria-describedby` |
| `closeOnEsc` | `boolean` | `true` | |
| `closeOnBackdrop` | `boolean` | `false` | Default false — Modal is blocking; explicit close required |
| `ariaLabel` | `string \| null` | `null` | Only when `title` is absent (rare — custom header via slot) |

**Outputs:**

```ts
openChange = output<boolean>(); // fires on every open/close transition
closed     = output<'esc' | 'backdrop' | 'button'>(); // why it closed
```

**Slots:**

- `[slot=header]` — override the default title/description render
- default slot — body
- `[slot=footer]` — actions

## Key behavior

1. Render via CDK Overlay + `PortalModule`. Body-level portal, not in-place.
2. Backdrop = `bg-black/40` (use Tailwind opacity token).
3. Enter animation: backdrop fade (200ms ease-out) + panel slide-up-fade (300ms ease-out). Container-first — panel moves as a unit.
4. Exit animation: backdrop fade + panel fade-down (200ms ease-in). Asymmetric per motion discipline.
5. **Focus trap** via CDK `FocusTrap`. Focus lands on first interactive element on open (configurable via `focusOn` slot attribute in future; v1 uses auto-detect).
6. **Close button** always rendered in top-right of panel, even with custom header slot. aria-label = `Cerrar`.
7. Esc key closes if `closeOnEsc=true`.
8. Background click closes ONLY if `closeOnBackdrop=true` (default false).
9. Focus returns to the trigger element on close.
10. `prefers-reduced-motion`: animation drops to simple fade (80ms).
11. Body scroll locked while open (CDK Overlay handles this; verify).

## Accessibility

Per `accessibility.md` Modal checklist — fully applies. Primitive-specific:

- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` (points to title) or `aria-label`.
- Close button always keyboard-reachable, even when focus starts elsewhere.
- Tab cycling stays within the modal until close.
- Backdrop click behavior is opt-in for a reason — defaulting it on breaks critical-confirmation flows.

## File structure

```
libs/ui/modal/
├── modal.component.ts
├── modal.variants.ts
├── modal.component.spec.ts
└── index.ts
```

## Copy (hardcoded)

- Close button label: `Cerrar` (RAE, formal register)
- Nothing else hardcoded; consumer owns title, description, body, footer text

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `modal`.

Modal-specific additions:
- Verify focus trap active (Tab cycles inside modal; Shift+Tab at first element wraps to last).
- Verify focus returns to trigger on close.
- Verify `closed` output emits the correct reason (`'esc' | 'backdrop' | 'button'`).
- Verify backdrop doesn't close by default.
- Verify body scroll locked while open.

## What success looks like

- `<afi-modal [(open)]="showConfirm" title="Eliminar 12 reglas" description="No se puede deshacer.">` renders a 560px modal with focus trapped.
- Cancel button in footer → Esc also closes → `closed` emits `'esc'`.
- Primary danger button → explicit handler.
- Screen reader announces "Dialog, Eliminar 12 reglas, No se puede deshacer".

## If stuck

- CDK Overlay + Portal + FocusTrap + A11yModule — all four are needed. Check the CDK a11y docs if focus behavior is off.
- Animation: use `@angular/animations` + the enter/exit easing tokens from `libs/tokens/`. Don't reach for Motion One unless CSS + Angular animations can't deliver.
- Body scroll lock: CDK Overlay with `scrollStrategy: this.overlay.scrollStrategies.block()`.
