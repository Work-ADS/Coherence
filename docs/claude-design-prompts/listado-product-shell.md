# Pattern — listado in a product shell

> Prepend [`_foundation.md`](./_foundation.md) before using this.
>
> Related: [`planner-top-bar-v1.md`](./planner-top-bar-v1.md) is the bar this
> pattern reuses — read it first, because this file only records what changes
> when there is no plan open. [`page-section-layout.md`](./page-section-layout.md)
> for the page header and section box inside the card, and
> [`responsive-canvas.md`](./responsive-canvas.md) for the widths the collapse
> order measures against.
>
> Catalog: [`page-structure-skill.md`](../rules/page-structure-skill.md) §3
> (shell chrome) and §4, §11 (content rail and breakpoints);
> [`motion-skill.md`](../rules/motion-skill.md) §4.1 (`hover-tint`) and §4.3
> (`focus-ring`).
>
> **Proposed, not built.** Out of the September 2026 listado studies. Today
> `listado-planificaciones` is a page header and a bare table on the default
> page surface, with no bar above it. Every part below exists in code —
> `site-planner-top-bar`, `afi-page-header`, `afi-table` — but the assembly
> does not, and neither does the tinted shell. It earns a catalog entry when it
> ships.
>
> **Structure and interaction only.** Colour and type come from the design
> system you already have, named here by role. Where a colour carries meaning —
> the shell ground, a state — the rule is named; the value is yours.

**Use for** — the screen a wealth manager lands on before any plan is open: the
list of every planificación across their clients. It is the front door of the
product, and its job is to get someone back into the plan they were working on.

![Listado in a product shell](./listado-product-shell.png)

*Reference render, 1440px. The ground is one step down the brand ramp from the
brand blue, because white bar text on the brand blue itself measures 3.9:1 — see
§1.*

The pattern is a shell, not a list. The list inside it is an ordinary table; what
this file describes is the frame around it, and the one rule that frame has to
obey.

---

## Anatomy

```
╔══════════════════════════════════════════════════════════════════════════════╗
║ [⌂] Listado de planificaciones / [Todos los clientes ˅]                       ║  ← the bar sits
║                          [• 16 planificaciones] [• 4 sin informe]  [▤] [⚙]   ║    ON the ground
║                                                                              ║
║   ┌──────────────────────────────────────────────────────────────────────┐   ║
║   │ Planificaciones                                 [Nueva planificación]│   ║
║   │ Abra una para continuar o cree una nueva.                            │   ║
║   │                                                                      │   ║
║   │ [ Buscar por nombre, cliente o código    ] [Todas|Borrador|Descarg.] │   ║
║   │                                                                      │   ║
║   │  Nombre      Cliente        Progreso    Estado    Patrimonio  Modif. │   ║
║   │  ─────────────────────────────────────────────────────────────────── │   ║
║   │  Borja PFC   Borja Fonc…    ▬▬▬▭        • Borr.   2.412.000 €  2 h   │   ║
║   └──────────────────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════════╝
   the shell ground — a tinted brand surface, edge to edge
```

Three layers, and the order matters: a tinted ground that reaches every edge, a
transparent bar drawn straight onto it, and one raised card holding the whole
page. Nothing else floats on the ground.

---

## 1. The shell ground

| | |
|---|---|
| Extent | Full bleed. It reaches the top edge of the viewport, both sides, and runs behind the card to the bottom. |
| Surface | A tinted brand surface — a mid-to-deep step of the brand's primary ramp, not the neutral page surface. |
| Contains | The bar, then the card. Nothing else. |

**The one hard rule.** The bar's text and icons sit directly on this ground with
no surface of their own, so the ground has to carry them: **white bar content
against the ground must reach 4.5:1**. The brand's mid ramp step will usually
fail this — measure before choosing, and step down the ramp until it passes.

If the ground is fixed at a value that fails, do not keep white text on it. Flip
the bar's content to the darkest step of the same ramp instead. But know what
that costs: the whole pattern runs on a dark shell holding a light card, and a
light shell holding a light card is a different, weaker idea. Changing the ground
is the better fix.

---

## 2. The bar

It is [`planner-top-bar-v1.md`](./planner-top-bar-v1.md) — same height, same side
padding, same two groups pushed to opposite ends, same icon buttons on the right.
Read that file for everything not listed here. Four things change:

**No surface, no hairline.** The bar's own background and its bottom edge both
come off, so the ground runs unbroken from the top of the viewport down to the
card. This is what makes the shell read as one piece instead of a bar with a
coloured strip under it.

**Content inverts.** Everything in the bar goes to white — labels, icons,
chevrons. Icon buttons keep their ghost treatment; their hover tint becomes a
low-opacity white wash instead of a neutral one, and the focus ring has to be
visible against the ground, not against a light surface.

**The identity group loses two controls and gains one.** With no plan open:

- The **plan switcher** goes. There is no plan to switch away from.
- The **rename control** goes with it. Renaming happens per row in the table.
- The **state badge** goes. State belongs to a plan, and there isn't one.
- A **root crumb** takes their place: a home icon, then "Listado de
  planificaciones" as the current step, not a link.
