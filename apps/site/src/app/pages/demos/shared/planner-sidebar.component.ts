import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  LogoComponent,
  SidebarComponent,
  NavItemComponent,
  NavSectionComponent,
} from '@coherence/ui';

import { WealthPlannerStore } from '../wealth-planner-2026/store';

export type NavItemState = 'empty' | 'in-progress' | 'complete';

export type NavItem = {
  key: string;
  label: string;
  state: NavItemState;
  route?: string;
};

export type NavSection = {
  label: string;
  items: NavItem[];
  required?: boolean;
};

/**
 * Wealth Planner sidebar — secondary-azul variant, static mode (always expanded, no collapse).
 * Uses afi-sidebar (variant="secondary-azul", mode="static") + afi-nav-section + afi-nav-item.
 */
@Component({
  selector: 'site-planner-sidebar',
  standalone: true,
  imports: [RouterLink, LogoComponent, SidebarComponent, NavItemComponent, NavSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './planner-sidebar.component.html',
  styleUrls: ['./planner-sidebar.component.scss'],
})
export class PlannerSidebarComponent {
  private readonly store = inject(WealthPlannerStore);

  readonly activeKey = input<string>('');
  readonly ariaLabel = input<string>('Navegación del planificador financiero');
  readonly gestorName = input<string>('Elena Torres');
  readonly gestorRole = input<string>('Gestora');
  readonly gestorInitials = input<string>('ET');
  readonly expandedChange = output<boolean>();

  readonly expanded = signal(true);

  readonly sections = computed<NavSection[]>(() => [
    {
      label: 'Situación actual',
      required: true,
      items: [
        {
          key: 'familia',
          label: 'Familia',
          state: this.store.familiaState(),
          route: '/demos/wealth-planner-2026/familia',
        },
        {
          key: 'sociedades',
          label: 'Sociedades',
          state: this.store.sociedadesState(),
          route: '/demos/wealth-planner-2026/sociedades',
        },
        {
          key: 'patrimonio',
          label: 'Patrimonio',
          state: 'complete',
          route: '/demos/wealth-planner-2026/patrimonial',
        },
        {
          key: 'ingresos',
          label: 'Ingresos',
          state: this.store.ingresosState(),
          route: '/demos/wealth-planner-2026/ingresos',
        },
        {
          key: 'gastos',
          label: 'Gastos',
          state: this.store.gastosState(),
          route: '/demos/wealth-planner-2026/gastos',
        },
      ],
    },
    {
      label: 'Objetivos',
      required: true,
      items: [
        {
          key: 'legado-retiro',
          label: 'Legado y retiro',
          state: this.store.legadoRetiroState(),
          route: '/demos/wealth-planner-2026/legado-retiro',
        },
        {
          key: 'inversiones-futuras',
          label: 'Inversiones futuras',
          state: this.store.inversionesFuturasState(),
          route: '/demos/wealth-planner-2026/inversiones-futuras',
        },
        {
          key: 'desinversiones-futuras',
          label: 'Desinversiones futuras',
          state: this.store.desinversionesState(),
          route: '/demos/wealth-planner-2026/desinversiones-futuras',
        },
        {
          key: 'proteccion-familiar',
          label: 'Protección familiar',
          state: this.store.proteccionFamiliarState(),
          route: '/demos/wealth-planner-2026/proteccion-familiar',
        },
      ],
    },
    {
      label: 'Diagnóstico',
      items: [
        { key: 'patrimonio-previsto', label: 'Patrimonio previsto', state: 'empty' },
        { key: 'estrategias', label: 'Estrategias', state: 'empty' },
      ],
    },
    {
      label: 'Plan de acción',
      items: [
        { key: 'optimizacion-liquidez', label: 'Optimización de la liquidez', state: 'empty' },
        { key: 'optimizacion-asset', label: 'Optimización del asset allocation', state: 'empty' },
      ],
    },
    {
      label: 'Conclusiones',
      items: [
        {
          key: 'evolucion-comparada',
          label: 'Evolución comparada',
          state: 'empty',
          route: '/demos/wealth-planner-2026/evolucion-patrimonial',
        },
        { key: 'consecucion-objetivos', label: 'Consecución de objetivos', state: 'empty' },
      ],
    },
    {
      label: 'Informe',
      items: [{ key: 'generador-informes', label: 'Generador de informes', state: 'empty' }],
    },
  ]);
}
