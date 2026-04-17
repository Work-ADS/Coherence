# Build — Coherence tokens (`libs/tokens/`)

**Source:** `docs/plan.md`
**Surface:** token layer (primitive → semantic → brand)
**Prereq:** `coherence-scaffolding.md` completed — workspace + Style Dictionary pipeline exists.

## Scope of this prompt

Fill `libs/tokens/` with primitive + semantic + AFI-default brand token JSON; wire Style Dictionary to emit CSS custom properties; extend `tailwind.config.js` theme to consume those CSS vars.

**Not in scope:** component code. Components consume these tokens in their own prompts.

## Required reads (in order, before writing)

1. `docs/token-skill.md` — three-layer architecture, 6 semantic buckets, base-4 spacing, JSON-as-source-of-truth
2. `docs/plan.md` — all locked token values (search for "LOCKED 2026-04-16"); in particular:
   - Color hue 200° (AFI blue), step 100 = Blanco Afi, 300 = AFI blue pin, 900 = Azul profundo pin, full 50-900 scale derivable
   - Base-4 spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
   - Radius scale including `radius-sm: 4`
   - Motion tokens: duration-fast/base/slow + easing-standard/enter/exit
   - Dimensions: `control-h-sm: 32`, `control-h-lg: 48` (default), breakpoints Tailwind-standard
   - Focus ring 2px, `action-500`
   - **Surface tonal ladder** — `surface-base` / `surface-quiet` / `surface-muted` / `surface-elevated` / `surface-overlay`. Tonal step = context change; shadow = elevation change. They don't mix. Claude / Granola / Perplexity sidebars are the calibration anchor for `quiet`.
   - **Status semantic bucket** — 8 estados (borrador / pendiente / aprobada / rechazada / ejecutada / cancelada / en-revision / archivada), each with bg + fg + dot tokens. Feeds `<afi-status-chip>`.
3. `docs/clean-code.md` — token-only styling rule, no hex/rgba/px leakage

## Structure

```
libs/tokens/
├── primitive/
│   ├── color.json          # 200° hue scale 50-900, also neutral scale, system hues (red/green/amber)
│   ├── spacing.json        # base-4 scale
│   ├── radius.json         # sm/md/lg
│   ├── dimension.json      # control heights, icon sizes, breakpoints
│   ├── typography.json     # Roboto Serif family, AWM-structured scale
│   ├── motion.json         # durations + easings
│   └── elevation.json      # shadow tokens
├── semantic/
│   ├── canvas.json         # page-level bg + fg
│   ├── surface.json        # tonal ladder: base / quiet / muted / elevated / overlay
│   ├── action.json         # brand accent slot
│   ├── control-neutral.json  # inputs, selects, checkboxes
│   ├── system.json         # error / warning / success / info
│   ├── status.json         # estado tokens: draft / pending / approved / rejected / executed / cancelled / in-review / archived
│   ├── data-viz.json       # chart palette (ordered)
│   ├── border.json         # hairline + focus ring
│   └── typography.json     # type role aliases (display / title / body / etc.)
├── brand/
│   ├── default.ts          # minimal manifest + fallback
│   └── afi.ts              # AFI brand manifest — v1 default
├── build.js                # Style Dictionary config
└── dist/
    ├── tokens.css          # emitted CSS custom properties
    └── tailwind-preset.js  # emitted Tailwind theme.extend block
```

## Key token values to define (follow token-skill.md naming)

**Primitive color scales — LOCKED 2026-04-17-rev10 (supersedes the 200° hue scale from 2026-04-16):**

Five named color scales, hand-tuned in Token Studio (Figma) as the source of truth. Style Dictionary emits CSS + Tailwind from these. Every semantic token aliases to a step in one of these five scales + system colors.

Scale roles (summary — semantic layer details follow):

| Scale | AFI brand role | Semantic consumers |
|---|---|---|
| `color.primary`     | Azul Afi (bright blue)          | Data-viz anchor, accent moments, link color |
| `color.secondary`   | Azul profundo (deep dark blue)  | **Primary button**, focus ring, primary CTAs (via `action-*`) |
| `color.tertiary`    | Gris Afi (blue-tinted neutral)  | Brand-flavored dividers, quiet surfaces where warmth is wanted |
| `color.neutral`     | Cool gray (Untitled-UI-calibrated) | Canvas bg/fg, surface ladder, borders, general UI text |
| `color.neutral-alt` | Warm gray                       | **Control surfaces** — inputs, checkboxes, switches. Per user note: "neutral-alt is for control." |

