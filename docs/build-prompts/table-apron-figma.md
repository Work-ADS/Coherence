# Figma build prompt — Table apron (identity v2 · AFI-FOUNDATIONS-MODERN)

**For:** building the `Table apron` component **in Figma**, inside the
`AFI-FOUNDATIONS-MODERN` file, to match the shipped primitive
`libs/ui/src/table-apron/` (`<afi-table-apron>`). Keep Figma and code in
lockstep — the code already ships; this Figma component is the visual
source-of-truth that documents it.

> Paste this whole file to your Figma-building assistant, or follow it by hand.
> It is written to satisfy `docs/rules/component-design-skill.md §10` (spec
> checklist) and `§7` (build with tokens only, every state is a variant, names
> match code).

---

## 1. Noun + one-sentence job

**Table apron — a floating status strip under a data table that reads out the
live result count and the active filters as removable tokens.**

Like a furniture apron under a tabletop: the strip beneath the table that
reports its state. It is a *readout*, not a control surface — it reflects
filter/search state the page owns; it does not perform filtering itself.

Pairs with: **Table (v2)** above it, and **Search** + **Chip** (used as the
filter row) beside/above it. The apron replaces the old "X de Y" text buried
in a section header with a single, legible, dismissable summary.

---

## 2. Context (where it lives)

- **Shell:** a product data surface — floats over the **bottom edge** of an
  `afi-table-v2`, horizontally centred. In code the consumer owns placement
  (a relative wrapper + centred absolute float); in Figma, draw it as a
  free-floating pill overlapping the table's bottom border.
- **Adjacent components:** Table (v2) behind it; a filter row above the table
  built from `Segmented`/`Chip` (single-select status) on the left and
  `Search` on the right.
- **This instance's content:** a count (`8 / 30 pedidos`) + 0–N filter tokens
  (`Nuevos`, `noah`).

---

## 3. Anatomy

```
┌──────────────────────────────────────────────┐  ← capsule (pill)
│  8 / 30 pedidos   [⧩ Nuevos ✕]  [⌕ noah ✕]    │
└──────────────────────────────────────────────┘
   └── count ──┘   └──── tokens (repeatable) ───┘
```

| Part | Figma layer | Notes |
|---|---|---|
| Capsule | `apron` (auto-layout, horizontal) | The pill. Owns fill, border, radius, shadow, padding, child gap. |
| Count | `count` | `shown` (emphasised) + `/` separator + `total` + noun. |
| Tokens list | `tokens` (auto-layout, horizontal) | Repeatable token instances; hidden when zero. |
| Token | `token` (auto-layout) | Optional leading icon + label + optional remove ✕ button. |

---

## 4. Variants × sizes × slots

- **Variants:** none (single visual intent). Do **not** add a colour variant —
  the apron is always the neutral floating status pill.
- **Sizes (Figma property `Size`):** `md` (default) · `sm` (dense — pairs with a
  compact table). Size changes gap + count padding only; token height stays
  `height-component-xs`.
- **Content properties:**
  - `Tokens` — boolean/variant for `0` vs `1+` (show/hide the tokens list).
  - Token sub-component properties: `Icon` = `none | search | filter`;
    `Removable` = `true | false`.

Naming must match the code enum: size `sm` / `md`; token icon `search` /
`filter`; `removable` boolean.

---

## 5. State table

The apron itself has no interactive state — it is a status readout. The only
interactive element is the token's **remove ✕ button**, which carries the
standard v2 control states.

| Element | State | Applies? | Notes |
|---|---|---|---|
| Capsule | Default | ✓ | Resting float. |
| Capsule | Enter | ✓ | `slide-fade-enter` on appear (see §7). |
| Count | Live update | ✓ | Number changes; announced (see §8). No visual state. |
| Token | Default | ✓ | Readout pill. Body is **not** interactive (no hover/press on the body). |
| Remove ✕ | Default / Hover / Focus-visible | ✓ | Icon `content/secondary` → `content/primary` on hover; 2px focus ring. |
| Remove ✕ | (no Disabled) | opt-out | A shown token is always dismissable when `removable`; there is no disabled token. |

---

## 6. Token mapping (use these exact foundations-modern variables)

Bind every fill/stroke/radius/space to the variable — no raw values. These are
the variables the shipped SCSS uses, so Figma and code resolve identically.

