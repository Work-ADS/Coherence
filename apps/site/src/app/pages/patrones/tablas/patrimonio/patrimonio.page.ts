import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeaderComponent, TabsComponent, TabComponent } from '@coherence/ui';

import { SectionHeaderComponent } from '../../../novedades/shared/section-header.component';

/**
 * Tabla de Patrimonio — pattern showcase.
 *
 * Two tabs: Ejemplo (a thin demo) and Decisiones (the choices that make
 * the table readable). The full live example lives in
 * `/novedades/patrimonial` — this page documents *why* it looks the way
 * it does, so future contributors don't undo earlier decisions.
 */
@Component({
  selector: 'site-tabla-patrimonio-page',
  standalone: true,
  imports: [PageHeaderComponent, TabsComponent, TabComponent, SectionHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[1080px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-3">
        PATRONES / TABLAS
      </p>

      <afi-page-header
        title="Tabla de Patrimonio"
        subtitle="Decisiones de la tabla principal del Wealth Planner: secciones por clase de activo, columnas adaptadas a cada sección, separación clara entre bloques y menú de acciones por fila."
        [sticky]="false"
        [scrollFade]="false"
      />

      <div class="mt-space-8">
        <afi-tabs [lazy]="true" ariaLabel="Vistas de la pestaña Tabla de Patrimonio">
          <!-- ==================== EJEMPLO ==================== -->
          <afi-tab label="Ejemplo">
            <div class="py-space-6 flex flex-col gap-space-12">
              <section>
                <afi-section-header title="Activos de inversión" snippet="450 K € · 4 activos" />
                <div class="text-body-sm">
                  <div
                    class="grid grid-cols-[1fr_120px_120px_36px] gap-space-3 border-b border-border-hairline pb-space-2 font-medium"
                  >
                    <span>Nombre</span>
                    <span class="text-right">Valor</span>
                    <span class="text-right">Rentab.</span>
                    <span></span>
                  </div>
                  <div
                    class="grid grid-cols-[1fr_120px_120px_36px] gap-space-3 py-space-2 border-b border-border-hairline items-center"
                  >
                    <span class="font-medium text-canvas-fg">Cartera Cobas Selección</span>
                    <span class="text-right tabular-nums">180 000 €</span>
                    <span class="text-right tabular-nums text-system-success">+ 7,2 %</span>
                    <span class="text-neutral-400">⋮</span>
                  </div>
                  <div
                    class="grid grid-cols-[1fr_120px_120px_36px] gap-space-3 py-space-2 border-b border-border-hairline items-center"
                  >
                    <span class="font-medium text-canvas-fg">Fondo Bestinver Internacional</span>
                    <span class="text-right tabular-nums">120 000 €</span>
                    <span class="text-right tabular-nums text-system-success">+ 4,8 %</span>
                    <span class="text-neutral-400">⋮</span>
                  </div>
                </div>
              </section>

              <section>
                <afi-section-header
                  title="Patrimonio inmobiliario"
                  snippet="720 K € · 3 propiedades"
                />
                <div class="text-body-sm">
                  <div
                    class="grid grid-cols-[1fr_120px_120px_36px] gap-space-3 border-b border-border-hairline pb-space-2 font-medium"
                  >
                    <span>Propiedad</span>
                    <span class="text-right">Valor</span>
                    <span class="text-right">m²</span>
                    <span></span>
                  </div>
                  <div
                    class="grid grid-cols-[1fr_120px_120px_36px] gap-space-3 py-space-2 border-b border-border-hairline items-center"
                  >
                    <span class="font-medium text-canvas-fg">Vivienda habitual · Madrid</span>
                    <span class="text-right tabular-nums">420 000 €</span>
                    <span class="text-right tabular-nums">110</span>
                    <span class="text-neutral-400">⋮</span>
                  </div>
                </div>
              </section>

              <p class="text-body-sm text-neutral-500">
                Versión completa con filtros, tabs por sección y diálogo de añadir activo:
                <a href="/novedades/patrimonial" class="text-action-700 hover:underline"
                  >/novedades/patrimonial</a
                >.
              </p>
            </div>
          </afi-tab>

          <!-- ==================== DECISIONES ==================== -->
          <afi-tab label="Decisiones">
            <div class="py-space-6 flex flex-col gap-space-6">
              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center gap-space-2 mb-space-3">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Filas planas, sin esquinas redondeadas
                  </h2>
                </header>
                <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                  <p>
                    <strong class="text-canvas-fg">El problema.</strong> Filas con
                    <code class="font-mono text-caption">rounded-md</code> y un
                    <code class="font-mono text-caption">border-b</code> entre filas crean una
                    pequeña muesca donde la curva del corner choca con la línea inferior. La fila
                    parece "rota".
                  </p>
                  <p>
                    <strong class="text-canvas-fg">La regla.</strong> Tabla = filas planas,
                    separadas por hairline. Las esquinas redondeadas son para tarjetas; en tablas
                    resultan ruidosas y poco serias.
                  </p>
                </div>
              </article>

              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center gap-space-2 mb-space-3">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Separación entre secciones — 48 px y hairline del header
                  </h2>
                </header>
                <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                  <p>
                    <strong class="text-canvas-fg">Por qué 48 px.</strong> Con
                    <code class="font-mono text-caption">gap-space-8</code> (32 px) las secciones se
                    mezclan visualmente.
                    <code class="font-mono text-caption">gap-space-12</code> (48 px) crea una pausa
                    clara sin parecer disjoint.
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Sin divisores horizontales gruesos.</strong> El
                    hairline inferior del
                    <code class="font-mono text-caption text-action-700">afi-section-header</code>
                    ya marca el inicio de cada sección — añadir un divisor extra duplica el efecto y
                    satura la página.
                  </p>
                </div>
              </article>

              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center gap-space-2 mb-space-3">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Header de sección de dos líneas, no tres
                  </h2>
                </header>
                <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                  <p>
                    <strong class="text-canvas-fg">Antes.</strong> Cada sección mostraba
                    <em>"Activos de inversión / 450 K € / 4 activos · Total del segmento"</em> en
                    tres líneas. La tercera línea repetía información que el título ya implicaba.
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Ahora.</strong> Título + total. El conteo se
                    mueve a un pequeño badge tabular junto al título — visible sin saturar la
                    jerarquía.
                  </p>
                </div>
              </article>

              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center gap-space-2 mb-space-3">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">"Añadir" global, "Editar" por fila</h2>
                </header>
                <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                  <p>
                    <strong class="text-canvas-fg">El edit-mode toggle se eliminó.</strong> Pedirle
                    al usuario que recuerde un estado global ("¿estoy en modo edición ahora?") es
                    coste cognitivo. La acción primaria de la página es añadir activos — esa CTA
                    debe ser inmediata.
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Edit por fila va al menú de tres puntos.</strong>
                    Allí también viven Duplicar, Mover, Marcar como vendido y Eliminar (destructiva,
                    separada). Una sola superficie de acciones por fila.
                  </p>
                </div>
              </article>

              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center gap-space-2 mb-space-3">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">Columnas adaptadas a cada sección</h2>
                </header>
                <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                  <p>
                    <strong class="text-canvas-fg">No hay columnas universales.</strong> Las
                    inversiones quieren ver rentabilidad y horizonte; el inmobiliario quiere ver
                    superficie y ubicación; los planes de pensiones quieren ver fecha de rescate.
                    Forzar una grid común haría la mitad de las celdas estar vacías.
                  </p>
                  <p>
                    <strong class="text-canvas-fg"
                      >Cada sección define su propio array de
                      <code class="font-mono text-caption text-action-700">columns</code></strong
                    >, con anchura y alineación. La grid se construye con
                    <code class="font-mono text-caption">grid-template-columns</code> dinámico. La
                    cabecera de columna se renderiza una vez por sección.
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
export class TablaPatrimonioPage {}
