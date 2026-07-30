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
import { ChartLegendComponent } from './chart-legend.component';
import { ChartNavController, EMPTY_NAV_SHAPE, type ChartNavShape } from './chart-keyboard';
import type { LineSeries, ChartMargins } from './chart.types';
import { resolveSeriesVisual } from './chart.variants';
import { formatNumber, formatNumberFull, formatDate } from './chart-format';
import { buildA11yRegion, chartA11yId, chartTitleId } from './chart-a11y';

let nextId = 0;

const MARGINS: ChartMargins = { top: 16, right: 16, bottom: 48, left: 56 };
const VIEWBOX_WIDTH = 960;
const VIEWBOX_HEIGHT = 320;

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
  styleUrls: ['./chart-line.component.scss'],
  templateUrl: './chart-line.component.html',
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
  readonly height = input('20rem');
  readonly focus = input<number | string | null>(null);
  readonly baselineZero = input(false);
  readonly showMarkers = input(false);
  /** Suppress the built-in `?` chart-instructions toggle. */
  readonly hideInstructions = input(false);
  /** Suppress the built-in auto-legend below the plot. */
  readonly hideLegend = input(false);
  /** Suppress the built-in expandable data-table footer. */
  readonly hideDataTable = input(false);
  /** Suppress the built-in title/subtitle/action row. Use when the surrounding
   *  page-header section already provides title + action chrome. */
  readonly hideHeader = input(false);

  readonly dataPointActivated = output<{ index: number; datum: unknown }>();
  readonly dataTableToggled = output<boolean>();
  readonly instructionsOpened = output<void>();

  private readonly id = nextId++;
  readonly titleElId = chartTitleId(this.id);
  readonly a11yId = chartA11yId(this.id);
  protected readonly margins = MARGINS;

  private readonly chartRoot = viewChild<ElementRef<SVGSVGElement>>('chartRoot');
  private readonly marks = viewChildren<ElementRef<SVGCircleElement>>('mark');

  /**
   * Series are groups, so `↑ ↓` moves between lines while `← →` walks along one.
   * Matches Visa, which documents both axes for line charts.
   */
  private readonly navShape = computed<ChartNavShape>(() => {
    const series = this.renderedSeries();
    if (series.length === 0) return EMPTY_NAV_SHAPE;
    return {
      groupCount: series.length,
      datumCounts: series.map((s) => s.navPoints.length),
      crossGroup: true,
    };
  });

  protected readonly nav = new ChartNavController(this.navShape);

  readonly a11yText = computed(() => buildA11yRegion({
    longDescription: this.longDescription(),
    statisticalNotes: this.statisticalNotes(),
    contextExplanation: this.contextExplanation(),
    structureNotes: this.structureNotes(),
  }));

  readonly hasData = computed(() => this.data().some(s => s.points.length > 0));

  readonly plotWidth = computed(() => VIEWBOX_WIDTH - MARGINS.left - MARGINS.right);
  readonly plotHeight = computed(() => VIEWBOX_HEIGHT - MARGINS.top - MARGINS.bottom);
  readonly viewBox = computed(() => `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`);

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

  readonly xTicks = computed<Array<{ value: number; cx: number; label: string }>>(() => {
    const series = this.data();
    if (series.length === 0) return [];
    const uniq = new Set<number>();
    let firstX: number | Date | undefined;
    for (const s of series) {
      for (const p of s.points) {
        uniq.add(p.x instanceof Date ? p.x.getTime() : p.x);
        firstX ??= p.x;
      }
    }
    if (uniq.size === 0) return [];
    const sorted = [...uniq].sort((a, b) => a - b);
    const target = 8;
    const stride = Math.max(1, Math.ceil(sorted.length / target));
    const picked: number[] = [];
    for (let i = 0; i < sorted.length; i += stride) picked.push(sorted[i]!);
    const last = sorted[sorted.length - 1]!;
    if (picked[picked.length - 1] !== last) picked.push(last);
    const isDate = firstX instanceof Date;
    return picked.map((value) => ({
      value,
      cx: this.scaleX(value),
      label: isDate
        ? formatDate(new Date(value), this.locale())
        : formatNumber(value, this.locale()),
    }));
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
      const baseVisual = resolveSeriesVisual(si);
      const visual = series.color
        ? { ...baseVisual, color: series.color }
        : baseVisual;
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

      return {
        key: series.key,
        path,
        points,
        // Only non-null points are rendered and navigable. Keeping this list
        // separate means the DOM order of markers, and therefore the flat index
        // the nav controller computes, always lines up.
        navPoints: points.filter((p) => p.y !== null),
        visual,
      };
    });
  });

  readonly legendItems = computed(() =>
    this.data().map((s, i) => {
      const baseVisual = resolveSeriesVisual(i);
      return {
        label: s.key,
        visual: s.color ? { ...baseVisual, color: s.color } : baseVisual,
      };
    }),
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

  /**
   * Single keydown listener on the SVG root. Events from the focused marker
   * bubble up to here, so both navigation levels share one handler.
   */
  onKeydown(event: KeyboardEvent): void {
    if (!this.nav.handleKey(event)) return;
    event.preventDefault();
    this.moveFocus();

    // Enter on a point activates it, replacing the old per-marker keydown.enter.
    const active = this.nav.active();
    if (event.key === 'Enter' && !event.shiftKey && active !== null) {
      const point = this.renderedSeries()[active.group]?.navPoints[active.datum];
      if (point) this.onPointClick(active.group, point.idx);
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
