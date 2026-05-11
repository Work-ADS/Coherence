import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TabsComponent, TabComponent } from '@coherence/ui';
import { TeaserTileComponent } from '../../components/teaser-tile/teaser-tile.component';
import { SectionHeaderComponent } from './shared/section-header.component';

@Component({
  selector: 'site-novedades-landing',
  standalone: true,
  imports: [RouterLink, TabsComponent, TabComponent, TeaserTileComponent, SectionHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">NOVEDADES</p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">Novedades propuestas en curso</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Páginas completas aplicando Coherence DS — agrupadas por vertical. <em>Soluciones
        digitales</em> reúne las pantallas del Wealth Planner; <em>Marketing</em> recoge las
        propuestas para el hub de contenido AFI Insights.
      </p>

      <!-- ========== Vertical toggle ========== -->
      <div class="mb-space-10">
        <afi-tabs
          [activeIndex]="activeVertical()"
          (activeChange)="activeVertical.set($event)"
          ariaLabel="Vertical de novedades"
        >
          <afi-tab label="Soluciones digitales" />
          <afi-tab label="Marketing" />
        </afi-tabs>
      </div>

      @if (activeVertical() === 0) {
      <!-- ========== Soluciones digitales (Wealth Planner) ========== -->

      <!-- ========== Iteración 2 (en curso) ========== -->
      <afi-section-header
        eyebrow="En curso"
        title="Wealth Planner — Iteración 2"
        snippet="Alcance derivado de la reunión del 4-may y los comentarios sobre la Iteración 1."
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4 mb-space-12">
        <site-teaser-tile
          title="Checklist + propuesta visual"
          href="/novedades/iteracion-2"
          description="Los 13 cambios para la siguiente iteración: 8 decisiones de la reunión del 4-may + 5 comentarios anclados sobre la v1. Incluye enlace directo a la propuesta visual v2."
        >
          <div
            slot="preview"
            class="w-full h-full flex flex-col p-space-3 gap-space-2 overflow-hidden"
          >
            <div class="flex items-center justify-between">
              <p class="text-caption text-neutral-500 uppercase tracking-wider">Iteración 2</p>
              <span class="text-caption text-action-700 font-medium">13 tareas</span>
            </div>
            <div class="flex flex-col gap-1.5 flex-1 justify-center">
              @for (item of iter2Preview; track $index) {
                <div class="flex items-center gap-space-2">
                  <span class="w-2.5 h-2.5 rounded-sm border border-neutral-300 shrink-0"></span>
                  <span class="flex-1 h-1.5 rounded-sm bg-neutral-200"></span>
                </div>
              }
            </div>
          </div>
        </site-teaser-tile>

        <site-teaser-tile
          title="Top bar — Patrón nuevo"
          href="/patrones/cabeceras/top-bar"
          description="Cáscara de página de patrón lista (Handoff / Decisiones / Demo en vivo). Próximo paso: enumerar átomos uno por uno y poblar la auditoría de primitivos."
        >
          <div
            slot="preview"
            class="w-full h-full flex flex-col p-space-3 gap-space-2 overflow-hidden"
          >
            <div class="flex items-center justify-between">
              <p class="text-caption text-neutral-500 uppercase tracking-wider">Patrón</p>
              <span class="text-caption text-action-700 font-medium">Cáscara lista</span>
            </div>
            <div class="flex flex-col gap-1.5 flex-1 justify-center">
              <div class="flex gap-space-2 text-caption border-b border-border-hairline pb-[2px]">
                <span class="text-action border-b-2 border-action -mb-[2px] pb-[1px]">Handoff</span>
                <span class="text-neutral-500">Decisiones</span>
                <span class="text-neutral-400">Demo</span>
              </div>
              <div class="flex flex-col gap-1">
                <div class="h-1.5 w-3/4 rounded-sm bg-neutral-200"></div>
                <div class="h-1.5 w-full rounded-sm bg-neutral-200"></div>
                <div class="h-1.5 w-5/6 rounded-sm bg-neutral-200"></div>
              </div>
            </div>
          </div>
        </site-teaser-tile>
      </div>

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
      } @else {
      <!-- ========== Marketing (AFI Insights) ========== -->

      <!-- ========== Decisiones — Newsletter ========== -->
      <afi-section-header
        eyebrow="Newsletter"
        title="Decisiones sobre el feedback"
        snippet="Respuestas del owner al feedback del equipo sobre el diseño actual del newsletter. Nueve puntos con estado y la razón en español."
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4 mb-space-12">
        <site-teaser-tile
          title="Newsletter — Decisiones"
          href="/novedades/newsletter-decisiones"
          description="Respuestas del owner a los nueve puntos del feedback del equipo. 7 Acepto · 2 Modificado · 0 Rechazo, con la razón bajo cada cita."
        >
          <div
            slot="preview"
            class="w-full h-full flex flex-col p-space-3 gap-space-2 overflow-hidden"
          >
            <div class="flex items-center justify-between">
              <p class="text-caption text-neutral-500 uppercase tracking-wider">Decisiones</p>
              <span class="text-caption text-action-700 font-medium">9 puntos</span>
            </div>
            <div class="flex flex-col gap-1.5 flex-1 justify-center">
              @for (row of decisionesPreview; track $index) {
                <div class="flex items-center gap-space-2">
                  <span
                    class="w-3.5 h-3.5 rounded-full bg-action/10 text-action-700 text-[8px] font-semibold flex items-center justify-center shrink-0"
                  >{{ row.n }}</span>
                  <span class="flex-1 h-1.5 rounded-sm bg-neutral-200"></span>
                  <span
                    class="w-2 h-2 rounded-full shrink-0"
                    [class]="row.dot"
                  ></span>
                </div>
              }
            </div>
          </div>
        </site-teaser-tile>
      </div>

      <!-- ========== Ejemplos ========== -->
      <afi-section-header
        eyebrow="Ejemplos"
        title="Pantallas propuestas para AFI Insights"
        snippet="Cada página muestra una alternativa al hub de contenido actual en Webflow."
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4 mb-space-12">
        <site-teaser-tile
          title="Home"
          href="/afi-insights/home"
          description="Hero tipográfico, suscripción above the fold, pestañas de categorías y grid de artículos."
        >
          <div slot="preview" class="w-full h-full flex flex-col items-center justify-center gap-space-2 p-space-3">
            <p class="text-title font-serif text-canvas-fg leading-tight">AFI Insights</p>
            <div class="flex items-center gap-space-1">
              <div class="w-24 h-5 rounded-sm bg-neutral-200"></div>
              <div class="w-12 h-5 rounded-sm bg-action/20"></div>
            </div>
            <div class="flex gap-space-2 text-caption text-neutral-400">
              <span>Estudios</span>
              <span>Informes</span>
              <span>Articulos</span>
            </div>
          </div>
        </site-teaser-tile>

        <site-teaser-tile
          title="Suscripción"
          href="/afi-insights/suscripcion"
          description="Flujo en 3 pasos: email primero, confirmación, preferencias opcionales con defaults inteligentes."
        >
          <div slot="preview" class="w-full h-full flex flex-col items-center justify-center gap-space-2 p-space-3">
            <p class="text-body-sm font-medium text-canvas-fg">Paso 1 de 3</p>
            <div class="w-full max-w-[180px] flex gap-space-1">
              <div class="flex-1 h-1.5 rounded-full bg-action"></div>
              <div class="flex-1 h-1.5 rounded-full bg-neutral-200"></div>
              <div class="flex-1 h-1.5 rounded-full bg-neutral-200"></div>
            </div>
            <div class="w-32 h-6 rounded-sm bg-neutral-200 mt-space-1"></div>
            <div class="w-20 h-6 rounded-sm bg-action/20"></div>
          </div>
        </site-teaser-tile>

        <site-teaser-tile
          title="Artículos"
          href="/afi-insights/articulos"
          description="Listado con hero compacto, pestañas de filtro y grid de tarjetas."
        >
          <div slot="preview" class="w-full h-full flex flex-col p-space-3 gap-space-2">
            <p class="text-body-sm font-serif text-canvas-fg">Articulos</p>
            <p class="text-caption text-neutral-400">Perspectivas y analisis...</p>
            <div class="flex gap-space-2 text-caption">
              <span class="text-action border-b border-action pb-px">Todos</span>
              <span class="text-neutral-400">Estudios</span>
              <span class="text-neutral-400">Informes</span>
            </div>
            <div class="grid grid-cols-3 gap-1 flex-1">
              @for (_ of [0, 1, 2]; track $index) {
                <div class="rounded-sm bg-neutral-100"></div>
              }
            </div>
          </div>
        </site-teaser-tile>

        <site-teaser-tile
          title="Artículo (detalle)"
          href="/afi-insights/articulo"
          description="Hero oscuro estilo Figma blog, barra TOC lateral y contenido largo con CTA intermedio."
        >
          <div slot="preview" class="w-full h-full flex flex-col p-space-3 gap-space-2">
            <div class="h-10 rounded-sm bg-neutral-800 flex items-end px-2 pb-1">
              <span class="text-[9px] text-white/80 font-serif leading-tight">Claves de los episodios...</span>
            </div>
            <div class="flex gap-space-2 flex-1">
              <div class="flex-1 flex flex-col gap-1">
                <div class="h-1.5 w-full rounded-sm bg-neutral-200"></div>
                <div class="h-1.5 w-3/4 rounded-sm bg-neutral-200"></div>
                <div class="h-1.5 w-full rounded-sm bg-neutral-200"></div>
              </div>
              <div class="w-12 flex flex-col gap-1 border-l border-border-hairline pl-1">
                <div class="h-1 w-full rounded-sm bg-action/30"></div>
                <div class="h-1 w-full rounded-sm bg-neutral-200"></div>
                <div class="h-1 w-full rounded-sm bg-neutral-200"></div>
              </div>
            </div>
          </div>
        </site-teaser-tile>
      </div>

      <!-- ========== Caso de estudio ========== -->
      <afi-section-header
        eyebrow="Análisis"
        title="Caso de estudio"
        snippet="El razonamiento detrás de cada decisión de diseño — psicología conductual aplicada."
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4">
        <site-teaser-tile
          title="Caso de estudio — AFI Insights"
          href="/afi-insights/caso-de-estudio"
          description="Por qué eliminamos el hero fotográfico, por qué la suscripción va arriba y cómo aplicamos psicología conductual al flujo."
        >
          <div slot="preview" class="w-full h-full flex flex-col items-center justify-center gap-space-2 p-space-3">
            <p class="text-body-sm font-medium text-canvas-fg">Decisiones</p>
            <div class="flex flex-wrap gap-1 justify-center">
              @for (tag of marketingTags; track tag) {
                <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-action/10 text-action-700">{{ tag }}</span>
              }
            </div>
          </div>
        </site-teaser-tile>
      </div>
      }
    </div>
  `,
})
export class NovedadesLandingPage {
  private readonly route = inject(ActivatedRoute);

  readonly activeVertical = signal(
    this.route.snapshot.queryParamMap.get('tab') === 'marketing' ? 1 : 0,
  );

  readonly marketingTags = ['Psicologia', 'UX', 'Conversion'];

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

  readonly iter2Preview = [0, 1, 2];

  readonly decisionesPreview = [
    { n: 1, dot: 'bg-system-warning' },
    { n: 2, dot: 'bg-system-success' },
    { n: 3, dot: 'bg-system-success' },
  ];

  readonly sidebarNav = [
    { icon: '●', label: 'Situación', active: false },
    { icon: '○', label: 'Objetivos', active: false },
    { icon: '■', label: 'Diagnós.', active: false },
    { icon: '▲', label: 'Plan', active: false },
    { icon: '◆', label: 'Conclus.', active: true },
    { icon: '□', label: 'Informe', active: false },
  ];
}
