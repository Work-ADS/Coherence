# Dimension tokens — contributor rules

> Read this before touching anything in `libs/tokens/dimensions.scss`,
> `semantic.scss`, or before reaching for a raw `px` value in a component.
>
> Sister doc: [component-skill.md](component-skill.md). When they disagree,
> this file wins for anything dimension-shaped.

---

## TL;DR

1. **Components NEVER reference primitives directly.** Use semantic CSS custom properties (`var(--button-height)`, `var(--canvas-padding-inline)`).
2. **Responsive sizing lives at the semantic layer**, not the component. One `var(--button-height)` reference covers mobile + desktop because [`semantic.scss`](../../libs/tokens/semantic.scss) re-binds the value at each breakpoint.
3. **Components never set raw `px`.** The pre-commit hook (`scripts/clean-code-check.sh`) blocks raw hex, rgba, and `Npx` values outside `libs/tokens/`. No `--no-verify` escape.
4. **Touch target floor: 44 × 44 px** on mobile, **32 × 32 px** on desktop (with ≥ 8 px adjacent spacing). Always.

---

## The two layers

Tokens flow primitive → semantic → component:

```
┌─────────────────────────────────────────────────────────────┐
│  PRIMITIVES (one file per category)                         │
│  libs/tokens/colors.scss      → --color-* CSS custom props  │
│  libs/tokens/dimensions.scss  → --dimension-*, --bp-*, ...  │
│  libs/tokens/typography.scss  → --font-family-*, --type-*   │
│  libs/tokens/elevation.scss   → --elevation-*, --duration-* │
│                                                             │
│  Each file defines CSS custom properties at :root directly. │
│  AFI primitives live at :root; other brands live under      │
│  [data-brand="<name>"].                                     │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  SEMANTICS (libs/tokens/semantic.scss)                      │
│  --button-height: var(--dimension-11);  ← role-named         │
│  --canvas-padding-inline: var(--dimension-4);                │
│  --status-pending-bg: var(--color-warning-100);              │
│                                                             │
│  @include responsive-token(--canvas-padding-inline, (        │
│    base: var(--dimension-4),                                 │
│    lg:   var(--dimension-8),                                 │
│  ));                                       ← responsive     │
│                                                             │
│  [data-brand="mutualidad"] { … }           ← multi-brand    │
│  [data-theme="dark"]        { … }           ← dark mode      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  COMPONENTS (libs/ui/src/*/...component.scss)               │
│  .button { height: var(--button-height); }  ← never sets    │
│                                              raw values.    │
└─────────────────────────────────────────────────────────────┘
```

**The rule for which layer to edit:**

