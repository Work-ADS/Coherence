# Build — Coherence Button primitive (`libs/ui/button/`)

**Source:** `docs/plan.md`
**Surface:** first primitive. This is the review checkpoint — the pattern this prompt establishes propagates to the remaining 11 primitives.
**Prereqs:** `coherence-scaffolding.md` + `coherence-tokens.md` completed.

## Scope of this prompt

One component: `<afi-button>`. Single file, variants via signal inputs, tokens only, tests, a11y, Spanish-ready.

**Not in scope:** Button group, split button, icon-only variant (future prompt). Loading/spinner visuals beyond a simple `loading` state (micro-interaction polish is a later iteration).

## Required reads (in order, before writing code)

1. `docs/clean-code.md` — Angular + Tailwind + strict TS + token-only + pre-flight grep
2. `docs/accessibility.md` — Button checklist + focus + 44pt touch target
3. `docs/component-skill.md` — "build once, variants for the rest"; one file per primitive
4. `docs/token-skill.md` — bucket rules (Action, Control-neutral, System, Border)
5. `docs/copy-skill.md` — button labels = infinitive verb (`Guardar`, `Importar`, `Cancelar`) or formal imperative; never `OK`/`Done`
6. `docs/plan.md` — motion discipline (container-first, ease-out enters, 150-200ms for button press/hover), focus ring (2px `action-500`)

## Component API

**File:** `libs/ui/button/button.component.ts`

**Inputs (signal inputs, not decorators):**

| Input | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | `sm` = 32px (desktop-dense opt-out); `md` = 40px; `lg` = 48px (meets WCAG AAA touch target) |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native HTML attr — always explicit |
| `disabled` | `boolean` | `false` | |
| `loading` | `boolean` | `false` | Shows spinner, disables click, announces `aria-busy="true"` |
| `iconStart` | `string \| null` | `null` | Lucide icon name (icon library TBD — use a slot for now: `<ng-content select="[slot=iconStart]">`) |
| `iconEnd` | `string \| null` | `null` | same |
| `fullWidth` | `boolean` | `false` | `w-full` modifier |
| `ariaLabel` | `string \| null` | `null` | Required when icon-only; otherwise visible text IS the label |

**Outputs:**

```ts
clicked = output<{ event: MouseEvent }>();
```

Past tense. Payload is an object to survive future additions.

## Template

Single `<button>` element. No wrapper. Tailwind classes driven by a `computed()` signal that returns the class string based on `variant`, `size`, `disabled`, `loading`, `fullWidth`.

```html
<button
  [type]="type()"
  [class]="classes()"
  [disabled]="disabled() || loading()"
  [attr.aria-busy]="loading() ? 'true' : null"
  [attr.aria-label]="ariaLabel()"
  (click)="onClick($event)"
>
  @if (iconStart()) { <ng-content select="[slot=iconStart]" /> }
  @if (!loading()) {
    <ng-content />
  } @else {
    <span class="inline-block animate-spin" aria-hidden="true">⟳</span>
    <span class="sr-only">Cargando…</span>
  }
  @if (iconEnd()) { <ng-content select="[slot=iconEnd]" /> }
</button>
```

**Note the `sr-only` Spanish text.** `Cargando…` is per `copy-skill.md` glossary. Never `Loading...`.

## Class generation (class-variance-authority pattern, Angular adaptation)

`libs/ui/button/button.variants.ts`:

```ts
export const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-md font-button ' +
  'transition-colors duration-fast ease-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

export const variantClasses = {
  primary:   'bg-action text-white hover:bg-action-600 active:bg-action-700',
  secondary: 'bg-surface-100 text-canvas-fg border border-border-hairline hover:bg-surface-200 active:bg-surface-200',
  ghost:     'bg-transparent text-canvas-fg hover:bg-surface-100 active:bg-surface-200',
  danger:    'bg-system-error text-white hover:bg-system-error-600 active:bg-system-error-700',
} as const;

export const sizeClasses = {
  sm: 'h-8 px-3 text-body-sm',   // 32px — dense desktop opt-out; must pass aria-label caveat
  md: 'h-10 px-4 text-button',   // 40px
  lg: 'h-12 px-5 text-button',   // 48px — WCAG AAA touch target default
} as const;

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;
```

Then in the component:

```ts
readonly classes = computed(() => [
  baseClasses,
  variantClasses[this.variant()],
  sizeClasses[this.size()],
  this.fullWidth() ? 'w-full' : '',
].filter(Boolean).join(' '));
```

## File structure

```
libs/ui/button/
├── button.component.ts       # class + template (inline, ~60 lines)
├── button.variants.ts        # classes map + types
├── button.component.spec.ts  # behavior tests
└── index.ts                  # export ButtonComponent, ButtonVariant, ButtonSize
```

No `.html` file (template inline, under 40 lines). No `.scss` file (all Tailwind).

## Behavior requirements

