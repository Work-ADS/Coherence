// external
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

// relative
import { LoadingOverlayComponent } from '../loading-overlay';
import { TableV2Component } from '../table-v2';
import type { TableV2Column } from '../table-v2';
import { ChartInstructionsComponent } from './chart-instructions.component';
import { ChartTooltipComponent } from './chart-tooltip.component';
import { buildA11yRegion, chartA11yId, chartTitleId } from './chart-a11y';
import { formatCurrency, formatPercent } from './chart-format';
import type { BarDatum, CompositionVariant } from './chart.types';

let nextId = 0;

/** Monochrome ink ramp, darkest → lightest. Rank order maps onto it. */
const INKS: readonly string[] = [
  'var(--chart-monochrome-strong)',
  'var(--chart-monochrome-medium)',
  'var(--chart-monochrome-soft)',
  'var(--chart-monochrome-faint)',
];

interface CompositionSegment {
  datum: BarDatum;
  fraction: number;
  ink: string;
  emphasized: boolean;
  /** Tick-pitch multiplier for the `ticks` variant — lighter ranks get wider pitch. */
  pitch: number;
  aria: string;
}

/**
 * Composition strip — part-to-whole in a single horizontal band.
 *
 * The foundations-modern (v2) answer to "what is the total made of":
 * one strip, segments sized by value, monochrome ink ramp where the
 * emphasized segment (largest by default) takes the darkest step.
 * Three variants: `segments` (rounded, gapped), `blocks` (flat editorial
 * rectangles), `ticks` (hairline tick field; the emphasized segment
 * renders solid — the rest read as texture).
 *
 * DOM-based (no SVG): widths are flex fractions, inks are CSS custom
 * properties, so the strip stays crisp at every container size.
 * Tooltip follows the pointer; keyboard and screen-reader users get the
 * same data via per-segment labels, the legend, and the data table.
 */
@Component({
  selector: 'afi-chart-composition',
  standalone: true,
  imports: [
    LoadingOverlayComponent,
    TableV2Component,
    ChartInstructionsComponent,
    ChartTooltipComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart-composition.component.html',
  styleUrls: ['./chart-composition.component.scss'],
})
export class ChartCompositionComponent {
  // Shared chart-family inputs
  readonly data = input<BarDatum[]>([]);
  readonly loading = input(false);
  readonly title = input<string | null>(null);
  readonly subtitle = input<string | null>(null);
  readonly longDescription = input('');
  readonly statisticalNotes = input('');
  readonly contextExplanation = input('');
  readonly structureNotes = input('');
  readonly locale = input('es-ES');

  // Composition-specific inputs
  readonly variant = input<CompositionVariant>('segments');
  /** Key of the segment that anchors the darkest ink. Null → largest value. */
  readonly emphasis = input<string | null>(null);
  readonly showLegend = input(true);

  // Outputs
  readonly dataPointActivated = output<{ index: number; datum: BarDatum }>();
  readonly dataTableToggled = output<boolean>();
  readonly instructionsOpened = output<void>();

  private readonly id = nextId++;
  readonly titleElId = chartTitleId(this.id);
  readonly a11yId = chartA11yId(this.id);

  private readonly tooltip = viewChild(ChartTooltipComponent);

  readonly hovered = signal<number | null>(null);
  readonly tableOpen = signal(false);
  readonly tipTitle = signal('');
  readonly tipValue = signal<string | null>(null);
  readonly tipSecondary = signal<string | null>(null);

  readonly a11yText = computed(() =>
    buildA11yRegion({
      longDescription: this.longDescription(),
      statisticalNotes: this.statisticalNotes(),
      contextExplanation: this.contextExplanation(),
      structureNotes: this.structureNotes(),
    }),
  );

  readonly total = computed(() => this.data().reduce((sum, d) => sum + d.value, 0));

  private readonly emphasizedKey = computed(() => {
    const explicit = this.emphasis();
    if (explicit !== null) return explicit;
    let key: string | null = null;
    let max = -Infinity;
    for (const d of this.data()) {
      if (d.value > max) {
        max = d.value;
        key = d.key;
      }
    }
    return key;
  });

  readonly segments = computed<CompositionSegment[]>(() => {
    const data = this.data();
    const total = this.total();
    if (data.length === 0 || total <= 0) return [];

    const emphasizedKey = this.emphasizedKey();
    // Rank by value (desc) to hand out ink steps; the emphasized segment
    // always takes the darkest step, the rest follow in rank order.
    const rank = new Map<string, number>();
    [...data]
      .sort((a, b) => b.value - a.value)
      .forEach((d, i) => rank.set(d.key, i));

    const rampForRank = (r: number): string =>
      INKS[r < INKS.length ? r : 1 + ((r - 1) % (INKS.length - 1))]!;

    return data.map((datum) => {
      const fraction = datum.value / total;
      const emphasized = datum.key === emphasizedKey;
      const r = rank.get(datum.key) ?? INKS.length - 1;
      const ink = emphasized ? INKS[0]! : rampForRank(Math.max(r, 1));
      // Ticks variant: pitch widens as the rank lightens, so texture density
      // separates segments even where the ink steps sit close.
      const pitch = emphasized ? 1 : 1 + Math.max(r, 1) * 0.5;
      return {
        datum,
        fraction,
        ink,
        emphasized,
        pitch,
        aria: `${datum.key}: ${this.formatPct(fraction)} (${this.formatEur(datum.value)})`,
      };
    });
  });

  readonly stripSummary = computed(() => {
    const parts = this.segments()
      .map((s) => s.aria)
      .join(', ');
    return `Composición del total, ${this.formatEur(this.total())}: ${parts}`;
  });

  readonly tableColumns = computed<TableV2Column[]>(() => [
    { key: 'key', label: 'Categoría' },
    { key: 'value', label: 'Valor', kind: 'numeric' },
    { key: 'pct', label: 'Porcentaje', kind: 'numeric' },
  ]);

  readonly tableRows = computed(() =>
    this.segments().map((s) => ({
      key: s.datum.key,
      value: this.formatEur(s.datum.value),
      pct: this.formatPct(s.fraction),
    })),
  );

  formatEur(value: number): string {
    return formatCurrency(value, this.locale());
  }

  formatPct(fraction: number): string {
    return formatPercent(Math.round(fraction * 1000) / 1000, this.locale());
  }

  onSegmentEnter(index: number): void {
    const seg = this.segments()[index];
    if (!seg) return;
    this.hovered.set(index);
    this.tipTitle.set(seg.datum.key);
    this.tipValue.set(this.formatEur(seg.datum.value));
    this.tipSecondary.set(this.formatPct(seg.fraction));
  }

  onSegmentFocus(index: number): void {
    // Focus drives the same emphasis state; data reaches keyboard users
    // via the segment's aria-label, the legend, and the data table.
    this.hovered.set(index);
  }

  onStripMove(event: PointerEvent): void {
    // Sanctioned pointer read for chart tooltip coordinates (clean-code §7).
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.tooltip()?.show(x, y + 20);
  }

  onStripLeave(): void {
    this.hovered.set(null);
    this.tooltip()?.hide();
  }

  onSegmentActivated(index: number): void {
    const seg = this.segments()[index];
    if (!seg) return;
    this.dataPointActivated.emit({ index, datum: seg.datum });
  }

  onTableToggle(): void {
    const open = !this.tableOpen();
    this.tableOpen.set(open);
    this.dataTableToggled.emit(open);
  }
}
