import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-entidad-tarjeta-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Patterns / Tarjetas</p>
      <h1 class="text-title text-canvas-fg mb-space-3">Entidad</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Card que muestra un objeto de negocio: visual/avatar + datos clave en lista de definición.
      </p>

      <hr class="border-neutral-200 mb-space-8" />

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Anatomía</h2>
        <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-4">
          La parte superior muestra un avatar, logo o imagen representativa de la entidad.
          Debajo, el nombre de la entidad y una lista de pares clave–valor (definition list)
          con los datos más relevantes. Opcionalmente incluye badges de estado o categoría.
        </p>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Composición</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li><code>afi-card</code> — contenedor principal</li>
          <li><code>afi-badge</code> — categoría o tipo de entidad</li>
          <li><code>afi-status-chip</code> — estado actual de la entidad</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Cuándo usar</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li>Tarjetas de contacto con foto + datos de contacto.</li>
          <li>Resúmenes de producto con imagen + especificaciones clave.</li>
          <li>Holdings de portafolio con símbolo + métricas.</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Cuándo NO usar</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li>Campos editables — usa un Drawer para la edición.</li>
          <li>Navegación entre items — usa <strong>Fila de lista</strong>.</li>
          <li>Datos extensos con muchos campos — usa una vista de detalle.</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Do &amp; Don't</h2>
        <div class="grid grid-cols-2 gap-space-4">
          <div class="rounded-lg border border-success-300 bg-success-50 p-space-4">
            <p class="text-body-sm font-semibold text-success-700 mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-700">Limita los key facts a 3–5 pares para mantener la escaneabilidad.</p>
          </div>
          <div class="rounded-lg border border-danger-300 bg-danger-50 p-space-4">
            <p class="text-body-sm font-semibold text-danger-700 mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-700">No incluyas campos editables — la Entidad es de solo lectura.</p>
          </div>
          <div class="rounded-lg border border-success-300 bg-success-50 p-space-4">
            <p class="text-body-sm font-semibold text-success-700 mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-700">Usa un visual consistente (avatar circular o imagen cuadrada) en toda la app.</p>
          </div>
          <div class="rounded-lg border border-danger-300 bg-danger-50 p-space-4">
            <p class="text-body-sm font-semibold text-danger-700 mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-700">No uses Entidad como enlace de navegación — usa Fila de lista para eso.</p>
          </div>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <nav>
        <h2 class="text-section text-canvas-fg mb-space-3">Temas relacionados</h2>
        <ul class="list-disc pl-space-5 text-body-md space-y-space-1">
          <li><a routerLink="/componentes/card" class="text-action-700 underline">Card (primitivo)</a></li>
          <li><a routerLink="/patrones/tarjetas/fila-de-lista" class="text-action-700 underline">Fila de lista</a></li>
          <li><a routerLink="/patrones/tarjetas/estado" class="text-action-700 underline">Estado</a></li>
        </ul>
      </nav>
    </div>
  `,
})
export class EntidadPage {}
