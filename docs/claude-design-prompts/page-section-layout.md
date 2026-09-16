# Pattern — page and section layout

> Prepend [`_foundation.md`](./_foundation.md) before using this.
>
> Catalog: [`page-structure-skill.md`](../rules/page-structure-skill.md) (v1.3)
> for structure, its §17 for interaction, and
> [`motion-skill.md`](../rules/motion-skill.md) for the motion each change uses.
>
> Shipped in `afi-page-header` (levels page, section and subsection) inside the
> Wealth Planner shell. The reference pages all sit in the plan's "Situación
> actual" group:
>
> - **Patrimonio** — multi-section, with cards and filters. The one to copy.
> - **Gastos** — a chart section and a table section.
> - **Sociedades** — a single section.
> - **Familia** — tabs, with collapsible form sections.
>
> **Structure and interaction only.** Colour, type and icons come from the
> design system you already have. This file names them by role ("page title
> style", "subtle border") and never by value. Spacing is given in px as a
> snapshot, with its token alongside.

**Use for** — every product screen: the shell around it, the page header, and
the sections under it.

---

## Part 1 — page layout

### The shell

```
┌──────────┬──────────────────────────────────────────────────┐
│          │ top bar                                    48px  │
│ sidebar  ├──────────────────────────────────────────────────┤
│  240px   │ (optional banner)                                │
│          │        ┌─── content column, max 1140px ───┐      │
│  nav     │  32px  │ page header                      │      │
│  groups  │        │ body                             │      │
│          │  32px  └──────────────────────────────────┘      │
└──────────┴──────────────────────────────────────────────────┘
```

- **Sidebar:** 240px, full height, and it does not scroll with the page.
  Navigation is grouped by stage of the plan — Situación actual (Familia,
  Sociedades, Patrimonio, Ingresos, Gastos), Objetivos, Diagnóstico, Plan de
  acción, Conclusiones, Informe. Each item shows its completion state.
- **Top bar:** 48px tall. It spans the main column only, to the right of the
  sidebar.
- **Main column:** the only part that scrolls.
- **Banner** (optional): sits between the top bar and the content, across the
  main column. It appears only on later-stage pages, never on Situación actual.
- **Content column:** max 1140px (`--content-xl`), centred in the main column,
  with 32px (`--space-xl`) of padding above and below and **none at the sides**.
  The page header supplies the side inset.

Never use 1180px. Two older pages still do; it's a drift, not a size.

### The page header

The whole column lives inside one page header — its rows and the body — so
everything shares a single left edge.

```
Patrimonio                                    [+ Añadir patrimonio ˅]   title row
Gestiona y visualiza todos tus activos y pasivos…                        subtitle
┌─────────────┐ ┌─────────────┐ ┌─────────────┐                          cards
└─────────────┘ └─────────────┘ └─────────────┘
Tab   Tab   Tab                                         [tab action]     tabs
[⌕ Buscar…] (Tipo ˅) (Entidad ˅) (Min ˅) (Max ˅)   3 seleccionados · …   filters
body                                                                      body
```

| | |
|---|---|
| Side padding | 24px (`--space-lg`) — this is the title's inset |
| Top and bottom padding | 12px (`--space-sm`) |
| Title → subtitle | 8px (`--space-xs`) |
| Above every later row (cards, tabs, filters, body) | 12px (`--space-sm`) |
| An empty row | collapses completely, gap included |
| Title row | 12px between the title and anything beside it; 8px between actions |

**The order is locked:** title row, subtitle, cards, tabs, filters, body. Cards
summarise the whole page, so they sit above the filters that scope the body.

**Title row.** The title sits on the left in the page title style, and the
page's action sits on the right of the same row. The subtitle runs the full
width underneath, so an action never crops it. A status chip, a count or inline
figures can follow the title.

**Actions.** Usually **one** page-wide action, a 32px button such as "+ Añadir
patrimonio". Allow three at most; anything more goes into an overflow menu.
Controls that change what the body shows are filters, not actions, and so are
chart settings.

**The anchor.** The title's left edge is the alignment line for everything
below it:

- the cards
- the first tab's text (the first tab has no leading padding)
- the first filter control
- section box borders
- the first table column

If something can't trace its left edge back to the title, it's misaligned.

### Cards row

- Three columns from 768px up, one column below, with an 8px gap
  (`--gap-card-to-card`). A fourth column needs a reason.
- **Each card:** subtle fill, no border, 8px radius, 24px padding. It stacks a
  label, a large value and a hint, 4px apart. Content sets the height, about
  112px with three lines.

### Filters row

- One left-aligned row that wraps when narrow. Leave 12px (`--space-sm`)
  between groups (the search field, then the pills) and 8px between pills
  within a group.
- **Controls are 32px tall:** a search field of about 260px, filter pills (see
  `multi-select-menu.md`), and range pills (Min, Max).
- **"Limpiar filtros"** appears at the end of the row while any filter is on.
- **Bulk actions** pin to the row's right edge, at least 16px (`--space-md`)
  from the filters, and exist only while rows are selected: "3 seleccionados ·
  Cancelar · Borrar".
- **Scope:** filters for the whole page go here. Filters that scope one section
  go in that section's header.

### The body — pick one shape

| Shape | When | Structure |
|---|---|---|
| **Single section** | One surface: a table, a form, a chart or an empty state | Straight under the header, 12px below its last row, **with no box** (Sociedades) |
| **Multi-section** | Two or more surfaces that each need their own title, action, cards or filters | Each surface is a section box (Part 2), with **12px between boxes** (Patrimonio) |

To decide, ask: *does this surface need its own actions, cards or filters?* If
not, it's body content and gets no box. If it does, it gets a section box. Never
box a lone table — the page header already titles it.

### Empty states

- **Whole page empty** (a single-section page with nothing in it yet). It goes
  in the body, aligned with the title and never boxed. Use a centred column
  about 520px wide:
  - a declarative heading, e.g. "Aún no hay sociedades registradas."
  - one sentence of hint. If the page is optional, include the opt-out: "Es
    opcional — déjalo en blanco si no aplica."
  - a primary button whose label matches the header's action, e.g. "+ Añadir
    sociedad"

  Leave 12px between heading and hint, and 16px between hint and button.
- **Empty section.** Keep the section's header, put one thin line in its body
  ("Sin movimientos en este periodo."), and put the add action in the section's
  own action slot. Never put the full block inside a box, because it would
  outrank the page title.
- **Filtered to nothing.** An inline block in the body: max 640px wide,
  centred, with a dashed hairline border and 8px radius. It holds a 32px icon, a
  heading ("Ningún activo coincide con los filtros"), a hint, and a quiet
  "Limpiar filtros" button.

### Narrow screens

| Content-area width | What changes |
|---|---|
| ≤ 1024px | Three-column grids may drop to two (optional middle step) |
| ≤ 768px | The sidebar becomes a drawer, opened from a menu button in the top bar; card grids go to one column |
| ≤ 640px | Column padding becomes 16px on all four sides. The title row may wrap: the action drops below the title when the two don't fit. Filters wrap. Buttons grow to 44px tall for touch. |

Breakpoints follow the **content area's** width, not the window's, so a
phone-sized preview frame behaves like a phone.

---

## Part 2 — section layout

### The section box

```
┌───────────────────────────────────────────────────────────┐
│ Activos de inversión · 450.000 € · 4 activos     [action] │  title row
│ Subtitle, when there is one                               │
│ [cards]  [tabs]  [filters]                                │  same rows as the page header
│ body — a table, chart or form                             │
└───────────────────────────────────────────────────────────┘
```

| | |
|---|---|
| Border | 1px, subtle tone |
| Radius | 12px (`--section-radius`) |
| Fill | none |
| Padding | 24px on all sides (`--space-lg`) |
| Rows inside | as in the page header: 8px from title to subtitle, 12px above every later row |
| Between boxes | 12px |
| Position | the box's outer border sits on the page title's left edge; its content starts 24px further in |

**Title row.** The section title style sits on the left and the section's
actions on the right. An icon-only action is fine here, such as a download on a
chart section.

**Figures go inline; sentences go underneath.** Figures that summarise the
section follow the title on the same line, separated by middle dots — "Activos
de inversión · 450.000 € · 4 activos". They use the small secondary style, with
the total in the primary tone. A descriptive sentence becomes a subtitle on its
own line, as in Gastos: "Proyección anual por edad del cliente."

A section can also use the page header's stacked rows (cards, tabs, filters).
Its filters scope only that section.

### Subsections

A subsection is the same box one level down, with the subsection title style.
Use one only when the group has its own actions, cards or filters, or needs to
collapse. A heading on its own doesn't earn a box.

Inside a dialog, subsections drop the box: 12px padding above and below, 12px
before the body, and a hairline between siblings.

### A table inside a section

- **It's flush.** The first column's text lines up with the section title, and
  the cells add no leading inset.
- **The box closes the table.** The last row loses its divider, so the bottom
  never shows a double line.
- **The hover band reaches into the padding.** A hovered row's fill extends 24px
  to the left and stops at the box border.
- **Checkboxes live in that gutter.** They're invisible at rest, fade in when a
  row is hovered, and stay while it's selected. The columns never shift.
- Rows are compact: the header about 40px, body rows about 45px.
- A table inside a section never scrolls sideways.

### A chart inside a section (Gastos)

It has a title and a subtitle, an icon-only download action on the right, the
chart as the body, and the legend under the chart.

### Collapsible sections (Familia)

- **The whole title row is the toggle**, not just the chevron, and Enter and
  Space work too.
- On the right: an optional count chip, an optional "complete" check, then a
  12px chevron.
- Actions inside the title row never trigger the toggle.

---

## Part 3 — interaction

Durations and curves are in `_foundation.md`.

| Change | Behaviour | Status |
|---|---|---|
| Page header while scrolling | On these pages the header scrolls away with the content. A header set to stick pins to the top instead, and after 8px of scroll it gains a background blur and a hairline bottom edge (150ms). | Ships |
| Drawer (≤ 768px) | Slides in from the left over 150ms on the enter curve, while the backdrop fades in. Tapping the backdrop reverses both. Width is 288px or 80% of the screen, whichever is smaller. | Ships |
| Tabs | The underline travels (`selection-slide.md`). The panel swaps with a 10px sideways slide, a 4px blur and a fade over 200ms on the standard curve. It enters from the right when moving forward and from the left when moving back. | Ships |
| Collapsible section | The chevron turns 180° over 150ms on the enter curve. The body appears and disappears instantly, with no height animation. | Ships |
| Row checkbox | Fades in over 150ms when the row is hovered. | Ships |
| A new row is added | The row drops in from 8px above with a tinted fill and a 2px accent bar on its leading edge. It settles by about 630ms, and the tint fades out by 1400ms. | Ships |
| Filters change | Results swap instantly today. One table surface has an opt-in blur cascade; see `search-typeahead-reveal.md` and its warning. | Ships |
| **Something leaves a row or list** | See *Leaving*, below. | **Decided, not built** |
| A section returns as filters widen | Fades in over 150ms on the enter curve. | Rule, not built |
| Bulk actions appear | Fade in over 150ms, and nothing else moves. | Rule, not built |
| Everything is filtered out | The filtered-empty block fades in over 150ms. | Rule, not built |
| Toast after an action | A pill at the bottom centre, 24px from the edge and 40px tall: undo (with its shortcut), the message, then close. It rises 12px as it fades in, and fades out over 150ms on the exit curve. | Enter ships; exit not built |

### Leaving — chips, apron tokens, sections, rows

Two beats, one after the other:

1. **The item leaves.** It fades out over 150ms on the exit curve. Small inline
   items (chips, tokens, pills) also shrink to 95%. Wide blocks (sections,
   rows) only fade, because scaling a wide box reads as a zoom.
2. **The row closes.** Everything after the item then slides into the gap over
   200ms on the standard curve. The movement is a transform: nothing animates
   width, height or gap. An item that moves up a line slides diagonally.

That's 350ms in total. The rules:

- **A second removal mid-slide** starts from wherever the items are at that
  moment. Nothing snaps back first.
- **Focus moves before the item leaves:** to the next item, or else the previous
  one, or else the control that owns the row.
- **The data changes at once.** Counts and announcements update immediately;
  only the fading item lingers.
- **A filtered-out section** leaves the same way. It fades, then the sections
  below slide up by its height plus the 12px gap.

Timeline for removing the second of four chips:

| Time | Event |
|---|---|
| 0ms | chip 2 starts fading and shrinking; focus moves to chip 3; results are already updated |
| 150ms | chip 2 is gone; chips 3 and 4 start sliding left |
| 350ms | the row has settled |

## Reduced motion

- **No slides, blurs, rises or shrinks** anywhere on the page.
- **A leaving item disappears** and the row closes in the same frame.
- **The drawer and tab panels** appear in place, and the chevron snaps.
- **The new-row highlight** loses its movement and runs in 80ms.

State never depended on any of it: selection, filters, counts and order all read
without motion.

## Before you design

- **Copy Patrimonio, not the older pages.** Familia and Sociedades still use a
  1180px column with extra side padding, which puts the title 48px in instead of
  24px. Familia's boxes also start 12px right of its title, 16px apart, and
  Gastos spaces its sections 24px apart and boxes its empty state. All of these
  are logged as fixes in our page-structure standard.
- **Phone gutters are wide.** At 375px the content starts 40px from each edge
  (16px of column padding plus the 24px header inset), which leaves 295px. That
  is what ships today, so flag it rather than quietly changing it.
