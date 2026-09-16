# Pattern — multi-select filter menu

> Prepend [`_foundation.md`](./_foundation.md) before using this.
>
> Append [`overlay-extrude-reveal.md`](./overlay-extrude-reveal.md) (the panel),
> [`selection-controls.md`](./selection-controls.md) (the checkboxes) and
> [`filter-chip.md`](./filter-chip.md) (the pill). This file does not repeat
> their numbers.
>
> **Status: composed, not yet a v2 primitive.** The behaviour ships twice: built
> by hand on Patrimonio (the Tipo and Entidad filters), and productised as v1
> `afi-filter-chip` with `mode="dropdown"`. Every v2 part it needs ships on its
> own — `afi-chip-v2`, `afi-menu-v2`, `afi-checkbox-v2` — but nothing assembles
> them yet, and `afi-select-v2` is single-select by design. This brief describes
> that v2 assembly.
>
> Catalog: the panel is the uncataloged extrude plus
> [`§4.7`](../rules/motion-skill.md); the checkboxes are
> [`§4.8`](../rules/motion-skill.md) and [`§4.9`](../rules/motion-skill.md); the
> trigger is [`§4.1`](../rules/motion-skill.md) and
> [`§4.3`](../rules/motion-skill.md).

**Use for** — one filter axis with several values where any subset can be active,
such as asset type, entity or currency. The pill names the axis and the menu holds
its values.

**Not for** — choosing exactly one value (select), a short set that fits on the
row as chips, or a form field (select or checkbox group).

## Anatomy

```
( Tipo  ˅ )                               trigger — at rest
( ⊗  Tipo │ 3 seleccionados  ˅ )          trigger — narrowed
   ↓ 4px
┌──────────────────────────────────┐
│ ☑ Todos                          │   select-all row
├──────────────────────────────────┤   full-bleed divider
│ ⋮⋮ ☑ Inversión             (12)  │   option: handle · checkbox · label · count
│ ⋮⋮ ☐ Inmobiliario           (3)  │
│ ⋮⋮ ☑ Liquidez               (5)  │
└──────────────────────────────────┘
```

## Decide first — what "everything selected" means

The three shipped versions disagree, and a design built on any one of them
inherits its problem.

- **Patrimonio Tipo** starts with every value checked, and unchecking hides a
  section. It is internally consistent. Clicking "Todos" with everything checked
  empties the page, and the pill reads "Ninguno".
- **Patrimonio Entidad** treats an empty selection as "no filter". Clicking
  "Todos" checks everything, and the pill turns **active and reads "Todas" while
  filtering nothing**. "All" ends up with two representations that look
  different.
- **v1 `afi-filter-chip`** also treats empty as "no filter", but at rest it shows
  "Todos" checked above options that are all unchecked. Selecting every option
  one by one leaves an active pill reading "N" that filters nothing.

**Recommended rule for v2: checked means included.**

- **At rest,** every option is checked, "Todos" is checked, and the pill is
  neutral with no summary. How you store that is up to you; on screen, it is all
  checked.
- **Narrowed:** some options are checked, "Todos" shows **indeterminate**, and the
  pill is active with a summary. The v2 checkbox has a parent-controlled
  indeterminate state for exactly this.
- **Checking the last unchecked option returns to rest on its own.** An active
  pill that filters nothing must not be reachable.
- **"Todos"** goes from checked to empty, and from indeterminate or empty to
  checked. This is the standard tri-state select-all.
- **Nothing checked** is a real state. The pill reads "Ninguno", and the results
  area shows an empty state that names the filter and offers the reset. Never
  show a blank page.

The other coherent model is Linear's: no "Todos" row, nothing checked at rest,
and checking a value narrows to it. It suits long entity lists. Pick one model
per product and never mix them. This rule changes how Entidad and v1 behave
today, so confirm it before designing.

## The trigger

It is the pill from `filter-chip.md`, but **the trigger is not a toggle**:

- **Body click** opens and closes the menu. It never changes selection.
- A **trailing caret** (12px, secondary tone) rotates 180° on open, over 150ms on
  the standard curve.
- **Semantics** are `aria-haspopup="menu"` plus `aria-expanded`, not
  `aria-pressed`. A pill that opens a menu *and* reports "pressed" tells a screen
  reader two conflicting things.
- **Active** means the axis is narrowed (or, where rows reorder, the order has
  changed). It uses the selected fill and border.
- The **summary segment** appears only when the pill is active: a separator, then
  summary text in the action tone, medium weight, with tabular figures.

| Selection | Summary |
|---|---|
| At rest | none — the pill reads "Tipo" |
| One value | that value's label, e.g. "Inmobiliario" |
| Several values | "3 seleccionados" |
| None | "Ninguno" |
| All values, reordered (reorderable menus only) | "Reordenado" |

**Reset ⊗** appears only when the pill is active. It returns the axis to rest and,
in a reorderable menu, restores the canonical order too. It is a separate sibling
button at the **leading** edge, and its name says what it does: "Restaurar tipos
por defecto", "Quitar filtro de entidad".

