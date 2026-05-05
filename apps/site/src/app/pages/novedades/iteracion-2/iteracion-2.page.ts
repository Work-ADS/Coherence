import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent, PageHeaderComponent } from '@coherence/ui';

import { SectionHeaderComponent } from '../shared/section-header.component';
import { OnThisPageComponent, type TocItem } from '../shared/on-this-page.component';

type TaskStatus = 'Pendiente' | 'En curso' | 'Hecho';
type TaskSource = 'Reunión 4-may' | 'Comentario v1';

type Task = {
  text: string;
  status: TaskStatus;
  source: TaskSource;
  href?: string;
};

type Surface = {
  id: string;
  title: string;
  eyebrow: string;
  snippet: string;
  tasks: Task[];
};

@Component({
  selector: 'site-iteracion-2-page',
  standalone: true,
  imports: [
    RouterLink,
    BadgeComponent,
    PageHeaderComponent,
    SectionHeaderComponent,
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
        <span class="text-canvas-fg font-medium">Iteración 2</span>
      </div>

      <main class="flex-1 overflow-y-auto">
        <div class="max-w-[1200px] mx-auto py-space-10 flex gap-space-10">
          <div class="min-w-0 flex-1">
            <afi-page-header
              title="Wealth Planner — Iteración 2"
              subtitle="Alcance derivado de la reunión del 4 de mayo de 2026 más los comentarios anclados sobre la Iteración 1. Cada item indica su origen para que cualquier persona del equipo pueda rastrear el porqué del cambio."
              [sticky]="false"
              [scrollFade]="false"
            >
              <span slot="breadcrumb" class="uppercase tracking-wider text-action-700"
                >ITERACIÓN 2 · EN CURSO</span
              >
            </afi-page-header>

            <!-- ========== Primary CTA ========== -->
            <div class="mt-space-8 px-space-8">
              <a
                routerLink="/novedades/patrimonial"
                [queryParams]="{ version: 'v2' }"
                class="group flex items-center justify-between gap-space-4 px-space-5 py-space-4 rounded-md border border-action/40 bg-action/5 hover:bg-action/10 transition-colors"
              >
                <div class="min-w-0">
                  <p class="text-caption uppercase tracking-wider text-action-700 mb-space-1">
                    Propuesta visual
                  </p>
                  <p class="text-body-md font-medium text-canvas-fg">
                    Ver el nuevo diseño en /novedades/patrimonial
                  </p>
                  <p class="text-body-sm text-neutral-600 mt-space-1">
                    Abre la pantalla del Wealth Planner con la versión 2 seleccionada.
                  </p>
                </div>
                <svg
                  class="w-5 h-5 text-action-700 shrink-0 transition-transform group-hover:translate-x-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>

            <!-- ========== Summary ========== -->
            <div class="mt-space-10 px-space-8">
              <afi-section-header
                eyebrow="Resumen"
                title="Origen de las tareas"
                snippet="13 cambios — 8 de la reunión del 4-may (decisiones explícitas) y 5 de los comentarios anclados sobre la Iteración 1."
              />
              <div class="flex flex-wrap gap-space-2 mt-space-4">
                <afi-badge size="sm" intent="info">8 · Reunión 4-may</afi-badge>
                <afi-badge size="sm" intent="neutral">5 · Comentarios v1</afi-badge>
              </div>
            </div>

            <!-- ========== Surfaces / Checklist ========== -->
            <div class="mt-space-10 px-space-8 flex flex-col gap-space-12 pb-space-10">
              @for (s of surfaces; track s.id) {
                <article [id]="s.id">
                  <afi-section-header
                    [eyebrow]="s.eyebrow"
                    [title]="s.title"
                    [snippet]="s.snippet"
                  />

                  <ul class="flex flex-col">
                    @for (t of s.tasks; track t.text) {
                      <li
                        class="flex items-start gap-space-3 py-space-3 border-b border-border-hairline last:border-b-0"
                      >
                        <p class="text-body-sm text-canvas-fg min-w-0 flex-1 leading-relaxed">
                          <afi-badge
                            class="mr-space-2 align-baseline"
                            size="sm"
                            [intent]="
                              t.status === 'Hecho'
                                ? 'success'
                                : t.status === 'En curso'
                                  ? 'info'
                                  : 'neutral'
                            "
                          >
                            {{ t.status }}
                          </afi-badge>
                          <afi-badge
                            class="mr-space-2 align-baseline"
                            size="sm"
                            [intent]="t.source === 'Reunión 4-may' ? 'info' : 'neutral'"
                          >
                            {{ t.source }}
                          </afi-badge>
                          @if (t.href) {
                            <a [routerLink]="t.href" class="text-action-700 hover:underline">{{
                              t.text
                            }}</a>
                          } @else {
                            {{ t.text }}
                          }
                        </p>
                      </li>
                    }
                  </ul>
                </article>
              }

              <p class="text-caption text-neutral-500 pt-space-4 border-t border-border-hairline">
                Para añadir una tarea nueva: edita
                <code class="font-mono"
                  >apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts</code
                >
                y prepende un objeto al array
                <code class="font-mono">tasks</code> de la sección correspondiente.
              </p>
            </div>
          </div>

          <site-on-this-page [sections]="tocSections" />
        </div>
      </main>
    </div>
  `,
})
export class Iteracion2Page {
  get tocSections(): TocItem[] {
    return this.surfaces.map((s) => ({ id: s.id, label: s.title }));
  }

  readonly surfaces: Surface[] = [
    {
      id: 'sidebar',
      title: 'Navegación lateral',
      eyebrow: 'Sidebar · Prioridad #1',
      snippet:
        'En la reunión se acordó arrancar Iteración 2 por aquí — "yo empezaría cambiando el menú ese lo primero".',
      tasks: [
        {
          status: 'Pendiente',
          source: 'Reunión 4-may',
          text: 'Implementar el cambio del menú lateral primero — explícitamente priorizado como la primera tarea a abordar de la iteración.',
        },
      ],
    },
    {
      id: 'grafico',
      title: 'Evolución patrimonial',
      eyebrow: 'Gráfico',
      snippet:
        'Decisiones cerradas en la reunión sobre paleta, accesibilidad, leyenda y título dinámico — más el comentario abierto sobre escenarios.',
      tasks: [
        {
          status: 'Pendiente',
          source: 'Reunión 4-may',
          text: 'Adoptar la paleta monocromática (oscuro→claro) de Versión 2 para las barras apiladas. Versión 3 queda descartada.',
          href: '/novedades/evolucion-patrimonial',
        },
        {
          status: 'Pendiente',
          source: 'Reunión 4-may',
          text: 'Iterar la paleta v2 para mejorar contraste en los tonos claros — los seniors detectaron que se diluyen en la parte alta.',
          href: '/novedades/evolucion-patrimonial',
        },
        {
          status: 'Pendiente',
          source: 'Reunión 4-may',
          text: 'Aplicar criterio de accesibilidad: alto contraste con colores distintos o patrones — la escala monocromática por sí sola no cumple.',
        },
        {
          status: 'Pendiente',
          source: 'Reunión 4-may',
          text: 'Leyenda interactiva: hover sobre un item destaca su elemento en el gráfico y atenúa el resto, además del show/hide ya existente.',
          href: '/novedades/evolucion-patrimonial',
        },
        {
          status: 'Pendiente',
          source: 'Reunión 4-may',
          text: 'Añadir un título dinámico al gráfico — frase clave sobre el patrimonio proyectado en un hito (p. ej. jubilación). Wording exacto a definir.',
        },
        {
          status: 'Pendiente',
          source: 'Comentario v1',
          text: 'Fix scenarios — comentario anclado en /novedades/evolucion-patrimonial pendiente de resolución concreta.',
          href: '/novedades/evolucion-patrimonial',
        },
      ],
    },
    {
      id: 'tabla',
      title: 'Patrimonio · Tabla',
      eyebrow: 'Tabla',
      snippet:
        'Cinco comentarios anclados sobre la pantalla de Patrimonio en la Iteración 1 — todos requieren cambios en la tabla.',
      tasks: [
        {
          status: 'Pendiente',
          source: 'Comentario v1',
          text: 'Mostrar nombres de columna explícitos en la tabla — "no columns name".',
          href: '/novedades/patrimonial',
        },
        {
          status: 'Pendiente',
          source: 'Comentario v1',
          text: 'Simplificar el wording de las celdas y etiquetas — "make sentences simple".',
          href: '/novedades/patrimonial',
        },
        {
          status: 'Pendiente',
          source: 'Comentario v1',
          text: 'Mover el chevron a la derecha del texto — "move chevron to right of text".',
          href: '/novedades/patrimonial',
        },
        {
          status: 'Pendiente',
          source: 'Comentario v1',
          text: 'Ampliar el menú de tres puntos por fila con más opciones — "more options".',
          href: '/novedades/patrimonial',
        },
      ],
    },
    {
      id: 'dialogo',
      title: 'Diálogo · Añadir activo',
      eyebrow: 'Diálogo',
      snippet:
        'Dos compromisos cerrados en la reunión sobre el patrón de modales. La utilidad del preview lateral queda explícitamente diferida hasta evaluar con un caso real.',
      tasks: [
        {
          status: 'Pendiente',
          source: 'Reunión 4-may',
          text: 'Crear un ejemplo real con el número máximo de campos en el diálogo de añadir activo — evaluar si el preview lateral aporta antes de implementarlo en producción.',
          href: '/novedades/dialog-decisiones',
        },
        {
          status: 'Pendiente',
          source: 'Reunión 4-may',
          text: 'Mantener consistencia de diseño en los modales entre secciones — principio de diseño committeado para Iteración 2.',
        },
      ],
    },
  ];
}
