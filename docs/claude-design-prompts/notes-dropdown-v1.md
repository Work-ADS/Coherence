# Pattern — notes dropdown (V1)

> Prepend [`_foundation.md`](./_foundation.md) before using this.
>
> Catalog: [`motion-skill.md`](../rules/motion-skill.md) §4.1 (`hover-tint`),
> §4.2 (`opacity-fade`), §4.3 (`focus-ring`), §4.14 (`list-exit`). The panel's
> own entrance is a short variant of §4.4 (`slide-fade-enter`), with no
> catalog entry of its own.
>
> Shipped in `site-notes-dropdown`, inside the Wealth Planner top bar, on every
> planner page. This is the V1 version. Its V2 successor,
> `site-notes-panel-v2`, keeps the same behaviour but is built from V2 parts;
> it isn't covered here.
>
> **Structure and interaction only.** Colour and type come from the design
> system you already have, named here by role. Measured in the browser on
> 2026-09-16.

**Use for** — private, timestamped notes that the advisor attaches to the plan
they're working on, reachable from any planner page without leaving it.

**Not for** — comments on a specific figure (those belong next to the data),
anything the client sees, or long documents.

## Anatomy

```
                                         [▤]   trigger, in the top bar
                                          ↓ 4px, right edges aligned
┌──────────────────────────────────────────┐
│ NOTAS                                  × │   header
├──────────────────────────────────────────┤
│ 16 sept, 09:12                       🗑  │   note — delete shows on hover
│ Llamar al cliente el lunes               │
│──────────────────────────────────────────│   hairline between notes
│ 15 may, 10:30                            │
│ Cliente prefiere enfoque conservador…    │
├──────────────────────────────────────────┤
│ ┌──────────────────────────────┐   [↑]   │   footer — field + send
│ │ Añadir nota…                 │         │
│ └──────────────────────────────┘         │
└──────────────────────────────────────────┘
```

## The trigger

- A ghost icon button, 40px square, with a page-with-lines icon and a "Notas"
  tooltip underneath. It sits in the top bar's right-hand cluster, beside
  settings.
- It toggles the panel, and its expanded state mirrors whether the panel is
  open.
- **At 768px and below** the button is hidden. "Notas" moves into the top bar's
  overflow menu (⋮), which closes itself and then opens the panel.

## The panel

| | |
|---|---|
| Width | 320px, fixed |
| Height | grows with its content up to 400px; beyond that the list scrolls while the header and footer stay put |
| Position | 4px below the trigger, with the panel's right edge on the trigger's right edge |
| Radius | 8px (the card radius) |
| Border | 1px hairline |
| Surface | raised surface, large elevation, above page content |

The panel stacks three parts. Each has 8px of padding top and bottom and 12px
at the sides.

### 1. Header

- The label "Notas" on the left, in the small uppercase label style and the
  secondary tone.
- The close × on the right: a 20px square button with a 12px icon and 4px
  corners, in the tertiary tone. On hover it gets a subtle fill and the primary
  tone.
- A hairline under the header.

### 2. List

It takes whatever height is left, scrolls, and shows the **newest note first**.

- **Each note** has 8px of padding above and below, with a hairline between
  notes (never above the first).
- **Head row:** the timestamp on the left, the delete button on the right. The
  note text sits 4px below.
- **Timestamp:** day, short month and 24-hour time — "15 may, 10:30". It uses
  small text in the tertiary tone, dimmed further to 70%.
- **Delete:** the same 20px button as close, with a trash icon. It's
  **invisible until the note is hovered.**
- **Note text:** small body style in the primary tone, with a 1.4 line height.
  It keeps the line breaks the advisor typed.
- **Empty list:** one centred line in the tertiary tone, with 24px above and
  below it: "Sin notas aún. Añade una nota para esta planificación."

### 3. Footer

A hairline above, then a multi-line field and a send button side by side, 8px
apart. They're bottom-aligned, so the button stays level with the foot of the
field as it grows.

- **Field:** placeholder "Añadir nota…", about 96px tall by default, and the
  user can drag it taller.
- **Send:** a 28px square with 4px corners and a 16px arrow-up icon. It's
  disabled, at 35% opacity, until the draft contains something other than
  spaces and line breaks. On hover it drops to 85%.

## Behaviour

- **Open:** click the trigger, or pick the overflow item on narrow screens.
  Focus stays where it was, on the trigger.
- **Add:** type, then press **Ctrl/Cmd + Enter** or click send. A plain Enter
  makes a new line. After adding, the note appears at the top and the field
  empties. With the shortcut, focus stays in the field, so the next note can
  follow straight away.
- **The draft survives closing.** Close the panel mid-sentence, and the text is
  still there when it reopens.
- **Delete:** hover a note and click the trash icon. The note goes immediately,
  with no confirmation and no undo.
- **Close:** the ×, Escape, or any click outside the panel. The trigger counts
  as inside, so clicking it simply toggles the panel.
- **Notes can't be edited.** A note is its text plus the time it was created.

## Motion

| Change | Behaviour | Status |
|---|---|---|
| Panel opens | Fades in while dropping 4px into place, over 150ms on the enter curve | Ships |
| Panel closes | Vanishes | Ships. The rule — fade out over 150ms on the exit curve (§4.2) — isn't built |
| Delete button appears | Fades in over 150ms when its note is hovered | Ships |
| Close and delete hover | Fill tint, 150ms | Ships |
| Send enables or disables | Opacity change, 150ms | Ships |
| A note is added | Appears at the top instantly, and the list below jumps down | Ships |
| A note is deleted | Vanishes, and the notes below jump up | Ships. `list-exit` applies — fade over 150ms on the exit curve, then the notes below slide up over 200ms — **decided, not built** |

## What V1 gets wrong — don't copy

All verified in the browser on 2026-09-16.

1. **The send button is invisible.** It's painted with the colour meant for
   text on the brand fill, so it renders white on the white panel. Give it a
   proper filled action style.
2. **The field is a box inside a box.** A bordered wrapper with 4px corners
   surrounds the field's own border, which has 8px corners. Use one border.
3. **Keyboard users can't see delete.** The button takes focus while it's fully
   transparent. Reveal it on keyboard focus as well as on hover.
4. **Closing with × drops focus onto the page.** Every close — ×, Escape or an
   outside click — should return focus to the trigger.
5. **The panel doesn't fit a phone.** It stays 320px wide, anchored to the
   hidden trigger, and covers the bottom half of the top bar. Below 768px it
   should sit under the top bar and span the screen minus the gutters, or become
   a sheet.
6. **It says "dialog" but behaves like a popover.** It's marked as a dialog but
   never moves focus. Either move focus into the field on open (and back to the
   trigger on close), or treat it as a non-modal popover throughout.
7. **One misclick loses a note.** Delete has no undo. Pair it with the undo
   toast the planner already shows after other destructive actions.
8. **It ignores reduced motion.** V1 has no reduced-motion rule for the panel
   or its buttons.

## Reduced motion

- The panel appears and disappears in place, with no drop and no fade.
- Hover tints, the delete reveal and the send state change instantly.
- A deleted note is gone, and the list closes up in the same frame.

Nothing is lost: open, closed, enabled and deleted all read without motion.
