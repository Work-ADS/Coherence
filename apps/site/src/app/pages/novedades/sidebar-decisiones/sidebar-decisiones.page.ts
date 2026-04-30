import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KbdComponent, PageHeaderComponent, TabsComponent, TabComponent } from '@coherence/ui';

import { PlannerSidebarComponent } from '../shared/planner-sidebar.component';
import { OnThisPageComponent, type TocItem } from '../shared/on-this-page.component';

/**
 * Case study for the Wealth Planner sidebar.
 *
 * Covers: information architecture (6 sections), dark Azul variant (color +
 * contrast rationale), icons per nav item, collapsible interaction with
 * keyboard shortcut, and the decision to reuse the DS primitive via CSS-var
 * scope override rather than forking the component.
 */
@Component({
  selector: 'site-sidebar-decisiones-page',
  standalone: true,
  imports: [
    RouterLink,
    KbdComponent,
    PageHeaderComponent,
    TabsComponent,
    TabComponent,
    PlannerSidebarComponent,
    OnThisPageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        <span class="text-canvas-fg font-medium">Barra lateral</span>
      </div>

      <main class="flex-1 overflow-y-auto">
        <div class="max-w-[1200px] mx-auto py-space-10 flex gap-space-10">
          <div class="min-w-0 flex-1">
            <afi-page-header
              title="Barra lateral — decisiones"
              subtitle="Variante dark Azul del primitivo afi-sidebar. Grupos planos (sin acordeón) inspirados en Claude y Cursor, cada item con un indicador de estado — vacío, en progreso, completo. Colapsa con ⌘O / Ctrl+O. Sin forkear el primitivo."
              [sticky]="false"
              [scrollFade]="false"
            >
              <span slot="breadcrumb" class="uppercase tracking-wider text-action-700"
                >CASO DE ESTUDIO</span
              >
            </afi-page-header>

            <div class="mt-space-8 px-space-8 pb-space-10">
              <afi-tabs [lazy]="true" ariaLabel="Vistas del caso de estudio Barra lateral">
                <!-- ==================== DECISIONES ==================== -->
                <afi-tab label="Decisiones">
                  <div class="py-space-6 flex flex-col gap-space-8">
                    <!-- IA / secciones -->
                    <article
                      id="ia-secciones"
                      class="border border-border-hairline rounded-md p-space-6 scroll-mt-space-8"
                    >
                      <header class="flex items-center justify-between mb-space-3">
                        <div class="flex items-center gap-space-2">
                          <span class="text-caption uppercase tracking-wider text-system-success"
                            >Decidido</span
                          >
                          <h2 class="text-section text-canvas-fg">
                            Arquitectura de información — 6 secciones
                          </h2>
                        </div>
                      </header>
                      <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                        <p>
                          <strong class="text-canvas-fg">Por qué seccionar.</strong> 14 ítems planos
                          son imposibles de escanear. Agrupar por <em>fase del proceso</em> — lo que
                          tienes, lo que persigues, el diagnóstico, el plan, las conclusiones, el
                          informe — convierte una lista larga en una tabla de contenidos.
                        </p>
                        <p>
                          <strong class="text-canvas-fg">Orden narrativo.</strong> Las secciones
                          siguen el recorrido real del asesor con el cliente: primero levantamos el
                          patrimonio actual, luego los objetivos, luego diagnosticamos, luego
                          proponemos, luego concluimos y entregamos.
                        </p>
                        <p>
                          <strong class="text-canvas-fg">Grupos planos, sin acordeón.</strong> Nos
                          inspiramos en Claude y Cursor: el label de cada sección va suelto encima
                          de los items, sin chevron. Escaneable de un vistazo, sin clicks extra para
                          ver la estructura. Perder el plegado es barato porque el estado visual
                          (dot de cada item) ya resume dónde estás.
                        </p>
                      </div>
                      <div class="mt-space-5 pt-space-4 border-t border-border-hairline">
                        <p
                          class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3"
                        >
                          Ejemplo en vivo
                        </p>
                        <div
                          class="flex h-[520px] border border-border-hairline rounded-md overflow-hidden"
                        >
                          <site-planner-sidebar activeKey="evolucion-comparada" />
                          <div
                            class="flex-1 bg-surface-quiet flex items-center justify-center text-body-sm text-neutral-500"
                          >
                            <div class="flex flex-col items-center gap-space-2">
                              <span>Área de contenido</span>
                              <span
                                class="text-caption text-neutral-400 flex items-center gap-space-2"
                              >
                                Colapsa con
                                <afi-kbd [keys]="sidebarShortcut" size="sm" />
                                o click en el chevron
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>

                    <!-- Estado por item -->
                    <article
                      id="estado-item"
                      class="border border-border-hairline rounded-md p-space-6 scroll-mt-space-8"
                    >
                      <header class="flex items-center justify-between mb-space-3">
                        <div class="flex items-center gap-space-2">
                          <span class="text-caption uppercase tracking-wider text-system-success"
                            >Decidido</span
                          >
                          <h2 class="text-section text-canvas-fg">
                            Estado por item — tres niveles
                          </h2>
                        </div>
                      </header>
                      <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                        <p>
                          <strong class="text-canvas-fg">Por qué indicar estado.</strong> El asesor
                          entra y sale del plan a lo largo de varias sesiones. Sin una pista visual
                          de <em>dónde hay datos y dónde faltan</em>, tiene que abrir cada sección
                          para comprobarlo. El dot hace ese escaneo en 0,5 segundos.
                        </p>
                        <p>
                          <strong class="text-canvas-fg">Analogía con Claude Code.</strong> Claude
                          Code muestra el estado del turno — <em>idle</em>, <em>working</em>,
                          <em>needs permission</em> — junto a cada chat. Aquí hacemos lo mismo para
                          cada sección del plan: qué quedó vacío, qué está a medias, qué está listo.
                        </p>
                      </div>
                      <div class="mt-space-5 pt-space-4 border-t border-border-hairline">
                        <p
                          class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3"
                        >
                          Vocabulario
                        </p>
                        <ul class="flex flex-col gap-space-3 text-body-md">
                          <li class="flex items-center gap-space-3">
                            <span
                              class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-surface-quiet"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 16 16"
                                fill="none"
                                aria-hidden="true"
                              >
                                <circle
                                  cx="8"
                                  cy="8"
                                  r="5"
                                  stroke="currentColor"
                                  stroke-width="1.3"
                                  fill="none"
                                  opacity="0.5"
                                />
                              </svg>
                            </span>
                            <div>
                              <p class="text-canvas-fg font-medium">Vacío</p>
                              <p class="text-body-sm text-neutral-500">
                                Sección sin empezar. Ring hueco, muted. No demanda atención; está
                                ahí esperando cuando llegue su turno.
                              </p>
                            </div>
                          </li>
                          <li class="flex items-center gap-space-3">
                            <span
                              class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-surface-quiet"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 16 16"
                                fill="none"
                                aria-hidden="true"
                              >
                                <circle
                                  cx="8"
                                  cy="8"
                                  r="5.25"
                                  stroke="#37BBF4"
                                  stroke-width="1.4"
                                  fill="none"
                                />
                                <path d="M8 2.75 A 5.25 5.25 0 0 1 8 13.25 Z" fill="#37BBF4" />
                              </svg>
                            </span>
                            <div>
                              <p class="text-canvas-fg font-medium">En progreso</p>
                              <p class="text-body-sm text-neutral-500">
                                Datos iniciados pero incompletos — p.ej. has metido algún objetivo
                                pero falta detalle. Semicírculo Azul Afi: la sección pide seguir
                                trabajando.
                              </p>
                            </div>
                          </li>
                          <li class="flex items-center gap-space-3">
                            <span
                              class="inline-flex items-center gap-space-1 px-space-2 h-6 rounded-md bg-surface-quiet"
                              style="color:#22C55E"
                            >
                              <!-- users -->
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
                                <path d="M18 21a8 8 0 0 0-16 0" />
                                <circle cx="10" cy="8" r="5" />
                                <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
                              </svg>
                              <!-- wallet -->
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
                                <path
                                  d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
                                />
                                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                              </svg>
                              <!-- target -->
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
                                <circle cx="12" cy="12" r="6" />
                                <circle cx="12" cy="12" r="2" />
                              </svg>
                            </span>
                            <div>
                              <p class="text-canvas-fg font-medium">Completo</p>
                              <p class="text-body-sm text-neutral-500">
                                El anillo se reemplaza por el icono de lo que la sección
                                <em>es</em> (users, wallet, target…) en verde éxito. Un vistazo al
                                sidebar te dice qué está listo <em>y</em> qué contiene.
                              </p>
                            </div>
                          </li>
                        </ul>
                        <p class="mt-space-4 text-body-sm text-neutral-500 max-w-[640px]">
                          <strong class="text-canvas-fg">Activo ≠ estado.</strong>
                          &laquo;Activo&raquo; (el item que estás viendo ahora) y
                          &laquo;estado&raquo; (cuán completo está) son ejes independientes. Un item
                          activo puede estar vacío, en progreso o completo — se distingue con fondo
                          Azul suave + texto en negrita.
                        </p>
                      </div>
                    </article>

                    <!-- Color / contraste -->
                    <article
                      id="color-contraste"
                      class="border border-border-hairline rounded-md p-space-6 scroll-mt-space-8"
                    >
                      <header class="flex items-center justify-between mb-space-3">
                        <div class="flex items-center gap-space-2">
                          <span class="text-caption uppercase tracking-wider text-system-success"
                            >Decidido</span
                          >
                          <h2 class="text-section text-canvas-fg">
                            Color — Azul Profundo, inverso
                          </h2>
                        </div>
                      </header>
                      <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                        <p>
                          <strong class="text-canvas-fg">Por qué oscuro.</strong> La barra lateral
                          acompaña al usuario en toda la sesión — merece identidad visual fuerte. El
                          Azul Profundo (<code class="font-mono text-caption">#041F2C</code>) es el
                          navy del fondo del producto y asocia la navegación con la marca.
                        </p>
                        <p>
                          <strong class="text-canvas-fg">Por qué contraste.</strong> Separarla
                          cromáticamente del contenido deja claro qué es <em>navegación</em> y qué
                          es <em>datos</em>. La diferencia tonal reduce el rebote ocular entre una
                          zona y otra.
                        </p>
                        <p>
                          <strong class="text-canvas-fg">Sin forkear el primitivo.</strong> No
                          creamos
                          <code class="font-mono text-caption text-action-700"
                            >afi-sidebar-dark</code
                          >. Usamos el mismo
                          <code class="font-mono text-caption text-action-700">afi-sidebar</code>
                          envuelto en un scope de variables CSS:
                        </p>
                      </div>
                      <div class="mt-space-4 bg-surface-quiet rounded-md p-space-3 overflow-x-auto">
                        <pre
                          class="text-caption text-neutral-700 leading-relaxed"
                        ><code>&lt;div style="
  --surface-quiet: #041F2C;
  --canvas-fg: #ffffff;
  --border-hairline: rgba(255, 255, 255, 0.08);
  --color-neutral-500: rgba(255, 255, 255, 0.55);
  --color-neutral-600: rgba(255, 255, 255, 0.75);
  --action: #37BBF4;
  color: #ffffff;
"&gt;
  &lt;afi-sidebar mode="collapsible"&gt;...&lt;/afi-sidebar&gt;
&lt;/div&gt;</code></pre>
                      </div>
                      <p class="mt-space-3 text-body-sm text-neutral-500 max-w-[640px]">
                        Si mañana el equipo adopta la variante dark como estándar, la promovemos a
                        variante oficial del primitivo. Hasta entonces, los consumers la activan
                        mediante este scope — sin deuda técnica en la librería.
                      </p>
                    </article>

                    <!-- Iconos -->
                    <article
                      id="iconos"
                      class="border border-border-hairline rounded-md p-space-6 scroll-mt-space-8"
                    >
                      <header class="flex items-center justify-between mb-space-3">
                        <div class="flex items-center gap-space-2">
                          <span class="text-caption uppercase tracking-wider text-system-success"
                            >Decidido</span
                          >
                          <h2 class="text-section text-canvas-fg">
                            Iconos — anclajes para grupos, no decoración para items
                          </h2>
                        </div>
                      </header>
                      <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                        <p>
                          <strong class="text-canvas-fg">La regla.</strong> Un icono se gana su
                          sitio si quitarlo empeora la usabilidad. Si no, es decoración. En una
                          barra lateral densa con labels claros, repetir un icono junto a cada item
                          suma carga cognitiva sin añadir significado — el lector escanea el texto
                          de todos modos.
                        </p>
                        <p>
                          <strong class="text-canvas-fg"
                            >Estado expandido — solo iconos de sección.</strong
                          >
                          Reservamos los iconos para los <em>encabezados de sección</em> (Situación
                          actual, Objetivos, Diagnóstico…), donde sí actúan como anclas visuales en
                          una lista larga. Los items quedan en texto plano, mucho más rápidos de
                          escanear.
                        </p>
                        <p>
                          <strong class="text-canvas-fg"
                            >Estado colapsado — iconos por item.</strong
                          >
                          Cuando la barra colapsa a 52 px, el icono <em>es</em> el label: sin él no
                          hay navegación posible. La regla cambia con el estado de la UI, no con el
                          item. El tooltip al hover (label completo) cubre la duda.
                        </p>
                        <p>
                          <strong class="text-canvas-fg">Inspiración.</strong> El argumento se basa
                          en cómo Linear, Notion y la propia Claude Code tratan navegaciones densas:
                          jerarquía visual mediante <em>menos</em> elementos, no más. Un icono mal
                          puesto compite con el label; un icono bien puesto lo refuerza.
                        </p>
                      </div>
                    </article>

                    <!-- Colapsar / atajo -->
                    <article
                      id="colapsar"
                      class="border border-border-hairline rounded-md p-space-6 scroll-mt-space-8"
                    >
                      <header class="flex items-center justify-between mb-space-3">
                        <div class="flex items-center gap-space-2">
                          <span class="text-caption uppercase tracking-wider text-system-success"
                            >Decidido</span
                          >
                          <h2 class="text-section text-canvas-fg">
                            Colapsar — click y atajo de teclado
                          </h2>
                        </div>
                      </header>
                      <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                        <p>
                          <strong class="text-canvas-fg">Por qué colapsable.</strong> En pantallas
                          medianas con tablas densas, recuperar 220px de ancho marca la diferencia.
                          Al mismo tiempo, quien usa el producto todo el día quiere la navegación a
                          la vista por defecto.
                        </p>
                        <p>
                          <strong class="text-canvas-fg">Cómo.</strong> El primitivo en modo
                          <code class="font-mono text-caption text-action-700">collapsible</code>
                          trae el botón chevron propio, con transición de ancho 200ms ease-out. El
                          label se esconde con
                          <code class="font-mono text-caption">opacity + width</code>; los tooltips
                          toman el relevo cuando está colapsada.
                        </p>
                        <p>
                          <strong class="text-canvas-fg">Atajo.</strong>
                          <code class="font-mono text-caption">⌘O</code> en macOS,
                          <code class="font-mono text-caption">Ctrl+O</code> en Windows/Linux —
                          mnemotecnia: <em>O</em> de <em>open/close</em>. En un SPA dentro del
                          navegador, <code class="font-mono text-caption">⌘O</code> no choca con la
                          acción del browser (ese disparador no se propaga a la app).
                          <code class="font-mono text-caption">⌘\\</code>, que usan VS Code y
                          Cursor, sería una alternativa si se prefiere alinearse con los editores.
                        </p>
                      </div>
                      <div class="mt-space-5 pt-space-4 border-t border-border-hairline">
                        <p
                          class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3"
                        >
                          Atajo
                        </p>
                        <div class="flex items-center gap-space-2 text-body-sm">
                          <span class="text-neutral-600">Pulsa</span>
                          <afi-kbd [keys]="sidebarShortcut" size="sm" />
                          <span class="text-neutral-600"
                            >para abrir y cerrar la barra lateral en cualquier momento.</span
                          >
                        </div>
                      </div>
                    </article>
                  </div>
                </afi-tab>

                <!-- ==================== HISTORIAS DE USUARIO ==================== -->
                <afi-tab label="Historias de usuario">
                  <div class="py-space-6 flex flex-col gap-space-6">
                    <p class="text-body-md text-neutral-600 max-w-[640px]">
                      Escenarios reales del gestor que el sidebar tiene que soportar. Sirven como
                      criterio de aceptación para el handoff.
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
                      Restricciones de implementación que respetar para que el sidebar siga
                      consistente con el primitivo y con el resto del producto.
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
                      Accesibilidad, cognitive-load y políticas — todo lo que no es código pero sin
                      lo que el sidebar no se considera completo.
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
                      Tokens y dimensiones para reconstruir el sidebar en Figma sin abrir el código.
                      Cuando alguno cambie en el sistema, esta tabla y el componente cambian a la
                      vez.
                    </p>

                    <article class="border border-border-hairline rounded-md p-space-5">
                      <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">
                        Tokens — Sidebar contenedor
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
                        Estados del item de navegación
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
                          @for (s of navStates; track s.label) {
                            <tr class="border-b border-border-hairline last:border-b-0">
                              <td class="py-space-2 text-neutral-700">{{ s.label }}</td>
                              <td class="py-space-2 font-mono text-caption">{{ s.bg }}</td>
                              <td class="py-space-2 font-mono text-caption">{{ s.fg }}</td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </article>
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
export class SidebarDecisionesPage {
  readonly sidebarShortcut: string[] = ['⌘', 'O'];

  readonly tocSections: TocItem[] = [
    { id: 'ia-secciones', label: 'IA · 6 secciones' },
    { id: 'estado-item', label: 'Estado por item' },
    { id: 'color-contraste', label: 'Color · Azul Profundo' },
    { id: 'iconos', label: 'Iconos · grupos no items' },
    { id: 'colapsar', label: 'Colapsar · atajo' },
  ];

  readonly userStories = [
    {
      id: 'HU-01',
      title: 'Escanear el progreso del plan',
      priority: 'Must',
      story:
        'Como gestor, quiero ver de un vistazo qué secciones he rellenado y cuáles me faltan, sin abrir cada una.',
      criteria: [
        'Cada item obligatorio tiene un dot de estado a la derecha (vacío / en progreso / completo).',
        'Los dots solo aparecen en la sección "Situación actual" — el resto se infiere del sistema.',
        'El item activo se distingue con fondo azul suave + texto en negrita.',
      ],
    },
    {
      id: 'HU-02',
      title: 'Recuperar ancho de pantalla en sesiones intensas',
      priority: 'Must',
      story:
        'Como gestor, quiero colapsar el sidebar cuando trabajo con tablas anchas, manteniendo la navegación accesible vía iconos.',
      criteria: [
        'El sidebar tiene un botón chevron en la cabecera para colapsar / expandir.',
        'Atajo ⌘O / Ctrl+O hace lo mismo desde cualquier lugar del producto.',
        'En modo colapsado los items quedan reducidos a su icono; el label aparece como tooltip al hover/focus.',
        'La transición de ancho es 200 ms con respeto a prefers-reduced-motion.',
      ],
    },
    {
      id: 'HU-03',
      title: 'Saber en qué fase del proceso estoy',
      priority: 'Should',
      story:
        'Como gestor (especialmente nuevo), quiero ver la estructura del proceso de planificación reflejada en la navegación, no como una lista plana de 14 items.',
      criteria: [
        'El sidebar agrupa items en 6 secciones (Situación actual, Objetivos, Diagnóstico, Plan de acción, Conclusiones, Informe).',
        'Cada sección tiene una cabecera pequeña con label uppercase + icono ancla.',
        'El orden de las secciones refleja el recorrido real del asesor con el cliente.',
      ],
    },
    {
      id: 'HU-04',
      title: 'Identificar al gestor y la planificación al pie',
      priority: 'Should',
      story:
        'Como gestor, quiero ver mi nombre y rol siempre visibles en el pie del sidebar, para confirmar la sesión activa.',
      criteria: [
        'Avatar con iniciales (ej. "ET") + nombre + rol en el slot bottom del sidebar.',
        'En modo colapsado solo aparece el avatar; nombre/rol vía tooltip.',
        'Tipografía del rol distinta del nombre (uppercase tracked, más quieta) para reforzar jerarquía.',
      ],
    },
  ];

  readonly technicalRequirements = [
    {
      title: 'Arquitectura',
      items: [
        'Componente standalone Angular 21+ con <code class="font-mono text-caption">ChangeDetectionStrategy.OnPush</code>.',
        'Reusa el primitivo <code class="font-mono text-caption text-action-700">afi-sidebar</code> envuelto en un scope de variables CSS — no se forkea el primitivo.',
        'Estado <code class="font-mono text-caption">expanded</code> sincronizado con el primitivo via outputs.',
        'Sections array generado por <code class="font-mono text-caption">computed()</code>.',
      ],
    },
    {
      title: 'Dimensiones',
      items: [
        'Ancho expandido: <code class="font-mono text-caption">244px</code>. Ancho colapsado (rail): <code class="font-mono text-caption">52px</code>.',
        'Altura: 100% del viewport.',
        'Padding interno horizontal: <code class="font-mono text-caption">8px</code> (rail estrecho).',
      ],
    },
    {
      title: 'Interacción',
      items: [
        '<code class="font-mono text-caption">⌘O</code> / <code class="font-mono text-caption">Ctrl+O</code> alterna expansión desde cualquier lugar.',
        'Click en el chevron interno del primitivo también alterna.',
        'Tooltip en items colapsados aparece a la derecha; usa el patrón <code class="font-mono text-caption">.tt-pop-right</code> del scope.',
      ],
    },
  ];

  readonly nonTechnicalRequirements = [
    {
      title: 'Accesibilidad — WCAG 2.1 AA',
      items: [
        'Cada item tiene <code class="font-mono text-caption">aria-label</code> en español.',
        'Item activo marcado con <code class="font-mono text-caption">aria-current="page"</code>.',
        'Atajo ⌘O documentado vía <code class="font-mono text-caption">aria-keyshortcuts</code>.',
        'Contraste 4.5:1 mínimo entre items y fondo navy.',
        'Soporte de prefers-reduced-motion — la transición de ancho se desactiva.',
      ],
    },
    {
      title: 'Cognitive load',
      items: [
        'Iconos solo en cabeceras de grupo (no por item) en modo expandido — para evitar competir con labels claros.',
        'En colapsado los iconos vuelven a aparecer porque ahora son el label.',
        'Estado por item solo en la sección obligatoria; otras secciones lo perciberían como "trabajo pendiente" cuando son computadas.',
      ],
    },
    {
      title: 'Localización',
      items: [
        'Todas las cadenas en español (España).',
        'Strings extraíbles a archivo de traducción cuando llegue i18n del producto.',
      ],
    },
  ];

  readonly tokensContainer = [
    { property: 'Fondo', token: '--surface-quiet (override)', value: '#041F2C' },
    { property: 'Foreground', token: '--canvas-fg (override)', value: '#FFFFFF' },
    {
      property: 'Hairline',
      token: '--border-hairline (override)',
      value: 'rgba(255,255,255,0.08)',
    },
    { property: 'Acción', token: '--action (override)', value: '#37BBF4' },
    { property: 'Ancho expandido', token: '244px', value: '244 px' },
    { property: 'Ancho colapsado', token: '52px', value: '52 px' },
  ];

  readonly navStates = [
    { label: 'Idle', bg: 'transparent', fg: 'rgba(255,255,255,0.85)' },
    { label: 'Hover', bg: 'rgba(255,255,255,0.06)', fg: '#FFFFFF' },
    { label: 'Activo', bg: 'rgba(55,187,244,0.14)', fg: '#FFFFFF · 600' },
    { label: 'Focus visible', bg: 'transparent', fg: 'outline #37BBF4 · 2 px' },
  ];
}