---

**`color.primary` — Azul Afi (bright blue):**

| Step | Hex | Role |
|---|---|---|
| 0   | `#FFFFFF` | Pure white (inverse text) |
| 25  | `#F2FAFE` | Lightest tint |
| 50  | `#E6F4FB` | Tint surface |
| 100 | `#CDE9F6` | Subtle fill |
| 200 | `#A6D8EE` | Tint border |
| 300 | `#80C6E5` | Hover border (tint) |
| 400 | `#37BBF4` | ⭐ Data-viz anchor, bright emphasis |
| 500 | `#0085CA` | ⭐ **Azul Afi** — primary brand blue |
| 600 | `#0076B4` | Hover |
| 700 | `#00629A` | Pressed |
| 800 | `#004A74` | Deep emphasis |
| 900 | `#003B5F` | Very deep |

**`color.secondary` — Azul profundo (deep dark blue):**

| Step | Hex | Role |
|---|---|---|
| 0   | `#FFFFFF` | |
| 25  | `#F2F7FA` | |
| 50  | `#E6EFF3` | Tint surface |
| 100 | `#CCDDE5` | |
| 200 | `#AFC4CF` | |
| 300 | `#8AA8B6` | |
| 400 | `#5E8294` | Mid emphasis |
| 500 | `#062D3F` | ⭐ **Azul profundo** — Primary button, focus ring, `action-500` |
| 600 | `#052636` | Hover |
| 700 | `#041F2C` | Pressed |
| 800 | `#031823` | Deep |
| 900 | `#020F15` | Very deep (near-black) |

**`color.tertiary` — Gris Afi (blue-tinted neutral):**

| Step | Hex | Role |
|---|---|---|
| 0   | `#FFFFFF` | |
| 25  | `#FBFCFD` | |
| 50  | `#F4F8FA` | Tint surface |
| 100 | `#EAF1F5` | Subtle fill |
| 200 | `#D8E5EC` | Quiet divider (brand-flavored alternative to neutral.200) |
| 300 | `#C8DAE2` | ⭐ **Gris Afi** — brand gray exact |
| 400 | `#B4C9D2` | |
| 500 | `#9CB2BC` | |
| 600 | `#839AA5` | |
| 700 | `#6A808A` | |
| 800 | `#51666F` | |
| 900 | `#394C54` | |

**`color.neutral` — cool gray (general UI):**

| Step | Hex | Role |
|---|---|---|
| 0   | `#FFFFFF` | `canvas-base` (white) |
| 25  | `#FCFCFD` | |
| 50  | `#F9FAFB` | `surface-quiet` — sidebar, toolbar, rail |
| 100 | `#F2F4F7` | `surface-muted` — nested panels, filter rails |
| 200 | `#E4E7EC` | `border-hairline` default |
| 300 | `#D0D5DD` | Stronger border |
| 400 | `#98A2B3` | Placeholder / disabled text |
| 500 | `#667085` | `canvas-fg-muted` — secondary text |
| 600 | `#475467` | Body (de-emphasis) |
| 700 | `#344054` | Strong body |
| 800 | `#1D2939` | Heading |
| 900 | `#101828` | `canvas-fg` — primary text |
| 950 | `#0C111D` | Deepest (overlays, max emphasis) |

**`color.neutral-alt` — warm gray (control surfaces, LOCKED 2026-04-17-rev10):**

Reserved for form controls — input frames, checkbox borders, switch tracks, select chrome. Slightly warmer / less blue-tinted than `color.neutral` so controls read as a distinct affordance family. When you see `neutral-alt` in the source, you're looking at something a user directly interacts with (form input surfaces).

| Step | Hex | Role |
|---|---|---|
| 0   | `#FFFFFF` | Control bg default (pure white) |
| 25  | `#FAFAFA` | ⭐ **AFI White** — the brand "white" anchor. Slightly warmer than pure white; used when brand context wants a soft, branded white over stark pure white. |
| 50  | `#F5F5F5` | Disabled bg |
| 100 | `#F1F3F5` | Hover bg |
| 200 | `#E4E7EB` | Disabled border |
| 300 | `#D1D6DB` | Default border |
| 400 | `#B0B8C1` | Hover border / placeholder |
| 500 | `#8A949E` | Text inside controls (secondary) |
| 600 | `#6B7480` | Body |
| 700 | `#4F5761` | Strong |
| 800 | `#343A40` | Emphasis |
| 900 | `#1F2328` | Deep |

