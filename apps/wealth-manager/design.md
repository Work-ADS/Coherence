# Design — Wealth Manager

> AFI's B2B wealth-advisor platform, on PrimeNG + Angular. This file is the short rulebook. PrimeNG owns components; we own brand + rules.

## Overview

**Source of truth (Figma):** [AFI Coherence — Wealth Manager Components](https://www.figma.com/design/hL750HPQWB6JDgki0PIUtG/Afi-Coherence-Wealth-manager-components)

This system is **PrimeNG + AFI brand**. We keep PrimeNG's **Slate** as the surface/text ramp — chosen for contrast in our data-dense UI. We swap the primary to **AzulProfundo** (`#062D3F`) in light mode and **AzulAfi** (`#33A7DB`) in dark mode: one role, two palettes, auto-routed by mode. All numbers (spacing, radius, border, size) flow through a three-tier pipeline: **AFI Primitives → Semantic numbers → AFI Custom Semantics** (for PrimeNG component overrides). Minimum viewport: **tablet**. Don't add new scales.

## Philosophy

- **PrimeNG owns components. We own brand + rules.** If PrimeNG ships a component, use it. Don't rebuild.
- **Surface ramp = text + surfaces.** Slate does both. This is the monochrome look — intentional, not a constraint.
- **One action role, two palettes, auto-routed.** Light mode → AzulProfundo. Dark mode → AzulAfi. You never pick between them by hand.
- **Severity only ever means severity.** Success/info/warn/help/danger carry meaning; don't use them for decoration.
- **Tablet is the floor.** We don't design for phones.

---

## Token architecture (three tiers)

Every design decision lives at exactly one tier. A new token goes in the lowest tier that makes it reusable.

### Tier 1 — AFI Primitives
Raw atoms. `number`, `color`, `font`. No intent, no semantics. **Never reference primitives directly from components.** Components consume Tier 2 (semantics). Tier 1 exists so Tier 2 has something to reference — nothing else.

### Tier 2 — Semantic numbers
Aliases over primitives with meaning: `spacing/md`, `border-radius/lg`, `size/xl`. Answers "what is this value *for*?" This is where most component styling pulls from.

### Tier 3 — AFI Custom Semantics
PrimeNG component-level overrides — `p-menubar/padding/y`, `p-datatable/padding/normal`, etc. **The default is to plug Tier 2 directly into PrimeNG's component variables — Tier 2 is what we ship to PrimeNG.** Tier 3 only exists for the two gap cases where direct Tier 2 plug-in doesn't work: (a) slots PrimeNG's Figma library doesn't expose, and (b) slots where the PrimeNG API forces a hack / wrapper. Every Tier 3 entry still resolves to a Tier 2 reference.

**Rule:** if you're about to add a Tier 3 token, first check whether you can just plug a Tier 2 token into PrimeNG directly. Tier 3 is for PrimeNG plumbing gaps, not for new design intent.

---

## Tier 1 — AFI Primitives

### `number` (30 values)

Named `dimension-N`. Base-2 with sensible jumps:

```
0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32,
36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 88, 96, 112, 999
```

`dimension-999` is the "full" radius sentinel (pills, fully rounded).

### `color` — 7 palettes

**Convention:** in every primitive color scale, step `500` is the brand/anchor color for that scale. Tints sit below; shades sit above.

#### `azulprofundo` — deep brand navy (primary, light mode)

| Step | Hex |
|---|---|
| 50  | `#E6EEF2` |
| 100 | `#CCDDE5` |
| 200 | `#99BBCB` |
| 300 | `#6699B1` |
| 400 | `#337797` |
| 500 | `#062D3F` |
| 600 | `#052635` |
| 700 | `#041F2B` |
| 800 | `#031821` |
| 900 | `#021117` |
| 950 | `#010810` |

#### `azulafi` — bright brand blue (primary, dark mode; accents in light)

| Step | Hex |
|---|---|
| 50  | `#E6F4FB` |
| 100 | `#CCE9F6` |
| 200 | `#99D3ED` |
| 300 | `#66BDE4` |
| 400 | `#33A7DB` |
| 500 | `#0085CA` |
| 600 | `#006EA7` |
| 700 | `#005584` |
| 800 | `#003C61` |
| 900 | `#00243D` |
| 950 | `#001826` |

#### `grisafi` — AFI-owned grays (accents only — *not* the surface ramp)

| Step | Hex |
|---|---|
| 50  | `#F4F8FA` |
| 100 | `#EDF3F6` |
| 200 | `#E2EDF2` |
| 300 | `#D6E4EA` |
| 400 | `#C8DCE4` |
| 500 | `#C8DAE2` |
| 600 | `#AFC2C9` |
| 700 | `#87979D` |
| 800 | `#5F6C70` |
| 900 | `#373F43` |
| 950 | `#1F2528` |

#### `blancoafi` — off-whites / light grays

| Step | Hex |
|---|---|
| 50  | `#FFFFFF` |
| 100 | `#FAFAFA` |
| 200 | `#F7F7F7` |
| 300 | `#F5F5F5` |
| 400 | `#F4F4F4` |
| 500 | `#F3F3F3` |
| 600 | `#DADADA` |
| 700 | `#BFBFBF` |
| 800 | `#8F8F8F` |
| 900 | `#5F5F5F` |
| 950 | `#2F2F2F` |

#### `graphics` — semantic aliases for illustrations and charts

| Name | Hex |
|---|---|
| `azulprofundo` | `#062D3F` |
| `azulclaro`    | `#37BBF4` |
| `grisafi`      | `#C8DAE2` |
| `blancoafi`    | `#F3F3F3` |

#### `positivevalues` — gains, uptrend, success tint (charts)

| Step | Hex |
|---|---|
| 100 | `#C6F3C6` |
| 500 | `#72C971` |
| 900 | `#367B35` |

#### `negativevalues` — losses, downtrend, error tint (charts)

| Step | Hex |
|---|---|
| 300 | `#EB8787` |
| 700 | `#EB5656` |

### `font` (4)

| Slot | Value |
|---|---|
| `typeface`        | `Roboto` |
| `weight/regular`  | 400 |
| `weight/medium`   | 500 |
| `weight/semibold` | 600 |

---

## Tier 2 — Semantic numbers

Every Tier 2 token references a `number/dimension-N` primitive.

### `border-radius` (7)

| Token | Primitive | px |
|---|---|---|
| `none` | `dimension-0`   | 0 |
| `sm`   | `dimension-4`   | 4 |
| `md`   | `dimension-8`   | 8 |
| `lg`   | `dimension-12`  | 12 |
| `xl`   | `dimension-16`  | 16 |
| `2xl`  | `dimension-24`  | 24 |
| `full` | `dimension-999` | 999 (pill) |

### `spacing` (15)

| Token | Primitive | px |
|---|---|---|
| `none`         | `dimension-0`  | 0 |
| `xxs`          | `dimension-2`  | 2 |
| `xs`           | `dimension-4`  | 4 |
| `sm`           | `dimension-6`  | 6 |
| `md`           | `dimension-8`  | 8 |
| `lg`           | `dimension-12` | 12 |
| `xl`           | `dimension-16` | 16 |
| `2xl`          | `dimension-20` | 20 |
| `3xl`          | `dimension-24` | 24 |
| `4xl`          | `dimension-28` | 28 |
| `5xl`          | `dimension-32` | 32 |
| `spacing-6xl`  | `dimension-36` | 36 |
| `spacing-7xl`  | `dimension-40` | 40 |
| `spacing-8xl`  | `dimension-48` | 48 |
| `spacing-9xl`  | `dimension-56` | 56 |

### `border` (4)

| Token | Primitive | px |
|---|---|---|
| `none`    | `dimension-0` | 0 |
| `thin`    | `dimension-1` | 1 |
| `default` | `dimension-2` | 2 |
| `thick`   | `dimension-4` | 4 |

### `size` (13) — icon, control, and target heights

| Token | Primitive | px |
|---|---|---|
| `none` | `dimension-0`  | 0 |
| `3xs`  | `dimension-4`  | 4 |
| `2xs`  | `dimension-8`  | 8 |
| `xs`   | `dimension-12` | 12 |
| `sm`   | `dimension-16` | 16 |
| `md`   | `dimension-20` | 20 |
| `lg`   | `dimension-24` | 24 |
| `xl`   | `dimension-32` | 32 |
| `2xl`  | `dimension-36` | 36 |
| `3xl`  | `dimension-40` | 40 |
| `4xl`  | `dimension-48` | 48 |
| `5xl`  | `dimension-56` | 56 |
| `6xl`  | `dimension-64` | 64 |

---

## Tier 3 — AFI Custom Semantics (PrimeNG component overrides)

22 tokens across 9 PrimeNG components — each one covers a slot where we couldn't plug Tier 2 straight into PrimeNG (either the slot isn't in PrimeNG's Figma library, or the PrimeNG API forces a hack). Every token still references Tier 2.

| Component | Token | References |
|---|---|---|
| `p-menubar` | `padding/y` | `spacing/md` |
| `p-menubar` | `padding/horizontal/left` | `spacing/lg` |
| `p-menubar` | `padding/horizontal/right` | `spacing/2xl` |
| `p-menubar` | `item/padding` | `spacing/md` |
| `p-breadcrumb` | `padding/vertical` | `spacing/md` |
| `p-toggleswitch` | `content/gap` | `spacing/md` |
| `p-tag` | `padding/x` | `spacing/sm` |
| `p-tag` | `padding/y` | `spacing/xxs` |
| `p-tag` | `icon/border/weight` | `border/thin` |
| `p-inputtext` | `content/gap` | `spacing/md` |
| `p-field` | `normal/height` | `size/2xl` |
| `p-field` | `small/height` | `size/xl` |
| `p-datatable` | `height/normal` | `spacing/spacing-6xl` |
| `p-datatable` | `height/small` | `spacing/4xl` |
| `p-datatable` | `height/large` | `spacing/spacing-8xl` |
| `p-datatable` | `padding/normal` | `spacing/lg` |
| `p-datatable` | `padding/small` | `spacing/md` |
| `p-datatable` | `padding/large` | `spacing/xl` |
| `p-datatable` | `edge cells/padding` | `spacing/2xl` |
| `p-menu` | `item/padding/x` | `spacing/lg` |
| `p-menu` | `item/padding/y` | `spacing/md` |
| `card` | `padding` | `spacing/md` |

---

## Themed values

### Surface ramp — Slate (Light + Dark, 1:1)

Surface 50–950 maps 1:1 to PrimeNG Slate in both modes. Surface `0` is pure white in both modes — reserved for data canvases / content surfaces that shouldn't invert.

| Surface | Token | Hex |
|---|---|---|
| 0   | —           | `#FFFFFF` |
| 50  | `slate/50`  | `#F8FAFC` |
| 100 | `slate/100` | `#F1F5F9` |
| 200 | `slate/200` | `#E2E8F0` |
| 300 | `slate/300` | `#CBD5E1` |
| 400 | `slate/400` | `#94A3B8` |
| 500 | `slate/500` | `#64748B` |
| 600 | `slate/600` | `#475569` |
| 700 | `slate/700` | `#334155` |
| 800 | `slate/800` | `#1E293B` |
| 900 | `slate/900` | `#0F172A` |
| 950 | `slate/950` | `#020617` |

**Usage conventions:**
- `surface/0` — content canvases where white is semantically required (data grid backgrounds, print-style reports).
- `surface/50`–`surface/100` — page background, card tint.
- `surface/200`–`surface/300` — borders, dividers, disabled control fills.
- `surface/400`–`surface/500` — muted text, secondary labels, placeholder text.
- `surface/700`–`surface/900` — primary body text, headings.
- `surface/950` — max-contrast text (rare).

### Primary — mode-swapped (AzulProfundo ↔ AzulAfi)

One role, two palettes, auto-routed by mode. Default `color` slot = `500` in light, `400` in dark.

| Primary | Light (AzulProfundo) | Dark (AzulAfi) |
|---|---|---|
| `color` (default) | `#062D3F` (`primary/500`) | `#33A7DB` (`primary/400`) |
| 50  | `#E6EEF2` | `#E6F4FB` |
| 100 | `#CCDDE5` | `#CCE9F6` |
| 200 | `#99BBCB` | `#99D3ED` |
| 300 | `#6699B1` | `#66BDE4` |
| 400 | `#337797` | `#33A7DB` |
| 500 | `#062D3F` | `#0085CA` |
| 600 | `#052635` | `#006EA7` |
| 700 | `#041F2B` | `#005584` |
| 800 | `#031821` | `#003C61` |
| 900 | `#021117` | `#00243D` |
| 950 | `#010810` | `#001826` |

**Button-level AzulProfundo states** (light mode):

| Role | Hex |
|---|---|
| default | `#062D3F` |
| hover | `#052635` |
| active | `#041F2B` |
| contrast (text on it) | `#FFFFFF` |
| outlined border | `#99BBCB` |
| text/outlined hover bg | `#E6EEF2` |
| text/outlined active bg | `#CCDDE5` |

### Severity — PrimeNG defaults, kept as-is

| Role | Hex | Use for |
|---|---|---|
| success | `#22C55E` | A user action succeeded. Past-tense confirmation: saved, approved, transferred, completed. |
| info    | `#0EA5E9` | A neutral fact the user should know. "Markets open at 9:30." Not an instruction. |
| warn    | `#F97316` | Proceed with caution — the action is allowed but has consequences. "Leaving this page will discard changes." |
| help    | `#A855F7` | Learning / discovery guidance. Tooltips, onboarding, "what is this?" explainers. Answers *why / how*. |
| danger  | `#EF4444` | Destructive or error. Failed transactions, validation errors, delete confirmations. |

**Info vs help — the confusing pair:** *info is a fact, help is a lesson.*

### Radius

| Role | px | Token |
|---|---|---|
| default | 6 | — (use `border-radius/md` = 8 for new work; `6` is PrimeNG's current component-level value) |
| rounded | 24 | `border-radius/2xl` |

> The `6` vs `8` mismatch between the PrimeNG button radius and `border-radius/md` is a known drift. Prefer `border-radius/md` (8) for anything outside PrimeNG's pre-themed components.

### Shadow — raised

Triple drop-shadow stack for elevated surfaces (raised buttons, floating panels):

```
0 1px 5px 0 rgba(0,0,0,0.12),
0 2px 2px 0 rgba(0,0,0,0.14),
0 3px 1px -2px rgba(0,0,0,0.20)
```

Use for: raised buttons, floating menus, active dropdowns. Not for: cards (use border), modals (use backdrop).

### Typography — Roboto

**Why Roboto and not Roboto Serif:** this is a data-dense B2B product (tables, KPIs, long forms) used all day by advisors. Roboto stays readable at small sizes and tight line-heights. Roboto Serif is AFI's brand font, reserved for brand/marketing/editorial surfaces where tone matters more than density.

**Weights:** `regular 400 · medium 500 · semibold 600`.

**Headings:**

| Style | Size / LH | Use for |
|---|---|---|
| Display  | 96 / 112 | Hero / empty-state headline, once per screen max. |
| Title    | 32 / 40  | Page title. |
| Subtitle | 24 / 32  | Section header. |
| Body     | 16 / 24  | Heading-context body copy (above content blocks). |

**Body** — three sizes × three weights (400 / 500 / 600):

| Size | Size / LH | Use for |
|---|---|---|
| Large  | 16 / 24 | Default copy in dialogs and cards with breathing room. |
| Medium | 14 / 20 | **The workhorse** — tables, forms, side panels, dashboards. |
| Small  | 12 / 16 | Metadata, captions, table footnotes. |

### Icons — Lucide

**Library:** [Lucide](https://lucide.dev) (`lucide-angular` in code). One icon set across the whole product — don't mix in PrimeIcons, Heroicons, or Material icons.

**Default sizing:** stroke `1.5`, size `20px` for inline UI (toolbars, nav, buttons), `16px` for dense table cells, `24px` for empty-state / page-header illustrations.

**Color:** icons inherit `currentColor` — no hard-coded fills. Drive color from the surrounding text/control color so they pick up surface and severity context automatically.

**Don't:** ship a one-off SVG when a Lucide glyph exists. If Lucide doesn't have what you need, propose adding a custom icon to the brand asset folder — don't paste raw SVGs into components.

---

## Components

PrimeNG docs are the source for component APIs. This section documents *our* usage rules only.

### Buttons

Sizes — pulled from component tokens:

| Size | Font size | Padding X/Y | Icon-only width |
|---|---|---|---|
| sm | 12    | 8 / 6 | 24 |
| md (default) | — | 8 / 8 | 36 |
| lg | 15.75 | 8 / 8 | 40 |

Label weight `500` · gap between icon and label `8`.

**Variants:**
- **Primary** — one per action group. The thing the user should do.
- **Secondary** — alternative actions. Neutral fill.
- **Text / outlined** — low-emphasis, inside dense layouts (tables, toolbars).
- **Rounded** — `border-radius/2xl` (24). Use for pill-shaped filter chips and status-adjacent actions, not general CTAs.
- **Raised** — triple-shadow. Use sparingly for attention-grabbing primary actions on light surfaces.

### Cards

- Border-first by default: `1px solid surface/200`, `border-radius/md` (8), no shadow.
- Shadow only for elevated / active states (drag, selected, modal).
- Padding: `spacing/md` (8) minimum, `spacing/lg` (12) for content-heavy cards.

### Inputs (`p-field` / `p-inputtext`)

- Heights are fixed by `p-field`: `normal = size/2xl` (36), `small = size/xl` (32).
- Content gap inside input: `8` (`p-inputtext/content/gap`).
- Labels: stacked by default (label above input) — see Responsiveness for when inline labels apply.

### Tables (`p-datatable`)

- Row heights — `normal = 36` (`spacing/spacing-6xl`), `small = 28` (`spacing/4xl`), `large = 48` (`spacing/spacing-8xl`).
- Padding — `normal = 12`, `small = 8`, `large = 16`.
- Edge cells get extra padding (`spacing/2xl` = 20) so data doesn't touch the container.
- Body text: **Body/Medium 400** (14/20). Tabular numerals on numeric columns.

### Menus (`p-menu`, `p-menubar`)

- Item padding — `spacing/lg` horizontal, `spacing/md` vertical.
- Menubar has asymmetric horizontal padding (`lg` left, `2xl` right) — deliberate, gives right-side actions more breathing room.

### Dialogs / overlays

- Use PrimeNG's built-in backdrop; don't overlay custom scrims.
- Max-width on desktop; near full-width on tablet (see Responsiveness).

### Tags

- `padding/x = spacing/sm` (6), `padding/y = spacing/xxs` (2).
- Use AFI accent palettes (`azulafi`, `positivevalues`, `negativevalues`) for semantic tags — *not* severity colors (those are reserved for status messaging).

---

## Layout & Responsiveness

**Rule of thumb:** *Tablet is the floor. Desktop (1440+) is the default. We don't design for phones.*

**Breakpoints (three, not five):**

| Name | ≥ px | What it is |
|---|---|---|
| `md` | 768  | Tablet portrait — the floor. Minimum supported viewport. |
| `lg` | 1024 | Tablet landscape / small laptop. |
| `xl` | 1440 | Desktop — advisors on real monitors. The default design width. |

Deliberately dropped: `sm` (phone) and `2xl` (ultra-wide). Naming them would imply support we don't provide.

**Per-surface rules (what we commit to):**

| Surface | At `md` (tablet) | At `lg+` (laptop/desktop) |
|---|---|---|
| Data tables | Horizontal scroll, first column sticky. | Full columns visible. |
| Side nav | Drawer / overlay, hamburger trigger. | Persistent sidebar. |
| Forms | Stacked labels (label above input). | Inline labels (label left, input right). **Max 3 fields per row** — beyond that, stack into the next row or split the form. |
| Cards / KPI grids | 2 columns. | 3–4 columns. |
| Dialogs / drawers | Near full-width. | Fixed max-width. |

**Why only these:** PrimeNG components flex fluidly, surfaces don't change, type scale doesn't need to scale. The real decisions are at the *layout* level — tables, nav, forms, grids, overlays. Five rules cover ~95% of screens.

---

## Anti-patterns

- **Don't introduce new color scales.** Surface = Slate. Primary = AzulProfundo (light) / AzulAfi (dark), auto-routed. Severity = PrimeNG defaults. AFI palettes (`grisafi`, `blancoafi`, `positivevalues`, `negativevalues`, `graphics`) are for accents only.
- **Don't hand-pick hexes or numbers.** Use a Tier 2 (semantic) token. If the value you need isn't there, propose adding it — don't inline it.
- **Don't reach into Tier 1 from a component.** Components consume semantics, not primitives. If the value you need has no Tier 2 token, add one — don't shortcut to a `dimension-N` or a raw palette step.
- **Don't manually swap the primary color based on mode.** Routing is automatic. If you're picking between `azulprofundo` and `azulafi` by hand, you're working against the system.
- **Don't call the primary color "primary" in conversation or docs.** Use **AzulProfundo** (light) / **AzulAfi** (dark). Saying "primary" invites confusion with `azulafi` (which IS a primary brand color, just not *the action color in light mode*).
- **Don't design for phones.** If a screen has to work on phone, that's a separate product decision — not a design system update.

---

*Last updated 2026-04-23. Maintained by the AFI design team.*
