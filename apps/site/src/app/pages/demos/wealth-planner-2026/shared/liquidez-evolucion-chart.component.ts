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

export type ScenarioKey = 'pesimista' | 'medio' | 'optimista';

export interface ScenarioBreakdownRow {
  concepto: string;
  pesimista: number;
  medio: number;
  optimista: number;
}

export interface YearBreakdown {
  /** Cliente age at this year. */
  age: number;
  rows: readonly ScenarioBreakdownRow[];
}

type PopoverMode = 'ano' | 'acumulado';

/**
 * Evolución del exceso de liquidez — wraps `afi-chart-line` with a
 * click-to-pin scenario popover. The popover body toggles between an
 * `Año` view (just this year's flows) and an `Acumulado` view (running
 * totals up to this year) via an embedded `afi-segmented-control`.
 *
 * Composes the primitive rather than extending it (no DS API growth —
 * same precedent as `RentabilidadObjetivoChartComponent`). Year-indexed
 * breakdown rows are supplied by the parent page; the wrapper just
 * picks the right slice when a marker fires `dataPointActivated`.
 */
@Component({
  selector: 'site-liquidez-evolucion-chart',
  standalone: true,
  imports: [ChartLineComponent, IconButtonComponent, SegmentedControlComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './liquidez-evolucion-chart.component.html',
  styleUrls: ['./liquidez-evolucion-chart.component.scss'],
})
export class LiquidezEvolucionChartComponent {
  readonly series = input.required<LineSeries[]>();
  readonly anoBreakdown = input.required<readonly YearBreakdown[]>();
  readonly acumuladoBreakdown = input.required<readonly YearBreakdown[]>();

  readonly modeOptions: SegmentedOption[] = [
    { value: 'ano', label: 'Año' },
    { value: 'acumulado', label: 'Acumulado' },
  ];

  readonly popoverMode = signal<PopoverMode>('ano');
  readonly activeAge = signal<number | null>(null);

  readonly popoverOpen = computed<boolean>(() => this.activeAge() !== null);

  /** Breakdown slice for the active year + current mode, or null if closed. */
  readonly activeBreakdown = computed<YearBreakdown | null>(() => {
    const age = this.activeAge();
    if (age === null) return null;
    const source =
      this.popoverMode() === 'ano' ? this.anoBreakdown() : this.acumuladoBreakdown();
    return source.find((y) => y.age === age) ?? null;
  });

  /** Bounds for the chevron navigation — sourced from the breakdown set so
   *  the wrapper doesn't have to know AGE_FROM/AGE_TO. */
  readonly canPrevYear = computed<boolean>(() => {
    const age = this.activeAge();
    if (age === null) return false;
    return this.anoBreakdown().some((y) => y.age < age);
  });

  readonly canNextYear = computed<boolean>(() => {
    const age = this.activeAge();
    if (age === null) return false;
    return this.anoBreakdown().some((y) => y.age > age);
  });

  handlePointActivated(event: { index: number; datum: unknown }): void {
    const datum = event.datum as { x: number | Date; y: number | null } | undefined;
    if (datum === undefined) return;
    const x = datum.x instanceof Date ? datum.x.getFullYear() : datum.x;
    this.activeAge.set(x);
  }

  closePopover(): void {
    this.activeAge.set(null);
  }

  prevYear(): void {
    const age = this.activeAge();
    if (age === null) return;
    const ages = this.anoBreakdown().map((y) => y.age).filter((a) => a < age);
    if (ages.length === 0) return;
    this.activeAge.set(Math.max(...ages));
  }

  nextYear(): void {
    const age = this.activeAge();
    if (age === null) return;
    const ages = this.anoBreakdown().map((y) => y.age).filter((a) => a > age);
    if (ages.length === 0) return;
    this.activeAge.set(Math.min(...ages));
  }

  setPopoverMode(value: string): void {
    if (value === 'ano' || value === 'acumulado') {
      this.popoverMode.set(value);
    }
  }

  formatSigned(value: number): string {
    if (value === 0) return '0 €';
    const formatted = EUR_FORMATTER.format(Math.abs(value));
    return value > 0 ? `+${formatted}` : `-${formatted}`;
  }

  formatPlain(value: number): string {
    return EUR_FORMATTER.format(value);
  }

  isSignedRow(concepto: string): boolean {
    return SIGNED_CONCEPTOS.has(concepto);
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
}

const EUR_FORMATTER = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const SIGNED_CONCEPTOS: ReadonlySet<string> = new Set([
  'Ingresos del año',
  'Rentabilidad del exceso de liquidez en el año',
  'Gastos del año',
  'Colchón de liquidez',
  'Ingresos acumulados',
  'Rentabilidad acumulada del exceso de liquidez',
  'Gastos acumulados',
]);
