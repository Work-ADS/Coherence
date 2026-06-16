import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import {
  PageHeaderComponent,
  TabItemComponent,
  TableComponent,
  TabsComponent,
} from '@coherence/ui';
import type { TableCellTone, TableColumn } from '@coherence/ui';

import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import {
  RentabilidadObjetivoChartComponent,
  type RentabilidadChartMinRequiredPointer,
  type RentabilidadChartScenarioPointer,
} from '../wealth-planner-2026/shared/rentabilidad-objetivo-chart.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';
import type { ScenarioWithActual } from '../wealth-planner-2026/store';

/**
 * Index signature so the literal satisfies `<afi-table>`'s
 * `Record<string, unknown>[]` rows input. The named fields stay strict
 * for editor support.
 */
interface EstrategiasRow {
  [key: string]: unknown;
  id: string;
  muted?: boolean;
}

/**
 * Diagnóstico · Estrategias (PDF §3.c — Brief J).
 *
 * Four tabs surface what the patrimonio financiero must do to cover the
 * cliente's objetivos:
 *   1. Rentabilidad objetivo — bespoke gradient-bar chart
 *   2. Gasto anual máximo    — table by scenario
 *   3. Ingreso anual mínimo  — single-row pivot table
 *   4. Edad de retiro mínima — table by scenario
 *
 * Read-only output — numbers seeded on the WealthPlannerStore.
 */
@Component({
  selector: 'site-estrategias-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    TabItemComponent,
    TableComponent,
    TabsComponent,
    ObjetivosPageShellComponent,
    RentabilidadObjetivoChartComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './estrategias.page.html',
  styleUrls: ['./estrategias.page.scss'],
})
export class EstrategiasPage {
  readonly store = inject(WealthPlannerStore);
  readonly activeTab = signal<number>(0);

  // ── Tab 1 · Rentabilidad objetivo ──────────────────────────────────────
  readonly rentabilidadChartScenarios = computed<RentabilidadChartScenarioPointer[]>(() =>
    this.store.rentabilidadScenarios().map((s) => ({
      label: `Escenario ${s.scenario}`,
      value: s.rentabilidadMedia,
    })),
  );

  readonly rentabilidadChartMinRequired = computed<RentabilidadChartMinRequiredPointer>(() => ({
    label: 'Rentabilidad mínima necesaria',
    value: this.store.rentabilidadMinima(),
  }));

  // ── Tab 2 · Gasto anual máximo ─────────────────────────────────────────
  readonly gastoColumns: TableColumn[] = [
    { key: 'escenario', label: 'Escenario' },
    { key: 'total', label: 'Total', align: 'end', toneKey: 'tTotal' },
    { key: 'previoRetiro', label: 'Previo a retiro', align: 'end', toneKey: 'tPrevio' },
    {
      key: 'posteriorRetiro',
      label: 'Posterior a retiro',
      align: 'end',
      toneKey: 'tPosterior',
    },
  ];

  readonly gastoRows = computed<EstrategiasRow[]>(() =>
    this.store.gastoAnualMaximo().map((r) => {
      const tones = this.gastoTones(r.scenario);
      return {
        id: r.scenario,
        escenario:
          r.scenario === 'actual' ? 'Gasto medio anual actual' : this.scenarioLabel(r.scenario),
        total: this.formatEuro(r.total),
        previoRetiro: this.formatEuro(r.previoRetiro),
        posteriorRetiro: this.formatEuro(r.posteriorRetiro),
        muted: r.scenario === 'actual',
        ...tones,
      };
    }),
  );

  readonly gastoPosteriorLabel = computed(() =>
    this.formatEuro(this.store.gastoPosteriorEstimado()),
  );
  readonly gastoPrevioLabel = computed(() => this.formatEuro(this.store.gastoPrevioActual()));

  // ── Tab 3 · Ingreso anual mínimo ───────────────────────────────────────
  readonly ingresoColumns: TableColumn[] = [
    { key: 'actual', label: 'Ingreso anual actual', align: 'end' },
    { key: 'pesimista', label: 'Escenario pesimista', align: 'end', toneKey: 'tPesimista' },
    { key: 'medio', label: 'Escenario medio', align: 'end', toneKey: 'tMedio' },
    { key: 'optimista', label: 'Escenario optimista', align: 'end', toneKey: 'tOptimista' },
  ];

  readonly ingresoRows = computed<EstrategiasRow[]>(() => {
    const r = this.store.ingresoAnualMinimo();
    return [
      {
        id: 'ingreso-anual-minimo',
        actual: this.formatEuro(r.actual),
        pesimista: this.formatEuro(r.pesimista),
        medio: this.formatEuro(r.medio),
        optimista: this.formatEuro(r.optimista),
        tPesimista: 'danger' satisfies TableCellTone,
        tMedio: 'warning' satisfies TableCellTone,
        tOptimista: 'success' satisfies TableCellTone,
      },
    ];
  });

  // ── Tab 4 · Edad de retiro mínima ──────────────────────────────────────
  readonly edadColumns: TableColumn[] = [
    { key: 'escenario', label: 'Escenario' },
    { key: 'edad', label: 'Edad mínima necesaria', align: 'end', toneKey: 'tEdad' },
  ];

  readonly edadRows = computed<EstrategiasRow[]>(() =>
    this.store.edadRetiroMinima().map((r) => ({
      id: r.scenario,
      escenario: r.scenario === 'actual' ? 'Actual' : this.scenarioLabel(r.scenario),
      edad: `${r.edad} años`,
      muted: r.scenario === 'actual',
      tEdad: this.edadTone(r.scenario),
    })),
  );

  // ── Helpers ────────────────────────────────────────────────────────────
  private scenarioLabel(scenario: ScenarioWithActual): string {
    switch (scenario) {
      case 'actual':
        return 'Actual';
      case 'optimista':
        return 'Optimista';
      case 'medio':
        return 'Medio';
      case 'pesimista':
        return 'Pesimista';
      case 'objetivo':
        return 'Objetivo';
    }
  }

  /**
   * Per-cell tones for Gasto anual máximo. The Figma is not a pure
   * "above/below baseline" rule — Medio's Previo column is green even
   * though the others on the row are warning — so the mapping lives here
   * as a literal lookup keyed off scenario.
   */
  private gastoTones(scenario: ScenarioWithActual): {
    tTotal?: TableCellTone;
    tPrevio?: TableCellTone;
    tPosterior?: TableCellTone;
  } {
    switch (scenario) {
      case 'optimista':
        return { tTotal: 'success', tPrevio: 'success', tPosterior: 'success' };
      case 'medio':
        return { tTotal: 'warning', tPrevio: 'success', tPosterior: 'warning' };
      case 'pesimista':
        return { tTotal: 'warning', tPrevio: 'warning', tPosterior: 'warning' };
      default:
        return {};
    }
  }

  private edadTone(scenario: ScenarioWithActual): TableCellTone | null {
    switch (scenario) {
      case 'optimista':
        return 'success';
      case 'medio':
        return 'warning';
      case 'pesimista':
        return 'danger';
      default:
        return null;
    }
  }

  private readonly euroFormatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

  private formatEuro(value: number): string {
    return this.euroFormatter.format(value);
  }
}
