# Pattern — selection control feedback (checkbox, radio, switch)

> Prepend [`_foundation.md`](./_foundation.md) before using this.
>
> Catalog: [`motion-skill.md §4.8`](../rules/motion-skill.md) (`press-squish`)
> and [`§4.9`](../rules/motion-skill.md) (`control-fill-fade`).
>
> Shipped in `afi-checkbox-v2`, `afi-radio-v2`, `afi-toggle-v2`.

**Use for** — checkboxes, radios, switches. Small binary controls that live in
forms and get clicked a lot.

These three share one motion family. A control swells under the pointer, dips
under the press, and springs back on release. The fill crossfades slowly
underneath, and the selection mark arrives on its own beat. Nothing about it is
loud; the whole effect is that the control feels like an object rather than a
rectangle that changes colour.

One easing does most of the work here:

```
--motion-easing-spring: cubic-bezier(0.34, 2, 0.64, 1)
```

That curve overshoots. It is what turns every scale and slide below into a
release rather than a stop.

---

## The shared recipe — press feedback

Applies to the checkbox box, the radio ring, and (in modified form) the switch
thumb.

| Trigger | Transform | Duration | Easing |
|---|---|---|---|
| Hover | `scale(1.05)` | 200ms | spring |
| Press | `scale(0.95)` | 200ms | spring |

Two things make this work in practice.

**Drive it from the whole row, not the control.** Hover and press are detected on
the label row, so clicking the text gives the same tactile feedback as clicking
the box. A control that only responds when you hit the 16px square feels broken.

**Order the rules so press wins.** The press rule sits after the hover rule at
equal specificity, because while you are pressing you are also hovering. Get this
backwards and the dip never shows.

---

## The shared recipe — fill crossfade

| Property | Duration | Easing |
|---|---|---|
| `background-color` | **500ms** | standard |
| `border-color` | **500ms** | standard |

The long fade is deliberate and it is the single most copied-wrong value here.
At 150ms a fill change is a flick. At 500ms it blooms, and because the scale
springs at 200ms underneath it, the two run at visibly different speeds. That
split is the effect. Do not unify them.

---

## A. Checkbox — delayed check draw

Box is 16px with a 4px radius and a 1px border. Icon is 12px, drawn with
`stroke-width: 1.5` and round caps.

The check does not fade in. It **draws**, using a dash offset as the CSS
equivalent of animating path length:

```css
stroke-dasharray: 16;   /* ≈ the check path's length in user units */
stroke-dashoffset: 16;  /* hidden */
opacity: 0;
```

On check, both `stroke-dashoffset` and `opacity` animate to their visible values
over 200ms on the standard easing.

**The check waits one beat.** It carries `transition-delay: 200ms`, equal to its
own duration, so the brand fill lands *first* and the check then draws onto a
finished surface. This is the signature of the whole pattern. Remove the delay
and it becomes an ordinary checkbox.

Unchecking reverses with **no delay**. Going away should be immediate; only
arriving earns a sequence.

The indeterminate dash uses the same draw and fade with no delay, on a shorter
dasharray of 8, because it animates in a single beat rather than as a sequence.

Keep the icon mounted at all times. Unmounting it makes the stroke pop instead
of draw.

---

## B. Radio — spring-scaling dot

Ring is 16px and circular, with an 8px inner dot.

The dot scales from `scale(0)` to `scale(1)` over 200ms on the **spring** easing.
The overshoot means it arrives slightly too big and settles, which reads as the
dot dropping into the ring.

Note the difference from the checkbox: the radio's *empty* fill also tracks
pointer state, deepening a step on hover and again on press. The checkbox keeps
a static canvas fill when unchecked. That is a deliberate divergence, not an
inconsistency, and it is verified against the design source.

---

## C. Switch — spring slide and a height-only squish

Track is 36 by 20 with a 2px inner pad. Thumb is a 16px white circle, and it is
the **only** element here carrying a shadow.

Travel is computed, not hardcoded:

```
travel = track width − (pad × 2) − thumb width = 36 − 4 − 16 = 16px
```

The thumb slides by `translateX(travel)` over **150ms** on the spring easing. The
overshoot carries it a hair past its endpoint into the track wall before it
settles, which reads as a physical thunk against the end of its run.

**The press squish is height-only.** The thumb flattens with `scaleY(0.8)` while
its width holds, then springs back to a full circle on release. A uniform scale
makes it shrink; flattening makes it squash, which is what a physical object
does under a finger.

Store the travel distance in its own custom property so the squish can compose
with the slide:

```css
transform: translateX(var(--_travel)) scaleY(0.8);
```

Without that, pressing the thumb at the "on" end teleports it back to the start.

Track fill transitions over 150ms on the standard easing, faster than the
checkbox and radio fills, because the thumb's position is already carrying the
state change.

---

## Focus

All three share one focus ring: a solid outline at zero offset, the same look as
the system's buttons. **Instant, never transitioned.** A focus ring that animates
lags behind keyboard navigation and reads as sluggish.

---

## Reduced motion

Set every transition to `none`, and explicitly reset the hover and press
transforms to `none` (for the switch, back to `translateX(var(--_travel))`
without the scale).

That second part is the one people miss. Leaving a transform in place while
removing its transition does not remove the motion, it makes it snap, which is
worse than not moving at all.

Everything still reads: the fill changes, the check appears, the thumb is at the
correct end. Only the easing is gone.

---

## Honest note on the switch

The spring easing on the thumb slide is marked in our code as a trial, carried
over when this family was retuned, with a note to revert to the standard easing
if it reads as a glitch rather than as weight. Overshoot on a thumb inside a
bounded track is a genuinely closer call than overshoot on the radio dot. Look
at it on real hardware before committing.
