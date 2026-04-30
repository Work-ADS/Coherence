import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ButtonComponent,
  PageHeaderComponent,
  SelectComponent,
  SwitchComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { GraphCardHeaderComponent } from '../../patrones/graficos/evolucion-patrimonial/graph-card-header.component';

/**
 * Case study for the Evolución Patrimonial proposal.
 *
 * Each decision card ends with a live "Ejemplo" snippet so the reader can
 * see the actual piece in isolation.
 */
@Component({
  selector: 'site-evolucion-patrimonial-decisiones-page',
  standalone: true,
  imports: [
    RouterLink,
    ButtonComponent,
    PageHeaderComponent,
    SelectComponent,
    SwitchComponent,
    GraphCardHeaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col bg-canvas-base">
      <!-- Top bar with breadcrumb back to proposal + landing -->
      <div
        class="flex items-center gap-space-3 border-b border-border-hairline px-space-4 h-10 bg-surface-quiet shrink-0 text-body-sm"
      >
        <a
          routerLink="/novedades"
          class="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-surface-100 text-neutral-500"
          aria-label="Volver a Novedades"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
        <span class="text-neutral-500">Novedades</span>
        <span class="text-neutral-400" aria-hidden="true">/</span>
        <a
          routerLink="/novedades/evolucion-patrimonial"
          class="text-neutral-600 hover:text-canvas-fg"
          >Evolución patrimonial</a
        >
        <span class="text-neutral-400" aria-hidden="true">/</span>
        <span class="text-canvas-fg font-medium">Decisiones</span>
      </div>

      <main class="flex-1 overflow-y-auto">
        <div class="max-w-[880px] mx-auto py-space-10">
          <afi-page-header
            title="Evolución patrimonial — decisiones"
            subtitle="Cómo compusimos el gráfico más complejo del producto: cabecera flotante, filtros por zonas, paleta monocromática, leyenda reposicionada y lectura en hover. Cada bloque explica por qué y cómo, con un ejemplo en vivo al final."
            [sticky]="false"
            [scrollFade]="false"
          >
            <span slot="breadcrumb" class="uppercase tracking-wider text-action-700"
              >CASO DE ESTUDIO</span
            >
          </afi-page-header>

          <div class="mt-space-8 px-space-8 flex flex-col gap-space-8 pb-space-10">
            <!-- Cabecera flotante -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Cabecera — valor titular antes del gráfico
                  </h2>
                </div>
                <span class="text-caption text-neutral-500">Referencia: Midday</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Por qué.</strong> Los gráficos del producto llevan
                  mucha información encima — barras apiladas, dos ejes, ramas de activos. El usuario
                  necesita una conclusión en los primeros segundos. El título de página ya dice
                  <em>dónde estás</em>; la cabecera del gráfico tiene que decir
                  <em>qué importa</em>. Por eso el valor titular (1,28 M € a los 63 años) es el
                  takeaway, no el nombre del gráfico.
                </p>
                <p>
                  <strong class="text-canvas-fg">Cómo.</strong> Tres niveles en orden de lectura:
                  etiqueta pequeña → valor titular con tag opcional para hitos vitales → línea de
                  comparación con tooltip explicativo. Sin tarjeta contenedora — la caja con borde
                  se siente anticuada junto al Roboto Serif.
                </p>
                <p>
                  <strong class="text-canvas-fg">Plantilla.</strong> Un template por Vista, no copy
                  a mano por pantalla. Actual:
                  <code class="font-mono text-caption text-action-700"
                    >&#123;peakValue&#125; a los &#123;peakAge&#125; años</code
                  >. Comparada:
                  <code class="font-mono text-caption text-action-700"
                    >Simulada &#123;signedDelta&#125; vs Actual</code
                  >.
                </p>
              </div>
              <div class="mt-space-5 pt-space-4 border-t border-border-hairline">
                <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3">
                  Ejemplo
                </p>
                <div class="bg-surface-quiet rounded-md p-space-6">
                  <afi-graph-card-header
                    label="Evolución patrimonial"
                    headline="1.280.000 €  a los 63 años"
                    tag="Retiro esperado"
                    comparison="Cae a 350.000 € a los 90"
                    tooltip="Pico calculado al año de máximo patrimonio neto; caída estimada al fin del plan."
                  />
                </div>
              </div>
            </article>

            <!-- Filtros por zonas -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Fila de filtros — tres zonas por intención
                  </h2>
                </div>
                <span class="text-caption text-neutral-500">Referencia: Monarch (Mobbin)</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Por qué.</strong> Una fila de controles sin
                  jerarquía obliga al usuario a leer todo antes de decidir qué tocar. Separar por
                  <em>intención</em> reduce el coste cognitivo.
                </p>
                <p>
                  <strong class="text-canvas-fg">Cómo.</strong> Tres zonas separadas por divisores
                  finos: (1) selectores de filtro, (2) toggles de vista, (3) acciones. Máximo 3
                  controles visibles por zona, 5 totales. Combinaciones inválidas se deshabilitan
                  automáticamente.
                </p>
              </div>
              <div class="mt-space-5 pt-space-4 border-t border-border-hairline">
                <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3">
                  Ejemplo
                </p>
                <div class="bg-surface-quiet rounded-md p-space-4">
                  <div class="flex items-center gap-space-4">
                    <div class="flex items-center gap-space-2">
                      <afi-select
                        class="block w-[190px]"
                        size="sm"
                        [options]="vistaOptions"
                        value="actual"
                        ariaLabel="Vista (ejemplo)"
                      />
                      <afi-select
                        class="block w-[210px]"
                        size="sm"
                        [options]="escenarioOptions"
                        value="medio"
                        ariaLabel="Escenario (ejemplo)"
                      />
                      <afi-select
                        class="block w-[210px]"
                        size="sm"
                        [options]="detalleOptions"
                        value="activo"
                        ariaLabel="Detalle (ejemplo)"
                      />
                    </div>
                    <div class="ml-auto flex items-center gap-space-2">
                      <div class="h-5 w-px bg-border-hairline"></div>
                      <afi-button variant="ghost" size="sm" iconStart="sliders">
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
                      <afi-button variant="ghost" size="sm">Accesibilidad</afi-button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <!-- Paleta monocromática -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">Paleta — monocromática Afi Azul</h2>
                </div>
                <span class="text-caption text-neutral-500">Referencia: Origin</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Por qué.</strong> El rojo/verde tradicional se
                  siente anticuado y fuerza un significado de valor que se pierde con agregados. Una
                  sola familia cromática (Afi Azul) se lee como marca; la <em>posición</em> cuenta
                  el signo.
                </p>
                <p>
                  <strong class="text-canvas-fg">Cómo.</strong> Navy base en reposo, rampa de
                  saturación para categorías apiladas, azul brillante AFI Azul 500 al hover.
                </p>
              </div>
              <div class="mt-space-5 pt-space-4 border-t border-border-hairline">
                <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3">
                  Ejemplo — rampa por categoría (Tipo de activo)
                </p>
                <div class="flex flex-wrap items-stretch gap-space-2">
                  @for (a of assetRamp; track a.label) {
                    <div class="flex flex-col gap-space-1 w-[140px]">
                      <div class="h-12 rounded" [style.backgroundColor]="a.color"></div>
                      <p class="text-caption text-canvas-fg">{{ a.label }}</p>
                      <p class="text-caption text-neutral-500 font-mono">{{ a.color }}</p>
                    </div>
                  }
                </div>
                <p class="mt-space-4 text-caption text-neutral-500 mb-space-2">Interacción</p>
                <div class="flex items-center gap-space-4">
                  <div class="flex flex-col gap-space-1">
                    <div class="h-10 w-20 rounded" style="background: var(--action-700)"></div>
                    <p class="text-caption text-neutral-600">Base (reposo)</p>
                  </div>
                  <div class="flex flex-col gap-space-1">
                    <div
                      class="h-10 w-20 rounded opacity-35"
                      style="background: var(--action-700)"
                    ></div>
                    <p class="text-caption text-neutral-600">No hover (0.35)</p>
                  </div>
                  <div class="flex flex-col gap-space-1">
                    <div class="h-10 w-20 rounded" style="background: #0085CA"></div>
                    <p class="text-caption text-neutral-600">Hover (AFI Azul 500)</p>
                  </div>
                </div>
              </div>
            </article>

            <!-- Leyenda + hover readout -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">Leyenda + lectura en hover</h2>
                </div>
                <span class="text-caption text-neutral-500">Referencia: Midday</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Por qué arriba-derecha.</strong> Debajo del gráfico
                  roba espacio al contenido y obliga a recorrer toda la altura antes de entender los
                  colores. Arriba-derecha, en la misma línea que la cabecera, vive donde el ojo
                  llega primero.
                </p>
                <p>
                  <strong class="text-canvas-fg">Por qué fluye con la leyenda.</strong> Probamos
                  tooltips flotantes (tapan barras) y readouts laterales (se desincronizan). La
                  leyenda ya tiene la forma y el label; añadir el valor activo al final de esa misma
                  fila mantiene el <em>pattern recognition</em>.
                </p>
              </div>
              <div class="mt-space-5 pt-space-4 border-t border-border-hairline">
                <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3">
                  Ejemplo — en reposo vs hover
                </p>
                <div class="bg-surface-quiet rounded-md p-space-4 space-y-space-3 text-body-sm">
                  <!-- Reposo -->
                  <div>
                    <p class="text-caption text-neutral-500 mb-space-1">Reposo</p>
                    <div class="flex flex-wrap justify-end items-center gap-space-3">
                      @for (s of legendSample; track s.label) {
                        <span class="inline-flex items-center gap-space-2 text-neutral-600">
                          <span
                            class="w-2 h-2 rounded-full"
                            [style.backgroundColor]="s.color"
                          ></span>
                          <span>{{ s.label }}</span>
                        </span>
                      }
                    </div>
                  </div>
                  <!-- Hover -->
                  <div>
                    <p class="text-caption text-neutral-500 mb-space-1">
                      Hover (año 65, Jubilación)
                    </p>
                    <div class="flex flex-wrap justify-end items-center gap-space-3">
                      @for (s of legendSample; track s.label) {
                        <span class="inline-flex items-center gap-space-2 text-neutral-600">
                          <span
                            class="w-2 h-2 rounded-full"
                            [style.backgroundColor]="s.color"
                          ></span>
                          <span>{{ s.label }}</span>
                        </span>
                      }
                      <span
                        class="inline-flex items-center gap-space-2 pl-space-3 border-l border-border-hairline"
                      >
                        <span
                          class="inline-flex items-center justify-center w-5 h-5 rounded-full border border-action-700 bg-surface-elevated shrink-0"
                        >
                          <svg
                            class="w-3 h-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--action-700)"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <rect x="3" y="8" width="18" height="4" rx="1" />
                            <path d="M12 8v13" />
                            <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                            <path d="M7.5 8a2.5 2.5 0 0 1 0-5c2 0 4.5 2 4.5 5" />
                            <path d="M16.5 8a2.5 2.5 0 0 0 0-5c-2 0-4.5 2-4.5 5" />
                          </svg>
                        </span>
                        <span class="text-action-700 font-medium">Jubilación</span>
                        <span class="text-neutral-400">·</span>
                        <span class="font-medium text-canvas-fg">65 años</span>
                        <span class="text-neutral-400">·</span>
                        <span class="text-neutral-600">Patrimonio neto</span>
                        <span class="tabular-nums text-canvas-fg font-medium">1.180.000 €</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <!-- Tooltip flotante — trade-off de accesibilidad -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-warning"
                    >Tensión abierta</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Tooltip flotante — trade-off de accesibilidad
                  </h2>
                </div>
                <span class="text-caption text-neutral-500">A revisar en v2</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Qué tenemos ahora.</strong> Una tarjeta flotante
                  (280px, fondo blanco, sombra M3 elevation&nbsp;2) aparece al hover sobre una
                  columna. En modo <em>stacked</em> muestra la cabecera &laquo;Activos&raquo;, las 7
                  clases con sus valores, y un pie con &laquo;Patrimonio neto&raquo;. En
                  <em>Comparada</em> y <em>Todos</em> ajusta su contenido a las series visibles.
                </p>
                <p>
                  <strong class="text-canvas-fg"
                    >Dos problemas conocidos — y por qué se quedan en v1.</strong
                  >
                </p>
              </div>
              <div class="mt-space-4 grid grid-cols-1 md:grid-cols-2 gap-space-4 max-w-[840px]">
                <!-- Problem 1: Tooltip covers the chart -->
                <div class="border border-border-hairline rounded-md p-space-4 bg-surface-quiet">
                  <div class="flex items-center gap-space-2 mb-space-2">
                    <svg
                      class="w-4 h-4 text-system-warning"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.75"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4" />
                      <path d="M12 16h.01" />
                    </svg>
                    <p class="text-body-sm font-medium text-canvas-fg">
                      Tapa información del gráfico
                    </p>
                  </div>
                  <p class="text-body-sm text-neutral-600 leading-relaxed">
                    La tarjeta ocupa ~30% del ancho del gráfico. Cuando hoveras cerca del centro,
                    cubre columnas que podrías querer comparar visualmente. Paliamos con
                    <em>anchor flip</em> — si la columna está pasada el 55%, la tarjeta ancla a su
                    izquierda —, pero no elimina el problema en zonas densas.
                  </p>
                </div>
                <!-- Problem 2: Can't interact with it -->
                <div class="border border-border-hairline rounded-md p-space-4 bg-surface-quiet">
                  <div class="flex items-center gap-space-2 mb-space-2">
                    <svg
                      class="w-4 h-4 text-system-warning"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.75"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9 11V6a2 2 0 0 1 4 0v5" />
                      <path d="M5 12h14a2 2 0 0 1 2 2v6" />
                      <circle cx="18" cy="17" r="3" />
                    </svg>
                    <p class="text-body-sm font-medium text-canvas-fg">
                      No se puede &laquo;entrar&raquo; en ella
                    </p>
                  </div>
                  <p class="text-body-sm text-neutral-600 leading-relaxed">
                    Los chevrons de expansión son decorativos en v1: la tarjeta usa
                    <code class="font-mono text-caption">pointer-events: none</code> para que el
                    hover no se le escape. Si la hiciéramos interactiva, el mouse al moverse a la
                    tarjeta saldría de la columna y el hover desaparecería — &laquo;safe
                    triangle&raquo; sin resolver.
                  </p>
                </div>
              </div>
              <div class="mt-space-5 pt-space-4 border-t border-border-hairline">
                <p class="text-body-md text-canvas-fg font-medium mb-space-2">Caminos para v2</p>
                <ul
                  class="text-body-md text-neutral-600 space-y-space-2 max-w-[640px] list-disc pl-space-5"
                >
                  <li>
                    <strong class="text-canvas-fg">Safe-triangle hover intent.</strong> Tras
                    <code class="font-mono text-caption">mouseleave</code> en la columna, mantener
                    la tarjeta abierta durante ~250ms y detectar si el cursor se mueve hacia ella;
                    si sí, hacerla interactiva. Patrón de Notion, Linear, Radix Popover.
                  </li>
                  <li>
                    <strong class="text-canvas-fg">Click-to-pin.</strong> Hover muestra versión
                    read-only; click sobre la columna fija la tarjeta como popover interactivo
                    (chevrons funcionales, foco de teclado, ESC cierra). Dos estados claros, cero
                    ambigüedad.
                  </li>
                  <li>
                    <strong class="text-canvas-fg">Panel lateral fijo.</strong> Mover el contenido a
                    un panel siempre visible a la derecha del gráfico. Cero <em>coverage</em>,
                    interacción total, pero cuesta ~300px de ancho permanente.
                  </li>
                  <li>
                    <strong class="text-canvas-fg">Tabla de datos.</strong> El botón
                    &laquo;Accesibilidad → Ver tabla de datos&raquo; ya existe y resuelve el caso
                    lector-de-pantalla + teclado sin reinventar. La tooltip queda como
                    <em>progressive enhancement</em> para usuarios de ratón.
                  </li>
                </ul>
                <p class="mt-space-4 text-body-sm text-neutral-500">
                  <strong class="text-canvas-fg">Decisión provisional.</strong> V1 ships con tooltip
                  passiva + enlace a tabla de datos desde el menú Accesibilidad. Revaloramos cuando
                  tengamos datos de uso: si los asesores consultan la misma columna más de 2× por
                  sesión, construimos click-to-pin.
                </p>
              </div>
            </article>

            <!-- Hitos vs Objetivos — dos capas, dos preguntas -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Hitos vs Objetivos — dos capas, dos preguntas
                  </h2>
                </div>
                <span class="text-caption text-neutral-500">Ajustes independientes</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">El gráfico tiene dos tipos de marca.</strong> Se
                  parecen de lejos pero responden a preguntas distintas. Separarlas en dos toggles
                  independientes dentro de Ajustes permite al asesor enseñar la información que toca
                  sin saturar.
                </p>
              </div>
              <div class="mt-space-4 grid grid-cols-1 md:grid-cols-2 gap-space-4 max-w-[840px]">
                <!-- Hitos -->
                <div class="border border-border-hairline rounded-md p-space-4 bg-surface-quiet">
                  <div class="flex items-center gap-space-2 mb-space-3">
                    <span
                      class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white border border-action-700"
                    >
                      <svg
                        class="w-4 h-4 text-action-700"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </span>
                    <p class="text-body-md font-medium text-canvas-fg">Hitos vitales</p>
                  </div>
                  <p class="text-body-sm text-neutral-600 leading-relaxed mb-space-2">
                    <strong class="text-canvas-fg">Pregunta:</strong> <em>¿qué pasa ese año?</em>
                  </p>
                  <p class="text-body-sm text-neutral-600 leading-relaxed mb-space-2">
                    Retiro, jubilación, emancipación de los hijos. Son eventos <em>temporales</em> —
                    anclados a una edad, no a un importe.
                  </p>
                  <p class="text-body-sm text-neutral-600 leading-relaxed">
                    <strong class="text-canvas-fg">Visual:</strong> círculo Azul pinned
                    <em>encima</em> del gráfico, con línea punteada al cero. Color de marca porque
                    hablan del recorrido vital.
                  </p>
                </div>
                <!-- Objetivos -->
                <div class="border border-border-hairline rounded-md p-space-4 bg-surface-quiet">
                  <div class="flex items-center gap-space-2 mb-space-3">
                    <span class="inline-flex items-center justify-center w-7 h-7">
                      <svg
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        fill="none"
                        aria-hidden="true"
                      >
                        <rect
                          x="5"
                          y="5"
                          width="14"
                          height="14"
                          rx="2"
                          fill="#ffffff"
                          stroke="#475569"
                          stroke-width="1.25"
                          transform="rotate(45 12 12)"
                        />
                        <g
                          transform="translate(8, 8)"
                          stroke="#475569"
                          stroke-width="1.75"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <circle cx="4" cy="4" r="4" />
                          <circle cx="4" cy="4" r="2" />
                        </g>
                      </svg>
                    </span>
                    <p class="text-body-md font-medium text-canvas-fg">Objetivos</p>
                  </div>
                  <p class="text-body-sm text-neutral-600 leading-relaxed mb-space-2">
                    <strong class="text-canvas-fg">Pregunta:</strong>
                    <em>¿cuánto quiero tener para entonces?</em>
                  </p>
                  <p class="text-body-sm text-neutral-600 leading-relaxed mb-space-2">
                    Fondo emergencia 30k, vivienda vacacional 250k, herencia mínima 400k. Son
                    <em>metas económicas</em> — ancladas a un importe concreto en un año concreto.
                  </p>
                  <p class="text-body-sm text-neutral-600 leading-relaxed">
                    <strong class="text-canvas-fg">Visual:</strong> rombo neutro pinned
                    <em>sobre la curva</em>, al valor objetivo. Color apagado para leer como
                    &laquo;portería&raquo; — no compiten con la trayectoria real.
                  </p>
                </div>
              </div>
              <div class="mt-space-5 pt-space-4 border-t border-border-hairline">
                <p class="text-body-sm text-neutral-500 max-w-[640px]">
                  <strong class="text-canvas-fg">Dos toggles, independientes.</strong> Ajustes &gt;
                  <em>Mostrar hitos vitales</em> y Ajustes &gt; <em>Mostrar objetivos</em> se
                  encienden por separado. Ambas marcas coexisten sin solaparse: las hitos viven
                  arriba (tiempo), los objetivos viven sobre la curva (valor). Si coinciden en edad,
                  los planos son distintos — no compiten.
                </p>
              </div>
            </article>

            <!-- Hitos vitales -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">Hitos vitales — iconos, no etiquetas</h2>
                </div>
                <span class="text-caption text-neutral-500">Iconos: Lucide</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Por qué.</strong> El Figma original usaba etiquetas
                  de texto oscuras fijas sobre las barras. Llenaban el gráfico de cromo y competían
                  con los datos.
                </p>
                <p>
                  <strong class="text-canvas-fg">Cómo.</strong> Círculo Azul con icono Lucide —
                  maletín (retiro), regalo (jubilación), casa (emancipación). Label en el
                  <code class="font-mono text-caption">&lt;title&gt;</code> + reaparece en la
                  lectura en hover. Línea discontinua al cero.
                </p>
                <p>
                  <strong class="text-canvas-fg">Conmutable desde Ajustes.</strong> "Mostrar hitos
                  vitales" los esconde sin perder estado.
                </p>
              </div>
              <div class="mt-space-5 pt-space-4 border-t border-border-hairline">
                <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3">
                  Ejemplo — iconos disponibles
                </p>
                <div class="flex flex-wrap items-start gap-space-6">
                  @for (e of eventSamples; track e.label) {
                    <div class="flex flex-col items-center gap-space-2">
                      <span
                        class="inline-flex items-center justify-center w-6 h-6 rounded-full border-[1.5px] border-action-700 bg-surface-elevated"
                      >
                        <svg
                          class="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--action-700)"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          @switch (e.icon) {
                            @case ('briefcase') {
                              <rect x="2" y="7" width="20" height="14" rx="2" />
                              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                            }
                            @case ('gift') {
                              <rect x="3" y="8" width="18" height="4" rx="1" />
                              <path d="M12 8v13" />
                              <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                              <path d="M7.5 8a2.5 2.5 0 0 1 0-5c2 0 4.5 2 4.5 5" />
                              <path d="M16.5 8a2.5 2.5 0 0 0 0-5c-2 0-4.5 2-4.5 5" />
                            }
                            @case ('home') {
                              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                              <polyline points="9 22 9 12 15 12 15 22" />
                            }
                          }
                        </svg>
                      </span>
                      <p class="text-caption text-canvas-fg">{{ e.label }}</p>
                      <p class="text-caption text-neutral-500">{{ e.age }} años</p>
                    </div>
                  }
                </div>
                <p class="mt-space-4 text-caption text-neutral-500 mb-space-2">Toggle conmutable</p>
                <afi-switch label="Mostrar hitos vitales" [checked]="true" />
              </div>
            </article>

            <!-- Hover / énfasis -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">Hover — la barra revela la marca</h2>
                </div>
                <span class="text-caption text-neutral-500">Inspiración: Jira</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Por qué.</strong> La interacción merece su
                  expresión cromática. En reposo el gráfico es calmo (navy / monocromo); al hover,
                  el Afi Azul brillante entra como acento.
                </p>
                <p>
                  <strong class="text-canvas-fg">Cómo.</strong> Barra hover en
                  <code class="font-mono text-caption">--color-afi-azul-500</code>; resto de barras
                  con opacity 0.35; techo fantasma gris claro detrás para contextualizar el rango
                  total.
                </p>
              </div>
              <div class="mt-space-5 pt-space-4 border-t border-border-hairline">
                <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3">
                  Ejemplo — simulación del hover
                </p>
                <div class="bg-surface-quiet rounded-md p-space-6">
                  <div class="flex items-end gap-1 h-[120px]">
                    @for (bar of hoverBars; track bar.i) {
                      <div class="flex-1 relative">
                        @if (bar.hovered) {
                          <div
                            class="absolute inset-x-0 inset-y-0 bg-neutral-100 rounded-sm"
                            style="opacity: 0.5"
                          ></div>
                        }
                        <div
                          class="relative rounded-sm transition-opacity"
                          [class.opacity-35]="!bar.hovered && hoveredAnywhere"
                          [style.backgroundColor]="bar.hovered ? '#0085CA' : 'var(--action-700)'"
                          [style.height.px]="bar.h"
                          [style.marginTop.px]="120 - bar.h"
                        ></div>
                      </div>
                    }
                  </div>
                  <p class="text-caption text-neutral-500 mt-space-3">
                    La columna central simula el estado hover.
                  </p>
                </div>
              </div>
            </article>

            <!-- Barra lateral -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Barra lateral — primitivo DS sin variantes nuevas
                  </h2>
                </div>
                <span class="text-caption text-neutral-500"
                  >Primitivo: <code class="font-mono">afi-sidebar</code></span
                >
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Por qué.</strong> Crear una variante de sidebar con
                  cambios de color y spacing multiplicaría el coste de mantenimiento sin aportar
                  valor de marca. El primitivo existente ya transmite la jerarquía adecuada.
                </p>
                <p>
                  <strong class="text-canvas-fg">Cómo.</strong> Reutilizamos
                  <code class="font-mono text-caption text-action-700"
                    >&lt;afi-sidebar mode="collapsible"&gt;</code
                  >
                  tal cual. Top slot dice "Wealth planner". Las secciones usan
                  <code class="font-mono text-caption text-action-700">afi-nav-section</code>.
                </p>
                <p class="text-body-sm">
                  Ver en vivo en
                  <a
                    routerLink="/novedades/evolucion-patrimonial"
                    class="text-action-700 hover:underline"
                    >la propuesta</a
                  >.
                </p>
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class EvolucionPatrimonialDecisionesPage {
  // --- Static example data ---
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

  readonly assetRamp = [
    { label: 'Inmobiliario', color: '#041F2C' },
    { label: 'Inversiones', color: '#1A3A4E' },
    { label: 'Pensiones', color: '#2D5472' },
    { label: 'Private equity', color: '#456F92' },
    { label: 'Participaciones', color: '#5E8AB0' },
    { label: 'Liquidez', color: '#7FA5C4' },
    { label: 'Otro', color: '#A6C2D9' },
  ];

  readonly legendSample = [
    { label: 'Inmobiliario', color: '#041F2C' },
    { label: 'Inversiones', color: '#1A3A4E' },
    { label: 'Pensiones', color: '#2D5472' },
    { label: 'Liquidez', color: '#7FA5C4' },
  ];

  readonly eventSamples = [
    { icon: 'briefcase', label: 'Retiro esperado', age: 63 },
    { icon: 'gift', label: 'Jubilación', age: 65 },
    { icon: 'home', label: 'Emancipación hijo 1', age: 70 },
  ];

  readonly hoveredAnywhere = true;
  readonly hoverBars = [
    { i: 0, h: 80, hovered: false },
    { i: 1, h: 92, hovered: false },
    { i: 2, h: 100, hovered: false },
    { i: 3, h: 110, hovered: false },
    { i: 4, h: 105, hovered: true },
    { i: 5, h: 92, hovered: false },
    { i: 6, h: 80, hovered: false },
    { i: 7, h: 70, hovered: false },
    { i: 8, h: 60, hovered: false },
    { i: 9, h: 50, hovered: false },
  ];
}
