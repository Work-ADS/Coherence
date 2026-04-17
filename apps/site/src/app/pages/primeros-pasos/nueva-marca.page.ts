import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'site-nueva-marca-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Primeros pasos</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Crear una marca nueva</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Cómo definir un brand manifest y generar tokens personalizados para que tu producto
        tenga su propia identidad visual dentro de Coherence.
      </p>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Qué es un brand manifest -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Qué es un brand manifest</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>
            Un brand manifest es un archivo JSON que define los valores fundamentales de tu marca:
            hues de color, familias tipográficas y la base de espaciado. Coherence lo consume
            para generar los tokens CSS que alimentan todos los componentes.
          </p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>&#123;
  "name": "mi-marca",
  "colors": &#123;
    "primary": 220,
    "accent": 160,
    "neutral": 210
  &#125;,
  "fonts": &#123;
    "heading": "Inter",
    "body": "Inter"
  &#125;,
  "spacingBase": 4
&#125;</code></pre>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Crear el archivo -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Crear el archivo</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>Coloca el manifest en la ruta convencional del monorepo:</p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>libs/tokens/brand/mi-marca.json</code></pre>
          <p>
            Los valores de <code class="text-body-sm bg-neutral-100 px-1 rounded">colors</code> son hues HSL (0-360).
            El pipeline genera las escalas de luminosidad automáticamente.
          </p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Generar tokens -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Generar tokens</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>Ejecuta el script de build para producir los archivos CSS y las variables:</p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>node libs/tokens/build.mjs --brand mi-marca</code></pre>
          <p>El resultado se escribe en <code class="text-body-sm bg-neutral-100 px-1 rounded">dist/tokens/mi-marca/</code>.</p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Verificar en el sitio -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Verificar en el sitio</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>
            Los tokens se inyectan como custom properties CSS. Al importar el archivo generado,
            los componentes de Coherence adoptan la nueva marca sin cambios en el template.
          </p>
          <p>
            Levanta el servidor de desarrollo y confirma que los colores y la tipografía reflejan tu manifest.
          </p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-10" />

      <!-- Temas relacionados -->
      <footer>
        <h2 class="text-section text-canvas-fg mb-space-3">Temas relacionados</h2>
        <ul class="space-y-space-2">
          <li><a routerLink="/fundamentos/color" class="text-body-md text-action-700 hover:underline">Sistema de color</a></li>
          <li><a routerLink="/fundamentos/tokens" class="text-body-md text-action-700 hover:underline">Tokens de diseño</a></li>
          <li><a routerLink="/primeros-pasos/nuevo-proyecto" class="text-body-md text-action-700 hover:underline">Iniciar un proyecto nuevo</a></li>
        </ul>
      </footer>
    </div>
  `,
})
export class NuevaMarcaPage {}
