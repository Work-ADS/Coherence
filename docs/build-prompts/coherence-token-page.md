# Build — Coherence token-detail page template (site-local)

**Source:** `docs/plan.md` (LOCKED 2026-04-17-rev6 — token-detail page + Stripe filter-chip pattern)
**Surface:** the reusable page template at `/fundamentos/color/{bucket}/{tokenName}` on the Coherence site. Shows a semantic color token with its contrast grade, foreground-text-in-color preview, Stripe-style filter-chip instance browser, and right-rail "On this page" TOC. Calibration: Animate UI Preview/Code layout + Stripe parameter-bar chips (user's screenshot, LOCKED 2026-04-17).
**Prereqs:** scaffolding + tokens + Button + Tabs + Menu + MenuItem + site bootstrap + primitive-page template infrastructure (reuses `<afi-doc-page-layout>`, `<afi-code-block>`, `<afi-toc>`).

## Scope

One page template + four site-local components + one static registry file. Every semantic color token gets a dedicated page built from this template.

- `<afi-token-page-layout>` — page shell (sibling to `<afi-doc-page-layout>` from primitive-page)
- `<afi-contrast-badge>` — AA / AAA / fail grade indicator
- `<afi-filter-chip>` — single Stripe-style filter criterion
- `<afi-filter-bar>` — container for multiple filter chips + `+ Añadir` + `⚙ Más`
- `token-registry.ts` — static hand-maintained data file mapping tokens → primitive instances

**Not in scope:**
- **Build-time token scanner** — v1.1. For v1, registry is hand-maintained; each primitive PR updates `token-registry.ts` with its consumed tokens.
- **Token pages for Typography / Space / Motion** — pattern is extensible; Color only in v1. Typography detail pages promote to v1.1 when a consumer asks for them.
- **Live brand-swap preview** — v1.1. For v1, the page shows the current AFI brand's resolved color.
- **Color editor / palette generator** — not Coherence's job.

## Required reads (in order)

1. `docs/clean-code.md`
2. `docs/accessibility.md` — contrast measurement + AAA/AA rules
3. `docs/component-skill.md`
4. `docs/copy-skill.md`
5. `docs/token-skill.md` — the seven semantic color buckets the page's tabs reflect
6. `docs/build-prompts/coherence-primitive-page.md` — sibling template; shares `<afi-doc-page-layout>`'s header + actions row + right-rail TOC
7. `docs/build-prompts/coherence-site.md` — IA tree; dynamic routes under `/fundamentos/color`
8. `docs/build-prompts/coherence-menu.md` — `<afi-filter-chip>` value-selector uses `<afi-menu>` under the hood

## When to use

- Every semantic color token in `libs/tokens/semantic/*.json` (Color buckets: Canvas, Surface, Action, Control-neutral, System, Status, Border, Data-viz) gets its own page at `/fundamentos/color/{bucket}/{tokenName}`.
- The pattern extends to other token families (Typography, Space, Motion) in v1.1.

## When NOT to use

- Primitive pages — use `coherence-primitive-page.md` template (Code / Design tabs, playground).
- Foundation *landing* pages (`/fundamentos/color`) — Wise-style editorial teaser grid, different template.
- Flat token reference lists — use `<afi-tokens-table>` component inline on other pages.

## Page composition

```
┌─────────────────────────────────────────────────────────────────┬──────────────┐
│ Breadcrumb · Foundations / Color / Action / action-500           │ En esta página│
│                                                                   ├──────────────┤
│ FOUNDATIONS                                                       │ Resumen      │
│ action-500                                                        │ Instancias   │
│ Acción primaria. Usado en el 42 % de los primitivos.              │ Ajuste de    │
│                                                                   │   marca      │
│ [Edit on GitHub] [Copy Markdown] [Descargar prompt ▾]             │ Reglas a11y  │
│                                                                   │              │
│ ┌─────────────────────────────────────────┐                       │              │
│ │  Canvas  Surface  Action  Control  …    │  ← bucket tabs         │              │
│ │                   ▔▔▔▔▔▔                 │                       │              │
│ └─────────────────────────────────────────┘                       │              │
│                                                                   │              │
│ ## Resumen                                                        │              │
│                                                                   │              │
│ ┌────────────────────────────────┐    AAA  ← contrast badge       │              │
│ │                                │    ──────                      │              │
│ │  Aa action-500                 │    Rol        acción primaria   │              │
│ │                                │    Hex        #0085CA           │              │
│ │  Lorem ipsum dolor sit amet,   │    HSL        200° 55% 45%      │              │
│ │  consectetur adipiscing elit.  │    Marca      AFI (slot)        │              │
│ │                                │    Contraste  12.4 : 1          │              │
│ │  (fg text = canvas-fg-on-      │                                 │              │
│ │   action, bg = action-500)     │                                 │              │
│ └────────────────────────────────┘                                 │              │
│                                                                    │              │
│ ## Instancias                                                      │              │
│                                                                    │              │
│ Aparece en (filtros):                                              │              │
│ [⊗ Primitivo | Button ▾]  [⊗ Variante | primary ▾]  [+ Añadir]    │  ← filter bar │
│                                                                    │    [⚙ Más]    │
│ 4 instancias coinciden                                             │              │
│ ────────────────────────────────────────                           │              │
│  Button · variant=primary · fondo                                  │              │
│  Input · anillo de foco                                            │              │
│  Checkbox · relleno marcado                                        │              │
│  LoadingOverlay · barra                                            │              │
│                                                                    │              │
│ ## Ajuste de marca                                                 │              │
│  Para cambiar este color en otra marca: editar                     │              │
│  `libs/tokens/brand/{nombre}.ts` > action.500                      │              │
│                                                                    │              │
│ ## Reglas de accesibilidad                                         │              │
│  - Siempre usar sobre fondo `surface-base` o `surface-elevated`.   │              │
│  - Contraste AAA garantizado contra texto blanco (12.4 : 1).       │              │
│  - NO usar sobre `surface-muted` (contraste insuficiente contra    │              │
│    texto oscuro).                                                  │              │
└───────────────────────────────────────────────────────────────────┴──────────────┘
```

## Site-local components

### `<afi-token-page-layout>`

Page shell. Renders the page header (kicker / title / subtitle / author / actions row) via `<afi-doc-page-layout>` composition, bucket tabs, and the content regions below.

| Input | Type | Default | Notes |
|---|---|---|---|
| `bucket` | `TokenBucket` | *(required)* | `'canvas' \| 'surface' \| 'action' \| 'control-neutral' \| 'system' \| 'status' \| 'border' \| 'data-viz'` |
| `tokenName` | `string` | *(required)* | e.g., `'action-500'`. The canonical token id. |
| `fgTokenForPreview` | `string` | *(required)* | The CSS var name used as foreground IN the preview band. E.g., for `action-500`, usually `--canvas-fg-on-action`. |
| `registry` | `TokenRegistry` | *(required)* | The static registry data for instance lookup. |

Behavior: bucket tabs switch navigates to `/fundamentos/color/{newBucket}/{firstTokenInBucket}`. Each bucket has a left-rail sub-nav showing the tokens in that bucket (sibling navigation); clicking a sibling navigates to `/fundamentos/color/{bucket}/{siblingToken}`.

Auto-populates the right-rail TOC with `## Resumen`, `## Instancias`, `## Ajuste de marca`, `## Reglas de accesibilidad`.

### `<afi-contrast-badge>`

AA / AAA / fail grade + ratio.

| Input | Type | Default | Notes |
|---|---|---|---|
| `fgVar` | `string` | *(required)* | CSS var name, e.g., `'--canvas-fg-on-action'` |
| `bgVar` | `string` | *(required)* | CSS var name, e.g., `'--action-500'` |
| `level` | `'text' \| 'ui'` | `'text'` | WCAG target: `text` uses 4.5 (AA) / 7 (AAA); `ui` uses 3 (AA) — for non-text UI elements. |

Behavior:
1. `ngAfterViewInit`: resolves both vars to computed RGB via `getComputedStyle(document.documentElement).getPropertyValue(var)`.
2. Computes WCAG relative-luminance contrast ratio.
3. Displays pill: `AAA` (green, passes both), `AA` (amber, passes AA not AAA), `Fail` (red, below AA).
4. Below the grade, shows `{ratio}:1` in small text.
5. Clicking the badge opens a tooltip with the exact computed hex values and the WCAG formula reference.
6. `aria-label` = `'Contraste {grade}, proporción {ratio} a uno'`.

**Formula:** standard WCAG 2.2 relative luminance + `(L1 + 0.05) / (L2 + 0.05)` where L1 is the lighter color. Pure math; ~30 lines. No external library needed (`chroma-js` is overkill for this one calc).

### `<afi-filter-chip>`

Single Stripe-style filter criterion.

| Input | Type | Default | Notes |
|---|---|---|---|
| `dimension` | `string` | *(required)* | Left-side label, e.g., `'Primitivo'`. |
| `value` | `string` | *(required)* | Current selected value, e.g., `'Button'`. |
| `options` | `string[]` | *(required)* | Values for the dropdown, e.g., `['Button', 'Input', 'Checkbox', …]`. |
| `removable` | `boolean` | `true` | Shows the `⊗` remove button on the left. |

**Outputs:**

```ts
valueChange = output<string>();   // fires when dropdown picks a new value
removed     = output<void>();     // fires when ⊗ clicked
```

Template: rounded-full pill. Left: `⊗` button (if removable). Middle: `{dimension}` in `text-canvas-fg-muted` + `|` separator + `{value}` in `text-canvas-fg font-medium`. Right: chevron-down. Entire chip minus `⊗` is the dropdown trigger — clicking opens an `<afi-menu>` with `options` as `<afi-menu-item>` rows.

### `<afi-filter-bar>`

Container for multiple chips + action buttons.

| Input | Type | Default | Notes |
|---|---|---|---|
| `filters` | `FilterState[]` | *(required)* | Array of `{ dimension, value }` pairs. |
| `availableDimensions` | `DimensionSpec[]` | *(required)* | `{ dimension, options }` for the `+ Añadir` menu. |

**Outputs:**

```ts
filtersChange = output<FilterState[]>();  // fires whenever filters are added, changed, or removed
settingsClick = output<void>();           // fires when ⚙ Más is clicked
```

Template: horizontal flex of `<afi-filter-chip>`s + `<afi-button variant="ghost" iconStart="plus">Añadir</afi-button>` + `<afi-button variant="ghost" iconStart="settings">Más</afi-button>`. The `Añadir` button opens an `<afi-menu>` listing `availableDimensions` not already in `filters`. Clicking a dimension adds a new chip pre-selected to its first option.

Wraps to multiple lines on narrow viewports; chips themselves stay compact.

## Token-instance registry

Location: `apps/site/src/app/data/token-registry.ts`.

**Shape:**

```ts
export interface TokenInstance {
  primitive: string;       // 'Button'
  variant?: string;        // 'primary' | 'secondary' | …
  state?: string;          // 'default' | 'hover' | 'active' | 'disabled'
  purpose: string;         // 'Fondo' | 'Texto' | 'Borde' | 'Anillo de foco' | …
  sourceFile: string;      // 'libs/ui/button/button.variants.ts'
}

export interface TokenRegistry {
  [tokenName: string]: TokenInstance[];
}

export const tokenRegistry: TokenRegistry = {
  'action-500': [
    { primitive: 'Button',         variant: 'primary',   state: 'default',  purpose: 'Fondo',          sourceFile: 'libs/ui/button/button.variants.ts' },
    { primitive: 'Button',         variant: 'primary',   state: 'hover',    purpose: 'Fondo (hover)',  sourceFile: 'libs/ui/button/button.variants.ts' },
    { primitive: 'Input',                                 state: 'focus',    purpose: 'Anillo de foco', sourceFile: 'libs/ui/input/input.variants.ts' },
    { primitive: 'Checkbox',                              state: 'checked',  purpose: 'Relleno',        sourceFile: 'libs/ui/checkbox/checkbox.variants.ts' },
    // …
  ],
  'surface-quiet': [
    { primitive: 'Sidebar',                                                 purpose: 'Fondo',          sourceFile: 'libs/ui/sidebar/sidebar.variants.ts' },
    // …
  ],
  // … one entry per semantic token
};
```

**Maintenance (v1):** hand-maintained. Each primitive PR that adds or changes token usage updates this file in the same commit. The primitive's `variants.ts` should export a `tokenUsage: TokenInstance[]` constant as the source of truth; the registry aggregates imports from all primitives:

```ts
// apps/site/src/app/data/token-registry.ts (v1, hand-aggregated)
import { tokenUsage as buttonTokens } from '@coherence/ui/button';
import { tokenUsage as inputTokens }  from '@coherence/ui/input';
// ...

export const tokenRegistry = buildRegistry([
  ...buttonTokens,
  ...inputTokens,
  // ...
]);
```

**v1.1 path:** a build-time script scans `libs/ui/**/*.variants.ts` for `var(--{token})` references via regex or AST, produces `tokenUsage` arrays automatically, eliminates manual aggregation.

## Routes (site)

| Path | Behavior |
|---|---|
| `/fundamentos/color` | Landing page (Wise-style editorial + teaser grid of buckets). NOT this template. |
| `/fundamentos/color/{bucket}` | Redirects to `/fundamentos/color/{bucket}/{firstTokenInBucket}`. |
| `/fundamentos/color/{bucket}/{tokenName}` | This template. Canonical per-token URL. |

Invalid `{bucket}` or `{tokenName}` → 404 (`Página no encontrada`).

## File structure

```
apps/site/src/app/
├── components/
│   ├── token-page-layout/
│   ├── contrast-badge/
│   ├── filter-chip/
│   └── filter-bar/
├── pages/fundamentos/color/
│   ├── color.routes.ts          # redirects + token detail route
│   ├── color.landing.ts         # /fundamentos/color (editorial)
│   └── color-token.page.ts      # /fundamentos/color/{bucket}/{name} — uses token-page-layout
├── data/
│   └── token-registry.ts        # the hand-maintained instance map
└── lib/
    └── contrast.ts              # WCAG luminance + ratio helpers
```

## Accessibility

- **Bucket tabs:** `<afi-tabs>` handles WAI-ARIA tabs pattern.
- **Contrast badge:** announces grade + ratio via `aria-label`. Tooltip on click reveals computed hex + formula link.
- **Filter chips:** each chip is a group; the dropdown trigger uses `aria-haspopup="menu"`. Remove button has `aria-label` = `'Quitar filtro {dimension}: {value}'`.
- **Filter bar:** `role="group"` + `aria-label="Filtros de instancias"`. Changes to filters fire a `polite` live-region announcement: `'{N} instancias coinciden'`.
- **Preview band:** the fg-text-in-color demo has `aria-label` = `'Ejemplo de texto en color {tokenName} sobre fondo {tokenName}'` so SR users understand what the visual conveys without relying on color alone.
- **Right-rail TOC:** same pattern as primitive-page template.
- **Reduced motion:** bucket tab switch, contrast-badge tooltip open/close, filter-bar rearrangement — all collapse to instant.

## Copy (hardcoded, RAE, formal `usted`)

- Page kicker: `FOUNDATIONS` (action-700 tracked uppercase)
- Section headings: `Resumen` · `Instancias` · `Ajuste de marca` · `Reglas de accesibilidad`
- Bucket tab labels: `Canvas` · `Surface` · `Action` · `Control` · `System` · `Status` · `Border` · `Data-viz`
- Contrast badge states: `AAA` · `AA` · `Fail`
- Filter-bar action labels: `Añadir` · `Más`
- Filter-chip remove aria-label: `Quitar filtro {dimension}: {value}`
- Filter-bar aria-label: `Filtros de instancias`
- Filter results count: `{N} instancias coinciden` · `1 instancia coincide` · `Sin instancias coincidentes`
- Preview-band aria-label: `Ejemplo de texto en color {tokenName} sobre fondo del mismo token`
- Ajuste de marca default copy: `Para cambiar este color en otra marca: editar libs/tokens/brand/{nombre}.ts`
- 404 from invalid token: `Token no encontrado`

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `token-page` (site-level composition).

Template-specific additions:
- Verify `/fundamentos/color/action/action-500` renders correctly with the reference implementation.
- Verify bucket tab switching navigates to a valid sibling token in the new bucket.
- Verify contrast badge computes correct ratio for at least three pairs (spot-check `action-500` × `canvas-fg-on-action`, `surface-base` × `canvas-fg`, `system-error-500` × white).
- Verify filter chips can be added, removed, and their values changed.
- Verify `+ Añadir` only offers dimensions NOT currently in the filter set.
- Verify instances list re-filters reactively when filters change.
- Verify `⚙ Más` opens a settings panel (v1: simple placeholder; v1.1: full panel).
- Verify reduced-motion collapses every transition.
- Verify every string is RAE (run `copy-skill.md` glossary check).
- Verify `token-registry.ts` has an entry for every semantic token in `libs/tokens/semantic/**/*.json` (unit test that fails if a token has no instances — catches forgotten registrations).

## What success looks like

- Designer opens `/fundamentos/color/action/action-500` → page renders with kicker + title + subtitle + actions. Bucket tabs show Action as active. Preview band shows foreground text on action-500 background in actual colors. Contrast badge says AAA · 12.4 : 1.
- Designer adds a filter `[Primitivo | Input]` → instances list shrinks to just the Input row. Adds `[Variante | primary]` → list updates. Removes Primitivo filter → list expands.
- Engineer: confirms that action-500 is read by 4 primitives before committing to a brand-swap palette change.
- Screen reader: announces bucket tabs, contrast grade + ratio, filter changes (live region), preview band (descriptive aria-label).
- Reduced motion: tabs switch instantly; filter chips add/remove without animation.
- Mobile: bucket tabs scroll horizontally; filter bar wraps; right-rail TOC collapses to `Índice` button.

## If stuck

- **WCAG contrast math:** standard relative-luminance formula. Look up the WCAG 2.2 spec; ~30 lines in `contrast.ts`. No npm package needed for this.
- **Resolving CSS vars at runtime:** `getComputedStyle(document.documentElement).getPropertyValue('--action-500')` returns a string like `'rgb(0, 133, 202)'` or `'hsl(200 55% 45%)'`. Parse with a tiny hex/rgb/hsl normalizer.
- **Filter-chip dropdown:** use `<afi-menu>` primitively. Don't reinvent the positioning.
- **Bucket-tab sub-nav sibling list:** a left rail (inside the bucket content area, not the shell's left sidebar) showing every token in the current bucket. `routerLinkActive` drives the highlighted state.
- **404 handling:** `color.routes.ts` matches `{bucket}/{tokenName}` via route guard; guard checks against `tokenRegistry` keys; invalid combo → redirect to `/404` with a Spanish message.
- **Don't build a color picker.** This is a token *documentation* page, not an editor. Users read; they don't modify from here.
- **Don't block on the v1.1 auto-scanner.** Ship v1 with hand-maintained registry. Works today; scales to v1.1 on demand.
