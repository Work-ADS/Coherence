# Pattern — sliding selection indicator

> Prepend [`_foundation.md`](./_foundation.md) before using this.
>
> Catalog: [`motion-skill.md §4.13`](../rules/motion-skill.md) (`selection-slide`)
> for the indicator, [`§4.12`](../rules/motion-skill.md) (`swap-slide-blur`) for
> the panel entrance.
>
> Shipped in `afi-tabs`, `afi-tabs-v2`, `afi-segmented-control`,
> `afi-segmented-control-v2`.

**Use for** — tabs, segmented controls, any "pick one from a row" control where
a marker travels to the selected option.

One indicator element is absolutely positioned inside the track, measured against
the active trigger's bounding rect, and moved with `transform`. The triggers
themselves never move. Only the indicator animates, so label text stays crisp.

Three of our four implementations use a plain CSS transition. The fourth
overshoots, and that one is worth copying deliberately.

---

## A. Segmented control — sliding pill

The pill sits at `z-index: 0` behind the options; options sit at `z-index: 1` on
a transparent background. The track carries a filled background, the pill carries
the active fill.

| Property | Duration | Easing |
|---|---|---|
| `transform` | 200ms | `--motion-easing-standard` |
| `width` | 200ms | `--motion-easing-standard` |

The pill translates on X only and is vertically inset by the track padding, so it
never needs to measure its own height.

**Gate the transition on first measurement.** Apply the transition via a separate
class that is only added *after* the first measure lands. Without this the pill
grows in from zero width on page load instead of simply appearing under the
initial selection. This is not a nicety — it is visible on every cold load.

Option labels crossfade colour over 150ms, and the active label steps up one font
weight.

> Our older brand variant also animates `height` (150ms) and translates on both
> axes, because its track wraps onto multiple lines. Single-line tracks do not
> need either.

---

## B. Tabs — sliding underline with follow-through

A thin bar pinned to the bottom edge of the track, spanning the active trigger's
width.

**Width** is a plain CSS transition: 200ms on `--motion-easing-standard`.

**Position** is a three-keyframe animation driven by script, not CSS:

| Keyframe | Offset | Transform |
|---|---|---|
| 1 | 0 | `translateX(start)` |
| 2 | **0.62** | `translateX(target + overshoot)` |
| 3 | 1 | `translateX(target)` |

Duration 200ms. Each keyframe eased with `--motion-easing-standard`.

### Why this is not a CSS easing

The overshoot must be a **fixed 6px**, and a CSS easing cannot express that. An
easing curve is normalised over the travel, so any overshoot baked into it is
always a *percentage* of the distance.

We measured this. A tamer custom curve threw a 235px tab hop 7px past its mark,
which read well — and moved a narrow 3-tab bar 2.4px, which was invisible. Same
curve, same page. Follow-through is a property of the moving object, not of how
far it went. So the position moved to script and the distance became a constant.

### Two guards on the overshoot

- **Capped at 30% of the hop.** A short hop must not fling the full 6px, which
  reads as a twitch rather than weight.
- **Signed by the direction of travel**, so it overshoots whichever way the bar
  is going.

### Re-targeting mid-flight

When a second click lands while the bar is still moving, read its **actual**
current position out of its computed transform matrix and start from there. Do
not start from the last committed position — the bar visibly snaps back to the
previous tab before setting off again.

### Overshoot applies to open markers only

A segmented control's pill is bounded by its track. Overshooting would push it
into or past the track wall. Pills keep plain transitions; only the free-running
underline gets follow-through.

---

## C. Panel entrance on swap (optional)

When the panel content changes, slide it in from the direction of travel with a
light blur.

| | |
|---|---|
| Duration | 200ms (`--motion-duration-base`) |
| Easing | `--motion-easing-standard` |
| Fill mode | both |

- `opacity` 0 to 1
- `filter` `blur(4px)` to `blur(0)`
- `transform` `translateX(±12px)` to 0

The sign encodes direction: moving to a tab on the right, the new panel enters
from +12px; moving left, from -12px. That is the entire point of the pattern —
the blur alone is decoration, the direction is information.

This is optional and independent of the underline. Our modern tab bar ships
without it; the underline is the only motion that list owns.

---

## Reduced motion

Set every transition and animation above to `none`. The indicator still lands in
the right place instantly, and selection still reads through colour and weight.

Note how the underline gets this for free: because there is no CSS transition on
`transform`, simply skipping the scripted animation lands the bar immediately.
The reduced-motion behaviour falls out of the architecture instead of needing its
own rule. Aim for that shape.

---

## Constants that are not tokens

The overshoot's shape numbers — the **0.62** keyframe offset and the **30%**
cap — are curve-shape constants and stay hardcoded. They describe the feel of the
motion, not a brand decision.

The overshoot **distance** is a token. That is the value a client retune would
change.
