# Coherence — White-Label Architecture and Operating Plan

A working document for the design system that powers AI demos across multiple client brands. Synthesized from the architecture decisions made this session — meant to be sharable with the boss, useful in a planning meeting, and durable as the spec changes.

---

## TL;DR

- Coherence is already ~90% built for white-labeling. Three-layer token system, `[data-brand]` switching, five brands wired, zero hardcoded color values in components.
- What's missing for the "modern and cool" ask: a separate axis for geometry and motion (the **skin** library), and a library of page-level **composition** shells. Brand alone swaps color — it doesn't make a product feel new.
- The cost curve is the proof point:
  - New brand for existing product: **~1 day**
  - New product on existing brand: **scales with product**
  - Existing product to existing brand: **~5 minutes config + QA**
- What does the most work in a demo: **motion personality + composition variety**, not palette. A "soft + sidebar" demo and a "sharp + hero" demo look like different products even on the same brand.

---

## Operating Procedures — the three flows

### Flow A. Existing product, NEW brand

**When:** A new client signs on. Their brand isn't in the token library yet.

**SOP:**

1. Collect assets from the client — full color ramp (50→900), typography stack, logo SVG, voice/copy register.
2. Create `libs/tokens/primitives/colors-<brand>.scss` defining their color ramp as `--color-<brand>-*` primitives.
3. Create `libs/tokens/brands/colors-<brand>.scss` with two blocks: one for `[data-brand="<brand>"]` (light) and one for `[data-brand="<brand>"][data-theme="dark"]` (dark). Both remap the semantic roles to the new primitives.
4. Append the `@import` line in `libs/tokens/variables.scss`. Add the brand to the demo picker in `apps/site` for internal review.
5. QA pass — render the product across all critical pages, lint for hardcoded colors, sign off.

**Timeline:** ~1 day with a clean palette provided. Add a day if you have to design the dark variant yourself.

---

### Flow B. Existing brand, NEW product

**When:** Building a new product (Risk Inspector, Trade Console, etc.) on a brand that's already in the library.

**SOP:**

1. Scaffold the Angular app — `apps/<product>/` using your standard generator.
2. Wire the token system — import `libs/tokens/variables.scss` in root styles. Zero token files to add.
3. Pick composition shells from `libs/layouts/` for the top-level pages (sidebar-shell, hero-stack, split-inspector, etc.).
4. Build product-specific pages by filling shell slots with `libs/ui/` components.
5. Set defaults in bootstrap: `<html data-brand="<brand>" data-skin="<skin>" data-theme="light">`. Ship.

**Timeline:** Scales with product surface. MVP in days, full product in weeks. Tokens add zero overhead.

---

### Flow C. Existing product, EXISTING brand — the cheap one

**When:** The product is already built. The brand is already in the library. You're rolling the same product out to another client.

This is the "we already did all the work, now it's just deployment" case. Both the code AND the brand pre-exist; you're just joining them via config.

**SOP:**

1. Confirm the target brand is in `libs/tokens/brands/` and has both light AND dark blocks defined.
2. Add an environment file: `apps/<product>/src/environments/<brand>.ts` carrying the brand identifier (and any product-specific overrides like logo path, legal footer).
3. Update the app's bootstrap to read the brand from environment and set `data-brand` on `<html>` at init.
4. Build with the new environment configuration — `nx build <product> --configuration=<brand>` (or your CI equivalent).
5. QA — render-check critical pages, swap brand-specific logos/copy/legal footers, ship.

**Timeline:** ~5 minutes for the config change, ~30 minutes for QA. The whole flow really is "flip an attribute and validate." This is the slide for the boss.

---

## Architecture

### The four axes

| Axis | What it owns | Selector |
|------|--------------|----------|
| Brand | Colors, typography, logo, voice register | `[data-brand="..."]` |
| Skin | Radii, borders, shadows, density, motion | `[data-skin="..."]` |
| Mode | Light or dark palette | `[data-theme="..."]` |
| Composition | Page structure (nav placement, region split) | Angular shell component |

