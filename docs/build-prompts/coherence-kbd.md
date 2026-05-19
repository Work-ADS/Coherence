# Build — Coherence Kbd primitive (`libs/ui/kbd/`)

**Source:** `docs/strategy/plan.md` (LOCKED 2026-04-17-rev6 — primitive #21)
**Surface:** visual keycap for keyboard shortcuts. Atom-level primitive; display-only, no interaction. Calibration: Animate UI search-field shortcut badges, Linear / Raycast keycaps.
**Prereqs:** scaffolding + tokens (needs Control-neutral + Surface buckets + body-sm typography).

## Scope

One primitive: `<afi-kbd>`. Renders one or more keyboard keys as small keycaps. Zero interaction. No key-chord listener. Consumers wire shortcut registration themselves — this primitive is the visual only.

**Not in scope:**
- Keyboard shortcut *registration* — product-level concern.
- OS detection (auto-swap `⌘` ↔ `Ctrl`) — parked for v1.1 once a consumer needs it.
- Tooltips showing what the shortcut does — wrap with a Tooltip primitive (backlog) at the consumer site.

## Required reads

1. `docs/rules/clean-code.md`
2. `docs/rules/accessibility.md` — `kbd` element semantics + shortcut announcement pattern
3. `docs/rules/component-skill.md`
4. `docs/rules/copy-skill.md` — Spanish key-name glossary (below)
5. `docs/rules/token-skill.md` — Surface + Control-neutral buckets

## When to use

- Inside `<afi-menu-item [shortcut]="...">` (already referenced in `coherence-menu.md`)
- Command-palette / search triggers (shortcut indicator beside the search field — the `⌘ K` pattern)
- Primitive pages > Design tab > `Mapa de teclado` (every primitive documents its keys here)
- Inline prose on docs pages: `Pulse <afi-kbd :keys="['⌘', 'K']" /> para abrir el buscador.`

## When NOT to use

- Button labels — buttons aren't keys.
- Generic badges — use `<afi-badge>`.
- Icons or glyphs unrelated to keyboard input.

## API

| Input | Type | Default | Notes |
|---|---|---|---|
| `keys` | `string[]` | *(required)* | Each string is ONE key. Unicode symbols accepted: `⌘` `⇧` `⌥` `⌃` `↵` `⌫` `⎋` `↑` `↓` `←` `→` `⇥` `Space` (rendered literally) and alphanumeric. |
| `size` | `'sm' \| 'md'` | `'sm'` | `sm` = 20px height, `text-body-sm`; `md` = 24px, `text-body-md`. |
| `separator` | `'none' \| 'plus' \| 'arrow'` | `'none'` | Rendered between keys: nothing / `+` / `→`. |
| `ariaLabel` | `string \| null` | `null` | Overrides the auto-generated label (`'Atajo de teclado: ⌘ más K'`). |

**Outputs:** none. Display-only.

## Template

Single root `<span>` with semantic `<kbd>` children:

```html
<span
  [class]="rootClasses()"
  [attr.aria-label]="computedAriaLabel()"
  role="group">
  @for (key of keys(); let last = $last; let i = $index; track i) {
    <kbd [class]="keyClasses()">{{ key }}</kbd>
    @if (!last && separator() !== 'none') {
      <span [class]="sepClasses()" aria-hidden="true">{{ separatorChar() }}</span>
    }
  }
</span>
```

- Native `<kbd>` element per key (HTML5 semantic — SR-recognizable as keyboard input).
- Wrapping `<span role="group">` so SR treats the whole chord as one unit.
- Separator is `aria-hidden="true"` — SR reads "⌘ más K" from the label, not "plus" from the separator.

## Variants

`libs/ui/kbd/kbd.variants.ts`:

```ts
export const rootBaseClasses =
  'inline-flex items-center gap-1 font-mono';

export const keyBaseClasses =
  'inline-flex items-center justify-center ' +
  'bg-surface-muted border border-border-hairline rounded-sm ' +
  'text-canvas-fg';

export const sizeClasses = {
  sm: { key: 'h-5 min-w-5 px-1.5 text-body-sm', root: 'text-body-sm' },
  md: { key: 'h-6 min-w-6 px-2 text-body-md',  root: 'text-body-md' },
} as const;

export const separatorChars = {
  none:  '',
  plus:  '+',
  arrow: '→',
} as const;

export type KbdSize = keyof typeof sizeClasses;
export type KbdSeparator = keyof typeof separatorChars;
```

## File structure

```
libs/ui/kbd/
├── kbd.component.ts
├── kbd.variants.ts
├── kbd.component.spec.ts
└── index.ts
```

## Accessibility

- **`role="group"`** on the wrapping span — groups the keys so SR announces them as one chord.
- **Native `<kbd>`** for each key — semantically "keyboard input."
- **`aria-label`** on the root: auto-generated as `'Atajo de teclado: ' + keys.join(' más ')`; consumer can override.
- **Separator** is `aria-hidden="true"` — avoid SR reading "plus" or "arrow" when the label already conveys the chord.
- **No focus, no `tabindex`.** Display-only; never focusable.
- **Contrast:** `text-canvas-fg` on `bg-surface-muted` + `border-border-hairline` border passes WCAG AA at both sizes. Verified in pre-flight.
- **Reduced motion:** no animations in this primitive — nothing to adjust.

## Copy (RAE, formal `usted`)

**Auto aria-label pattern:**
- `['⌘', 'K']` → `'Atajo de teclado: ⌘ más K'`
- `['Ctrl', 'Shift', 'P']` → `'Atajo de teclado: Ctrl más Shift más P'`
- `['↵']` → `'Atajo de teclado: Intro'` (see glossary)

**Spanish key-name glossary** (used when auto-generating aria-label; consumer's `ariaLabel` input overrides):

| Symbol | SR announcement |
|---|---|
| `⌘` | `Comando` |
| `Ctrl` | `Control` |
| `⇧` | `Mayús` |
| `⌥` | `Opción` |
| `⌃` | `Control` (Mac) |
| `↵` | `Intro` |
| `⌫` | `Retroceso` |
| `⎋` | `Escape` |
| `↑` | `Flecha arriba` |
| `↓` | `Flecha abajo` |
| `←` | `Flecha izquierda` |
| `→` | `Flecha derecha` |
| `⇥` | `Tabulador` |
| `Space` | `Espacio` |
| alphanumeric | literal |

Implementation: a `keyToSpokenName(key: string): string` helper in `kbd.labels.ts` maps symbols to spoken Spanish names.

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `kbd`.

Kbd-specific additions:
- Verify `sm` and `md` sizes render with correct height + padding.
- Verify separator rendering across all three modes (`none` / `plus` / `arrow`).
- Verify aria-label auto-generation covers all glossary entries.
- Verify `<kbd>` element is used for each key (not `<span>` or `<div>`).
- Verify `role="group"` on the root wrapper.
- Verify contrast at both sizes (axe pass).
- Verify the primitive is not focusable via Tab.

## What success looks like

- `<afi-kbd :keys="['⌘', 'K']" />` renders two keycaps side by side, 20px tall, monospace, muted surface.
- `<afi-kbd :keys="['Ctrl', 'Shift', 'P']" separator="plus" size="md" />` renders three keys joined by `+` at 24px.
- Inside `<afi-menu-item>` shortcut slot: keycaps align right of the label, don't steal focus, match the item's text color.
- VoiceOver on the menu item: announces "Abrir búsqueda, menuitem, Atajo de teclado: Comando más K."
- Reduced motion: no change — nothing animates.

## If stuck

- **`<kbd>` is valid HTML5.** Use it directly. No need for `<span role="code">` or similar workarounds.
- **Unicode key symbols** copy-paste fine into TypeScript. No Lucide icon font needed for `⌘` / `⇧` / `⌥` / `↵`.
- **Don't listen for key presses** in this primitive. It's display-only. Consumer wires `(keydown)` at the window/document level and toggles their own state.
- **OS auto-detection** (swap `⌘` ↔ `Ctrl`) is NOT a v1 feature. If a consumer needs it, they pass different `keys` based on their own `navigator.platform` check; don't build it into the primitive.
