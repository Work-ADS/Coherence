# Data-viz skill

## North star

Charts at AFI earn trust by being **findable, learnable, focused, trusted, valuable** — Visa PDS's five principles, adopted verbatim. Borrow what Visa has already figured out; extend only where they're silent.

## Source of truth

- **Primary reference:** Visa Product Design System — https://design.visa.com/data-visualization/
- **Vendored copy:** `docs/reference/visa-pds/data-visualization/` — the six Visa pages plus a reconstructed `chart-accessibility.md`, retrieved 2026-07-30. Read those when you need Visa's own wording or the anatomy diagrams; read *this* file for what AFI actually does.
- Deviations from Visa must be intentional and documented inline (in code comments or the chart primitive's docstring). The known ones are marked **Deviation** below.
- Where Visa is silent (motion, es-ES number formatting, semantic tokens), Coherence extends.

## Non-negotiables

1. **Color is never the only cue.** Every encoded distinction pairs color with texture fill, position, or direct labeling.
2. **Neutral-first palette.** One color from the neutral data-viz palette by default. Reserve the highlight palette for the focus element.
3. **Bar charts start at zero.** Line charts may start above zero when the dataset's minimum is significantly above zero — document the scale on the chart.
4. **Straight line segments only.** No spline/curve smoothing — it distorts trend.
5. **Plain sentence case everywhere.** Titles, axis labels, legends, data labels. Spanish follows RAE (see `copy-skill.md`).
6. **Prefer direct labeling over legends** when the chart shape allows.
7. **Every chart ships four descriptive-text properties** (see Accessibility).
8. **Keyboard map is fixed and shared across all chart primitives** (see Accessibility).
9. **Reduced-motion respected.** Updates ≤200ms by default; `prefers-reduced-motion` collapses enter/update to instant.
10. **Numbers format for es-ES locale.** `1.234,56` — not `1,234.56`. Abbreviations in RAE forms.
11. **No distortion shapes.** No 3D, no exploded slices, no pie with >5 slices, no dual y-axes without explicit regulatory justification.

## Anatomy

Every chart is assembled from the same parts. Required means the primitive renders it and you cannot switch it off.

| Part | Bar | Line | Heatmap | Dumbbell |
| --- | --- | --- | --- | --- |
| Title | optional | optional | optional | optional |
| Subtitle | optional | optional | optional | optional |
| Data table button | **required** | **required** | optional | **required** |
| Keyboard instructions button | required | required | required | required |
| Plot canvas | required | required | required | required |
| Data markers | required | required | required | required |
| Quantitative axis | required | required (vertical) | — | required (vertical) |
| Categorical / date axis | required | required (horizontal) | required (both) | required (horizontal) |
| Legend | — | optional | optional | optional |
| Series labels | — | optional | — | — |

**Deviation (intentional):** Visa marks the data table button *optional* on all four charts. Coherence makes it **required** on bar, line and dumbbell — the data-table fallback is our answer to the tooltip-only-data ban, so it can't be opt-in. Heatmap stays optional, matching Visa, because a fully data-labelled heatmap is already readable.

## Chart selection

Start with a written brief, then the three-step refinement (Visa PDS). The brief comes first because every later step, and every review, is judged against it: without it you can say a chart is tidy, never that it's right.

### Step 0 — Brief (required before any chart is chosen or built)

Answer these in writing before choosing a shape. If the key question or the decision is blank, stop and ask; don't guess from the data that happens to be available. One brief per audience: if two audiences need the same data, they get two briefs.

| Field | Answer |
| --- | --- |
| **Audience** | Who reads this chart? How well do they know the topic and how comfortable are they with numbers? How long will they look at it: a glance, or a sit-down analysis? |
| **Key question** | The one question the chart answers, written as a question. Plus the follow-up questions the reader is likely to ask next. |
| **Decision** | What will the reader do with the answer? Is there a threshold that triggers action (a budget, a target, a risk level)? If nothing changes after reading it, the chart shouldn't exist. |
| **Medium** | Where it's read: dashboard, PDF report, slide, mobile. Static or interactive? At what size? |
| **Data** | What's measured and in what unit (e.g. € invested). Per what (per client, per fund). Grouped by what (region, month). Any extra breakdowns. Source, date, and how complete and fresh the data is. |

The brief feeds the steps below: the key question picks the insight (Step 1), the decision and its threshold pick the focus (Step 2), the audience and medium set how much to reduce and label (Step 3).

Adapted from the Viz Canvas in Visa's *Data Experience Critique Framework* (Visa Data Experience Team, 2022): reworded for AFI, not reproduced.

### Step 1 — Insight

Pick the business question the chart has to answer.

| Insight | Key business question |
| --- | --- |
| Association | How are items related? |
| Current status | What is the current value of a metric, and is it good or bad? |
| Composition | Which categories have a higher share of the whole? |
| Correlation | Is there a meaningful pattern between two numbers? |
| Deviation | How much difference is there between two numbers? |
| Distribution | What is the range of values, and how does it compare to the average? |
| Flow | How do items move through a sequence? |
| Trend | How has a number changed over time? |
| Ranking | Which items have the highest and lowest values? |
| Spatial | How does location impact a pattern? |

Visa's table stops at the question; its insight → chart mapping lives in its examples index and covers only four chart types. The table below closes that gap for all ten insights, using the FT Visual Vocabulary, the Urban Institute style guide and GitLab Pajamas (see **Sources for chart choice**).

- **Built**: a Coherence primitive exists. Use it.
- **Allowed, not built**: a sound choice. Draw it in the mock-up following its rules under **Charts without a primitive yet**, and add a visible note: "Este gráfico aún no es un componente del DS". The component gets built when a real screen needs it, at design review, not in advance. Don't force a built shape onto the wrong insight.
- **Avoid**: misleading or hard to read for this insight, even when it looks familiar.

| Insight | Built | Allowed, not built | Avoid |
| --- | --- | --- | --- |
| Association | Heatmap (matrix of two categories) | Network diagram, only when the connections themselves are the story | Venn diagrams carrying data |
| Current status | — | KPI tile; bullet chart (value against a target or range) | Gauges and speedometers; a one-value donut |
| Composition | Bar (when only the size of each part matters, sorted) | Stacked bar; 100 % stacked bar; donut or pie; treemap (parts within parts); waterfall (parts that add or subtract to a total) | Several pies side by side to compare; 3D or exploded pies |
| Correlation | Heatmap (two categories) | Scatterplot (two numbers); bubble chart (a third number, sparingly) | Two lines on dual y-axes to imply a relationship |
| Deviation | Dumbbell; bar running either side of zero or a target | Diverging bar; surplus/deficit filled line | Red vs green as the only cue |
| Distribution | Bar (binned, Visa's "distribution summary") | Histogram; dot strip; box plot (expert audiences only) | Violin and beeswarm plots in client-facing material |
| Flow | — | Waterfall (a sequence of gains and losses to an end total); Sankey (movement between states) | Chord diagrams |
| Trend | Line; bar (few, discrete periods) | Area (one series, or a stacked total); slope (two points in time); small multiples (many series); fan chart (projections with uncertainty) | Dual y-axes; curve smoothing; stacked area with more than 4 series |
| Ranking | Bar (sorted by value) | Lollipop; slope or bump chart (how a rank changed) | Unsorted bars; pie |
| Spatial | — | Choropleth map (rates and ratios); proportional symbol map (totals) | Choropleth coloured by totals: big regions look important just for being big |

Read the table from the left: the insight comes from the brief's key question, not from what the data looks like.

### Step 2 — Focus element

What should the user see first? Visa names three:

- **Highlight a category** — direct focus to one primary category.
- **Highlight values above a threshold** — a reference line plus emphasis on what clears it.
- **Highlight high and low values** — emphasis on the extremes.

### Step 3 — Refine

First reduce, then re-add emphasis.

**Reduce distracting information.** Strip gridlines, axis furniture and data labels back to what the task needs. Don't ship two elements conveying the same thing. Start with one neutral colour for every data point — that keeps the emphasis budget free.

**Then direct attention** according to the user's task:

| Task type | Description | Ways to direct attention |
| --- | --- | --- |
| Lookup | Understand the precise value of a selected data point | Direct-label data points; expose the data table. |
| Locate | Find a specific item or category within a chart | Colour individual categories, or just the important one; add search/highlight interaction. |
| Identify | Find a pattern or an outlier | Reference lines for thresholds; different colour *or shape* for outliers; annotations describing the pattern. |
| Compare | Compare differences and similarities between items, categories or metrics | Reference line at the typical value; side-by-side small multiples; normalise the data. |

Shape selection follows insight + focus + task — not designer preference.

## Chart sizing

- Set **width** from the responsive grid columns, same as any card.
- Set **height** so the plot is proportional and represents the shape of the data honestly — a squashed or stretched aspect ratio distorts trend as much as a bad axis.
- A chart must be readable without scrolling or zooming. If it isn't, cut data points, don't shrink type.
- Size for the analysis the user actually has to do, not for the slot in the layout.

## v1 chart taxonomy

Four primitives in v1, matching Visa's publicly-documented set. Charts without a primitive yet have their rules under **Charts without a primitive yet**.

### Bar
- **Use for:** trends over weeks/months/quarters, rankings, precise values.
- **Don't use for:** short windows (hours/days — use Line), continuous change, composition within a category, datasets with extreme values that distort the scale.
- **Must start at zero.** Always.

**Layout.** Pick whichever reads better, not whichever fits:
- **Vertical** — each bar is a date period (week, month), or the categories have a meaningful order (age bands, low/medium/high).
- **Horizontal** — distinct unordered categories (countries, market segments), or long category names that would truncate.

**Data order.** Never accept the order the data arrived in:
- Chronological for time series.
- Sorted by value when the point is ranking or the size of the gaps.

**Too many bars.** Paginate (`<afi-pagination>`) or group into broader categories. Don't shrink the bars.

### Line
- **Use for:** change over time or a continuous sequence, trend emphasis, rate of change.
- **Don't use for:** categorical x-axis, precise individual values, >5 series, composition.
- **Straight segments only.** May start above zero if the dataset minimum is significantly above zero — document on the chart.
- **Missing data:** don't connect across gaps; leave a visible break. Say so in `statisticalNotes` too — silence about a gap reads as "no change".
- **X-axis intervals** must be consistent and meaningful. Uneven date spacing misrepresents the rate of change even when every point is correct.

**Data marker dots.** Exposed as a `showDots` input.
- Dots on: gives a clear reference for where each real data point sits.
- Dots off: cleaner for dense series.
- Selective dots: use to emphasise only the critical points. Pick a radius that keeps the line visible — the dots must not become the chart.

**Direct labeling, three tiers.** Choose one, don't stack them:
1. **Data point labels** — when users need every specific value. If you label every point, **hide the y-axis** (it's now duplicate information).
2. **Axis labels** — when labelling every point would overcrowd, and the trend matters more than exact values.
3. **Series labels** — for multi-series charts, label each line directly where there's room. If you label lines directly, **hide the legend.** Fall back to a legend only when direct labels won't fit.

### Heatmap
- **Use for:** patterns across two dimensions, summarizing large numeric sets, correlation.
- **Don't use for:** precise per-cell comparison, extreme-outlier datasets (they flatten the colour scale), too many categories.
- **Don't use when the numeric variable barely varies** — near-identical cell colours are unreadable. Use a bar chart.
- Include legend unless every cell is data-labeled.

### Dumbbell
- **Use for:** comparing two related values per category (actual vs target, this quarter vs last), emphasising the size of a gap, showing how gaps change across categories or over time.
- **Don't use for:** >2 values per category (use clustered/stacked bar), single-series trend, no benchmark.
- **Don't use when the gaps are too small to be meaningful** — the whole encoding is the line length. If it's short everywhere, the chart says nothing.
- If precise per-category trend matters more than the gap, use Line instead.

## Charts without a primitive yet

Rules for the "allowed, not built" charts in the chart-selection table. Everything else in this file (non-negotiables, colour, labelling, number format, accessibility) still applies. Rules are reworded from the sources listed at the end of this section.

### KPI tile
- **Use for:** the current value of one metric, alone or as a row of related metrics.
- **Don't use for:** the same metric over time (that's a line or bar chart); text that isn't a number.
- Always pair the number with something to judge it by: a target, the previous period, or a range. A number on its own doesn't tell anyone if it's good or bad.
- Change indicators (arrow, badge) need text too ("+3,2 % vs. trimestre anterior"), not colour alone.

### Bullet chart
- **Use for:** one value against a target and qualitative bands (below / on / above plan). The compact replacement for a gauge.
- Bands in neutral tints; only the value bar carries the highlight colour.

### Stacked bar
- **Use for:** totals that matter **and** a rough sense of what makes them up.
- **Max 5 segments.** More than that: group the small ones into "Otros".
- Only the segment sitting on the baseline can be compared accurately across bars, so put the most important (or largest) segment there.
- Same segment order in every bar and in the legend.
- Must start at zero.
- If comparing each segment across bars is the point, use grouped bars or small multiples instead.

### 100 % stacked bar
- **Use for:** comparing composition (shares) across groups when the totals don't matter.
- Say in the subtitle that each bar adds up to 100 %. Same segment rules as stacked bar.

### Donut / pie
- **Use for:** parts of **one** whole, when there are few parts and one of them is the story.
- **Max 5 slices**, and they must add up to 100 %. Group the rest into "Otros".
- Label slices directly; no legend lookup.
- Never compare two or more pies; use a 100 % stacked bar.
- Donut over pie when the centre holds the total.

### Waterfall
- **Use for:** how a starting value becomes an end value through gains and losses (a portfolio's return broken down by asset class, a budget bridge).
- First and last bars are totals and look different from the steps. Gains and losses differ by colour **and** direction/label.
- Must start at zero. Order steps logically (chronological or by process), not by size.

### Area
- **Use for:** one series where the volume under the line matters, or a stacked total over time.
- **Max 4 series** when stacked; only the bottom series is easy to read, so it should be the most important.
- Must start at zero. If individual series trends matter more than the total, use lines.

### Histogram
- **Use for:** how values are spread (how many clients fall into each wealth band).
- Bins of equal width, with small gaps between bars. Say what a bin is in the axis title.
- Too few bins hide the shape; too many make it noisy. Try a few widths and keep the one that shows the shape honestly.

### Scatterplot
- **Use for:** whether two numbers move together (risk vs return).
- Both axes labelled with units. Highlight the points the brief cares about; the rest in neutral.
- Readers assume correlation means causation: if it doesn't, say so in a note.
- Too many overlapping points: add transparency or use a heatmap.

### Slope chart
- **Use for:** change between exactly two points in time or two conditions, across several categories.
- Label both ends directly. Grey for most lines, colour for the ones the story is about.

### Small multiples
- **Use for:** many series that would tangle on one chart (more than 5 lines).
- Every panel the same chart type, size and scale, starting and ending at the same values. Different scales make panels look comparable when they aren't.

### Fan chart
- **Use for:** a projection whose uncertainty grows with time (a wealth projection, a pension forecast).
- Central estimate as a solid line; ranges as progressively lighter bands. Name what each band means ("80 % de los escenarios") in a label, not just a legend.
- Make the split between actual data and projection visible (a vertical rule or a change in line style).

### Sources for chart choice
Reworded, not reproduced:
- Financial Times, *Visual Vocabulary* (2016–2019), CC BY-SA 4.0: https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary
- Urban Institute, *Data Visualization Style Guide*: https://urbaninstitute.github.io/graphics-styleguide/
- GitLab, *Pajamas: single stat*: https://design.gitlab.com/data-visualization/single-stat

## Color

- **Neutral palette (default):** one color per chart unless encoding additional data adds significant value. Maps to Coherence `data-neutral-{strong|medium|muted}` tokens.
- **Highlight palette:** `action-500` / `action-300` reserved for the focus element in comparison charts.
- **Divergent palette:** `data-diverge-neg-*` / `data-diverge-pos-*`. Coherence's Visa-safe analogue to Visa's red-to-green. Never raw red-green without texture fill.
- **Semantic tokens (Coherence extension):** `data-positive`, `data-negative`, `data-warning` — use when the semantic is absolute (variance, compliance).
- **Outlines:** component auto-applies a darker outline to light fills for AA contrast. Do not override.

## Typography + labeling

- **Sentence case everywhere.** No Title Case, no SCREAMING CAPS.
- **Plain language.** `num_tx` → `Número de transacciones`. No jargon or abbreviations in labels.
- **Titles** frame the insight. For exploratory dashboards, phrase as a question.
- **Strongly advised:** when the brief has a clear takeaway, the title states it ("Las ventas caen un 12 % en el tercer trimestre"), not just the metric ("Ventas por trimestre"). If the team prefers a neutral title, put the takeaway in the subtitle instead.
- **Subtitles** carry interpretive context (date range, filter, unit).
- **Direct labeling** preferred over a separate legend when shape allows.

### Number formatting (es-ES)

Visa's own table, restated for es-ES. **Deviation (intentional):** every separator and abbreviation differs from Visa, who write for en-US.

| Data type | Visa (en-US) | Coherence (es-ES) |
| --- | --- | --- |
| Large numbers | `1.2k` | `1,2 k` · `3,4 M` · `1,2 MM` — abbreviate, don't print `1.234` |
| Percentage | whole points | whole points — `12 %` with a space before the sign |
| Basis points | `1 bps = 0.01%` | `1 pb = 0,01 %` — only when the change is too small for whole points |
| Currency | round to the nearest dollar | `EUR 1.234,56` — round to the precision the analysis needs |
| Dates | — | `DD MMM YYYY`, lowercase RAE month — `16 abr 2026` |

Baseline: thousands separator `.`, decimal `,`. Simplify on the chart; if someone needs more precision, put it in the tooltip **and** the data table — never the tooltip alone.

## Accessibility

### Four descriptive-text properties (required on every chart)

Property names adopted verbatim from Visa. Populated in RAE Spanish. These feed a screen-reader region attached to the chart root. Fill them in order and stop when the chart is fully described — `structureNotes` is only for what the first three didn't cover.

| Property | What goes in it | Rule |
| --- | --- | --- |
| `longDescription` | What the chart shows and what kind of data it is. Describe the layout if the shape is uncommon. | Never repeat the title or subtitle. Plain language. |
| `statisticalNotes` | The takeaway, plus the trends and outliers worth naming. Group points to describe a pattern. | Never list numbers without saying what they mean. |
| `contextExplanation` | Which filters, controls or selections produced this data; the active date range. | Update it when the filter changes — a stale one is worse than none. |
| `structureNotes` | Sort order, grouping, axis direction, colour grouping — non-obvious visual structure. | Only if the first three don't already cover it. |

Worked examples in Visa's own words: `docs/reference/visa-pds/data-visualization/chart-accessibility.md`.

### Keyboard map

Bindings are shared across primitives; what they traverse depends on the chart's own hierarchy.

| Key | Behaviour | Bar | Line | Heatmap | Dumbbell |
| --- | --- | --- | --- | --- | --- |
| `Enter` | Enter the chart, or drill down one level | ✓ | ✓ | ✓ | ✓ |
| `Shift+Enter` | Drill up one level | ✓ | ✓ | ✓ | ✓ |
| `←/→` | Move between siblings at the current level | ✓ | ✓ | ✓ | ✓ |
| `↑/↓` | Move across series (line) or across rows (heatmap) | — | ✓ | ✓ | — |
| `Control+Shift` | Hold together with the arrow keys for VoiceOver on macOS | ✓ | ✓ | ✓ | ✓ |
| `Esc` | Dismiss the tooltip | ✓ | ✓ | ✓ | ✓ |
| `Tab` | Exit the chart, continue page focus order | ✓ | ✓ | ✓ | ✓ |

`Control+Shift` is not optional. Without it, arrow-key navigation is swallowed by VoiceOver on macOS and the chart is unreachable for the users the map exists for. It must appear in the instructions modal, and arrow handling must **not** bail when `ctrlKey` or `shiftKey` is held.

Bar and dumbbell have **no** `↑/↓` — their hierarchy is one-dimensional. Don't bind it to nothing; omit the row from that chart's instructions modal.

A "Keyboard instructions" button is required on every chart and opens a `<afi-modal>` with the map for *that* chart type.

**Roving tabindex is mandatory.** Exactly one element per chart is ever in the tab order: the chart root while focus is outside, the active datum once drilled in. Giving every mark `tabindex="0"` turns a five-series line chart into sixty tab stops and defeats the point of the drill-down model. Implementation lives in `libs/ui/src/chart/chart-keyboard.ts`.

**Deviation (intentional):** Visa models three levels — chart, group, datum — so Enter stops on a bar group or a line before reaching a datum. Coherence collapses that to two, chart and datum, reaching other groups with `↑/↓` at the datum level. Every key Visa documents still works; only the intermediate stop is gone. Our charts are shallow enough (single-series bar, five-series line ceiling) that the extra level costs a keystroke and buys nothing. Revisit if grouped or stacked bars land.

**The keyboard cursor must be visible without relying on `:focus-visible`.** Its heuristics don't fire reliably for programmatic focus. Bind the active state from the nav controller instead — the line chart does this so that a marker hidden by `showMarkers=false` still shows where the cursor is.

### Tooltip interaction

Chart tooltips are allowed and expected. They may open from pointer hover / pointermove for desktop exploration, but they must not be pointer-only.

- Pointer path: hover or pointermove updates tooltip state through Angular signals/component state.
- Keyboard path: focused datum/series opens the same tooltip content; `Esc` dismisses it.
- Touch path: tap selects or pins the datum, or the visible data-table/details fallback exposes the same value.
- Implementation path: no imperative DOM mutation. Use event coordinates, SVG/data indices, signals, and template bindings. Do not use `document.querySelector` or `nativeElement.style`.
- Content rule: tooltip-only critical data is banned. If a number matters, label it on-chart or include it in the data-table fallback.

### Data-table fallback

Every chart exposes a `dataTableOpen` signal + toggle button that reveals a screen-reader-accessible `<table>` equivalent of the chart's data. Required on bar / line / dumbbell; optional on heatmap.

### Focus + contrast

- Focus-visible ring: `var(--border-focus)` (2px `action-500`), 2px offset.
- AA contrast: enforced via auto-outline on light fills. Don't override.

## Motion

Visa is silent here. Coherence rules:

- **Chart enter:** fade + axes draw-in, 200ms ease-out, on mount only.
- **Chart update (data change):** 180ms ease-out per-element interpolation (bar height, line path, heatmap cell color).
- **Tooltip appear:** 120ms fade.
- **Legend hover emphasis:** 100ms color shift.
- **`prefers-reduced-motion`:** enter/update collapse to instant; tooltip fade 0–80ms.
- No bounce, no spring. Motion serves state clarity, not delight.

**Motion context (locked 2026-04-16):** on the DS site, charts may use slightly longer, more expressive enter (300ms). In consumer products (AWM, future brands), use the defaults above.

## Composition patterns

- **Chart in Card** — wrap `<afi-chart-*>` in `<afi-card>` when the chart has a title + context.
- **Chart in Tab panel** — load on tab activation when `lazy=true`.
- **Chart in Drawer** — row-detail drawer can embed a small chart (e.g., heatmap of that entity's history).
- **Filter bar above chart** — `<afi-select>` + `<afi-input>` in a filter row; filter change updates chart `data` + `contextExplanation`.
- **Chart with LoadingOverlay** — use `quiet-spinner` variant over the chart while data fetches; keep the previous chart visible behind the overlay so motion feels continuous.

## Anti-patterns

- 3D anything (bars, pies, isometric).
- Pie with >5 slices.
- Spline/curve smoothing on lines.
- Dual y-axes (unless regulatory — document and flag).
- Rainbow palettes on sequential data. Use monochromatic.
- Red-green without texture fill. Color-blind hostile.
- Title Case or SCREAMING CAPS in labels.
- Tooltip-only critical data. If a number matters, label it on-chart or in the data-table fallback.
- Chart as decoration. If it doesn't answer a question, remove it.
- Seven or more colours or series in one chart. Group, filter, or split into small multiples. **Exception:** a fixed taxonomy used the same way across the product (e.g. tipo de activo), where every category always has the same colour, so readers learn it once. Still label directly where possible, and keep the order fixed.
- Legend order that doesn't match the order in the chart.
- The same unit repeated on every label. State it once, in the subtitle or axis title.

## Pre-flight

Before shipping a chart primitive:

- [ ] Brief written (Step 0): audience, key question, decision, medium, data. The chart answers the key question and shows the decision threshold, if there is one.
- [ ] Color never alone — every encoding paired with texture, position, or direct label.
- [ ] Bar starts at zero. Non-zero line baseline is documented on the chart.
- [ ] Sentence case in all labels.
- [ ] Four descriptive-text properties populated in RAE Spanish, `structureNotes` only if the other three left something out.
- [ ] Keyboard map works end-to-end, including the instructions modal — **and `Control+Shift` + arrows verified under VoiceOver on macOS.**
- [ ] The instructions modal lists only the keys that chart actually binds (no `↑/↓` on bar or dumbbell).
- [ ] Data-table fallback toggles on and reflects current data. Required on bar / line / dumbbell.
- [ ] Focus-visible ring matches `--border-focus` token with 2px offset.
- [ ] `prefers-reduced-motion` collapses enter/update to instant.
- [ ] Numbers + dates formatted for es-ES.
- [ ] One labeling tier only — labelling every point means the y-axis is hidden; labelling lines directly means the legend is hidden.
- [ ] Bar data order is deliberate (chronological or sorted by value), not the order the data arrived in.
- [ ] Chart readable at its target width without scroll or zoom; height honours the shape of the data.
- [ ] Missing data is broken, not bridged — and named in `statisticalNotes`.
- [ ] No hex / rgba / hardcoded px (clean-code.md).

## Source links (Visa PDS)

Vendored copies live in `docs/reference/visa-pds/data-visualization/`, retrieved 2026-07-30. Live pages under `https://design.visa.com/data-visualization/`:

- Principles: `design-visualization-guidelines/data-visualization-principles`
- Chart selection: `design-visualization-guidelines/selecting-a-chart`
- Usage: `charts/{bar-chart,line-chart,heatmap,dumbbell-plot}`
- Accessibility: `charts/{bar-chart,line-chart,heatmap,dumbbell-plot}/accessibility`

Two caveats on the vendored copies. The export dropped a column from three tables and mangled some apostrophes — all repaired from the live pages, noted in each file's header. And the anatomy diagrams and layout schematics are remote image URLs, so those pages only half-work offline; the anatomy table above exists so you don't need them.

Deviations from Visa are annotated inline above: motion (they're silent), es-ES number formatting, Coherence semantic tokens, and the required data-table button.
