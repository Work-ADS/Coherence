import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-roadmap-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Recursos</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Roadmap</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        Visibilidad sobre lo que viene en Coherence. Este roadmap se actualiza mensualmente
        y refleja las prioridades del equipo de diseño y desarrollo.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-space-8">

        <!-- En progreso -->
        <section>
          <h2 id="en-progreso" class="text-section text-canvas-fg mb-space-6">En progreso</h2>
          <ul class="space-y-space-6">
            <li>
              <p class="text-body-md-600 text-canvas-fg mb-space-1">Modo oscuro</p>
              <p class="text-body-sm text-neutral-500">Tokens semánticos y alternancia automática para todas las superficies.</p>
            </li>
            <li>
              <p class="text-body-md-600 text-canvas-fg mb-space-1">DataTable</p>
              <p class="text-body-sm text-neutral-500">Tabla de datos con ordenación, filtrado y paginación integrados.</p>
            </li>
            <li>
              <p class="text-body-md-600 text-canvas-fg mb-space-1">Documentación de tokens</p>
              <p class="text-body-sm text-neutral-500">Páginas interactivas para explorar y copiar tokens de diseño.</p>
            </li>
            <li>
              <p class="text-body-md-600 text-canvas-fg mb-space-1">Tests de accesibilidad</p>
              <p class="text-body-sm text-neutral-500">Suite automatizada de pruebas WCAG 2.2 AA para cada componente.</p>
            </li>
          </ul>
        </section>

        <!-- Próximo -->
        <section>
          <h2 id="proximo" class="text-section text-canvas-fg mb-space-6">Próximo</h2>
          <ul class="space-y-space-6">
            <li>
              <p class="text-body-md-600 text-canvas-fg mb-space-1">White-label</p>
              <p class="text-body-sm text-neutral-500">Soporte multi-marca con temas configurables por cliente.</p>
            </li>
            <li>
              <p class="text-body-md-600 text-canvas-fg mb-space-1">Componentes de gráficos</p>
              <p class="text-body-sm text-neutral-500">Wrappers para visualización de datos financieros con tokens integrados.</p>
            </li>
            <li>
              <p class="text-body-md-600 text-canvas-fg mb-space-1">CLI de scaffolding</p>
              <p class="text-body-sm text-neutral-500">Comando para generar páginas y componentes con la estructura de Coherence.</p>
            </li>
          </ul>
        </section>

        <!-- Futuro -->
        <section>
          <h2 id="futuro" class="text-section text-canvas-fg mb-space-6">Futuro</h2>
          <ul class="space-y-space-6">
            <li>
              <p class="text-body-md-600 text-canvas-fg mb-space-1">Design tokens en Figma</p>
              <p class="text-body-sm text-neutral-500">Sincronización bidireccional entre tokens de código y variables de Figma.</p>
            </li>
            <li>
              <p class="text-body-md-600 text-canvas-fg mb-space-1">Animaciones y motion</p>
              <p class="text-body-sm text-neutral-500">Sistema de animaciones con tokens de duración, easing y transiciones.</p>
            </li>
            <li>
              <p class="text-body-md-600 text-canvas-fg mb-space-1">Playground interactivo</p>
              <p class="text-body-sm text-neutral-500">Editor en vivo para probar componentes con diferentes props y tokens.</p>
            </li>
          </ul>
        </section>

      </div>

      <!-- Temas relacionados -->
      <hr class="border-border-hairline mt-space-12 mb-space-6" />
      <section>
        <h2 id="temas-relacionados" class="text-section text-canvas-fg mb-space-4">Temas relacionados</h2>
        <ul class="text-body-sm text-action-700 space-y-space-2">
          <li><a routerLink="/recursos/descargas" class="underline hover:text-action-800">Descargas</a></li>
          <li><a routerLink="/recursos/changelog" class="underline hover:text-action-800">Changelog</a></li>
          <li><a routerLink="/recursos/faq" class="underline hover:text-action-800">Preguntas frecuentes</a></li>
        </ul>
      </section>
    </div>
  `,
})
export class RoadmapPage {}
