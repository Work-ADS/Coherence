import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type RentabilidadBandIntent =
  | 'success-strong'
  | 'success'
  | 'warning'
  | 'error';

export interface RentabilidadChartScenarioPointer {
  /** Visible label, e.g. "Escenario optimista". */
  label: string;
  /** Percentage value on the 0-10 scale. */
  value: number;
}

export interface RentabilidadChartMinRequiredPointer {
  /** Visible label, e.g. "Rentabilidad mínima necesaria". */
  label: string;
  value: number;
}

export interface RentabilidadChartBand {
  fromPct: number;
  toPct: number;
  intent: RentabilidadBandIntent;
  /** Label rendered at the top edge of this band, e.g. "2 %". */
  topLabel: string;
}

const DEFAULT_BANDS: readonly RentabilidadChartBand[] = [
  { fromPct: 0, toPct: 2, intent: 'success-strong', topLabel: '2 %' },
  { fromPct: 2, toPct: 4, intent: 'success', topLabel: '4 %' },
  { fromPct: 4, toPct: 7, intent: 'warning', topLabel: '7 %' },
  { fromPct: 7, toPct: 10, intent: 'error', topLabel: '10 %' },
];

const DEFAULT_LEGEND: readonly string[] = ['Muy alta', 'Alta', 'Media', 'Baja'];

const PCT_FORMATTER = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/**
 * Probability-gradient bar chart used on the Estrategias →
 * Rentabilidad objetivo tab.
 *
 * A vertical bar with four color bands (low → high rentabilidad) anchors
 * scenario rentabilidades on the left and a "minimum required" pointer on
 * the right. The chart is read-only and consumes no DS chart primitive
 * because no existing chart matches the gradient-bar + side-pointers
 * layout. Plan de acción §4.b reuses this same shape — see
 * `2026-05-26-awp-diagnostico-estrategias.md`.
 */
@Component({
  selector: 'site-rentabilidad-objetivo-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rentabilidad-objetivo-chart.component.html',
  styleUrls: ['./rentabilidad-objetivo-chart.component.scss'],
})
export class RentabilidadObjetivoChartComponent {
  readonly scenarios = input.required<RentabilidadChartScenarioPointer[]>();
  readonly minRequired = input.required<RentabilidadChartMinRequiredPointer>();
  readonly bands = input<readonly RentabilidadChartBand[]>(DEFAULT_BANDS);
  readonly probabilityLegend = input<readonly string[]>(DEFAULT_LEGEND);
  readonly baseLabel = input<string>('0 %');
  readonly leftColumnLabel = input<string>('Escenarios');
  readonly rightColumnLabel = input<string>('Rentabilidad objetivo');

  /** Generated screen-reader summary — fires only when inputs change. */
  readonly ariaLabel = computed(() => {
    const min = this.minRequired();
    const scenarioList = this.scenarios()
      .map((s) => `${s.label.toLowerCase()} ${this.formatPct(s.value)}`)
      .join(', ');
    return `${min.label}: ${this.formatPct(min.value)}. Escenarios considerados: ${scenarioList}.`;
  });

  readonly legendEntries = computed(() =>
    this.bands().map((band, index) => ({
      intent: band.intent,
      label: this.probabilityLegend()[index] ?? '',
    })),
  );

  formatPct(value: number): string {
    return `${PCT_FORMATTER.format(value)} %`;
  }
}
