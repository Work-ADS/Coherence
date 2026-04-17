import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'site-clonar-producto-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Primeros pasos</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Clonar un producto</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Cómo duplicar un producto existente y cambiar su identidad de marca
        sin partir de cero.
      </p>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Cuándo clonar -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Cuándo clonar</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>
            Clonar es útil cuando un producto nuevo comparte la mayoría de pantallas y lógica
            con uno existente y solo necesita una identidad visual diferente. Si la funcionalidad
            diverge significativamente, es mejor iniciar un proyecto nuevo.
          </p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Paso 1 -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Paso 1 — Copiar la carpeta del producto</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>Duplica la carpeta del producto dentro del monorepo:</p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>cp -r apps/producto-origen apps/producto-nuevo</code></pre>
          <p>
            Actualiza el nombre del proyecto en <code class="text-body-sm bg-neutral-100 px-1 rounded">project.json</code>
            y en <code class="text-body-sm bg-neutral-100 px-1 rounded">angular.json</code> si aplica.
          </p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Paso 2 -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Paso 2 — Actualizar el brand manifest</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>
            Edita o crea un nuevo brand manifest en
            <code class="text-body-sm bg-neutral-100 px-1 rounded">libs/tokens/brand/</code>
            con los valores de la nueva marca (hues, fuentes, espaciado).
          </p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Paso 3 -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Paso 3 — Regenerar tokens</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>Genera los tokens para la nueva marca:</p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>node libs/tokens/build.mjs --brand nueva-marca</code></pre>
          <p>Importa el archivo CSS generado en los estilos globales del producto clonado.</p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Paso 4 -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Paso 4 — Verificar identidad visual</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>
            Levanta el producto clonado y recorre las pantallas principales. Confirma que
            los colores, tipografía y espaciado reflejan la nueva marca. Los componentes
            de Coherence se adaptan automáticamente a los tokens importados.
          </p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-10" />

      <!-- Temas relacionados -->
      <footer>
        <h2 class="text-section text-canvas-fg mb-space-3">Temas relacionados</h2>
        <ul class="space-y-space-2">
          <li><a routerLink="/primeros-pasos/nueva-marca" class="text-body-md text-action-700 hover:underline">Crear una marca nueva</a></li>
          <li><a routerLink="/primeros-pasos/actualizar-ds" class="text-body-md text-action-700 hover:underline">Actualizar el DS</a></li>
        </ul>
      </footer>
    </div>
  `,
})
export class ClonarProductoPage {}
