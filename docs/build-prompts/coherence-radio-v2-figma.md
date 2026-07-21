# Radio v2 — Figma build prompts (foundations-modern)

Two copy-paste prompts for building **Radio** in the `AFI-FOUNDATIONS-MODERN` file, modeled
on the shipped **Chip** component + its documentation page. Build **Prompt A** (component)
first, then **Prompt B** (documentation) referencing the live instances from A.

Radio is the single-select sibling of Checkbox v2. It reuses the checkbox family's
treatment: a filled brand control with an inverse mark, one fixed size, inside stroke on
all states, one outside focus ring. Every eligible value binds to a semantic variable.

All variable names below already exist in the file **except** the two flagged under
*Tokens to create* — add those first.

---

## Tokens to create (do this before Prompt A)

| New variable | Value (bind to primitive) | Parallels |
|---|---|---|
| `size/radio` | `16px` → `dimension/4` | `size/checkbox` |
| `size/radio-dot` | `8px` → `dimension/2` | (inner dot diameter; no sibling) |

Everything else resolves to existing semantic variables (`borders/*`, `brand/background/*`,
`control/background/*`, `background/canvas`, `disabled/background`, `content/*`,
`stroke/default`, `stroke/focus`, `radius/full`, `gap/control-label`, `height/component/md`,
named text style `body-small`).

---

## Prompt A — Radio component (variant set)

> Build a component named **Radio** in AFI-FOUNDATIONS-MODERN, matching the structure and
> rigor of the existing Chip component. It is a single-select form control: one fixed size,
> label to the RIGHT of the control (control-label convention, same as Checkbox).
>
> **Variant properties (10 variants total, mirroring Chip):**
> - `Selected` = `False`, `True`
> - `State` = `Default`, `Hover`, `Focus`, `Pressed`, `Disabled`
>
> `Label` is a **text property** (default "Label"), not a variant. There is no size variant —
> the control is fixed at `size/radio` (16px).
>
> **Anatomy (horizontal auto-layout row):**
> - **Row container** — horizontal auto-layout, gap `gap/control-label`, min height
>   `height/component/md`, items centered. Control leads, label follows.
> - **Control (ring)** — fixed `size/radio` (16px) × `size/radio`, `radius/full`, inside
>   border at `stroke/default` width, border-box. This is the only stateful surface.
> - **Inner dot** — visible ONLY when `Selected=True`. `size/radio-dot` (8px) × `size/radio-dot`,
>   `radius/full`, fill `content/inverse`, centered. This is what draws the eye to selection.
> - **Label** — named text style `body-small`; color `content/primary` (normal) or
>   `content/disabled` (disabled).
> - **Outside focus ring** — `State=Focus` only. `stroke/focus` width, OUTSIDE alignment,
>   `borders/focus` color, `radius/full`, absolutely positioned, no offset, no effect.
>   (One ring, matching Button/Checkbox/Toggle v2.)
>
> **Per-state binding (identical logic to Checkbox v2, circular instead of square):**
>
> *Selected=False (empty ring):*
> - Fill: `background/canvas` (all states)
> - Border color: `borders/default` (Default), `borders/hover` (Hover), `borders/default`
>   (Focus — the ring communicates focus, not the border), `borders/hover` (Pressed),
>   `borders/disabled` (Disabled)
>
> *Selected=True (filled brand circle + inverse dot):*
> - Fill AND border color: `brand/background/default` (Default), `brand/background/hover`
>   (Hover), `brand/background/pressed` (Pressed). Focus = Default fill + focus ring.
> - Inner dot: `content/inverse`
>
> *Disabled (either Selected value):*
> - Fill `disabled/background`, border `borders/disabled`, inner dot (if Selected)
>   `content/disabled`.
>
> **Interaction prototype:** wire interactive-component reactions Default→Hover (While
> hovering), →Pressed (While pressing), and a click that toggles Selected, using Smart Animate
> so the inner dot scales in. Disabled has no interactions.
>
> **Audit before done:** 0 raw hex, 0 raw dimensions, 0 loose numbers — every eligible
> property bound to a semantic variable or the named text style.

---

## Prompt B — Radio documentation page

