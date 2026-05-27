import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import {
  ButtonComponent,
  ChartBarComponent,
  PageHeaderComponent,
  SelectComponent,
} from '@coherence/ui';
import type { BarDatum, SelectOption } from '@coherence/ui';

import { GraphCardHeaderComponent } from '../../patrones/graficos/evolucion-patrimonial/graph-card-header.component';
import {
  EvolucionBarChartComponent,
  type Escenario,
} from '../../patrones/graficos/evolucion-patrimonial/evolucion-bar-chart.component';
import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';
import type { Scenario, ScenarioRow } from '../wealth-planner-2026/store';

/**
 * Diagnóstico · Patrimonio previsto (Brief I).
 *
 * Mirrors the visual idiom established by the Patrimonio + Evolución
 * Patrimonial pages (per user feedback 2026-05-27): KPI data-cards row at
 * the top, GraphCardHeader for the chart headline, the bespoke
 * EvolucionBarChartComponent for the projection, a 4-row scenario
 * read-out table below.
 *
 * Single Escenario selector drives the headline + chart. The table stays
 * static (all four scenarios visible so the gestor can compare).
 *
 * Shared `Scenario` type is consumed by Briefs J/K/L. Mock data is inline;
 * the real simulation engine lands with Conclusiones.
 *
 * Figma: TBD — pull "Diagnóstico · Patrimonio previsto" from `888lN7vbJSc4gLYt7nP3DW`.
 * PDF:  `CambiosAfiWealthPlanner20260226.pdf` pp.7-8.
 */
@Component({
  selector: 'site-patrimonio-previsto-page',
  standalone: true,
  imports: [
    ButtonComponent,
    ChartBarComponent,
    PageHeaderComponent,
    SelectComponent,
    GraphCardHeaderComponent,
    EvolucionBarChartComponent,
    ObjetivosPageShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './patrimonio-previsto.page.html',
  styleUrls: ['./patrimonio-previsto.page.scss'],
})
export class PatrimonioPrevistoPage {
  readonly store = inject(WealthPlannerStore);

  // ── Active scenario (drives KPIs + chart) ─────────────────────────────
  //
  // EvolucionBarChartComponent's Escenario type is the 3 production-side
  // scenarios + 'todos' overlay. The brief's `Scenario` type adds
  // 'objetivo' (the family's aspirational baseline). The chart can't
  // render 'objetivo' yet, so when the user picks Objetivo the chart falls
  // back to 'todos' (showing the 3 simulated scenarios that bracket the
  // objetivo line). Table stays 4-row regardless.
  readonly escenarioSeleccionado = signal<Scenario>('objetivo');

  // ── Chart driver — coerces 'objetivo' to 'todos' for the chart only ───
  readonly chartEscenario = computed<Escenario>(() => {
    const s = this.escenarioSeleccionado();
    if (s === 'objetivo') return 'todos';
    return s as Escenario;
  });

  // ── Active row (for KPI headline / data-cards / GraphCardHeader) ──────
  readonly activeRow = computed<ScenarioRow>(
    () =>
      this.store.patrimonioPrevisto().find((r) => r.scenario === this.escenarioSeleccionado()) ??
      this.store.patrimonioPrevisto()[0]!,
  );

  // ── Headline + comparison (mirrors Evolución patrimonial framing) ─────
  readonly headline = computed<string>(() => {
    const row = this.activeRow();
    return `${this.formatEuro(row.coberturaVital)} de cobertura vital`;
  });

  readonly comparison = computed<string>(() => {
    const row = this.activeRow();
    return `${this.formatEuro(row.legadoInmobiliario)} legado inmobiliario · ${this.formatEuro(row.legadoFinanciero)} legado financiero`;
  });

  readonly tooltipText =
    'Cobertura vital = patrimonio total estimado a edad de seguridad. Legado = lo que queda al final del horizonte por tipo.';

  // ── Filter options ────────────────────────────────────────────────────
  readonly escenarioOptions: SelectOption[] = [
    { value: 'objetivo', label: 'Escenario objetivo' },
    { value: 'optimista', label: 'Escenario optimista' },
    { value: 'medio', label: 'Escenario medio' },
    { value: 'pesimista', label: 'Escenario pesimista' },
  ];

  setEscenario(v: string | number | null): void {
    if (v === 'objetivo' || v === 'optimista' || v === 'medio' || v === 'pesimista') {
      this.escenarioSeleccionado.set(v);
    }
  }

  // ── KPI data-cards (top row, same shape as patrimonial-proposal) ──────
  readonly kpis = computed(() => {
    const row = this.activeRow();
    const total = row.coberturaVital + row.legadoInmobiliario + row.legadoFinanciero;
    return [
      {
        label: 'Patrimonio previsto',
        value: this.formatEuro(total),
        caption: `Edad de seguridad · ${this.scenarioLabel(this.escenarioSeleccionado())}`,
      },
      {
        label: 'Cobertura vital',
        value: this.formatEuro(row.coberturaVital),
        caption: 'Años cubiertos × gasto anual',
      },
      {
        label: 'Legado inmobiliario',
        value: this.formatEuro(row.legadoInmobiliario),
        caption: 'Activos no líquidos al cierre',
      },
      {
        label: 'Legado financiero',
        value: this.formatEuro(row.legadoFinanciero),
        caption: 'Activos financieros al cierre',
      },
    ];
  });

  // ── Helpers ───────────────────────────────────────────────────────────
  private formatEuro(value: number): string {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2).replace('.', ',')} M €`;
    }
    if (value === 0) return '0 €';
    return `${Math.round(value).toLocaleString('es-ES')} €`;
  }

  scenarioLabel(s: Scenario): string {
    switch (s) {
      case 'objetivo':
        return 'Objetivo';
      case 'optimista':
        return 'Optimista';
      case 'medio':
        return 'Medio';
      case 'pesimista':
        return 'Pesimista';
    }
  }

  scenarioLabelLong(s: Scenario): string {
    switch (s) {
      case 'objetivo':
        return 'Escenario objetivo';
      case 'optimista':
        return 'Escenario optimista';
      case 'medio':
        return 'Escenario medio';
      case 'pesimista':
        return 'Escenario pesimista';
    }
  }

  formatEuroCell(v: number): string {
    return this.formatEuro(v);
  }

  // ── Section 2: Evolución de ingresos y gastos — bar chart ────────────
  //
  // v1 simplification: shows net cashflow (ingresos − gastos) per projected
  // year as a single bar series. The Figma calls for a stacked positive/
  // negative chart with Neto + Acumulado overlay lines — that's a richer
  // chart that needs either a libs/ui extension or a bespoke component.
  // Tagged as v1 in the section hint so the reviewer knows.
  private readonly anioActual = new Date().getFullYear();
  private readonly HORIZONTE_ANIOS = 36; // 55 → 90 in the Figma; mock here.

  readonly cashflowSeries = computed<BarDatum[]>(() => {
    const ingresos = this.store.ingresos().reduce((acc, r) => acc + r.valor, 0);
    const gastos = this.store.gastos().reduce((acc, r) => acc + r.valor, 0);
    const neto = ingresos - gastos;
    return Array.from({ length: this.HORIZONTE_ANIOS + 1 }, (_, i) => ({
      key: String(this.anioActual + i),
      value: Math.round(neto * (1 + i * 0.02)),
    }));
  });
}
