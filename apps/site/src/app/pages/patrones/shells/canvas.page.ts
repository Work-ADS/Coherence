import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-canvas-shell-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Patterns / Shells</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Canvas <span class="text-body-md text-neutral-400">(reservado)</span></h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        El shell de lectura y consumo — contenido inmersivo con chrome mínimo,
        pensado para artículos, reportes y vistas de solo lectura.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <section class="mb-space-12">
        <h2 id="contrato" class="text-section text-canvas-fg mb-space-4">Contrato</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Este shell está reservado para v2. El contrato documentado establece:
        </p>
        <ul class="list-disc pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
          <li>Columna de contenido centrada (max 720 px) — tipografía optimizada para lectura larga</li>
          <li>Header mínimo: solo logo + botón de retorno</li>
          <li>Sin sidebar — la navegación se resuelve con breadcrumb o botón "Volver"</li>
          <li>Soporte para imágenes full-bleed que rompen la columna</li>
          <li>TOC opcional en rail derecho (igual que Docs shell)</li>
        </ul>
      </section>

      <section class="mb-space-12">
        <h2 id="casos-de-uso" class="text-section text-canvas-fg mb-space-4">Casos de uso previstos</h2>
        <ul class="list-disc pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
          <li>Artículos de blog o changelog detallado</li>
          <li>Reportes generados con gráficos y tablas inline</li>
          <li>Vistas de "solo lectura" de entidades complejas</li>
        </ul>
      </section>

      <section class="mb-space-10">
        <h2 id="composicion" class="text-section text-canvas-fg mb-space-4">Composición prevista</h2>
        <ul class="list-disc pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-shell</code> con <code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">type="canvas"</code></li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-toc</code> — opcional, rail derecho</li>
          <li>Tipografía serif para cuerpo (si la marca lo permite)</li>
        </ul>
      </section>

      <hr class="border-border-hairline mb-space-6" />
      <nav class="flex flex-wrap gap-space-4 text-body-sm">
        <span class="text-neutral-400">Temas relacionados:</span>
        <a routerLink="/componentes/shell" class="text-action-500 hover:underline">Shell</a>
        <a routerLink="/patrones/shells/docs" class="text-action-500 hover:underline">Docs shell</a>
        <a routerLink="/blog" class="text-action-500 hover:underline">Blog</a>
      </nav>
    </div>
  `,
})
export class CanvasPage {}
