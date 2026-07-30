import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';

import type { TickStop } from './chart.types';
import { formatNumber } from './chart-format';

/**
 * Shared SVG axis renderer.
 *
 * Renders tick marks + labels for a single axis (x or y).
 * Used internally by chart primitives — not exposed as a public API.
 * Uses a nice-number algorithm for automatic tick generation.
 */
@Component({
  selector: 'g[afi-chart-axis]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart-axis.component.html',
})
export class ChartAxisComponent {
  readonly orientation = input<'x' | 'y'>('x');
  readonly min = input(0);
  readonly max = input(100);
  readonly length = input(300);
  readonly tickCount = input(5);
  readonly label = input<string | null>(null);
  readonly locale = input('es-ES');
  readonly customTicks = input<TickStop[] | null>(null);

  readonly ticks = computed<TickStop[]>(() => {
    if (this.customTicks()) return this.customTicks()!;
    return niceTickStops(this.min(), this.max(), this.tickCount(), this.locale());
  });

  scaleX(value: number): number {
    const range = this.max() - this.min();
    if (range === 0) return 0;
    return ((value - this.min()) / range) * this.length();
  }

  scaleY(value: number): number {
    const range = this.max() - this.min();
    if (range === 0) return this.length();
    return this.length() - ((value - this.min()) / range) * this.length();
  }
}

// ---------------------------------------------------------------------------
// Nice-number algorithm for tick generation
// ---------------------------------------------------------------------------

function niceTickStops(min: number, max: number, count: number, locale: string): TickStop[] {
  if (min === max) return [{ value: min, label: formatNumber(min, locale) }];

  const range = niceNum(max - min, false);
  const step = niceNum(range / (count - 1), true);
  const graphMin = Math.floor(min / step) * step;
  const graphMax = Math.ceil(max / step) * step;

  const stops: TickStop[] = [];
  for (let v = graphMin; v <= graphMax + step * 0.5; v += step) {
    const rounded = Math.round(v * 1e10) / 1e10;
    stops.push({ value: rounded, label: formatNumber(rounded, locale) });
  }
  return stops;
}

function niceNum(range: number, round: boolean): number {
  const exponent = Math.floor(Math.log10(range));
  const fraction = range / Math.pow(10, exponent);
  let niceFraction: number;

  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else {
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent);
}
