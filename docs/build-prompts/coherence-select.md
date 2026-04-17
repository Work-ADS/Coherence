# Build — Coherence Select primitive (`libs/ui/select/`)

**Source:** `docs/plan.md`
**Surface:** choose one value from a known list. Native `<select>` OR CDK Listbox combobox — same API surface, `mode` input switches implementation.
**Prereqs:** `coherence-scaffolding.md` + `coherence-tokens.md` + `coherence-button.md` + `coherence-input.md` (establishes form field conventions: label/hint/error props).

## Scope

One primitive, `<afi-select>`, with two rendering modes.

**Not in scope:** multi-select (v1 uses Checkbox group), async-loaded options (consumers pass pre-fetched options), typeahead search inside select (v1.1 candidate — if used, opens the CDK Listbox mode).

## Required reads (in order)

1. `docs/clean-code.md`
2. `docs/accessibility.md` — Select / Combobox section
3. `docs/component-skill.md`
4. `docs/token-skill.md` — Control-neutral bucket
5. `docs/build-prompts/coherence-input.md` — form field conventions (label/hint/error) applied identically
6. `docs/build-prompts/coherence-button.md` — class-variance pattern
7. `docs/plan.md` — CDK Listbox is in the dependency list (Angular CDK a11y module)

## When to use

- **`mode="native"`** (default): 3–15 plain text options, no icons, no descriptions. Mobile-native picker is a feature, not a bug — use it.
- **`mode="custom"`** (CDK Listbox): options need icons, multi-line descriptions, grouping, or count exceeds ~15.

## When NOT to use

- Binary on/off → `<afi-switch>`
- Multi-select → `<afi-checkbox>` group (v1) / `<afi-multiselect>` (future)
- Open-ended text → `<afi-input>`
- Primary navigation → `<afi-sidebar>` / `<afi-tabs>`

## Composition patterns

- **In a form:** same slot as Input — labeled, can error, required support identical.
- **Table column filter:** `size="sm"`, `mode="native"`, no label (uses `ariaLabel`).
- **With Chip:** active filter values rendered as dismissable chips below the select (future pattern — Chip primitive is backlog).
- **With Button:** "Apply" pattern NOT used — filters update on change per DS site rules (no "Aplicar" button, per AWM brief).

## API

Inherits Input's form-field shape; adds option-specific inputs.

| Input | Type | Default | Notes |
|---|---|---|---|
| `mode` | `'native' \| 'custom'` | `'native'` | See "When to use" |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `options` | `Array<SelectOption>` | `[]` | `{ value, label, icon?, description?, disabled?, group? }` |
| `value` | `string \| number \| null` | `null` | Two-way via `valueChange` |
| `label`, `hint`, `error`, `placeholder`, `disabled`, `required`, `ariaLabel` | *(same as Input)* | | |

**Outputs:**

```ts
valueChange = output<string | number | null>();
opened      = output<void>();   // only meaningful in mode="custom"
closed      = output<void>();
```

**Type:**

```ts
export interface SelectOption {
  value: string | number;
  label: string;
  icon?: string;        // Lucide icon name, custom mode only
  description?: string; // Sub-text, custom mode only
  disabled?: boolean;
  group?: string;       // Optgroup heading
}
```

## Key behavior

1. `mode="native"`: render `<select>` with `<option>` / `<optgroup>`. Style via Tailwind + `appearance-none`, custom chevron overlay. Never override native keyboard/arrow behavior.
2. `mode="custom"`: render a CDK Listbox trigger button + popover panel.
   - Arrow keys navigate options
   - Enter selects, Esc closes
   - Typeahead (type-to-jump) — CDK handles this
   - Icons / descriptions render per option
3. `options` with `group` set get rendered inside `<optgroup>` (native) or visual group headers (custom).
4. Disabled option (`disabled: true`) renders with reduced opacity + skipped by keyboard nav.
5. Placeholder renders as a disabled first option in native mode; as muted trigger text in custom mode.

## Accessibility

Per `accessibility.md` Select / Combobox checklist. Primitive-specific:

- `mode="custom"` wires `aria-expanded`, `aria-controls`, `aria-activedescendant` on trigger + panel.
- `role="listbox"` on the panel, `role="option"` on each option.
- Focus returns to trigger on close (Esc or selection).
- Option panel positioned via CDK Overlay — automatic flip on viewport edge.

## File structure

```
libs/ui/select/
├── select.component.ts
├── select.types.ts           # SelectOption interface
├── select.variants.ts
├── select.component.spec.ts
└── index.ts
```

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `select`.

Select-specific additions:
- Test both modes render + behave correctly.
- Test keyboard-only operation in `mode="custom"` — open, arrow down to last, select, verify closed + value updated.
- Test option with `group` renders in correct section.
- Test disabled option cannot be selected via keyboard or click.

## What success looks like

- `<afi-select label="Proveedor" [options]="providers" [(value)]="selected" />` with 5 plain options renders a native select, keyboard-operable via OS picker.
- Switching `mode="custom"` with the same options renders a CDK combobox; no API change for the consumer, just the rendering.
- Table filter: `<afi-select mode="native" size="sm" ariaLabel="Filtrar por estado" [options]="statuses" />` inline, 32px height.

## If stuck

- CDK Overlay positioning: use `FlexibleConnectedPositionStrategy` with a fallback to above/below.
- Native `<select>` styling cross-browser: `appearance-none` + custom chevron is a solved pattern; don't fight it.
- Don't attempt to unify the two modes' internal state — each mode owns its own; the unified thing is the public API.
