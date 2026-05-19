# Build — Coherence Radio + RadioGroup primitives (`libs/ui/radio/`)

**Source:** `docs/strategy/plan.md` (LOCKED 2026-04-17-rev7 — primitive #22)
**Surface:** one-of-N selection form control. Sibling of Checkbox (binary, no bias), Switch (binary with on/off bias), and Select (one-of-N in a dropdown). Radio is for when all options should be visible at once — typically 2–5 options. Calibration: Animate UI base radio with the scale-in dot animation, translated to Tier 1 CSS with the new `easing-spring-soft` token.
**Prereqs:** scaffolding + tokens (now including `easing-spring-soft` motion token) + Button (variant pattern reference) + Checkbox (sibling form control, density-aligned).

## Scope

Two primitives in one prompt — they co-design and ship together:

- `<afi-radio-group>` — group container; manages value + keyboard navigation (arrow keys, Home/End)
- `<afi-radio>` — single radio button row (dot + label)

**Not in scope:**
- Card-sized radios with long-form descriptions — future variant if a consumer surfaces the pattern.
- Radio inside a Menu — use `<afi-menu-item>` with `role="menuitemradio"` — that's a menu concern, not a form concern.
- Uncontrolled radio groups — every group is controlled via `[(value)]`.
- OS-native appearance (`appearance: auto`) — we own the visual; always `appearance: none`.

## Required reads

1. `docs/rules/clean-code.md`
2. `docs/rules/accessibility.md` — radiogroup ARIA pattern + keyboard map
3. `docs/rules/component-skill.md`
4. `docs/rules/copy-skill.md`
5. `docs/rules/token-skill.md` — Motion bucket (`easing-spring-soft` added rev7), Action bucket (brand accent for checked state)
6. `docs/build-prompts/coherence-checkbox.md` — sibling form control; size + density aligned
7. `docs/build-prompts/coherence-button.md` — class-variance-authority pattern

## When to use

- 2–5 mutually exclusive options that should all be visible without interaction.
- Settings panels (`Densidad: Por defecto / Cómoda / Compacta`).
- Onboarding flows with limited, clear choices.
- Inline forms where the decision space is small enough to surface without a dropdown.

## When NOT to use

- **More than ~5 options** → `<afi-select>`. A list of 10 radios is a UX smell.
- **Binary toggle** → `<afi-switch>` (bias toward on/off state) or `<afi-checkbox>` (no bias).
- **Multi-select** → `<afi-checkbox>` group.
- **Within an action menu** → `<afi-menu-item role="menuitemradio">`.
- **Standalone boolean** → `<afi-checkbox>`, not a single radio.

## Composition patterns

### Inside a fieldset (forms)

```html
<fieldset>
  <legend>Densidad</legend>
  <afi-radio-group [(value)]="density" name="density" ariaLabel="Densidad">
    <afi-radio value="default">Por defecto</afi-radio>
    <afi-radio value="comfortable">Cómoda</afi-radio>
    <afi-radio value="compact">Compacta</afi-radio>
  </afi-radio-group>
</fieldset>
```

### Inline settings panel (no `<form>`)

```html
<afi-radio-group [(value)]="exportFormat" ariaLabel="Formato de exportación">
  <afi-radio value="csv">CSV</afi-radio>
  <afi-radio value="pdf">PDF</afi-radio>
  <afi-radio value="xlsx">Excel</afi-radio>
</afi-radio-group>
```

### Inside a Card (group as a choice surface)

```html
<afi-card>
  <h3 class="text-section">Perfil de riesgo</h3>
  <afi-radio-group [(value)]="riskProfile">
    <afi-radio value="conservador">Conservador</afi-radio>
    <afi-radio value="moderado">Moderado</afi-radio>
    <afi-radio value="arriesgado">Arriesgado</afi-radio>
  </afi-radio-group>
</afi-card>
```

## `<afi-radio-group>` API

| Input | Type | Default | Notes |
|---|---|---|---|
| `value` | `T \| null` | `null` | Two-way via `valueChange`. Generic `T` — string by default; typed enum OK. |
| `name` | `string \| null` | `null` | Applied to every child radio's `<input type="radio">` for native form submission. |
| `disabled` | `boolean` | `false` | Disables the whole group; individual radios can also be disabled. |
| `ariaLabel` | `string \| null` | `'Grupo de opciones'` | Applied to the `role="radiogroup"` wrapper. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout + arrow-key axis. `Arrow Down/Up` moves when vertical; `Arrow Right/Left` when horizontal. |

**Outputs:**

```ts
valueChange = output<T>();
```

## `<afi-radio>` API

| Input | Type | Default | Notes |
|---|---|---|---|
| `value` | `T` | *(required)* | The value this radio represents. Must be unique within the group. |
| `disabled` | `boolean` | `false` | Individual disable; also respects group's `disabled`. |
| `labelSrOnly` | `boolean` | `false` | When `true`, the visible label is SR-only (rare — used when the label is conveyed by surrounding context). |

**Outputs:** none. State flows up through the group.

**Default slot:** label text. Plain strings common; rich content allowed but not typical.

## Template (key structure)

`<afi-radio>`:

```html
<label
  class="inline-flex items-center gap-space-3 cursor-pointer select-none"
  [class.opacity-50]="effectiveDisabled()"
  [class.cursor-not-allowed]="effectiveDisabled()">

  <span
    class="afi-radio__dot"
    [attr.data-checked]="isChecked() ? 'true' : null"
    aria-hidden="true">
    <span class="afi-radio__inner"></span>
  </span>

  <input
    type="radio"
    class="sr-only"
    [name]="groupName()"
    [value]="value()"
    [checked]="isChecked()"
    [disabled]="effectiveDisabled()"
    (change)="onSelect()"
    (focus)="onFocus()"
    (blur)="onBlur()" />

  <span [class.sr-only]="labelSrOnly()" class="text-body-md">
    <ng-content />
  </span>
</label>
```

## Styles (Tier 1 CSS, token-only)

```css
.afi-radio__dot {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  border: 2px solid var(--border-hairline);
  background: var(--surface-base);
  transition:
    border-color var(--duration-fast) var(--easing-enter),
    background-color var(--duration-fast) var(--easing-enter);
}

.afi-radio__dot[data-checked="true"] {
  border-color: var(--action-500);
}

.afi-radio__inner {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: var(--action-500);
  transform: scale(0);
  transition: transform var(--duration-fast) var(--easing-spring-soft);
}

.afi-radio__dot[data-checked="true"] .afi-radio__inner {
  transform: scale(1);
}

/* Focus ring via :has() on the label since the native input is sr-only */
label:has(input:focus-visible) .afi-radio__dot {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .afi-radio__dot,
  .afi-radio__inner {
    transition: none;
  }
}
```

**The signature motion:** the inner-dot scale uses the new `easing-spring-soft` token (`cubic-bezier(0.34, 1.56, 0.64, 1)`) — a small overshoot that peaks ~108% and settles to 100%. Reproduces Animate UI's spring feel at Tier 1 CSS, no library.

## Behavior

### RadioGroup

1. **Value flows up:** when a child radio fires `onSelect()`, it calls the parent's `select(value)`; parent emits `valueChange`.
2. **Keyboard navigation** via CDK `FocusKeyManager` over `contentChildren(RadioComponent)`:
   - `Arrow Down` / `Arrow Up` (vertical) or `Arrow Right` / `Arrow Left` (horizontal) → moves focus to next/previous **enabled** radio AND selects it (radio group follows the active-descendant roving-tabindex pattern — movement IS selection).
   - `Home` → first enabled radio; `End` → last.
   - `Space` activates (redundant — movement already selected).
   - `Tab` enters the group (lands on the currently-selected radio); subsequent Tab leaves the group (doesn't traverse individual radios — that's the roving-tabindex behavior).
3. **Disabled group:** all children non-interactive; no keyboard; value change suppressed.
4. **Initial focus target:** the currently-selected radio OR the first enabled radio if none selected.

### Radio

1. **Click/Space:** emits `select` → group emits `valueChange`. Ignored when disabled.
2. **`tabindex`:** `0` when this radio is the group's active descendant; `-1` otherwise. Managed by `FocusKeyManager`.
3. **Focus:** shows focus ring on `:focus-visible` only (not on mouse click).
4. **Disabled:** opacity 50, `cursor-not-allowed`, keyboard skips over it.

## File structure

```
libs/ui/src/radio-group/
├── radio-group.component.ts         # class only — templateUrl + (optional) styleUrls
├── radio-group.component.html       # template (always external)
├── radio.component.ts               # class only — templateUrl + (optional) styleUrls
├── radio.component.html             # template (always external)
├── radio.variants.ts                # size + orientation class maps (minimal)
├── radio-group.component.spec.ts
├── radio.component.spec.ts
└── index.ts                          # exports RadioGroupComponent, RadioComponent
```

Single folder, two components, 3-file shape each. `.component.scss` added only if styles can't be expressed via Tailwind + token utilities. See `docs/rules/component-skill.md` § 2.

## Accessibility

- **Group:** `role="radiogroup"` + `aria-label` (or `aria-labelledby` if a `<legend>` / heading labels it — consumer wires this).
- **Radio:** native `<input type="radio">` carries `role="radio"` implicitly; visible dot is `aria-hidden="true"` (color alone isn't the info — native input is).
- **Roving tabindex:** only one radio per group is in the tab order at a time (the selected one, or the first if none selected). Standard WAI-ARIA radiogroup pattern.
- **Label association:** implicit via `<label>` wrapping the input — simpler than `for=/id=`, keeps structure clean.
- **Fieldset + legend:** consumer responsibility, NOT the primitive. The primitive accepts a `ariaLabel` input as the simpler alternative. When a `<legend>` is present, consumer sets `ariaLabel` to `null` to avoid double-labeling.
- **Touch targets:** each radio row ≥ 44×44pt (label extends the clickable area to the full row, including the 20px dot + gap + text).
- **Reduced motion:** transform transitions collapse; color change stays.
- **Contrast:** `border-action-500` on `surface-base` passes WCAG AA for non-text UI (3:1). Dot `action-500` on `surface-base` verified.

## Copy (hardcoded, RAE, formal `usted`)

- Default group aria-label (when input not set): `Grupo de opciones`
- No user-visible strings originate in this primitive — labels come from consumer projection.
- Common option patterns (reference; consumer provides):
  - `Por defecto` · `Cómoda` · `Compacta` (density)
  - `Conservador` · `Moderado` · `Arriesgado` (risk profile)
  - `Sí` · `No` · `No procede` (yes/no with "not applicable")

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `radio-group` AND `<primitive>` = `radio` (two sub-runs).

Radio-specific additions:
- Verify keyboard: Arrow Down/Up selects + focuses next/prev; Home/End jump; Tab enters the group but doesn't traverse individual radios.
- Verify orientation swap: horizontal group uses Arrow Right/Left.
- Verify selecting one radio unselects others (native behavior via shared `name` — confirm).
- Verify disabled radios are skipped by keyboard navigation.
- Verify group `disabled` blocks all selections.
- Verify focus ring visible on keyboard-only (`:focus-visible`), not mouse click.
- Verify dot scale animation uses `easing-spring-soft` (not `easing-enter`) — inspect computed transition.
- Verify reduced motion: transform transitions gone; color change remains.
- Verify AA contrast on dot + border in both states.

## What success looks like

- `<afi-radio-group [(value)]="density">` with three options renders vertically with 12px gap between rows. Selecting "Comfortable" via click: the previous dot shrinks to 0, the new dot scales from 0 to 1 with a tiny overshoot that feels alive without being showy. 150ms total.
- Keyboard user tabs into the group → lands on currently-selected radio → arrow-down moves AND selects next → no extra Space/Enter needed.
- Screen reader: VoiceOver announces "Densidad, grupo de opciones, Por defecto, 1 de 3, seleccionado" when focus enters; "Cómoda, 2 de 3, seleccionado" after arrow-down.
- Reduced motion: dot appears/disappears instantly; border color still transitions.
- Disabled radio is visually muted (opacity 50) and skipped by arrow keys.

## If stuck

- **CDK FocusKeyManager pattern:** same as Tabs. `contentChildren(RadioComponent)` + `FocusKeyManager` with `withWrap()` + `withHorizontalOrientation()` or `withVerticalOrientation()` based on `orientation` input.
- **Native input sr-only + `:has(input:focus-visible)`:** modern CSS, works in every browser we support. Fallback via `:focus-within` if targeting older browsers (not a v1 concern).
- **Roving tabindex:** `FocusKeyManager` manages `tabindex` for you. Ensure the component exposes `_getTabIndex()` or uses `@HostBinding('attr.tabindex')` from the manager's `activeItem`.
- **Generic type `<T>`:** keep value typed; consumer can use string unions or enums. Don't widen to `unknown`.
- **Don't use `appearance: auto` on the native input:** always `appearance: none` + custom visual. The native `<input>` is sr-only — its visual doesn't render.
- **Don't build card-sized radios** in this primitive. If consumers need them, they wrap `<afi-radio>` inside `<afi-card>` or wait for the card-radio variant (future).
