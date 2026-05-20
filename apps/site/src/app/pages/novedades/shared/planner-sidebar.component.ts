import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
 * Wealth Planner sidebar — brand variant, static mode (always expanded, no collapse).
 * Uses afi-sidebar (variant="brand", mode="static") + afi-nav-section + afi-nav-item.
 */
@Component({
  selector: 'site-planner-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    LogoComponent,
    SidebarComponent,
    NavItemComponent,
    NavSectionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: contents;
    }
  `,
  template: `
    <afi-sidebar
      mode="static"
      variant="brand"
      [ariaLabel]="ariaLabel()"
    >
      <!-- Top slot: logo -->
      <div slot="top" class="flex items-center gap-space-2 w-full">
        <coherence-logo variant="monochrome" size="sm" />
        <span class="text-body-sm font-light whitespace-nowrap" style="color: var(--brand-secondary-foreground-default);">Wealth Planner</span>
      </div>

      <!-- Nav sections -->
      @for (section of sections(); track section.label) {
        <afi-nav-section
          [label]="section.label"
          [defaultExpanded]="true"
          [hideHeader]="false"
          chevronPosition="right"
          [showTreeLines]="true"
        >
          @for (item of section.items; track item.key) {
            <afi-nav-item
              [label]="item.label"
              [active]="item.key === activeKey()"
              [showIcon]="false"
              [sidebarExpanded]="true"
              [routerLink]="item.route ?? null"
            />
          }
        </afi-nav-section>
      }

      <!-- Bottom slot: gestor -->
      <div slot="bottom" class="flex items-center gap-space-2 w-full">
        <div class="w-7 h-7 rounded-full flex items-center justify-center text-body-sm font-semibold"
             style="background: var(--brand-secondary-background-hover); color: var(--brand-secondary-foreground-default);">
          {{ gestorInitials() }}
        </div>
        <div class="flex flex-col min-w-0">
          <span class="text-body-sm font-medium truncate" style="color: var(--brand-secondary-foreground-default);">{{ gestorName() }}</span>
          <span class="text-[var(--type-body-2xs, 0.625rem)] uppercase tracking-wider font-medium truncate" style="color: var(--brand-secondary-foreground-hover);">{{ gestorRole() }}</span>
        </div>
      </div>
    </afi-sidebar>
  `,
})
export class PlannerSidebarComponent {
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
        { key: 'familia', label: 'Familia', state: 'complete' },
        { key: 'sociedades', label: 'Sociedades', state: 'complete' },
        { key: 'patrimonio', label: 'Patrimonio', state: 'complete', route: '/novedades/patrimonial' },
        { key: 'ingresos', label: 'Ingresos', state: 'in-progress' },
        { key: 'gastos', label: 'Gastos', state: 'empty' },
      ],
    },
    {
      label: 'Objetivos',
      required: true,
      items: [
        { key: 'legado-retiro', label: 'Legado y retiro', state: 'in-progress' },
        { key: 'inversiones-futuras', label: 'Inversiones futuras', state: 'empty' },
        { key: 'desinversiones-futuras', label: 'Desinversiones futuras', state: 'empty' },
        { key: 'proteccion-familiar', label: 'Protección familiar', state: 'empty' },
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
        { key: 'evolucion-comparada', label: 'Evolución comparada', state: 'empty', route: '/novedades/evolucion-patrimonial' },
        { key: 'consecucion-objetivos', label: 'Consecución de objetivos', state: 'empty' },
      ],
    },
    {
      label: 'Informe',
      items: [
        { key: 'generador-informes', label: 'Generador de informes', state: 'empty' },
      ],
    },
  ]);
}
