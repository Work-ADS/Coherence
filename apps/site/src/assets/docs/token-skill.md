# Token skill — agent rules for defining OR consuming tokens

## Three-layer architecture (LOCKED 2026-04-16)

Tokens follow a strict three-layer hierarchy:

1. **Primitive** — raw values. A color hex, a pixel number, a font-family string. No intent, no semantics. Lives in `libs/tokens/primitive/`.

2. **Semantic** — intent-named tokens that reference primitives. "What is this value FOR?" Lives in `libs/tokens/semantic/`.

3. **Brand** — the minimal manifest that maps semantic slots to a specific brand's visual identity. Overrides semantic defaults when a brand is active. Lives in `libs/tokens/brand/`. The manifest is TypeScript (not JSON) because it needs to build relative asset paths at compile time.

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

## JSON as source of truth

Primitive and semantic token values are defined in JSON files. CSS custom properties are generated from JSON — never hand-written. The JSON files are the canonical source; the CSS output is a build artifact.

## Brand manifest

The brand manifest (`libs/tokens/brand/`) declares which semantic slots a brand overrides. It uses a minimal-manifest + default-fallback pattern: few required fields, many optional. A brand that provides only an accent color and a logo still works — everything else falls back to the default manifest.

Font slots are first-class: `font-brand-display` and `font-brand-text` are swappable (confirmed by Santander shipping its own Headline family — the serif-swap slot is not hypothetical).

<!-- TODO: expand with naming + example tokens (strategy) -->
