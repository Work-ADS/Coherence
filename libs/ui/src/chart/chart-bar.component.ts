import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

import { LoadingOverlayComponent } from '../loading-overlay';
import { ChartAxisComponent } from './chart-axis.component';
import { ChartInstructionsComponent } from './chart-instructions.component';
import { ChartDataTableComponent } from './chart-data-table.component';
import type { BarDatum, BarOrientation, BarSort, ChartMargins } from './chart.types';
import { resolveSeriesVisual } from './chart.variants';
import { formatNumber, formatNumberFull } from './chart-format';
import { buildA11yRegion, chartA11yId, chartTitleId } from './chart-a11y';

let nextId = 0;

const MARGINS: ChartMargins = { top: 16, right: 16, bottom: 48, left: 56 };

/**
 * Bar chart primitive.
 *
 * Vertical or horizontal bars. Y-axis always starts at zero (non-negotiable).
 * Color + texture applied together. Hand-written SVG — no d3.
 */
@Component({
  selector: 'afi-chart-bar',
  standalone: true,
  imports: [
    LoadingOverlayComponent,
    ChartAxisComponent,
    ChartInstructionsComponent,
    ChartDataTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: block; position: relative; }
    .bar-rect {
      transition: opacity 180ms ease-out;
      cursor: pointer;
    }
    .bar-rect:hover, .bar-rect:focus-visible { opacity: 0.8; }
    .bar-rect:focus-visible {
      outline: 2px solid var(--border-focus);
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
      .bar-rect { transition-duration: 0ms; }
    }
  `,
  template: `
    <afi-loading-overlay variant="quiet-spinner" [visible]="loading()">
      <figure class="relative" role="figure" [attr.aria-labelledby]="titleElId">
        <!-- Header -->
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

        <!-- sr-only a11y region -->
        <div [id]="a11yId" class="sr-only">{{ a11yText() }}</div>

        <!-- SVG chart -->
        @if (sortedData().length > 0) {
          <svg [attr.width]="'100%'" [attr.height]="height()" [attr.viewBox]="viewBox()"
               role="img" [attr.aria-labelledby]="titleElId" [attr.aria-describedby]="a11yId"
               class="block">
            <g [attr.transform]="'translate(' + margins.left + ',' + margins.top + ')'">
              <!-- Y axis -->
              <g afi-chart-axis orientation="y" [min]="0" [max]="yMax()" [length]="plotHeight()" [locale]="locale()" />
              <!-- X axis ticks (categorical) -->
              <g [attr.transform]="'translate(0,' + plotHeight() + ')'">
                <line x1="0" [attr.x2]="plotWidth()" stroke="var(--border-hairline)" stroke-width="1" />
                @for (bar of bars(); track bar.datum.key; let i = $index) {
                  <text
                    [attr.x]="bar.x + bar.width / 2"
                    y="16"
                    text-anchor="middle"
                    class="fill-neutral-500"
                    style="font-size: var(--font-size-body-sm, 12px)"
                  >{{ bar.datum.key }}</text>
                }
              </g>
              <!-- Bars -->
              @for (bar of bars(); track bar.datum.key; let i = $index) {
                <rect
                  class="bar-rect"
                  [attr.x]="bar.x"
                  [attr.y]="bar.y"
                  [attr.width]="bar.width"
                  [attr.height]="bar.barHeight"
                  [attr.fill]="bar.fill"
                  [attr.tabindex]="0"
                  [attr.role]="'graphics-symbol'"
                  [attr.aria-label]="bar.datum.key + ': ' + formatFull(bar.datum.value)"
                  (click)="onBarClick(i, bar.datum)"
                  (keydown.enter)="onBarClick(i, bar.datum)"
                />
                @if (bar.datum.label || bar.showLabel) {
                  <text
                    [attr.x]="bar.x + bar.width / 2"
                    [attr.y]="bar.y - 4"
                    text-anchor="middle"
                    class="fill-neutral-700"
                    style="font-size: var(--font-size-body-sm, 12px)"
                  >{{ bar.datum.label ?? formatShort(bar.datum.value) }}</text>
                }
              }
            </g>
          </svg>
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
export class ChartBarComponent {
  // Shared inputs
  readonly data = input<BarDatum[]>([]);
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

  // Bar-specific inputs
  readonly orientation = input<BarOrientation>('vertical');
  readonly sort = input<BarSort>(null);

  // Outputs
  readonly dataPointActivated = output<{ index: number; datum: BarDatum }>();
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

  readonly sortedData = computed(() => {
    const d = [...this.data()];
    const s = this.sort();
    if (s === 'asc') d.sort((a, b) => a.value - b.value);
    if (s === 'desc') d.sort((a, b) => b.value - a.value);
    return d;
  });

  readonly yMax = computed(() => {
    const values = this.sortedData().map(d => d.value);
    return values.length > 0 ? Math.max(...values) * 1.1 : 100;
  });

  readonly plotWidth = computed(() => 600 - MARGINS.left - MARGINS.right);
  readonly plotHeight = computed(() => 280 - MARGINS.top - MARGINS.bottom);

  readonly viewBox = computed(() => `0 0 600 280`);

  readonly bars = computed(() => {
    const data = this.sortedData();
    const pw = this.plotWidth();
    const ph = this.plotHeight();
    const yMax = this.yMax();
    const gap = 4;
    const barWidth = data.length > 0 ? (pw - gap * (data.length - 1)) / data.length : 0;
    const focusVal = this.focus();

    // Auto-highlight: if no explicit focus, highlight the max-value bar
    let highlightIndex = -1;
    if (focusVal === null && data.length > 1) {
      let maxVal = -Infinity;
      data.forEach((d, i) => {
        if (d.value > maxVal) { maxVal = d.value; highlightIndex = i; }
      });
    }

    return data.map((datum, i) => {
      const isHighlighted = focusVal !== null
        ? (focusVal === i || focusVal === datum.key)
        : i === highlightIndex;
      const visual = resolveSeriesVisual(isHighlighted ? 1 : 0);
      const barHeight = yMax > 0 ? (datum.value / yMax) * ph : 0;
      return {
        datum,
        x: i * (barWidth + gap),
        y: ph - barHeight,
        width: Math.max(barWidth, 1),
        barHeight,
        fill: visual.color,
        showLabel: data.length <= 12,
      };
    });
  });

  readonly tableColumns = computed(() => [
    { key: 'key', label: 'Categoría' },
    { key: 'value', label: 'Valor', align: 'end' as const },
  ]);

  readonly tableRows = computed(() =>
    this.sortedData().map(d => ({
      key: d.key,
      value: this.formatFull(d.value),
    })),
  );

  formatShort(value: number): string {
    return formatNumber(value, this.locale());
  }

  formatFull(value: number): string {
    return formatNumberFull(value, this.locale());
  }

  onBarClick(index: number, datum: BarDatum): void {
    this.dataPointActivated.emit({ index, datum });
  }
}
