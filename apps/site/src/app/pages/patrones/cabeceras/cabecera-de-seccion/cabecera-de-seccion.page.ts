import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeaderComponent, TabsComponent, TabComponent } from '@coherence/ui';

import { SectionHeaderComponent } from '../../../novedades/shared/section-header.component';

/**
 * Cabecera de sección — pattern showcase.
 *
 * The middle tier between page header and content. Title (16 px / 600) +
 * optional eyebrow + optional one-line snippet, with a quiet bottom hairline
 * so each section reads as contained without re-introducing card chrome.
 */
@Component({
  selector: 'site-cabecera-de-seccion-page',
  standalone: true,
  imports: [PageHeaderComponent, TabsComponent, TabComponent, SectionHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[1080px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-3">
        PATRONES / CABECERAS
      </p>

      <afi-page-header
        title="Cabecera de sección"
        subtitle="El tier intermedio entre la cabecera de página y el contenido. Identifica una sección dentro de una página sin recurrir a contenedores tipo tarjeta. Pensado para páginas largas con varias secciones (gráfico → tabla → cards) donde queremos jerarquía sin exceso de cromo."
        [sticky]="false"
        [scrollFade]="false"
      />

      <div class="mt-space-8">
        <afi-tabs [lazy]="true" ariaLabel="Vistas de la pestaña Cabecera de sección">
          <!-- ==================== EJEMPLO ==================== -->
          <afi-tab label="Ejemplo">
            <div class="py-space-6 flex flex-col gap-space-10">
              <!-- Ejemplo 1: solo título -->
              <section>
                <afi-section-header title="Activos de inversión" />
                <p class="text-body-sm text-neutral-500">
                  Aquí iría el contenido de la sección — una tabla, un gráfico, una lista de cards…
                </p>
              </section>

              <!-- Ejemplo 2: título + snippet -->
              <section>
                <afi-section-header
                  title="Evolución patrimonial"
                  snippet="Cómo evoluciona tu patrimonio año a año bajo el escenario seleccionado."
                />
                <p class="text-body-sm text-neutral-500">
                  Aquí iría el gráfico de evolución, ya con el contexto explicado encima.
                </p>
              </section>

              <!-- Ejemplo 3: con eyebrow -->
              <section>
                <afi-section-header
                  eyebrow="Diagnóstico"
                  title="Estrategias recomendadas"
                  snippet="Tres estrategias para alcanzar los objetivos planteados con el menor riesgo posible."
                />
                <p class="text-body-sm text-neutral-500">
                  El eyebrow ancla la sección dentro del recorrido del usuario.
                </p>
              </section>

              <!-- Ejemplo 4: con acciones en el slot trailing -->
              <section>
                <afi-section-header
                  title="Patrimonio inmobiliario"
                  snippet="3 propiedades · 720 K €"
                >
                  <button
                    type="button"
                    class="inline-flex items-center justify-center h-8 px-space-3 rounded-md border border-border-hairline text-body-sm hover:bg-surface-100"
                  >
                    Filtrar
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center h-8 px-space-3 rounded-md bg-action-700 text-white text-body-sm font-medium hover:bg-action-700/90"
                  >
                    + Añadir
                  </button>
                </afi-section-header>
                <p class="text-body-sm text-neutral-500">
                  Las acciones de sección se proyectan al lado derecho del header.
                </p>
              </section>
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
                    Tier de peso visual entre body y page title
                  </h2>
                </header>
                <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                  <p>
                    <strong class="text-canvas-fg">Por qué.</strong> Sin contenedores tipo tarjeta,
                    las secciones de una página densa tienden a fundirse. La sección necesita un
                    tier propio — más fuerte que el body pero más liviano que el title de página —
                    para que el lector escanee de un vistazo dónde empieza una sección nueva.
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Cómo.</strong>
                    <code class="font-mono text-caption text-action-700">text-body-lg-600</code> (16
                    px / 600) es exactamente el peso que falta entre body (16/400) y section
                    (20/500). Color
                    <code class="font-mono text-caption text-action-700">text-canvas-fg</code> (no
                    neutral) para empujar el contraste.
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Hairline inferior, no contenedor.</strong> Una
                    línea de 1 px bajo el título da el efecto de "sección" sin reintroducir cromo de
                    tarjeta — preserva la sensación aireada que validaron los seniors.
                  </p>
                </div>
              </article>

              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center gap-space-2 mb-space-3">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">Snippet de una línea, no párrafo</h2>
                </header>
                <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                  <p>
                    <strong class="text-canvas-fg">Una sola línea.</strong> El snippet es un
                    recordatorio sobre qué muestra la sección, no una explicación. La explicación va
                    en otro sitio (subtítulo de página, tooltip, página de Decisiones del patrón).
                  </p>
                  <p>
                    <strong class="text-canvas-fg">Verbo + objeto + restricción.</strong> "Cómo
                    evoluciona tu patrimonio año a año bajo el escenario seleccionado." Identifica
                    qué se ve, en qué unidad, bajo qué filtros. Si el snippet supera la línea,
                    recorta el contexto del filtro — los selects ya lo dicen.
                  </p>
                </div>
              </article>

              <article class="border border-border-hairline rounded-md p-space-6">
                <header class="flex items-center gap-space-2 mb-space-3">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">Slot derecho para acciones de sección</h2>
                </header>
                <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                  <p>
                    <strong class="text-canvas-fg">Acciones, badges, filtros.</strong> El slot
                    derecho proyecta lo que la sección concreta necesita — un "Añadir" para una
                    tabla, un "Filtrar" para una lista, un badge "3 nuevos" para un feed.
                    Manteniendo el slot mínimo (gap-space-2, sin envoltorio) cada página decide su
                    densidad.
                  </p>
                  <p>
                    <strong class="text-canvas-fg">No saturar.</strong> Si el slot acumula 4+
                    controles, la sección probablemente necesita su propia toolbar debajo. La
                    cabecera de sección no es lugar para complejidad — es para identidad.
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
export class CabeceraDeSeccionPage {}
