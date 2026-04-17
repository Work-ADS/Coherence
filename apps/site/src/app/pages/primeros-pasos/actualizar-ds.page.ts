import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'site-actualizar-ds-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Primeros pasos</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Actualizar el DS</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Cómo incorporar la última versión de Coherence en tu proyecto,
        revisar cambios y resolver posibles incompatibilidades.
      </p>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Verificar versión actual -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Verificar versión actual</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>Consulta la versión instalada en tu proyecto:</p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>ng version
# o revisa package.json
cat package.json | grep coherence</code></pre>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Actualizar dependencias -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Actualizar dependencias</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>Ejecuta la actualización de los paquetes de Coherence:</p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>npm update &#64;anthropic/coherence-tokens &#64;anthropic/coherence-components</code></pre>
          <p>
            Si necesitas una versión específica, usa
            <code class="text-body-sm bg-neutral-100 px-1 rounded">npm install &#64;anthropic/coherence-tokens&#64;2.0.0</code>.
          </p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Revisar changelog -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Revisar changelog</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>
            Antes de actualizar en producción, lee el changelog para identificar
            nuevas funcionalidades, deprecaciones y breaking changes.
          </p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Ejecutar tests -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Ejecutar tests</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>Corre la suite de tests completa para detectar regresiones:</p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>npm run test
npm run e2e</code></pre>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Resolver breaking changes -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Resolver breaking changes</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>
            Si el changelog indica breaking changes, sigue las instrucciones de migración
            incluidas en la release. Los cambios más comunes son renombramientos de tokens
            y actualizaciones de API en componentes.
          </p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-10" />

      <!-- Temas relacionados -->
      <footer>
        <h2 class="text-section text-canvas-fg mb-space-3">Temas relacionados</h2>
        <ul class="space-y-space-2">
          <li><a routerLink="/recursos/changelog" class="text-body-md text-action-700 hover:underline">Changelog</a></li>
          <li><a routerLink="/primeros-pasos/git-ramas" class="text-body-md text-action-700 hover:underline">Ramas de Git</a></li>
        </ul>
      </footer>
    </div>
  `,
})
export class ActualizarDsPage {}