**Primitive color — system (unchanged, still AFI anchors from 2026-04-16):**
- `red-{50-900}` — error scale (loss anchors at 300/400)
- `green-{50-900}` — success scale (gain anchors at 200/400/700)
- `amber-{50-900}` — warning scale (shadcn verbatim, AFI has no brand warning color)
- `blue-{50-900}` — info scale. **Alias**: `color.blue.*` = `color.primary.*` (Azul Afi doubles as info hue; no new scale needed).

**Primitive color — data-viz palettes (LOCKED 2026-04-17-rev11):**

Four dedicated brand-tuned palettes for charts. **Not** aliased to system / action / accent — charts need purpose-built gradients that system-feedback red/green don't satisfy at scale. Source of truth: Token Studio `primitives/color/data-viz/*`.

| Palette | Purpose | Where it's used |
|---|---|---|
| `color.data-viz.mono` | Multi-step monochrome (lightest → darkest, ~10 steps) | Single-series bar/line charts where the series is the only dimension; heatmap base scale; table row-zebra intensity. Neutral register — does NOT imply positive/negative. |
| `color.data-viz.neut` | Neutral accent scale (step-based, cool register) | Comparison charts with multiple unrelated series (each series gets one step); legend fills. |
| `color.data-viz.posi` | Positive / gain (green register, brand-tuned) | Growth lines, positive delta bars, gains in portfolio composition. Distinct from `system.success` (which is UI feedback, not data). |
| `color.data-viz.nega` | Negative / loss (red register, brand-tuned) | Drawdown lines, negative delta bars, losses. Distinct from `system.error` (UI feedback). |

**Why distinct from system colors:** A chart showing 4 quarters where Q2 was negative shouldn't use `system.error` — that token carries "something is broken, user should act" semantics. Data-viz `nega` carries "this number is below zero" semantics. Two different jobs, two different tokens.

Per-step hex values live in Token Studio; Style Dictionary emits them as `--color-data-viz-mono-50` through `--color-data-viz-mono-900`, same for `neut`, `posi`, `nega`. Consumers read via the semantic `data.*` bucket (`data-positive`, `data-negative`, `data-neutral`, `data-mono-{step}`) defined in the data-viz skill spec.

**Semantic — Surface tonal ladder:**

Five named steps. Tonal = context change (sidebar vs content); shadow = elevation change (card lifting above content). They don't mix — a card is `surface-elevated` with shadow; a sidebar is `surface-quiet` without shadow.

```json
{
  "surface": {
    "base":     { "value": "{color.neutral.0}",   "comment": "Main content background. Brightest step." },
    "quiet":    { "value": "{color.neutral.50}",  "comment": "Persistent chrome (sidebar, toolbar, right rail). Claude/Granola/Perplexity calibration. Now sourced from neutral.50 per rev10." },
    "muted":    { "value": "{color.neutral.100}", "comment": "Deeper quiet for nested panels, filter rails, secondary sidebars." },
    "elevated": { "value": "{color.neutral.0}",   "comment": "Lifted above base — cards, modals, popovers. Same tone as base; subtle shadow distinguishes." },
    "overlay":  { "value": "hsla(215, 25%, 15%, 0.55)", "comment": "Modal scrim. Darkens content beneath an overlaying surface." }
  },
  "canvas": {
    "base":         { "value": "{color.neutral.0}" },
    "fg":           { "value": "{color.neutral.900}" },
    "fg-muted":     { "value": "{color.neutral.500}" },
    "fg-on-action": { "value": "{color.neutral.0}", "comment": "White text on action (Azul profundo) surfaces — contrast ~15.7:1 AAA." }
  },
  "action": {
    "_comment": "Primary button, focus ring, primary CTAs. LOCKED 2026-04-17-rev10: aliases the secondary scale (Azul profundo) — NOT the primary scale. This replaces the manual brand-manifest override from rev7 with a direct semantic alias; AFI brand manifest no longer needs action.500/600/700 overrides.",
    "50":  { "value": "{color.secondary.50}" },
    "100": { "value": "{color.secondary.100}" },
    "200": { "value": "{color.secondary.200}" },
    "300": { "value": "{color.secondary.300}" },
    "400": { "value": "{color.secondary.400}" },
    "500": { "value": "{color.secondary.500}" },
    "600": { "value": "{color.secondary.600}" },
    "700": { "value": "{color.secondary.700}" },
    "800": { "value": "{color.secondary.800}" },
    "900": { "value": "{color.secondary.900}" }
  },
  "accent": {
    "_comment": "Azul Afi — the bright brand blue. Used for links, data-viz primary series, and small attention moments that need lift without weight. Distinct from action (deep authority) by being light and accessible. LOCKED 2026-04-17-rev10.",
    "50":  { "value": "{color.primary.50}" },
    "500": { "value": "{color.primary.500}" },
    "600": { "value": "{color.primary.600}" },
    "700": { "value": "{color.primary.700}" }
  },
  "control-neutral": {
    "_comment": "Form control surfaces — inputs, checkboxes, switches, selects. Aliases color.neutral-alt per rev10. Distinct from surface/canvas so controls read as a separate affordance family.",
    "bg":             { "value": "{color.neutral-alt.0}" },
    "bg-alt":         { "value": "{color.neutral-alt.25}" },
    "bg-hover":       { "value": "{color.neutral-alt.100}" },
    "bg-disabled":    { "value": "{color.neutral-alt.50}" },
    "border":         { "value": "{color.neutral-alt.300}" },
    "border-hover":   { "value": "{color.neutral-alt.400}" },
    "border-disabled":{ "value": "{color.neutral-alt.200}" },
    "text":           { "value": "{color.neutral-alt.900}" },
    "text-placeholder": { "value": "{color.neutral-alt.500}" }
  },
  "border": {
    "hairline": { "value": "{color.neutral.200}", "comment": "Default hairline divider — cool gray. Use tertiary.200 (#D8E5EC) instead when a brand-warmth divider reads better in context." },
    "focus":    { "value": "{color.action.500}",  "comment": "2px focus ring = Azul profundo. Contrast verified AA+ on surface-base." }
  }
}
```

