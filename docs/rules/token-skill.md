# Token skill — agent rules for defining OR consuming tokens

## Three-layer architecture (LOCKED 2026-04-16)

Tokens follow a strict three-layer hierarchy:

1. **Primitive** — raw values. A color hex, a pixel number, a font-family string. No intent, no semantics. Current source files live under `libs/tokens/` (for example `dimensions.scss`, `elevation.scss`, and color/token partials).

2. **Semantic** — intent-named tokens that reference primitives. "What is this value FOR?" Current source of truth is `libs/tokens/semantic.scss` plus supporting token partials.

3. **Brand** — the minimal manifest that maps semantic slots to a specific brand's visual identity. Overrides semantic defaults when a brand is active. Current brand overrides live in the token layer and are applied through brand selectors such as `[data-brand="..."]`.

## 6 semantic buckets (LOCKED 2026-04-16)

Every semantic token belongs to exactly one bucket:

| Bucket | What it covers |
|---|---|
| **Canvas** | Page-level backgrounds, app shell surfaces |
| **Surface** | Cards, panels, elevated containers |
| **Action** | Buttons, links, interactive affordances — the primary brand-swappable color slot |
| **Control-neutral** | Inputs, selects, checkboxes, switches — neutral interactive elements |
| **System** | Error, warning, success, info — status communication |
| **Data-viz** | Chart colors, graph accents, data-specific palettes |

## Base-4 spacing scale (LOCKED 2026-04-16)

All spacing tokens use a base-4 scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. No odd pixel values. No spacing-by-feel. The scale is the scale.

## Current token source of truth

The current repo uses SCSS token source files under `libs/tokens/` as the canonical implementation. Components consume only the emitted CSS custom properties, never raw values and never Sass variables.

Some strategy docs still describe a future JSON → CSS generation pipeline. Treat that as a planned direction, not the current implementation. Until that migration happens, agents must edit the existing `libs/tokens/*.scss` files and regenerate any derived site data with the existing scripts.

## Brand manifest

The brand manifest / brand override layer declares which semantic slots a brand overrides. It uses a minimal-manifest + default-fallback pattern: few required fields, many optional. A brand that provides only an accent color and a logo still works — everything else falls back to the default manifest.

Font slots are first-class: `font-brand-display` and `font-brand-text` are swappable (confirmed by Santander shipping its own Headline family — the serif-swap slot is not hypothetical).

<!-- TODO: expand with naming + example tokens (strategy) -->
