# Build — Coherence Checkbox primitive (`libs/ui/checkbox/`)

**Source:** `docs/strategy/plan.md`
**Surface:** multi-select + bulk-action affordance. Supports `indeterminate` state for Table parent rows.
**Prereqs:** scaffolding + tokens + Button + Input.

## Scope

One primitive, `<afi-checkbox>`. Pair with an external wrapper for checkbox groups (future `<afi-checkbox-group>` if needed — v1 consumers loop the primitive).

## Required reads

1. `docs/rules/clean-code.md`
2. `docs/rules/accessibility.md` — Checkbox / Switch section
3. `docs/rules/component-skill.md`
4. `docs/rules/token-skill.md` — Control-neutral + System buckets
5. `docs/build-prompts/coherence-button.md` — class-variance pattern
6. `docs/strategy/plan.md` — touch target 44+ (checkbox visual may be smaller but the clickable area is padded to 44)

## When to use

- Multi-select from a set (filters, bulk-select rows, feature tags)
- Binary on/off that participates in a group
- Consent checkboxes (required + labeled + associated with error state)

## When NOT to use

- Single binary setting (feature flag, notification enabled) → `<afi-switch>`
- One-of-many exclusive choice → Radio (future; not in v1) or `<afi-select>`

## Composition patterns

- **Table row selection:** first column is an `<afi-checkbox>`. Header row uses `indeterminate` when some-but-not-all rows are selected.
- **Filter panel:** group of checkboxes, one per facet value; `size="sm"`.
- **Form consent:** required checkbox + error state when submit attempts without check.
- **Bulk action toolbar:** appears when ≥1 checkbox checked; counts selected.

## API

| Input | Type | Default | Notes |
|---|---|---|---|
| `checked` | `boolean` | `false` | Two-way via `checkedChange` |
| `indeterminate` | `boolean` | `false` | When true, visually distinct from checked/unchecked; represents "some children selected" |
| `size` | `'sm' \| 'md'` | `'md'` | sm = 16px box (Table row); md = 20px box (forms) |
| `label` | `string \| null` | `null` | Renders alongside box; required unless `ariaLabel` set |
| `hint` | `string \| null` | `null` | |
| `error` | `string \| null` | `null` | When truthy, border + text use System bucket `error` |
| `disabled` | `boolean` | `false` | |
| `required` | `boolean` | `false` | `aria-required="true"`; visual asterisk on label |
| `ariaLabel` | `string \| null` | `null` | Use when label is visually elsewhere (e.g., Table row with identifier "Fila 5 — Cliente Pérez") |

**Outputs:**

```ts
checkedChange = output<boolean>();
```

## Key behavior

1. Click toggles `checked` (unless `disabled`). `indeterminate` clears on user click — only consumers can set it.
2. Label click toggles via native `<label for>` linkage.
3. Keyboard: Space toggles (native `<input type="checkbox">` handles; don't override).
4. Clickable area padded to 44×44pt minimum via transparent padding around the 16/20px box. Padding is NOT visual — it's just hit-area.
5. `indeterminate` is a DOM property, not an attribute — set via `elementRef.checked.indeterminate = ...` on signal change.

## Accessibility

Per `accessibility.md` Checkbox / Switch section. Primitive-specific:

- Always `<input type="checkbox">`; never `role="checkbox"` on `<div>`.
- `indeterminate` is announced correctly by VoiceOver + NVDA when the property is set (no `aria-checked="mixed"` needed on native input).
- For Table header checkbox: `aria-label="Seleccionar todas las filas"` + state mirrors the indeterminate logic.

## File structure

```
libs/ui/checkbox/
├── checkbox.component.ts
├── checkbox.variants.ts
├── checkbox.component.spec.ts
└── index.ts
```

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `checkbox`.

Checkbox-specific additions:
- Test `indeterminate` visual + SR-announced correctly.
- Test clickable area ≥ 44×44pt regardless of visual box size.
- Test label click toggles (via spec or manual).

## What success looks like

- `<afi-checkbox label="Aceptar los términos" [(checked)]="accepted" [required]="true" />` renders a labeled checkbox with asterisk.
- In a Table header: `<afi-checkbox ariaLabel="Seleccionar todas" [(checked)]="allSelected" [indeterminate]="someSelected" />` shows the half-filled state correctly.
- Click the label text → checkbox toggles.
- Tab → focus ring on the box via `var(--border-focus)`.

## If stuck

- `indeterminate` only works via DOM property set on the native input. Use `viewChild` signal + `effect()` to sync.
- Don't build a custom visual that reimplements the checkbox shape — style the native input's associated label + pseudo-elements (`::before` for the box, `::after` for the check). Tailwind handles most; a tiny SCSS file may be needed for the `::after` check SVG.
- SCSS, if needed: under 20 lines, comment the reason.
