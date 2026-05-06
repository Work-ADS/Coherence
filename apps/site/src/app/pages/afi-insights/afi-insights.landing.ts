import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeaserTileComponent } from '../../components/teaser-tile/teaser-tile.component';
import { SectionHeaderComponent } from '../novedades/shared/section-header.component';

@Component({
  selector: 'ai-insights-landing',
  standalone: true,
  imports: [RouterLink, TeaserTileComponent, SectionHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">AFI INSIGHTS</p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">Propuesta de rediseno</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-10">
        Paginas ejemplo aplicando Coherence DS al hub de contenido de AFI Insights.
        Los <em>Ejemplos</em> son las pantallas propuestas; el
        <em>Caso de estudio</em> explica el razonamiento detras de cada decision.
      </p>

      <!-- ========== Ejemplos ========== -->
      <afi-section-header
        eyebrow="Ejemplos"
        title="Pantallas propuestas"
        snippet="Cada pagina muestra una alternativa al diseno actual en Webflow."
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4 mb-space-12">
        <site-teaser-tile
          title="Home"
          href="/afi-insights/home"
          description="Hero tipografico, suscripcion above the fold, pestanas de categorias y grid de articulos."
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
          title="Suscripcion"
          href="/afi-insights/suscripcion"
          description="Flujo de suscripcion en 3 pasos: email primero, confirmacion, preferencias opcionales."
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
          title="Articulos"
          href="/afi-insights/articulos"
          description="Listado con hero compacto, pestanas de filtro y grid de tarjetas."
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
          title="Articulo (detalle)"
          href="/afi-insights/articulo"
          description="Hero oscuro estilo Figma blog, barra TOC lateral y contenido largo."
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
        eyebrow="Analisis"
        title="Caso de estudio"
        snippet="El razonamiento detras de cada decision de diseno."
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4">
        <site-teaser-tile
          title="Caso de estudio — AFI Insights"
          href="/afi-insights/caso-de-estudio"
          description="Por que eliminamos el hero fotografico, por que la suscripcion va arriba y como aplicamos psicologia conductual al flujo."
        >
          <div slot="preview" class="w-full h-full flex flex-col items-center justify-center gap-space-2 p-space-3">
            <p class="text-body-sm font-medium text-canvas-fg">Decisiones</p>
            <div class="flex flex-wrap gap-1 justify-center">
              @for (tag of ['Psicologia', 'UX', 'Conversion']; track tag) {
                <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-action/10 text-action-700">{{ tag }}</span>
              }
            </div>
          </div>
        </site-teaser-tile>
      </div>
    </div>
  `,
})
export class AfiInsightsLandingPage {}
