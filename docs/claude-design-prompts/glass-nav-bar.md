# Pattern — glass nav bar (content blurs under it)

> Prepend [`_foundation.md`](./_foundation.md) before using this.
>
> Catalog: **none yet.** Neither `motion-skill.md` nor
> `page-structure-skill.md` describes this bar. The code calls the recipe "the
> coherence glass", and this file is currently its only written description.
>
> The same recipe ships in two places:
>
> - **`site-planner-navbar-v2`** — the V2 product bar, on Demo 1, Panel asesor
>   and the workbench.
> - **`afi-top-bar` with `variant="glass"`** — the bar on our design site
>   (Diseño en Afi, Workbench, Demos). This one also switches to light-on-dark
>   when dark content passes under it.
>
> **Structure and interaction only.** Colour and type come from the design
> system you already have, named here by role. Measured in the browser on
> 2026-09-16.

**Use for** — the top bar of a page that scrolls, when the page should keep a
sense of depth. Content slides under the bar and shows through it, frosted,
instead of vanishing behind a solid edge.

**Not for** — bars over busy imagery where you can't guarantee legibility
(unless you use the dark-content switch below), dialogs and sheets, or any
bar that nothing scrolls under — without movement behind it, the frost reads
as a flat grey.

## The recipe

One surface, three layers, from the back:

1. **Blur.** Whatever is behind the bar is blurred by 16px (`--blur-lg`). The
   blur applies to the backdrop, never to the bar's own contents.
2. **Tint.** The bar's surface colour at **55% opacity** sits over the blur.
   That's enough to keep the bar's text readable, and thin enough that shapes
   and movement still show through.
3. **Contents.** Logo, breadcrumb, menu and icons, at full opacity and sharp.

```css
.glass-bar {
  background: color-mix(in srgb, var(--surface) 55%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
```

The tint is the only colour. There's no gradient and no glow behind the glass.
The frost *is* the effect.

```
┌─────────────────────────────────────────────────────────────┐
│ ‹  Cliente · SIM-2025-0011  ● Aprobada           ▤  ⚙  (RG) │  contents: sharp
│░░░░░░░ the top of a card, sliding under, blurred ░░░░░░░░░░░│  16px blur + 55% tint
└─────────────────────────────────────────────────────────────┘  hairline (product bar only)
   the rest of the card continues, sharp, below the bar
```

## Two ways to place it

The effect only exists if content really passes under the bar. So both bars
sit **inside** the scrolling area, at its top — never above it.

| | Product bar (V2 planner) | Site bar |
|---|---|---|
| Height | 48px (`--shell-header-height`), level with the sidebar's logo row | 56px (`--top-bar-height`) |
| Placement | Sticky at the top of the scrolling area, taking its own space | Floating over the top of the scrolling area |
| At rest | Content starts right under the bar | The content area has 56px of top padding, so nothing starts hidden behind the bar |
| Bottom edge | 1px hairline in the default border tone | None — the frost is the edge |
| Width | Full bleed; the tint runs edge to edge. The controls sit on the page's side padding, so they line up with the content below | Full width, with 16px side padding |
| Layering | Above page content | Above page content |

**Why the edges differ.** The product bar sits over dense data, so a hairline
keeps it reading as a boundary. The site bar is editorial and lets the frost do
that job. If you design a new bar, pick one and say which.

**The content area, not the window, must be what scrolls.** If the whole window
scrolls, a floating bar scrolls away with the page. That's why the site's shell
is fixed to the screen height and only the content area scrolls.

## Interaction

| Change | Behaviour | Status |
|---|---|---|
| Scrolling | Content slides under the bar. The bar itself never moves or changes. The frost is always on; it doesn't wait for a scroll to appear. | Ships |
| Dark content passes under the site bar | The tint drops to fully transparent, leaving pure blur. The logo, menu and language toggle switch to their light-on-dark tones. Background and text change together, over 150ms on the standard curve, so it reads as one move. It switches back once the dark content has passed. | Ships, site bar only. **No page triggers it today:** every dark thumbnail on the blog is also marked "framed", which turns the switch off |
| How the switch decides | Pages tag their dark surfaces, such as hero images and dark cards (`data-nav-tone="dark"`). On every scroll and resize, at most once a frame, the bar checks whether any tagged surface overlaps it: its top above the bar's bottom edge, and its bottom still on screen. | Ships |

- **The switch uses position, not colour.** It flips the moment any part of a
  tagged surface is under the bar, and nothing samples pixels.
- **Don't fake contrast with blend modes.** Text set to `mix-blend-mode`
  (difference, exclusion…) conflicts with the backdrop blur in Chromium. The
  tag-and-check approach exists because of that.

## Watch for

- **Keep the blur to the bar.** A screen-sized blurred layer elsewhere on our
  site broke Chrome's scrolling, and had to be replaced with a pre-softened
  gradient. The blurred area should be the bar's size, and no bigger.
- **Busy light content.** The dark switch covers dark surfaces only. Busy light
  content (a dense chart, say) can still make the bar noisy at 55%. If a page
  keeps busy content at the top, raise the tint for that page instead of
  changing the recipe.
- **No fallback in code.** Where backdrop blur isn't supported, the bar would
  show its 55% tint over sharp content. If you design for such a context, raise
  the tint to about 90% there.
- **Contents never blur.** Blur the backdrop, not the bar itself. `filter:
  blur()` on the bar would blur its own text.

## Reduced motion

- **The frost stays.** Blur and tint are a surface, not movement.
- **The dark switch should change instantly** under reduced motion. It doesn't
  yet: the 150ms crossfade runs regardless, because neither bar has a
  reduced-motion rule.
