import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Engineer-facing guide for setting up a product project for ONE brand.
 *
 * The DS ships all brands in one bundle. Most apps just set <html data-brand="X">
 * and accept the small overhead. High-perf apps can strip unused brand
 * selectors at build time with PostCSS. This page documents both paths.
 */
@Component({
  selector: 'site-cambiar-marca-desarrollo-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        Primeros pasos
      </p>
      <h1 class="text-title text-canvas-fg mb-space-4">
        Cambiar de marca · Desarrollo
      </h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Cómo configurar un proyecto de producto para una sola marca cliente.
        Hay dos rutas: enviar el bundle completo y elegir la marca por atributo,
        o purgar las otras marcas en build-time para minimizar el tamaño.
      </p>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Cómo funciona el sistema -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Cómo funciona</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>
            <code class="text-body-sm bg-neutral-100 px-1 rounded">libs/tokens/</code>
            emite las paletas de todas las marcas en un mismo bundle.
            AFI vive en <code class="text-body-sm bg-neutral-100 px-1 rounded">:root</code>;
            Mutualidad bajo <code class="text-body-sm bg-neutral-100 px-1 rounded">[data-brand="mutualidad"]</code>;
            Unicaja bajo <code class="text-body-sm bg-neutral-100 px-1 rounded">[data-brand="unicaja"]</code>.
          </p>
          <p>
            La app decide cuál se aplica fijando un atributo en
            <code class="text-body-sm bg-neutral-100 px-1 rounded">&lt;html&gt;</code>.
            La cascada CSS hace el trabajo.
          </p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Opción A -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">
          Opción A · Bundle completo (recomendada para la mayoría)
        </h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>
            La app se queda con el CSS de todas las marcas y elige la suya con
            un atributo. La sobrecarga es de unos pocos kB — irrelevante para
            la mayoría de productos internos.
          </p>
          <p><strong>Pasos:</strong></p>
          <ol class="list-decimal pl-space-5 space-y-space-1">
            <li>Importa <code class="text-body-sm bg-neutral-100 px-1 rounded">libs/tokens/variables.scss</code> en la hoja de estilos global.</li>
            <li>Fija el atributo en <code class="text-body-sm bg-neutral-100 px-1 rounded">apps/&lt;app&gt;/src/index.html</code>.</li>
            <li>Listo. Sin pasos de build adicionales.</li>
          </ol>
        </div>
        <pre class="mt-space-4 bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>&lt;!-- apps/cliente-mutualidad/src/index.html --&gt;
&lt;html lang="es" data-brand="mutualidad"&gt;
  ...</code></pre>
        <p class="mt-space-4 text-body-sm text-neutral-600">
          Cuándo elegir esta opción: prácticamente siempre. Solo deja de tener
          sentido si la app se sirve en un canal con presupuesto de CSS muy
          ajustado (móvil de baja gama, anuncios, embebidos).
        </p>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Opción B -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">
          Opción B · Purga de marcas no usadas (alto rendimiento)
        </h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>
            Se elimina del CSS compilado todo selector
            <code class="text-body-sm bg-neutral-100 px-1 rounded">[data-brand="otra"]</code>
            que no corresponda a la marca del producto. Resultado: bundle CSS
            de una sola marca, sin atributo que poner en el HTML.
          </p>
          <p><strong>Pasos (PostCSS):</strong></p>
          <ol class="list-decimal pl-space-5 space-y-space-1">
            <li>Añade un plugin PostCSS de purga (<code class="text-body-sm bg-neutral-100 px-1 rounded">postcss-discard-selectors</code> o equivalente).</li>
            <li>Configúralo para descartar los selectores de las marcas que no usas.</li>
            <li>Construye la app. Verifica con <code class="text-body-sm bg-neutral-100 px-1 rounded">grep "data-brand" dist/&lt;app&gt;/browser/styles.css</code> — debería estar vacío salvo la marca activa.</li>
          </ol>
        </div>
        <pre class="mt-space-4 bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>// postcss.config.js (ejemplo simplificado)
//
// Configura postcss-discard-selectors para descartar
// cualquier selector que contenga data-brand="otra-marca".
//
// El selector a conservar para Mutualidad sería:
//   [data-brand="mutualidad"]
//
// Los selectores a descartar serían:
//   [data-brand="afi"]
//   [data-brand="unicaja"]</code></pre>
        <p class="mt-space-4 text-body-sm text-neutral-600">
          Cuándo elegir esta opción: apps de alto tráfico, embebidos
          móviles, o cualquier sitio donde cada kB de CSS pesa. Para el resto,
          Opción A es más simple y la diferencia es despreciable.
        </p>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Buenas prácticas -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Buenas prácticas</h2>
        <ul class="list-disc pl-space-5 space-y-space-2 max-w-[640px] text-body-md text-neutral-700">
          <li>Fija el <code class="text-body-sm bg-neutral-100 px-1 rounded">data-brand</code> lo más arriba posible — en <code class="text-body-sm bg-neutral-100 px-1 rounded">&lt;html&gt;</code>, no en <code class="text-body-sm bg-neutral-100 px-1 rounded">&lt;body&gt;</code> ni en un wrapper más profundo.</li>
          <li>El componente <code class="text-body-sm bg-neutral-100 px-1 rounded">&lt;afi-logo&gt;</code> lee la marca activa y devuelve el SVG correcto. No incrustes el logo directamente.</li>
          <li>Los strings específicos de marca ("planificación" vs "plan") se gestionan por i18n, no por tokens.</li>
          <li>Si una marca necesita un layout estructuralmente distinto, hazlo dentro del componente leyendo <code class="text-body-sm bg-neutral-100 px-1 rounded">data-brand</code>. Sin componentes duplicados.</li>
        </ul>
      </section>
    </div>
  `,
})
export class CambiarMarcaDesarrolloPage {}
