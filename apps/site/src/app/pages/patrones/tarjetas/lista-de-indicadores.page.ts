import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-de-indicadores-tarjeta-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Patterns / Tarjetas</p>
      <h1 class="text-title text-canvas-fg mb-space-3">Lista de indicadores</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Card con filas de indicadores, cada una con label + sparkline inline o barra de progreso.
      </p>

      <hr class="border-neutral-200 mb-space-8" />

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Anatomía</h2>
        <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-4">
          Un título opcional en la cabecera. El cuerpo es una lista vertical donde cada fila
          contiene: label a la izquierda, sparkline o barra de progreso en el centro, y valor
          numérico a la derecha. Las filas están separadas por divisores sutiles.
        </p>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Composición</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li><code>afi-card</code> — contenedor principal</li>
          <li>SVG inline bars / sparklines</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Cuándo usar</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li>Dashboards de salud con múltiples métricas comparadas.</li>
          <li>Breakdowns de portafolio con barras proporcionales.</li>
          <li>Resúmenes multi-indicador donde cada item es un dato simple.</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Cuándo NO usar</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li>Charts interactivos — usa <strong>Gráfico</strong>.</li>
          <li>Una sola métrica destacada — usa <strong>Métrica</strong>.</li>
          <li>Datos tabulares complejos con sorting/filtering — usa una tabla.</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Do &amp; Don't</h2>
        <div class="grid grid-cols-2 gap-space-4">
          <div class="rounded-lg border border-success-300 bg-success-50 p-space-4">
            <p class="text-body-sm font-semibold text-success-700 mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-700">Limita a 5–8 filas para mantener la tarjeta escaneable.</p>
          </div>
          <div class="rounded-lg border border-danger-300 bg-danger-50 p-space-4">
            <p class="text-body-sm font-semibold text-danger-700 mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-700">No hagas las sparklines interactivas — son solo indicadores visuales.</p>
          </div>
          <div class="rounded-lg border border-success-300 bg-success-50 p-space-4">
            <p class="text-body-sm font-semibold text-success-700 mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-700">Alinea valores numéricos a la derecha para fácil comparación.</p>
          </div>
          <div class="rounded-lg border border-danger-300 bg-danger-50 p-space-4">
            <p class="text-body-sm font-semibold text-danger-700 mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-700">No mezcles diferentes tipos de visualización en la misma lista.</p>
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
export class ListaDeIndicadoresPage {}
