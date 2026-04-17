# Data-viz skill

## North star

Charts at AFI earn trust by being **findable, learnable, focused, trusted, valuable** — Visa PDS's five principles, adopted verbatim. Borrow what Visa has already figured out; extend only where they're silent.

## Source of truth

- **Primary reference:** Visa Product Design System — https://design.visa.com/data-visualization/
- Deviations from Visa must be intentional and documented inline (in code comments or the chart primitive's docstring).
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

## Chart selection

Three-step refinement (Visa PDS):

**Step 1 — Insight.** Pick one:
Association · Current status · Composition · Correlation · Deviation · Distribution · Flow · Trend · Ranking · Spatial.

**Step 2 — Focus element.** What should the user see first? Total, change, outlier, ratio?

**Step 3 — Task type.**
- **Lookup** — user knows what they're looking for
- **Locate** — user knows roughly where to look
- **Identify** — user scans for anomalies
- **Compare** — user evaluates against a benchmark

Shape selection follows insight + focus + task — not designer preference.

## v1 chart taxonomy

Four primitives in v1, matching Visa's publicly-documented set. Others (area, scatter, stacked bar, treemap) are v1.1+.

### Bar
- **Use for:** trends over weeks/months/quarters, rankings, precise values.
- **Don't use for:** short windows (hours/days — use Line), continuous change, composition within a category.
- **Must start at zero.** Always.

### Line
- **Use for:** change over time or a continuous sequence, trend emphasis, rate of change.
- **Don't use for:** categorical x-axis, precise individual values, >5 series, composition.
- **Straight segments only.** May start above zero if the dataset minimum is significantly above zero — document on the chart.
- **Missing data:** don't connect across gaps; leave a visible break.

### Heatmap
- **Use for:** patterns across two dimensions, summarizing large numeric sets, correlation.
- **Don't use for:** precise per-cell comparison, extreme-outlier datasets, too many categories.
- Include legend unless every cell is data-labeled.

### Dumbbell
- **Use for:** comparing two related values per category (actual vs target, this quarter vs last).
- **Don't use for:** >2 values per category (use clustered/stacked bar), single-series trend, no benchmark.

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
- **Subtitles** carry interpretive context (date range, filter, unit).
- **Direct labeling** preferred over a separate legend when shape allows.

### Number formatting (es-ES)

- Thousands separator `.`, decimal `,`.
- Abbreviations: `1,2 k` · `3,4 M` · `1,2 MM` (thousand / million / billion).
- Currency: `EUR 1.234,56`.
- Percentages: whole points unless bps needed. `1 pb = 0,01 %`.
- Dates: `DD MMM YYYY` with lowercase RAE month — `16 abr 2026`.

## Accessibility

### Four descriptive-text properties (required on every chart)

Adopted verbatim from Visa. Populated in RAE Spanish. These feed a screen-reader region attached to the chart root.

1. **`longDescription`** — what the chart shows + data type. Does NOT repeat the title.
2. **`statisticalNotes`** — key insights, trends, outliers worth calling out.
3. **`contextExplanation`** — active filters, selections, date range affecting data shown.
4. **`structureNotes`** — sort order, grouping, axis direction, non-obvious visual structure.

### Keyboard map (fixed across every chart primitive)

- `Enter` — drill down / enter chart
- `Shift+Enter` — drill up
- `←/→` — move between siblings
- `↑/↓` — (line charts) move across series
- `Esc` — dismiss tooltip
- `Tab` — exit chart, continue page focus order

A "Keyboard instructions" button is required on every chart and opens a `<afi-modal>` with the map.

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

## Pre-flight

Before shipping a chart primitive:

- [ ] Color never alone — every encoding paired with texture, position, or direct label.
- [ ] Bar starts at zero. Non-zero line baseline is documented on the chart.
- [ ] Sentence case in all labels.
- [ ] Four descriptive-text properties populated in RAE Spanish.
- [ ] Keyboard map works end-to-end, including the instructions modal.
- [ ] Data-table fallback toggles on and reflects current data.
- [ ] Focus-visible ring matches `--border-focus` token with 2px offset.
- [ ] `prefers-reduced-motion` collapses enter/update to instant.
- [ ] Numbers + dates formatted for es-ES.
- [ ] No hex / rgba / hardcoded px (clean-code.md).

## Source links (Visa PDS)

- Overview: `design-visualization/`
- Principles: `design-visualization-guidelines/data-visualization-principles`
- Chart selection: `selecting-a-chart`
- Bar / Line / Heatmap / Dumbbell sub-pages

Deviations from Visa are annotated inline above (motion, es-ES formatting, Coherence semantic tokens).