| Property | Variable |
|---|---|
| Capsule fill | `background/hover` (`--background-hover`) |
| Capsule border | `borders/default` (`--borders-default`), width `stroke/default` |
| Capsule radius | `radius/full` (`--radius-full`) |
| Capsule shadow | `elevation/menu` (`--elevation-menu`) |
| Capsule padding | block `dimension-1` (4); inline `dimension-1` / `dimension-2` |
| Count — `shown` | `content/primary`, weight `font-weight/semibold`, tabular figures |
| Count — total + noun | `content/secondary`, type `label` |
| Count — `/` separator | `content/tertiary` |
| Token fill | `background/surface` (`--background-surface`) |
| Token border | `borders/default` |
| Token shadow | `elevation/1` |
| Token radius | `radius/full` |
| Token height | `height-component-xs` (24) |
| Token inline padding | `pad-control-sm` |
| Token label | `content/primary`, type `label` |
| Token icon + ✕ | `content/secondary`, size `icon/sm` (16) |
| ✕ hover | `content/primary` |
| Focus ring | `borders/focus`, width `stroke/focus` |

---

## 7. Motion table

| Trigger | What moves | How | Duration / easing |
|---|---|---|---|
| Apron appears | Capsule | opacity 0→1 + translateY `dimension-1-5`→0 (`slide-fade-enter`, motion-skill §4.4) | `motion/duration-base` · `motion/easing-enter` |
| ✕ hover | Icon colour | `content/secondary` → `content/primary` | `motion/duration-fast` · `motion/easing-standard` |
| Reduced motion | — | Capsule enter disabled; ✕ colour transition off | n/a |

> Companion motion (documented on the **table**, not the apron): when the page
> re-filters, `afi-table-v2 [reveal="stagger"]` replays a blur-and-fade-rise
> cascade across the rows. This is a **deliberate exception** to motion-skill
> §4.7 (which reserves `stagger-reveal` for cold entries) — requested for the
> "table apron" experience, strictly opt-in, and collapsed to an ≤80ms fade
> under `prefers-reduced-motion`. Show it as a documented note in the Figma
> table page, not as apron motion.

---

## 8. A11y intent

- The **count** sits in a `role="status"` `aria-live="polite"` region so a
  change ("6 de 30 resultados") is announced. The visible `shown / total`
  reading is `aria-hidden`; a screen-reader-only phrase using **"de"** (not the
  "/" glyph) is what gets announced.
- Each removable token exposes a real `<button>` named **"Quitar {label}"**.
- Token body is not a button (it is a readout) — do not give it `aria-pressed`
  or a role. This is why the apron does **not** reuse `Chip` (whose body is a
  selection toggle): document that decision in the Figma notes.
- Remove ✕ gets the 2px v2 focus ring; touch note: the compact ✕ is a dense-
  desktop opt-out from 44×44, consistent with the other v2 controls.

---

## 9. Copy (RAE Spanish, formal)

- Count: `{shown} / {total} {nombre}` — noun agrees with the **total**
  (`1 pedido`, `30 pedidos`). Default noun `resultado` / `resultados`.
- Remove button accessible name: `Quitar {etiqueta}`.
- Screen-reader count phrase: `{shown} de {total} {nombre}`.
- No English, no "/" read aloud, tabular figures for the numbers.

---

## 10. Dependency check (all resolved — nothing blocks the Figma build)

| Check | Status |
|---|---|
| Every token used exists in AFI-FOUNDATIONS-MODERN | ✓ (§6 list — all published modern variables) |
| Composed primitives exist | ✓ apron is self-contained; filter row reuses Search + Segmented/Chip (all shipped) |
| Icons exist | ✓ search (magnifier), filter (funnel), ✕ (close) — simple 16px strokes, in code as inline SVG |
| Every state has a frame | Build them per §5 |
| Copy passes copy-skill | ✓ §9 |
| A11y intent named | ✓ §8 |

---

## 11. Figma construction notes

- One **component set** `Table apron` with property `Size = sm | md` and
  `Tokens = none | some`. Make the **token** its own component (properties
  `Icon`, `Removable`) and instance it inside the apron's `tokens` auto-layout.
- Horizontal auto-layout throughout; capsule hugs contents; `tokens` list wraps
  or scrolls (code scrolls horizontally on overflow).
- Every colour/stroke/space/radius = a **bound variable** from §6. If you reach
  for a hex, stop and bind the variable instead (component-design-skill §7).
- Names must match the code enums exactly (`sm`/`md`, `search`/`filter`,
  `removable`) so Code Connect (when the plan allows it) maps 1:1.
- Reference node when filing: add the Figma node id back into
  `libs/ui/src/table-apron/table-apron.variants.ts` (the "Figma source of
  truth" line) once the component exists, the way `table-v2` does.

---

## 12. Reference

- Shipped code: `libs/ui/src/table-apron/` and `afi-table-v2 [reveal]`/
  `[revealKey]` in `libs/ui/src/table-v2/`.
- Live demo: `/demos/foundations-modern/workbench` → **Table apron** section.
- Origin: the "table apron" interaction screenshots (orders table with a
  bottom-centred live-count pill + removable filter tokens).