1. Click emits `clicked` with `{ event }`. Suppress emission when `disabled()` or `loading()` is true.
2. Keyboard Space + Enter activate (native `<button>` handles this — don't override).
3. Focus ring appears on keyboard focus only (`focus-visible`), not pointer focus.
4. `disabled` state: visual 50% opacity, `cursor-not-allowed`, no click emission, tab-focusable remains debatable — lock to **not focusable when disabled** (native behavior); use `aria-disabled` + no `disabled` attribute only if the disabled button must stay focusable per WAI-ARIA guidance. For v1, use the native `disabled` attribute.
5. `loading` state: spinner visible, `aria-busy="true"`, click suppressed, visible text still rendered (accessibility — SR users hear context).
6. `aria-label` required when no text children are projected (icon-only). Runtime assertion: log a dev-mode warning if `iconStart` or `iconEnd` is set AND no text is projected AND `ariaLabel()` is null.

## Accessibility checklist (from `accessibility.md` Button section)

- [ ] `<button type="...">` native, type attribute always set
- [ ] Visible label OR `aria-label` when icon-only
- [ ] `aria-pressed` **not** applied (this is a plain action button; toggle-button is a future variant)
- [ ] `disabled` attribute applied when disabled state is active
- [ ] `aria-busy="true"` when loading
- [ ] Focus ring uses `var(--border-focus)` token (2px, `action-500`)
- [ ] Touch target ≥ 44×44pt at default size (`lg` = 48px; `md` = 40px with documented desktop-dense caveat; `sm` = 32px must accompany a product-level `aria-label` explaining the compact context)
- [ ] Keyboard-operable (inherits from native `<button>`; verify in spec)
- [ ] `prefers-reduced-motion` respected (the only animation here is `transition-colors` — under 200ms — already within the respect-not-disable envelope)

## Tests (`button.component.spec.ts`)

Behavior-only. Use Angular CDK component harnesses when they help. Minimum cases:

1. Renders with default inputs: variant=primary, size=md
2. Applies variant classes for each of primary / secondary / ghost / danger
3. Applies size classes for each of sm / md / lg
4. Emits `clicked` once on user click
5. Does NOT emit `clicked` when disabled
6. Does NOT emit `clicked` when loading
7. Renders projected text content
8. Renders spinner when `loading` is true
9. Applies `aria-busy="true"` when loading
10. Applies `aria-label` attribute when `ariaLabel` input is set
11. Applies `disabled` attribute and `aria-disabled` semantics when `disabled` is true
12. Does NOT show focus ring on pointer click (use `focus-visible` media query simulation)

## Copy

Default project-level labels follow `copy-skill.md`:
- Primary action: infinitive verb — `Guardar`, `Importar`, `Aceptar`
- Cancel / dismiss: `Cancelar`, `Cerrar`
- Destructive: `Eliminar`, `Rechazar`
- Button component itself does not hardcode copy — it accepts projected content. The copy rule applies to **consumers** of the Button. This prompt ensures the one hardcoded SR string (`Cargando…`) is RAE-correct.

## Pre-flight before commit (non-negotiable)

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `button`. Every check must pass.

**Button-specific additions** (on top of the shared pre-flight):

- The one hardcoded SR string is `Cargando…` — verify against `copy-skill.md` (correct accent, correct glossary form).
- If consumer passes only `iconStart` or `iconEnd` with no text child and no `ariaLabel` → dev-mode warning must fire (wire the runtime assertion).
- Size-specific touch-target check: `size="sm"` (32px) is an explicit opt-out; the Button spec documents the desktop-dense-only intended use via a component-level comment referencing `accessibility.md`.

## What success looks like

- `<afi-button>Guardar</afi-button>` renders a 40px primary button in AFI blue with Roboto Serif text.
- `<afi-button variant="secondary" size="lg">Cancelar</afi-button>` renders a 48px secondary button with a hairline border and quiet surface background.
- `<afi-button loading>Importar</afi-button>` renders a spinner, announces `aria-busy`, suppresses clicks.
- Tab to button → focus ring in AFI blue, 2px, offset 2px.
- No hex anywhere in the component code.
- Spec suite passes.

## If stuck

- Signal inputs `input()` + `output()` live in `@angular/core` (Angular 17.1+).
- `computed()` for class strings — pure function of signals.
- Don't reach for `[ngClass]` when a plain `[class]="classes()"` binding suffices.
- `sr-only` Tailwind utility is stock — no extra setup needed.
- Report which step failed with the exact error. Do not improvise values or skip pre-flight.

## What the Coherence DS site demonstrates (post-build, not in this prompt)

The Button page on the DS site shows: all variants × all sizes grid, a playground with live input editing, the four learning modalities (when to use / a11y / play / thought experiment), and a `DownloadMdButton` that hands the reader this prompt + the skills as AI-ready context. That's for a later site prompt — this prompt just ships the primitive.
