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
import type { DumbbellDatum, DumbbellOrientation, ChartMargins } from './chart.types';
import { resolveSeriesVisual } from './chart.variants';
import { formatNumberFull } from './chart-format';
import { buildA11yRegion, chartA11yId, chartTitleId } from './chart-a11y';

let nextId = 0;

const MARGINS: ChartMargins = { top: 16, right: 24, bottom: 48, left: 120 };

/**
 * Dumbbell chart primitive.
 *
 * Compares two related values per category (actual vs target, period A vs B).
 * Horizontal by default — categories on y-axis, values on x-axis.
 * Hand-written SVG.
 */
@Component({
  selector: 'afi-chart-dumbbell',
  standalone: true,
  imports: [
    LoadingOverlayComponent,
    ChartInstructionsComponent,
    ChartDataTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: block; position: relative; }
    .dumbbell-dot {
      cursor: pointer;
      transition: r 120ms ease-out;
    }
    .dumbbell-dot:hover, .dumbbell-dot:focus-visible { r: 7; }
    .dumbbell-dot:focus-visible {
      outline: 2px solid var(--border-focus);
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
      .dumbbell-dot { transition-duration: 0ms; }
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

        @if (data().length > 0) {
          <svg [attr.width]="'100%'" [attr.height]="svgHeight()" [attr.viewBox]="viewBox()"
               role="img" [attr.aria-labelledby]="titleElId" [attr.aria-describedby]="a11yId"
               class="block">
            <g [attr.transform]="'translate(' + margins.left + ',' + margins.top + ')'">
              <!-- X axis (value axis for horizontal) -->
              <line x1="0" [attr.x2]="plotWidth()" [attr.y1]="plotHeight()" [attr.y2]="plotHeight()"
                    stroke="var(--border-hairline)" stroke-width="1" />
              <!-- Category labels + dumbbells -->
              @for (row of rows(); track row.datum.key; let i = $index) {
                <!-- Category label -->
                <text [attr.x]="-8" [attr.y]="row.cy" dy="0.35em" text-anchor="end"
                      class="fill-neutral-600" style="font-size: var(--font-size-body-sm, 12px)">
                  {{ row.datum.key }}
                </text>
                <!-- Connecting line -->
                <line [attr.x1]="row.xA" [attr.x2]="row.xB" [attr.y1]="row.cy" [attr.y2]="row.cy"
                      stroke="var(--color-neutral-300)" stroke-width="2" />
                <!-- Dot A -->
                <circle
                  class="dumbbell-dot"
                  [attr.cx]="row.xA" [attr.cy]="row.cy" r="5"
                  [attr.fill]="visualA.color"
                  [attr.tabindex]="0"
                  role="graphics-symbol"
                  [attr.aria-label]="(row.datum.labelA ?? 'A') + ': ' + fmtFull(row.datum.valueA)"
                  (click)="onDotClick(i, row.datum, 'A')"
                  (keydown.enter)="onDotClick(i, row.datum, 'A')"
                />
                <!-- Dot B -->
                <circle
                  class="dumbbell-dot"
                  [attr.cx]="row.xB" [attr.cy]="row.cy" r="5"
                  [attr.fill]="visualB.color"
                  [attr.tabindex]="0"
                  role="graphics-symbol"
                  [attr.aria-label]="(row.datum.labelB ?? 'B') + ': ' + fmtFull(row.datum.valueB)"
                  (click)="onDotClick(i, row.datum, 'B')"
                  (keydown.enter)="onDotClick(i, row.datum, 'B')"
                />
              }
            </g>
          </svg>

          <!-- Legend for A/B -->
          <div class="flex gap-space-4 mt-space-2 text-body-sm text-neutral-600">
            <span class="inline-flex items-center gap-space-1">
              <svg width="10" height="10" aria-hidden="true"><circle cx="5" cy="5" r="5" [attr.fill]="visualA.color" /></svg>
              {{ data()[0]?.labelA ?? 'A' }}
            </span>
            <span class="inline-flex items-center gap-space-1">
              <svg width="10" height="10" aria-hidden="true"><circle cx="5" cy="5" r="5" [attr.fill]="visualB.color" /></svg>
              {{ data()[0]?.labelB ?? 'B' }}
            </span>
          </div>
        } @else {
          <div class="flex items-center justify-center text-neutral-500 text-body-sm" [style.height]="'200px'" aria-live="polite">
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
export class ChartDumbbellComponent {
  readonly data = input<DumbbellDatum[]>([]);
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
  readonly orientation = input<DumbbellOrientation>('horizontal');

  readonly dataPointActivated = output<{ index: number; datum: DumbbellDatum }>();
  readonly dataTableToggled = output<boolean>();
  readonly instructionsOpened = output<void>();

  private readonly chartId = nextId++;
  readonly titleElId = chartTitleId(this.chartId);
  readonly a11yId = chartA11yId(this.chartId);
  protected readonly margins = MARGINS;

  readonly visualA = resolveSeriesVisual(0);
  readonly visualB = resolveSeriesVisual(1);

  readonly a11yText = computed(() => buildA11yRegion({
    longDescription: this.longDescription(),
    statisticalNotes: this.statisticalNotes(),
    contextExplanation: this.contextExplanation(),
    structureNotes: this.structureNotes(),
  }));

  readonly valueMin = computed(() => {
    const vals = this.data().flatMap(d => [d.valueA, d.valueB]);
    return vals.length > 0 ? Math.min(...vals) * 0.95 : 0;
  });

  readonly valueMax = computed(() => {
    const vals = this.data().flatMap(d => [d.valueA, d.valueB]);
    return vals.length > 0 ? Math.max(...vals) * 1.05 : 100;
  });

  readonly plotWidth = computed(() => 600 - MARGINS.left - MARGINS.right);
  readonly rowHeight = 36;

  readonly plotHeight = computed(() => this.data().length * this.rowHeight);

  readonly svgHeight = computed(() =>
    `${this.plotHeight() + MARGINS.top + MARGINS.bottom}px`,
  );

  readonly viewBox = computed(() =>
    `0 0 600 ${this.plotHeight() + MARGINS.top + MARGINS.bottom}`,
  );

  scaleX(value: number): number {
    const range = this.valueMax() - this.valueMin();
    if (range === 0) return this.plotWidth() / 2;
    return ((value - this.valueMin()) / range) * this.plotWidth();
  }

  readonly rows = computed(() =>
    this.data().map((datum, i) => ({
      datum,
      cy: i * this.rowHeight + this.rowHeight / 2,
      xA: this.scaleX(datum.valueA),
      xB: this.scaleX(datum.valueB),
    })),
  );

  readonly tableColumns = computed(() => [
    { key: 'key', label: 'Categoría' },
    { key: 'valueA', label: this.data()[0]?.labelA ?? 'A', align: 'end' as const },
    { key: 'valueB', label: this.data()[0]?.labelB ?? 'B', align: 'end' as const },
  ]);

  readonly tableRows = computed(() =>
    this.data().map(d => ({
      key: d.key,
      valueA: formatNumberFull(d.valueA, this.locale()),
      valueB: formatNumberFull(d.valueB, this.locale()),
    })),
  );

  fmtFull(value: number): string {
    return formatNumberFull(value, this.locale());
  }

  onDotClick(index: number, datum: DumbbellDatum, _side: 'A' | 'B'): void {
    this.dataPointActivated.emit({ index, datum });
  }
}
