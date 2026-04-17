import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-composicion-tarjeta-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Patterns / Tarjetas</p>
      <h1 class="text-title text-canvas-fg mb-space-3">Composición</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Card con donut chart + leyenda + valores delta — para mostrar distribución y proporciones.
      </p>

      <hr class="border-neutral-200 mb-space-8" />

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Anatomía</h2>
        <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-4">
          A la izquierda, un donut chart SVG muestra la distribución proporcional. A la derecha,
          una leyenda vertical con color swatch + label + porcentaje + delta. El centro del donut
          puede mostrar el valor total.
        </p>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Composición</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li><code>afi-card</code> — contenedor principal</li>
          <li>SVG donut chart</li>
          <li><code>afi-badge</code> — valores delta por segmento</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Cuándo usar</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li>Asignación de portafolio (% por asset class).</li>
          <li>Breakdowns de categoría (gastos, ingresos, etc.).</li>
          <li>Distribución de presupuesto entre departamentos.</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Cuándo NO usar</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li>Series temporales — usa <strong>Gráfico</strong>.</li>
          <li>Más de 6 segmentos — el donut pierde legibilidad.</li>
          <li>Comparaciones absolutas — usa barras en <strong>Lista de indicadores</strong>.</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Do &amp; Don't</h2>
        <div class="grid grid-cols-2 gap-space-4">
          <div class="rounded-lg border border-success-300 bg-success-50 p-space-4">
            <p class="text-body-sm font-semibold text-success-700 mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-700">Limita a 6 segmentos máximo — agrupa el resto como "Otros".</p>
          </div>
          <div class="rounded-lg border border-danger-300 bg-danger-50 p-space-4">
            <p class="text-body-sm font-semibold text-danger-700 mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-700">No uses el donut para comparar valores absolutos — es proporcional.</p>
          </div>
          <div class="rounded-lg border border-success-300 bg-success-50 p-space-4">
            <p class="text-body-sm font-semibold text-success-700 mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-700">Muestra el total en el centro del donut para dar contexto.</p>
          </div>
          <div class="rounded-lg border border-danger-300 bg-danger-50 p-space-4">
            <p class="text-body-sm font-semibold text-danger-700 mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-700">No uses colores demasiado similares entre segmentos adyacentes.</p>
          </div>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <nav>
        <h2 class="text-section text-canvas-fg mb-space-3">Temas relacionados</h2>
        <ul class="list-disc pl-space-5 text-body-md space-y-space-1">
          <li><a routerLink="/componentes/card" class="text-action-700 underline">Card (primitivo)</a></li>
          <li><a routerLink="/patrones/tarjetas/grafico" class="text-action-700 underline">Gráfico</a></li>
          <li><a routerLink="/patrones/tarjetas/lista-de-indicadores" class="text-action-700 underline">Lista de indicadores</a></li>
        </ul>
      </nav>
    </div>
  `,
})
export class ComposicionPage {}
