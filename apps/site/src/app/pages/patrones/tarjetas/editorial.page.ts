import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-editorial-tarjeta-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Patterns / Tarjetas</p>
      <h1 class="text-title text-canvas-fg mb-space-3">Editorial</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Card con kicker + título serif + flourish decorativo — la única tarjeta con motion decorativa.
      </p>

      <hr class="border-neutral-200 mb-space-8" />

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Anatomía</h2>
        <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-4">
          Un kicker en uppercase identifica la categoría o sección. Debajo, un título en
          tipografía serif da un tono editorial. Un elemento decorativo (flourish SVG o
          línea ornamental) añade personalidad visual. Opcionalmente, una imagen de fondo
          o acento cromático refuerza el carácter editorial.
        </p>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Composición</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li><code>afi-card</code> — contenedor principal (patrón decorative-flourish)</li>
          <li class="text-warning-700">
            <strong>Restricción:</strong> El patrón decorative-flourish está restringido
            al sitio del DS, Blog, Primeros pasos y marketing. NO usar en vistas de operador AWM.
          </li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Cuándo usar</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li>Tarjetas de blog post con kicker de categoría + título atractivo.</li>
          <li>Anuncios de release con tono celebratorio.</li>
          <li>Hero cards de marketing y landing pages.</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Cuándo NO usar</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li>Dashboards de operador — usa <strong>Métrica</strong> o <strong>Entidad</strong>.</li>
          <li>Contextos data-heavy donde la decoración distrae.</li>
          <li>Vistas AWM de operador — el flourish no está permitido.</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Do &amp; Don't</h2>
        <div class="grid grid-cols-2 gap-space-4">
          <div class="rounded-lg border border-success-300 bg-success-50 p-space-4">
            <p class="text-body-sm font-semibold text-success-700 mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-700">Usa tipografía serif para el título editorial — diferénciate del UI.</p>
          </div>
          <div class="rounded-lg border border-danger-300 bg-danger-50 p-space-4">
            <p class="text-body-sm font-semibold text-danger-700 mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-700">No uses Editorial en dashboards de operador — está reservado para contenido editorial.</p>
          </div>
          <div class="rounded-lg border border-success-300 bg-success-50 p-space-4">
            <p class="text-body-sm font-semibold text-success-700 mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-700">Mantén el flourish sutil — debe complementar, no competir con el contenido.</p>
          </div>
          <div class="rounded-lg border border-danger-300 bg-danger-50 p-space-4">
            <p class="text-body-sm font-semibold text-danger-700 mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-700">No combines motion decorativa con datos — la decoración es para contenido editorial.</p>
          </div>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <nav>
        <h2 class="text-section text-canvas-fg mb-space-3">Temas relacionados</h2>
        <ul class="list-disc pl-space-5 text-body-md space-y-space-1">
          <li><a routerLink="/componentes/card" class="text-action-700 underline">Card (primitivo)</a></li>
          <li><a routerLink="/patrones/tarjetas/accion" class="text-action-700 underline">Acción</a></li>
          <li><a routerLink="/patrones/tarjetas/entidad" class="text-action-700 underline">Entidad</a></li>
        </ul>
      </nav>
    </div>
  `,
})
export class EditorialPage {}
