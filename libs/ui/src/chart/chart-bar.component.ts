import {
  booleanAttribute,
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
import { formatNumber, formatNumberFull, withUnit } from './chart-format';
import { buildA11yRegion, chartA11yId, chartTitleId } from './chart-a11y';

let nextId = 0;

// All figures below are viewBox units, not CSS pixels — the SVG scales to fit.
const MARGINS_VERTICAL: ChartMargins = { top: 16, right: 16, bottom: 48, left: 56 };
/** Horizontal trades left room for category names and right room for value labels. */
const MARGINS_HORIZONTAL: ChartMargins = { top: 16, right: 56, bottom: 40, left: 140 };

const VIEWBOX_WIDTH = 600;
const VERTICAL_VIEWBOX_HEIGHT = 280;
/** Per-category row height in horizontal mode; the plot grows with the data. */
const HORIZONTAL_ROW_HEIGHT = 32;
const BAR_GAP = 4;
const LABEL_GAP = 4;
/** Inset of an inside label from the bar's zero end, measured to the near edge
 *  of the text rather than its baseline — see the vertical branch of `bars()`. */
const LABEL_INSET = 10;
/**
 * Cap height of a body-sm glyph in viewBox units.
 *
 * SVG positions text by its baseline, so a label above the zero line and one below
 * it are not symmetric for free: above, the baseline is the text's bottom edge;
 * below, the baseline is well past its top edge. Adding the cap height on the
 * negative side makes the visible gap from the baseline match on both sides.
 */
const TEXT_CAP_HEIGHT = 8.5;
/** Below this bar length an inside label would not fit; it goes outside instead. */
const MIN_INSIDE_LABEL_LENGTH = 24;
/** Rough advance width of one body-sm glyph, for reserving the label's margin. */
const LABEL_CHAR_WIDTH = 6.2;
/** Above this many bars, direct value labels stop fitting and the axis carries it. */
const MAX_LABELLED_BARS = 12;
/** Browser default root size, for converting viewBox units to a rem height. */
const ROOT_FONT_SIZE = 16;
/** Roughly how many ticks the horizontal value axis aims for before rounding. */
const TARGET_TICKS = 4;

/** Round a raw step up to the nearest 1 / 2 / 5 × 10ⁿ so tick labels read cleanly. */
function niceStep(raw: number): number {
  if (!(raw > 0)) return 0;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const normalised = raw / magnitude;
  const factor = normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 5 ? 5 : 10;
  return factor * magnitude;
}

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
  /**
   * Drop the measured axis's tick numbers, keeping its line.
   *
   * For the compact form: when every bar carries a direct label, the tick numbers
   * are the duplicated information the data-viz skill says to strip. The axis line
   * stays because Visa's anatomy marks the quantitative axis as required — it is
   * the structural anchor, and only the numbers were redundant.
   *
   * Opt-in rather than automatic so charts already shipping are untouched.
   */
  readonly hideAxisTicks = input(false, { transform: booleanAttribute });

  /**
   * Unit appended to every value label — `€`, `%`, `tx`. Follows the number after
   * a non-breaking space (see `withUnit`), which is RAE for the euro and percent
   * signs and reads correctly for plain units too.
   */
  readonly unit = input<string | null>(null);

  /**
   * Reference line value — a market average, a target, a threshold.
   *
   * Visa's task-type table names reference lines as the affordance for the Compare
   * and Identify tasks: they let a reader judge each bar against a benchmark
   * without a second chart.
   */
  readonly referenceValue = input<number | null>(null);

  /** Label for the reference line. Without one the line is an unexplained rule. */
  readonly referenceLabel = input<string | null>(null);

  /**
   * Move value labels inside the bar, near its base.
   *
   * Keeps them clear of a reference line, which otherwise collides with labels
   * sitting just above each bar. Expects a dark fill — the label switches to the
   * inverse foreground — so it pairs with the default and highlight slots, not the
   * faint end of the ramp. Bars too short to hold a label fall back to outside.
   */
  readonly valueLabelInside = input(false, { transform: booleanAttribute });

  // Outputs
  readonly dataPointActivated = output<{ index: number; datum: BarDatum }>();
  readonly dataTableToggled = output<boolean>();
  readonly instructionsOpened = output<void>();

  private readonly id = nextId++;
  readonly titleElId = chartTitleId(this.id);
  readonly a11yId = chartA11yId(this.id);

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

  readonly isHorizontal = computed(() => this.orientation() === 'horizontal');

  /**
   * The reference line's label text, value included.
   *
   * Deliberately free of geometry: `margins` needs the label's width to reserve
   * room for it, and geometry depends on margins. Deriving the text separately
   * breaks what would otherwise be a circular computed.
   */
  readonly referenceLabelText = computed(() => {
    const value = this.referenceValue();
    const name = this.referenceLabel();
    if (value === null || !name) return null;
    // The label carries its value — a reference line whose value the reader has to
    // infer from the axis fails the Lookup task the line exists to serve.
    return `${name}: ${withUnit(this.formatShort(value), this.unit())}`;
  });

  /**
   * Orientation-specific margins — horizontal needs room for category names.
   *
   * A vertical chart with a labelled reference line also reserves right-hand room
   * for that label, so it can sit outside the plot. Inside the plot it inevitably
   * lands on a bar, which reads as an overlay obscuring data.
   */
  readonly margins = computed<ChartMargins>(() => {
    const base = this.isHorizontal() ? MARGINS_HORIZONTAL : MARGINS_VERTICAL;
    const label = this.referenceLabelText();
    if (this.isHorizontal() || !label) return base;
    return {
      ...base,
      right: Math.max(base.right, label.length * LABEL_CHAR_WIDTH + LABEL_GAP * 3),
    };
  });

  /**
   * The value domain, always including zero.
   *
   * "Bar charts start at zero. Always" (data-viz-skill.md) does not mean zero is
   * the floor — with negative values it means zero must be inside the domain, so
   * the axis crossing is truthful and bar lengths stay comparable.
   *
   * All-positive data keeps the original multiplicative headroom so every chart
   * already shipping renders byte-identically. Only mixed or all-negative data
   * takes the new padding path.
   */
  readonly valueDomain = computed(() => {
    const values = this.sortedData().map((d) => d.value);
    if (values.length === 0) return { min: 0, max: 100 };

    const lo = Math.min(0, ...values);
    const hi = Math.max(0, ...values);

    if (lo === 0) return { min: 0, max: hi * 1.1 || 100 };

    // Pad only the ends that carry data, so zero keeps its exact position.
    const pad = (hi - lo) * 0.1;
    return { min: lo - pad, max: hi > 0 ? hi + pad : 0 };
  });

  /** True once any bar descends below zero, which is when a zero rule earns its keep. */
  readonly hasNegative = computed(() => this.valueDomain().min < 0);

  readonly plotWidth = computed(
    () => VIEWBOX_WIDTH - this.margins().left - this.margins().right,
  );

  readonly plotHeight = computed(() => {
    const m = this.margins();
    if (!this.isHorizontal()) return VERTICAL_VIEWBOX_HEIGHT - m.top - m.bottom;
    // Horizontal grows with the category count instead of squeezing rows.
    return Math.max(this.sortedData().length, 1) * HORIZONTAL_ROW_HEIGHT;
  });

  readonly viewBox = computed(() => {
    if (!this.isHorizontal()) return `0 0 ${VIEWBOX_WIDTH} ${VERTICAL_VIEWBOX_HEIGHT}`;
    const m = this.margins();
    return `0 0 ${VIEWBOX_WIDTH} ${this.plotHeight() + m.top + m.bottom}`;
  });

  /**
   * Rendered height. Vertical honours the `height` input; horizontal derives its
   * own from the row count so rows never compress into illegibility.
   */
  readonly svgHeight = computed(() => {
    if (!this.isHorizontal()) return this.height();
    const m = this.margins();
    return `${(this.plotHeight() + m.top + m.bottom) / ROOT_FONT_SIZE}rem`;
  });

  /** Position of a value along the measured axis, in viewBox units. */
  private scaleValue(value: number): number {
    const { min, max } = this.valueDomain();
    const span = max - min;
    const extent = this.isHorizontal() ? this.plotWidth() : this.plotHeight();
    if (span === 0) return this.isHorizontal() ? 0 : extent;
    const ratio = (value - min) / span;
    // Vertical measures downward from the top, so the ratio is inverted.
    return this.isHorizontal() ? ratio * extent : extent - ratio * extent;
  }

  /** Where zero sits along the measured axis — the baseline every bar grows from. */
  readonly zeroOffset = computed(() => this.scaleValue(0));

  /** Reference line placement, or null when no reference value is set or it
   *  falls outside the plotted domain (where a line would mislead). */
  readonly reference = computed(() => {
    const value = this.referenceValue();
    if (value === null) return null;
    const { min, max } = this.valueDomain();
    if (value < min || value > max) return null;
    const offset = this.scaleValue(value);
    const label = this.referenceLabelText();
    return {
      offset,
      // Horizontal annotates above the line; vertical sits in the right margin,
      // clear of the plot, vertically centred on the line it describes.
      labelX: this.isHorizontal() ? offset + LABEL_GAP : this.plotWidth() + LABEL_GAP * 2,
      label,
    };
  });

  /**
   * Ticks for the horizontal value axis, drawn inline rather than by
   * `afi-chart-axis` (its x mode conflates axis length with its own offset).
   *
   * Stepped on a 1 / 2 / 5 × 10ⁿ ladder so the labels land on round numbers.
   * Dividing the padded domain into equal parts produces values like 353,1, which
   * reads as a bug even when the geometry is right.
   */
  readonly valueTicks = computed(() => {
    if (!this.isHorizontal() || this.hideAxisTicks()) return [];

    const { min, max } = this.valueDomain();
    const step = niceStep((max - min) / TARGET_TICKS);
    if (step <= 0) return [];

    const ticks: Array<{ value: number; offset: number; label: string }> = [];
    for (let v = Math.ceil(min / step) * step; v <= max; v += step) {
      // Guard against float drift turning 0 into -0 or 1e-13.
      const value = Math.abs(v) < step / 2 ? 0 : v;
      ticks.push({ value, offset: this.scaleValue(value), label: this.formatShort(value) });
    }
    return ticks;
  });

  readonly bars = computed(() => {
    const data = this.sortedData();
    const horizontal = this.isHorizontal();
    const band = horizontal ? this.plotHeight() : this.plotWidth();
    const zero = this.zeroOffset();
    const count = data.length;
    const bandSize = count > 0 ? (band - BAR_GAP * (count - 1)) / count : 0;
    const focusVal = this.focus();

    // Auto-highlight: if no explicit focus, highlight the max-value bar.
    let highlightIndex = -1;
    if (focusVal === null && count > 1) {
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

      const offset = i * (bandSize + BAR_GAP);
      const valuePos = this.scaleValue(datum.value);
      // Measured from zero in both directions, so length is always positive and
      // a negative datum renders a real bar instead of an invalid SVG height.
      const start = Math.min(zero, valuePos);
      const length = Math.abs(valuePos - zero);
      const negative = datum.value < 0;

      // DS contract (charts.scss, locked 2026-06-01): any value below zero is a
      // single flat red meaning debt or loss — no ladder, no per-category variant,
      // magnitude read from length rather than tone. It outranks the focus
      // highlight, because "this is a loss" matters more than "this is the peak".
      const fill = negative ? 'var(--chart-negative)' : visual.color;

      // Inside placement needs a bar long enough to hold the text without the
      // glyphs touching either end; otherwise it falls back outside.
      const inside = this.valueLabelInside() && length >= MIN_INSIDE_LABEL_LENGTH;

      return horizontal
        ? {
            datum,
            x: start,
            y: offset,
            width: Math.max(length, 1),
            height: Math.max(bandSize, 1),
            fill,
            valueX: inside
              ? (negative ? start + LABEL_INSET : start + length - LABEL_INSET)
              : (negative ? start - LABEL_GAP : start + length + LABEL_GAP),
            valueY: offset + bandSize / 2,
            valueAnchor: inside
              ? (negative ? 'start' : 'end')
              : (negative ? 'end' : 'start'),
            valueInside: inside,
            catX: -LABEL_GAP * 2,
            catY: offset + bandSize / 2,
            catAnchor: 'end',
            showLabel: count <= MAX_LABELLED_BARS,
          }
        : {
            datum,
            x: offset,
            y: start,
            width: Math.max(bandSize, 1),
            height: Math.max(length, 1),
            fill,
            valueX: offset + bandSize / 2,
            // Inside sits near the base of the bar — at the zero end, so a
            // reference line higher up never lands on the text.
            // Inside sits near the base of the bar — at the zero end, so a
            // reference line higher up never lands on the text. The negative side
            // adds the cap height so its visible gap from the baseline matches the
            // positive side's, rather than sitting tight against the line.
            valueY: inside
              ? (negative
                  ? start + LABEL_INSET + TEXT_CAP_HEIGHT
                  : start + length - LABEL_INSET)
              : (negative ? start + length + LABEL_GAP * 3 : start - LABEL_GAP),
            valueAnchor: 'middle',
            valueInside: inside,
            catX: offset + bandSize / 2,
            catY: this.plotHeight() + LABEL_GAP * 4,
            catAnchor: 'middle',
            showLabel: count <= MAX_LABELLED_BARS,
          };
    });
  });

  /** A value label with its unit, as rendered on the bar. */
  labelFor(datum: BarDatum): string {
    return datum.label ?? withUnit(this.formatShort(datum.value), this.unit());
  }

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
