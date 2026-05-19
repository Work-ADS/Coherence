# Build — Coherence StatusChip primitive (`libs/ui/status-chip/`)

**Source:** `docs/strategy/plan.md`
**Surface:** a small pill that surfaces a resource's state (Pendiente, Aprobada, Rechazada, etc.). Sibling of `<afi-badge>` — semantically distinct: Badge is "count or intent"; StatusChip is "state of a business resource."
**Prereqs:** scaffolding + tokens (status semantic bucket).

## Scope

One primitive: `<afi-status-chip>`. Signal input `estado`, maps to token + localized label, renders a pill.

**Not in scope:** icons beyond a small leading dot. Interactive chips (click-to-filter) — future primitive `<afi-filter-chip>`.

## Required reads

1. `docs/rules/clean-code.md`
2. `docs/rules/accessibility.md` — live-region rules (chip is not live by default; consumer opts in)
3. `docs/rules/component-skill.md`
4. `docs/rules/copy-skill.md` — RAE Spanish; state labels are glossary-controlled
5. `docs/rules/token-skill.md` — `status-*` semantic bucket (draft / pending / approved / rejected / executed / cancelled)
6. `docs/strategy/plan.md` — estado pattern lock (page-scoped, not global)
7. `docs/build-prompts/coherence-tokens.md` — status tokens added here

## When to use

- Beside a resource title to show its current state: propuesta, informe, tarea, orden, cliente status.
- In a table cell as a row's state column.
- Inside a `<afi-page-header>` via its `estado` input.

## When NOT to use

- Generic labels or tags → use `<afi-badge>` with an `intent`.
- Progress steps → use a future `<afi-stepper>`.
- Toggle state ("on/off") → that's `<afi-switch>`, not a chip.
- Notification counts → `<afi-badge>`.

## API

| Input | Type | Default | Notes |
|---|---|---|---|
| `estado` | `Estado` | *(required)* | See `Estado` union below. Token-mapped. |
| `size` | `'sm' \| 'md'` | `'md'` | `sm` = 20px; `md` = 24px |
| `variant` | `'solid' \| 'subtle'` | `'subtle'` | `subtle` = tinted background + colored text (default); `solid` = saturated background + white text |
| `showDot` | `boolean` | `true` | Leading 6px dot in `status-{estado}-dot` color |
| `ariaLabel` | `string \| null` | `null` | Overrides the auto-generated label (rarely needed) |

**`Estado` union** (matches the status token bucket — keep 1:1):

```ts
export type Estado =
  | 'borrador'
  | 'pendiente'
  | 'aprobada'
  | 'rechazada'
  | 'ejecutada'
  | 'cancelada'
  | 'en-revision'
  | 'archivada';
```

**Outputs:** none. This is a display-only primitive.

## Token mapping

Each estado maps to three tokens (bg, fg, dot). Defined in `libs/tokens/semantic/status.json`:

```
status-draft-*       → neutral (grises)
status-pending-*     → amber (atención)
status-approved-*    → green (positivo)
status-rejected-*    → red (alerta)
status-executed-*    → action (acento de marca)
status-cancelled-*   → neutral-muted (desactivado)
status-in-review-*   → blue (informativo, 200° scale)
status-archived-*    → neutral-muted
```

See `coherence-tokens.md` for the token definitions.

**Subtle variant** (default):
- bg: `var(--status-{estado}-bg)` (light tint)
- fg: `var(--status-{estado}-fg)` (darker for contrast)
- dot: `var(--status-{estado}-dot)` (saturated)

**Solid variant:**
- bg: `var(--status-{estado}-dot)` (saturated)
- fg: white (or neutral-50 for archived/cancelled — keeps AA contrast)

## Localized labels (hardcoded, RAE)

```ts
export const estadoLabels: Record<Estado, string> = {
  'borrador':    'Borrador',
  'pendiente':   'Pendiente',
  'aprobada':    'Aprobada',
  'rechazada':   'Rechazada',
  'ejecutada':   'Ejecutada',
  'cancelada':   'Cancelada',
  'en-revision': 'En revisión',
  'archivada':   'Archivada',
};
```

Label grammatical gender defaults to feminine (matches `propuesta`, the most common consumer). For masculine resources (`informe`, `cliente`), consumers pass `ariaLabel` to override. Visible label stays as defined; the convention is to place the chip next to the resource title so the context disambiguates visually.

