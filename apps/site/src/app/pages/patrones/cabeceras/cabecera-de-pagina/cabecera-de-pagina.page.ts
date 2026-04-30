import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  BadgeComponent,
  ButtonComponent,
  PageHeaderComponent,
  StatusChipComponent,
  TabsComponent,
  TabComponent,
} from '@coherence/ui';

/**
 * Cabecera de página — pattern showcase.
 *
 * Documents the full page-chrome template: top bar + page header +
 * action bar + data metrics row + tabs. Consumers compose only the
 * sections they need.
 *
 * Two tabs:
 *   - Ejemplo: realistic rendered mock ("Patrimonio" page) showing
 *     all chrome sections assembled.
 *   - Decisiones: one card per section explaining why it exists and
 *     when to turn it on or off.
 */
@Component({
  selector: 'site-cabecera-de-pagina-page',
  standalone: true,
  imports: [
    BadgeComponent,
    ButtonComponent,
    PageHeaderComponent,
    StatusChipComponent,
    TabsComponent,
    TabComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[1080px] mx-auto px-space-10 py-space-10">
      <!-- Kicker -->
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-3">
        PATRONES / CABECERAS
      </p>

      <!-- Our own page header (simple usage: title + subtitle) -->
      <afi-page-header
        title="Cabecera de página"
        subtitle="Plantilla de cromo de página para el producto. Cinco secciones componibles: top bar, cabecera, acciones, métricas y tabs. No todas se usan siempre — cada página enciende lo que necesita."
        [sticky]="false"
        [scrollFade]="false"
      />

      <div class="mt-space-8">
        <afi-tabs [lazy]="true" ariaLabel="Vistas de la pestaña Cabecera de página">
          <!-- ==================== EJEMPLO ==================== -->
          <afi-tab label="Ejemplo">
            <div class="py-space-6">
              <p class="text-body-sm text-neutral-500 mb-space-3">
                Mock realista de la plantilla aplicada a la página <em>Patrimonio</em>. Todas las
                secciones encendidas.
              </p>

              <!-- Page mock container -->
              <div class="border border-border-hairline rounded-md overflow-hidden bg-canvas-base">
                <!-- 1. TOP BAR (simulation-level chrome) -->
                <div
                  class="flex items-center justify-between border-b border-border-hairline px-space-4 h-10 bg-surface-quiet"
                >
                  <div class="flex items-center gap-space-3 text-body-sm text-canvas-fg">
                    <button
                      type="button"
                      class="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-surface-100 text-neutral-500"
                      aria-label="Volver"
                    >
                      <svg
                        class="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-surface-100 text-neutral-500"
                      aria-label="Lista de planificaciones"
                    >
                      <svg
                        class="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M3 5h14v2H3zM3 9h14v2H3zM3 13h14v2H3z" />
                      </svg>
                    </button>
                    <span class="font-medium">ID planificación: SIM-2025-0011</span>
                    <button
                      type="button"
                      class="inline-flex items-center justify-center w-5 h-5 rounded hover:bg-surface-100 text-neutral-500"
                      aria-label="Editar identificador"
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                        />
                      </svg>
                    </button>
                    <afi-status-chip estado="borrador" size="sm" />
                  </div>
                  <div class="flex items-center gap-space-1">
                    <button
                      type="button"
                      class="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-surface-100 text-neutral-500"
                      aria-label="Notas"
                    >
                      <svg
                        class="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H4zm7 1.5V7a2 2 0 002 2h3.5L11 3.5zM5 11h10v1H5v-1zm0 3h7v1H5v-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-surface-100 text-neutral-500"
                      aria-label="Ajustes globales de la simulación"
                    >
                      <svg
                        class="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- 2-3-4. PAGE HEADER: title/subtitle + action bar + data metrics row -->
                <div class="px-space-6 py-space-5">
                  <!-- Title + subtitle -->
                  <h2 class="text-title text-canvas-fg">Patrimonio</h2>
                  <p class="text-body text-neutral-500 mt-space-2 max-w-[720px]">
                    Gestiona y visualiza todos tus activos y pasivos. Aquí puedes agregar, modificar
                    y analizar tus inversiones, inmuebles, cuentas bancarias y más, para tener una
                    visión completa de tu patrimonio financiero.
                  </p>

                  <!-- Action bar: chips (left) + search + primary action (right) -->
                  <div class="mt-space-5 flex items-center gap-space-3 flex-wrap">
                    <!-- Page-level filter chips -->
                    <div class="flex items-center gap-space-2">
                      <button
                        type="button"
                        class="inline-flex items-center gap-space-2 pl-space-3 pr-space-3 py-space-1 border border-border-hairline rounded-full text-body-sm text-canvas-fg hover:bg-surface-100"
                      >
                        <span
                          class="w-4 h-4 rounded-full border border-neutral-400 flex items-center justify-center text-caption text-neutral-500"
                          >⊗</span
                        >
                        <span>Entidad</span>
                        <span class="text-neutral-400">|</span>
                        <span class="text-action-700">Todos</span>
                        <svg
                          class="w-3 h-3 text-neutral-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="inline-flex items-center px-space-3 py-space-1 border border-border-hairline rounded-full text-body-sm text-canvas-fg hover:bg-surface-100"
                      >
                        Min €
                      </button>
                      <button
                        type="button"
                        class="inline-flex items-center px-space-3 py-space-1 border border-border-hairline rounded-full text-body-sm text-canvas-fg hover:bg-surface-100"
                      >
                        Max €
                      </button>
                    </div>

                    <!-- Search + primary action -->
                    <div class="ml-auto flex items-center gap-space-2">
                      <div class="relative">
                        <svg
                          class="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <input
                          type="text"
                          placeholder="Buscar en patrimonio..."
                          class="h-9 w-[280px] pl-8 pr-3 text-body-sm rounded-md border border-border-hairline bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                          aria-label="Buscar en patrimonio"
                        />
                      </div>
                      <afi-button variant="primary" size="sm">
                        <span class="inline-flex items-center gap-1">
                          <svg
                            class="w-3.5 h-3.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            />
                          </svg>
                          Añadir
                        </span>
                      </afi-button>
                    </div>
                  </div>

                  <!-- Divider -->
                  <div class="mt-space-5 pt-space-5 border-t border-border-hairline">
                    <!-- Data metrics row -->
                    <div class="grid grid-cols-3 gap-space-6">
                      <div>
                        <p class="text-body-sm text-neutral-500 mb-space-1">Patrimonio total</p>
                        <p class="text-section text-canvas-fg">1.240.000 €</p>
                        <p class="text-body-sm text-neutral-500 mt-space-1">Patrimonio invertido</p>
                      </div>
                      <div>
                        <p class="text-body-sm text-neutral-500 mb-space-1">
                          Rentabilidad esperada
                        </p>
                        <p class="text-section text-canvas-fg">
                          5,4 <span class="text-body text-neutral-500">%</span>
                        </p>
                        <p class="text-body-sm text-neutral-500 mt-space-1">Anual estimada</p>
                      </div>
                      <div>
                        <p class="text-body-sm text-neutral-500 mb-space-1">Perfil seleccionado</p>
                        <div><afi-badge intent="info">Moderado</afi-badge></div>
                        <p class="text-body-sm text-neutral-500 mt-space-1">
                          Tolerancia al riesgo media
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Tabs row (page views) -->
                  <div class="mt-space-5">
                    <div
                      class="flex items-end gap-space-5 border-b border-border-hairline overflow-x-auto"
                    >
                      <button
                        class="inline-flex items-center gap-space-2 pb-space-2 -mb-px border-b-2 border-action text-action font-medium text-body-sm"
                      >
                        <span>Todos</span>
                        <span
                          class="inline-flex items-center justify-center px-1.5 min-w-[22px] h-5 rounded-full border border-border-hairline text-caption text-neutral-500"
                          >19</span
                        >
                      </button>
                      @for (t of mockTabs; track t.label) {
                        <button
                          class="inline-flex items-center gap-space-2 pb-space-2 -mb-px border-b-2 border-transparent text-neutral-500 hover:text-canvas-fg text-body-sm whitespace-nowrap"
                        >
                          <span>{{ t.label }}</span>
                          <span
                            class="inline-flex items-center justify-center px-1.5 min-w-[22px] h-5 rounded-full border border-border-hairline text-caption text-neutral-500"
                            >{{ t.count }}</span
                          >
                        </button>
                      }
                    </div>
                  </div>
                </div>
              </div>

              <p class="text-body-sm text-neutral-500 mt-space-4 max-w-[720px]">
                Encendidas: top bar, title + subtitle, action bar (chips + búsqueda + primary),
                divisor, datos, tabs. Las secciones no necesarias se apagan sin cambiar el resto del
                cromo.
              </p>

              <!-- Variantes — three canonical configurations -->
              <div class="mt-space-10">
                <h3 class="text-section text-canvas-fg mb-space-2">Variantes</h3>
                <p class="text-body-md text-neutral-600 mb-space-6 max-w-[640px]">
                  La plantilla no se impone: cada página enciende sólo lo que necesita. Tres
                  configuraciones canónicas cubren la mayoría de casos.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-space-4">
                  <!-- Minimal -->
                  <div class="border border-border-hairline rounded-md overflow-hidden">
                    <div
                      class="px-space-4 py-space-3 border-b border-border-hairline bg-surface-quiet"
                    >
                      <p class="text-caption uppercase tracking-wider text-action-700">Mínima</p>
                      <p class="text-body-sm font-medium text-canvas-fg mt-space-1">
                        Título + subtítulo
                      </p>
                    </div>
                    <div class="p-space-4 bg-canvas-base min-h-[180px]">
                      <p class="text-body font-medium text-canvas-fg">Detalle de póliza</p>
                      <p class="text-body-sm text-neutral-500 mt-space-1">
                        Resumen del producto y estado actual.
                      </p>
                      <div
                        class="mt-space-4 h-[60px] border border-dashed border-border-hairline rounded-md flex items-center justify-center text-caption text-neutral-500"
                      >
                        contenido
                      </div>
                    </div>
                    <p
                      class="text-caption text-neutral-500 px-space-4 py-space-2 border-t border-border-hairline"
                    >
                      Para páginas de detalle simples sin acciones ni vistas múltiples.
                    </p>
                  </div>

                  <!-- Standard -->
                  <div class="border border-border-hairline rounded-md overflow-hidden">
                    <div
                      class="px-space-4 py-space-3 border-b border-border-hairline bg-surface-quiet"
                    >
                      <p class="text-caption uppercase tracking-wider text-action-700">Estándar</p>
                      <p class="text-body-sm font-medium text-canvas-fg mt-space-1">
                        + Acciones + Tabs
                      </p>
                    </div>
                    <div class="p-space-4 bg-canvas-base min-h-[180px]">
                      <p class="text-body font-medium text-canvas-fg">Evolución patrimonial</p>
                      <p class="text-body-sm text-neutral-500 mt-space-1">
                        Vista comparada entre escenarios.
                      </p>
                      <div class="mt-space-3 flex items-center gap-space-2">
                        <span
                          class="inline-flex items-center gap-1 px-space-2 py-space-1 border border-border-hairline rounded-full text-caption text-canvas-fg"
                          >Vista</span
                        >
                        <span
                          class="inline-flex items-center gap-1 px-space-2 py-space-1 border border-border-hairline rounded-full text-caption text-canvas-fg"
                          >Escenario</span
                        >
                      </div>
                      <div
                        class="mt-space-3 flex gap-space-3 border-b border-border-hairline pb-space-1"
                      >
                        <span
                          class="text-caption text-action border-b-2 border-action -mb-px pb-space-1"
                          >Ejemplo</span
                        >
                        <span class="text-caption text-neutral-500 -mb-px pb-space-1"
                          >Decisiones</span
                        >
                      </div>
                    </div>
                    <p
                      class="text-caption text-neutral-500 px-space-4 py-space-2 border-t border-border-hairline"
                    >
                      Páginas con filtros de página y vistas múltiples. Sin métricas.
                    </p>
                  </div>

                  <!-- Full -->
                  <div class="border border-border-hairline rounded-md overflow-hidden">
                    <div
                      class="px-space-4 py-space-3 border-b border-border-hairline bg-surface-quiet"
                    >
                      <p class="text-caption uppercase tracking-wider text-action-700">Completa</p>
                      <p class="text-body-sm font-medium text-canvas-fg mt-space-1">
                        Todo encendido
                      </p>
                    </div>
                    <div class="p-space-4 bg-canvas-base min-h-[180px]">
                      <p class="text-body font-medium text-canvas-fg">Patrimonio</p>
                      <p class="text-body-sm text-neutral-500 mt-space-1">
                        Gestiona tus activos y pasivos.
                      </p>
                      <div class="mt-space-3 flex items-center gap-space-2">
                        <span
                          class="inline-flex items-center gap-1 px-space-2 py-space-1 border border-border-hairline rounded-full text-caption text-canvas-fg"
                          >Entidad</span
                        >
                        <span
                          class="inline-flex items-center gap-1 px-space-2 py-space-1 border border-border-hairline rounded-full text-caption text-canvas-fg"
                          >Min €</span
                        >
                      </div>
                      <div
                        class="mt-space-3 pt-space-2 border-t border-border-hairline grid grid-cols-3 gap-space-2"
                      >
                        <div>
                          <p class="text-caption text-neutral-500">Total</p>
                          <p class="text-body-sm font-medium">1,24M€</p>
                        </div>
                        <div>
                          <p class="text-caption text-neutral-500">Renta.</p>
                          <p class="text-body-sm font-medium">5,4%</p>
                        </div>
                        <div>
                          <p class="text-caption text-neutral-500">Perfil</p>
                          <p class="text-body-sm font-medium">Moderado</p>
                        </div>
                      </div>
                    </div>
                    <p
                      class="text-caption text-neutral-500 px-space-4 py-space-2 border-t border-border-hairline"
                    >
                      Listados con contexto agregado — dashboards, vistas de cartera.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </afi-tab>

          <!-- ==================== DECISIONES ==================== -->
          <afi-tab label="Decisiones">
            <div class="py-space-6 flex flex-col gap-space-8">
              <!-- Why page chrome -->
              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center justify-between mb-space-3">
                  <div class="flex items-center gap-space-2">
                    <span class="text-caption uppercase tracking-wider text-system-success"
                      >Decidido</span
                    >
                    <h2 class="text-section text-canvas-fg">Por qué una plantilla de cabecera</h2>
                  </div>
                </header>
                <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[720px]">
                  <p>
                    <strong class="text-canvas-fg">Consistencia cognitiva.</strong> Si cada página
                    coloca el título, las acciones y las tabs en sitios distintos, el usuario paga
                    un coste de aprendizaje por cada vista. Una plantilla común reduce ese coste a
                    cero: el ojo ya sabe dónde mirar.
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Reconocimiento del producto.</strong> La cabecera
                    es lo primero que se ve en cada página — es la cara del producto. Una cabecera
                    coherente refuerza la identidad de marca (serif + espacio + cromo mínimo) sin
                    repetir decisiones.
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Componible, no prescriptiva.</strong> Cinco
                    secciones opcionales. La página enciende sólo las que necesita. Una página de
                    lista usa top bar + header + tabs; una página de detalle sencilla puede usar
                    sólo título + subtítulo.
                  </p>
                </div>
              </article>

              <!-- Top bar -->
              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center justify-between mb-space-3">
                  <div class="flex items-center gap-space-2">
                    <span class="text-caption uppercase tracking-wider text-system-success"
                      >Decidido</span
                    >
                    <h2 class="text-section text-canvas-fg">Top bar — contexto global</h2>
                  </div>
                  <span class="text-caption text-neutral-500">Opcional</span>
                </header>
                <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[720px]">
                  <p>
                    <strong class="text-canvas-fg">Qué contiene.</strong> Identidad de la
                    simulación, estado editable, y acciones globales (notas, ajustes, historial).
                    Nada relacionado con la página actual — sólo el "dónde estoy" a nivel sistema.
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Por qué arriba.</strong> La navegación global va
                    por encima del contenido por convención web. Al ser siempre visible, funciona
                    como ancla de retorno y como indicador de estado.
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Iconos + tooltip.</strong> A la derecha, iconos
                    con tooltip en hover (patrón NavItem) — reduce ancho horizontal y deja las
                    acciones de página respirando en la cabecera.
                  </p>
                </div>
              </article>

              <!-- Page header (title + subtitle) -->
              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center justify-between mb-space-3">
                  <div class="flex items-center gap-space-2">
                    <span class="text-caption uppercase tracking-wider text-system-success"
                      >Decidido</span
                    >
                    <h2 class="text-section text-canvas-fg">Título y subtítulo — siempre</h2>
                  </div>
                  <span class="text-caption text-neutral-500">Obligatorio</span>
                </header>
                <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[720px]">
                  <p>
                    <strong class="text-canvas-fg">Título</strong> —
                    <code class="font-mono text-action-700">text-title</code>
                    (32/40, Roboto Serif 500). Es la única sección no opcional. Sin título no hay
                    página.
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Subtítulo</strong> — una frase que explique qué
                    hace la página. Descarga al usuario de suponer. Si no se puede resumir en una
                    frase, probablemente la página tiene más de un propósito.
                  </p>
                </div>
              </article>

              <!-- Action bar -->
              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center justify-between mb-space-3">
                  <div class="flex items-center gap-space-2">
                    <span class="text-caption uppercase tracking-wider text-system-success"
                      >Decidido</span
                    >
                    <h2 class="text-section text-canvas-fg">
                      Barra de acciones — chips + búsqueda + primary
                    </h2>
                  </div>
                  <span class="text-caption text-neutral-500">Opcional</span>
                </header>
                <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[720px]">
                  <p>
                    <strong class="text-canvas-fg">Chips a la izquierda.</strong> Son filtros o
                    settings a nivel página — modifican qué ve el usuario en toda la página, no sólo
                    en un widget. Usamos la misma regla que los filtros de gráfico: máximo 3
                    visibles, el resto a un panel secundario.
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Búsqueda a la derecha.</strong> Se restringe al
                    ámbito de la página (<em>"Buscar en patrimonio…"</em>) — no es búsqueda global.
                    Placeholder explícito recuerda el ámbito.
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Primary action al extremo derecho.</strong> La
                    acción más importante de la página — una sola. Si aparecen varias, alguna no es
                    primaria: pásala al panel de Ajustes o a un menú secundario.
                  </p>
                </div>
              </article>

              <!-- Data metrics row -->
              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center justify-between mb-space-3">
                  <div class="flex items-center gap-space-2">
                    <span class="text-caption uppercase tracking-wider text-action-700"
                      >Propuesto</span
                    >
                    <h2 class="text-section text-canvas-fg">
                      Fila de métricas — contexto antes de las tabs
                    </h2>
                  </div>
                  <span class="text-caption text-neutral-500">Opcional</span>
                </header>
                <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[720px]">
                  <p>
                    <strong class="text-canvas-fg">Por qué.</strong> Antes de entrar a navegar por
                    tabs, el usuario necesita una foto agregada: cuánto, a qué ritmo, con qué
                    perfil. Son las 2–4 métricas que respondan las preguntas frecuentes de esta
                    página sin forzar a cambiar de tab.
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Por qué no cards.</strong> Sin contenedor
                    visible, igual que la cabecera del gráfico. Label pequeño → valor grande → nota
                    de contexto. El divisor horizontal arriba separa "settings de página" (acciones)
                    de "datos de página" (métricas).
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Cuándo apagar.</strong> En páginas que son sólo
                    una lista (sin agregados), o cuando el contenido principal YA es una métrica
                    (dashboards puros).
                  </p>
                </div>
              </article>

              <!-- Tabs -->
              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center justify-between mb-space-3">
                  <div class="flex items-center gap-space-2">
                    <span class="text-caption uppercase tracking-wider text-system-success"
                      >Decidido</span
                    >
                    <h2 class="text-section text-canvas-fg">Tabs — vistas de página</h2>
                  </div>
                  <span class="text-caption text-neutral-500">Opcional</span>
                </header>
                <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[720px]">
                  <p>
                    <strong class="text-canvas-fg">Para qué.</strong> Particionar el mismo ámbito en
                    slices. En Patrimonio las tabs son el TIPO de activo; en Evolución Patrimonial
                    son la vista (Ejemplo / Decisiones). No se usan para navegar a otras
                    <em>páginas</em> — eso es el rol del sidebar.
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Contadores.</strong> Cada tab incluye el número
                    de elementos que contiene — anticipa el peso informativo antes del click.
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Cuándo apagar.</strong> Si hay una sola vista.
                    Nada de tabs fantasma.
                  </p>
                </div>
              </article>
            </div>
          </afi-tab>
        </afi-tabs>
      </div>
    </div>
  `,
})
export class CabeceraDePaginaPage {
  readonly mockTabs = [
    { label: 'Liquidez', count: 2 },
    { label: 'Inversiones', count: 5 },
    { label: 'Inmobiliario', count: 2 },
    { label: 'Private equity', count: 2 },
    { label: 'Planes de pensiones y EPSV', count: 1 },
    { label: 'Participaciones', count: 2 },
    { label: 'Otro', count: 1 },
  ];
}
