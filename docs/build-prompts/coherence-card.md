# Build — Coherence Card primitive (`libs/ui/card/`)

**Source:** `docs/plan.md`
**Surface:** container for grouping related content. Low-opinion; consumers compose.
**Prereqs:** scaffolding + tokens + Button.

## Scope

One primitive, `<afi-card>`, with three slots (header, body, footer) via content projection.

## Required reads

1. `docs/clean-code.md`
2. `docs/accessibility.md` — landmark / region semantics
3. `docs/component-skill.md`
4. `docs/token-skill.md` — Surface bucket (default / 100 / 200 / elevated / quiet)
5. `docs/build-prompts/coherence-button.md` — class-variance pattern

## When to use

- Grouping related content visually (dashboard tile, feature summary, form section)
- Creating a visual unit with its own padding + background + optional shadow
- Wrapping a Table or chart with consistent chrome

## When NOT to use

- Blocking dialog → `<afi-modal>`
- Side context panel → `<afi-drawer>`
- A plain `<section>` / `<div>` suffices when no surface styling is needed — don't wrap in Card by default
- Interactive single action → `<afi-button>` (a Card that's entirely clickable is an anti-pattern; use Button with `fullWidth`)

## Composition patterns

- **Dashboard tile:** Card with header (title + optional menu Button) + body (stat + chart) + no footer.
- **Form section:** Card wraps a group of `<afi-input>` fields; footer holds Button group (Save / Cancel).
- **Table container:** Card wraps `<afi-table>`; header has filter Select + search Input; footer has pagination (custom composed).
- **Empty state:** Card with `variant="quiet"`; body contains illustration + guidance text + single Button.

## API

| Input | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'default' \| 'elevated' \| 'quiet'` | `'default'` | default = `surface.100` bg + hairline border; elevated = white bg + shadow-sm; quiet = `surface.quiet` bg + no border |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Uses spacing tokens (sm = 12, md = 16, lg = 24) |
| `interactive` | `boolean` | `false` | When true: hover state + `role="button"` + keyboard-operable. Emits `clicked`. Use sparingly. |
| `ariaLabel` | `string \| null` | `null` | Set when `interactive=true` without a visible title |

**Outputs:**

```ts
clicked = output<{ event: MouseEvent }>(); // only emits when interactive=true
```

**Slots (content projection):**

- `[slot=header]` — top bar, usually title + actions
- default slot — main body
- `[slot=footer]` — bottom bar, usually actions

## Key behavior

1. No slot = minimal chrome (variant background + padding + optional border).
2. Header and footer, when present, get a hairline divider separating them from body.
3. `interactive=true` adds:
   - Tailwind hover state on the surface
   - `role="button"` + `tabindex="0"`
   - Enter + Space actuate via keyboard handler
   - Focus ring via `var(--border-focus)`
4. Padding applies to body only by default; if `padding="none"` and header/footer exist, they still have their own internal padding (divider-to-content spacing).

## Accessibility

- Non-interactive: presentational; no special roles.
- Interactive: `role="button"` + `tabindex="0"` + keyboard handlers.
- Header content that acts as a title should use an appropriate heading element (`<h2>` / `<h3>`); Card does not dictate the level — consumer picks.

## File structure

```
libs/ui/card/
├── card.component.ts
├── card.variants.ts
├── card.component.spec.ts
└── index.ts
```

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `card`.

Card-specific additions:
- Test all three variants render correct token-backed background.
- Test `interactive=true` adds `role="button"` + `tabindex="0"` + keyboard handlers.
- Test slot projection: header-only / body-only / header+body+footer all render correctly.

## What success looks like

- Default Card in a dashboard tile grid: soft hairline border, `surface.100` bg, 16px padding.
- Elevated Card used as a modal precursor (not a dialog, a visually lifted panel): white bg + shadow-sm.
- Quiet Card holding an empty state: `surface.quiet` bg, no border, 24px padding.
- Interactive Card: clickable full-surface; keyboard Tab reaches it; Enter/Space fire `clicked`.

## If stuck

- Don't build a "dividerColor" prop — use token `border.hairline`. If the divider needs to disappear, `padding="none"` on the Card sets up the consumer to control spacing directly.
- Interactive Card is easy to overuse — if the content is actually a button, use Button. Card-as-button is for large-surface tiles (dashboard drill-down).

---

## Related compositions

This primitive stays **unopinionated by design**. The content richness lives in the documented card pattern catalog at `/patrones/tarjetas/` (LOCKED 2026-04-17-rev8) — ten content-variant compositions of this primitive: Métrica, Gráfico, Fila de lista, Acción, Entidad, Lista de indicadores, Composición, Convertidor, Estado, Editorial. When a consumer asks "what should a propuesta card look like?", route them to the pattern catalog — not to this primitive's API. The Card API intentionally doesn't know about those shapes; it's the canvas they paint on.