- Adding a new raw value (e.g., 144 px isn't on the scale) → `dimensions.scss`
- Adding a new role (e.g., chips need their own height that diverges from buttons) → `semantic.scss`
- Tuning how something responds to viewport → `semantic.scss` `@media` blocks
- A component needs a value no other component will share → component's own `.scss` `:host` block, **referencing a semantic var** (still never raw px)

---

## Primitive scale (`$dimension-N`)

One continuous Sass scale of raw px values. Mirrors AFI Figma's "Primitive Numbers" collection 1:1 (137 values). Pattern: `$dimension-N` → **N × 4 px**.

```scss
$dimension-0:    0;        // 0 px
$dimension-0-25: 1px;      // 1 px — fractional, for hairlines & focus offsets
$dimension-0-5:  2px;      // 2 px
$dimension-1:    4px;      // 4 px
$dimension-1-5:  6px;      // 6 px
$dimension-2:    8px;      // 8 px
// … fractional half-steps continue: 2-5 (10), 3 (12), 3-5 (14), 4 (16), 4-5 (18), 5 (20)
$dimension-6:    24px;     // 24 px — base-4 continues
$dimension-7:    28px;
$dimension-8:    32px;
// … every integer index 6 → 50 (24 → 200 px)
// … then even-indexed to dimension-200 (800 px)
// … then content widths: dimension-240 (960), dimension-285 (1140), dimension-330 (1320)
```

**You can use any of these in a `semantic.scss` mapping.** You should not need to add a new primitive often — if you do, file a PR adding the Sass var here AND emitting it in `primitives.scss`.

---

## Color semantic categories (12 — matches AFI Figma 1:1)

The color semantic layer follows AFI's Figma "Semantic Colors" collection exactly. 171 tokens organized into 12 categories with state-aware naming (`{category}-{role}-{property}-{state}`).

| Category | Tokens | Owns |
|---|---|---|
| **canvas** | 2 | Page-level surfaces (`canvas-primary`, `canvas-secondary`). |
| **surface** | 4 | Mid-level surfaces (`surface-default`, `surface-subtle`, `surface-raised`, `surface-selected`). |
| **brand-primary** | 12 | Primary brand (afi-azul) × bg / fg / border × default / hover / active / disabled. |
| **brand-secondary** | 12 | Deep accent brand (afi-azul-profundo) × same shape. |
| **brand-secondary-neutral** | 12 | Light-tinted brand bg with brand-tinted text. |
| **brand-tertiary** | 12 | Most subtle brand expression (afi-gris). |
| **disabled** | 4 | Universal disabled bg / fg / border / icon — referenced by every category's disabled state. |
| **foreground** | 20 | Text/icon roles — `placeholder` + `primary` / `secondary` / `tertiary` / `brand` × default/hover/active/disabled + `inverse` × default/secondary/tertiary. |
| **border** | 5 | General-purpose: `subtle`, `default`, `strong`, `focus`, `disabled`. (Brand-specific borders live inside brand-* categories.) |
| **control** | 17 | Generic interactive (buttons, switches) × bg/fg/border × default/hover/active/selected/focus/disabled. |
| **input** | 11 | Inputs/selects/textareas × bg/fg/border/icon × states. |
| **nav** | 19 | Sidebar/navbar/toolbar containers + nav-item × bg/fg/icon/border × states. |
| **overlay** | 4 | Modal scrim + popover/dropdown/modal body bgs. |
| **feedback** | 15 | Success/error/warning/info × bg/fg/border + disabled. |
| **chart** | 22 | Data series (8) + monochrome (6) + positive (3) + negative (2) + neutral chart chrome (3). |

**State-aware naming pattern:**
- `--brand-primary-background-default`
- `--brand-primary-background-hover`
- `--brand-primary-background-active`
- `--brand-primary-background-disabled`

Designers and devs read the same vocabulary that lives in Figma. Verbose by design.

**Each token has an inline `// Role: …` comment** in [`libs/tokens/semantic.scss`](../../libs/tokens/semantic.scss) explaining what it's FOR. Visual reference (with examples + use cases) lives at [/fundamentos/color-semantic](../../apps/site/src/app/pages/fundamentos/color-semantic.page.ts).

## Product-level tokens (NOT part of the DS)

Some tokens are specific to ONE product (Wealth Planner's plan-states: borrador, cumplimentada, descargada, entregada). These DON'T live in the DS — they live at the product level so the DS stays universal across all AFI products.

Pattern:
- DS exposes universal roles (e.g. `--feedback-success-background`).
- Each product gets a file at `apps/site/src/styles/<product>.scss` mapping product concepts onto DS roles.
- Components inside that product consume the product tokens (`--plan-state-borrador-bg`), never the DS tokens directly.

**Example — Wealth Planner:**
```scss
// apps/site/src/styles/wealth-planner.scss
:root {
  --plan-state-borrador-bg:     var(--feedback-disabled-background);
  --plan-state-entregada-bg:    var(--feedback-success-background);
  // … etc.
}
```

When the product team wants to change which feedback role "Borrador" looks like, they edit the product file — the DS doesn't move.

## Sizing / dimension semantic categories

Use the right category. Don't create a new one without team review.

| Category | Owns | Example tokens |
|---|---|---|
| **`control-h-*`** | Generic height scale for ALL interactive elements. The underlying scale every component reaches for. | `--control-h-sm`, `--control-h-md`, `--control-h-lg` |
| **`field-*`** | Form field specifics (when they need to deviate from generic). | `--field-input-height`, `--field-input-width` |
| **`button-*`** | Button specifics. | `--button-height`, `--button-max-width` |
| **`icon-button-*`** | Icon-only button specifics. | `--icon-button-height` |
| **`tab-*`** / **`chip-*`** | Other interactive components. | `--tab-height`, `--chip-height` |
| **`icon-*`** | Icon sizes + adjacent gap. | `--icon-xs`, `--icon-sm`, `--icon-md`, `--icon-lg`, `--icon-gap` |
| **`avatar-*`** | Avatar sizes. | `--avatar-xs` … `--avatar-xl` |
| **`canvas-*`** | Page-level chrome. | `--canvas-padding-inline`, `--canvas-padding-block`, `--canvas-base`, `--canvas-fg` |
| **`section-*`** | Section-level chrome. | `--section-padding-inline`, `--section-padding-block`, `--section-gap`, `--section-radius` |
| **`gap-*`** | Semantic gap roles (between blocks). | `--gap-content-to-content`, `--gap-section-to-section`, `--gap-content-to-footer` |
| **`space-*`** | Utility spacing scale (Tailwind-compatible: 2xs → 3xl). Use for padding/margin/gap in arbitrary contexts. | `--space-xs` … `--space-3xl` |
| **`border-width-*`** | Border widths (NOT border-radius). | `--border-width-hairline`, `--border-width-thick` |
| **`radius-*`** | Border-radius. Semantic aliases of the primitive `$radius-*`. | `--radius-control`, `--radius-card`, `--radius-modal`, `--radius-pill` |
| **`separator-*`** | Divider styling. | `--separator-thickness` |
| **`content-*`** | Page max-widths. | `--content-sm`, `--content-md`, `--content-lg`, `--content-xl`, `--content-xxl` |

### Why both generic AND specialized for controls?

```scss
// In semantic.scss
--control-h-md: var(--dimension-11);     // generic scale
--button-height: var(--control-h-md);    // specialization references generic
--field-input-height: var(--control-h-md);
```

Components consume the **specialized** alias (`--button-height`, not `--control-h-md`). That way, if a future design needs buttons to be slightly taller than inputs, you change `--button-height` to point at `--dimension-12` independently. Without specialization, you'd have to change the generic scale and break inputs too.

---

## Responsive — the load-bearing answer

**Responsive sizing lives entirely in `semantic.scss`.** Components consume one CSS var; the value of that var changes per breakpoint.

```scss
// semantic.scss — example
:root {
  // Mobile-first defaults (< 576 px)
  --control-h-md: var(--dimension-11);   // 44 px — touch floor
  --canvas-padding-inline: var(--dimension-4);   // 16 px
}

@media (min-width: 992px) {
  :root {
    --control-h-md: var(--dimension-10);   // 40 px — desktop densifies
    --canvas-padding-inline: var(--dimension-8);   // 32 px
  }
}
```

```scss
// button.component.scss — DOES NOT need @media for sizing
.button {
  height: var(--button-height);
  padding-inline: var(--space-md);
}
```

The button is 44 px tall on mobile and 40 px tall on desktop automatically. The component never declares this knowledge.

### Which tokens ARE responsive?

| Token category | Responsive? | Why |
|---|---|---|
| `--control-h-*` | **Yes** | Touch target floor on mobile; densifies on desktop. |
| `--canvas-padding-*` | **Yes** | Page chrome grows with viewport. |
| `--section-padding-*` | **Yes** | Same. |
| `--gap-section-to-section` | **Yes** | Sections breathe more on larger screens. |
| `--field-input-height`, `--button-height`, `--icon-button-height`, etc. | **Inherits from `--control-h-*`** | Single source of truth via the var chain. |
| `--icon-*` | **No** | Icons stay the same physical size across breakpoints. Touch target lives on the wrapping button. |
| `--space-*` | **No** | Utility scale is constant. Designers pick different tokens for different breakpoints. |
| `--radius-*` | **No** | Radii don't scale with viewport. |
| `--border-width-*`, `--separator-thickness` | **No** | Always 1 / 2 px. |
| `--content-*` | **No (each is its own breakpoint's max)** | The selection of which `--content-*` to use is part of the layout, not the token. |

### When a component DOES need its own `@media`

Semantic tokens cover **sizing**. Components still own:
- **Layout direction**: `flex-row` → `flex-col` at a breakpoint.
- **Visibility**: hide a desktop sidebar, show a mobile drawer.
- **Content reflow**: sidebar collapse, columns stack.
- **Density modes** that aren't viewport-driven (e.g., a "compact" mode toggle).

For those, use **Tailwind responsive prefixes** in the template (`md:flex-row`) or a `@media` in the component's `.scss`. **Even inside that `@media`, sizing comes from semantic vars** — never raw px.

---

## Breakpoints (LOCKED 2026-05-18)

Bootstrap-style. Defined in `dimensions.scss` and bound to Tailwind's `screens` config in `tailwind.config.js`.

| Sass var | Tailwind prefix | Min viewport | Targets |
|---|---|---|---|
| `$bp-sm` | `sm:` | **576 px** | Small phones → tablets |
| `$bp-md` | `md:` | **768 px** | Tablets → small desktops |
| `$bp-lg` | `lg:` | **992 px** | Small desktops → desktops |
| `$bp-xl` | `xl:` | **1200 px** | Desktops → large desktops |
| `$bp-xxl` | `2xl:` | **1400 px** | Large desktops → ultra-wide |

Designers see these numbers in Figma. Devs use them via Tailwind classes or `@media (min-width: 576px)`. Single source of truth: dimensions.scss.

---

## Accessibility — non-negotiable

- **Mobile floor: 44 × 44 px** for every interactive element. WCAG 2.1 AA strict. Achieved automatically by `--control-h-sm` → 44 px on mobile.
- **Desktop dense floor: 32 × 32 px** with adequate inter-element spacing (≥ 8 px gap), per WCAG 2.1 AA "Target Size" exception clause.
- **`--control-h-md` is the default size every component reaches for** unless the design genuinely calls for sm or lg. → 44 px on mobile, 40 px on desktop.
- **Touch target ≠ visible glyph size.** An icon can be 16-24 px visually inside a 44 px wrapping button. The wrapping button is the target.
- **Reduced motion** is a separate concern — handled in the component's `@media (prefers-reduced-motion: reduce)`, not in dimension tokens.

---

## `height` vs `min-height`

| Use | When |
|---|---|
| `height` | Buttons, inputs, chips, tabs — visual row alignment matters. Pulled from `--button-height` etc. |
| `min-height` | Cards, panels, content blocks, empty-state placeholders — content drives growth. |

Components **never** set `height` to a raw px. Always reference a semantic var. The pre-commit hook will block raw `Npx` outside `libs/tokens/`.

---

## Naming conventions

- **Sass primitives**: `$dimension-N` (N is the Figma index; value = N × 4 px or special for fractional).
- **Primitive CSS vars** (emitted by `primitives.scss`): `--dimension-N`, `--color-{ramp}-{shade}`, `--type-{role}`, `--bp-{size}`.
- **Semantic CSS vars** (emitted by `semantic.scss`): `--{category}-{role}` or `--{category}-{role}-{variant}`.
  - `--button-height`, `--icon-md`
  - `--control-h-sm`, `--control-h-md`, `--control-h-lg`
  - `--canvas-padding-inline`, `--canvas-padding-block`
- **Kebab-case throughout.** No camelCase, no PascalCase.
- **No abbreviation when it sacrifices clarity.** `--button-height` is better than `--btn-h`.

---

## When to add a new token

Add it if:
- A value is referenced 3+ times across components.
- The value has a brand-specific meaning that may change per brand.
- The value is responsive (changes per breakpoint).

Do NOT add it if:
- It's a one-off (use the component's own `:host` block referencing semantic vars).
- It duplicates an existing token under a different name (pick the existing one).

**Checklist for adding a semantic dimension token:**

1. Pick the right category (table above). If no category fits, ask before inventing one.
2. Add the token to `semantic.scss` at the right place in the file. Reference an existing `$dimension-N` primitive — don't introduce raw values.
3. If the token is responsive, add an `@media` override at the relevant breakpoint section.
4. If the token replaces an existing component's raw value, update that component's `.scss` in the same PR.
5. Document the token in the appropriate category section of this doc.

---

## Anti-patterns

| Don't | Do |
|---|---|
| `height: 40px;` in a component | `height: var(--button-height);` |
| `padding: 16px;` in a component | `padding: var(--space-md);` |
| `@import 'libs/tokens/dimensions';` in a component scss | Reference `var(--…)` from the global `:root` |
| `--button-height: 40px;` in a component | Set the value in `semantic.scss` |
| Different `@media` per component for sizing | Centralize in `semantic.scss` |
| `$color-afi-azul-500` in a component | `var(--action-500)` via the semantic role |
| Introducing `--my-component-height` as a top-level semantic var | Use the component's own `:host` block + reference `var(--control-h-md)` |

---

## File map

| File | What it owns |
|---|---|
| [`libs/tokens/colors.scss`](../../libs/tokens/colors.scss) | AFI color primitives at `:root` (brand-named CSS custom properties) |
| [`libs/tokens/colors-mutualidad.scss`](../../libs/tokens/colors-mutualidad.scss) | Mutualidad color primitives under `[data-brand="mutualidad"]` |
| [`libs/tokens/colors-unicaja.scss`](../../libs/tokens/colors-unicaja.scss) | Unicaja color primitives under `[data-brand="unicaja"]` |
| [`libs/tokens/dimensions.scss`](../../libs/tokens/dimensions.scss) | `--dimension-N` (137 values), `--radius-*`, `--bp-*` at `:root` (shared across brands) |
| [`libs/tokens/typography.scss`](../../libs/tokens/typography.scss) | `--font-family-serif`, `--type-*` at `:root` |
| [`libs/tokens/elevation.scss`](../../libs/tokens/elevation.scss) | `--elevation-*` (shadows) + `--duration-*` / `--easing-*` (motion) at `:root` |
| [`libs/tokens/_mixins.scss`](../../libs/tokens/_mixins.scss) | Pure-Sass utilities. `@mixin responsive-token($name, $map)` — emits a CSS custom property + per-breakpoint @media overrides. |
| [`libs/tokens/semantic.scss`](../../libs/tokens/semantic.scss) | Semantic CSS vars at `:root` + per-breakpoint mixin calls + `[data-brand]` brand overrides + `[data-theme="dark"]` overrides |
| [`libs/tokens/aliases.scss`](../../libs/tokens/aliases.scss) | Back-compat aliases for legacy names (deprecated; delete when usage drops to 0) |
| [`libs/tokens/variables.scss`](../../libs/tokens/variables.scss) | Thin orchestrator — `@import`s all of the above in cascade order |

**The only file `apps/site` imports is `variables.scss`.** Each underlying file gets pulled in via the orchestrator.

## Multi-brand pattern (Figma variable modes)

The DS ships ALL brands in one stylesheet, scoped under attribute selectors — exactly like Figma's variable modes.

### How a consuming app picks a brand

```html
<!-- index.html -->
<html data-brand="afi">           <!-- AFI palette, the default -->
<html data-brand="mutualidad">    <!-- Mutualidad palette + semantic re-bindings -->
<html data-brand="unicaja">       <!-- Unicaja -->
```

That's it. No build flags, no rebuild. The CSS cascade does the rest.

### Adding a new brand

1. Create `libs/tokens/colors-<brand>.scss` with primitives scoped under `[data-brand="<brand>"]`.
2. Add an `@import` for it in `variables.scss` after `colors.scss`.
3. In `semantic.scss`, add a `[data-brand="<brand>"]` block that re-maps semantic roles (`--action-*`, `--canvas-fg`, `--border-focus`, etc.) to the new brand's primitives.
4. Test by setting `<html data-brand="<brand>">` in the app.

### Single-brand bundle optimization (for engineering handoff)

If a product app only ships ONE brand and bundle size matters, two options:

- **Option A (recommended for most):** Ship the full DS bundle. Set `<html data-brand="afi">` and accept the small overhead of carrying other brands' selectors in CSS. They never apply.
- **Option B (high-perf apps):** Build-time CSS purge. Use PostCSS with `cssnano` or a similar tool to strip `[data-brand="mutualidad"]` and `[data-brand="unicaja"]` selectors from the compiled CSS. Result: minimal CSS, single-brand bundle.

For most apps Option A is fine. Option B is for high-traffic apps where every kB matters.

## Dark mode (theme variant)

Dark mode is a `[data-theme="dark"]` selector — orthogonal to brand. Both attributes can apply at once.

```html
<html data-brand="afi"         data-theme="dark">   <!-- AFI dark -->
<html data-brand="mutualidad"  data-theme="dark">   <!-- Mutualidad dark -->
<html data-brand="afi">                              <!-- AFI light (implicit default) -->
```

The dark mappings in `semantic.scss` re-bind roughly 20-30 semantic tokens: canvas / surface inverts (white → near-black), text inverts, status chip bgs go dark-tinted, fgs go light-tinted, borders soften, action color gets a brighter shade for contrast.

To enable OS-auto dark mode (follow `prefers-color-scheme`), uncomment the `@media (prefers-color-scheme: dark)` block at the bottom of `semantic.scss`.

## Sass mixins

`_mixins.scss` is a Sass partial (underscore prefix = no CSS emitted on its own). Currently contains:

### `@mixin responsive-token($name, $map)`

Emits a CSS custom property with per-breakpoint overrides, all in one call.

```scss
:root {
  @include responsive-token(--canvas-padding-inline, (
    base: var(--dimension-4),    // < 576 px (mobile)
    sm:   var(--dimension-5),    // ≥ 576 px
    md:   var(--dimension-6),    // ≥ 768 px
    lg:   var(--dimension-8),    // ≥ 992 px
    xl:   var(--dimension-10),   // ≥ 1200 px
    xxl:  var(--dimension-12),   // ≥ 1400 px
  ));
}
```

Skip any breakpoint by omitting it from the map. `base` is required.

Equivalent hand-written CSS (what the mixin compiles to):

```css
:root { --canvas-padding-inline: 16px; }
@media (min-width: 576px)  { :root { --canvas-padding-inline: 20px; } }
@media (min-width: 768px)  { :root { --canvas-padding-inline: 24px; } }
@media (min-width: 992px)  { :root { --canvas-padding-inline: 32px; } }
@media (min-width: 1200px) { :root { --canvas-padding-inline: 40px; } }
@media (min-width: 1400px) { :root { --canvas-padding-inline: 48px; } }
```

The mixin makes the responsive-token authoring scale: adding a new breakpoint someday only edits `_mixins.scss` once, not every responsive token.

---

## Enforcement

- **Pre-commit hook** (`scripts/clean-code-check.sh`) blocks raw hex, rgba, `Npx`, and `::ng-deep` outside `libs/tokens/`. Commits are rejected on failure.
- **Build** (`ng build apps/site`) compiles Sass; broken `@import` paths fail loud.
- **Review** — reviewers flag inline `template:` strings, inline `styles:` arrays, and any component-level `@media` block that's handling sizing rather than layout.

---

## Open items (known TODOs)

1. **`elevation.scss`** values are AI-guessed placeholders. Map to AFI Figma's "Primitive Elevation" collection (48 tokens) when ingested.
2. **`docs/archive/AFI foundational tokens Mayo 2026/Color semantic/`** — 12 screenshots not yet reviewed; the semantic color layer in `semantic.scss` is grounded in old assumptions and may need rebalancing.
3. **Legacy `--color-action-*`, `--color-neutral-*`, etc.** kept in `aliases.scss` as deprecation aliases. ~21 downstream files reference them. Removal is a future sweep.
4. **`--font-family-*`** — currently only `serif`. Tailwind config also references `sans` + `mono` that aren't defined as primitives. Reconcile.

---

**Last updated:** 2026-05-18 — Initial doc accompanying the dimension architecture migration (Session A-dimensions).
