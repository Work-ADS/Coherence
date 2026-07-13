# Identity v2 — Button + Input · session brief

**Status:** ready to build · **Branch:** `feat/identity-v2` (continue on it or sub-branch)
**Prerequisite reading:** full AGENTS.md required-read order (11 entries), then this brief.

## What this session produces

1. **`afi-button-v2`** and **`afi-input-v2`** (working names — decide final naming first thing) in `libs/ui/src/`, 3-file convention, consuming ONLY `foundations-modern` tokens (`--color-*`, `--type-*`, `--radius-*`, `--motion-*`, `--elevation-*`…). Parallel to the legacy primitives — do NOT restyle `afi-button`/`afi-input`; old pages have no `data-foundation` attribute and would break.
2. **A workbench demo page** (e.g. `/demos/foundations-modern/workbench`), wrapped in `<site-demo-shell>`, with `data-foundation="modern"` on its root element, showing every variant × size × state grid for both components. Throwaway chrome, minimal styling — it later grows into the component moodboard for Borja.

## Sources of truth (in priority order)

1. **Figma components:** file `xa3QosoCWiPdvRvgfQ5FaE` — pages `Button` (2280:1133) and `Input` (2280:1134). Read via get_design_context / get_screenshot. Components are "definition of done: zero unbound values, then frozen".
2. **Tokens in code:** `libs/tokens/foundations-modern/` (mirrored + verified 2026-07-13). If the Figma component binds a variable, the same-named CSS var exists.
3. Granola specs (Jul 8–10 sessions): button variants primary/secondary/ghost/destructive · sizes XS–LG (heights 24/28/32/40 = `--height-component-*`) · states default/hover/pressed/disabled/loading. Input sizes SM/MD/LG, states default/hover/focus/error/disabled/read-only, label + help text + prefix/suffix (text and icon).

## Pressed + raised treatments — from EFFECT STYLES (not variables)

Confirmed intentional by Richard: primary and secondary have different pressed inner shadows. Values captured from Figma 2026-07-13 (offset x,y · blur · spread · color):

| Style | Layers |
|---|---|
| `Elevation/pressed` (primary) | inset 0 1px 8px 0 #000000e5 · drop 0 4px 10px 0 #00000029 |
| `Elevation/pressed/secondary` | inset 0 1px 2px 0 #3e3e3ee5 · drop 0 4px 10px 0 #00000029 |
| `Elevation/Raised` (dark/primary surface) | inset 0 -1px 0 1px #000000cc · inset 0 0 0 1px #303030 · inset 0 0.5px 0 1px #ffffff40 |
| `Elevation/Raised-Neutral` | inset 0 -1px 0 0 #b5b5b5 · inset 0 0 0 1px #0000001a · inset 0 0.5px 0 1.5px #ffffff |
| `Elevation/Raised-Danger` | inset 0 -1px 0 1px #8e1f0bcc · inset 0 0 0 1px #b5260bcc · inset 0 0.5px 0 1.5px #ffffff59 |

These are the reverse-engineered Shopify Polaris button treatments. Hard-code them in the component SCSS (they can't be variables in Figma either); comment each with its style name.

## Constraints

- Focus ring: `--borders-focus` (currently info blue — brand color pending Borja; do not invent).
- Motion: `--motion-*` tokens are the contract; curves may be refined in code (Richard wants smoother-than-Figma animation — springs OK, but keep durations/easings tokenized).
- Loading-button animation (shrink/expand) was flagged in Granola as "prototype in code before committing" — build the simple spinner state first, prototype the fancy version in the workbench only.
- RAE copy rules for any visible text (copy-skill.md); a11y per accessibility.md (focus-visible, aria-busy on loading, input labelling/described-by).
- Pre-flight (`docs/build-prompts/_pre-flight.md`) before handoff; tester agent verifies against this brief.

## Out of scope

Select/menu (next components after these two), documentation pages (come with the site restructure), dark mode values, brand accent, the moodboard's curated presentation.
