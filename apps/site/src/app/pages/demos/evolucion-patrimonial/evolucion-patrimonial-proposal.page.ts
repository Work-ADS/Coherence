import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  DropdownPanelComponent,
  IconButtonComponent,
  MenuComponent,
  MenuItemComponent,
  PageHeaderComponent,
  SwitchComponent,
} from '@coherence/ui';

import {
  EvolucionBarChartComponent,
  type Vista,
  type Escenario,
  type Detalle,
} from '../../patrones/graficos/evolucion-patrimonial/evolucion-bar-chart.component';
import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';

/**
 * Filter option — local shape for the chip-dropdown menus. Mirrors the
 * shape patrimonio uses for its Tipo / Entidad chips: a value/label pair.
 */
interface FilterOption<V extends string> {
  value: V;
  label: string;
}

/**
 * Propuesta — Evolución comparada (Conclusiones §5.a).
 *
 * Page-structure-skill compliance:
 *   - slot="actions"  → ONE page-wide action: download as HTML table.
 *   - slot="filters"  → Vista / Escenario / Detalle as chip-dropdowns
 *                       (the patrimonio pattern — chip-shaped trigger that
 *                       opens an `<afi-menu>` with the options) + Ajustes
 *                       (3 chart switches inside `<afi-dropdown-panel>`).
 *   - body (default)  → just the chart + (optional) band note + explainer.
 *                       The page is single-section; no intermediate graph
 *                       header — the page-header IS the title.
 *
 * Chart palette is locked to canonical `'a'` (--chart-stacked-{1..7}, LOCKED
 * 2026-05-28).
 */
