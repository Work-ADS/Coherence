import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeaserTileComponent } from '../../components/teaser-tile/teaser-tile.component';
import { SectionHeaderComponent } from './shared/section-header.component';

@Component({
  selector: 'site-novedades-landing',
  standalone: true,
  imports: [RouterLink, TeaserTileComponent, SectionHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">NOVEDADES</p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">Novedades propuestas en curso</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-10">
        Páginas completas del producto aplicando la nueva identidad visual V3, agrupadas en dos
        bloques: los <em>Ejemplos</em> son las pantallas reales del Wealth Planner;
        <em>Decisiones en handoff</em> recoge los casos de estudio — los blogs PRD que explican el
        porqué de cada decisión.
      </p>

      <!-- ========== Ejemplos ========== -->
      <afi-section-header
        eyebrow="Ejemplos"
        title="Pantallas reales del Wealth Planner"
        snippet="Composiciones completas — sidebar + top bar + página — listas para revisión."
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4 mb-space-12">
        <!-- Patrimonio · Ejemplo -->
        <site-teaser-tile
          title="Patrimonio · Ejemplo"
          href="/novedades/patrimonial"
          description="Página completa de patrimonio — acciones de página, métricas, pestañas de activos y tablas desglosadas."
        >
          <div slot="preview" class="w-full h-full flex flex-col p-space-3 gap-space-2">
            <p class="text-body-sm font-serif text-canvas-fg leading-tight">Patrimonio</p>
            <div class="flex items-center gap-space-2">
              <div>
                <p class="text-caption text-neutral-500 leading-none">Total</p>
                <p class="text-caption text-canvas-fg font-medium">1,24 M €</p>
              </div>
              <div>
                <p class="text-caption text-neutral-500 leading-none">Renta.</p>
                <p class="text-caption text-canvas-fg font-medium">5,4%</p>
              </div>
            </div>
            <div class="flex gap-space-2 text-caption border-b border-border-hairline pb-[2px]">
              <span class="text-action border-b-2 border-action -mb-[2px] pb-[1px]">Todos</span>
              <span class="text-neutral-500">Liquidez</span>
              <span class="text-neutral-500">Invers.</span>
            </div>
            <div class="flex flex-col gap-[2px]">
              @for (_ of [0, 1]; track $index) {
                <div class="flex items-center justify-between text-caption">
                  <span class="w-16 h-1.5 rounded-sm bg-neutral-200"></span>
                  <span class="w-10 h-1.5 rounded-sm bg-neutral-200"></span>
                </div>
              }
            </div>
          </div>
        </site-teaser-tile>

        <!-- Evolución patrimonial · Ejemplo -->
        <site-teaser-tile
          title="Evolución patrimonial · Ejemplo"
          href="/novedades/evolucion-patrimonial"
          description="Página completa con la cabecera flotante, los filtros por zonas y el gráfico monocromático interactivo."
        >
          <div slot="preview" class="w-full h-full flex flex-col justify-between p-space-3">
            <div>
              <p class="text-caption text-neutral-500">Evolución patrimonial</p>
              <p class="text-body-sm font-serif text-canvas-fg leading-tight mt-0.5">1,28 M €</p>
            </div>
            <div class="flex items-end gap-[2px] h-[40px]">
              @for (h of barHeights; track $index) {
                <div
                  class="flex-1 rounded-sm"
                  [style.height.%]="h"
                  style="background: var(--action-700)"
                ></div>
              }
            </div>
          </div>
        </site-teaser-tile>
      </div>

      <!-- ========== Decisiones en handoff ========== -->
      <afi-section-header
        eyebrow="Decisiones en handoff"
        title="Casos de estudio — el porqué de cada decisión"
        snippet="Blogs PRD para handoff: requisitos, opciones evaluadas, decisión final, referencias externas."
      >
        <a
          routerLink="/novedades/bitacora"
          class="inline-flex items-center gap-space-1 h-8 px-space-3 rounded-md border border-border-hairline text-body-sm text-canvas-fg hover:bg-surface-muted transition-colors"
        >
          <svg
            class="w-4 h-4 text-neutral-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
          Bitácora de iteraciones
        </a>
      </afi-section-header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4">
        <!-- Patrimonio · Decisiones -->
        <site-teaser-tile
          title="Patrimonio · Decisiones"
          href="/novedades/patrimonial-decisiones"
          description="Caso de estudio: top bar, cabecera, acciones, métricas, pestañas y tablas. Incluye la alternativa inline para filtros página-vs-sección."
        >
          <div
            slot="preview"
            class="w-full h-full flex items-center justify-center overflow-hidden p-space-4"
          >
            <div class="relative w-[130px] h-[80px]">
              <div
                class="absolute inset-0 translate-x-[6px] translate-y-[6px] bg-surface-elevated border border-border-hairline rounded"
              ></div>
              <div
                class="absolute inset-0 translate-x-[3px] translate-y-[3px] bg-surface-elevated border border-border-hairline rounded"
              ></div>
              <div
                class="absolute inset-0 bg-surface-elevated border border-border-hairline rounded p-space-2 flex flex-col gap-space-1"
              >
                <div class="flex items-center gap-space-1">
                  <span class="w-1 h-1 rounded-full bg-system-success"></span>
                  <div class="h-[3px] w-14 bg-canvas-fg/70 rounded-full"></div>
                </div>
                <div class="h-[3px] w-full bg-neutral-200 rounded-full"></div>
                <div class="h-[3px] w-11/12 bg-neutral-200 rounded-full"></div>
                <div class="h-[3px] w-3/4 bg-neutral-200 rounded-full"></div>
                <div class="h-[3px] w-5/6 bg-neutral-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </site-teaser-tile>

        <!-- Evolución patrimonial · Decisiones -->
        <site-teaser-tile
          title="Evolución patrimonial · Decisiones"
          href="/novedades/evolucion-patrimonial-decisiones"
          description="Caso de estudio: por qué cada decisión (cabecera, filtros, paleta, leyenda, hitos, hover) con sus referencias externas."
        >
          <div
            slot="preview"
            class="w-full h-full flex items-center justify-center overflow-hidden p-space-4"
          >
            <div class="relative w-[130px] h-[80px]">
              <div
                class="absolute inset-0 translate-x-[6px] translate-y-[6px] bg-surface-elevated border border-border-hairline rounded"
              ></div>
              <div
                class="absolute inset-0 translate-x-[3px] translate-y-[3px] bg-surface-elevated border border-border-hairline rounded"
              ></div>
              <div
                class="absolute inset-0 bg-surface-elevated border border-border-hairline rounded p-space-2 flex flex-col gap-space-1"
              >
                <div class="flex items-center gap-space-1">
                  <span class="w-1 h-1 rounded-full bg-system-success"></span>
                  <div class="h-[3px] w-14 bg-canvas-fg/70 rounded-full"></div>
                </div>
                <div class="h-[3px] w-full bg-neutral-200 rounded-full"></div>
                <div class="h-[3px] w-11/12 bg-neutral-200 rounded-full"></div>
                <div class="h-[3px] w-3/4 bg-neutral-200 rounded-full"></div>
                <div class="h-[3px] w-5/6 bg-neutral-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </site-teaser-tile>

        <!-- Barra lateral · Decisiones -->
        <site-teaser-tile
          title="Barra lateral · Decisiones"
          href="/novedades/sidebar-decisiones"
          description="Variante dark Azul del primitivo afi-sidebar. Arquitectura en 6 secciones, iconos solo en grupos (no por item), atajo ⌘O — todo sin forkear el primitivo."
        >
          <div slot="preview" class="w-full h-full flex">
            <div
              class="w-[70px] p-space-2 flex flex-col gap-[3px] text-[10px] text-white"
              style="background: #041F2C;"
            >
              <div class="flex items-center gap-1">
                <div class="w-3 h-3 rounded-sm bg-white/60"></div>
                <span class="text-[8px] font-light truncate">Wealth</span>
              </div>
              <div class="h-px bg-white/15 my-1"></div>
              @for (item of sidebarNav; track item) {
                <div
                  class="flex items-center gap-1 py-[1px]"
                  [class.bg-white]="item.active"
                  [class.rounded]="item.active"
                  [class.px-1]="item.active"
                >
                  <span
                    class="text-[8px]"
                    [class.text-white]="!item.active"
                    [class.text-[#041F2C]]="item.active"
                    >{{ item.icon }}</span
                  >
                  <span
                    class="truncate text-[8px]"
                    [class.text-white]="!item.active"
                    [class.text-[#041F2C]]="item.active"
                    [class.opacity-80]="!item.active"
                    >{{ item.label }}</span
                  >
                </div>
              }
            </div>
            <div class="flex-1 bg-surface-quiet"></div>
          </div>
        </site-teaser-tile>

        <!-- Top bar · Decisiones -->
        <site-teaser-tile
          title="Top bar · Decisiones"
          href="/novedades/nav-bar-decisiones"
          description="Chrome global de la simulación. Anatomía izquierda-derecha, iconos con tooltip, drawers de configuración y notas, y por qué el top bar vive al lado del sidebar, no sobre él."
        >
          <div slot="preview" class="w-full h-full flex flex-col">
            <div
              class="h-6 bg-surface-elevated border-b border-border-hairline flex items-center justify-between px-space-2 text-[10px]"
            >
              <div class="flex items-center gap-1">
                <span class="text-neutral-500">←</span>
                <span class="text-neutral-500">≡</span>
                <span class="text-canvas-fg font-medium">SIM-2025-0011</span>
                <span class="px-1 py-[1px] rounded bg-neutral-100 text-neutral-600 text-[8px]"
                  >Borrador</span
                >
              </div>
              <div class="flex items-center gap-1 text-neutral-500">
                <span>📝</span>
                <span>⚙</span>
              </div>
            </div>
            <div class="flex-1 flex">
              <div class="w-[40px]" style="background: #041F2C;"></div>
              <div class="flex-1 bg-canvas-base"></div>
            </div>
          </div>
        </site-teaser-tile>

        <!-- Diálogo · Decisiones -->
        <site-teaser-tile
          title="Diálogo · Decisiones"
          href="/novedades/dialog-decisiones"
          description="Añadir activo con vista previa en directo — inspirado en Stripe y la Ley de Tesler. Layout, orden de campos y atajo [A]."
        >
          <div
            slot="preview"
            class="w-full h-full flex items-center justify-center overflow-hidden p-space-4"
          >
            <div
              class="relative w-[150px] h-[82px] bg-surface-elevated border border-border-hairline rounded shadow-sm flex overflow-hidden"
            >
              <!-- Form side -->
              <div
                class="flex-[1.1] p-space-2 flex flex-col gap-[3px] border-r border-border-hairline"
              >
                <div class="h-[3px] w-10 bg-canvas-fg/70 rounded-full"></div>
                <div class="h-[6px] w-full bg-neutral-200 rounded-sm mt-1"></div>
                <div class="h-[6px] w-full bg-neutral-200 rounded-sm"></div>
                <div class="mt-auto flex justify-end gap-[2px]">
                  <div class="h-[5px] w-5 bg-action rounded-sm"></div>
                </div>
              </div>
              <!-- Preview side -->
              <div
                class="flex-1 p-space-2 flex flex-col gap-[3px]"
                style="background: color-mix(in srgb, var(--surface-quiet) 100%, transparent);"
              >
                <div class="h-[2px] w-6 rounded-full" style="background: var(--action-700)"></div>
                <div class="flex-1 flex items-end gap-[1.5px]">
                  @for (h of miniBars; track $index) {
                    <div
                      class="flex-1 rounded-sm"
                      [style.height.%]="h"
                      style="background: var(--action-700)"
                    ></div>
                  }
                </div>
              </div>
            </div>
          </div>
        </site-teaser-tile>
      </div>
    </div>
  `,
})
export class NovedadesLandingPage {
  // Mock bar heights for the evolución preview — descending curve
  readonly barHeights = [40, 55, 70, 82, 92, 100, 95, 85, 72, 60, 50, 40, 32, 25, 18];

  readonly decisionCards = [
    'Cabecera flotante',
    'Filtros por zonas',
    'Paleta monocromática',
    'Hover + leyenda',
  ];

  readonly patrimonioCards = [
    'Top bar global',
    'Cabecera + acciones',
    'Métricas + pestañas',
    'Tablas free-flowing',
  ];

  readonly miniBars = [30, 45, 60, 72, 85, 92, 88, 75, 60];

  readonly sidebarNav = [
    { icon: '●', label: 'Situación', active: false },
    { icon: '○', label: 'Objetivos', active: false },
    { icon: '■', label: 'Diagnós.', active: false },
    { icon: '▲', label: 'Plan', active: false },
    { icon: '◆', label: 'Conclus.', active: true },
    { icon: '□', label: 'Informe', active: false },
  ];
}
