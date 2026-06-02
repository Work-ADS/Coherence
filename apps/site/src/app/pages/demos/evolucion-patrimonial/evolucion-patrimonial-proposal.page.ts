import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  type WritableSignal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import {
  ButtonComponent,
  PageHeaderComponent,
  SelectComponent,
  SwitchComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { GraphCardHeaderComponent } from '../../patrones/graficos/evolucion-patrimonial/graph-card-header.component';
import {
  EvolucionBarChartComponent,
  type Vista,
  type Escenario,
  type Detalle,
} from '../../patrones/graficos/evolucion-patrimonial/evolucion-bar-chart.component';
import {
  ProductIdentityBarComponent,
  type IdentityBreadcrumbStep,
} from '../../../components/product-identity-bar';
import { bridgeDesignReviewVersion } from '../shared/design-review-bridge';
import { PlannerSidebarComponent } from '../shared/planner-sidebar.component';
import { PlannerTopBarComponent } from '../shared/planner-top-bar.component';
import { VersionToggleComponent, type VersionOption } from '../shared/version-toggle.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';

type LayoutVersion = 'v1' | 'v2' | 'v3';

/**
 * Propuesta — Evolución Patrimonial.
 *
 * Composición completa de la página del Wealth Planner: top bar con el contexto
 * de simulación, barra lateral con la navegación real del producto, cabecera de
 * página y el gráfico de Evolución Patrimonial (todas las piezas ya validadas
 * como patrones).
 */
@Component({
  selector: 'site-evolucion-patrimonial-proposal-page',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    ButtonComponent,
    PageHeaderComponent,
    SelectComponent,
    SwitchComponent,
    GraphCardHeaderComponent,
    EvolucionBarChartComponent,
    PlannerSidebarComponent,
    PlannerTopBarComponent,
    ProductIdentityBarComponent,
    VersionToggleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './evolucion-patrimonial-proposal.page.html',
  styleUrls: ['./evolucion-patrimonial-proposal.page.scss'],
})
export class EvolucionPatrimonialProposalPage {
  readonly store = inject(WealthPlannerStore);

  readonly identityBreadcrumb = computed<IdentityBreadcrumbStep[]>(() => [
    { label: 'Clientes', route: '/clientes' },
    { label: this.store.cliente().alias || 'Cliente', route: '/listado-planificaciones' },
  ]);

  readonly vista = signal<Vista>('actual');
  readonly escenario = signal<Escenario>('medio');
  readonly detalle = signal<Detalle>('agregada');

  constructor() {
    bridgeDesignReviewVersion(this.version as unknown as WritableSignal<string>);
  }

  /** Page-level layout version. V1 = filtros arriba (current),
   *  V2 = filtros a la derecha del header, V3 = filtros debajo del gráfico.
   *  Variants are kept side-by-side so seniors can compare across reviews —
   *  delete losers only after a winner is named. */
  readonly version = signal<LayoutVersion>('v1');
  readonly versions: VersionOption[] = [
    { key: 'v1', label: 'Versión 1' },
    { key: 'v2', label: 'Versión 2' },
    { key: 'v3', label: 'Versión 3' },
  ];

  readonly ajustesOpen = signal(false);
  readonly ajusteObjetivos = signal(false);
  readonly ajusteInmobiliario = signal(true);
  readonly ajusteHitos = signal(false);
  readonly accesibilidadOpen = signal(false);

  /** The chart only shades when the active vista has a probability band
   *  to render — currently 'comparada' or escenario === 'todos'. The legend
   *  follows the same rule so it's only visible when there's something to
   *  explain. */
  readonly showScenarioLegend = computed(
    () => this.vista() === 'comparada' || this.escenario() === 'todos',
  );

  private readonly escenarioFactor: Record<Escenario, number> = {
    medio: 1.0,
    optimista: 1.15,
    pesimista: 0.85,
    todos: 1.0,
  };

  private formatEuro(v: number): string {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2).replace('.', ',')} M €`;
    return `${Math.round(v).toLocaleString('es-ES')} €`;
  }

  readonly headline = computed(() => {
    const v = this.vista();
    const f = this.escenarioFactor[this.escenario()];
    if (v === 'comparada') return `Simulada +${this.formatEuro(170_000 * f)} vs Actual`;
    if (v === 'simulada') return `${this.formatEuro(1_400_000 * f)}  a los 64 años`;
    return `${this.formatEuro(1_280_000 * f)}  a los 63 años`;
  });

  readonly comparison = computed(() => {
    const v = this.vista();
    const f = this.escenarioFactor[this.escenario()];
    if (v === 'comparada') return 'Al final del plan, a los 90 años';
    if (v === 'simulada') return `Cae a ${this.formatEuro(520_000 * f)} a los 90`;
    return `Cae a ${this.formatEuro(350_000 * f)} a los 90`;
  });

  readonly tag = computed<string | undefined>(() => {
    if (this.escenario() !== 'medio') return undefined;
    if (this.detalle() !== 'agregada') return undefined;
    if (this.vista() === 'actual') return 'Retiro esperado';
    if (this.vista() === 'simulada') return 'Jubilación simulada';
    return undefined;
  });

  readonly tooltipText = computed(() => {
    if (this.vista() === 'comparada')
      return 'Diferencia calculada al último año del plan. El signo indica qué escenario acaba más alto.';
    if (this.detalle() === 'activo')
      return 'Patrimonio desglosado por tipo de activo. Puedes ocultar categorías haciendo clic en la leyenda.';
    if (this.detalle() === 'objetivo')
      return 'Trayectoria con los hitos vitales planificados superpuestos (retiro, jubilación, emancipación).';
    if (this.escenario() === 'todos')
      return 'Tres escenarios superpuestos para comparar su impacto.';
    return 'Pico calculado al año de máximo patrimonio neto; caída estimada al fin del plan.';
  });

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

  readonly vistaOptions: SelectOption[] = [
    { value: 'actual', label: 'Situación actual' },
    { value: 'simulada', label: 'Situación simulada' },
    { value: 'comparada', label: 'Comparada' },
  ];

  readonly escenarioOptions: SelectOption[] = [
    { value: 'medio', label: 'Escenario medio' },
    { value: 'optimista', label: 'Escenario optimista' },
    { value: 'pesimista', label: 'Escenario pesimista' },
    { value: 'todos', label: 'Todos los escenarios' },
  ];

  readonly detalleOptions: SelectOption[] = [
    { value: 'agregada', label: 'Agregada' },
    { value: 'activo', label: 'Por tipo de activo' },
    { value: 'objetivo', label: 'Por tipo de objetivo' },
  ];

  setVista(v: string | number | null): void {
    if (v === 'actual' || v === 'simulada' || v === 'comparada') this.vista.set(v);
  }
  setEscenario(v: string | number | null): void {
    if (v === 'medio' || v === 'optimista' || v === 'pesimista' || v === 'todos')
      this.escenario.set(v);
  }
  setDetalle(v: string | number | null): void {
    if (v === 'agregada' || v === 'activo' || v === 'objetivo') this.detalle.set(v);
  }
  setVersion(v: string): void {
    if (v === 'v1' || v === 'v2' || v === 'v3') this.version.set(v);
  }
}
