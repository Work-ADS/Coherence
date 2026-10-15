# afi-chart-bar range mode — session brief

**Status:** ready to plan · **Branch:** `feat/chart-bar-range`
**Project:** [Patrimonio dashboard](2026-09-24-patrimonio-dashboard-0-index.md), chunk 1 of 5
**Prerequisite reading:** full AGENTS.md required-read order, then `docs/rules/data-viz-skill.md`, [`windowed-bar-and-docked-readout.md`](../claude-design-prompts/windowed-bar-and-docked-readout.md) and this brief.

## Why this exists

The reference dashboard's centre is a dense daily bar chart. You pick a date range, the range turns the highlight colour, a brush under the axis shows where it sits in the year, and a readout reports the range. `afi-chart-bar` can't do any of that:

- **No range, brush or readout.** Nothing in `libs/ui/src/chart/` has range selection, a brush or a docked readout.
- **Bars go sub-pixel.** `BAR_GAP = 4` is fixed (`chart-bar.component.ts:34`), so 150 bars clamp to 1-unit slivers.
- **Labels pile up.** The category label renders for every bar (`chart-bar.component.html:78-85`), so 150 daily bars mean 150 overlapping dates.
- **No dates.** `BarDatum` (`chart.types.ts:12-20`) has no date field.

This is **not** a v2 primitive. It is an additive mode on the shared chart. Under modern it comes out monochrome through the existing bridge (`libs/tokens/charts.scss:169-181`).

## Proposed API (lock first thing)

| Input | Type | Default | Does |
|---|---|---|---|
| `range` | `model<{ start: number; end: number } \| null>` | `null` | Turns the mode on. Takes bar indices, inclusive, and binds both ways. |
| `categoryTicks` | `'all' \| 'month'` | `'all'` | With `'month'`, only the first bar of each month gets a label (`ene`, `feb`, …). |
| `readoutLabel` | `string \| null` | `null` | The metric name shown in the readout. |
| `readoutMode` | `'sum' \| 'last'` | `'last'` | Chooses what the readout reports: the last value in the range (a balance like patrimonio) or the range total (a flow like ingresos). |
| `BarDatum.date` | `string?` (ISO) | — | Needed for `'month'` ticks and the readout's date range. |

Confirm with Richard:

- whether `readoutMode` earns its place, or whether we go with `'last'` only for now
- whether PageUp/PageDown should jump by a month or by 10 bars

## Behaviour

- **Density.** Above about 60 bars, the gap becomes a proportion of the band, around 30 %, instead of a fixed 4.
- **Colour.**
  - Bars inside the range take `resolveSeriesVisual(1)`. Bars outside take `resolveSeriesVisual(0)`.
  - Range mode ignores the auto-focus on the biggest bar.
  - Negatives keep `--chart-negative`.
- **Brush track.** A strip under the baseline:
  - The unselected track takes the neutral muted token.
  - The selected window is a solid bar with two edge handles.
  - Pointer: dragging a handle resizes the window, dragging the window moves it, and clicking the track centres the window there.
  - Use pointer capture, clamp the window to the data, and require at least one bar.
- **Keyboard.**
  - Each handle is `role="slider"` with `aria-valuemin`, `aria-valuemax` and `aria-valuenow`, and an `aria-valuetext` that gives the date.
  - ←/→ moves one bar. PageUp/PageDown moves one month. Home/End goes to the ends.
  - The handles are their own tab stops after the chart root, so the fixed chart keymap (`chart-keyboard.ts`) stays untouched.
  - Add a "Rango" section to `chart-instructions`.
  - Record the deviation in the component docstring and in `data-viz-skill.md`.
- **Readout.**
  - It is a sibling under the plot, never overlaid, and never gets a close button.
  - It shows the label, the date range (`24/03/26 – 24/04/26` via `formatDate`), the value, and the change against the window of equal length just before it, as an arrow plus text.
  - A negative value takes `--chart-negative`.
  - It is `aria-live="polite"`.
  - At rest it shows the current range. It is never blank.
- **Motion.** Nothing animates while scrubbing. Values swap instantly. Reduced motion changes nothing.
- **Data table.** The toggle still lists every bar.

## Constraints

- Opt-in and backward-compatible. Every chart shipping today renders the same when `range` is `null`.
- Tokens only. No raw hex or px. Format numbers and dates through `Intl`, via `chart-format.ts`.
- Three-file rule. Pre-flight before handoff. The tester agent verifies pointer, keyboard, screen reader and reduced motion.

## Docs

On `apps/site/src/app/pages/patrones/graficos/bar.page.ts`:

- Add a "Rango seleccionable" demo using about 120 daily points.
- Fill in the inputs table. It currently leaves out `hideAxisTicks`, `unit`, `referenceValue`, `referenceLabel`, `valueLabelInside` and three of the a11y strings.

## Out of scope

- The page that uses this mode (chunks 4 and 5).
- Stacked bars or series.
- The overview mini-map from the windowed-bar prompt. The brush track is our simpler version of it.
- Texture fills.
