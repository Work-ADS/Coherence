import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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
import { PlannerSidebarComponent } from '../shared/planner-sidebar.component';
import { PlannerTopBarComponent } from '../shared/planner-top-bar.component';
import { VersionToggleComponent, type VersionOption } from '../shared/version-toggle.component';

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
    VersionToggleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-screen flex bg-canvas-base overflow-hidden">
      <site-planner-sidebar activeKey="evolucion-comparada" />

      <!-- Main column: top bar + content (top bar no longer spans the sidebar) -->
      <div class="flex-1 flex flex-col min-w-0">
        <site-planner-top-bar
          decisionesRoute="/novedades/evolucion-patrimonial-decisiones"
          clientName="Ricard Vazquez Fajardo"
        />

        <!-- Main content -->
        <main class="flex-1 min-w-0 overflow-y-auto">
          <div class="max-w-[1180px] mx-auto py-space-8">
            <!-- Page header (specific version for Evolución patrimonial — title + subtitle consistent with product pages) -->
            <afi-page-header
              title="Evolución comparada"
              subtitle="Visualiza cómo evoluciona tu patrimonio año a año y compara escenarios. Elige una vista para cambiar qué contrastas, y afina los filtros para el desglose que te interesa."
              [sticky]="false"
              [scrollFade]="false"
            >
              <span slot="breadcrumb" class="uppercase tracking-wider text-action-700"
                >CONCLUSIONES</span
              >
            </afi-page-header>

            <!-- Graph body — three layout versions kept side by side via the
                 top-right Versión toggle so seniors can compare across reviews.
                 All three versions share the SAME control bar (selects + ajustes
                 popup + accesibilidad). The only difference is where the bar
                 sits relative to the header and the chart. -->
            <div class="mt-space-8 px-space-8">
              <!-- Top-right versions toggle — page-level layout switcher. -->
              <div class="flex items-center justify-end mb-space-3">
                <site-version-toggle
                  [versions]="versions"
                  [value]="version()"
                  ariaLabel="Versión del layout del gráfico"
                  (valueChange)="setVersion($event)"
                />
              </div>

              @switch (version()) {
                <!-- ============== V1: control bar arriba (original) ============== -->
                @case ('v1') {
                  <afi-graph-card-header
                    label="Evolución patrimonial"
                    [headline]="headline()"
                    [tag]="tag()"
                    [comparison]="comparison()"
                    [tooltip]="tooltipText()"
                  />

                  <div class="mt-space-6">
                    <ng-container *ngTemplateOutlet="controlBar; context: { compact: false }" />
                  </div>

                  <div class="mt-space-4">
                    <ng-container *ngTemplateOutlet="chart" />
                  </div>
                }

                <!-- ============== V2: control bar inline con la cabecera ============== -->
                @case ('v2') {
                  <div class="flex items-end justify-between gap-space-4 flex-wrap">
                    <afi-graph-card-header
                      label="Evolución patrimonial"
                      [headline]="headline()"
                      [tag]="tag()"
                      [comparison]="comparison()"
                      [tooltip]="tooltipText()"
                    />
                    <ng-container *ngTemplateOutlet="controlBar; context: { compact: true }" />
                  </div>

                  <div class="mt-space-6">
                    <ng-container *ngTemplateOutlet="chart" />
                  </div>
                }

                <!-- ============== V3: control bar debajo del gráfico ============== -->
                @case ('v3') {
                  <afi-graph-card-header
                    label="Evolución patrimonial"
                    [headline]="headline()"
                    [tag]="tag()"
                    [comparison]="comparison()"
                    [tooltip]="tooltipText()"
                  />

                  <div class="mt-space-6">
                    <ng-container *ngTemplateOutlet="chart" />
                  </div>

                  <div class="mt-space-4 pt-space-3 border-t border-border-hairline">
                    <ng-container *ngTemplateOutlet="controlBar; context: { compact: false }" />
                  </div>
                }
              }

              <!-- Scenario shading legend — only when shading is on (comparada / todos) -->
              @if (showScenarioLegend()) {
                <p class="mt-space-3 text-body-sm text-neutral-500 flex items-start gap-space-2">
                  <svg
                    class="w-4 h-4 mt-[2px] text-neutral-400 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  <span
                    >El área sombreada representa el rango ±15 % (probable) y ±30 % (posible) en
                    torno al escenario seleccionado.</span
                  >
                </p>
              }

              <!-- Explainer -->
              <p
                class="mt-space-6 text-body-sm text-neutral-500 border-t border-border-hairline pt-space-4 leading-relaxed max-w-[720px]"
              >
                {{ viewExplainer() }}
              </p>
            </div>

            <!-- ============== Shared control bar ============== -->
            <ng-template #controlBar let-compact="compact">
              <div class="flex items-center gap-space-2 flex-wrap" [class.justify-end]="compact">
                @if (!compact) {
                  <div class="flex items-center gap-space-2">
                    <afi-select
                      class="block w-[190px]"
                      size="sm"
                      [options]="vistaOptions"
                      [value]="vista()"
                      (valueChange)="setVista($event)"
                      ariaLabel="Vista"
                    />
                    <afi-select
                      class="block w-[210px]"
                      size="sm"
                      [options]="escenarioOptions"
                      [value]="escenario()"
                      (valueChange)="setEscenario($event)"
                      ariaLabel="Escenario"
                    />
                    <afi-select
                      class="block w-[210px]"
                      size="sm"
                      [options]="detalleOptions"
                      [value]="detalle()"
                      (valueChange)="setDetalle($event)"
                      ariaLabel="Detalle"
                    />
                  </div>
                  <div class="ml-auto flex items-center gap-space-2">
                    <ng-container *ngTemplateOutlet="ajustesButton" />
                    <ng-container *ngTemplateOutlet="accesibilidadButton" />
                  </div>
                } @else {
                  <afi-select
                    class="block w-[170px]"
                    size="sm"
                    [options]="vistaOptions"
                    [value]="vista()"
                    (valueChange)="setVista($event)"
                    ariaLabel="Vista"
                  />
                  <afi-select
                    class="block w-[190px]"
                    size="sm"
                    [options]="escenarioOptions"
                    [value]="escenario()"
                    (valueChange)="setEscenario($event)"
                    ariaLabel="Escenario"
                  />
                  <afi-select
                    class="block w-[170px]"
                    size="sm"
                    [options]="detalleOptions"
                    [value]="detalle()"
                    (valueChange)="setDetalle($event)"
                    ariaLabel="Detalle"
                  />
                  <ng-container *ngTemplateOutlet="ajustesButton; context: { iconOnly: true }" />
                  <ng-container
                    *ngTemplateOutlet="accesibilidadButton; context: { iconOnly: true }"
                  />
                }
              </div>
            </ng-template>

            <!-- Reusable chart template — palette is bound to the active
                 version so each layout option also gets its own color treatment. -->
            <ng-template #chart>
              <afi-evolucion-bar-chart
                [vista]="vista()"
                [escenario]="escenario()"
                [detalle]="detalle()"
                [mostrarHitos]="ajusteHitos()"
                [incluirInmobiliario]="ajusteInmobiliario()"
                [mostrarObjetivos]="ajusteObjetivos()"
                [palette]="version()"
              />
            </ng-template>

            <!-- Reusable Ajustes button — opens a popup with three switches.
                 In compact mode (V2 inline header), renders icon-only to fit. -->
            <ng-template #ajustesButton let-iconOnly="iconOnly">
              <div class="relative">
                @if (iconOnly) {
                  <button
                    type="button"
                    (click)="ajustesOpen.set(!ajustesOpen())"
                    class="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-surface-muted text-neutral-600 hover:text-canvas-fg transition-colors"
                    aria-label="Ajustes del gráfico"
                    aria-haspopup="dialog"
                    [attr.aria-expanded]="ajustesOpen()"
                  >
                    <svg
                      class="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      aria-hidden="true"
                    >
                      <line x1="3" y1="6" x2="9" y2="6" />
                      <line x1="13" y1="6" x2="17" y2="6" />
                      <circle cx="11" cy="6" r="1.75" fill="currentColor" stroke="none" />
                      <line x1="3" y1="14" x2="7" y2="14" />
                      <line x1="11" y1="14" x2="17" y2="14" />
                      <circle cx="9" cy="14" r="1.75" fill="currentColor" stroke="none" />
                    </svg>
                  </button>
                } @else {
                  <afi-button variant="ghost" size="sm" (clicked)="ajustesOpen.set(!ajustesOpen())">
                    <svg
                      slot="iconStart"
                      class="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      aria-hidden="true"
                    >
                      <line x1="3" y1="6" x2="9" y2="6" />
                      <line x1="13" y1="6" x2="17" y2="6" />
                      <circle cx="11" cy="6" r="1.75" fill="currentColor" stroke="none" />
                      <line x1="3" y1="14" x2="7" y2="14" />
                      <line x1="11" y1="14" x2="17" y2="14" />
                      <circle cx="9" cy="14" r="1.75" fill="currentColor" stroke="none" />
                    </svg>
                    Ajustes
                  </afi-button>
                }
                @if (ajustesOpen()) {
                  <div
                    class="fixed inset-0 z-40"
                    (click)="ajustesOpen.set(false)"
                    aria-hidden="true"
                  ></div>
                  <div
                    role="dialog"
                    aria-label="Ajustes del gráfico"
                    class="absolute right-0 top-full mt-1 z-50 w-[320px] p-space-4 bg-surface-elevated border border-border-hairline rounded-lg shadow-lg"
                  >
                    <p class="text-body-md font-medium text-canvas-fg mb-space-3">Ajustes</p>
                    <div class="flex flex-col gap-space-3">
                      <afi-switch
                        label="Mostrar objetivos"
                        [checked]="ajusteObjetivos()"
                        (checkedChange)="ajusteObjetivos.set($event)"
                      />
                      <afi-switch
                        label="Incluir patrimonio inmobiliario"
                        [checked]="ajusteInmobiliario()"
                        (checkedChange)="ajusteInmobiliario.set($event)"
                      />
                      <afi-switch
                        label="Mostrar hitos vitales"
                        [checked]="ajusteHitos()"
                        (checkedChange)="ajusteHitos.set($event)"
                      />
                    </div>
                  </div>
                }
              </div>
            </ng-template>

            <!-- Reusable accesibilidad button -->
            <ng-template #accesibilidadButton let-iconOnly="iconOnly">
              <div class="relative">
                @if (iconOnly) {
                  <button
                    type="button"
                    (click)="accesibilidadOpen.set(!accesibilidadOpen())"
                    class="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-surface-muted text-neutral-600 hover:text-canvas-fg transition-colors"
                    aria-label="Accesibilidad"
                    aria-haspopup="menu"
                    [attr.aria-expanded]="accesibilidadOpen()"
                  >
                    <svg
                      class="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.75"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v8" />
                      <path d="M9 12h6" />
                    </svg>
                  </button>
                } @else {
                  <afi-button
                    variant="ghost"
                    size="sm"
                    (clicked)="accesibilidadOpen.set(!accesibilidadOpen())"
                  >
                    Accesibilidad
                  </afi-button>
                }
                @if (accesibilidadOpen()) {
                  <div
                    class="fixed inset-0 z-40"
                    (click)="accesibilidadOpen.set(false)"
                    aria-hidden="true"
                  ></div>
                  <div
                    role="menu"
                    aria-label="Opciones de accesibilidad"
                    class="absolute right-0 top-full mt-1 z-50 w-[280px] p-space-2 bg-surface-elevated border border-border-hairline rounded-md shadow-lg"
                  >
                    <p
                      class="px-space-2 pt-space-1 pb-space-2 text-caption uppercase tracking-wider text-neutral-500"
                    >
                      Accesibilidad
                    </p>
                    <button
                      type="button"
                      role="menuitem"
                      class="w-full flex items-center gap-space-2 text-left px-space-2 py-space-2 rounded hover:bg-surface-muted text-body-sm text-canvas-fg"
                    >
                      <svg
                        class="w-4 h-4 text-neutral-500 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                      Ver tabla de datos
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      class="w-full flex items-center gap-space-2 text-left px-space-2 py-space-2 rounded hover:bg-surface-muted text-body-sm text-canvas-fg"
                    >
                      <svg
                        class="w-4 h-4 text-neutral-500 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                      Descargar CSV
                    </button>
                    <div class="h-px bg-border-hairline my-space-1 -mx-space-2"></div>
                    <button
                      type="button"
                      role="menuitem"
                      class="w-full flex items-center gap-space-2 text-left px-space-2 py-space-2 rounded hover:bg-surface-muted text-body-sm text-canvas-fg"
                    >
                      <svg
                        class="w-4 h-4 text-neutral-500 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M15.5 8a5.5 5.5 0 0 0-7 0" />
                        <path d="m15.5 16-7 0" />
                      </svg>
                      Alto contraste
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      class="w-full flex items-center gap-space-2 text-left px-space-2 py-space-2 rounded hover:bg-surface-muted text-body-sm text-canvas-fg"
                    >
                      <svg
                        class="w-4 h-4 text-neutral-500 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                        <line x1="9" x2="9.01" y1="9" y2="9" />
                        <line x1="15" x2="15.01" y1="9" y2="9" />
                      </svg>
                      Lectura fácil
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      class="w-full flex items-center gap-space-2 text-left px-space-2 py-space-2 rounded hover:bg-surface-muted text-body-sm text-canvas-fg"
                    >
                      <svg
                        class="w-4 h-4 text-neutral-500 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                        <circle cx="17" cy="7" r="5" />
                      </svg>
                      Describir gráfico
                    </button>
                  </div>
                }
              </div>
            </ng-template>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class EvolucionPatrimonialProposalPage {
  readonly vista = signal<Vista>('actual');
  readonly escenario = signal<Escenario>('medio');
  readonly detalle = signal<Detalle>('agregada');

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
