# Build — Coherence Switch primitive (`libs/ui/switch/`)

**Source:** `docs/strategy/plan.md`
**Surface:** binary on/off toggle with `role="switch"`. Not a Checkbox alias.
**Prereqs:** scaffolding + tokens + Button + Checkbox (similar a11y wiring pattern).

## Scope

One primitive, `<afi-switch>`, for true on/off state.

## Required reads

1. `docs/rules/clean-code.md`
2. `docs/rules/accessibility.md` — Checkbox / Switch section (scroll to Switch rule)
3. `docs/rules/component-skill.md`
4. `docs/rules/token-skill.md` — Control-neutral + Action buckets
5. `docs/build-prompts/coherence-checkbox.md` — form-field conventions + 44pt hit area pattern

## When to use

- Feature toggle ("Dark mode", "Notifications")
- Enable/disable a setting that changes behavior immediately (not on form submit)
- Consent-to-continue in step-based flows

## When NOT to use

- Multi-select → `<afi-checkbox>`
- Form field that participates in submit → `<afi-checkbox>` (Switch is for immediate-effect state)
- Exclusive choice from > 2 options → `<afi-select>` / Radio (future)

## Composition patterns

- **Settings list:** Switch + inline label + hint describing what it controls.
- **Feature-flag dashboard:** row of Switch + label + status Badge (on/off / rolling-out).
- **Consent-in-flow:** Switch + Button ("Continuar") — submit enabled only when Switch is on.

## API

| Input | Type | Default | Notes |
|---|---|---|---|
| `checked` | `boolean` | `false` | Two-way via `checkedChange` |
| `size` | `'sm' \| 'md'` | `'md'` | sm = 32×18; md = 40×22 |
| `label` | `string \| null` | `null` | |
| `hint` | `string \| null` | `null` | Describes the effect of toggling |
| `disabled` | `boolean` | `false` | |
| `ariaLabel` | `string \| null` | `null` | Only when label rendered elsewhere |

**Outputs:**

```ts
checkedChange = output<boolean>();
```

## Key behavior

1. Click or Space toggles. Arrow keys do NOT toggle (that's Checkbox/Radio territory).
2. Transition between states: 150ms ease-out on the thumb transform (container-first per motion discipline — the thumb slides inside the track, track background color also transitions).
3. `prefers-reduced-motion`: thumb movement stays (state clarity matters); duration drops to 0–80ms.
4. Disabled state 50% opacity; label still SR-announced.

## Accessibility

Per `accessibility.md`. Primitive-specific:

- `role="switch"` (native `<button role="switch">` pattern, NOT `<input type="checkbox">`).
- `aria-checked="true" | "false"` on the button.
- Label wraps or precedes the button with click-to-toggle semantics.

## File structure

```
libs/ui/switch/
├── switch.component.ts
├── switch.variants.ts
├── switch.component.spec.ts
└── index.ts
```

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `switch`.

Switch-specific additions:
- Verify `role="switch"` + `aria-checked` mirror the `checked` signal.
- Thumb animation respects `prefers-reduced-motion`.
- Space toggles; arrow keys don't.

## What success looks like

- `<afi-switch label="Modo oscuro" [(checked)]="darkMode" />` toggles instantly on click; SR announces "Switch, Modo oscuro, on/off".
- `size="sm"` fits in a settings table row without crowding.
- Reduced-motion: thumb still moves (state visible), but duration near-zero.

## If stuck

- Use `<button type="button" role="switch" aria-checked>` not `<input>`. The `<input type="checkbox">` + `role="switch"` overrides work but confuse SRs on some platforms.
- Thumb transition: `transform: translateX(...)`, not `left: ...`. GPU-accelerated, smoother.
- Label-to-button association: wrap both in a `<label>` OR use an explicit `for`/`id` with the button — the first is cleaner.