## Template

Single `<span>` with a conditional dot and text:

```html
<span
  [class]="classes()"
  [attr.data-estado]="estado()"
  [attr.aria-label]="computedAriaLabel()"
  role="status"
>
  @if (showDot()) {
    <span class="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
          [style.background-color]="'var(--status-' + estado() + '-dot)'"
          aria-hidden="true"></span>
  }
  <span>{{ label() }}</span>
</span>
```

- `role="status"` — screen reader treats it as a status label (not live by default; `aria-live` is NOT on this element).
- `data-estado` — machine-readable for tests and consumer styling hooks.

## Variants file

`libs/ui/status-chip/status-chip.variants.ts`:

```ts
export const baseClasses =
  'inline-flex items-center rounded-full font-medium ' +
  'transition-colors duration-fast ease-out';

export const sizeClasses = {
  sm: 'h-5 px-2 text-body-sm',    // 20px
  md: 'h-6 px-2.5 text-body-sm',  // 24px
} as const;

// Subtle variant uses CSS vars; solid overrides
export const variantClasses = {
  subtle: (estado: Estado) =>
    `bg-[var(--status-${estado}-bg)] text-[var(--status-${estado}-fg)]`,
  solid: (estado: Estado) =>
    `bg-[var(--status-${estado}-dot)] text-white`,
} as const;
```

(Arbitrary-value Tailwind is acceptable for CSS-var interpolation; confirmed in `clean-code.md` token-escape clause.)

## File structure

```
libs/ui/status-chip/
├── status-chip.component.ts
├── status-chip.variants.ts
├── status-chip.labels.ts          # Estado union + estadoLabels map
├── status-chip.component.spec.ts
└── index.ts                       # exports component + Estado type + estadoLabels
```

## Accessibility

- `role="status"` on the wrapping span.
- Default `aria-label` = the localized label (same as visible text; redundant for SR but makes the chip announceable without relying on the dot).
- `ariaLabel` input overrides default — used when visible label needs to differ from SR label (e.g., gender agreement: visible `Aprobada`, SR `Informe aprobado`).
- Dot is `aria-hidden="true"` — color is not the information; the label carries meaning (color + text + shape).
- Not `aria-live` by default — consumer opts in by wrapping in an `aria-live="polite"` region when state changes mid-session (e.g., on AJAX update).
- Contrast: every `status-*-fg` on `status-*-bg` pair must pass WCAG AA (check in token pre-flight).

## Copy (hardcoded)

All eight estado labels above. Every label is RAE-verified and gender-consistent with the dominant consumer noun (propuesta, orden, tarea, solicitud — all feminine). Override via `ariaLabel` for masculine nouns.

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `status-chip`.

Status-chip-specific additions:
- Verify all 8 estado values render with their correct tokens (`data-estado` attribute matches).
- Verify subtle + solid variants apply correct bg/fg pairs.
- Verify AA contrast for every estado × variant combination (use axe).
- Verify `aria-label` auto-generated for default case; overridable via input.
- Verify `role="status"` on the root.
- Verify dot is `aria-hidden` and purely decorative.
- Verify the `Estado` union in code matches the token bucket 1:1 (dev-mode warning if a new estado is added to one but not the other).

## What success looks like

- `<afi-status-chip estado="pendiente" />` → subtle amber pill, text `Pendiente`, dot, SR announces "Pendiente".
- `<afi-status-chip estado="aprobada" variant="solid" />` → saturated green pill, white text.
- Inside `<afi-page-header [estado]="'pendiente'">` the chip sits inline after the title.
- In a table column: `<afi-status-chip [estado]="row.estado" size="sm" />` — all 8 estados render compactly without row-height drift.

## If stuck

- **Tailwind arbitrary values + CSS vars:** `bg-[var(--status-pending-bg)]` works out of the box; no special config needed. JIT compiles it.
- **New estado needed:** add to `Estado` union + `estadoLabels` + token bucket — all three must stay in sync. Don't ship a half-defined state.
- **Gender agreement edge cases:** instead of inventing masculine duplicates, use `ariaLabel` at the consumer site. Keep the primitive simple.
- **Live updates:** this primitive does NOT own live-region behavior. Consumer wraps in `<div aria-live="polite"><afi-status-chip … /></div>` when state changes dynamically.