Backwards-compat note: the earlier lock referenced `surface-100` / `surface-200` as numeric steps. These are deprecated in favor of named tokens; update any consumer using them.

**Semantic — Status bucket (estado tokens for `<afi-status-chip>`):**

Eight estados, each with three tokens (bg, fg, dot). Feminine agreement by default (matches propuesta, orden, tarea). `<afi-status-chip>` maps each to a pill variant. Contrast AA-verified for every bg × fg pair.

```json
{
  "status": {
    "draft": {
      "bg":  { "value": "{color.neutral.100}" },
      "fg":  { "value": "{color.neutral.700}" },
      "dot": { "value": "{color.neutral.500}" }
    },
    "pending": {
      "bg":  { "value": "{color.amber.100}" },
      "fg":  { "value": "{color.amber.800}" },
      "dot": { "value": "{color.amber.500}" }
    },
    "approved": {
      "bg":  { "value": "{color.green.100}" },
      "fg":  { "value": "{color.green.800}" },
      "dot": { "value": "{color.green.500}" }
    },
    "rejected": {
      "bg":  { "value": "{color.red.100}" },
      "fg":  { "value": "{color.red.800}" },
      "dot": { "value": "{color.red.500}" }
    },
    "executed": {
      "bg":  { "value": "{color.action.100}" },
      "fg":  { "value": "{color.action.800}" },
      "dot": { "value": "{color.action.500}" }
    },
    "cancelled": {
      "bg":  { "value": "{color.neutral.100}" },
      "fg":  { "value": "{color.neutral.600}" },
      "dot": { "value": "{color.neutral.400}" }
    },
    "in-review": {
      "bg":  { "value": "{color.blue.100}" },
      "fg":  { "value": "{color.blue.800}" },
      "dot": { "value": "{color.blue.500}" }
    },
    "archived": {
      "bg":  { "value": "{color.neutral.100}" },
      "fg":  { "value": "{color.neutral.600}" },
      "dot": { "value": "{color.neutral.400}" }
    }
  }
}
```

Adding a new estado requires three coordinated edits: this JSON, `Estado` union in `libs/ui/status-chip/status-chip.labels.ts`, and `estadoLabels` map in the same file. Token Guardian enforces the 1:1 sync.

**Semantic — Action bucket (brand-swappable slot):**
- `action.50` → `action.900` — alias to primitive color scale; AFI brand overrides at brand layer

**Semantic — Border:**
- `border.hairline` — 1px divider color (neutral-200)
- `border.focus` — 2px ring color (`action.500`)

**Typography semantic aliases (AWM-structured scale):**