@Component({
  selector: 'site-evolucion-patrimonial-proposal-page',
  standalone: true,
  imports: [
    DropdownPanelComponent,
    EvolucionBarChartComponent,
    IconButtonComponent,
    MenuComponent,
    MenuItemComponent,
    ObjetivosPageShellComponent,
    PageHeaderComponent,
    SwitchComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './evolucion-patrimonial-proposal.page.html',
  styleUrls: ['./evolucion-patrimonial-proposal.page.scss'],
})
export class EvolucionPatrimonialProposalPage {
  readonly store = inject(WealthPlannerStore);

  readonly vista = signal<Vista>('actual');
  readonly escenario = signal<Escenario>('medio');
  readonly detalle = signal<Detalle>('agregada');

  readonly vistaMenuOpen = signal(false);
  readonly escenarioMenuOpen = signal(false);
  readonly detalleMenuOpen = signal(false);

  readonly ajustesOpen = signal(false);
  readonly ajusteObjetivos = signal(false);
  readonly ajusteInmobiliario = signal(true);
  readonly ajusteHitos = signal(false);

  /** The chart only shades when the active vista has a probability band
   *  to render — currently 'comparada' or escenario === 'todos'. The band
   *  note follows the same rule so it's only visible when there's
   *  something to explain. */
  readonly showScenarioLegend = computed(
    () => this.vista() === 'comparada' || this.escenario() === 'todos',
  );

  /**
   * Audit of inputs vs the chart's `renderMode` (see
   * `evolucion-bar-chart.component.ts:1038-1042`):
   *   - `vista === 'comparada'`      → renderMode = lines-comparada (detalle ignored)
   *   - `escenario === 'todos'`      → renderMode = lines-todos      (detalle ignored)
   *   - `detalle === 'activo'`       → renderMode = stacked          (incluirInmobiliario applies)
   *   - otherwise                    → renderMode = single
   *
   * Disable any control whose change wouldn't move a pixel on the chart so
   * the user doesn't toggle a filter that does nothing.
   */
  readonly detalleDisabled = computed(
    () => this.vista() === 'comparada' || this.escenario() === 'todos',
  );

  /** `incluirInmobiliario` is only read by the stacked render branch. */
  readonly ajusteInmobiliarioDisabled = computed(() => this.detalle() !== 'activo');

  private readonly escenarioFactor: Record<Escenario, number> = {
    medio: 1.0,
    optimista: 1.15,
    pesimista: 0.85,
    todos: 1.0,
  };

  readonly viewExplainer = computed(() => {
    const v = this.vista();
    const e = this.escenario();
    const d = this.detalle();
    let base: string;
    switch (v) {
      case 'actual':
        base = 'Tu patrimonio real, basado en lo que tienes hoy';
        break;
      case 'simulada':
        base =
          'Proyección de tu patrimonio si sigues el plan — aportaciones y ahorro pautados hasta la jubilación';
        break;
      case 'comparada':
        base =
          'Comparación entre tu patrimonio real y la proyección que lograrías siguiendo el plan';
        break;
    }
    let detalleStr = '';
    if (v !== 'comparada') {
      switch (d) {
        case 'agregada':
          detalleStr = ', año a año';
          break;
        case 'activo':
          detalleStr = ', desglosado por tipo de activo (inmobiliario, inversiones, pensiones…)';
          break;
        case 'objetivo':
          detalleStr =
            ', con los hitos vitales principales señalados (retiro, jubilación, emancipación)';
          break;
      }
    }
    let escenarioStr: string;
    switch (e) {
      case 'medio':
        escenarioStr =
          'en un escenario económico medio (crecimiento e inflación en valores normales)';
        break;
      case 'optimista':
        escenarioStr = 'en un escenario optimista (la economía crece por encima de la media)';
        break;
      case 'pesimista':
        escenarioStr = 'en un escenario pesimista (crisis o estancamiento económico)';
        break;
      case 'todos':
        escenarioStr =
          'bajo los tres escenarios económicos (pesimista, medio y optimista) superpuestos';
        break;
    }
    return `${base}${detalleStr}, ${escenarioStr}.`;
  });

  readonly vistaOptions: FilterOption<Vista>[] = [
    { value: 'actual', label: 'Actual' },
    { value: 'simulada', label: 'Simulada' },
    { value: 'comparada', label: 'Comparada' },
  ];

  readonly escenarioOptions: FilterOption<Escenario>[] = [
    { value: 'medio', label: 'Medio' },
    { value: 'optimista', label: 'Optimista' },
    { value: 'pesimista', label: 'Pesimista' },
    { value: 'todos', label: 'Todos' },
  ];

  readonly detalleOptions: FilterOption<Detalle>[] = [
    { value: 'agregada', label: 'Agregada' },
    { value: 'activo', label: 'Por activo' },
    { value: 'objetivo', label: 'Por objetivo' },
  ];

  readonly vistaLabel = computed(
    () => this.vistaOptions.find((o) => o.value === this.vista())?.label ?? '',
  );
  readonly escenarioLabel = computed(
    () => this.escenarioOptions.find((o) => o.value === this.escenario())?.label ?? '',
  );
  readonly detalleLabel = computed(
    () => this.detalleOptions.find((o) => o.value === this.detalle())?.label ?? '',
  );

  selectVista(v: Vista): void {
    this.vista.set(v);
    this.vistaMenuOpen.set(false);
  }
  selectEscenario(v: Escenario): void {
    this.escenario.set(v);
    this.escenarioMenuOpen.set(false);
  }
  selectDetalle(v: Detalle): void {
    this.detalle.set(v);
    this.detalleMenuOpen.set(false);
  }

  toggleDetalleMenu(): void {
    if (this.detalleDisabled()) return;
    this.detalleMenuOpen.set(!this.detalleMenuOpen());
  }

  toggleAjustes(): void {
    this.ajustesOpen.set(!this.ajustesOpen());
  }
  closeAjustes(): void {
    this.ajustesOpen.set(false);
  }

  /**
   * Generate an HTML table snapshot of the chart's current view and trigger
   * a browser download. The page builds the table from a stub data series
   * shaped like the patrimonio curve (ages 55–90, escenario factor applied).
   * Live chart-data exposure would require a chart-primitive API change —
   * out of scope for this brief.
   */
  onDownloadHtmlTable(): void {
    const factor = this.escenarioFactor[this.escenario()];
    const ages = Array.from({ length: 36 }, (_, i) => 55 + i);
    const baseValues = ages.map((age) => {
      const peak = age <= 63 ? (age - 55) / 8 : Math.max(0, (90 - age) / 27);
      return Math.round(1_500_000 * peak * factor);
    });

    const rows = ages
      .map(
        (age, i) =>
          `      <tr><td>${age}</td><td>${(baseValues[i] ?? 0).toLocaleString('es-ES')} €</td></tr>`,
      )
      .join('\n');

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Evolución comparada — ${this.vista()} · ${this.escenario()} · ${this.detalle()}</title>
</head>
<body>
  <h1>Evolución comparada</h1>
  <p>Vista: ${this.vista()} · Escenario: ${this.escenario()} · Detalle: ${this.detalle()}</p>
  <table>
    <thead>
      <tr><th>Edad</th><th>Patrimonio</th></tr>
    </thead>
    <tbody>
${rows}
    </tbody>
  </table>
</body>
</html>
`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evolucion-comparada-${this.vista()}-${this.escenario()}-${this.detalle()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
