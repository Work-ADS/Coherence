# Motion foundation — prepend this to any prompt in this folder

You are building motion for a design system. The individual pattern brief that
follows assumes everything below.

## Principles these patterns share

**Order communicates.** When two things move, the order is the message. A
container arrives, then its contents fill it. Never the reverse, and never both
at once — simultaneous motion reads as a single blurry event rather than a
sequence with cause and effect.

**Animate the cheap property.** Prefer `transform`, `opacity` and `clip-path`.
Never animate a property that reflows layout, and never animate a property that
distorts text or chrome mid-flight.

**Distance is not weight.** Follow-through is a property of the moving object,
not of how far it travelled. Anything expressed as a percentage of the travel
will be invisible on a short hop and loose on a long one.

**Motion is never the only signal.** Every state change these patterns decorate
must still read with all motion removed, through colour, weight, position or
a ring.

## Token snapshot

Values are given as tokens with their current resolved value in brackets. Use
your own equivalent tokens. Do not hardcode the numbers if you have a token
layer.

### Durations

| Token | Value | Used for |
|---|---|---|
| `--motion-duration-fast` | 150ms | State changes on a single element — colour, border, rotation |
| `--motion-duration-base` | 200ms | An element travelling, or a container opening |
| `--motion-duration-slower` | 500ms | Slow fill crossfades on small controls |

### Easings

| Token | Value | Used for |
|---|---|---|
| `--motion-easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetric moves — anything that slides between two positions |
| `--motion-easing-enter` | `cubic-bezier(0.16, 1, 0.3, 1)` | Things arriving — a heavy decelerating curve that lands softly |
| `--motion-easing-spring` | `cubic-bezier(0.34, 2, 0.64, 1)` | Things settling — overshoots its endpoint, then returns |

The enter curve is the one that does most of the perceived "smoothness". It
front-loads almost all the travel and settles slowly, so an element appears to
arrive under its own momentum rather than being placed.

The spring curve is the opposite tool. It deliberately overshoots, so use it on
small objects that should feel physical — a thumb hitting the end of its track, a
dot dropping into a ring. On anything large it reads as a glitch.

### Spatial

| Token | Value | Used for |
|---|---|---|
| `--motion-reveal-rise-light` | 6px | How far a revealed element rises into place; also the fixed overshoot distance |
| `--motion-reveal-stagger-light` | 40ms | Delay between consecutive items in a staggered group |
| `--gap-control-xs` | 2px | Small positional offsets inside a control |

## Reduced motion — non-negotiable

Under `prefers-reduced-motion: reduce`, every pattern here collapses to **none**,
not to a shortened version. Set `animation: none` and `transition: none`, and
reset any property the animation was driving to its resting value.

The element still appears and still lands in the right place. It just does not
travel. Respect the preference as respect, not as a degraded experience.

Where possible, architect so this falls out for free. If position is driven by
script and there is no CSS transition on `transform`, skipping the script lands
the element instantly, and reduced motion needs no rule of its own.
