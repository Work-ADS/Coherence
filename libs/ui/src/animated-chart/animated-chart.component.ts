import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';

import {
  type AnimatedChartSeries,
  type AnimatedChartSize,
  type ChartColumn,
} from './animated-chart.variants';

interface ResolvedColumn extends ChartColumn {
  /** Final bar height as a percentage of the chart's draw area. */
  heightPct: number;
  /** Resolved CSS color (from `color` override or series token). */
  resolvedColor: string;
  /** Identity used by track in *ngFor — stable across animation restarts. */
  id: string;
}

/**
 * Animated vertical bar chart, card-style.
 *
 * Renders an N-column bar chart inside a card-like container. Each column
 * shows a title, a colored bar (animated from 0 → value/maxValue on mount
 * and on data change when `restartOnDataChange` is true), and a numeric
 * value with optional unit suffix.
 *
 * Colors come from the DS data-viz series palette (--color-data-viz-series-1
 * through -8) — pass `column.series: 1-8` to pick one explicitly, otherwise
 * the component cycles through the palette by index. For brand-specific
 * tinting, pass `column.color` directly (wins over `series`).
 *
 * The bar grow animation uses CSS `transform: scaleY(0 → 1)` so it's GPU-
 * accelerated and respects `prefers-reduced-motion`.
 *
 * @example
 * ```html
 * <afi-animated-chart
 *   [columns]="[
 *     { title: 'Gasto',     value: 71,  appendString: '%', series: 5 },
 *     { title: 'Consumo',   value: 99,  appendString: '%', series: 6 },
 *     { title: 'Emisiones', value: 14,  appendString: '%', series: 2 },
 *   ]"
 *   [maxValue]="100"
 *   size="md"
 * />
 * ```
 */
@Component({
  selector: 'afi-animated-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './animated-chart.component.html',
  styleUrl: './animated-chart.component.scss',
})
export class AnimatedChartComponent implements AfterViewInit {
  /** Columns to render. Order = visual order, left to right. */
  readonly columns = input.required<ChartColumn[]>();

  /** The reference value all bars are scaled against. */
  readonly maxValue = input.required<number>();

  /** Optional title shown above the chart (acts as a card heading). */
  readonly title = input<string | null>(null);

  /** Optional subtitle / hint shown under the title. */
  readonly subtitle = input<string | null>(null);

  /** Sizing scale — controls chart height, padding, and font sizes. */
  readonly size = input<AnimatedChartSize>('md');

  /**
   * When true, the bar-grow animation re-runs every time `columns` changes.
   * Useful for dashboards where the data source swaps and you want a visual
   * cue that the values have updated. When false, only animates on mount.
   */
  readonly restartOnDataChange = input<boolean>(false);

  /** ARIA label override. Defaults to a generated summary of column titles. */
  readonly ariaLabel = input<string | null>(null);

  /** Drives the bar mount/restart animation via a sequence number on the host. */
  protected readonly animationKey = signal(0);

  /** Whether the bars should be in their final (grown) state. */
  protected readonly grown = signal(false);

  readonly resolvedColumns = computed<ResolvedColumn[]>(() => {
    const cols = this.columns();
    const max = this.maxValue() || 1;
    return cols.map((c, i) => {
      const series: AnimatedChartSeries = c.series ?? (((i % 8) + 1) as AnimatedChartSeries);
      const resolvedColor = c.color ?? `var(--color-data-viz-series-${series})`;
      return {
        ...c,
        heightPct: Math.max(0, Math.min(100, (c.value / max) * 100)),
        resolvedColor,
        id: `${i}-${c.title}`,
      };
    });
  });

  readonly chartAriaLabel = computed(() => {
    const override = this.ariaLabel();
    if (override) return override;
    const cols = this.columns();
    const max = this.maxValue();
    if (!cols.length) return 'Animated bar chart, no data';
    const parts = cols.map(
      (c) =>
        `${c.title} ${c.value}${c.appendString ?? ''}`,
    );
    return `Bar chart with ${cols.length} columns, max value ${max}: ${parts.join(', ')}`;
  });

  constructor() {
    // Re-run the bar animation when the columns reference changes (only if
    // the consumer opted in). Pulls the grown state to false, then back to
    // true on the next frame so CSS transitions re-fire.
    effect(() => {
      this.columns(); // dependency

      if (!this.restartOnDataChange()) return;

      this.grown.set(false);
      this.animationKey.update((n) => n + 1);
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(() => requestAnimationFrame(() => this.grown.set(true)));
      } else {
        this.grown.set(true);
      }
    });
  }

  ngAfterViewInit(): void {
    // First mount: trigger grow on next frame so the initial scaleY(0) → scaleY(1)
    // transition is visible (browsers fold same-frame style changes together).
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => requestAnimationFrame(() => this.grown.set(true)));
    } else {
      this.grown.set(true);
    }
  }
}
