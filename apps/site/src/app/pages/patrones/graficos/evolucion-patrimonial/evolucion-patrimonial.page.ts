import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';

import {
  ButtonComponent,
  PageHeaderComponent,
  SelectComponent,
  SwitchComponent,
  TabsComponent,
  TabComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { GraphCardHeaderComponent } from './graph-card-header.component';
import {
  EvolucionBarChartComponent,
  type Vista,
  type Escenario,
  type Detalle,
} from './evolucion-bar-chart.component';

/**
 * Evolución patrimonial — V3 pattern showcase.
 *
 * Two tabs:
 *   - Ejemplo: the full assembled graph (header + filters + bars + legend),
 *     built incrementally. Parts not yet designed render as labeled stubs.
 *   - Decisiones: one card per design decision (Cabecera, Filtros, Barras,
 *     Leyenda, Hover, Barra lateral). Each card shows snippet + rationale +
 *     inspiration reference.
 */
@Component({
  selector: 'site-evolucion-patrimonial-page',
  standalone: true,
  imports: [
    TabsComponent,
    TabComponent,
    SelectComponent,
    SwitchComponent,
    ButtonComponent,
    PageHeaderComponent,
    GraphCardHeaderComponent,
    EvolucionBarChartComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[1080px] mx-auto py-space-10">
      <!-- Page header (DS primitive). Kicker lives in the breadcrumb slot so it
           aligns with title + subtitle via the page-header's own px-space-8. -->
      <afi-page-header
        title="Evolución patrimonial — V3"
        subtitle="El gráfico más complejo del producto — tres vistas, dos escenarios, tres niveles de detalle. Esta página documenta la iteración V3: cabecera flotante, filtros por zonas, barras monocromáticas y leyenda reposicionada. Cada decisión se registra en la pestaña Decisiones."
        [sticky]="false"
        [scrollFade]="false"
      >
        <span slot="breadcrumb" class="uppercase tracking-wider text-action-700">
          PATRONES / GRÁFICOS
        </span>
      </afi-page-header>

      <div class="mt-space-6 px-space-8">
        <afi-tabs [lazy]="true" ariaLabel="Vistas de la pestaña Evolución patrimonial V3">
          <!-- ==================== EJEMPLO ==================== -->
          <afi-tab label="Ejemplo">
            <div class="py-space-6 flex flex-col gap-space-6">
              <div class="rounded-md">
                <!-- Header (reactive to Vista) — hover readout lives inline in
                   the chart's top-right legend row (see below) for now;
                   moving it to the header right side broke in CD propagation. -->
                <afi-graph-card-header
                  label="Evolución patrimonial"
                  [headline]="headline()"
                  [tag]="tag()"
                  [comparison]="comparison()"
                  [tooltip]="tooltip()"
                />

                <!-- Filter row — 3 zones (Monarch-style) -->
                <div class="mt-space-6 flex items-center gap-space-4 py-space-2">
                  <!-- Zone 1: filter-selects (no visible label; value is the label) -->
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
                      [options]="escenarioOptions()"
                      [value]="escenario()"
                      (valueChange)="setEscenario($event)"
                      ariaLabel="Escenario"
                    />
                    <afi-select
                      class="block w-[210px]"
                      size="sm"
                      [options]="detalleOptions()"
                      [value]="detalle()"
                      (valueChange)="setDetalle($event)"
                      ariaLabel="Detalle"
                    />
                  </div>

                  <!-- Zone 3: actions (right-aligned). Zone 2 appears when we introduce a real view-toggle. -->
                  <div class="ml-auto flex items-center gap-space-2">
                    <div class="h-5 w-px bg-border-hairline"></div>

                    <!-- Ajustes dropdown — toggles for page-level graph settings (Figma 315:19221) -->
                    <div class="relative">
                      <afi-button
                        variant="ghost"
                        size="sm"
                        iconStart="sliders"
                        (clicked)="ajustesOpen.set(!ajustesOpen())"
                      >
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
                          <div class="flex items-center gap-space-2 mb-space-4">
                            <svg
                              class="w-4 h-4 text-canvas-fg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                d="M3 6a1 1 0 011-1h8a3 3 0 016 0h0a1 1 0 110 2h0a3 3 0 01-6 0H4a1 1 0 01-1-1zM3 14a1 1 0 011-1h0a3 3 0 016 0h6a1 1 0 110 2h-6a3 3 0 01-6 0H4a1 1 0 01-1-1z"
                              />
                            </svg>
                            <h3 class="text-body-md font-medium text-canvas-fg">Ajustes</h3>
                          </div>
                          <div class="flex flex-col gap-space-3">
                            <afi-switch
                              label="Mostrar objetivos"
                              [checked]="ajusteMostrarObjetivos()"
                              (checkedChange)="ajusteMostrarObjetivos.set($event)"
                            />
                            <div class="flex items-center gap-space-2">
                              <afi-switch
                                label="Incluir patrimonio inmobiliario"
                                [checked]="ajusteIncluirInmobiliario()"
                                (checkedChange)="ajusteIncluirInmobiliario.set($event)"
                              />
                              <svg
                                class="w-3.5 h-3.5 text-neutral-400 shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 100-2 1 1 0 000 2zm-1 2a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </div>
                            <afi-switch
                              label="Mostrar hitos vitales"
                              [checked]="ajusteMostrarHitos()"
                              (checkedChange)="ajusteMostrarHitos.set($event)"
                            />
                          </div>
                        </div>
                      }
                    </div>

                    <!-- Accesibilidad dropdown — descarga + tabla + opciones A11y (antiguo botón tres-puntos) -->
                    <div class="relative">
                      <afi-button
                        variant="ghost"
                        size="sm"
                        (clicked)="actionsMenuOpen.set(!actionsMenuOpen())"
                      >
                        Accesibilidad
                      </afi-button>

                      @if (actionsMenuOpen()) {
                        <div
                          class="fixed inset-0 z-40"
                          (click)="actionsMenuOpen.set(false)"
                          aria-hidden="true"
                        ></div>
                        <div
                          role="menu"
                          aria-label="Acciones del gráfico"
                          class="absolute right-0 top-full mt-1 z-50 min-w-[240px] py-1 bg-surface-elevated border border-border-hairline rounded-lg shadow-lg"
                        >
                          <button
                            type="button"
                            role="menuitem"
                            class="flex items-center gap-space-2 w-full px-space-3 py-space-2 text-left text-body-sm text-canvas-fg hover:bg-surface-100"
                            (click)="actionsMenuOpen.set(false)"
                          >
                            <svg
                              class="w-4 h-4 text-neutral-500 shrink-0"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                d="M10 2a1 1 0 011 1v8.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 11.586V3a1 1 0 011-1zM4 17a1 1 0 100 2h12a1 1 0 100-2H4z"
                              />
                            </svg>
                            Descargar CSV
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            class="flex items-center gap-space-2 w-full px-space-3 py-space-2 text-left text-body-sm text-canvas-fg hover:bg-surface-100"
                            (click)="actionsMenuOpen.set(false)"
                          >
                            <svg
                              class="w-4 h-4 text-neutral-500 shrink-0"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2H3V4zm0 4h14v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm3 2a1 1 0 100 2h8a1 1 0 100-2H6zm0 4a1 1 0 100 2h4a1 1 0 100-2H6z"
                                clip-rule="evenodd"
                              />
                            </svg>
                            Ver tabla de datos
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            class="flex items-center gap-space-2 w-full px-space-3 py-space-2 text-left text-body-sm text-canvas-fg hover:bg-surface-100"
                            (click)="actionsMenuOpen.set(false)"
                          >
                            <svg
                              class="w-4 h-4 text-neutral-500 shrink-0"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                d="M10 2a2 2 0 100 4 2 2 0 000-4zM5.5 6.5a.75.75 0 01.85-.74L10 6.3l3.65-.54a.75.75 0 11.22 1.48l-3.12.46V10l1.96 4.9a.75.75 0 11-1.4.56L10 11.9l-1.31 3.56a.75.75 0 11-1.4-.56L9.25 10V7.7l-3.12-.46a.75.75 0 01-.63-.74z"
                              />
                            </svg>
                            Opciones de accesibilidad
                          </button>
                        </div>
                      }
                    </div>
                  </div>
                </div>

                <!-- Chart body — monochromatic bars, reactive to Vista, with ghost-ceiling on hover -->
                <div class="mt-space-4">
                  <afi-evolucion-bar-chart
                    [vista]="vista()"
                    [escenario]="escenario()"
                    [detalle]="detalle()"
                    [mostrarHitos]="ajusteMostrarHitos()"
                    [incluirInmobiliario]="ajusteIncluirInmobiliario()"
                  />
                </div>
              </div>

              <!-- Plain-language explainer below the chart — describes what the current view shows -->
              <p
                class="text-body-sm text-neutral-500 border-t border-border-hairline pt-space-4 leading-relaxed max-w-[720px]"
              >
                {{ viewExplainer() }}
              </p>
            </div>
          </afi-tab>

          <!-- ==================== DECISIONES ==================== -->
          <afi-tab label="Decisiones">
            <div class="py-space-6 flex flex-col gap-space-8">
              <!-- Cabecera -->
              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center justify-between mb-space-3">
                  <div class="flex items-center gap-space-2">
                    <span class="text-caption uppercase tracking-wider text-system-success"
                      >Decidido</span
                    >
                    <h2 class="text-section text-canvas-fg">Cabecera</h2>
                  </div>
                  <span class="text-caption text-neutral-400">Referencia: Midday</span>
                </header>

                <div class="mb-space-4 max-w-[640px] space-y-space-3">
                  <p class="text-body-md text-neutral-600">
                    <strong class="text-canvas-fg">Por qué.</strong> Estos gráficos llevan mucha
                    información encima — barras apiladas, dos ejes, ramas de activos — y el usuario
                    necesita llegar a una conclusión lo antes posible. El título de página ya dice
                    <em>dónde está</em>; la cabecera del gráfico tiene que decir
                    <em>qué importa</em>. Por eso el valor titular es el takeaway del gráfico, no el
                    nombre del gráfico.
                  </p>
                  <p class="text-body-md text-neutral-600">
                    <strong class="text-canvas-fg">Por qué plantilla.</strong> El takeaway cambia
                    por vista y por gráfico. En vez de escribir copy a mano por pantalla, cada vista
                    expone una plantilla con huecos; los datos rellenan los huecos. Un cambio de
                    plantilla se refleja en todas las planificaciones, todas las vistas.
                  </p>
                  <p class="text-body-md text-neutral-600">
                    <strong class="text-canvas-fg">Por qué sin tarjeta.</strong> La caja con borde
                    se sentía anticuada junto al Roboto Serif — más editorial, menos dashboard.
                    Flotar deja respirar el tipo, refuerza el carácter de marca y reduce cromo.
                  </p>
                  <p class="text-body-md text-neutral-600">
                    <strong class="text-canvas-fg">Cómo.</strong> Tres niveles en orden de lectura:
                    etiqueta pequeña (categoría) → valor titular (la conclusión) → línea de
                    comparación con tooltip (cómo se ha calculado). Los ejemplos de abajo son para
                    esta persona concreta; cambian con cada cliente y cada vista.
                  </p>
                </div>

                <p class="text-caption text-neutral-500 mb-space-3">
                  Persona de ejemplo: <strong class="text-canvas-fg">Luis García</strong>, 55 años,
                  Director de zona en Santander. Patrimonio actual ≈ 1.000.000 € (vivienda habitual,
                  planes de pensiones, cartera de fondos, 2ª vivienda en la costa). Plan 55 → 90.
                </p>

                <!-- Side-by-side snippets: Actual + Comparada -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4 mb-space-4">
                  <div class="bg-surface-quiet rounded-md p-space-6">
                    <p class="text-caption uppercase tracking-wider text-action-700 mb-space-3">
                      Vista · Situación actual
                    </p>
                    <afi-graph-card-header
                      label="Evolución patrimonial"
                      headline="1.280.000 €  a los 63 años"
                      tag="Retiro esperado"
                      comparison="Cae a 350.000 € a los 90"
                      tooltip="Pico calculado al año de máximo patrimonio neto; caída estimada al fin del plan."
                    />
                  </div>

                  <div class="bg-surface-quiet rounded-md p-space-6">
                    <p class="text-caption uppercase tracking-wider text-action-700 mb-space-3">
                      Vista · Comparada
                    </p>
                    <afi-graph-card-header
                      label="Evolución patrimonial"
                      headline="Simulada +170.000 € vs Actual"
                      comparison="Al final del plan, a los 90 años"
                      tooltip="Diferencia calculada al último año del plan. El signo indica qué escenario acaba más alto."
                    />
                  </div>
                </div>

                <!-- Templates stacked -->
                <div class="space-y-space-4">
                  <div>
                    <p class="text-body-sm text-neutral-600 mb-space-2">
                      Plantilla — Situación actual
                    </p>
                    <pre
                      class="text-caption bg-surface-quiet rounded p-space-3 text-neutral-600 overflow-x-auto leading-relaxed"
                    ><code>label      = "Evolución patrimonial"            (constante)
headline   = "&#123;peakValue&#125; a los &#123;peakAge&#125; años"
comparison = "Cae a &#123;endValue&#125; a los &#123;endAge&#125;"</code></pre>
                  </div>
                  <div>
                    <p class="text-body-sm text-neutral-600 mb-space-2">Plantilla — Comparada</p>
                    <pre
                      class="text-caption bg-surface-quiet rounded p-space-3 text-neutral-600 overflow-x-auto leading-relaxed"
                    ><code>label      = "Evolución patrimonial"            (constante)
headline   = "Simulada &#123;signedDelta&#125; vs Actual"
comparison = "Al final del plan, a los &#123;endAge&#125; años"</code></pre>
                    <p class="text-caption text-neutral-500 mt-space-2">
                      Situación simulada reutiliza la plantilla de Actual con datos simulados.
                    </p>
                  </div>
                </div>
              </article>

              <!-- Filtros -->
              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center justify-between mb-space-3">
                  <div class="flex items-center gap-space-2">
                    <span class="text-caption uppercase tracking-wider text-system-success"
                      >Decidido</span
                    >
                    <h2 class="text-section text-canvas-fg">Fila de filtros</h2>
                  </div>
                  <span class="text-caption text-neutral-400">Referencia: Monarch (Mobbin)</span>
                </header>

                <p class="text-body-md text-neutral-600 mb-space-4 max-w-[640px]">
                  Una sola línea horizontal, sin etiquetas visibles, separada en tres zonas por
                  divisores finos. El valor seleccionado actúa como etiqueta del select — elimina
                  redundancia y recorta el alto de la fila.
                </p>

                <!-- Snippet: filter row in isolation -->
                <div class="bg-surface-quiet rounded-md p-space-4 mb-space-4">
                  <div class="flex items-center gap-space-4 py-space-1">
                    <div class="flex items-center gap-space-2">
                      <afi-select
                        size="sm"
                        [options]="vistaOptions"
                        [value]="vista()"
                        (valueChange)="setVista($event)"
                        ariaLabel="Vista (snippet)"
                      />
                      <afi-select
                        size="sm"
                        [options]="escenarioOptions()"
                        [value]="escenario()"
                        (valueChange)="setEscenario($event)"
                        ariaLabel="Escenario (snippet)"
                      />
                      <afi-select
                        size="sm"
                        [options]="detalleOptions()"
                        [value]="detalle()"
                        (valueChange)="setDetalle($event)"
                        ariaLabel="Detalle (snippet)"
                      />
                    </div>
                    <div class="ml-auto flex items-center gap-space-2">
                      <div class="h-5 w-px bg-border-hairline"></div>
                      <button
                        type="button"
                        class="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-surface-100 text-neutral-500 transition-colors duration-fast"
                        aria-label="Descargar"
                      >
                        <svg
                          class="w-4 h-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            d="M10 2a1 1 0 011 1v8.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 11.586V3a1 1 0 011-1zM4 17a1 1 0 100 2h12a1 1 0 100-2H4z"
                          />
                        </svg>
                      </button>
                      <afi-button variant="ghost" size="sm">Ajustes</afi-button>
                    </div>
                  </div>
                </div>

                <!-- Zones breakdown -->
                <div class="grid grid-cols-3 gap-space-4 mb-space-4">
                  <div class="border border-border-hairline rounded-md p-space-4">
                    <p class="text-caption uppercase tracking-wider text-action-700 mb-space-1">
                      Zona 1
                    </p>
                    <h3 class="text-body-md font-medium text-canvas-fg mb-space-2">
                      Selectores de filtro
                    </h3>
                    <p class="text-body-sm text-neutral-600">
                      Reducen los datos. Sin etiqueta visible; el valor elegido actúa como etiqueta.
                      Aquí: Vista, Escenario, Detalle.
                    </p>
                  </div>
                  <div class="border border-border-hairline rounded-md p-space-4">
                    <p class="text-caption uppercase tracking-wider text-action-700 mb-space-1">
                      Zona 2
                    </p>
                    <h3 class="text-body-md font-medium text-canvas-fg mb-space-2">
                      Toggles de vista
                    </h3>
                    <p class="text-body-sm text-neutral-600">
                      Cambian cómo se presentan los datos (Totales ⇌ Cambio, tipo de gráfico). Vacía
                      por ahora — aparece cuando aterrizamos el cuerpo.
                    </p>
                  </div>
                  <div class="border border-border-hairline rounded-md p-space-4">
                    <p class="text-caption uppercase tracking-wider text-action-700 mb-space-1">
                      Zona 3
                    </p>
                    <h3 class="text-body-md font-medium text-canvas-fg mb-space-2">Acciones</h3>
                    <p class="text-body-sm text-neutral-600">
                      Efectos secundarios + accesibilidad: descarga, Ajustes. Siempre alineadas a la
                      derecha.
                    </p>
                  </div>
                </div>

                <p class="text-body-sm text-neutral-500">
                  <strong class="text-canvas-fg">Regla</strong>: máximo 3 controles por zona, 5
                  visibles totales. Más allá de ese umbral, el resto se mueve al panel
                  <em>Ajustes</em>. Los divisores verticales finos (<code class="font-mono"
                    >border-border-hairline</code
                  >, 1px) marcan la frontera entre zonas sin añadir cromo.
                </p>
              </article>

              <!-- Barras -->
              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center justify-between mb-space-3">
                  <div class="flex items-center gap-space-2">
                    <span class="text-caption uppercase tracking-wider text-action-700"
                      >Propuesto</span
                    >
                    <h2 class="text-section text-canvas-fg">Barras — paleta monocromática</h2>
                  </div>
                  <span class="text-caption text-neutral-400">Referencia: Origin</span>
                </header>
                <p class="text-body-md text-neutral-600 mb-space-4 max-w-[640px]">
                  Barras apiladas en una sola familia cromática —
                  <strong class="text-canvas-fg">Afi Azul</strong>, ordenadas por saturación: más
                  oscura = categoría mayor, más clara = menor. Sin rojo ni verde: el signo lo indica
                  la posición respecto al cero (positivo arriba, negativo abajo). Alternativa para
                  Comparada: Azul para una escena, neutro-gris para la otra.
                </p>
                <p class="text-body-sm text-neutral-500">
                  Grid, ejes y cero: gris neutro de muy baja saturación. La textura queda disponible
                  como capa extra de accesibilidad pero no se aplica en el estado por defecto.
                </p>
              </article>

              <!-- Leyenda -->
              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center justify-between mb-space-3">
                  <div class="flex items-center gap-space-2">
                    <span class="text-caption uppercase tracking-wider text-action-700"
                      >Propuesto</span
                    >
                    <h2 class="text-section text-canvas-fg">Leyenda — arriba a la derecha</h2>
                  </div>
                  <span class="text-caption text-neutral-400">Referencia: Midday</span>
                </header>
                <p class="text-body-md text-neutral-600 max-w-[640px]">
                  La leyenda deja de vivir debajo del gráfico. Se mueve a la esquina superior
                  derecha de la cabecera, en la misma línea que los controles (descarga, etc.).
                  Chips compactos con punto de color + etiqueta. Libera la zona inferior para los
                  datos.
                </p>
              </article>

              <!-- Hover ghost ceiling -->
              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center justify-between mb-space-3">
                  <div class="flex items-center gap-space-2">
                    <span class="text-caption uppercase tracking-wider text-action-700"
                      >Propuesto</span
                    >
                    <h2 class="text-section text-canvas-fg">Hover — techo fantasma</h2>
                  </div>
                  <span class="text-caption text-neutral-400">Referencia: Jira</span>
                </header>
                <p class="text-body-md text-neutral-600 max-w-[640px]">
                  Estado por defecto: sólo los segmentos rellenos. En hover sobre un año, aparece
                  detrás una barra fantasma gris claro a altura máxima del eje Y — permite leer "qué
                  porcentaje de la cima ocupan estos activos en este año". Transición suave, sólo
                  hover, no añade cromo al estado base.
                </p>
              </article>

              <!-- Barra lateral -->
              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center justify-between mb-space-3">
                  <div class="flex items-center gap-space-2">
                    <span class="text-caption uppercase tracking-wider text-system-success"
                      >Decidido</span
                    >
                    <h2 class="text-section text-canvas-fg">Barra lateral</h2>
                  </div>
                  <span class="text-caption text-neutral-400"
                    >Primitivo existente · ver <code class="font-mono">/preview</code></span
                  >
                </header>
                <p class="text-body-md text-neutral-600 mb-space-2 max-w-[640px]">
                  Sin nuevas variantes de color por ahora. Usamos
                  <code class="font-mono text-action-700"
                    >&lt;afi-sidebar mode="collapsible"&gt;</code
                  >
                  tal cual — ya incluye el botón de alternancia y muestra el label como tooltip al
                  colapsar.
                </p>
                <p class="text-body-sm text-neutral-500">
                  Atajo añadido para descubrir la interacción: <code class="font-mono">⌘\\</code> (o
                  <code class="font-mono">Ctrl+\\</code>) abre y cierra. Demostración en vivo en la
                  página de primitivos.
                </p>
              </article>
            </div>
          </afi-tab>
        </afi-tabs>
      </div>
    </div>
  `,
})
export class EvolucionPatrimonialPage {
  readonly vista = signal<Vista>('actual');
  readonly escenario = signal<Escenario>('medio');
  readonly detalle = signal<Detalle>('agregada');

  /** Zone 3 actions dropdown (descarga / tabla / accesibilidad). */
  readonly actionsMenuOpen = signal(false);

  /** Ajustes dropdown — toggles for graph-level page settings. */
  readonly ajustesOpen = signal(false);
  readonly ajusteMostrarObjetivos = signal(false);
  readonly ajusteIncluirInmobiliario = signal(true);
  readonly ajusteMostrarHitos = signal(true);

  // Escenario scale factors (must match chart's internal ESCENARIO_FACTOR)
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

  // --- Template-synthesized headline / comparison / tag / tooltip ---

  readonly headline = computed(() => {
    const v = this.vista();
    const f = this.escenarioFactor[this.escenario()];

    if (v === 'comparada') {
      const delta = 170_000 * f;
      return `Simulada +${this.formatEuro(delta)} vs Actual`;
    }

    if (v === 'simulada') {
      return `${this.formatEuro(1_400_000 * f)}  a los 64 años`;
    }

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
    // Show tag only for the core "life-moment" views — Vista actual/simulada
    // under the medio scenario with the Agregada detalle. Any deviation
    // (different scenario, different detalle, Comparada) hides the tag.
    if (this.escenario() !== 'medio') return undefined;
    if (this.detalle() !== 'agregada') return undefined;
    const v = this.vista();
    if (v === 'actual') return 'Retiro esperado';
    if (v === 'simulada') return 'Jubilación simulada';
    return undefined;
  });

  readonly tooltip = computed(() => {
    if (this.vista() === 'comparada') {
      return 'Diferencia calculada al último año del plan. El signo indica qué escenario acaba más alto.';
    }
    if (this.detalle() === 'activo') {
      return 'Patrimonio desglosado por tipo de activo. Puedes ocultar categorías haciendo clic en la leyenda.';
    }
    if (this.detalle() === 'objetivo') {
      return 'Trayectoria con los hitos vitales planificados superpuestos (retiro, jubilación, emancipación).';
    }
    if (this.escenario() === 'todos') {
      return 'Tres escenarios (Optimista, Medio, Pesimista) superpuestos para comparar su impacto.';
    }
    return 'Pico calculado al año de máximo patrimonio neto; caída estimada al fin del plan.';
  });

  /** Plain-language explainer of the current view — composes Vista + Detalle + Escenario into a readable sentence. */
  readonly viewExplainer = computed(() => {
    const v = this.vista();
    const e = this.escenario();
    const d = this.detalle();

    // Part 1 — what are we showing (Vista)
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

    // Part 2 — how it's sliced (Detalle) — only relevant outside Comparada
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

    // Part 3 — economic assumption (Escenario)
    let escenarioStr: string;
    switch (e) {
      case 'medio':
        escenarioStr =
          'en un escenario económico medio (crecimiento e inflación en valores normales)';
        break;
      case 'optimista':
        escenarioStr =
          'en un escenario optimista (la economía crece por encima de la media y la inflación se mantiene contenida)';
        break;
      case 'pesimista':
        escenarioStr = 'en un escenario pesimista (crisis prolongada o estancamiento económico)';
        break;
      case 'todos':
        escenarioStr =
          'bajo los tres escenarios económicos (pesimista, medio y optimista) superpuestos para ver el rango';
        break;
    }

    return `${base}${detalleStr}, ${escenarioStr}.`;
  });

  readonly vistaOptions: SelectOption[] = [
    { value: 'actual', label: 'Situación actual' },
    { value: 'simulada', label: 'Situación simulada' },
    { value: 'comparada', label: 'Comparada' },
  ];

  /** Escenario=Todos doesn't make sense with Vista=Comparada (can't overlay 2 vistas × 3 scenarios). */
  readonly escenarioOptions = computed<SelectOption[]>(() => {
    const comp = this.vista() === 'comparada';
    return [
      { value: 'medio', label: 'Escenario medio' },
      { value: 'optimista', label: 'Escenario optimista' },
      { value: 'pesimista', label: 'Escenario pesimista' },
      { value: 'todos', label: 'Todos los escenarios', disabled: comp },
    ];
  });

  /** Detalle (activo/objetivo) requires a single-series mode.
   * Disabled when Vista=Comparada or Escenario=Todos (those render as multi-line overlays).
   * "Por tipo de objetivo" also requires Ajustes > "Mostrar objetivos" ON. */
  readonly detalleOptions = computed<SelectOption[]>(() => {
    const combined = this.vista() === 'comparada' || this.escenario() === 'todos';
    return [
      { value: 'agregada', label: 'Agregada' },
      { value: 'activo', label: 'Por tipo de activo', disabled: combined },
      {
        value: 'objetivo',
        label: 'Por tipo de objetivo',
        disabled: combined || !this.ajusteMostrarObjetivos(),
      },
    ];
  });

  constructor() {
    // Reset Detalle to 'agregada' when the current choice becomes invalid.
    effect(() => {
      const combined = this.vista() === 'comparada' || this.escenario() === 'todos';
      const d = this.detalle();
      if (combined && (d === 'activo' || d === 'objetivo')) {
        this.detalle.set('agregada');
      }
      if (d === 'objetivo' && !this.ajusteMostrarObjetivos()) {
        this.detalle.set('agregada');
      }
    });
    // Reset Escenario to 'medio' when switching to Comparada (Todos becomes invalid).
    effect(() => {
      if (this.vista() === 'comparada' && this.escenario() === 'todos') {
        this.escenario.set('medio');
      }
    });
  }

  setVista(v: string | number | null): void {
    if (v === 'actual' || v === 'simulada' || v === 'comparada') {
      this.vista.set(v);
    }
  }

  setEscenario(v: string | number | null): void {
    if (v === 'medio' || v === 'optimista' || v === 'pesimista' || v === 'todos') {
      this.escenario.set(v);
    }
  }

  setDetalle(v: string | number | null): void {
    if (v === 'agregada' || v === 'activo' || v === 'objetivo') {
      this.detalle.set(v);
    }
  }
}
