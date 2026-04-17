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
  template: `
    @if (orientation() === 'x') {
      <g [attr.transform]="'translate(0,' + length() + ')'">
        <line x1="0" [attr.x2]="length()" stroke="var(--border-hairline)" stroke-width="1" />
        @for (tick of ticks(); track tick.value) {
          <g [attr.transform]="'translate(' + scaleX(tick.value) + ',0)'">
            <line y2="4" stroke="var(--color-neutral-400)" stroke-width="1" />
            <text y="16" text-anchor="middle" class="fill-neutral-500" style="font-size: var(--font-size-body-sm, 12px)">
              {{ tick.label }}
            </text>
          </g>
        }
        @if (label()) {
          <text [attr.x]="length() / 2" y="36" text-anchor="middle"
                class="fill-neutral-600" style="font-size: var(--font-size-body-sm, 12px)">
            {{ label() }}
          </text>
        }
      </g>
    } @else {
      <g>
        <line y1="0" [attr.y2]="length()" stroke="var(--border-hairline)" stroke-width="1" />
        @for (tick of ticks(); track tick.value) {
          <g [attr.transform]="'translate(0,' + scaleY(tick.value) + ')'">
            <line x2="-4" stroke="var(--color-neutral-400)" stroke-width="1" />
            <text x="-8" dy="0.32em" text-anchor="end" class="fill-neutral-500"
                  style="font-size: var(--font-size-body-sm, 12px)">
              {{ tick.label }}
            </text>
          </g>
        }
        @if (label()) {
          <text [attr.transform]="'translate(-48,' + (length() / 2) + ') rotate(-90)'"
                text-anchor="middle" class="fill-neutral-600"
                style="font-size: var(--font-size-body-sm, 12px)">
            {{ label() }}
          </text>
        }
      </g>
    }
  `,
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
