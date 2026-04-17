import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-grafico-tarjeta-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Patterns / Tarjetas</p>
      <h1 class="text-title text-canvas-fg mb-space-3">Gráfico</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Card que envuelve un chart primitivo con título, valor actual y tabs opcionales de rango temporal.
      </p>

      <hr class="border-neutral-200 mb-space-8" />

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Anatomía</h2>
        <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-4">
          La cabecera muestra el título de la serie y el valor actual. Debajo, un grupo de tabs
          permite alternar entre rangos (1D, 1W, 1M, 1Y). El cuerpo contiene el chart
          (línea, barras o área) que ocupa todo el ancho de la tarjeta.
        </p>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Composición</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li><code>afi-card</code> — contenedor principal</li>
          <li><code>afi-tabs</code> — selector de rango temporal</li>
          <li>Chart primitives (bar / line / area)</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Cuándo usar</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li>Widgets de dashboard que muestran series temporales.</li>
          <li>Resúmenes de rendimiento con contexto de rango.</li>
          <li>Paneles de análisis donde cada chart necesita su propio contenedor.</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Cuándo NO usar</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li>Charts independientes sin contexto de tarjeta — usa el chart primitivo directamente.</li>
          <li>Tablas de datos dentro de la tarjeta — usa una tabla dedicada.</li>
          <li>Métricas sin serie temporal — usa <strong>Métrica</strong>.</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Do &amp; Don't</h2>
        <div class="grid grid-cols-2 gap-space-4">
          <div class="rounded-lg border border-success-300 bg-success-50 p-space-4">
            <p class="text-body-sm font-semibold text-success-700 mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-700">Muestra el valor actual en la cabecera para dar contexto inmediato.</p>
          </div>
          <div class="rounded-lg border border-danger-300 bg-danger-50 p-space-4">
            <p class="text-body-sm font-semibold text-danger-700 mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-700">No combines múltiples tipos de chart en una sola tarjeta.</p>
          </div>
          <div class="rounded-lg border border-success-300 bg-success-50 p-space-4">
            <p class="text-body-sm font-semibold text-success-700 mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-700">Usa los tabs de rango para permitir exploración temporal rápida.</p>
          </div>
          <div class="rounded-lg border border-danger-300 bg-danger-50 p-space-4">
            <p class="text-body-sm font-semibold text-danger-700 mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-700">No insertes tablas dentro del Gráfico — mantén el chart como único visual.</p>
          </div>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <nav>
        <h2 class="text-section text-canvas-fg mb-space-3">Temas relacionados</h2>
        <ul class="list-disc pl-space-5 text-body-md space-y-space-1">
          <li><a routerLink="/componentes/card" class="text-action-700 underline">Card (primitivo)</a></li>
          <li><a routerLink="/patrones/tarjetas/metrica" class="text-action-700 underline">Métrica</a></li>
          <li><a routerLink="/patrones/tarjetas/composicion" class="text-action-700 underline">Composición</a></li>
        </ul>
      </nav>
    </div>
  `,
})
export class GraficoPage {}