**Reset leads and the caret trails.** The two affordances sit at opposite ends of
the pill so neither gets hit by accident. This is the one place the trigger
departs from `filter-chip.md`, where the × trails.

**Never nest the reset inside the trigger button.** v1 does, using a clickable
span inside the button. That is invalid HTML and it is only reachable with Enter.
Build the pill as a wrapper around sibling buttons, as in `filter-chip.md`.

**Height — open decision.** Both shipped triggers are 32px, sized to sit beside
the 32px search field. `afi-chip-v2` is a fixed 24px, and `afi-search-v2` has no
size below 28px. Choose before designing the row: either the trigger breaks from
the chip's height, or the whole filter row changes.

## The panel

Motion is exactly [`overlay-extrude-reveal.md`](./overlay-extrude-reveal.md), and
so is the chrome.

- **Anchored** 4px below the trigger, aligned to its **leading edge**. Unlike the
  select, it is not width-matched, because the pill is narrower than the list it
  opens.
- **Minimum width** is 220px, or 280px when rows carry a drag handle and a count.
- **It stays open while you toggle.** A multi-select is several decisions in a
  row, so closing after each one forces a reopen per value.
- **It closes on** Escape, an outside click, a trigger click, or Tab.

## Rows

- **Select-all ("Todos")** has a medium-weight label and a tri-state checkbox, and
  is followed by a hairline divider that runs the full width of the panel,
  through its padding.
- An **option row** holds a drag handle (16px, reorderable menus only), a 16px
  checkbox, the label (which truncates), then a count.
- The **count** is a hairline pill: 20px tall, at least 20px wide, caption text in
  the secondary tone, tabular figures. It is a quantity, not a status, so it is
  never filled.
- **Row height** is 32px with the hover tint, and **the whole row is the
  target.** Checkbox press feedback is driven from the row, as in
  `selection-controls.md`.
- **Use a leading checkbox, not the trailing ✓.** The trailing check is the
  single-select mark from the select. A multi-select that uses it reads as a
  select that forgot to close.
- **Checkbox motion** follows `selection-controls.md`: the fill blooms over
  500ms, the check draws after a 200ms beat, and the box swells and dips under the
  pointer. Keep all three. Rows here get clicked in bursts, and that timing
  survives it.
- The **divider** has no entrance of its own, but it still takes a step in the
  stagger.

## Reorder (reorderable menus only)

Shipped only on Patrimonio's Tipo, where the order in the menu is the order of
the sections on the page.

- The whole row drags, and the handle is a visual cue only.
- The **source row** dims to 60% on the muted fill.
- The **drop target** shows a 2px line in the action tone along its top edge.
- A drop re-renders the list in place, with no motion.
- Reordering alone makes the pill active ("Reordenado"), and reset restores the
  canonical order.

**This has no keyboard path today.** Drag is pointer-only in the shipped version.
Give it a keyboard equivalent, such as move-up and move-down actions on the
focused row, before it becomes a v2 primitive.

## Keyboard and semantics

- **Trigger:** a button with `aria-haspopup="menu"` and `aria-expanded`.
- **Panel:** `role="menu"`, with a name such as "Filtrar tipos".
- **Rows:** `role="menuitemcheckbox"` with `aria-checked`. Select-all uses
  `aria-checked="mixed"` while it is indeterminate.
- **Target behaviour (APG menu):** ↓ and ↑ move between rows, Home and End jump,
  **Space toggles the focused row and leaves the menu open**, Escape closes the
  menu and returns focus to the trigger, and Tab closes it.
- **Honest note:** neither shipped version has roving focus yet. The rows are
  native buttons, so Tab walks through them, and `afi-menu-v2` notes that roving
  focus lands in a later pass. Design for the arrow-key model.

## Timeline

First open: select-all, the divider, and four options.

| Time | Event |
|---|---|
| 0ms | panel starts extruding, caret starts rotating |
| 150ms | panel open and empty, "Todos" starts |
| 190ms | divider takes its step |
| 230 / 270 / 310 / 350ms | options 1–4 start |
| 550ms | option 4 lands, motion complete |

Toggling one row:

| Time | Event |
|---|---|
| 0ms | box fill and border start blooming; trigger summary updates **instantly** |
| 200ms | check starts drawing |
| 400ms | check fully drawn |
| 500ms | fill bloom complete |

The pill's summary and width never animate. The results underneath follow
whatever reveal their own surface uses. See `search-typeahead-reveal.md` for the
table cascade, and its warning about running that on every change.

## Reduced motion

- **Trigger:** `transition: none`. The caret snaps to its open angle.
- **Panel and rows:** as in `overlay-extrude-reveal.md`.
- **Checkboxes:** as in `selection-controls.md`.
- **Reorder** has no motion to remove.

Everything still reads: the pill's tone and summary, the checked state, and the
order of the rows.
