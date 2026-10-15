# Pattern — planner top bar (V1)

> Prepend [`_foundation.md`](./_foundation.md) before using this.
>
> Related: [`notes-dropdown-v1.md`](./notes-dropdown-v1.md) covers the notes
> panel this bar opens, and [`glass-nav-bar.md`](./glass-nav-bar.md) covers the
> V2 bar's surface.
>
> Catalog: [`page-structure-skill.md`](../rules/page-structure-skill.md) §3
> (the bar is shell chrome) and [`motion-skill.md`](../rules/motion-skill.md)
> §4.1 (`hover-tint`) and §4.3 (`focus-ring`).
>
> Shipped in `site-planner-top-bar`, on every V1 Wealth Planner page. It's
> built from `afi-icon-button`, `afi-tooltip`, `afi-inline-edit`,
> `afi-status-chip`, `afi-dropdown-panel` and `afi-toast`. The V2 bar
> (`site-planner-navbar-v2`) isn't covered here, but it uses the same rename
> control, so the gap fix below applies to it as well.
>
> **Decided 2026-09-16, not built yet:**
> - no pencil on the plan name
> - 12px from the plan name to the state badge
> - clicking outside the rename field saves
> - focus returns to the name after renaming
>
> The rest describes the bar as measured in the browser that day.
>
> **Structure and interaction only.** Colour and type come from the design
> system you already have, named here by role.

**Use for** — the bar above every planner page. It says which client and which
plan you're in and what state that plan is in, and it holds the few plan-wide
tools: switch plan, notes, settings.

## Anatomy

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ [‹ ☰]   Ricardo Vázquez Pérez planificación: SIM-2025-0011   [• Borrador ˅]  [▤] [⚙] │
└─────────────────────────────────────────────────────────────────────────────────────┘
  plan      client label (quiet)              plan name          state badge   notes settings
  switcher                                    (click to rename)
