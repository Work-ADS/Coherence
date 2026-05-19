import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Designer-facing guide for brand switching in the DS site.
 *
 * Audience: designers iterating on UI for a specific brand. Explains the
 * Figma-modes analogy, how to toggle live in DevTools today, and how dark
 * mode + brand combine. UI toggle is a future addition; documented here so
 * designers know the pattern is ready.
 */
@Component({
  selector: 'site-cambiar-marca-diseno-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        Primeros pasos
      </p>
      <h1 class="text-title text-canvas-fg mb-space-4">
        Cambiar de marca · Diseño
      </h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Cómo previsualizar el sistema en otra marca sin recompilar nada.
        Funciona como los <em>modes</em> de variables en Figma — un atributo en
        el HTML decide qué marca se está viendo.
      </p>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- El modelo -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">El modelo</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>
            Todas las marcas viven en el mismo bundle CSS. El atributo
            <code class="text-body-sm bg-neutral-100 px-1 rounded">data-brand</code>
            en <code class="text-body-sm bg-neutral-100 px-1 rounded">&lt;html&gt;</code>
            decide cuál está activa. Cambiarlo es instantáneo — la cascada CSS
            hace el resto.
          </p>
          <p>
            AFI es la marca por defecto: si no hay atributo, se muestra AFI.
          </p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Cómo cambiar de marca ahora mismo -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">
          Cambiar de marca ahora mismo (DevTools)
        </h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>
            Mientras llega el toggle visual, se cambia desde DevTools:
          </p>
          <ol class="list-decimal pl-space-5 space-y-space-1">
            <li>Abre DevTools (<code class="text-body-sm bg-neutral-100 px-1 rounded">⌘ + ⌥ + I</code>).</li>
            <li>En la pestaña <strong>Elements</strong>, selecciona la etiqueta <code class="text-body-sm bg-neutral-100 px-1 rounded">&lt;html&gt;</code> arriba del todo.</li>
            <li>Añade o edita el atributo: <code class="text-body-sm bg-neutral-100 px-1 rounded">data-brand="mutualidad"</code>.</li>
            <li>La página entera adopta la paleta de Mutualidad al instante. Sin recarga.</li>
          </ol>
        </div>
        <pre class="mt-space-4 bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>&lt;html data-brand="afi"&gt;        &lt;!-- por defecto --&gt;
&lt;html data-brand="mutualidad"&gt; &lt;!-- paleta Mutualidad --&gt;
&lt;html data-brand="unicaja"&gt;    &lt;!-- paleta Unicaja --&gt;</code></pre>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Modo oscuro -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Modo oscuro</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>
            El modo oscuro funciona igual, con otro atributo:
            <code class="text-body-sm bg-neutral-100 px-1 rounded">data-theme</code>.
          </p>
          <p>
            Se combina con la marca — son independientes.
          </p>
        </div>
        <pre class="mt-space-4 bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>&lt;html data-brand="afi"        data-theme="dark"&gt;
&lt;html data-brand="mutualidad" data-theme="dark"&gt;
&lt;html data-brand="afi"&gt;                          &lt;!-- claro (por defecto) --&gt;</code></pre>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Qué cambia, qué no -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">
          Qué cambia entre marcas, qué no
        </h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>
            <strong>Cambia automáticamente:</strong> colores, tipografía,
            radios, sombras — todo lo que está en tokens. El 95% de la UI.
          </p>
          <p>
            <strong>No cambia automáticamente:</strong> logos, imágenes y
            copy específico de marca. Eso vive en componentes <em>brand-aware</em>
            y en archivos de i18n.
          </p>
          <p>
            <strong>Cuando una marca necesita un layout distinto</strong> (por
            ejemplo, nav lateral en una y top tabs en otra) el componente lee
            <code class="text-body-sm bg-neutral-100 px-1 rounded">data-brand</code>
            y se adapta solo. Sin pantallas duplicadas.
          </p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Próximo paso -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Próximamente</h2>
        <p class="max-w-[640px] text-body-md text-neutral-700">
          Un selector visual en la cabecera del DS site para cambiar de marca
          + modo sin tocar DevTools. La pintura cambia, la mecánica es la misma.
        </p>
      </section>
    </div>
  `,
})
export class CambiarMarcaDisenoPage {}
