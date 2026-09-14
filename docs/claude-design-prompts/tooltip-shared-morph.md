# Pattern — tooltip reveal + shared morph

> Prepend [`_foundation.md`](./_foundation.md) before using this.
>
> **Status: PROPOSED, not shipped.** Every other file in this folder describes
> motion that exists in `libs/ui`. This one does not. Our shipped `afi-tooltip`
> is v1 and does a plain 150ms opacity fade ([`motion-skill.md §4.2`](../rules/motion-skill.md),
> `opacity-fade`). There is no v2 tooltip and no catalog entry for anything below.
>
> Values below are read from the animate-ui source
> (`apps/www/registry/primitives/animate/tooltip/index.tsx`), not from its docs
> pages, which publish only the transition config.

**Use for** — tooltips, and any small transient overlay that appears near a
trigger on hover or focus.

Two separate behaviours. The reveal is the easy half. The shared morph is the
part worth copying.

---

## A. The reveal

The source animates three properties together.

| Property | From | To |
|---|---|---|
| `opacity` | 0 | 1 |
| `scale` | **0** | 1 |
| `x` / `y` | **15px toward the trigger** | 0 |

Scale starts at zero, not near it. The tooltip grows from a point rather than
easing up from nearly full size.

The offset is per side and always points back at the trigger. A tooltip on top
starts 15px lower and rises; one on the left starts 15px to the right and moves
out. Exit reverses to exactly the same values, so it shrinks back toward
whatever it was labelling.

Note there is no `transform-origin` trick here. The scale runs from the centre
and the directional read comes entirely from the 15px offset.

### The timing

The source specifies a physical spring:

```
{ type: "spring", stiffness: 300, damping: 35 }
```

**That spring does not bounce**, which is worth stating because the word invites
the wrong instinct. With unit mass, stiffness 300 and damping 35 give a damping
ratio of about 1.01. That is critically damped: it settles fast and stops dead,
with no overshoot at all.

In a CSS system it translates to:

| | |
|---|---|
| Duration | 200ms (`--motion-duration-base`) |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` (`--motion-easing-enter`) |

**Do not reach for `--motion-easing-spring` here.** Our spring token overshoots
hard by design, for thumbs and dots that should feel physical. Using it would
invent a bounce the source does not have.

---

## B. The shared morph — the actual pattern

Wrap a group of triggers in one provider. While any tooltip in that group is
open, moving to a sibling trigger makes the **same** tooltip travel and resize to
the new trigger, instead of one fading out and another fading in.

This is the whole idea. A toolbar of icon buttons stops flickering through a
sequence of unrelated boxes and reads as one label following your pointer.

In the source this is a shared layout id on the content element, with the arrow
carrying its own matching id so it travels with the box rather than on its own
schedule. The switch itself bypasses all delay logic: if a tooltip is already
open, the new one is set immediately with no timer.

Two things make it read well:

**Morph the box, crossfade the text.** The container animates position and
dimensions on the reveal timing above. The label inside crossfades rather than
stretching, so text of different lengths does not distort mid-travel.

**Group the triggers deliberately.** The morph should only cross triggers that
belong together, such as one toolbar or one button cluster. A tooltip sliding
across unrelated regions of a page reads as a bug.

---

## C. Delays, and the grace period

| | Value |
|---|---|
| Open delay | **700ms** |
| Close delay | 300ms |

700ms is the cold-start delay, so merely passing the pointer over something never
fires a tooltip.

The close delay does double duty, and this is the detail worth copying exactly.
It is both how long the tooltip lingers after the pointer leaves **and** a
memory window. If a new trigger is entered within 300ms of the last one closing,
the open delay is skipped entirely and the tooltip appears instantly.

So the group has three speeds, and they are all the same rule:

- Cold, nothing open recently: wait 700ms.
- Warm, something closed under 300ms ago: instant.
- Hot, a tooltip is open right now: morph, no timer.

That progression is what makes a toolbar feel responsive without making a single
stray hover noisy.

---

## D. Arrow

If the tooltip has an arrow, give it the same shared identity as the box so the
two travel together. The source makes this a flag, on by default, which is the
right default. An arrow animating on its own timing detaches from its box.

---

## Reduced motion

Collapse to an instant appearance with no scale and no travel.

**Disable the morph entirely, not just its easing.** Under reduced motion the
tooltip should hide and re-show at the new trigger. A box sliding across the
screen is exactly the kind of large positional motion the preference exists to
suppress, and it is the most important thing on this page to get right.

---

## Before building this

Two parts, with very different costs.

**The reveal is cheap.** Opacity, scale and a 15px offset on a 200ms enter curve
is a plain CSS transition, and it fits the system as it stands.

**The morph is not.** Animating a box between two positions and sizes requires
measuring both and inverting the difference, which CSS cannot express on its own.
In the source this is handled by a layout-animation library; for us it is real
work, and it needs shared state across a trigger group that our current tooltip
has no concept of.

Build the reveal first. Treat the morph as a separate decision. If either ships,
it earns a numbered entry in [`motion-skill.md`](../rules/motion-skill.md) and
this file should be rewritten to describe what shipped.
