# Pattern — windowed stacked bar + docked readout

> Prepend [`_foundation.md`](./_foundation.md) before using this.
>
> Related: [`page-section-layout.md`](./page-section-layout.md) for the shell the
> chart sits in, and [`responsive-canvas.md`](./responsive-canvas.md) for what
> the breakpoints measure.
>
> Catalog: [`data-viz-skill.md`](../rules/data-viz-skill.md) is the standard for
> chart anatomy, labelling, keyboard map and chart motion. Nothing here overrides
> it; where this file is silent, that file decides.
>
> **Proposed, not built.** Both halves come out of the September 2026 readout
> studies. `afi-chart-bar` has no windowing and no stacked-with-negatives mode,
> and `afi-chart-tooltip` takes only title / value / secondary. This file
> describes what we want, not what Coherence does today. It earns a catalog entry
> when it ships.
>
> **Structure and interaction only.** Colour and type come from the design system
> you already have, named here by role. Where a colour carries meaning — a series
> identity, a negative value — the rule is named; the value is yours.

**Use for** — a stacked bar chart that has to carry more series and more
categories than fit: patrimonio by asset type across a whole retirement, twelve
series over thirty-six years, with a net total and a filter set that can change
the series count while you're looking at it.

Two halves that only work together. The chart gives up showing everything at
once so that what it does show is legible; the readout under it is what you
consult instead, and it never covers the chart.

---

## Anatomy

