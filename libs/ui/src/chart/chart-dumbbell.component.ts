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
import { ChartDataTableComponent } from './chart-data-table.component';
import { ChartNavController, EMPTY_NAV_SHAPE, type ChartNavShape } from './chart-keyboard';
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
  styleUrls: ['./chart-dumbbell.component.scss'],
  templateUrl: './chart-dumbbell.component.html',
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
  readonly height = input('20rem');
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

  private readonly chartRoot = viewChild<ElementRef<SVGSVGElement>>('chartRoot');
  private readonly marks = viewChildren<ElementRef<SVGCircleElement>>('mark');

  /**
   * One flat group of two nodes per row, no vertical arrows. Matches Visa, which
   * documents no `↑ ↓` for dumbbell plots.
   */
  private readonly navShape = computed<ChartNavShape>(() => {
    const count = this.data().length * 2;
    if (count === 0) return EMPTY_NAV_SHAPE;
    return { groupCount: 1, datumCounts: [count], crossGroup: false };
  });

  protected readonly nav = new ChartNavController(this.navShape);

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

  /**
   * Single keydown listener on the SVG root. Events from the focused node bubble
   * up to here, so both navigation levels share one handler.
   */
  onKeydown(event: KeyboardEvent): void {
    if (!this.nav.handleKey(event)) return;
    event.preventDefault();
    this.moveFocus();

    // Enter on a node activates its row, replacing the old per-dot keydown.enter.
    const active = this.nav.active();
    if (event.key === 'Enter' && !event.shiftKey && active !== null) {
      const rowIndex = Math.floor(active.datum / 2);
      const datum = this.data()[rowIndex];
      if (datum) {
        this.onDotClick(rowIndex, datum, active.datum % 2 === 0 ? 'A' : 'B');
      }
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