These compose. A page is the cross-product: brand × skin × mode × composition. Three brands × five skins × two modes × four compositions = 120 distinct-feeling demos from one library.

### The three layers

Tokens live in three tiers:

1. **Primitives** — raw values, brand-agnostic. `--color-coral-500`, `--space-4`, `--radius-md`, `--duration-base`. Live in `libs/tokens/primitives/`.
2. **Semantic** — role-based, what components consume. `--brand-primary-background`, `--surface-base`, `--radius-control`. Lives in `libs/tokens/semantic.scss`.
3. **Component** (optional, Phase 2) — component-scoped slots. `--button-bg`, `--button-radius`, `--button-clip-path`. Lives in component SCSS files.

Components touch the semantic layer only. Themes and skins remap semantic tokens. Primitives are stable infrastructure.

### Where each axis writes

| Axis | Primitives | Semantic | Templates |
|------|-----------|----------|-----------|
| Brand | writes | writes | — |
| Skin | — | writes | — |
| Mode | — | writes | — |
| Composition | — | — | writes |

**Brand** is the only axis that touches two layers — it ships its own color ramp AND remaps semantic roles to that ramp. **Skin** and **Mode** only remap semantic tokens; they never invent new primitives. **Composition** doesn't touch tokens at all — it's Angular shell components arranging existing UI.

### How the cascade resolves

A page sets all axes on the root element:

```html
<html data-brand="unicaja" data-skin="soft" data-theme="dark">
```

CSS resolves in this order, each later selector winning on conflicting tokens:

```
:root                                          // primitives (AFI defaults)
[data-brand="unicaja"]                         // brand light identity
[data-brand="unicaja"][data-theme="dark"]      // brand dark inversion
[data-skin="soft"]                             // skin geometry overlay
[data-skin="soft"][data-theme="dark"]          // (rare) skin dark tweak
```

Specificity routes it: `[data-brand="unicaja"][data-theme="dark"]` (specificity 0,2,0) beats the generic `[data-theme="dark"]` (0,1,0). So Unicaja's dark wins when both are set. AFI dark applies as fallback if no brand is set.

---

## Dark mode lives inside each brand

Every brand SCSS file ships **both** a light block and a dark block. The brand owns its full palette across both modes — AFI doesn't get to decide what Unicaja's dark looks like.

```scss
// libs/tokens/brands/colors-unicaja.scss

[data-brand="unicaja"] {
  --brand-primary-background-default: var(--color-unicaja-500);
  --surface-base:                     var(--color-unicaja-50);
  --foreground-primary-default:       var(--color-unicaja-900);
  --border-default:                   var(--color-unicaja-200);
}

[data-brand="unicaja"][data-theme="dark"] {
  --brand-primary-background-default: var(--color-unicaja-200);
  --surface-base:                     var(--color-unicaja-900);
  --foreground-primary-default:       var(--color-unicaja-50);
  --border-default:                   var(--color-unicaja-600);
}
```

**Fallback:** AFI's existing global `[data-theme="dark"]` block stays as the AFI default and the system-wide fallback. Every other brand must define its own dark — otherwise AFI dark bleeds into their light palette and you get a half-AFI, half-client mess.

**Lint rule worth adding:** every brand SCSS must export both selectors. Cheap to enforce at build time, expensive to debug otherwise.

---

## The component contract — slot anatomy

A component declares its full set of "skin" slots **once**, even when the base theme sets them to nothing. This is the trick that makes white-labeling work without changing component code.

```scss
.btn {
  background:    var(--button-bg);
  color:         var(--button-fg);
  border:        var(--button-border, none);
  border-radius: var(--button-radius);
  padding:       var(--button-padding-y) var(--button-padding-x);
  box-shadow:    var(--button-shadow, none);
  font-weight:   var(--button-font-weight);
  transition:    all var(--button-duration) var(--button-ease);
}
```