```
┌──────────────────────────────────────────────────────────────────┐
│ Vista ▾   Escenario ▾   Detalle ▾          12 series · 36 barras │  filters
├──────────────────────────────────────────────────────────────────┤
│  2 M ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│      █ █ █ █ █ █ █ █ █ █ █ █   ← 12 ages, full width            │
│  1 M ┄█┄█┄█┄█┄█┄█┄█┄█┄█┄█┄█┄█┄┄┄┄┄  ══ net notch on each bar     │
│      █ █ █ █ █ █ █ █ █ █ █ █                                    │
│  0 ──█─█─█─█─█─█─█─█─█─█─█─█──────────────────────────────────   │
│      ▀ ▀ ▀ ▀ ▀ ▀ ▀ ▀ ▀ ▀ ▀ ▀   ← negatives below the baseline    │
│       77 78 79 80 81 82 83 84 85 86 87 88   every age labelled   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆ │◄── window ──►│        │  │  overview
│  └────────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────┤
│ ■ Renta variable  ■ Renta fija  ■ …          ▬ Patrimonio neto   │  legend
└──────────────────────────────────────────────────────────────────┘
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  Edad 83    Activos 1,4 M    Deudas −2,0 M    Neto −0,6 M   ⌄      readout
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

The readout is a sibling of the chart, never a layer over it. That is the whole
point of it; if it ever floats, use a different pattern.

---

## Part 1 — the chart

### The stack

| | |
|---|---|
| One bar per period | Age, year, quarter — whatever the x-axis counts. |
| Positive series | Stack upward from the baseline, in a fixed order that never changes between bars. |
| Negative series | Stack **downward** from the same baseline. Never folded into the positive stack, and never shown as a positive. |
| Series colour | One colour per series, fixed for the life of the chart. A colour means the same thing in every bar and in the readout. |
| Negative colour | Anything below the baseline takes the semantic negative colour, whatever colour that series carries when positive. A sign change you can only read from position is one people miss. |
| Baseline | Heavier than the other gridlines. It is the only line in the chart that means zero. |

**Every gridline gets its own label.** Do not skip one because the number is
long. A gridline with no label is read against the label above it, which makes
every value below it wrong.

### The net total

A stacked bar with negative series has a problem that has to be solved
explicitly: **the top of the bar is the sum of the positives, not the net.** If
debt sits below the line, the bar's top edge can be millions above the real
total, and a total drawn as a floating dot lands in the middle of a coloured
block it has no relationship to.

Two marks, together:

- **A notch on every bar** at the net value — a short rule across the bar's full
  width plus a little overhang, drawn with a halo in the surface colour behind it
  so it survives crossing a dark block.
- **A line through the notches**, quieter than the notch itself. It carries the
  trajectory; the notch says which bar each point belongs to.

Never draw the total as unconnected markers. It is the one series that carries
the plan's direction and it should be the most trend-readable mark on the chart,
not the least.

### The window

| | |
|---|---|
| Visible | About twelve bars, at whatever width the container gives them. The number is a target, not a constant — pick what leaves a stacked bar legible with its labels. |
| Labels | Every visible period is labelled. That is the payoff for windowing; if you still have to label every fifth one, the window is too wide. |
| Hidden | Nothing. Every period and every series is still in the chart, just not all in the viewport at once. |
| Moving it | Click anywhere in the overview to centre the window there. Drag to scrub it. |
| Keyboard | Arrow keys move the cursor one period. Reaching the edge scrolls the window rather than stopping dead. |

**Do not bin, average or drop periods to make them fit.** The window is the
answer to "too many bars" precisely because it costs no data. Binning is a
different pattern with a different trade — it loses the year-to-year steps and
flattens the cliff at retirement.

### The overview

A thin strip below the plot holding **all** the periods as miniature bars, with
the current window drawn over it as a rectangle. It is a map, not a chart: it
carries shape and position, not values, so it needs no axis and no labels beyond
the range at its leading edge.

The window rectangle is the only interactive thing in the strip. Hovering the
strip must not scrub the main chart — that is what the plot is for.

### The legend

One swatch per series in the order they stack, plus one entry for the net total
drawn as a line rather than a swatch. When the series count changes because a
filter changed, the legend changes with it — it always describes what is on
screen, never the full catalogue.

### Filters

Filters sit above the chart and can change the number of series under the
reader. Two rules:

- The chart re-renders in place. The window does not reset, the cursor does not
  move, and the reader does not lose their position because a filter changed.
- Show the resulting shape somewhere quiet — "12 series · 36 barras" — so a
  filter that produces a hundred series is visible as a decision, not a surprise.

---

## Part 2 — the readout

### Where it lives

Docked immediately under the chart, in the layout, at full width. It is part of
the page's vertical flow.

**It never overlays the plot.** Not on hover, not on click, not expanded. Every
other readout shape we tested — a floating tooltip, a side drawer, a centred
panel — covers the data it is describing, and on a chart this dense that means
covering the answer. This one cannot, because it has nowhere to float to.

### Collapsed

One row, always visible, following the cursor:

| Cell | Content |
|---|---|
| Period | The age or year under the cursor. |
| Positive total | The sum above the baseline. |
| Negative total | The sum below it, in the negative colour. |
| Net | The number the notch marks. Negative takes the negative colour. |
| Disclosure | A chevron with a word, not a bare icon — "desglose ⌄" / "cerrar ⌃". |

At rest, before anyone touches the chart, it shows the final period. It is never
blank.

### Expanded

The chevron grows the row downward **in place**, pushing the page rather than
covering the chart. Inside, a plain table:

- **Grouped**, with a header row per group carrying the group's own total.
- **One row per series** under its group, each carrying **a colour swatch that
  matches its block in the chart**. The readout is the legend — a reader must be
  able to map a row back to a block without counting positions.
- A share-of-total column, so a row that is invisible in the bar still reports
  its size.
- A net total row at the foot.

**Rows worth zero on both sides do not render.** A category the client does not
hold is absent, not listed as 0. This is not tidying: those rows are what push
the list past a screen and force it to scroll.

Expanded stays expanded while you scrub. Moving the cursor rewrites the values;
it does not close the panel and it does not reset its scroll position.

---

## Motion

Follow `data-viz-skill.md` for chart motion. Specific to these two:

| Change | Behaviour |
|---|---|
| Window moves | Bars re-render in place. No slide, no crossfade — the window is a viewport change, not a transition. |
| Cursor moves | Values in the readout swap instantly. Nothing animates on a scrub; at sixty periods a second, motion here is noise. |
| Readout expands | The container opens; its contents are already there when it arrives. Never the reverse. |
| Readout stays open while scrubbing | No enter animation on re-render. A panel that replays its entrance on every hover step reads as a flicker — this is the single easiest way to get this pattern wrong. |
| Filters change the series | Bars interpolate to their new heights. The legend and the readout swap instantly. |
| Reduced motion | Everything lands in the same frame. Nothing here depends on movement to be understood. |

---

## Don't

- Draw the net as unconnected dots, or anywhere except on the bar it belongs to.
- Skip a gridline label because the number is long.
- Fold negative series into the positive stack, or draw them as positives.
- Let the readout float, overlay, or acquire a close button. A thing you have to
  dismiss is a dialog, and this is not one.
- List rows that are zero on both sides.
- Reorder the stack between bars to put the small series together. The order is
  what lets the eye track one series across the chart.
- Reset the window or the cursor when a filter changes.
- Bin or average periods to make them fit. Move the window instead.
- Use colour as the only thing separating two adjacent series — a hairline in the
  surface colour between blocks does the separating; colour does the identifying.

---

## Check before you call it done

- [ ] The net notch sits on every bar, and the net line passes through the notches.
- [ ] Every gridline carries its own label, including the ones with long numbers.
- [ ] Negative series stack below the baseline in the negative colour.
- [ ] Every visible period is labelled — no every-fifth fallback inside the window.
- [ ] Clicking and dragging the overview both move the window; hovering it does not scrub.
- [ ] Arrow keys move the cursor, and scroll the window at its edge.
- [ ] The readout is never on top of the plot, in any state.
- [ ] Expanding pushes the page; it does not cover the chart.
- [ ] Every readout row carries the swatch of its block.
- [ ] Zero-on-both-sides rows are absent, not zero.
- [ ] Scrubbing with the readout open rewrites values without replaying any
      entrance animation.
- [ ] Changing a filter leaves the window and the cursor where they were.
