# Build — Coherence Input primitive (`libs/ui/input/`)

**Source:** `docs/plan.md`
**Surface:** form input. Covers text / textarea / number / email / password via `type` input.
**Prereqs:** `coherence-scaffolding.md` + `coherence-tokens.md` + `coherence-button.md` (establishes the class-variance pattern this prompt extends).

## Scope

One primitive, `<afi-input>`, with label + hint + error props bundled in (no separate Label primitive in v1 — the Input owns its a11y wiring).

**Not in scope:** search input (future `<afi-search>` if demand emerges), date picker, masked input, file input.

## Required reads (in order)

1. `docs/clean-code.md`
2. `docs/accessibility.md` — Input / Textarea section
3. `docs/component-skill.md`
4. `docs/token-skill.md` — Control-neutral bucket
5. `docs/copy-skill.md` — error message patterns (constraint + recovery)
6. `docs/build-prompts/coherence-button.md` — class-variance pattern to extend
7. `docs/plan.md` — control heights (`sm` 32 / `md` 40 / `lg` 48)

## When to use

- Single-line text (name, email, URL)
- Multi-line text (comments, notes) via `type="textarea"`
- Numeric entry with step/min/max
- Password (masked)

## When NOT to use

- Choosing from a known list → `<afi-select>`
- Binary on/off → `<afi-switch>`
- Multi-select → `<afi-checkbox>` group
- Rich text / markdown → out of scope for v1 (use a plain textarea; rich editor is a consumer-specific build)

## Composition patterns

- **In a form:** Input + Input + Button (submit). Labels own their `aria-describedby` linkage; no external `<label>` wrapper needed.
- **With validation:** consumer sets `error` prop; Input renders error text and sets `aria-invalid="true"` automatically.
- **With hint text:** `hint` prop renders below the input; tied to `aria-describedby` alongside error.
- **In a Table filter row:** `size="sm"` + `iconStart` for filter icon.
- **Disabled chaining:** Input disabled when a prerequisite field is empty — consumer controls via signal.

## API

| Input | Type | Default | Notes |
|---|---|---|---|
| `type` | `'text' \| 'textarea' \| 'number' \| 'email' \| 'password'` | `'text'` | Drives native element + keyboard layout |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Matches Button scale |
| `value` | `string \| number \| null` | `null` | Two-way via `valueChange` output |
| `label` | `string \| null` | `null` | Renders `<label for>`; required unless `ariaLabel` is set |
| `hint` | `string \| null` | `null` | Renders below input; wired into `aria-describedby` |
| `error` | `string \| null` | `null` | When truthy: error text + `aria-invalid="true"` + error-border variant |
| `placeholder` | `string \| null` | `null` | Never the only label — requires `label` or `ariaLabel` |
| `disabled` | `boolean` | `false` | |
| `readonly` | `boolean` | `false` | Distinct from disabled: focusable, announced by SR |
| `required` | `boolean` | `false` | `aria-required="true"` + visual asterisk on label |
| `autocomplete` | `string \| null` | `null` | Always set for personal info (`email`, `name`, `username`, `current-password`, etc.) |
| `iconStart` | `string \| null` | `null` | Slot content; optional visual affordance |
| `ariaLabel` | `string \| null` | `null` | Only when `label` is omitted (rare — filter rows, search bars) |

**Outputs:**

```ts
valueChange = output<string | number | null>();
focused     = output<FocusEvent>();
blurred     = output<FocusEvent>();
```

## Key behavior

1. Label + input linked via `for`/`id`; generate a unique `id` per instance.
2. `aria-describedby` aggregates hint + error IDs; updates reactively when either changes.
3. Error appears **on blur**, not on keystroke — exception: `type="password"` with a strength meter (not v1).
4. `valueChange` emits on `input` for text/number, on `change` for number-with-step (so arrow increments don't spam).
5. `required` renders visible asterisk on the label (system-error color) + `aria-required="true"`.
6. Read-only is visually distinct from disabled (focus-visible ring still appears).

## Accessibility

Per `accessibility.md` Input / Textarea checklist — fully applies. Primitive-specific:

- Label is always present (visible `<label for>`), EXCEPT when `ariaLabel` is provided for icon-only contexts (filter rows). Dev-mode warning if neither is set.
- `autocomplete` values follow the WHATWG spec. Enforce at least one `autocomplete="off"` or meaningful value — don't leave unset.

## File structure

```
libs/ui/input/
├── input.component.ts
├── input.variants.ts      # class map, following Button's pattern
├── input.component.spec.ts
└── index.ts
```

## Copy (hardcoded strings)

None. Consumer provides `label`, `hint`, `error`, `placeholder`. This primitive has no hardcoded Spanish.

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `input`.

Input-specific additions:
- Runtime assertion: dev-mode warning when both `label` and `ariaLabel` are absent.
- Test coverage for every `type` variant's DOM element match (`<input>` for text/number/email/password, `<textarea>` for textarea).
- Error state sets `aria-invalid="true"` and NOT on idle — verify via spec.

## What success looks like

- `<afi-input label="Correo electrónico" type="email" [required]="true" autocomplete="email" />` renders a labeled email input with required marker and aria-required.
- Entering an invalid value + blurring sets `error="Introduzca un correo electrónico válido."` → red border, error text, `aria-invalid="true"`.
- Tab reaches input, label click focuses input, screen reader announces label + hint.
- `size="sm"` in a Table filter row: 32px height, compact font, no visible label if `ariaLabel` is provided.

## If stuck

- Unique IDs: use `inject(IdService)` or a crypto-random suffix. Don't use `Math.random()` (not collision-proof for SSR).
- Two-way binding: emit `valueChange` from `(input)` / `(change)`; consumer binds `[(value)]`.
- `type="textarea"` needs a `<textarea>` element, not `<input type="textarea">`. Conditional template.
- Report the failing variant with the exact error. Do not improvise.