| Token | Size / line-height | Weight | Font family |
|---|---|---|---|
| `type.display`    | 96/112 | 400 | Roboto Serif |
| `type.title`      | 32/40  | 500 | Roboto Serif |
| `type.subtitle`   | 24/32  | 500 | Roboto Serif |
| `type.section`    | 20/24  | 500 | Roboto Serif |
| `type.subtitle-body` | 20/20 | 400 | Roboto Serif |
| `type.body`       | 16/24  | 400 | Roboto Serif |
| `type.body-lg-600`| 16/24  | 600 | Roboto Serif |
| `type.body-lg-500`| 16/24  | 500 | Roboto Serif |
| `type.body-md-600`| 14/20  | 600 | Roboto Serif |
| `type.body-md-500`| 14/20  | 500 | Roboto Serif |
| `type.body-md-400`| 14/20  | 400 | Roboto Serif |
| `type.body-sm-600`| 12/16  | 600 | Roboto Serif |
| `type.body-sm-500`| 12/16  | 500 | Roboto Serif |
| `type.body-sm-400`| 12/16  | 400 | Roboto Serif |
| `type.button`     | 14/14  | 500 | Roboto Serif |
| `type.informe`    | 12/14  | 400 | Roboto Serif |

**Motion:**
- `duration.fast`: 150ms
- `duration.base`: 200ms
- `duration.slow`: 300ms
- `easing.enter`: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo, entries settle)
- `easing.exit`: `cubic-bezier(0.7, 0, 0.84, 0)` (ease-in-expo, exits accelerate)
- `easing.standard`: `cubic-bezier(0.4, 0, 0.2, 1)` (material standard)
- `easing.spring-soft`: `cubic-bezier(0.34, 1.56, 0.64, 1)` — small overshoot (~108 % peak, settles to 100 %). **Reserved for small state-change affordances** (radio dot scale-in, checkbox tick, switch thumb arriving). NOT for enter/exit of overlays or hover/press transitions. LOCKED 2026-04-17-rev7.

## Style Dictionary build config

`libs/tokens/build.js`:

```js
const StyleDictionary = require('style-dictionary');

module.exports = {
  source: [
    'libs/tokens/primitive/**/*.json',
    'libs/tokens/semantic/**/*.json',
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'libs/tokens/dist/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: { outputReferences: true },
      }],
    },
    tailwind: {
      transformGroup: 'js',
      buildPath: 'libs/tokens/dist/',
      files: [{
        destination: 'tailwind-preset.js',
        format: 'javascript/module',
      }],
    },
  },
};
```

## Tailwind theme extension

Update `tailwind.config.js` to reference CSS vars emitted above:

```js
theme: {
  extend: {
    colors: {
      canvas: {
        base:           'var(--canvas-base)',
        fg:             'var(--canvas-fg)',
        'fg-muted':     'var(--canvas-fg-muted)',
        'fg-on-action': 'var(--canvas-fg-on-action)',
      },
      surface: {
        DEFAULT:  'var(--surface-base)',
        base:     'var(--surface-base)',
        quiet:    'var(--surface-quiet)',
        muted:    'var(--surface-muted)',
        elevated: 'var(--surface-elevated)',
        overlay:  'var(--surface-overlay)',
      },
      status: {
        'draft-bg':     'var(--status-draft-bg)',
        'draft-fg':     'var(--status-draft-fg)',
        'draft-dot':    'var(--status-draft-dot)',
        'pending-bg':   'var(--status-pending-bg)',
        'pending-fg':   'var(--status-pending-fg)',
        'pending-dot':  'var(--status-pending-dot)',
        'approved-bg':  'var(--status-approved-bg)',
        'approved-fg':  'var(--status-approved-fg)',
        'approved-dot': 'var(--status-approved-dot)',
        'rejected-bg':  'var(--status-rejected-bg)',
        'rejected-fg':  'var(--status-rejected-fg)',
        'rejected-dot': 'var(--status-rejected-dot)',
        'executed-bg':  'var(--status-executed-bg)',
        'executed-fg':  'var(--status-executed-fg)',
        'executed-dot': 'var(--status-executed-dot)',
        'cancelled-bg': 'var(--status-cancelled-bg)',
        'cancelled-fg': 'var(--status-cancelled-fg)',
        'cancelled-dot':'var(--status-cancelled-dot)',
        'in-review-bg': 'var(--status-in-review-bg)',
        'in-review-fg': 'var(--status-in-review-fg)',
        'in-review-dot':'var(--status-in-review-dot)',
        'archived-bg':  'var(--status-archived-bg)',
        'archived-fg':  'var(--status-archived-fg)',
        'archived-dot': 'var(--status-archived-dot)',
      },
      action: {
        DEFAULT: 'var(--action-500)',
        50:  'var(--action-50)',
        100: 'var(--action-100)',
        200: 'var(--action-200)',
        300: 'var(--action-300)',
        400: 'var(--action-400)',
        500: 'var(--action-500)',
        600: 'var(--action-600)',
        700: 'var(--action-700)',
        800: 'var(--action-800)',
        900: 'var(--action-900)',
      },
      // PRIMITIVE SCALES — LOCKED 2026-04-17-rev10 (5 brand-tuned scales)
      primary: {
        0:   'var(--color-primary-0)',
        25:  'var(--color-primary-25)',
        50:  'var(--color-primary-50)',
        100: 'var(--color-primary-100)',
        200: 'var(--color-primary-200)',
        300: 'var(--color-primary-300)',
        400: 'var(--color-primary-400)',
        500: 'var(--color-primary-500)',  // Azul Afi
        600: 'var(--color-primary-600)',
        700: 'var(--color-primary-700)',
        800: 'var(--color-primary-800)',
        900: 'var(--color-primary-900)',
      },
      secondary: {
        0:   'var(--color-secondary-0)',
        25:  'var(--color-secondary-25)',
        50:  'var(--color-secondary-50)',
        100: 'var(--color-secondary-100)',
        200: 'var(--color-secondary-200)',
        300: 'var(--color-secondary-300)',
        400: 'var(--color-secondary-400)',
        500: 'var(--color-secondary-500)',  // Azul profundo
        600: 'var(--color-secondary-600)',
        700: 'var(--color-secondary-700)',
        800: 'var(--color-secondary-800)',
        900: 'var(--color-secondary-900)',
      },
      tertiary: {
        0:   'var(--color-tertiary-0)',
        25:  'var(--color-tertiary-25)',
        50:  'var(--color-tertiary-50)',
        100: 'var(--color-tertiary-100)',
        200: 'var(--color-tertiary-200)',
        300: 'var(--color-tertiary-300)',  // Gris Afi
        400: 'var(--color-tertiary-400)',
        500: 'var(--color-tertiary-500)',
        600: 'var(--color-tertiary-600)',
        700: 'var(--color-tertiary-700)',
        800: 'var(--color-tertiary-800)',
        900: 'var(--color-tertiary-900)',
      },
      neutral: {
        0:   'var(--color-neutral-0)',
        25:  'var(--color-neutral-25)',
        50:  'var(--color-neutral-50)',
        100: 'var(--color-neutral-100)',
        200: 'var(--color-neutral-200)',
        300: 'var(--color-neutral-300)',
        400: 'var(--color-neutral-400)',
        500: 'var(--color-neutral-500)',
        600: 'var(--color-neutral-600)',
        700: 'var(--color-neutral-700)',
        800: 'var(--color-neutral-800)',
        900: 'var(--color-neutral-900)',
        950: 'var(--color-neutral-950)',
      },
      'neutral-alt': {
        0:   'var(--color-neutral-alt-0)',
        25:  'var(--color-neutral-alt-25)',
        50:  'var(--color-neutral-alt-50)',
        100: 'var(--color-neutral-alt-100)',
        200: 'var(--color-neutral-alt-200)',
        300: 'var(--color-neutral-alt-300)',
        400: 'var(--color-neutral-alt-400)',
        500: 'var(--color-neutral-alt-500)',
        600: 'var(--color-neutral-alt-600)',
        700: 'var(--color-neutral-alt-700)',
        800: 'var(--color-neutral-alt-800)',
        900: 'var(--color-neutral-alt-900)',
      },
      // SEMANTIC — accent (Azul Afi) + control-neutral (warm gray for controls)
      accent: {
        DEFAULT: 'var(--accent-500)',
        50:  'var(--accent-50)',
        500: 'var(--accent-500)',
        600: 'var(--accent-600)',
        700: 'var(--accent-700)',
      },
      'control-neutral': {
        bg:                 'var(--control-neutral-bg)',
        'bg-alt':           'var(--control-neutral-bg-alt)',
        'bg-hover':         'var(--control-neutral-bg-hover)',
        'bg-disabled':      'var(--control-neutral-bg-disabled)',
        border:             'var(--control-neutral-border)',
        'border-hover':     'var(--control-neutral-border-hover)',
        'border-disabled':  'var(--control-neutral-border-disabled)',
        text:               'var(--control-neutral-text)',
        'text-placeholder': 'var(--control-neutral-text-placeholder)',
      },
      system: {
        error: {
          DEFAULT: 'var(--system-error-500)',
          50:  'var(--system-error-50)',
          100: 'var(--system-error-100)',
          500: 'var(--system-error-500)',
          600: 'var(--system-error-600)',
          700: 'var(--system-error-700)',
        },
        success: {
          DEFAULT: 'var(--system-success-500)',
          50:  'var(--system-success-50)',
          100: 'var(--system-success-100)',
          500: 'var(--system-success-500)',
          600: 'var(--system-success-600)',
          700: 'var(--system-success-700)',
        },
        warning: {
          DEFAULT: 'var(--system-warning-500)',
          50:  'var(--system-warning-50)',
          100: 'var(--system-warning-100)',
          500: 'var(--system-warning-500)',
          600: 'var(--system-warning-600)',
          700: 'var(--system-warning-700)',
        },
        info: {
          DEFAULT: 'var(--system-info-500)',
          50:  'var(--system-info-50)',
          100: 'var(--system-info-100)',
          500: 'var(--system-info-500)',
          600: 'var(--system-info-600)',
          700: 'var(--system-info-700)',
        },
      },
      border: {
        hairline: 'var(--border-hairline)',
        focus:    'var(--border-focus)',
      },
    },
    spacing: {
      // Numeric scale — base-4 (Tailwind 1 = 4px). Default Tailwind-style utility names.
      1:  'var(--dim-4)',
      2:  'var(--dim-8)',
      3:  'var(--dim-12)',
      4:  'var(--dim-16)',
      5:  'var(--dim-20)',
      6:  'var(--dim-24)',
      8:  'var(--dim-32)',
      10: 'var(--dim-40)',
      12: 'var(--dim-48)',
      14: 'var(--dim-56)',
      16: 'var(--dim-64)',
      20: 'var(--dim-80)',
      24: 'var(--dim-96)',

      // Namespaced `space-*` scale — SAME values, aliased under the `space-N` prefix.
      // This is what nearly every Coherence spec writes: `p-space-6`, `gap-space-4`,
      // `py-space-10`, `space-y-space-8`, `mb-space-5`. Without these keys, Tailwind
      // silently drops those classes → page renders at zero padding. LOCKED 2026-04-17-rev7.
      'space-0':  '0',
      'space-1':  'var(--dim-4)',
      'space-2':  'var(--dim-8)',
      'space-3':  'var(--dim-12)',
      'space-4':  'var(--dim-16)',
      'space-5':  'var(--dim-20)',
      'space-6':  'var(--dim-24)',
      'space-8':  'var(--dim-32)',
      'space-10': 'var(--dim-40)',
      'space-12': 'var(--dim-48)',
      'space-14': 'var(--dim-56)',
      'space-16': 'var(--dim-64)',
      'space-20': 'var(--dim-80)',
      'space-24': 'var(--dim-96)',
      'space-32': '128px',   // v1.1: promote to --dim-128 token if/when consumed frequently
    },
    borderRadius: {
      none: '0',
      sm:   'var(--radius-sm)',
      md:   'var(--radius-md)',
      lg:   'var(--radius-lg)',
      full: '9999px',
    },

    boxShadow: {
      sm: 'var(--shadow-sm)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
    },

    transitionDuration: {
      DEFAULT: 'var(--duration-base)',
      fast:    'var(--duration-fast)',
      slow:    'var(--duration-slow)',
    },

    transitionTimingFunction: {
      DEFAULT:       'var(--easing-standard)',
      enter:         'var(--easing-enter)',
      exit:          'var(--easing-exit)',
      standard:      'var(--easing-standard)',
      'spring-soft': 'var(--easing-spring-soft)',
    },

    fontFamily: {
      serif: ['Roboto Serif', 'serif'],
      sans:  ['Roboto', 'sans-serif'],
      mono:  ['Roboto Mono', 'monospace'],
    },

    fontSize: {
      display:         ['96px', { lineHeight: '112px', fontWeight: '400' }],
      title:           ['32px', { lineHeight: '40px',  fontWeight: '500' }],
      subtitle:        ['24px', { lineHeight: '32px',  fontWeight: '500' }],
      section:         ['20px', { lineHeight: '24px',  fontWeight: '500' }],
      'subtitle-body': ['20px', { lineHeight: '20px',  fontWeight: '400' }],
      body:            ['16px', { lineHeight: '24px',  fontWeight: '400' }],
      'body-lg-600':   ['16px', { lineHeight: '24px',  fontWeight: '600' }],
      'body-lg-500':   ['16px', { lineHeight: '24px',  fontWeight: '500' }],
      'body-md':       ['14px', { lineHeight: '20px',  fontWeight: '400' }],
      'body-md-600':   ['14px', { lineHeight: '20px',  fontWeight: '600' }],
      'body-md-500':   ['14px', { lineHeight: '20px',  fontWeight: '500' }],
      'body-sm':       ['12px', { lineHeight: '16px',  fontWeight: '400' }],
      'body-sm-600':   ['12px', { lineHeight: '16px',  fontWeight: '600' }],
      'body-sm-500':   ['12px', { lineHeight: '16px',  fontWeight: '500' }],
      button:          ['14px', { lineHeight: '14px',  fontWeight: '500' }],
      informe:         ['12px', { lineHeight: '14px',  fontWeight: '400' }],
    },
  },
},
```

