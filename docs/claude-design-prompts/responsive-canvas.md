# Pattern — responsive canvas (widths, rails, collapse order)

> Prepend [`_foundation.md`](./_foundation.md) before using this.
>
> Related: [`page-section-layout.md`](./page-section-layout.md) describes the
> shell and the page header this file sizes; [`planner-top-bar-v1.md`](./planner-top-bar-v1.md)
> describes what's in the top bar before it starts collapsing. This file owns
> the widths and the collapse order for both.
>
> Catalog: [`page-structure-skill.md`](../rules/page-structure-skill.md) §4
> (the single shared content wrapper) and §11 (the responsive baseline).
>
> Shipped in `site-planner-top-bar`, `site-planner-sidebar` and
> `site-objetivos-page-shell`. Every number below was measured in the browser
> on 2026-09-17 at canvas widths 1600, 1280, 768 and 375.
>
> **Sizes and behaviour only.** No colour, no type. Where a surface or an edge
> is unavoidable it's named by role, never by value.

**Use for** — how a planner screen resizes. What has a maximum width, what
stays flush to the edges of the canvas, where the two meet, and the order in
which the chrome collapses on the way down.

---

## 1. Breakpoints measure the canvas, not the window

Every width in this file is the width of **the area the screen is drawn in** —
the artboard, the frame, the preview — not the width of the browser window
around it.

This matters because our screens are reviewed inside frames. A 375-wide
artboard on a 1600-wide canvas has to behave like a phone, and a rule that
reads the window would keep it in its desktop layout. Ask *"is the drawn area
at least N wide?"*, never *"is the screen at least N wide?"*.

---

## 2. Three rails, and only one of them has a maximum

```
┌──────────┬────────────────────────────────────────────────────────┐
│          │←24px→ top bar                                  ←24px→ │  48px
│ sidebar  ├────────────────────────────────────────────────────────┤
│  240px   │                                                        │
│  fixed   │         ┌──── content rail, max 1140px ────┐           │
│          │  ←slack→│←24px→ page header + body  ←24px→ │  ←slack→  │
│          │         └───────────────────────────────────┘          │
└──────────┴────────────────────────────────────────────────────────┘
             └────────── main column: the only scroller ───────────┘
```

| Rail | Width | Behaviour |
|---|---|---|
| Sidebar | 240px, fixed | In flow, full height, scrolls on its own, never shrinks. Becomes a drawer at ≤768 (§6). |
| Top bar | 100% of the main column | 48px tall. 24px inset on both sides. **No maximum width, and never centred on the content rail.** It doesn't scroll. |
| Content rail | max 1140px, centred | 24px inset on both sides, 32px above and below. The only element with a maximum. |

The main column is everything right of the sidebar, and it is the only part
that scrolls. An optional banner sits between the bar and the rail and spans
the full main column, not the rail.

Never use 1180px for the rail. Two older screens still do; it's a drift, not a
size.

---

## 3. Where the rails converge (this is the behaviour to get right)

The content rail is capped at 1140 and centred; the top bar is not capped at
all. So the relationship between them changes with the canvas:

| Main-column width | What you see |
|---|---|
| **Wider than 1140** | The rail is centred with slack on both sides. The bar's controls sit 24px from the canvas edges — outside the rail. The title starts further in than the bar's first control. |
| **1140 or narrower** | The rail stops shrinking anything: it goes edge to edge, and its 24px inset **is** the bar's 24px inset. One rail from the bar down through the page. |

With the 240px sidebar in place, that crossover is a **1380px canvas**. Two
worked examples, because the slack is smaller than it looks:

- 1600 canvas → main column 1360 → rail 1140, about 110px of slack a side.
- 1440 canvas → main column 1200 → rail 1140, about 30px of slack a side.
  Nearly flush, which is why a desktop artboard reads as aligned even though it
  isn't yet.
- 1380 canvas or narrower → flush. Aligned for real, and it stays aligned all
  the way down to the smallest screen.

**What sits on the shared rail, once they converge**

- The page title's left edge, and the page action's right edge.
- The **button boxes** of the bar's first and last controls — not their icons.
  Those controls are 40px squares around 16px icons, so the icon itself reads
  about 12px further in than the title. That's correct: the hit target is on
  the rail, and the icon is centred in it.

**Don't** give the bar its own maximum width to "match" the rail, and don't
centre it on the rail. The bar follows the main column at every size; the rail
comes out to meet it.

---

## 4. Collapse ladder

Read the left column as the width of the content area.

