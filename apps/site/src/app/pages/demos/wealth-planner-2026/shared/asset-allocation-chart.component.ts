import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  signal,
} from '@angular/core';

import { ChartLineComponent, IconButtonComponent, SegmentedControlComponent } from '@coherence/ui';
import type { LineSeries, SegmentedOption } from '@coherence/ui';

export type AssetAllocationVariant = 'patrimonio-seleccionado' | 'todo-patrimonio';

/**
 * One row in the Mode A popover (Vista = Patrimonio seleccionado) — one
 * scenario column triplet (pesimista / medio / optimista) plus a Concepto
 * label. Numeric values are rendered via `formatPlain`; `pctRow === true`
 * switches the row to percentage formatting (Rentabilidad en el año).
 */
export interface ScenarioBreakdownRow {
  concepto: string;
  pesimista: number;
  medio: number;
  optimista: number;
  /** Render values as percentage instead of euros (e.g. "2,61 %"). */
  pctRow?: boolean;
  /** Italic / muted (e.g. derived percentage rows). */
  muted?: boolean;
  /** Optionally show "+" prefix on positive values (signed numbers). */
  signed?: boolean;
}

/** One row in the Mode B popover (Vista = Todo el patrimonio) — actual vs
 *  simulada comparison. Children render indented under their parent and are
 *  collapsible per the `defaultOpen` field. */
export interface PatrimonioBreakdownRow {
  /** Category or leaf label. Categories carry `children`. */
  concepto: string;
  actual: number;
  simulada: number;
  /** Leaf children — when present, the row renders a chevron + acts as a
   *  toggleable category header. */
  children?: ReadonlyArray<Omit<PatrimonioBreakdownRow, 'children' | 'defaultOpen' | 'total'>>;
  /** Category default open state. Ignored on leaves. */
  defaultOpen?: boolean;
  /** Bold total row (Total). */
  total?: boolean;
}

export interface YearBreakdownScenario {
  age: number;
  rows: readonly ScenarioBreakdownRow[];
}

export interface YearBreakdownPatrimonio {
  age: number;
  rows: readonly PatrimonioBreakdownRow[];
}

type PopoverMode = 'ano' | 'acumulado';

/**
 * Evolución esperada — wraps `afi-chart-line` with a click-to-pin popover
 * whose body shape varies by `variant`:
 *
 *  - 'patrimonio-seleccionado' (Mode A) — popover title `Año {{ year }}`,
 *    table with Concepto · ● Pesimista · ■ Medio · ● Optimista columns.
 *  - 'todo-patrimonio' (Mode B) — popover title `{{ age }} años de edad
 *    ({{ year }})`, collapsible patrimonio tree with two columns
 *    (▲ situación actual · ● situación simulada).
 *
 * Built off the Liquidez precedent — the popover container, click-to-pin
 * lifecycle, prev/next/close, segmented Año/Acumulado control, and
 * keyboard shortcuts (Esc / ArrowLeft / ArrowRight) are identical; only
 * the inner table renders differently.
 */
