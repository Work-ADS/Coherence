# Pattern — filter chip (pill)

> Prepend [`_foundation.md`](./_foundation.md) before using this.
>
> For the pill that opens a checkbox menu, also append
> [`multi-select-menu.md`](./multi-select-menu.md). This file is the pill on its
> own.
>
> Catalog: [`motion-skill.md §4.1`](../rules/motion-skill.md) (`hover-tint`),
> [`§4.3`](../rules/motion-skill.md) (`focus-ring`),
> [`§4.6`](../rules/motion-skill.md) (`reduced-motion-collapse`). One drift: §4.1
> names the enter curve, but every v2 control runs its hover tint on the
> standard curve. The code is consistent, so the catalog is the stale side.
>
> Shipped in `afi-chip-v2`. The pill shape was set on our Patrimonio filter row;
> this is its v2 primitive.

**Use for** — a filter value the user switches on and off independently of its
neighbours. It can be removable, and it can show the value it applied.

**Not for** — picking one option from a set (segmented control), a general action
(button), navigation (tab), or passive metadata (tag).

The chip is the quietest control in the system on purpose. Its only motion is a
fill crossfade: no scale, no spring, no stagger. Chips sit in rows of five or
ten and get clicked in bursts. If each one moved, the whole row would shimmer.

## Anatomy — three shapes, one pill

```
( ◇ Renta fija )                      toggle
( ◇ Renta fija  × )                   removable
( Clase │ Renta variable  × )         applied value — selected, carrying a value
```

The pill is a **wrapper**, not the control. Inside it sit two sibling buttons:

- the **body**, with an optional leading icon and the label, which toggles
  selection
- the **×**, which either removes the chip or clears its value, never both at once

A button cannot contain a button. Build the pill as a styled container around two
real buttons, not as one button with a clickable glyph inside.

## Chrome

| | |
|---|---|
| Height | 24px (`--height-component-xs`), fixed, with no size variants |
| Horizontal padding | 8px (`--pad-control-sm`) |
| Gap between parts | 4px (`--gap-control-sm`) |
| Radius | full pill (`--radius-full`) |
| Border | 1px (`--stroke-default`) |
| Label and value text | 12px / 16px line-height, medium (`--type-label-*`) |
| Leading icon, × glyph | 16px (`--icon-sm`) |
| Value separator | 1px wide by 16px tall, strong border tone |

Text tones carry the hierarchy, so keep them as specified:

- **Label** is primary.
- **Leading icon** is secondary, deliberately dimmer than the label. The icon
  decorates and the label carries the meaning.
- **Applied value** is tertiary. The filter name reads before its value.
- **×** is secondary.

## States

Only **Selected** and **Disabled** are component state. Hover, pressed and focus
are live pointer and keyboard states. Never expose them as inputs.

| State | Fill | Border |
|---|---|---|
| Default | control default | default |
| Hover | control hover | hover |
| Pressed | control active | hover |
| Selected | control selected | selected |
| Selected + hover | control hover | **selected, held** |
| Selected + pressed | control active | **selected, held** |
| Disabled | disabled | disabled; all text and icons go to the disabled tone |

**The selected border holds through hover and press.** Only the fill responds.
That keeps "this filter is on" readable while the pointer is resting on it.

**Drive fill and border from the pill, not from the button under the pointer.**
Hovering the × lights the whole pill. A chip where only half the shape reacts
reads as two controls glued together.

## Motion

| | |
|---|---|
| Properties | `background-color`, `border-color`, `color` |
| Duration | 150ms (`--motion-duration-fast`) |
| Easing | `cubic-bezier(0.4, 0, 0.2, 1)` (`--motion-easing-standard`) |

That is the whole motion spec. There is no transform on hover or press. Compare
the checkbox and radio in `selection-controls.md`, which swell and dip: those are
single targets, while chips are rows of targets hit in quick succession.

The applied-value segment appears and disappears with **no animation**. The pill's
width snaps to its new size. Do not animate width, because it reflows the whole
row on every toggle.

**Focus ring:** a 2px solid outline at zero offset, outside the pill. It is instant
and never transitioned. It shows on the pill when the body has keyboard focus. The
× draws its own ring, rounded to the glyph, so a keyboard user can tell which of
the two buttons they are on.

## Behaviour

- **Body click** toggles selection.
- **Remove ×** (removable chips) emits a removal and leaves selection alone. Stop
  the click at the ×. Removing must never also toggle.
- **Applied value.** When the chip is selected *and* carries a value, the pill
  grows a segment: separator, value, then a clear ×. That × replaces the remove ×
  for as long as the value shows.
- **Clear ×** deselects the chip and tells its owner to drop the value. The pill
  returns to its empty state, which reads as just the filter name.
- **Deselecting through the body while a value shows counts as clearing.**
  Otherwise the stale value comes back the next time the chip is selected. This
  shipped as a bug once; the rule exists because of it.
- The **owner** holds the value. The chip only displays it.

## Keyboard and semantics

- **Body:** a native button with `aria-pressed` mirroring selection. Space and
  Enter toggle it.
- **×:** a separate native button whose accessible name is a verb plus the label,
  such as "Quitar Renta fija" (remove) or "Borrar Renta fija" (clear). Never use a
  bare "×" or "Cerrar": in a row of ten chips, a screen reader hears ten identical
  buttons.
- **Tab** reaches the body, then the ×.
- **Disabled** puts `disabled` on both buttons, which takes both out of the tab
  order.
- **Touch:** 24px is a dense-desktop opt-out. On a touch-first surface, the
  layout supplies the 44×44 target.

## Don't build a radio group out of chips

Toggle chips are independent. If picking one has to deselect the others, the
control is a segmented control.

Wiring chips into a single-select group works against the chip's own state. The
chip flips itself when clicked, so clicking the chip that is already on turns it
off on screen while the owner still has it selected. The screen and the filter
then disagree, and nothing brings them back until the owner's value actually
changes.

## Reduced motion

Set `transition: none` on the pill and the ×. Selection still reads through fill,
border and ring. Nothing here depended on movement.
