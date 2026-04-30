import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent, PageHeaderComponent } from '@coherence/ui';

import { SectionHeaderComponent } from '../shared/section-header.component';
import { OnThisPageComponent, type TocItem } from '../shared/on-this-page.component';

type IterationStatus = 'Hecho' | 'En curso' | 'Pendiente';

type LogChange = {
  area:
    | 'Sidebar'
    | 'Top bar'
    | 'Gráfico'
    | 'Tabla'
    | 'Patrones'
    | 'Pendientes'
    | 'Novedades'
    | 'Diálogo'
    | 'Docs';
  text: string;
  href?: string;
  status: IterationStatus;
};

type LogEntry = {
  date: string;
  meeting: string;
  context: string;
  changes: LogChange[];
};

/**
 * Bitácora de iteraciones — running decision log.
 *
 * Each meeting becomes an entry: date, who attended / what was discussed,
 * and a flat list of what landed (or didn't yet) in response. New entries
 * go on top. The goal is to give future contributors and stakeholders a
 * single place to read the trail of decisions without digging through PRs.
 */
@Component({
  selector: 'site-bitacora-page',
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
        <span class="text-canvas-fg font-medium">Bitácora</span>
      </div>

      <main class="flex-1 overflow-y-auto">
        <div class="max-w-[1200px] mx-auto py-space-10 flex gap-space-10">
          <div class="min-w-0 flex-1">
            <afi-page-header
              title="Bitácora de iteraciones"
              subtitle="Registro de qué cambió en cada revisión con los seniors. Cada entrada lista lo que se discutió, lo que se cambió en consecuencia y lo que quedó pendiente. Se actualiza después de cada reunión."
              [sticky]="false"
              [scrollFade]="false"
            >
              <span slot="breadcrumb" class="uppercase tracking-wider text-action-700"
                >DECISIONES EN HANDOFF</span
              >
            </afi-page-header>

            <div class="mt-space-10 px-space-8 flex flex-col gap-space-12 pb-space-10">
              @for (e of entries; track e.date + e.meeting) {
                <article [id]="anchorFor(e)">
                  <afi-section-header
                    [eyebrow]="e.date"
                    [title]="e.meeting"
                    [snippet]="e.context"
                  />

                  <ul class="flex flex-col">
                    @for (c of e.changes; track c.text + c.area) {
                      <li
                        class="flex items-start gap-space-3 py-space-3 border-b border-border-hairline last:border-b-0"
                      >
                        <p class="text-body-sm text-canvas-fg min-w-0 flex-1 leading-relaxed">
                          <afi-badge
                            class="mr-space-2 align-baseline"
                            size="sm"
                            [intent]="
                              c.status === 'Hecho'
                                ? 'success'
                                : c.status === 'En curso'
                                  ? 'info'
                                  : 'neutral'
                            "
                          >
                            {{ c.status }}
                          </afi-badge>
                          <afi-badge class="mr-space-2 align-baseline" size="sm" intent="neutral">
                            {{ c.area }}
                          </afi-badge>
                          @if (c.href) {
                            <a [routerLink]="c.href" class="text-action-700 hover:underline">{{
                              c.text
                            }}</a>
                          } @else {
                            {{ c.text }}
                          }
                        </p>
                      </li>
                    }
                  </ul>
                </article>
              }

              <p class="text-caption text-neutral-500 pt-space-4 border-t border-border-hairline">
                Para añadir una entrada nueva: edita
                <code class="font-mono"
                  >apps/site/src/app/pages/novedades/bitacora/bitacora.page.ts</code
                >
                y prepende un objeto al array <code class="font-mono">entries</code>.
              </p>
            </div>
          </div>

          <site-on-this-page [sections]="tocSections" />
        </div>
      </main>
    </div>
  `,
})
export class BitacoraPage {
  anchorFor(e: LogEntry): string {
    return (
      'iter-' +
      e.date.replace(/-/g, '') +
      '-' +
      e.meeting
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 24)
    );
  }

  get tocSections(): TocItem[] {
    return this.entries.map((e) => ({ id: this.anchorFor(e), label: e.meeting }));
  }

  readonly entries: LogEntry[] = [
    {
      date: '2026-04-28',
      meeting: 'Iteración 5 — template de case-study + arreglos finos',
      context:
        'Quinta pasada: las case-study no eran navegables por dentro y los tags del changelog no se sentían parte del texto. Convertimos la página de Top bar en plantilla — identidad arriba, ejemplo anotado con números, accordion con anatomía, y secciones temáticas (Navegación · Estado · Acciones · Layout). Replicar al resto.',
      changes: [
        {
          status: 'Hecho',
          area: 'Top bar',
          text: 'Botón de notas eliminado del top bar — saturaba la barra y la información cabe mejor en el blog del caso. Solo queda el engranaje de Configuración.',
          href: '/novedades/patrimonial',
        },
        {
          status: 'Hecho',
          area: 'Docs',
          text: 'Plantilla nueva para case-study en Top bar · Decisiones — identidad del componente arriba, ejemplo en vivo con callouts numerados, accordion explicando cada número, y decisiones agrupadas en Navegación · Estado · Acciones · Layout.',
          href: '/novedades/nav-bar-decisiones',
        },
        {
          status: 'Hecho',
          area: 'Patrones',
          text: 'Primitivo afi-tabs reparado para que cambie de pestaña sin requerir two-way binding del padre.',
        },
        {
          status: 'Hecho',
          area: 'Docs',
          text: 'Bitácora — tags Hecho/En curso/Pendiente y área (Diálogo, Docs, Gráfico…) ahora son afi-badge a tamaño body-sm, alineados con el texto del cambio.',
          href: '/novedades/bitacora',
        },
        {
          status: 'Hecho',
          area: 'Diálogo',
          text: 'Decisión de "Cabecera tipo Stripe" actualizada al nuevo patrón footer-con-acciones (Cancelar + Guardar abajo, sin acciones en la cabecera).',
          href: '/novedades/dialog-decisiones',
        },
        {
          status: 'En curso',
          area: 'Pendientes',
          text: 'Replicar la nueva plantilla a sidebar-decisiones, dialog-decisiones, patrimonial-decisiones y evolucion-patrimonial-decisiones.',
        },
      ],
    },
    {
      date: '2026-04-28',
      meeting: 'Iteración 4 — handoff y navegación de la documentación',
      context:
        'Cuarta pasada centrada en el handoff: las case-study no eran navegables, el diálogo demo tenía typography rota, y la bitácora no se sentía alineada con el resto.',
      changes: [
        {
          status: 'Hecho',
          area: 'Diálogo',
          text: 'Footer del diálogo demo (Añadir activo) reordenado a Cancelar + Guardar alineados a la derecha; el atajo ⎋ Esc va dentro del botón Cancelar como hint, ya no compite tipográficamente con la primaria.',
          href: '/novedades/dialog-decisiones',
        },
        {
          status: 'Hecho',
          area: 'Docs',
          text: 'Componente "En esta página" — TOC sticky shadcn-style en el rail derecho (visible a partir de xl). Resalta la sección activa y hace smooth-scroll al click.',
        },
        {
          status: 'Hecho',
          area: 'Docs',
          text: 'Bitácora — alineación de container y typography arreglados: page header al borde, area labels a tamaño normal, layout con TOC al lado.',
          href: '/novedades/bitacora',
        },
        {
          status: 'Hecho',
          area: 'Docs',
          text: 'Top bar (nav-bar-decisiones) — layout ampliado a 1200 px con TOC al lado de las 5 pestañas PRD.',
          href: '/novedades/nav-bar-decisiones',
        },
        {
          status: 'Hecho',
          area: 'Docs',
          text: 'Barra lateral (sidebar-decisiones) — replicada estructura PRD: Decisiones / Historias de usuario (4 HU) / Requisitos técnicos / Requisitos no técnicos / Especificaciones Figma. TOC también visible.',
          href: '/novedades/sidebar-decisiones',
        },
        {
          status: 'En curso',
          area: 'Pendientes',
          text: 'Replicar PRD-tabs + TOC a dialog-decisiones, patrimonial-decisiones y evolucion-patrimonial-decisiones.',
        },
      ],
    },
    {
      date: '2026-04-28',
      meeting: 'Iteración 3 — color y deuda en el gráfico',
      context:
        'Pase rápido sobre la versión final de la propuesta: las barras negativas no se distinguían de las positivas, y los seniors quieren ver alternativas de paleta más allá de V1 sin perder la versión actual.',
      changes: [
        {
          status: 'Hecho',
          area: 'Gráfico',
          text: 'Cualquier valor negativo (deuda) renderiza en rojo (#C81E1E), incluido en modo apilado por tipo de activo — un total negativo colapsa a un único segmento rojo "Deuda" porque la deuda es deuda independiente del tipo.',
          href: '/novedades/evolucion-patrimonial',
        },
        {
          status: 'Hecho',
          area: 'Gráfico',
          text: 'Paletas por versión — V1 mantiene el navy original; V2 amplía el rango azul para distinguir mejor cada tipo de activo; V3 mezcla acentos de marca (afi-azul, afi-verde, ámbar, púrpura) para máxima diferenciación.',
          href: '/novedades/evolucion-patrimonial',
        },
        {
          status: 'Hecho',
          area: 'Novedades',
          text: 'Bitácora de iteraciones — esta página. Registro vivo del trail de decisiones, accesible desde la cabecera de "Decisiones en handoff".',
          href: '/novedades/bitacora',
        },
        {
          status: 'Hecho',
          area: 'Pendientes',
          text: 'PRD-tabs en la barra superior — primer caso de estudio con Decisiones / Historias de usuario / Requisitos técnicos / Requisitos no técnicos / Especificaciones Figma. Plantilla para replicar en sidebar, dialog, patrimonial y evolución.',
          href: '/novedades/nav-bar-decisiones',
        },
      ],
    },
    {
      date: '2026-04-28',
      meeting: 'Iteración 2 — refinamiento sobre la propuesta',
      context:
        'Segunda pasada de feedback tras una semana usando la versión inicial. Foco en separación visual de secciones, layouts del gráfico y reorganización de Novedades.',
      changes: [
        {
          status: 'Hecho',
          area: 'Gráfico',
          text: 'V1 / V2 / V3 ahora comparten la misma control bar (selectores + Ajustes popup + Accesibilidad). Cambia la posición de la barra, no su contenido.',
          href: '/novedades/evolucion-patrimonial',
        },
        {
          status: 'Hecho',
          area: 'Gráfico',
          text: 'V2 usa botones icon-only (filtros + accesibilidad) para caber en línea con la cabecera de sección.',
          href: '/novedades/evolucion-patrimonial',
        },
        {
          status: 'Hecho',
          area: 'Tabla',
          text: 'Títulos de sección — "Liquidez · 2 activos" ahora a tamaño body-sm + neutral-700, jerarquía más legible.',
          href: '/novedades/patrimonial',
        },
        {
          status: 'Hecho',
          area: 'Gráfico',
          text: 'Cabecera del gráfico — label y comparison también a neutral-700; label en font-medium.',
          href: '/novedades/evolucion-patrimonial',
        },
        {
          status: 'Hecho',
          area: 'Novedades',
          text: 'Landing reorganizada en dos secciones: Ejemplos (pantallas reales) y Decisiones en handoff (casos de estudio).',
          href: '/novedades',
        },
        {
          status: 'Hecho',
          area: 'Novedades',
          text: 'Bitácora de iteraciones — esta página. Registro vivo del trail de decisiones.',
        },
        {
          status: 'En curso',
          area: 'Pendientes',
          text: 'Tabs PRD en cada caso de estudio: Decisiones · Historias de usuario · Requisitos técnicos · Requisitos no técnicos · Figma. Empezando por nav-bar.',
          href: '/novedades/nav-bar-decisiones',
        },
        {
          status: 'Pendiente',
          area: 'Gráfico',
          text: 'Explicar el sombreado ±15 % / ±30 % de la vista comparada en el caso de estudio del gráfico.',
        },
        {
          status: 'Pendiente',
          area: 'Gráfico',
          text: 'Series de deudas en rojo (barras negativas) + línea de neto encima.',
        },
        {
          status: 'Pendiente',
          area: 'Gráfico',
          text: 'Variantes de tooltip (A original / B con neto + deudas).',
        },
        {
          status: 'Pendiente',
          area: 'Gráfico',
          text: 'Objetivos sacados del canvas a una franja sobre el eje X con conector visual.',
        },
        {
          status: 'Pendiente',
          area: 'Tabla',
          text: 'Cards de impacto en el diálogo de añadir activo (patrimonio neto, edad de retiro, objetivos cubiertos).',
        },
        {
          status: 'Pendiente',
          area: 'Tabla',
          text: 'Más filas de ejemplo en el diálogo, incluyendo una con nombre muy largo para validar truncado.',
        },
        {
          status: 'Pendiente',
          area: 'Tabla',
          text: 'Menú de tres puntos por fila — Editar / Duplicar / Mover / Marcar vendido / Eliminar.',
        },
      ],
    },
    {
      date: '2026-04-21',
      meeting: 'Iteración 1 — primera revisión con seniors',
      context:
        'Revisión de la propuesta inicial del Wealth Planner V3. La nueva UI fue aprobada en general; los seniors dejaron una lista de refinamientos transversales (sidebar, top bar, gráfico, tabla, cabeceras de sección).',
      changes: [
        {
          status: 'Hecho',
          area: 'Sidebar',
          text: 'Indicadores de estado (vacío / en progreso / completo) sólo en la sección obligatoria "Situación actual".',
          href: '/novedades/sidebar-decisiones',
        },
        {
          status: 'Hecho',
          area: 'Sidebar',
          text: 'Cortado del label "Wealth planner" — eliminado tracking-wide.',
          href: '/novedades/sidebar-decisiones',
        },
        {
          status: 'Hecho',
          area: 'Sidebar',
          text: 'Iconos sólo en cabeceras de grupo (no por item) en estado expandido. En colapsado siguen porque el icono es el label.',
          href: '/novedades/sidebar-decisiones',
        },
        {
          status: 'Hecho',
          area: 'Top bar',
          text: 'Lápiz de renombrar pegado al ID de simulación (sub-flex con gap-1).',
          href: '/novedades/nav-bar-decisiones',
        },
        {
          status: 'Hecho',
          area: 'Top bar',
          text: 'Icono de compartir eliminado — no forma parte del flujo del planner.',
        },
        {
          status: 'Hecho',
          area: 'Top bar',
          text: 'Drawer de configuración (Ajustes globales) cableado al icono del engranaje.',
          href: '/novedades/patrimonial',
        },
        {
          status: 'Hecho',
          area: 'Top bar',
          text: 'Drawer de notas cableado al icono del cuaderno con textarea + Guardar/Cancelar.',
          href: '/novedades/patrimonial',
        },
        {
          status: 'Hecho',
          area: 'Gráfico',
          text: 'Toggle de versiones top-right (V1/V2/V3) para experimentar layouts en revisión.',
        },
        {
          status: 'Hecho',
          area: 'Gráfico',
          text: 'Leyenda de sombreado de escenarios cuando aplica (vista comparada o todos).',
        },
        {
          status: 'Hecho',
          area: 'Tabla',
          text: 'Toggle "Editar" eliminado — la edición por fila va al menú de tres puntos; la acción primaria es "Añadir activo".',
        },
        {
          status: 'Hecho',
          area: 'Tabla',
          text: 'Separación entre secciones — gap-space-12 (48 px).',
        },
        {
          status: 'Hecho',
          area: 'Tabla',
          text: 'Esquinas planas en filas — eliminado rounded-md (chocaba con el border-b).',
        },
        {
          status: 'Hecho',
          area: 'Tabla',
          text: 'Cabecera de sección reducida a dos líneas (eliminado "Total del segmento" redundante).',
        },
        {
          status: 'Hecho',
          area: 'Tabla',
          text: 'Toggle de versiones top-right (V1/V2/V3) — V1 con los fixes de esta iteración, V2/V3 listos para próximas exploraciones.',
        },
        {
          status: 'Hecho',
          area: 'Patrones',
          text: 'Nuevo patrón Cabecera de sección — tier intermedio entre page header y contenido (label + título + snippet + slot trailing + hairline inferior).',
          href: '/patrones/cabeceras/cabecera-de-seccion',
        },
        {
          status: 'Hecho',
          area: 'Patrones',
          text: 'Nuevo patrón Tabla de Patrimonio — documenta filas planas, separación, columnas dinámicas, menú por fila.',
          href: '/patrones/tablas/patrimonio',
        },
      ],
    },
  ];
}