## Brand manifest

`libs/tokens/brand/default.ts` — minimal manifest:

```ts
export interface BrandManifest {
  name: string;
  action: Partial<Record<'50'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900', string>>;
  fontDisplay?: string;
  fontText?: string;
  logoLight?: string;
  logoDark?: string;
}

export const defaultBrand: BrandManifest = {
  name: 'default',
  action: {}, // falls through to semantic defaults
};
```

`libs/tokens/brand/afi.ts` — v1 active brand:

```ts
import { BrandManifest } from './default';

export const afiBrand: BrandManifest = {
  name: 'afi',
  // LOCKED 2026-04-17-rev10: no action-scale override needed anymore. The semantic
  // `action-*` bucket now aliases directly to `color.secondary.*` (Azul profundo),
  // so Primary button gets the deep-blue surface natively. AFI IS the default
  // semantic assignment; brand manifests only need to override for NON-AFI brands.
  action: {},  // falls through to semantic default (= color.secondary.*)
  fontDisplay: 'Roboto Serif',
  fontText: 'Roboto Serif',
  logoLight: '/assets/brands/afi/logo-light.svg',
  logoDark: '/assets/brands/afi/logo-dark.svg',
};

// Notes:
// - Button primary's variants.ts reads `bg-action` / `hover:bg-action-600` /
//   `active:bg-action-700` — unchanged. Semantic `action-*` now aliases secondary
//   scale at the token layer, so the deep-blue rendering happens automatically.
// - Foreground text stays white; contrast vs #062D3F is ~15.7:1 (AAA).
// - Other brands (Santander, future banks) can override `action` in their manifest
//   to point at a different primitive scale (primary, or a custom brand scale).
```

