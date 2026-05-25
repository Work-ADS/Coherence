/**
 * AnimatedChart variants — sizing scale.
 *
 * `series` color is selected per-column via `ChartColumn.series` (1-8) and
 * resolves to `--color-data-viz-series-{n}` from colors.scss. Brands inherit
 * the same series palette, so cross-brand charts stay legible.
 *
 * For brand-specific tinting (e.g. LK demos that want magenta bars) the
 * consumer can pass `color` directly on the column — that wins over `series`.
 */

export type AnimatedChartSize = 'sm' | 'md' | 'lg';
export type AnimatedChartSeries = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ChartColumn {
  /** Top label, also used in the a11y description. */
  title: string;
  /** The data point. Scaled against `maxValue` to compute bar height. */
  value: number;
  /** Optional unit suffix shown next to the value (e.g. "€", "%", "h/wk"). */
  appendString?: string;
  /** Pick from the 8-color data-viz series palette. Defaults to (index % 8) + 1. */
  series?: AnimatedChartSeries;
  /** Direct color override — any CSS color or var(). Wins over `series`. */
  color?: string;
  /** Optional secondary label below the title. */
  caption?: string;
}
