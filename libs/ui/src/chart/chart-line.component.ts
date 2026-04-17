import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import { LoadingOverlayComponent } from '../loading-overlay';
import { ChartInstructionsComponent } from './chart-instructions.component';
import { ChartDataTableComponent } from './chart-data-table.component';
import { ChartLegendComponent } from './chart-legend.component';
import type { LineSeries, ChartMargins } from './chart.types';
import { resolveSeriesVisual } from './chart.variants';
import { formatNumber, formatNumberFull, formatDate } from './chart-format';
import { buildA11yRegion, chartA11yId, chartTitleId } from './chart-a11y';

let nextId = 0;

const MARGINS: ChartMargins = { top: 16, right: 16, bottom: 48, left: 56 };

/**
 * Line chart primitive.
 *
 * Straight segments only — no curve interpolation. Null y-values produce
 * visible gaps. Markers optional. Hand-written SVG.
 */
@Component({
  selector: 'afi-chart-line',
  standalone: true,
  imports: [
    LoadingOverlayComponent,
    ChartInstructionsComponent,
    ChartDataTableComponent,
    ChartLegendComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: block; position: relative; }
    .line-path {
      fill: none;
      stroke-width: 2;
      transition: opacity 180ms ease-out;
    }
    .line-marker {
      cursor: pointer;
      transition: r 120ms ease-out;
    }
    .line-marker:hover, .line-marker:focus-visible { r: 5; }
    .line-marker:focus-visible {
      outline: 2px solid var(--border-focus);
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
      .line-path, .line-marker { transition-duration: 0ms; }
    }
  `,
  template: `
    <afi-loading-overlay variant="quiet-spinner" [visible]="loading()">
      <figure class="relative" role="figure" [attr.aria-labelledby]="titleElId">
        <div class="flex items-start justify-between mb-space-3">
          <div>
            @if (title()) {
              <figcaption [id]="titleElId" class="text-section text-canvas-fg">{{ title() }}</figcaption>
            }
            @if (subtitle()) {
              <p class="text-body-sm text-neutral-500 mt-space-1">{{ subtitle() }}</p>
            }
          </div>
          <div class="flex items-center gap-space-2">
            <ng-content select="[slot=action]" />
            <afi-chart-instructions (opened)="instructionsOpened.emit()" />
          </div>
        </div>

        <div [id]="a11yId" class="sr-only">{{ a11yText() }}</div>

        @if (hasData()) {
          <svg [attr.width]="'100%'" [attr.height]="height()" [attr.viewBox]="viewBox()"
               role="img" [attr.aria-labelledby]="titleElId" [attr.aria-describedby]="a11yId"
               class="block">
            <g [attr.transform]="'translate(' + margins.left + ',' + margins.top + ')'">
              <!-- Grid lines -->
              @for (tick of yTicks(); track tick) {
                <line x1="0" [attr.x2]="plotWidth()"
                      [attr.y1]="scaleY(tick)" [attr.y2]="scaleY(tick)"
                      stroke="var(--border-hairline)" stroke-width="1" opacity="0.5" />
                <text x="-8" [attr.y]="scaleY(tick)" dy="0.32em" text-anchor="end"
                      class="fill-neutral-500" style="font-size: var(--font-size-body-sm, 12px)">
                  {{ fmtNum(tick) }}
                </text>
              }
              <!-- X axis -->
              <line x1="0" [attr.x2]="plotWidth()" [attr.y1]="plotHeight()" [attr.y2]="plotHeight()"
                    stroke="var(--border-hairline)" stroke-width="1" />
              <!-- Lines + markers per series -->
              @for (series of renderedSeries(); track series.key; let si = $index) {
                <path [attr.d]="series.path" class="line-path" [attr.stroke]="series.visual.color" />
                @if (showMarkers()) {
                  @for (pt of series.points; track pt.idx) {
                    @if (pt.y !== null) {
                      <circle
                        class="line-marker"
                        [attr.cx]="pt.cx" [attr.cy]="pt.cy" r="3"
                        [attr.fill]="series.visual.color"
                        [attr.tabindex]="0"
                        role="graphics-symbol"
                        [attr.aria-label]="pt.label"
                        (click)="onPointClick(si, pt.idx)"
                        (keydown.enter)="onPointClick(si, pt.idx)"
                      />
                    }
                  }
                }
              }
            </g>
          </svg>

          <afi-chart-legend [items]="legendItems()" [hidden]="data().length <= 1" />
        } @else {
          <div class="flex items-center justify-center text-neutral-500 text-body-sm" [style.height]="height()" aria-live="polite">
            Sin datos para mostrar
          </div>
        }

        <afi-chart-data-table
          [columns]="tableColumns()"
          [rows]="tableRows()"
          trackByKey="key"
          (toggled)="dataTableToggled.emit($event)"
        />

        <ng-content select="[slot=footer]" />
      </figure>
    </afi-loading-overlay>
  `,
})
export class ChartLineComponent {
  readonly data = input<LineSeries[]>([]);
  readonly loading = input(false);
  readonly title = input<string | null>(null);
  readonly subtitle = input<string | null>(null);
  readonly longDescription = input('');
  readonly statisticalNotes = input('');
  readonly contextExplanation = input('');
  readonly structureNotes = input('');
  readonly locale = input('es-ES');
  readonly height = input('320px');
  readonly focus = input<number | string | null>(null);
  readonly baselineZero = input(false);
  readonly showMarkers = input(false);

  readonly dataPointActivated = output<{ index: number; datum: unknown }>();
  readonly dataTableToggled = output<boolean>();
  readonly instructionsOpened = output<void>();

  private readonly id = nextId++;
  readonly titleElId = chartTitleId(this.id);
  readonly a11yId = chartA11yId(this.id);
  protected readonly margins = MARGINS;

  readonly a11yText = computed(() => buildA11yRegion({
    longDescription: this.longDescription(),
    statisticalNotes: this.statisticalNotes(),
    contextExplanation: this.contextExplanation(),
    structureNotes: this.structureNotes(),
  }));

  readonly hasData = computed(() => this.data().some(s => s.points.length > 0));

  readonly plotWidth = computed(() => 600 - MARGINS.left - MARGINS.right);
  readonly plotHeight = computed(() => 280 - MARGINS.top - MARGINS.bottom);
  readonly viewBox = computed(() => `0 0 600 280`);

  readonly allYValues = computed(() => {
    const values: number[] = [];
    for (const s of this.data()) {
      for (const p of s.points) {
        if (p.y !== null) values.push(p.y);
      }
    }
    return values;
  });

  readonly yMin = computed(() => {
    if (this.baselineZero()) return 0;
    const vals = this.allYValues();
    return vals.length > 0 ? Math.min(...vals) * 0.95 : 0;
  });

  readonly yMax = computed(() => {
    const vals = this.allYValues();
    return vals.length > 0 ? Math.max(...vals) * 1.05 : 100;
  });

  readonly xMin = computed(() => {
    let min = Infinity;
    for (const s of this.data()) {
      for (const p of s.points) {
        const v = p.x instanceof Date ? p.x.getTime() : p.x;
        if (v < min) min = v;
      }
    }
    return isFinite(min) ? min : 0;
  });

  readonly xMax = computed(() => {
    let max = -Infinity;
    for (const s of this.data()) {
      for (const p of s.points) {
        const v = p.x instanceof Date ? p.x.getTime() : p.x;
        if (v > max) max = v;
      }
    }
    return isFinite(max) ? max : 100;
  });

  readonly yTicks = computed(() => {
    const steps = 5;
    const min = this.yMin();
    const max = this.yMax();
    const step = (max - min) / steps;
    return Array.from({ length: steps + 1 }, (_, i) => min + step * i);
  });

  scaleX(value: number | Date): number {
    const v = value instanceof Date ? value.getTime() : value;
    const range = this.xMax() - this.xMin();
    if (range === 0) return this.plotWidth() / 2;
    return ((v - this.xMin()) / range) * this.plotWidth();
  }

  scaleY(value: number): number {
    const range = this.yMax() - this.yMin();
    if (range === 0) return this.plotHeight() / 2;
    return this.plotHeight() - ((value - this.yMin()) / range) * this.plotHeight();
  }

  readonly renderedSeries = computed(() => {
    return this.data().map((series, si) => {
      const visual = resolveSeriesVisual(si);
      const points = series.points.map((p, idx) => ({
        idx,
        x: p.x,
        y: p.y,
        cx: this.scaleX(p.x),
        cy: p.y !== null ? this.scaleY(p.y) : 0,
        label: `${series.key}: ${p.y !== null ? formatNumberFull(p.y, this.locale()) : 'sin dato'}`,
      }));

      // Build path with gaps for null values
      let path = '';
      let drawing = false;
      for (const pt of points) {
        if (pt.y === null) {
          drawing = false;
          continue;
        }
        if (!drawing) {
          path += `M${pt.cx},${pt.cy}`;
          drawing = true;
        } else {
          path += `L${pt.cx},${pt.cy}`;
        }
      }

      return { key: series.key, path, points, visual };
    });
  });

  readonly legendItems = computed(() =>
    this.data().map((s, i) => ({
      label: s.key,
      visual: resolveSeriesVisual(i),
    })),
  );

  readonly tableColumns = computed(() => {
    const cols = [{ key: 'x', label: 'X' }];
    for (const s of this.data()) {
      cols.push({ key: s.key, label: s.key });
    }
    return cols;
  });

  readonly tableRows = computed(() => {
    if (this.data().length === 0) return [];
    const firstSeries = this.data()[0]!;
    return firstSeries.points.map((p, i) => {
      const row: Record<string, unknown> = {
        key: String(i),
        x: p.x instanceof Date ? formatDate(p.x, this.locale()) : formatNumberFull(p.x as number, this.locale()),
      };
      for (const s of this.data()) {
        const pt = s.points[i];
        row[s.key] = pt?.y !== null && pt?.y !== undefined ? formatNumberFull(pt.y, this.locale()) : '—';
      }
      return row;
    });
  });

  fmtNum(value: number): string {
    return formatNumber(value, this.locale());
  }

  onPointClick(seriesIndex: number, pointIndex: number): void {
    const series = this.data()[seriesIndex];
    const point = series?.points[pointIndex];
    this.dataPointActivated.emit({ index: pointIndex, datum: point });
  }
}