| Content area | What changes |
|---|---|
| > 1380 | Rail centred, slack on both sides (§3). Full bar. |
| ≤ 1380 | Rail is flush; rail and bar share one inset. Nothing else moves. |
| ≤ 1024 | Three-up grids may take an optional two-up step. Layout otherwise unchanged. |
| ≤ 768 | The big hand-off: sidebar → drawer, and the bar re-forms around a menu button and an overflow menu (§5). Card and metric grids go to one column. |
| ≤ 640 | Rail inset drops from 24px to 16px on all four sides. The title row may wrap — the page action drops below the title when the two don't fit. Filter rows wrap. Controls grow to a 44px touch height. |

Each step only adds to the one above it. Nothing un-collapses on the way down.

---

## 5. The 768 hand-off

One breakpoint, three moves. Everything that leaves the bar has somewhere to
go — nothing is simply dropped.

**Appears**

| | |
|---|---|
| Menu button | First thing in the bar, on the rail. Opens the sidebar drawer. |
| Product mark | Centred in the bar, absolutely placed so the clusters on either side can't push it off centre. It's a link home. Below about 360px the wordmark drops and the mark alone stays centred. |
| Overflow menu | A single ⋮ button, last thing in the bar, on the rail. Opens a ~220px panel. |

**Leaves the bar, and where it lands**

| Leaves | Lands in |
|---|---|
| Plan switcher | The drawer — going back to the list and switching plan are navigation. |
| Client name + editable plan name | The drawer, as an identity block at the top. Identity is context, and the drawer owns context at this size. |
| State control | The overflow panel, as a first section of state options with a check on the current one. Picking one changes state directly — no nested panel. |
| Notes, settings | The overflow panel, as labelled items below a divider. They open the same panels they open on desktop, anchored the same way. |

**Stays put**

Bar height (48px), the 24px insets, and the two-cluster arrangement: things
pushed to the leading edge, things pushed to the trailing edge.

**Two rules that are easy to break**

1. Identity appears in exactly one place at a time. On desktop it's in the bar;
   at ≤768 it's in the drawer. Never both.
2. There is no ⋮ on desktop. The overflow button exists only below 768; above
   it, each tool is its own control in the bar.

---

## 6. The drawer

| | |
|---|---|
| Width | 288px, or 80% of the content area, whichever is smaller. |
| Placement | Overlays the page area from the leading edge — **inside the frame the screen is drawn in**, not pinned to the window. |
| Backdrop | Dims the page area behind it; tapping it closes. |
| Behaviour | Slides in from the leading edge while the backdrop fades, both on the enter curve; closing reverses. Reduced motion: it appears in place. |
| Contents | The identity block, then the same navigation as the static sidebar, in the same order. |

The drawer is the static sidebar in a different position — same items, same
grouping, same completion states. Don't reorganise the navigation for narrow
screens.

---

## 7. Artboards to build

Four, and each one has a job:

| Width | Shows |
|---|---|
| 1440 | Rail centred, about 30px of slack a side. The near-miss alignment. |
| 1280 | Rail flush against the bar's inset — the converged state, full bar, sidebar still 240px. |
| 768 | Menu button, centred mark, ⋮. Drawer closed; add a second board with it open over the dimmed page. |
| 375 | Same as 768, plus the 16px inset, the wrapped title row, and the identity block inside the drawer. |

---

## 8. Don't

- Read the browser window when deciding a breakpoint. Read the drawn area.
- Cap the top bar's width, or centre it on the content rail.
- Use 1180 for the rail.
- Inset the page header **and** the rail — that puts the title 48px in while
  the body sits at 24px, and the title drifts right of everything under it.
  One of the two owns the inset; the rail is the safer place for it.
- Hide something from the bar at ≤768 without rehoming it in the drawer or the
  overflow panel.
- Let the sidebar shrink instead of becoming a drawer. It's 240px or it's gone.
- Collapse anything at the 1024 step other than grid columns.

---

## 9. Check before you call it done

- [ ] Every breakpoint reads the drawn area. A 375 artboard on a wide canvas
      shows the phone layout.
- [ ] At 1280 the page title's left edge and the bar's first button box sit at
      the same x. At 1440 they don't, and that's expected.
- [ ] The rail never exceeds 1140, and never sits at 1180.
- [ ] The title's left edge matches the body's first column at every width.
- [ ] At 768: menu button present, mark centred, ⋮ present, no identity in the
      bar, identity present in the drawer, state reachable from ⋮.
- [ ] The drawer is capped at 288px and overlays the page area, not the window.
- [ ] At 375 the inset is 16px on all four sides and nothing overflows
      sideways.
- [ ] No ⋮ anywhere above 768.
