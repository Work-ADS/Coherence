import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  viewChild,
  viewChildren,
} from '@angular/core';

import { LoadingOverlayComponent } from '../loading-overlay';
import { ChartInstructionsComponent } from './chart-instructions.component';
import { ChartNavController, EMPTY_NAV_SHAPE, type ChartNavShape } from './chart-keyboard';
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
  styleUrls: ['./chart-heatmap.component.scss'],
  templateUrl: './chart-heatmap.component.html',
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
  readonly height = input('20rem');
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

  /**
   * Cells grouped into rows, row-major.
   *
   * Grouped rather than flat for two reasons: rows are the navigation groups
   * (`↑ ↓` moves between them), and row-major DOM order means a screen reader
   * walks the grid the way it is drawn instead of following whatever order the
   * caller happened to pass `data` in. Sparse grids simply have shorter rows.
   */
  readonly renderedRows = computed(() => {
    const xLabels = this.xLabels();
    const yLabels = this.yLabels();
    const { min, max } = this.valueRange();
    const range = max - min || 1;
    const cw = this.cellW();
    const ch = this.cellH();
    const scaleType = this.scale();

    const byPosition = new Map<string, { cell: HeatmapCell; index: number }>();
    this.data().forEach((cell, index) => {
      byPosition.set(`${cell.y} ${cell.x}`, { cell, index });
    });

    return yLabels.map((yLabel, yi) => ({
      label: yLabel,
      cells: xLabels.flatMap((xLabel, xi) => {
        const hit = byPosition.get(`${yLabel} ${xLabel}`);
        if (!hit) return [];

        const { cell, index } = hit;
        const normalized = scaleType === 'divergent'
          ? (cell.value - (min + max) / 2) / (range / 2)
          : (cell.value - min) / range;

        return [{
          id: `${cell.x}-${cell.y}`,
          cx: xi * cw,
          cy: yi * ch,
          color: resolveDivergentColor(Math.max(-1, Math.min(1, normalized)), scaleType),
          label: formatNumberFull(cell.value, this.locale()),
          ariaLabel: `${cell.y}, ${cell.x}: ${formatNumberFull(cell.value, this.locale())}`,
          datum: cell,
          index,
        }];
      }),
    }));
  });

  private readonly chartRoot = viewChild<ElementRef<SVGSVGElement>>('chartRoot');
  private readonly marks = viewChildren<ElementRef<SVGRectElement>>('mark');

  /**
   * Rows are groups, so `↑ ↓` moves between rows and `← →` along one.
   *
   * **Deviation from Visa (intentional):** their heatmap page gives `← →` and
   * `↑ ↓` identical descriptions, which reads as a slip in their docs. We
   * implement the two axes distinctly.
   */
  private readonly navShape = computed<ChartNavShape>(() => {
    const rows = this.renderedRows();
    if (rows.length === 0) return EMPTY_NAV_SHAPE;
    return {
      groupCount: rows.length,
      datumCounts: rows.map((row) => row.cells.length),
      crossGroup: true,
    };
  });

  protected readonly nav = new ChartNavController(this.navShape);

  onCellClick(cell: { index: number; datum: HeatmapCell }): void {
    this.dataPointActivated.emit({ index: cell.index, datum: cell.datum });
  }

  /**
   * Single keydown listener on the SVG root. Events from the focused cell bubble
   * up to here, so both navigation levels share one handler.
   */
  onKeydown(event: KeyboardEvent): void {
    if (!this.nav.handleKey(event)) return;
    event.preventDefault();
    this.moveFocus();

    // Enter on a cell activates it, replacing the old per-cell keydown.enter.
    const active = this.nav.active();
    if (event.key === 'Enter' && !event.shiftKey && active !== null) {
      const cell = this.renderedRows()[active.group]?.cells[active.datum];
      if (cell) this.onCellClick(cell);
    }
  }

  /**
   * Follow the cursor with real DOM focus. `ElementRef` rather than the CDK
   * (clean-code.md rule 7) because no CDK manager models a two-axis cursor over
   * SVG marks; this mirrors the roving-tabindex idiom in segmented-control-v2.
   */
  private moveFocus(): void {
    const active = this.nav.active();
    if (active === null) {
      this.chartRoot()?.nativeElement.focus();
      return;
    }
    this.marks()[active.flat]?.nativeElement.focus();
  }
}
