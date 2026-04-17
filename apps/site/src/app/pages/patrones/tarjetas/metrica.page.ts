import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-metrica-tarjeta-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Patterns / Tarjetas</p>
      <h1 class="text-title text-canvas-fg mb-space-3">Métrica</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Card con un número grande, label debajo y un pequeño chip de tendencia (flecha arriba/abajo + porcentaje).
      </p>

      <hr class="border-neutral-200 mb-space-8" />

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Anatomía</h2>
        <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-4">
          Un número prominente domina el centro de la tarjeta. Debajo, un label descriptivo
          identifica la métrica. En la esquina superior o junto al número, un chip compacto
          muestra la dirección de la tendencia (▲/▼) y el porcentaje de cambio.
        </p>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Composición</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li><code>afi-card</code> — contenedor principal</li>
          <li><code>afi-status-chip</code> — chip de tendencia (positivo / negativo / neutro)</li>
          <li><code>afi-badge</code> — etiqueta opcional de contexto</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Cuándo usar</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li>Dashboards de KPIs donde cada métrica ocupa su propia tarjeta.</li>
          <li>Cabeceras de resumen con 3–5 métricas en fila.</li>
          <li>Widgets de overview que necesitan comunicar un dato clave de un vistazo.</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Cuándo NO usar</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li>Visualizaciones complejas — usa <strong>Gráfico</strong> en su lugar.</li>
          <li>Contenido con texto largo o párrafos explicativos.</li>
          <li>Métricas que requieren interacción directa (filtros, inputs).</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Do &amp; Don't</h2>
        <div class="grid grid-cols-2 gap-space-4">
          <div class="rounded-lg border border-success-300 bg-success-50 p-space-4">
            <p class="text-body-sm font-semibold text-success-700 mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-700">Usa un solo número prominente con un label claro y conciso.</p>
          </div>
          <div class="rounded-lg border border-danger-300 bg-danger-50 p-space-4">
            <p class="text-body-sm font-semibold text-danger-700 mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-700">No insertes gráficos complejos dentro de una tarjeta de métrica.</p>
          </div>
          <div class="rounded-lg border border-success-300 bg-success-50 p-space-4">
            <p class="text-body-sm font-semibold text-success-700 mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-700">Incluye el chip de tendencia solo cuando el delta es significativo.</p>
          </div>
          <div class="rounded-lg border border-danger-300 bg-danger-50 p-space-4">
            <p class="text-body-sm font-semibold text-danger-700 mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-700">No añadas párrafos de texto descriptivo — la métrica debe hablar por sí sola.</p>
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
export class MetricaPage {}