> Build a **Radio — Documentation** frame (720px wide) matching the Chip — Documentation
> page section-for-section. Use the same sidebar-tick section headers, the same table
> layouts, and the same tone. Sections in order:
>
> **Title strip:** `Radio · Selected ×2 · State ×5 · Label · inner dot · fixed 16px control ·
> single-select form control · all eligible values token-bound`
>
> **1. RADIO — DEFINITION**
> Single-select control: one option chosen from a mutually exclusive group. A form control —
> the value is staged and applied on Save/Confirm, not instantly.
> Redirects:
> - On/off or apply-instantly → Toggle
> - Multi-select (independent options) → Checkbox
> - More than ~7 options / long finite lists → Select (searchable)
> - Segmented single-choice in a compact bar → Segmented control
>
> **2. RADIO — ANATOMY**
> (Use the anatomy bullets from Prompt A: Row container, Control ring, Inner dot, Label,
> Outside focus ring — each with its variable bindings.)
>
> **3. RADIO — COMPONENT MATRIX**
> `Selected=False/True × State=Default/Hover/Focus/Pressed/Disabled = 10 live instances`,
> laid out as a grid: rows = Unselected / Selected, columns = the 5 states. Add a final
> row demonstrating the `Label` text property on a live instance.
>
> **4. RADIO — PROPERTIES** (table: PROPERTY / TYPE / DEFAULT)
> | Selected | Variant | False, True |
> | State | Variant | Default, Hover, Focus, Pressed, Disabled |
> | Label | Text | (any string) |
>
> **5. RADIO — VARIABLE MAPPING** (table: PROPERTY / STATE / SEMANTIC VARIABLE / RESOLVES TO)
> Grouped CONTROL (RING) / INNER DOT / LABEL / FOCUS RING:
> - Ring fill — Sel=False → `background/canvas`; Sel=True → `brand/background/*` (per state)
> - Ring border color — Sel=False → `borders/*` (per state); Sel=True → matches fill
> - Ring border width — `stroke/default`
> - Ring size — `size/radio` (16px)
> - Ring corner radius — `radius/full`
> - Inner dot fill — `content/inverse` (normal) / `content/disabled` (disabled)
> - Inner dot size — `size/radio-dot` (8px)
> - Label text style — `body-small`; fill `content/primary` / `content/disabled`
> - Focus ring — color `borders/focus`, width `stroke/focus`, radius `radius/full`,
>   align OUTSIDE
>
> **6. TOKENIZATION CANDIDATES — REQUIRED**
> `size/radio` (16px) and `size/radio-dot` (8px) — create these two; parallel `size/checkbox`.
> All other required variables already exist.
>
> **7. USAGE RULES**
> - Use Radio for one choice among 2–7 mutually exclusive options in a form.
> - Radios always belong to a named group; exactly one is selected at a time.
> - Selection stays distinguishable without color alone — the inner dot's presence, not just
>   the fill, communicates the selected option.
> - Clicking the label row (not just the ring) selects the option.
> - Do not use Radio for on/off (→ Toggle), multi-select (→ Checkbox), or long lists (→ Select).
> - Disabled radios are non-interactive and must not receive focus.
>
> **8. RADIO — ACCESSIBILITY**
> - Code renders a real `<input type="radio">` inside a `<label>`; the group is a
>   `<fieldset>` with `role="radiogroup"` and a legend or `aria-label`.
> - Keyboard: Tab enters the group at the selected (or first) radio; Arrow keys move
>   selection within the group; Space selects the focused radio.
> - The 16px visual control is a dense-desktop target; code provides a ≥44×44 pointer target
>   via the label row (opt-out identical to Checkbox v2).
> - Focus ring uses `borders/focus` at `stroke/focus`, OUTSIDE alignment — no offset, no
>   box-shadow fallback.
> - Disabled radios set `aria-disabled` / `disabled` and leave the tab order.
>
> **9. RADIO — REFERENCE CHECK**
> Place the AFI Radio beside a generic radio reference for a squint test. Intentional
> differences from the generic reference:
> - Filled brand circle + `content/inverse` dot instead of a hollow ring + brand dot — family
>   parity with Checkbox v2 (filled square + inverse check).
> - Inside `stroke/default` boundary on all states, not only on hover.
> - Single fixed 16px size (no sm/md) — a dense-desktop form control.
>
> **10. RADIO — DEFINITION OF DONE** (checklist)
> - ✓ Complete matrix — 10 variants: Selected ×2 × State ×5. Label tested as a property.
> - ✓ Zero unbound values — 0 raw hex, 0 raw dimension, 0 loose number.
> - ✓ Token candidates resolved — `size/radio` + `size/radio-dot` created.
> - ✓ Properties tested — Selected, State, Label verified on live instances.
> - ✓ Interaction prototype — Hover, Pressed, and Selected toggle wired; dot scales in via
>   Smart Animate. Disabled has no interactions.
> - ✓ Documentation complete — all sections above present.
> - ✓ Reference squint-check — AFI Radio beside generic reference; differences documented.
> - ✓ Explorations → Graveyard — no explorations left on the page.

---

## Code-parity notes (for the later `radio-v2` code build — not for Figma)

When you hand the Figma back and I build `libs/ui/src/radio-v2/`, these carry the original
ask (port the v1 click animations) into code. Both animations below are already live on
`checkbox-v2` — radio-v2 reuses the same tokens and pattern:

- **Dot spring-in** — the v1 inner dot scales `0 → 1` on select with the spring:
  `transform: scale()`, `var(--motion-duration-base)` (200ms) `var(--motion-easing-spring)`.
  Reduced-motion collapses to instant. This is the radio analog of the checkbox v2 checkmark
  draw-in.
- **Press squish** — the whole control dips to `scale(0.9)` while the label row is `:active`
  and springs back on release (same `--motion-easing-spring`), disabled excluded, dropped
  under reduced motion. This is the v1 "pressed" rule finally wired up. See motion-skill §4.8
  `press-squish`.
- **Spring easing token** — DONE. `--motion-easing-spring: cubic-bezier(0.34, 2, 0.64, 1)`
  now exists (added to `tools/figma-sync/foundations-modern.json` → regenerated into
  `primitive-motion.scss`); tuned a touch bouncier than v1's 1.56 for a feel distinctly
  separate from standard. No new token work needed for radio.
- **Structure** — mirror `checkbox-v2` exactly: 3-file component, `model<boolean>` for the
  selected state, hidden native `<input type="radio">`, `afi-radio-group-v2` container owning
  single-selection + `role="radiogroup"` + arrow-key nav.
- **Showcase** — add a Radio group to the foundations-modern workbench next to Checkbox.
