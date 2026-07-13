# Identity v2 — token export audit (zip vs Figma)

**Date:** 2026-07-13 · **Branch:** `feat/identity-v2`
**Sources:** `tokensv3.zip` (Token Studio, free = no mode linking) vs live Figma variables in AFI-FOUNDATIONS-MODERN (`xa3QosoCWiPdvRvgfQ5FaE`), read via Plugin API.

## Verdict

**Every live value in the zip matches Figma exactly.** But the zip also carries ~366 stale tokens from older set generations, and the Figma file itself has a handful of issues worth fixing. Seed `libs/tokens/` ONLY from the sets marked live below.

## Live sets (source of truth for code seeding)

| Collection (Figma) | Count | Zip file to use | Match |
|---|---|---|---|
| Primitive Numbers | 141 · 1 mode | `Primitive Numbers/Primitive numbers.json` | ✓ exact |
| Primitive Colors | 100 · 1 mode | `Primitive Colors/V4 Primitive colors.json` (**only** groups: primary, neutral, control, warning, error, info, success, data-viz) | ✓ except 2 export gaps (below) |
| Primitive Type | 9 · 1 mode "Traditional" | `Primitive Type/Traditional.json` (IBM Plex Sans) | ✓ exact |
| Primitive Elevation | 97 · 1 mode | `Primitive Elevation/Primitive elevation.json` | ✓ (one α-rounding nit e5/e6) |
| Semantic Colors | 69 · 2 modes | `Semantic Colors/semantics V3.json` (mode 1, only the 69 shared names) + `Mode.json` (mode 2) | ✓ exact |
| Semantic Typography | 48 · 1 mode | `Semantic Typography/Mode 1.json` — only the 48 names matching Figma | ✓ exact |
| Semantic Dimensions | 52 · 1 mode | `Semantic Dimensions/Mode 1.json` | ✓ exact |
| Semantic Spacing | 12 · 6 breakpoint modes | `Semantic Spacing/<bp>.json` × 6 | ✓ exact, all 72 values |

## Stale content in the zip — EXCLUDE when seeding

1. `Primitive Type/Mode 1.json` — old Roboto Serif mode (8 tokens). No such mode in Figma anymore.
2. `Semantic Typography/Mode 1.json` — 45 of its 93 tokens are the old component-scoped generation (`text.*`, `heading.text.*`, `field.text.*`, `button.text.{size,weight,line-height}.{sm,md,lg}`, `caption.text.*`, `label.text.*`, `label.size.{sm,md}`). Not in Figma.
3. `Primitive Colors/V4 Primitive colors.json` — 130 of its 228 are stale: `nuetral.*` (12, misspelled duplicate) and `primitives.*` (118, old generation).
4. `Semantic Dimensions/<breakpoint>.json` × 6 (70 tokens each) — the OLD responsive dimension system (border-radius/spacing/size/canvas/section/button/field…). Only `Mode 1.json` is live; responsive spacing now lives in Semantic Spacing.
5. `Semantic Colors/semantics V3.json` — 171 `semantic.color.*` tokens (brand.primary/secondary/tertiary states, control, nav.item, input, feedback, chart, overlay, surface, canvas, foreground…) that do **NOT exist in Figma**. **OPEN QUESTION for Richard:** are these the pending "yellow-highlighted tokens" the doc-site agent flagged for creation (Granola Jul 10), i.e. the next-gen semantic layer to adopt — or abandoned WIP to ignore?

## Zip export gaps (exist in Figma, missing from zip)

- `primary/700/20` (#3f3f4633) and `neutral/500/20` (#343a4033) — the two alpha primitives. Their absence explains the zip's only dangling refs (`borders.selected`). Take values from Figma.
- `data-viz/monochrome/1,7,8,9,10` alias variables in an **external library** (`Secondary/25`, `Secondary/900`, `Tertiary/700|500|300` — current-brand placeholders, per Richard). Dangling in the zip; map manually to the existing brand ramps in `libs/tokens` when seeding.

## Issues found in FIGMA itself (fix upstream, not blockers)

1. **Duplicate primitive:** `dimension-0-36 = 1.5` AND `dimension-0-375 = 1.5`. 0.36×4 = 1.44, so `0-36` is misnamed; `stroke/medium` uses `0-375`. Delete `0-36` if nothing binds it.
2. **Dark mode not authored:** 65/69 semantic colors identical in both modes (only `borders/strong`, `borders/selected`, `brand/background/pressed`, `disabled/background` differ). Doc page's "light and dark theme support" overpromises for now.
3. **Primitive Type mode named "Traditional" holds IBM Plex Sans** — leftover name, worth renaming. Also `font/weight/light = 100` (thin, and the locked direction says skip light).
4. **Typography nesting inconsistency:** `caption/size/size`, `label/size/size`, `button/text/size/size`, `table/size/size`, `code/size/size` carry an extra level vs `h1/size`. Normalize (in Figma ideally; otherwise flatten in the transformer).
5. **Casing inconsistency:** `content/Primary|Secondary|Tertiary|Disabled|Placeholder|Inverse` capitalized leaf names.
6. **chart/**\* semantics are placeholder wiring — grid/axis/labels/comparison/forecast/neutral all alias `data-viz/series/1–3`. Known (colors deferred).
7. **Elevation `type` strings inconsistent:** `boxShadow` vs `box shadow` vs `inner shadow` — transformer must not switch on the raw string.
8. **Start-here doc page counts stale:** claims 497 total / PN 139 / PC 98 / ST 45 / SD 41 / PE 84; actual 528 / 141 / 100 / 48 / 52 / 97. Regeneration already on the Granola task list.
9. `help` type style = 10px — a11y watch item.

## Cleanup verification — 2026-07-13 (post-cleanup, VERIFIED against live Figma)

All 7 cleanup items confirmed done; **zero dangling aliases** file-wide. Item 7's counts had drifted (the cleanup's own deletions changed them); fixed directly via plugin API (nodes 2097:116/136/150/215/244/276/288).

**Seeding baseline (locked):** 526 tokens total —
Primitive Numbers **140** · Primitive Colors **100** · Primitive Type **8** (mode **"Modern"**, IBM Plex Sans, no `light`) · Primitive Elevation **97** (`pressed/inner-shadow`, `pressed/box-shadow`, type strings `boxShadow`/`innerShadow`) · Semantic Colors **69 × 2 modes** (`content/*` lowercase; dark mode still unauthored) · Semantic Typography **48** (clean 2-level names: `caption/size`, `button/weight`, …) · Semantic Dimensions **52** · Semantic Spacing **12 × 6 breakpoints**.

## Known Jun/Jul bug check

The Granola Jul 10 "6 export bugs" (e.g. `border-strong-neutral-100` inverted): `borders/strong` now reads light=`neutral/700` / dark=`neutral/100` — a correct flip. Since the zip now matches Figma exactly on all live sets, the fixed state is what we have.