@Component({
  selector: 'site-asset-allocation-chart',
  standalone: true,
  imports: [ChartLineComponent, IconButtonComponent, SegmentedControlComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './asset-allocation-chart.component.html',
  styleUrls: ['./asset-allocation-chart.component.scss'],
})
export class AssetAllocationChartComponent {
  readonly variant = input.required<AssetAllocationVariant>();
  readonly series = input.required<LineSeries[]>();
  /** Custom legend items below the chart. Color drives the dot bg. */
  readonly legendItems = input<ReadonlyArray<{ label: string; color: string; shape?: 'dot' | 'triangle' }>>([]);

  // Mode A inputs (Patrimonio seleccionado)
  readonly anoBreakdown = input<readonly YearBreakdownScenario[]>([]);
  readonly acumuladoBreakdown = input<readonly YearBreakdownScenario[]>([]);

  // Mode B inputs (Todo el patrimonio)
  readonly patrimonioBreakdown = input<readonly YearBreakdownPatrimonio[]>([]);

  /** Birth year used to derive the displayed Año from `age`. */
  readonly birthYear = input<number>(1978);

  readonly modeOptions: SegmentedOption[] = [
    { value: 'ano', label: 'Año' },
    { value: 'acumulado', label: 'Acumulado' },
  ];

  readonly popoverMode = signal<PopoverMode>('ano');
  readonly activeAge = signal<number | null>(null);
  /** Per-category open state (Mode B only). Defaults from each row's `defaultOpen`. */
  readonly openCategories = signal<Record<string, boolean>>({});

  readonly popoverOpen = computed<boolean>(() => this.activeAge() !== null);

  /** Display year computed from active age + cliente birth year. */
  readonly activeYear = computed<number | null>(() => {
    const age = this.activeAge();
    if (age === null) return null;
    return age + this.birthYear();
  });

  /** Mode A breakdown slice (`null` when closed or variant !== A). */
  readonly activeScenarioBreakdown = computed<YearBreakdownScenario | null>(() => {
    if (this.variant() !== 'patrimonio-seleccionado') return null;
    const age = this.activeAge();
    if (age === null) return null;
    const source =
      this.popoverMode() === 'ano' ? this.anoBreakdown() : this.acumuladoBreakdown();
    return source.find((y) => y.age === age) ?? null;
  });

  /** Mode B breakdown slice. Mode B does not toggle Año/Acumulado. */
  readonly activePatrimonioBreakdown = computed<YearBreakdownPatrimonio | null>(() => {
    if (this.variant() !== 'todo-patrimonio') return null;
    const age = this.activeAge();
    if (age === null) return null;
    return this.patrimonioBreakdown().find((y) => y.age === age) ?? null;
  });

  readonly canPrevYear = computed<boolean>(() => {
    const age = this.activeAge();
    if (age === null) return false;
    return this.allAges().some((a) => a < age);
  });

  readonly canNextYear = computed<boolean>(() => {
    const age = this.activeAge();
    if (age === null) return false;
    return this.allAges().some((a) => a > age);
  });

  /** Whether to show the Año / Acumulado segmented toggle. Mode B hides it. */
  readonly showModeToggle = computed<boolean>(() => this.variant() === 'patrimonio-seleccionado');

  handlePointActivated(event: { index: number; datum: unknown }): void {
    const datum = event.datum as { x: number | Date; y: number | null } | undefined;
    if (datum === undefined) return;
    const x = datum.x instanceof Date ? datum.x.getFullYear() : datum.x;
    this.activeAge.set(x);
    this.seedOpenCategories();
  }

  closePopover(): void {
    this.activeAge.set(null);
  }

  prevYear(): void {
    const age = this.activeAge();
    if (age === null) return;
    const earlier = this.allAges().filter((a) => a < age);
    if (earlier.length === 0) return;
    this.activeAge.set(Math.max(...earlier));
  }

  nextYear(): void {
    const age = this.activeAge();
    if (age === null) return;
    const later = this.allAges().filter((a) => a > age);
    if (later.length === 0) return;
    this.activeAge.set(Math.min(...later));
  }

  setPopoverMode(value: string): void {
    if (value === 'ano' || value === 'acumulado') {
      this.popoverMode.set(value);
    }
  }

  isCategoryOpen(concepto: string, defaultOpen: boolean | undefined): boolean {
    const state = this.openCategories()[concepto];
    return state === undefined ? defaultOpen === true : state;
  }

  toggleCategory(concepto: string, defaultOpen: boolean | undefined): void {
    const current = this.isCategoryOpen(concepto, defaultOpen);
    this.openCategories.update((map) => ({ ...map, [concepto]: !current }));
  }

  formatPlain(value: number): string {
    return EUR_FORMATTER.format(value);
  }

  formatSigned(value: number): string {
    if (value === 0) return '0 €';
    const formatted = EUR_FORMATTER.format(Math.abs(value));
    return value > 0 ? `+${formatted}` : `-${formatted}`;
  }

  formatPct(value: number): string {
    return PCT_FORMATTER.format(value);
  }

  formatRow(row: ScenarioBreakdownRow, scenario: 'pesimista' | 'medio' | 'optimista'): string {
    const v = row[scenario];
    if (row.pctRow) return this.formatPct(v);
    if (row.signed) return this.formatSigned(v);
    return this.formatPlain(v);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.popoverOpen()) this.closePopover();
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    if (this.popoverOpen() && this.canPrevYear()) this.prevYear();
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    if (this.popoverOpen() && this.canNextYear()) this.nextYear();
  }

  // ── Internals ─────────────────────────────────────────────────────────

  /** Union of ages across whichever breakdown set the current variant uses. */
  private allAges(): number[] {
    if (this.variant() === 'patrimonio-seleccionado') {
      return this.anoBreakdown().map((y) => y.age);
    }
    return this.patrimonioBreakdown().map((y) => y.age);
  }

  private seedOpenCategories(): void {
    if (this.variant() !== 'todo-patrimonio') return;
    const slice = this.activePatrimonioBreakdown();
    if (!slice) return;
    const seed: Record<string, boolean> = { ...this.openCategories() };
    let changed = false;
    for (const row of slice.rows) {
      if (row.children && seed[row.concepto] === undefined) {
        seed[row.concepto] = row.defaultOpen === true;
        changed = true;
      }
    }
    if (changed) this.openCategories.set(seed);
  }
}

const EUR_FORMATTER = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const PCT_FORMATTER = new Intl.NumberFormat('es-ES', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
