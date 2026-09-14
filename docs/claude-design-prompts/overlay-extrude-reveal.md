# Pattern — overlay extrude + staggered reveal

> Prepend [`_foundation.md`](./_foundation.md) before using this.
>
> Catalog: the stagger half is [`motion-skill.md §4.7`](../rules/motion-skill.md)
> (`stagger-reveal`). The extrude half is **not yet cataloged** — this file is
> currently its only written description.
>
> Shipped in `afi-menu-v2` and consumed by `afi-select-v2`.

**Use for** — dropdowns, selects, menus, popovers, comboboxes. Anything that
opens out of a trigger and contains a list of rows.

Build it as a two-phase reveal. The panel extrudes out of its trigger first and
lands **empty**, then the rows stagger in top-to-bottom. Ordering is the whole
point: the container arrives, then it fills. Do not fade the panel in as a
finished block.

## Phase 1 — panel extrude

| | |
|---|---|
| Duration | 150ms (`--motion-duration-fast`) |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` (`--motion-easing-enter`) |
| Fill mode | both |
| Transform origin | top center |

- `clip-path` from `inset(0 0 100% 0)` to `inset(0 0 0 0)`
- `transform` from `translateY(-2px)` to `translateY(0)`

**Use `clip-path`, never `scaleY`.** A scale squashes the text and distorts the
radius, border and shadow while it runs. The clip wipe keeps every bit of chrome
crisp and reads as the panel growing downward out of the trigger.

The 2px negative translate starts the panel tucked against the trigger and
releases it to its resting offset. That small detail is what makes it read as
*emerging from* the trigger rather than *appearing below* it.

## Phase 2 — row stagger

Each row animates independently.

| | |
|---|---|
| Duration | 200ms (`--motion-duration-base`) |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` (`--motion-easing-enter`) |
| Fill mode | both |

- `opacity` from 0 to 1
- `transform` from `translateY(6px)` to `translateY(0)`

Delay per row, where `n` is the row's 1-based visual position:

```
delay = 150ms + (n - 1) * 40ms
```

The 150ms base equals the panel's extrude duration, so no row starts before the
container has finished.

**Cap the stagger at ten rows.** Every row from the 11th onward shares the
tenth's delay of 510ms. Past ten steps a long menu stops feeling choreographed
and starts feeling slow.

**Dividers count toward the index.** A row's delay tracks its visual position in
the panel, not its index among selectable items. A divider that does not consume
a step will desynchronise everything below it.

## Trigger chrome, running alongside

- Chevron rotates 180° over 150ms on `--motion-easing-standard`
- Border and background colours transition over 150ms on the same curve
- **The focus ring is instant and never transitioned**

## Timeline for a five-row menu

| Time | Event |
|---|---|
| 0ms | panel starts extruding, chevron starts rotating |
| 150ms | panel fully open and empty, row 1 starts |
| 190ms | row 2 starts |
| 230ms | row 3 starts |
| 270ms | row 4 starts |
| 310ms | row 5 starts |
| 510ms | row 5 lands, motion complete |

## Implementation note

Put the stagger delay on the **row**, not the panel. In our stack the reason is
Angular's style encapsulation — projected content carries the consumer's
attribute, so the panel cannot select its own projected children without deep
piercing. Each row reads its own position with `:nth-child()` and derives its own
delay.

Even outside Angular this is the better shape. The row owning its own delay means
a row can be inserted, removed or reordered without the panel recalculating
anything.

## Panel chrome, for visual context

Surface background, 1px hairline border, 12px radius, 4px panel padding, 2px gap
between rows, 32px row height with 6px row radius, 200px minimum width, and a
two-layer shadow:

```css
box-shadow: 0 2px 4px 0 #0000001a, 0 4px 16px 0 #0000000d;
```

## Reduced motion

Panel: `animation: none`, `clip-path: none`, `transform: none`.
Rows: `animation: none`.
Trigger and chevron: `transition: none`.

The panel and its rows still appear. State still reads through the instant colour
and ring change.
