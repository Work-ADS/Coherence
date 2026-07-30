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
import { ChartAxisComponent } from './chart-axis.component';
import { ChartInstructionsComponent } from './chart-instructions.component';
import { ChartDataTableComponent } from './chart-data-table.component';
import { ChartNavController, EMPTY_NAV_SHAPE, type ChartNavShape } from './chart-keyboard';
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
  styleUrls: ['./chart-bar.component.scss'],
  templateUrl: './chart-bar.component.html',
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
  readonly height = input('20rem');
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

  private readonly chartRoot = viewChild<ElementRef<SVGSVGElement>>('chartRoot');
  private readonly marks = viewChildren<ElementRef<SVGRectElement>>('mark');

  /**
   * Bars are one-dimensional: a single group, no vertical arrows. Matches Visa,
   * which documents no `↑ ↓` for bar charts.
   */
  private readonly navShape = computed<ChartNavShape>(() => {
    const count = this.bars().length;
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

  /**
   * Single keydown listener on the SVG root. Events from the focused bar bubble
   * up to here, so both navigation levels share one handler.
   */
  onKeydown(event: KeyboardEvent): void {
    if (!this.nav.handleKey(event)) return;
    event.preventDefault();
    this.moveFocus();

    // Enter on a bar activates it, replacing the old per-bar `keydown.enter`.
    const active = this.nav.active();
    if (event.key === 'Enter' && !event.shiftKey && active !== null) {
      const datum = this.sortedData()[active.datum];
      if (datum) this.dataPointActivated.emit({ index: active.datum, datum });
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