```

## The bar

| | |
|---|---|
| Height | 48px (`--shell-header-height`), level with the sidebar's logo row |
| Side padding | 24px, so the first and last icons line up with the page content below |
| Bottom edge | 1px hairline |
| Surface | the default solid surface (the V2 bar is glass) |
| Layout | two groups pushed to opposite ends: identity on the left, tools on the right |

## The left group

Its items sit 12px apart, vertically centred.

### 1. Plan switcher

- A ghost icon button, 52 × 40, holding two 16px icons (a back chevron and a
  list), with the tooltip "Cambiar planificación".
- It opens a 280px panel aligned to its left edge. The panel has an "Ir al
  listado" link, a divider, then the client's plans, each showing a name and an
  id, with a check on the current one.
- Picking a plan switches to it and shows the undo toast.

### 2. Identity — client and plan name

Two pieces of text on one line, **4px apart**:

- **Client label:** "{Cliente} planificación:" in the small body style and the
  tertiary tone. It isn't interactive and never wraps.
- **Plan name:** the small body style at medium weight, in the primary tone.
  **The whole name is the rename control** (see below). Past 200px it
  truncates with an ellipsis.

On a deeper page, a trail follows the plan name. Steps are separated by " / "
in the tertiary tone; earlier steps are links (secondary tone, primary on
hover), and the current step is medium weight.

### 3. State badge

- It sits **12px after the plan name** — the same gap as the rest of the row.
  *Decided; V1 shows 32px, see "The gap" below.*
- A 20px pill: 8px side padding, a 4px dot, the label, then a 12px chevron,
  with 4px between parts. Its fill and text tone come from the state.
- It opens the state menu.

## The plan name — rename in place

### At rest

Just the text. **No pencil, at rest or on hover.**

### Hover

The name gets a subtle tint: a box with 4px corners, reaching 4px beyond the
text on every side. The box sits outside the text's own position, so nothing
shifts. The cursor becomes a pointer, and the tint fades in over 150ms.

### Keyboard focus

The same tint, plus the focus ring. *(V1 has no focus style of its own here;
it falls back to the browser's default outline.)*

### Click anywhere on the name

The whole name is one button, so a click anywhere on it starts editing — not
just a click on an icon.

- The name becomes a text field in the same place. **The field's text starts
  exactly where the name's text was.**
- **The field** is 24px tall and 170px wide, with 8px side padding, 4px corners,
  a 1px border in the focus tone (it's already focused), and the default
  surface.
- **The cursor** is placed at the end of the name.
- **Confirm ✓ and cancel ×** follow the field: each a 24px square with a 16px
  icon, 4px apart and 4px from the field. They use a quiet tone, and on hover
  get a tint and the primary tone.
- **The state badge moves right** to make room. Editing is a mode, so that
  shift is expected, and the badge returns when editing ends.

### Ending the edit

| Action | Result |
|---|---|
| Enter, or ✓ | Saves, if the trimmed text is not empty and has changed. An undo toast follows: "Nombre actualizado a "…"" |
| Escape, or × | Cancels; the name is unchanged |
| An empty or unchanged name | Closes without saving |
| Click anywhere outside | **Saves, the same as Enter** (decided; V1 leaves the field open) |
| Afterwards | **Focus returns to the name** (decided; V1 drops focus onto the page) |

## The gap — why V1 looks loose

V1 keeps a 16px pencil in the layout at all times, invisible until hover. That
reserved pencil and its padding, plus the 12px group gap, put **32px** between
the plan name and the badge at rest, against 4px from label to name and 12px
everywhere else in the row. At rest that slot is just empty space, so the badge
reads as detached from the plan it describes.

The fix is to drop the pencil. The hover tint and the pointer cursor are the
cue that the name can be edited, the way editable titles work in Linear, Notion
and Figma. The badge then sits at the row's normal 12px, and nothing in the row
moves on hover.

## The state menu

- The badge is a button that announces a menu, and whether that menu is open.
  *(V1 announces the menu but not whether it's open.)*
- **The panel:** 220px wide, 4px below the badge, with **its right edge on the
  badge's right edge**. It has the heading "Estado", then one 36px row per state
  (Borrador, Pendiente, Aprobada, Ejecutada). Each row shows the state *as its
  badge*, with a check on the current one.
- **Picking a state** closes the menu, updates the badge immediately and shows an
  undo toast: "Estado cambiado a …". Picking the current state just closes the
  menu.
- **Hovering the badge** darkens it slightly.
- **It closes** on an outside click or Escape.

## The right group

Notes and settings are two ghost icon buttons, 40px each and 4px apart, with
the tooltips "Notas" and "Ajustes de la simulación". Each opens its own panel,
aligned to its right edge, 4px below it.

## The undo toast

All three changes — plan switch, rename and state — use the same toast. It sits
at the bottom centre of the screen, 24px up, with the message and "Deshacer"
(undo), and it goes away after 5 seconds. Undo restores the previous value.

## Narrow screens (≤ 768px)

- **A menu button** appears at the far left and opens the sidebar drawer.
- **The plan switcher, identity and badge** leave the bar. The client and the
  editable plan name move into the drawer, and the states move into the ⋮ menu.
- **The "AFI Wealth Planner" mark** sits centred in the bar.
- **Notes and settings** collapse into a ⋮ menu on the right. It lists
  "Estado" first (the four states as badges, with a check), then Notas and
  Ajustes.

## Motion

| Change | Behaviour | Status |
|---|---|---|
| Plan name hover | Tint fades in over 150ms | Ships |
| Pencil | Removed | **Decided, not built.** V1 fades a pencil in over 150ms |
| Badge hover | Slight darkening | Ships |
| Panels (plans, states, notes, settings) | Appear in place | Ships |
| Rename field | Swaps in instantly, and the badge shifts at once | Ships |
| Toast | Appears at the bottom centre | Ships |

## Reduced motion

The hover tint changes instantly. Nothing else in the bar moves. *(V1 has no
reduced-motion rule for the tint yet.)*
