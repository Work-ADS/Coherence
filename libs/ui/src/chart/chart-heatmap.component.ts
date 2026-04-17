import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import { LoadingOverlayComponent } from '../loading-overlay';
import { ChartInstructionsComponent } from './chart-instructions.component';
import type { HeatmapCell, HeatmapScale } from './chart.types';
import { resolveDivergentColor } from './chart.variants';
import { formatNumberFull } from './chart-format';
import { buildA11yRegion, chartA11yId, chartTitleId } from './chart-a11y';

let nextId = 0;

/**
 * Heatmap chart primitive.
 *
 * Two-dimensional grid with color-coded cells. Supports sequential and
 * divergent color scales. Cell labels optional. Legend shown when cells
 * are not individually labeled.
 */
@Component({
  selector: 'afi-chart-heatmap',
  standalone: true,
  imports: [
    LoadingOverlayComponent,
    ChartInstructionsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: block; position: relative; }
    .heatmap-cell {
      transition: opacity 180ms ease-out;
      cursor: pointer;
      stroke: var(--surface-base, white);
      stroke-width: 1;
    }
    .heatmap-cell:hover, .heatmap-cell:focus-visible { opacity: 0.8; }
    .heatmap-cell:focus-visible {
      outline: 2px solid var(--border-focus);
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
      .heatmap-cell { transition-duration: 0ms; }
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
          <svg [attr.width]="'100%'" [attr.height]="height()" [attr.viewBox]="viewBox()"
               role="img" [attr.aria-labelledby]="titleElId" [attr.aria-describedby]="a11yId"
               class="block">
            <g [attr.transform]="'translate(' + marginLeft + ',' + marginTop + ')'">
              <!-- Y labels -->
              @for (yLabel of yLabels(); track yLabel; let yi = $index) {
                <text [attr.x]="-8" [attr.y]="yi * cellH() + cellH() / 2"
                      dy="0.35em" text-anchor="end"
                      class="fill-neutral-500" style="font-size: var(--font-size-body-sm, 12px)">
                  {{ yLabel }}
                </text>
              }
              <!-- X labels -->
              @for (xLabel of xLabels(); track xLabel; let xi = $index) {
                <text [attr.x]="xi * cellW() + cellW() / 2" [attr.y]="gridHeight() + 14"
                      text-anchor="middle"
                      class="fill-neutral-500" style="font-size: var(--font-size-body-sm, 12px)">
                  {{ xLabel }}
                </text>
              }
              <!-- Cells -->
              @for (cell of renderedCells(); track cell.id) {
                <rect
                  class="heatmap-cell"
                  [attr.x]="cell.cx"
                  [attr.y]="cell.cy"
                  [attr.width]="cellW()"
                  [attr.height]="cellH()"
                  [attr.fill]="cell.color"
                  [attr.tabindex]="0"
                  role="graphics-symbol"
                  [attr.aria-label]="cell.ariaLabel"
                  (click)="onCellClick(cell)"
                  (keydown.enter)="onCellClick(cell)"
                />
                @if (showCellLabels()) {
                  <text
                    [attr.x]="cell.cx + cellW() / 2"
                    [attr.y]="cell.cy + cellH() / 2"
                    dy="0.35em" text-anchor="middle"
                    class="fill-canvas-fg" style="font-size: var(--font-size-body-sm, 12px)"
                    pointer-events="none"
                  >{{ cell.label }}</text>
                }
              }
            </g>
          </svg>
        } @else {
          <div class="flex items-center justify-center text-neutral-500 text-body-sm" [style.height]="height()" aria-live="polite">
            Sin datos para mostrar
          </div>
        }

        <ng-content select="[slot=footer]" />
      </figure>
    </afi-loading-overlay>
  `,
})
export class ChartHeatmapComponent {
  readonly data = input<HeatmapCell[]>([]);
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
  readonly scale = input<HeatmapScale>('sequential');
  readonly showCellLabels = input(false);

  readonly dataPointActivated = output<{ index: number; datum: HeatmapCell }>();
  readonly instructionsOpened = output<void>();

  private readonly chartId = nextId++;
  readonly titleElId = chartTitleId(this.chartId);
  readonly a11yId = chartA11yId(this.chartId);
  protected readonly marginLeft = 64;
  protected readonly marginTop = 8;

  readonly a11yText = computed(() => buildA11yRegion({
    longDescription: this.longDescription(),
    statisticalNotes: this.statisticalNotes(),
    contextExplanation: this.contextExplanation(),
    structureNotes: this.structureNotes(),
  }));

  readonly xLabels = computed(() => {
    const set = new Set<string>();
    for (const c of this.data()) set.add(String(c.x));
    return [...set];
  });

  readonly yLabels = computed(() => {
    const set = new Set<string>();
    for (const c of this.data()) set.add(String(c.y));
    return [...set];
  });

  readonly cellW = computed(() => {
    const xCount = this.xLabels().length || 1;
    return Math.min(48, (600 - this.marginLeft - 16) / xCount);
  });

  readonly cellH = computed(() => {
    const yCount = this.yLabels().length || 1;
    return Math.min(40, 240 / yCount);
  });

  readonly gridHeight = computed(() => this.yLabels().length * this.cellH());

  readonly viewBox = computed(() =>
    `0 0 600 ${this.gridHeight() + this.marginTop + 32}`,
  );

  readonly valueRange = computed(() => {
    const vals = this.data().map(c => c.value);
    return { min: Math.min(...vals), max: Math.max(...vals) };
  });

  readonly renderedCells = computed(() => {
    const xLabels = this.xLabels();
    const yLabels = this.yLabels();
    const { min, max } = this.valueRange();
    const range = max - min || 1;
    const cw = this.cellW();
    const ch = this.cellH();
    const scaleType = this.scale();

    return this.data().map((cell, i) => {
      const xi = xLabels.indexOf(String(cell.x));
      const yi = yLabels.indexOf(String(cell.y));
      const normalized = scaleType === 'divergent'
        ? (cell.value - (min + max) / 2) / (range / 2)
        : (cell.value - min) / range;

      return {
        id: `${cell.x}-${cell.y}`,
        cx: xi * cw,
        cy: yi * ch,
        color: resolveDivergentColor(Math.max(-1, Math.min(1, normalized)), scaleType),
        label: formatNumberFull(cell.value, this.locale()),
        ariaLabel: `${cell.y}, ${cell.x}: ${formatNumberFull(cell.value, this.locale())}`,
        datum: cell,
        index: i,
      };
    });
  });

  onCellClick(cell: { index: number; datum: HeatmapCell }): void {
    this.dataPointActivated.emit({ index: cell.index, datum: cell.datum });
  }
}