## Pre-flight before commit

- [ ] `npx style-dictionary build` emits `dist/tokens.css` with all primitive + semantic vars
- [ ] `apps/site/` can resolve a Tailwind class using the new theme (manual probe: `<div class="bg-surface-quiet">` in app.component.html renders the right color)
- [ ] All five surface ladder tokens render (`base` / `quiet` / `muted` / `elevated` / `overlay`) — visible in `/producto/tokens/superficie` page
- [ ] All eight status estados emit their three tokens (bg/fg/dot) — visible by rendering `<afi-status-chip>` for each in a test harness
- [ ] AA contrast verified for every `status-{estado}-fg` on `status-{estado}-bg` pair (axe or manual per-pair check)
- [ ] No duplicate token names across primitive + semantic
- [ ] Every semantic token references a primitive via `{path.to.token}` syntax (Style Dictionary aliases)
- [ ] Brand manifests compile against `BrandManifest` interface
- [ ] No hex outside `libs/tokens/primitive/` — semantic layer references only
- [ ] `npm run lint` + `ng build site` pass

## Out of scope for this prompt

- Component code (later prompts)
- Dark mode brand variants (v1.1; token scale is designed to invert)
- Brand-swap UI (v2)
- Data-viz palette beyond a 5-hue default (Visa DS reference pull pending)

## If stuck

- Style Dictionary alias syntax: `"value": "{color.primitive.blue.500}"` — curly braces, dotted path.
- Tailwind + CSS vars: `colors: { x: 'var(--x)' }` is enough. No `hsl(var(--x))` trick needed unless splitting channels for opacity.
- Report the exact failing token name + the error. Do not improvise values.
