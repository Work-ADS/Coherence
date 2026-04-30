import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent, TabsComponent, TabComponent } from '@coherence/ui';

import { PlannerTopBarComponent } from '../shared/planner-top-bar.component';
import { OnThisPageComponent, type TocItem } from '../shared/on-this-page.component';

/**
 * Case study for the Wealth Planner top bar.
 *
 * Covers: role (sesión-level chrome), anatomy (editable identity on the left,
 * lucide actions on the right), white background rationale, and the combined
 * "chevron + list" button that opens the planifications dropdown.
 */
@Component({
  selector: 'site-nav-bar-decisiones-page',
  standalone: true,
  imports: [
    RouterLink,
    PageHeaderComponent,
    TabsComponent,
    TabComponent,
    PlannerTopBarComponent,
    OnThisPageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    /* Numbered callout markers — overlay circles positioned over the live
       top-bar example. The accordion below uses the same numbers so the
       reader can flip back and forth without losing context. */
    .callout-marker {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      width: 22px;
      height: 22px;
      border-radius: 9999px;
      background: var(--action-700);
      color: #ffffff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      line-height: 1;
      box-shadow: 0 0 0 3px var(--canvas-base);
      pointer-events: none;
    }
    .callout-number-inline {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 9999px;
      background: var(--action-700);
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      flex-shrink: 0;
    }
    /* Native <details> → custom marker behavior. Hide default triangle. */
    details > summary::-webkit-details-marker {
      display: none;
    }
    details > summary {
      list-style: none;
    }
  `,
  template: `
    <div class="min-h-screen flex flex-col bg-canvas-base">
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
        <span class="text-canvas-fg font-medium">Top bar</span>
      </div>

      <main class="flex-1 overflow-y-auto">
        <div class="max-w-[1200px] mx-auto py-space-10 flex gap-space-10">
          <div class="min-w-0 flex-1">
            <afi-page-header
              title="Top bar — decisiones"
              subtitle="Chrome de la sesión de planificación: identidad editable a la izquierda, acciones globales a la derecha. Fondo canvas para fundirse con el contenido y dejar el navy al sidebar."
              [sticky]="false"
              [scrollFade]="false"
            >
              <span slot="breadcrumb" class="uppercase tracking-wider text-action-700"
                >CASO DE ESTUDIO</span
              >
            </afi-page-header>

            <div class="mt-space-8 px-space-8 pb-space-10">
              <afi-tabs [lazy]="true" ariaLabel="Vistas del caso de estudio Top bar">
                <!-- ==================== DECISIONES ==================== -->
                <afi-tab label="Decisiones">
                  <div class="py-space-6 flex flex-col gap-space-10">
                    <!-- TIER 1: identidad del componente -->
                    <section id="resumen" class="scroll-mt-space-8">
                      <p class="text-caption uppercase tracking-wider text-action-700 mb-space-2">
                        Componente
                      </p>
                      <h2 class="text-subtitle text-canvas-fg mb-space-2">Top bar</h2>
                      <p class="text-body-md text-neutral-700 max-w-[640px]">
                        Navegación global y acciones del producto. La barra horizontal del
                        planificador: identidad de la sesión a la izquierda, atajo a las decisiones
                        del caso, y configuración global a la derecha.
                      </p>
                    </section>

                    <!-- TIER 2: ejemplo en vivo + diagrama anotado -->
                    <section id="ejemplo" class="scroll-mt-space-8">
                      <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3">
                        Ejemplo anotado
                      </p>
                      <div
                        class="relative border border-border-hairline rounded-md overflow-hidden"
                      >
                        <site-planner-top-bar decisionesRoute="/novedades/nav-bar-decisiones" />
                        <!-- Numbered callouts overlay — positioned over each functional area.
                     Numbers correspond to accordion items below for cross-reference. -->
                        <span class="callout-marker" style="left: 16px;">1</span>
                        <span class="callout-marker" style="left: 240px;">2</span>
                        <span class="callout-marker" style="left: 480px;">3</span>
                        <span class="callout-marker" style="right: 16px;">4</span>
                      </div>
                      <p class="mt-space-3 text-caption text-neutral-500">
                        Cada número se explica en el desplegable de abajo. Pulsa para expandir.
                      </p>
                    </section>

                    <!-- TIER 3: accordion explicando cada callout -->
                    <section id="callouts" class="scroll-mt-space-8 flex flex-col gap-space-2">
                      <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-1">
                        Anatomía
                      </p>
                      @for (c of callouts; track c.n) {
                        <details class="group border border-border-hairline rounded-md">
                          <summary
                            class="flex items-center gap-space-3 px-space-4 py-space-3 cursor-pointer list-none hover:bg-surface-muted"
                          >
                            <span class="callout-number-inline">{{ c.n }}</span>
                            <span class="text-body-md font-medium text-canvas-fg flex-1">{{
                              c.title
                            }}</span>
                            <svg
                              class="w-4 h-4 text-neutral-500 transition-transform group-open:rotate-180"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="1.75"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              aria-hidden="true"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </summary>
                          <div
                            class="px-space-4 py-space-3 border-t border-border-hairline text-body-sm text-neutral-700 space-y-space-2 max-w-[640px]"
                            [innerHTML]="c.body"
                          ></div>
                        </details>
                      }
                    </section>

                    <!-- TIER 4: secciones de decisiones -->

                    <!-- =========== NAVEGACIÓN E IDENTIDAD =========== -->
                    <section id="navegacion" class="scroll-mt-space-8">
                      <p
                        class="text-caption uppercase tracking-wider text-neutral-500 mb-space-4 pb-space-2 border-b border-border-hairline"
                      >
                        Navegación e identidad
                      </p>
                      <div class="flex flex-col gap-space-6">
                        <!-- Identidad editable -->
                        <article
                          id="identidad-editable"
                          class="border border-border-hairline rounded-md p-space-6 scroll-mt-space-8"
                        >
                          <header class="flex items-center justify-between mb-space-3">
                            <div class="flex items-center gap-space-2">
                              <span
                                class="text-caption uppercase tracking-wider text-system-success"
                                >Decidido</span
                              >
                              <h2 class="text-section text-canvas-fg">
                                Identidad editable — tres controles en línea
                              </h2>
                            </div>
                          </header>
                          <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                            <p>
                              <strong class="text-canvas-fg">Cambiar de planificación.</strong> El
                              botón combinado <em>chevron + lista</em> abre un dropdown con los
                              planes (Plan 1, Plan 2, …) y su ID SIM. El chevron y el list icon
                              <em>son un solo botón</em>: chevron lee &laquo;volver a la
                              lista&raquo;, list lee &laquo;planificaciones&raquo; — juntos forman
                              una sola affordance y evitan darle al usuario dos clicks que hacen lo
                              mismo.
                            </p>
                            <p>
                              <strong class="text-canvas-fg">Renombrar in situ.</strong> Pulsa el
                              lápiz y el ID se convierte en un input.
                              <code class="font-mono text-caption">Enter</code> guarda,
                              <code class="font-mono text-caption">Esc</code> cancela. Cero modal,
                              cero ruta nueva — patrón de Linear, Notion, Granola.
                            </p>
                          </div>
                        </article>

                        <!-- Cliente por encima del ID -->
                        <article
                          id="cliente-anclaje"
                          class="border border-border-hairline rounded-md p-space-6 scroll-mt-space-8"
                        >
                          <header class="flex items-center justify-between mb-space-3">
                            <div class="flex items-center gap-space-2">
                              <span
                                class="text-caption uppercase tracking-wider text-system-success"
                                >Decidido</span
                              >
                              <h2 class="text-section text-canvas-fg">
                                Cliente por encima del ID — anclaje narrativo
                              </h2>
                            </div>
                          </header>
                          <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                            <p>
                              <strong class="text-canvas-fg">Por qué.</strong> Todas las
                              planificaciones del switcher pertenecen al <em>mismo cliente</em>. Si
                              solo vemos &laquo;SIM-2025-0011 · Borrador&raquo;, perdemos la
                              pregunta primaria: <em>¿de quién es este plan?</em> El nombre del
                              cliente en una línea tracked de caption reencuadra cada acción —
                              renombrar, cambiar estado, switchear plan — como algo que estamos
                              haciendo <em>para Familia Torres</em>.
                            </p>
                            <p>
                              <strong class="text-canvas-fg"
                                >Tipografía deliberadamente quieta.</strong
                              >
                              <code class="font-mono text-caption"
                                >text-caption uppercase tracking-wider text-neutral-500</code
                              >. No compite con el ID ni con el estado; funciona como un rótulo de
                              sección arriba del contenido real.
                            </p>
                            <p>
                              <strong class="text-canvas-fg">Alternativas descartadas.</strong> Una
                              opción era &laquo;Familia Torres · SIM-2025-0011&raquo; en una sola
                              línea, pero mezcla dos identidades (cliente + plan) con el mismo peso
                              visual. Otra era esconderlo hasta abrir el dropdown de planes, pero
                              entonces dejas al usuario descubrir algo que debería ser evidente.
                            </p>
                          </div>
                        </article>
                      </div>
                    </section>

                    <!-- =========== ESTADO =========== -->
                    <section id="estado" class="scroll-mt-space-8">
                      <p
                        class="text-caption uppercase tracking-wider text-neutral-500 mb-space-4 pb-space-2 border-b border-border-hairline"
                      >
                        Estado
                      </p>
                      <div class="flex flex-col gap-space-6">
                        <!-- Estado chip -->
                        <article
                          id="estado-chip"
                          class="border border-border-hairline rounded-md p-space-6 scroll-mt-space-8"
                        >
                          <header class="flex items-center justify-between mb-space-3">
                            <div class="flex items-center gap-space-2">
                              <span
                                class="text-caption uppercase tracking-wider text-system-success"
                                >Decidido</span
                              >
                              <h2 class="text-section text-canvas-fg">
                                Chip de estado — color como pista de progreso
                              </h2>
                            </div>
                          </header>
                          <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                            <p>
                              <strong class="text-canvas-fg"
                                >Cuatro estados, cuatro colores.</strong
                              >
                              Borrador (neutro), Cumplimentada (azul), Descargada (lavanda),
                              Entregada al cliente (verde). El usuario lee el progreso del plan sin
                              mirar la etiqueta — el color es el primer canal informativo.
                            </p>
                            <p>
                              <strong class="text-canvas-fg"
                                >Click sobre el chip = dropdown de cambio.</strong
                              >
                              No hay un botón "editar estado" separado. El chip es a la vez el
                              <em>display</em> y la <em>affordance</em> — patrón de tags en Linear /
                              Notion.
                            </p>
                            <p>
                              <strong class="text-canvas-fg"
                                >Cambio confirmado por toast con deshacer.</strong
                              >
                              Cinco segundos para revertir si fue un click accidental. Sin modal,
                              sin fricción.
                            </p>
                          </div>
                        </article>
                      </div>
                    </section>

                    <!-- =========== ACCIONES =========== -->
                    <section id="acciones" class="scroll-mt-space-8">
                      <p
                        class="text-caption uppercase tracking-wider text-neutral-500 mb-space-4 pb-space-2 border-b border-border-hairline"
                      >
                        Acciones
                      </p>
                      <div class="flex flex-col gap-space-6">
                        <!-- Iconos derecha -->
                        <article
                          id="acciones-globales"
                          class="border border-border-hairline rounded-md p-space-6 scroll-mt-space-8"
                        >
                          <header class="flex items-center justify-between mb-space-3">
                            <div class="flex items-center gap-space-2">
                              <span
                                class="text-caption uppercase tracking-wider text-system-success"
                                >Decidido</span
                              >
                              <h2 class="text-section text-canvas-fg">Iconos Lucide con tooltip</h2>
                            </div>
                          </header>
                          <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                            <p>
                              <strong class="text-canvas-fg">Por qué Lucide.</strong> Los iconos del
                              primer sketch eran <em>Material filled</em> — sólidos y pesados,
                              perdían la quietud que queremos en el chrome. Lucide (stroke 1.75,
                              esquinas redondeadas) es el estándar del producto en V3; coincide con
                              el set del sidebar y con el editor del IDE interno.
                            </p>
                            <p>
                              <strong class="text-canvas-fg"
                                >Mismo botón que el de navegación.</strong
                              >
                              Las acciones a la derecha usan el mismo patrón que el botón de
                              planificación a la izquierda:
                              <code class="font-mono text-caption"
                                >w-7 h-7 rounded hover:bg-surface-muted text-neutral-600</code
                              >. Unifica la lectura del top bar: cualquier icono-botón se comporta
                              igual visualmente.
                            </p>
                            <p>
                              <strong class="text-canvas-fg">Tooltip siempre.</strong> Icono-solo
                              sin tooltip es una trampa de reconocimiento. Cada botón tiene
                              <code class="font-mono text-caption">aria-label</code> (screen
                              readers) y una pop en hover/focus.
                            </p>
                            <p>
                              <strong class="text-canvas-fg"
                                >Acciones reducidas tras iteración.</strong
                              >
                              Empezamos con Notas, Compartir y Ajustes. Compartir se quitó porque no
                              forma parte del flujo del planner; Notas se quitó porque saturaba la
                              barra y la información cabe mejor en el blog del caso. Sólo queda
                              <em>Configuración (engranaje)</em>.
                            </p>
                          </div>
                        </article>

                        <!-- Toasts con deshacer -->
                        <article
                          id="toasts-deshacer"
                          class="border border-border-hairline rounded-md p-space-6 scroll-mt-space-8"
                        >
                          <header class="flex items-center justify-between mb-space-3">
                            <div class="flex items-center gap-space-2">
                              <span
                                class="text-caption uppercase tracking-wider text-system-success"
                                >Decidido</span
                              >
                              <h2 class="text-section text-canvas-fg">
                                Toasts con deshacer — confirmación sin fricción
                              </h2>
                            </div>
                          </header>
                          <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                            <p>
                              <strong class="text-canvas-fg">Por qué.</strong> Las acciones que
                              tocan el estado del plan (renombrar, cambiar estado, switchear
                              planificación) son reversibles y frecuentes. Pedir confirmación previa
                              con un modal convierte cada una en una fricción; ignorarlas del todo
                              deja al usuario sin saber si pasó algo. Un toast con
                              <em>deshacer</em> cubre los dos: confirma sin bloquear y ofrece una
                              salida si fue un accidente.
                            </p>
                            <p>
                              <strong class="text-canvas-fg"
                                >Visual — Figma&apos;s &laquo;return to instance&raquo;.</strong
                              >
                              Píldora oscura en el centro-abajo, tres zonas separadas por un
                              hairline blanco: <em>[↶ Deshacer]</em> · <em>mensaje</em> ·
                              <em>[×]</em>. Entrada con slide-up + fade 180ms, respeta
                              <code class="font-mono text-caption">prefers-reduced-motion</code>.
                              Auto-cierre a los 5 segundos.
                            </p>
                            <p>
                              <strong class="text-canvas-fg">Accesibilidad.</strong>
                              <code class="font-mono text-caption">role="status"</code> +
                              <code class="font-mono text-caption">aria-live="polite"</code> — los
                              lectores de pantalla anuncian el cambio sin interrumpir.
                            </p>
                          </div>
                        </article>
                      </div>
                    </section>

                    <!-- =========== LAYOUT — info de soporte al final =========== -->
                    <section id="layout" class="scroll-mt-space-8">
                      <p
                        class="text-caption uppercase tracking-wider text-neutral-500 mb-space-4 pb-space-2 border-b border-border-hairline"
                      >
                        Layout y rol
                      </p>
                      <div class="flex flex-col gap-space-6">
                        <!-- Rol -->
                        <article
                          id="rol"
                          class="border border-border-hairline rounded-md p-space-6 scroll-mt-space-8"
                        >
                          <header class="flex items-center justify-between mb-space-3">
                            <div class="flex items-center gap-space-2">
                              <span
                                class="text-caption uppercase tracking-wider text-system-success"
                                >Decidido</span
                              >
                              <h2 class="text-section text-canvas-fg">
                                Rol — chrome de sesión, no de página
                              </h2>
                            </div>
                          </header>
                          <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                            <p>
                              <strong class="text-canvas-fg">Qué contiene.</strong> Identidad de la
                              planificación (selector de plan, ID editable, estado) y acciones
                              globales de la sesión (configuración).
                            </p>
                            <p>
                              <strong class="text-canvas-fg">Qué NO contiene.</strong> Nada
                              específico de la página actual. &laquo;Patrimonio&raquo; o
                              &laquo;Evolución comparada&raquo; van en la
                              <em>cabecera de página</em>, no aquí.
                            </p>
                            <p>
                              <strong class="text-canvas-fg">Tres capas de contexto.</strong>
                              Sidebar = navegación del producto. Top bar = sesión. Cabecera de
                              página = página actual. El usuario sabe en qué escala está operando
                              por dónde mira.
                            </p>
                          </div>
                        </article>

                        <!-- Fondo -->
                        <article
                          id="fondo-canvas"
                          class="border border-border-hairline rounded-md p-space-6 scroll-mt-space-8"
                        >
                          <header class="flex items-center justify-between mb-space-3">
                            <div class="flex items-center gap-space-2">
                              <span
                                class="text-caption uppercase tracking-wider text-system-success"
                                >Decidido</span
                              >
                              <h2 class="text-section text-canvas-fg">
                                Fondo canvas — no compite con el sidebar
                              </h2>
                            </div>
                          </header>
                          <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                            <p>
                              <strong class="text-canvas-fg">Por qué blanco/canvas.</strong> El
                              sidebar ya tiene el peso visual del navy. Dar al top bar su propio
                              fondo gris le añadía un tercer tono horizontal que dividía la pantalla
                              en bandas. Con canvas, sidebar = identidad, top bar + main = área de
                              trabajo continua. Los únicos separadores son el
                              <code class="font-mono text-caption">border-b</code> del top bar y el
                              borde vertical implícito entre sidebar y main.
                            </p>
                            <p>
                              <strong class="text-canvas-fg">Coste cero en jerarquía.</strong> La
                              densidad (<code class="font-mono text-caption">h-10</code> = 40px) y
                              los colores del contenido (ID en negrita, chip coloreado) ya dejan
                              claro que es una capa funcional distinta.
                            </p>
                          </div>
                        </article>

                        <!-- Colocación -->
                        <article
                          id="colocacion"
                          class="border border-border-hairline rounded-md p-space-6 scroll-mt-space-8"
                        >
                          <header class="flex items-center justify-between mb-space-3">
                            <div class="flex items-center gap-space-2">
                              <span
                                class="text-caption uppercase tracking-wider text-system-success"
                                >Decidido</span
                              >
                              <h2 class="text-section text-canvas-fg">
                                Colocación — junto al sidebar, no sobre él
                              </h2>
                            </div>
                          </header>
                          <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                            <p>
                              <strong class="text-canvas-fg">La versión inicial</strong> ponía el
                              top bar spanning todo el ancho, con el sidebar debajo. El resultado:
                              la navegación parecía subordinada al top bar.
                            </p>
                            <p>
                              <strong class="text-canvas-fg">Versión final.</strong> El sidebar
                              ocupa toda la altura izquierda (es la navegación del producto). El top
                              bar vive sólo sobre la <em>columna de contenido</em>. Tres capas —
                              sidebar, top bar, main — tres ámbitos.
                            </p>
                          </div>
                          <div class="mt-space-5 pt-space-4 border-t border-border-hairline">
                            <p
                              class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3"
                            >
                              Layout
                            </p>
                            <div
                              class="border border-border-hairline rounded-md overflow-hidden h-[180px] flex"
                            >
                              <div
                                class="w-[140px] bg-[#041F2C] text-white text-caption flex items-center justify-center text-center px-space-2"
                              >
                                Sidebar<br />(alto completo)
                              </div>
                              <div class="flex-1 flex flex-col">
                                <div
                                  class="h-10 bg-canvas-base border-b border-border-hairline text-caption flex items-center justify-center text-neutral-600"
                                >
                                  Top bar (sólo sobre main)
                                </div>
                                <div
                                  class="flex-1 bg-canvas-base text-caption flex items-center justify-center text-neutral-500"
                                >
                                  Main — cabecera + contenido
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                      </div>
                    </section>
                  </div>
                </afi-tab>

                <!-- ==================== HISTORIAS DE USUARIO ==================== -->
                <afi-tab label="Historias de usuario">
                  <div class="py-space-6 flex flex-col gap-space-6">
                    <p class="text-body-md text-neutral-600 max-w-[640px]">
                      Cada historia describe un escenario real del gestor durante una sesión de
                      planificación. Sirven como input para handoff: el equipo de desarrollo las usa
                      para validar criterios de aceptación.
                    </p>

                    <ol class="flex flex-col gap-space-4">
                      @for (s of userStories; track s.id) {
                        <li class="border border-border-hairline rounded-md p-space-5">
                          <div class="flex items-start justify-between gap-space-3 mb-space-2">
                            <h3 class="text-body-lg-600 text-canvas-fg">
                              {{ s.id }} · {{ s.title }}
                            </h3>
                            <span
                              class="text-caption uppercase tracking-wider text-neutral-500 shrink-0"
                              >{{ s.priority }}</span
                            >
                          </div>
                          <p class="text-body-md text-neutral-700 mb-space-3">
                            <em>"{{ s.story }}"</em>
                          </p>
                          <p
                            class="text-caption uppercase tracking-wider text-neutral-500 mb-space-1"
                          >
                            Criterios de aceptación
                          </p>
                          <ul
                            class="flex flex-col gap-space-1 text-body-sm text-neutral-700 list-disc pl-space-5"
                          >
                            @for (c of s.criteria; track c) {
                              <li>{{ c }}</li>
                            }
                          </ul>
                        </li>
                      }
                    </ol>
                  </div>
                </afi-tab>

                <!-- ==================== REQUISITOS TÉCNICOS ==================== -->
                <afi-tab label="Requisitos técnicos">
                  <div class="py-space-6 flex flex-col gap-space-6">
                    <p class="text-body-md text-neutral-600 max-w-[640px]">
                      Restricciones de implementación que el equipo de frontend debe respetar para
                      que el patrón sea consistente con el resto del producto.
                    </p>

                    @for (group of technicalRequirements; track group.title) {
                      <article class="border border-border-hairline rounded-md p-space-5">
                        <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">
                          {{ group.title }}
                        </h3>
                        <ul class="flex flex-col gap-space-2 text-body-sm text-neutral-700">
                          @for (item of group.items; track item) {
                            <li class="flex items-start gap-space-2">
                              <span class="text-action-700 shrink-0 mt-[2px]">›</span>
                              <span [innerHTML]="item"></span>
                            </li>
                          }
                        </ul>
                      </article>
                    }
                  </div>
                </afi-tab>

                <!-- ==================== REQUISITOS NO TÉCNICOS ==================== -->
                <afi-tab label="Requisitos no técnicos">
                  <div class="py-space-6 flex flex-col gap-space-6">
                    <p class="text-body-md text-neutral-600 max-w-[640px]">
                      Accesibilidad, internacionalización, comportamiento y políticas — todo lo que
                      no es código pero sin lo que el patrón no se considera completo.
                    </p>

                    @for (group of nonTechnicalRequirements; track group.title) {
                      <article class="border border-border-hairline rounded-md p-space-5">
                        <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">
                          {{ group.title }}
                        </h3>
                        <ul class="flex flex-col gap-space-2 text-body-sm text-neutral-700">
                          @for (item of group.items; track item) {
                            <li class="flex items-start gap-space-2">
                              <span class="text-action-700 shrink-0 mt-[2px]">›</span>
                              <span [innerHTML]="item"></span>
                            </li>
                          }
                        </ul>
                      </article>
                    }
                  </div>
                </afi-tab>

                <!-- ==================== ESPECIFICACIONES FIGMA ==================== -->
                <afi-tab label="Especificaciones Figma">
                  <div class="py-space-6 flex flex-col gap-space-6">
                    <p class="text-body-md text-neutral-600 max-w-[640px]">
                      Tokens, dimensiones e iconografía para que un diseñador pueda reconstruir el
                      patrón en Figma sin abrir el código. Cuando alguno cambie en el sistema, esta
                      tabla y el componente cambian a la vez.
                    </p>

                    <article class="border border-border-hairline rounded-md p-space-5">
                      <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">
                        Tokens — Top bar contenedor
                      </h3>
                      <table class="w-full text-body-sm">
                        <thead>
                          <tr class="text-left border-b border-border-hairline">
                            <th class="font-medium text-canvas-fg pb-space-2">Propiedad</th>
                            <th class="font-medium text-canvas-fg pb-space-2">Token</th>
                            <th class="font-medium text-canvas-fg pb-space-2">Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (row of tokensContainer; track row.property) {
                            <tr class="border-b border-border-hairline last:border-b-0">
                              <td class="py-space-2 text-neutral-700">{{ row.property }}</td>
                              <td class="py-space-2 font-mono text-caption text-action-700">
                                {{ row.token }}
                              </td>
                              <td class="py-space-2 text-neutral-700 tabular-nums">
                                {{ row.value }}
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </article>

                    <article class="border border-border-hairline rounded-md p-space-5">
                      <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">
                        Tokens — Botones de acción (icon-only)
                      </h3>
                      <table class="w-full text-body-sm">
                        <thead>
                          <tr class="text-left border-b border-border-hairline">
                            <th class="font-medium text-canvas-fg pb-space-2">Propiedad</th>
                            <th class="font-medium text-canvas-fg pb-space-2">Token</th>
                            <th class="font-medium text-canvas-fg pb-space-2">Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (row of tokensIconButton; track row.property) {
                            <tr class="border-b border-border-hairline last:border-b-0">
                              <td class="py-space-2 text-neutral-700">{{ row.property }}</td>
                              <td class="py-space-2 font-mono text-caption text-action-700">
                                {{ row.token }}
                              </td>
                              <td class="py-space-2 text-neutral-700 tabular-nums">
                                {{ row.value }}
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </article>

                    <article class="border border-border-hairline rounded-md p-space-5">
                      <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">Iconografía</h3>
                      <ul class="flex flex-col gap-space-2 text-body-sm text-neutral-700">
                        @for (icon of icons; track icon.name) {
                          <li
                            class="flex items-center justify-between gap-space-3 py-space-1 border-b border-border-hairline last:border-b-0"
                          >
                            <span class="font-mono text-caption text-action-700">{{
                              icon.name
                            }}</span>
                            <span class="text-neutral-600">{{ icon.use }}</span>
                          </li>
                        }
                      </ul>
                      <p class="mt-space-3 text-caption text-neutral-500">
                        Set Lucide. <code class="font-mono">stroke-width="1.75"</code> para
                        acciones; <code class="font-mono">stroke-width="2"</code> para indicadores
                        de selección (check, chevron). Tamaño
                        <code class="font-mono">w-4 h-4</code> (16 px) en el top bar.
                      </p>
                    </article>

                    <article class="border border-border-hairline rounded-md p-space-5">
                      <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">
                        Estados del chip de estado
                      </h3>
                      <table class="w-full text-body-sm">
                        <thead>
                          <tr class="text-left border-b border-border-hairline">
                            <th class="font-medium text-canvas-fg pb-space-2">Estado</th>
                            <th class="font-medium text-canvas-fg pb-space-2">Background</th>
                            <th class="font-medium text-canvas-fg pb-space-2">Foreground</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (s of statusChip; track s.label) {
                            <tr class="border-b border-border-hairline last:border-b-0">
                              <td class="py-space-2">
                                <span
                                  class="inline-flex items-center h-5 px-space-2 rounded-full text-body-sm font-medium"
                                  [style.background]="s.bg"
                                  [style.color]="s.fg"
                                  >{{ s.label }}</span
                                >
                              </td>
                              <td class="py-space-2 font-mono text-caption">{{ s.bg }}</td>
                              <td class="py-space-2 font-mono text-caption">{{ s.fg }}</td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </article>

                    <p class="text-caption text-neutral-500">
                      Convención: cuando un valor cambia en
                      <code class="font-mono">apps/site/src/styles/tokens.css</code>, esta tabla se
                      actualiza con un PR vinculado. Mantenemos paridad estricta con el archivo de
                      Figma — los seniors entran a la página y leen lo mismo que ven en el design.
                    </p>
                  </div>
                </afi-tab>
              </afi-tabs>
            </div>
          </div>

          <site-on-this-page [sections]="tocSections" />
        </div>
      </main>
    </div>
  `,
})
export class NavBarDecisionesPage {
  /** TOC anchors for the Decisiones tab. The other tabs are short enough to
   *  scan without sub-navigation, so the right-rail TOC focuses on the meaty
   *  one. Switching to another tab still shows the TOC; clicking a section
   *  scrolls within the page (and into a hidden anchor) which we accept as a
   *  small UX cost in exchange for the navigation aid on the long tab. */
  readonly tocSections: TocItem[] = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'ejemplo', label: 'Ejemplo anotado' },
    { id: 'callouts', label: 'Anatomía' },
    { id: 'navegacion', label: 'Navegación e identidad' },
    { id: 'estado', label: 'Estado' },
    { id: 'acciones', label: 'Acciones' },
    { id: 'layout', label: 'Layout y rol' },
  ];

  readonly callouts = [
    {
      n: 1,
      title: 'Menú de retorno',
      body: '<p>El botón combinado <em>chevron + lista</em> abre un menú con las planificaciones del cliente actual y la opción de volver al listado completo. Una sola affordance — chevron y list son el mismo botón.</p><p>El gestor maneja varias planificaciones por cliente (Histora-style). Desde aquí puede saltar entre simulaciones sin perder el contexto del cliente.</p>',
    },
    {
      n: 2,
      title: 'Identificador de la planificación',
      body: '<p>El nombre del cliente vive arriba como rótulo discreto. El ID (<code class="font-mono text-caption">SIM-2025-0011</code>) es el ancla de la planificación; pulsa el lápiz para renombrarlo inline — Enter guarda, Esc cancela. Cero modal, cero ruta nueva.</p>',
    },
    {
      n: 3,
      title: 'Estado',
      body: '<p>Chip clicable con cuatro estados: <em>Borrador · Cumplimentada · Descargada · Entregada al cliente</em>. Cada uno tiene su par de colores (neutro / azul / lavanda / verde) para que el progreso del plan se lea sin etiqueta. Click abre el menú de cambio; el cambio confirma con un toast deshacer.</p>',
    },
    {
      n: 4,
      title: 'Configuración',
      body: '<p>Engranaje a la derecha — abre un drawer no-bloqueante con la configuración global de la simulación: moneda, redondeo, perfil de riesgo, supuestos de inflación. Cambios se aplican al toda la sesión y se confirman con toast.</p>',
    },
  ];

  readonly userStories = [
    {
      id: 'HU-01',
      title: 'Volver al listado de planificaciones',
      priority: 'Must',
      story:
        'Como gestor, quiero volver al listado de mis planificaciones desde cualquier página de una simulación, para retomar otro plan sin perder el contexto del cliente actual.',
      criteria: [
        'Botón con icono chevron + lista en la esquina superior izquierda del top bar.',
        'Click navega a la ruta de listado configurada por la página padre.',
        'Tooltip "Cambiar planificación" en hover/focus si el dropdown no está abierto.',
        'Accesible por teclado (focus visible, Enter/Space activan).',
      ],
    },
    {
      id: 'HU-02',
      title: 'Cambiar a otra planificación del mismo cliente',
      priority: 'Must',
      story:
        'Como gestor, quiero abrir un dropdown con las planificaciones del cliente para saltar entre ellas sin pasar por el listado.',
      criteria: [
        'El dropdown muestra todas las planificaciones del cliente con su nombre + ID SIM.',
        'La plan actual se marca con un check.',
        'Seleccionar otra cambia el ID en el top bar y dispara un toast con deshacer.',
        'Esc cierra el dropdown sin cambiar nada.',
      ],
    },
    {
      id: 'HU-03',
      title: 'Renombrar la planificación in situ',
      priority: 'Must',
      story:
        'Como gestor, quiero corregir el nombre de la planificación pulsando un lápiz junto al ID, sin abrir un modal ni cambiar de página.',
      criteria: [
        'El lápiz convierte el ID en un input editable focado automáticamente.',
        'Enter guarda y cierra; Esc descarta el cambio y restaura el original.',
        'Si el nuevo nombre es vacío, no se aplica el cambio.',
        'Toast con deshacer aparece tras guardar correctamente.',
      ],
    },
    {
      id: 'HU-04',
      title: 'Cambiar el estado de la planificación',
      priority: 'Must',
      story:
        'Como gestor, quiero marcar la planificación como Borrador, Cumplimentada, Descargada o Entregada al cliente desde un chip clicable, para reflejar su progreso.',
      criteria: [
        'El chip del estado actúa como dropdown — abre menú con los 4 estados.',
        'Cada estado tiene su par de colores (background + foreground) consistente.',
        'Cambiar de estado dispara toast con deshacer.',
        'El estado seleccionado se marca con check en el menú.',
      ],
    },
    {
      id: 'HU-05',
      title: 'Tomar notas privadas sobre la simulación',
      priority: 'Must',
      story:
        'Como gestor, quiero anotar contexto, decisiones o pendientes sobre la simulación sin que el cliente los vea, manteniendo el gráfico/tabla a la vista mientras escribo.',
      criteria: [
        'Icono de cuaderno en el top bar abre un drawer no bloqueante (lado derecho).',
        'Drawer contiene textarea + botones Cancelar / Guardar.',
        'Guardar cierra el drawer y muestra toast de confirmación.',
        'Cerrar (Esc, click fuera, ✕) sin guardar mantiene el contenido en el drawer en futuras aperturas.',
      ],
    },
    {
      id: 'HU-06',
      title: 'Ajustar la configuración global de la simulación',
      priority: 'Should',
      story:
        'Como gestor, quiero ajustar moneda, redondeo, perfil de riesgo y supuestos de inflación, y que esos ajustes se apliquen a toda la simulación.',
      criteria: [
        'Icono de engranaje en el top bar abre un drawer con la configuración global.',
        'Cambios se aplican inmediatamente (todas las páginas reflejan los nuevos valores).',
        'El drawer permite revertir mientras está abierto sin guardar.',
        'Confirmación de cambio aplicada por toast.',
      ],
    },
    {
      id: 'HU-07',
      title: 'Deshacer cualquier cambio reciente',
      priority: 'Must',
      story:
        'Como gestor, quiero un botón "Deshacer" disponible cinco segundos después de cada cambio de estado, renombrado o switch de plan, para revertir un click accidental sin abrir un menú.',
      criteria: [
        'Toast aparece al fondo-centro de la pantalla.',
        'Auto-cierre a los 5 segundos; click en ✕ cierra antes.',
        'Click en "Deshacer" revierte el cambio y oculta el toast.',
        'role="status" + aria-live="polite" para anunciarse a screen readers.',
      ],
    },
  ];

  readonly technicalRequirements = [
    {
      title: 'Arquitectura',
      items: [
        'Componente standalone Angular 21+ con <code class="font-mono text-caption">ChangeDetectionStrategy.OnPush</code>.',
        'Estado local basado en <code class="font-mono text-caption">signal()</code> y <code class="font-mono text-caption">computed()</code>; evitar RxJS para estado transitorio del top bar.',
        'No depende de servicios — recibe rutas (decisionesRoute, listadoRoute) y nombre de cliente como inputs.',
        'Drawers reutilizan el primitivo <code class="font-mono text-caption text-action-700">afi-drawer</code> (no-modal, slide-in derecha).',
        'Toast reutiliza <code class="font-mono text-caption text-action-700">site-action-toast</code> (componente tonto, parent posee timer).',
      ],
    },
    {
      title: 'Dimensiones y layout',
      items: [
        'Altura fija <code class="font-mono text-caption">h-10</code> (40 px). El top bar nunca cambia de alto al editar/abrir dropdowns.',
        'Vive sólo sobre la columna de contenido — NO se extiende sobre el sidebar.',
        'Padding horizontal <code class="font-mono text-caption">px-space-4</code> (16 px) a cada lado.',
        'Border inferior hairline (<code class="font-mono text-caption">border-b border-border-hairline</code>) — nunca shadow.',
      ],
    },
    {
      title: 'Interacción',
      items: [
        'Atajos: Enter (guardar rename), Esc (cancelar rename / cerrar dropdown / cerrar drawer).',
        'Click fuera de un dropdown lo cierra. Sólo un dropdown abierto a la vez.',
        'Renombrar enfoca el input automáticamente con <code class="font-mono text-caption">queueMicrotask</code>.',
        'Toast mantiene undo callback en una variable privada y la limpia al hide().',
      ],
    },
    {
      title: 'Performance',
      items: [
        'Detección de cambios manual con OnPush — los signals notifican automáticamente.',
        'Sin watchers ni efectos en el constructor que disparen renderings adicionales.',
        'Tooltips renderizan via CSS (<code class="font-mono text-caption">opacity</code> + <code class="font-mono text-caption">group/tt:hover</code>) — sin JS de timing.',
      ],
    },
  ];

  readonly nonTechnicalRequirements = [
    {
      title: 'Accesibilidad — WCAG 2.1 AA',
      items: [
        'Cada botón con icono tiene <code class="font-mono text-caption">aria-label</code> explícito en español.',
        'Dropdowns con <code class="font-mono text-caption">role="menu"</code> + <code class="font-mono text-caption">aria-haspopup</code> + <code class="font-mono text-caption">aria-expanded</code>.',
        'Focus visible — outline de 2 px usando <code class="font-mono text-caption text-action-700">--border-focus</code>.',
        'Toast con <code class="font-mono text-caption">role="status"</code> + <code class="font-mono text-caption">aria-live="polite"</code>.',
        'Contraste mínimo 4.5:1 para texto del top bar; 3:1 para iconos sobre canvas.',
        'Soporte de <code class="font-mono text-caption">prefers-reduced-motion</code> — animaciones del toast y del drawer se desactivan.',
      ],
    },
    {
      title: 'Internacionalización',
      items: [
        'Toda la copy en español del producto (España).',
        'Strings extraíbles a archivo de traducción cuando llegue i18n del producto.',
        'Iconos sin texto cumplen con tooltip + aria-label en el idioma activo.',
      ],
    },
    {
      title: 'Comportamiento y políticas',
      items: [
        'Las notas son privadas — no se sincronizan con el cliente, no aparecen en exports.',
        'Cambios de estado no requieren confirmación previa; la red de seguridad es el toast con deshacer (5 s).',
        'No hay límite duro de caracteres en el ID renombrado, pero se recomienda guía visual a 24 caracteres.',
      ],
    },
    {
      title: 'Documentación',
      items: [
        'Cada cambio del top bar se registra en <a href="/novedades/bitacora" class="text-action-700 hover:underline">la bitácora</a> con fecha y motivo.',
        'Las decisiones de diseño viven en la pestaña <em>Decisiones</em> de esta misma página.',
      ],
    },
  ];

  readonly tokensContainer = [
    { property: 'Altura', token: 'h-10', value: '40 px' },
    { property: 'Fondo', token: 'bg-canvas-base', value: '#FFFFFF' },
    { property: 'Borde inferior', token: 'border-border-hairline', value: '1 px' },
    { property: 'Padding horizontal', token: 'px-space-4', value: '16 px' },
    { property: 'Gap left cluster', token: 'gap-space-3', value: '12 px' },
    { property: 'Gap right cluster', token: 'gap-[2px]', value: '2 px' },
  ];

  readonly tokensIconButton = [
    { property: 'Tamaño', token: 'w-7 h-7', value: '28 × 28 px' },
    { property: 'Radius', token: 'rounded', value: '4 px' },
    { property: 'Hover background', token: 'bg-surface-muted', value: 'rgba(0,0,0,0.04)' },
    { property: 'Color icono (idle)', token: 'text-neutral-600', value: '#525252' },
    { property: 'Color icono (hover)', token: 'text-canvas-fg', value: '#0F172A' },
    { property: 'Tamaño SVG', token: 'w-4 h-4', value: '16 × 16 px' },
    { property: 'Stroke width', token: '—', value: '1.75' },
  ];

  readonly icons = [
    { name: 'lucide:chevron-left', use: 'Volver al listado (botón combinado)' },
    { name: 'lucide:list', use: 'Abrir dropdown de planificaciones' },
    { name: 'lucide:pencil', use: 'Renombrar ID de planificación' },
    { name: 'lucide:check', use: 'Confirmar (rename, selección de plan)' },
    { name: 'lucide:x', use: 'Cancelar (rename, cerrar toast)' },
    { name: 'lucide:notebook-pen', use: 'Abrir drawer de notas' },
    { name: 'lucide:settings', use: 'Abrir drawer de configuración' },
    { name: 'lucide:undo-2', use: 'Acción de deshacer en toast' },
  ];

  readonly statusChip = [
    { label: 'Borrador', bg: '#EEEEEE', fg: '#525252' },
    { label: 'Cumplimentada', bg: '#DFF0FF', fg: '#0066AE' },
    { label: 'Descargada', bg: '#EFE6FE', fg: '#6B3BD6' },
    { label: 'Entregada al cliente', bg: '#DDF4E6', fg: '#187A47' },
  ];
}
