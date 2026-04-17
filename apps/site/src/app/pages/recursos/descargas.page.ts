import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-descargas-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Recursos</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Descargas</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        Todo lo que necesita para empezar a trabajar con Coherence: archivos de diseño,
        paquetes npm, tipografías e iconos.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <!-- Figma -->
      <section class="mb-space-12">
        <h2 id="figma" class="text-section text-canvas-fg mb-space-4">Figma</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-4">
          La biblioteca de componentes de Coherence en Figma incluye tokens, variantes y
          documentación integrada. Duplique el archivo para mantener su proyecto sincronizado
          con la última versión del sistema.
        </p>
        <a href="https://figma.com" target="_blank" rel="noopener noreferrer"
           class="text-action-700 hover:underline text-body-md">
          Abrir en Figma ↗
        </a>
      </section>

      <hr class="border-border-hairline mb-space-10" />

      <!-- npm -->
      <section class="mb-space-12">
        <h2 id="npm" class="text-section text-canvas-fg mb-space-4">npm</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-4">
          Instale el paquete principal de Coherence para acceder a todos los componentes,
          tokens y utilidades desde su proyecto Angular.
        </p>
        <pre class="bg-surface-quiet border border-border-hairline rounded-md p-space-4 text-body-sm font-mono max-w-[640px] mb-space-4"><code>npm install &#64;coherence/ui</code></pre>
        <a href="https://www.npmjs.com/package/@coherence/ui" target="_blank" rel="noopener noreferrer"
           class="text-action-700 hover:underline text-body-md">
          Ver en npmjs.com ↗
        </a>
      </section>

      <hr class="border-border-hairline mb-space-10" />

      <!-- Tipografías -->
      <section class="mb-space-12">
        <h2 id="tipografias" class="text-section text-canvas-fg mb-space-4">Tipografías</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-4">
          Coherence utiliza Roboto Serif como tipografía principal en toda la jerarquía
          visual. Descárguela desde Google Fonts e inclúyala en su proyecto para garantizar
          la coherencia tipográfica.
        </p>
        <a href="https://fonts.google.com/specimen/Roboto+Serif" target="_blank" rel="noopener noreferrer"
           class="text-action-700 hover:underline text-body-md">
          Descargar Roboto Serif ↗
        </a>
      </section>

      <hr class="border-border-hairline mb-space-10" />

      <!-- Iconos -->
      <section class="mb-space-12">
        <h2 id="iconos" class="text-section text-canvas-fg mb-space-4">Iconos</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-4">
          El sistema de iconos de Coherence se basa en Lucide, un conjunto de iconos SVG
          abierto y consistente. Utilice el paquete de Angular o los SVGs directamente.
        </p>
        <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer"
           class="text-action-700 hover:underline text-body-md">
          Explorar Lucide Icons ↗
        </a>
      </section>

      <!-- Temas relacionados -->
      <hr class="border-border-hairline mb-space-6" />
      <section>
        <h2 id="temas-relacionados" class="text-section text-canvas-fg mb-space-4">Temas relacionados</h2>
        <ul class="text-body-sm text-action-700 space-y-space-2">
          <li><a routerLink="/recursos/changelog" class="underline hover:text-action-800">Changelog</a></li>
          <li><a routerLink="/recursos/roadmap" class="underline hover:text-action-800">Roadmap</a></li>
          <li><a routerLink="/recursos/faq" class="underline hover:text-action-800">Preguntas frecuentes</a></li>
        </ul>
      </section>
    </div>
  `,
})
export class DescargasPage {}