The base theme sets `--button-border` to `none`. A client theme opts in by setting it to `1px solid var(--border-strong)`. The component never asks "does this theme have borders?" — the slot is always read, the value just changes.

If the slot doesn't exist on day one, every new client requires a code change and the abstraction collapses.

### Per-corner radii — CSS shorthand handles it

You don't need four separate radius tokens. CSS `border-radius` accepts shorthand inside a custom property:

```scss
[data-skin="asymmetric"] {
  --button-radius: 12px 2px 12px 2px;   // TL, TR, BR, BL
}

[data-skin="pill"] {
  --button-radius: 9999px;
}

[data-skin="banco-special"] {
  --button-radius: 4px 4px 8px 8px;     // top 4, bottom 8
}
```

The component reads `border-radius: var(--button-radius)` once. Per-corner shape is a skin-level decision. Same trick for `padding`, `margin`, `border-width`.

### For exotic shapes

If a skin needs something shorthand can't express (custom clip-path, gradient border, SVG mask), expose those as opt-in slots: `--button-clip-path`, `--button-mask`, `--button-bg-image`. Default to empty. The cost of an unused variable is zero; the cost of *not* having the slot is forking the component.

---

## Skins — the missing axis

Skins are the library of "looks" that swap geometry and motion. A skin file overrides only the geometric and motion semantic tokens:

```scss
// libs/tokens/skins/skin-soft.scss
[data-skin="soft"] {
  --radius-control:           12px;
  --radius-card:              18px;
  --radius-pill:              9999px;
  --border-width-default:     0;
  --shadow-elevated-default:  0 2px 12px rgba(0,0,0,0.06);
  --duration-base:            240ms;
  --easing-enter:             cubic-bezier(0.16, 1, 0.3, 1);
}

// libs/tokens/skins/skin-sharp.scss
[data-skin="sharp"] {
  --radius-control:           0;
  --radius-card:              0;
  --radius-pill:              0;
  --border-width-default:     1px;
  --shadow-elevated-default:  none;
  --duration-base:            120ms;
  --easing-enter:             cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Starter library worth building:** Soft, Sharp, Asymmetric, Glass, Brutalist, Editorial. Six skins is enough to give every brand demo a distinct identity.

**Cost:** A new skin file is a 3-hour job. Each one immediately lights up across every brand × product combination — leverage compounds.

---

## Compositions — the other axis (templates, not tokens)

Compositions are page-level structural choices: where nav lives, how regions split, what stacks vs. side-by-sides. They are **Angular shell components**, not SCSS. They do not touch tokens.

```
libs/layouts/
├── sidebar-shell.component.ts    // left nav rail + main content
├── hero-stack.component.ts       // big hero + content below
├── split-inspector.component.ts  // main + detail panel
├── bento-dashboard.component.ts  // grid of tiled cards
├── full-bleed.component.ts       // no chrome, canvas-style
└── terminal.component.ts         // monospace command-style
```

Each shell exposes content slots (`<ng-content select="[header]">`, `<ng-content select="[main]">`, etc.) that pages fill in. The shell handles structure; the contents are normal `libs/ui/` components consumed inside.

**Why composition is separate from skin:** skin makes a single *component* feel different (button shape). Composition makes a *page* feel different (where nav lives). A user opening a demo notices the page structure before they notice border radius. For "look modern at first glance," composition does more work than skin — but skins are how each composition stays distinctive across brands.

---

## Where Coherence is today

Already in place (from the scout pass of the repo):

- Three-layer token system at `libs/tokens/primitives/`, `libs/tokens/brands/`, `libs/tokens/semantic.scss`
- `[data-brand]` switching with five brands: AFI, AWM, Unicaja, Banco Cooperativo, Laboral Kutxa (Mutualidad stubbed)
- Dark mode via `[data-theme="dark"]` (currently AFI-only; other brands inherit AFI dark — needs per-brand dark blocks)
- Zero hardcoded hex values in `libs/ui/` components
- Brand picker in `apps/site` for internal review
- Bridge pattern for portalled components in `semantic.scss:698` (Banco Cooperativo case)

Gaps to close:

- No skin axis (`libs/tokens/skins/` doesn't exist)
- No composition library (`libs/layouts/` doesn't exist as a discrete library)
- Some components consume primitive tokens directly (e.g., `border-radius: var(--radius-md)` in button) when they should consume semantic role tokens (`--radius-control`, `--radius-card`). This blocks skins from cleanly overriding geometry without smashing the brand layer
- Mutualidad brand is a stub
- No lint rule enforcing the brand-light + brand-dark pairing
- Per-brand dark blocks not yet written (only AFI has a full dark mode)

---

## Migration plan

A reasonable phasing, smallest to biggest:

### Phase 1. Semantic rename sweep (foundation)

- Audit `libs/ui/` for components reading primitives directly.
- Add semantic alias tokens to `semantic.scss` (`--radius-control`, `--border-width-default`, `--shadow-elevated-default`, motion semantics if missing).
- Rename component-facing usage to the semantic names.
- No visual change — AFI defaults map semantics to the existing primitives.
- **Why first:** without this, skins can't cleanly override geometry.

### Phase 2. Add the skin axis

- Create `libs/tokens/skins/`.
- Ship three starter skins: Soft, Sharp, Asymmetric.
- Append imports to `variables.scss` after brands so skin wins the cascade on geometric tokens.
- Add a skin picker in `apps/site` mirroring the brand picker.
- Document the axis in `Design.md` (new section under §6 Foundations).

### Phase 3. Add the composition library

- Create `libs/layouts/`.
- Ship three starter shells: sidebar-shell, hero-stack, split-inspector.
- Refactor `apps/site` to use one of them (proof of concept).
- Document slot contracts per shell.

### Phase 4. Lint and tooling

- Build-time check: every brand SCSS exports both light and dark blocks.
- Build-time check: components don't import primitives directly (only semantics).
- Optional: JSON export of semantic tokens for Figma DevMode integration.

### Phase 5. Demo to the boss

- One "look at how cheap Flow C is" deliverable: same product, two clients, side-by-side.
- One "look at how varied our demos can be" deliverable: same product, two skins × two compositions, four screens.
- This is the meeting that resolves the strategy ambiguity.

---

## Open questions for the boss conversation

1. **Skin picker scope** — internal tool only (designers + demos) or do some clients get to choose their own skin?
2. **Composition starter set** — which 3–5 shells should we build first? Driven by what kinds of products we plan to demo over the next 6 months.
3. **Client priority** — when a new client signs on, who delivers the palette ramp (full 50→900) and the dark variant: us, the client's brand team, or split?
4. **Pattern picking authority** — does the boss pick the brand + skin per demo, or does the design team? Affects how the picker UI works in `apps/site`.
5. **Scope of "patterns"** — do we agree skin and composition are separate libraries that compose, or is the boss thinking of them as one bundle (the "Acme look" = these colors + these radii + this layout)?

---

## Decisions captured

- **Clients do not override** at any token layer. Coherence team owns brand wiring; clients ship a palette and we build it.
- **One brand per client; one skin per demo.** The boss picks; clients don't pick skins.
- **Skin and composition are separate axes.** Different libraries, different files, different layers in the cascade vs. template tree.
- **Dark mode lives inside each brand**, not as a top-level concern.
- **Motion + density + composition** carry "modern feel" more than palette does. This is the answer to the boss's "make it modern and cool" without rebuilding every brand.
- **Coherence is 90% there.** The remaining 10% is additive — skins + compositions + a semantic rename sweep. No rebuild of the existing brand or component layers.
