import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'site-nuevo-proyecto-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Primeros pasos</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Iniciar un proyecto nuevo</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Cómo crear un proyecto Angular desde cero con Coherence pre-configurado,
        listo para construir interfaces consistentes desde el primer componente.
      </p>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Requisitos previos -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Requisitos previos</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-2">
          <ul class="list-disc pl-space-5 space-y-space-1">
            <li><strong>Node.js 18+</strong> — recomendamos la versión LTS más reciente.</li>
            <li><strong>Angular CLI</strong> — instálalo globalmente con <code class="text-body-sm bg-neutral-100 px-1 rounded">npm i -g &#64;angular/cli</code>.</li>
            <li><strong>Git</strong> — para control de versiones y colaboración.</li>
          </ul>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Paso 1 -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Paso 1 — Crear el proyecto</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>Ejecuta el generador de Angular para crear un workspace nuevo:</p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>ng new mi-app --style=scss --routing</code></pre>
          <p>Selecciona las opciones por defecto o ajústalas según tu equipo.</p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Paso 2 -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Paso 2 — Instalar Coherence</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>Dentro del directorio del proyecto, instala los paquetes del sistema de diseño:</p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>cd mi-app
npm install &#64;anthropic/coherence-tokens &#64;anthropic/coherence-components</code></pre>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Paso 3 -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Paso 3 — Configurar tokens</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>Importa los tokens CSS en tu archivo de estilos global:</p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>/* styles.scss */
&#64;import '&#64;anthropic/coherence-tokens/tokens.css';</code></pre>
          <p>Agrega la configuración de Tailwind para que las utilidades de Coherence estén disponibles:</p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>// tailwind.config.js
module.exports = &#123;
  presets: [require('&#64;anthropic/coherence-tokens/tailwind-preset')],
  content: ['./src/**/*.&#123;html,ts&#125;'],
&#125;;</code></pre>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Paso 4 -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Paso 4 — Primer componente</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>Usa un componente de Coherence para verificar que todo funciona:</p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>&lt;afi-button variant="filled"&gt;Hola Coherence&lt;/afi-button&gt;</code></pre>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Verificar -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Verificar</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>Levanta el servidor de desarrollo y confirma que el botón se renderiza con los estilos de Coherence:</p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>ng serve</code></pre>
          <p>Abre <code class="text-body-sm bg-neutral-100 px-1 rounded">http://localhost:4200</code> en tu navegador.</p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-10" />

      <!-- Temas relacionados -->
      <footer>
        <h2 class="text-section text-canvas-fg mb-space-3">Temas relacionados</h2>
        <ul class="space-y-space-2">
          <li><a routerLink="/primeros-pasos/nueva-marca" class="text-body-md text-action-700 hover:underline">Crear una marca nueva</a></li>
          <li><a routerLink="/fundamentos/tokens" class="text-body-md text-action-700 hover:underline">Tokens de diseño</a></li>
        </ul>
      </footer>
    </div>
  `,
})
export class NuevoProyectoPage {}
