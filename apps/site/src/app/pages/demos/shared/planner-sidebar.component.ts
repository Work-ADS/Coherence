import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  InlineEditComponent,
  LogoComponent,
  NavItemComponent,
  SidebarComponent,
} from '@coherence/ui';

import { MobileDrawerService } from '../../../services/mobile-drawer.service';
import { WealthPlannerStore } from '../wealth-planner-2026/store';

export type NavItemState = 'empty' | 'in-progress' | 'complete';

export type NavItem = {
  key: string;
  label: string;
  state: NavItemState;
  route?: string;
};

/**
 * Lucide icon keys used by the planner sidebar's section separators.
 * Each maps to an inline SVG in the template — kept narrow on purpose so
 * adding a new section is a deliberate choice (also add its icon).
 */
export type NavSectionIcon =
  | 'wallet'
  | 'target'
  | 'clipboard-list'
  | 'route'
  | 'flag'
  | 'file-text';

export type NavSection = {
  label: string;
  icon: NavSectionIcon;
  items: NavItem[];
  required?: boolean;
};

/**
 * Wealth Planner sidebar — Editorial style on secondary-azul.
 *
 * Section labels are all-caps non-clickable separators with a leading Lucide
 * icon (calibrated from the Figma node 458:174715). Items below render as
 * plain navigation rows. This mirrors the Editorial variant of the patterns
 * playground at /patrones/sidebar-ia-comparison.
 */
@Component({
  selector: 'site-planner-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    InlineEditComponent,
    LogoComponent,
    SidebarComponent,
    NavItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './planner-sidebar.component.html',
  styleUrls: ['./planner-sidebar.component.scss'],
})
export class PlannerSidebarComponent {
  private readonly store = inject(WealthPlannerStore);
  protected readonly drawer = inject(MobileDrawerService);

  /** Bound on the host so SCSS can flip to off-canvas mode at <768. */
  @HostBinding('class.drawer-open') get drawerOpenClass(): boolean {
    return this.drawer.open();
  }

  readonly activeKey = input<string>('');
  readonly ariaLabel = input<string>('Navegación del planificador financiero');
  readonly gestorName = input<string>('Elena Torres');
  readonly gestorRole = input<string>('Gestora');
  readonly gestorInitials = input<string>('ET');

  /**
   * Identity (client name + simulation ID) surfaced inside the drawer on
   * mobile. Hidden on desktop where the planner-top-bar already shows the
   * same identity inline. The inline-edit is wired so renaming inside the
   * drawer commits exactly like the top-bar version.
   */
  readonly clientName = input<string>('Ricardo Vázquez Pérez');
  readonly simId = input<string>('SIM-2025-0011');
  readonly simRenamed = output<string>();
  readonly expandedChange = output<boolean>();

  readonly expanded = signal(true);

  readonly sections = computed<NavSection[]>(() => [
    {
      label: 'Situación actual',
      icon: 'wallet',
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
      icon: 'target',
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
      icon: 'clipboard-list',
      items: [
        {
          key: 'patrimonio-previsto',
          label: 'Patrimonio previsto',
          state: this.store.patrimonioPrevistoState(),
          route: '/demos/wealth-planner-2026/patrimonio-previsto',
        },
        { key: 'estrategias', label: 'Estrategias', state: 'empty' },
      ],
    },
    {
      label: 'Plan de acción',
      icon: 'route',
      items: [
        { key: 'optimizacion-liquidez', label: 'Optimización de la liquidez', state: 'empty' },
        { key: 'optimizacion-asset', label: 'Optimización del asset allocation', state: 'empty' },
      ],
    },
    {
      label: 'Conclusiones',
      icon: 'flag',
      items: [
        {
          key: 'evolucion-comparada',
          label: 'Evolución comparada',
          state: 'empty',
          route: '/demos/wealth-planner-2026/evolucion-patrimonial',
        },
        {
          key: 'consecucion-objetivos',
          label: 'Consecución de objetivos',
          state: this.store.consecucionObjetivosState(),
          route: '/demos/wealth-planner-2026/consecucion-objetivos',
        },
      ],
    },
    {
      label: 'Informe',
      icon: 'file-text',
      items: [{ key: 'generador-informes', label: 'Generador de informes', state: 'empty' }],
    },
  ]);
}