- A **client picker** follows the crumb, after the usual " / " separator. It is a
  pill-shaped menu trigger — the current scope ("Todos los clientes" by default),
  then a chevron. It opens the same 280px panel the plan switcher used, listing
  clients with a count each and a check on the current one. Picking one filters
  the table and rewrites the pill.

**The right group gains status pills, before the icons.** Two pills, each a dot
and a label, sitting on a low-opacity white wash. They carry portfolio totals,
not plan figures — this is the one place the pattern says something the old
screen could not:

| Pill | Reads | Dot |
|---|---|---|
| Count | "16 planificaciones" | The positive/steady tone |
| Attention | "4 sin informe" | The attention tone |

They are read-only. If the attention count is zero, that pill does not render —
an attention pill showing zero is noise.

---

## 3. The card

| | |
|---|---|
| Position | One card, inset from the ground on the sides and the bottom, flush under the bar. |
| Corners | Rounded on all four corners. Larger than a control's radius, smaller than a modal's. |
| Surface | The raised surface. |
| Elevation | One low, tight shadow for the edge, plus one wide, soft, far-offset shadow for the lift. Both tinted toward the ground's hue, never neutral grey — a grey shadow on a coloured ground reads as dirt. |
| Inset | The side gutter between card and ground edge is the smallest of the shell's gaps. The ground is a frame, not a margin; if it reads as a border, it is too wide. |
| Scroll | The card grows with its content and the page scrolls. The card does not scroll inside a fixed frame. |

Inside, the card is an ordinary page: the page header, then the toolbar, then the
table, in the spacing `page-section-layout.md` already prescribes. **The card
replaces the page surface — it does not nest inside one.** There is no second
container between the card and the table.

---

## 4. Inside the card

The header is a standard page header: title, subtitle, and one page-level action
in the actions slot ("Nueva planificación"). The toolbar below it is a search
field that grows to fill, then a segmented control for state. Both belong in the
filters slot, not the actions slot.

The table carries six columns. Two of them are the reason this pattern is worth
building, so they are specified rather than left open:

| Column | Notes |
|---|---|
| Nombre | The plan name. When a plan has never been named, it falls back to its code — set that in the monospace face and the quiet tone, so an unnamed plan is legible as unnamed rather than looking like a name. |
| Cliente | Full client name. |
| Progreso | A four-segment rail, one segment per section group of the planner, with the name of the live group underneath. Segments read: done, current, not started. |
| Estado | The state badge, same vocabulary as the planner bar. |
| Patrimonio | Right-aligned, tabular figures. An em dash when the plan has not reached the figure yet — never a zero. |
| Modificada | Relative ("hace 2 h", "ayer"), absolute past a week. One column, not two. |

The row is the target: clicking anywhere on it opens the plan. The row menu holds
only what the row itself cannot do — duplicate, archive, rename.

---

## 5. Empty state

The card stays. The shell and the bar do not change. The empty state lives inside
the card, exactly as `page-structure-skill.md` prescribes, and the pills in the
bar drop to nothing rather than rendering zeros.

---

## 6. Narrow screens (≤ 768px)

The collapse order, in order:

1. **The status pills go first.** They are the least load-bearing thing in the
   bar.
2. **The ground's side inset drops to zero**, and the card loses its side
   corners. The card keeps its top corners, so the shell still reads at the seam
   under the bar.
3. **The client picker keeps its pill but loses its label**, showing the chevron
   and a count.
4. **Notes and settings collapse into a ⋮ menu**, as they already do in the
   planner bar.

The table's own collapse is not this pattern's business — it follows whatever
rule the table already has.

---

## Motion

| Change | Behaviour |
|---|---|
| Card on first paint | Rises into place by the light reveal distance while fading in, on the enter curve at the base duration. Once, on load — not on filter changes. |
| Bar content | Does not move. It is already in place when the card arrives. Container before contents applies inside the card, not between bar and card. |
| Client picker panel | The standard overlay reveal. |
| Row hover | Tint only, at the fast duration. |
| Filter or search change | The table's own reveal. The card does not re-animate, and it does not resize in a way the eye can follow — if the row count changes, the height change is instant. |
| Status pills on change | The number crossfades in place. The pill does not resize with a transition; a pill that grows from "9" to "16" mid-glance is worse than one that just changes. |

## Reduced motion

The card appears in place, already at full opacity. Row tint changes instantly.
Nothing else in the shell moves.

---

## Decisions this needs before it can be built

Three, and the first two are data questions, not design ones. They decide whether
the pattern is buildable before anyone draws it.

1. **Can the listado endpoint return each plan's patrimonio?** If not, that
   column is an em dash on every row and the table is not worth changing.
2. **Can it return which section group each plan is on?** If not, the Progreso
   column cannot exist, and the pattern loses the thing that makes it more than a
   repaint.
3. **What are the portfolio pills counting?** "4 sin informe" assumes a plan can
   be complete but un-exported. Confirm that is a real state before shipping a
   pill that announces it.
