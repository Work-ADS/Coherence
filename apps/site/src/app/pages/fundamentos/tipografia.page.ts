import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tipografia-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Foundations</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Tipografía</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        Roboto Serif en toda la jerarquía — una sola familia entrega display, body, botones, inputs,
        etiquetas, datos y tablas. La jerarquía se construye con peso, tamaño, letter-spacing y
        figuras tabulares, nunca con una segunda tipografía.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <!-- Type scale specimen -->
      <section class="mb-space-12">
        <h2 id="escala-tipografica" class="text-section text-canvas-fg mb-space-6">
          Escala tipográfica
        </h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Siete roles nombrados definen la escala. Cada rol tiene tamaño, interlineado y peso fijos.
        </p>
        <div class="flex flex-col gap-space-6 max-w-[720px]">
          @for (role of typeRoles; track role.name) {
            <div class="border-b border-border-hairline pb-space-4">
              <div class="flex items-baseline justify-between mb-space-2">
                <span class="text-body-sm-600 text-neutral-500 uppercase tracking-wider">{{
                  role.name
                }}</span>
                <span class="text-body-sm text-neutral-400 font-mono">{{ role.spec }}</span>
              </div>
              <p [class]="role.class + ' text-canvas-fg'">{{ role.sample }}</p>
            </div>
          }
        </div>
      </section>

      <!-- Body variants -->
      <section class="mb-space-12">
        <h2 id="variantes-de-cuerpo" class="text-section text-canvas-fg mb-space-6">
          Variantes de cuerpo
        </h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Body Large, Medium y Small × pesos 400, 500 y 600. Los sufijos
          <code class="font-mono text-body-sm">-500</code> y
          <code class="font-mono text-body-sm">-600</code> en las clases Tailwind corresponden a los
          pesos.
        </p>
        <div class="overflow-x-auto max-w-[720px]">
          <table class="w-full text-body-sm">
            <thead>
              <tr class="border-b border-border-hairline text-left">
                <th class="py-space-3 pr-space-4 text-body-sm-600 text-canvas-fg">Clase</th>
                <th class="py-space-3 pr-space-4 text-body-sm-600 text-canvas-fg">
                  Tamaño / línea
                </th>
                <th class="py-space-3 text-body-sm-600 text-canvas-fg">Ejemplo</th>
              </tr>
            </thead>
            <tbody class="text-neutral-600">
              @for (v of bodyVariants; track v.cls) {
                <tr class="border-b border-border-hairline">
                  <td class="py-space-3 pr-space-4 font-mono">{{ v.cls }}</td>
                  <td class="py-space-3 pr-space-4">{{ v.spec }}</td>
                  <td class="py-space-3" [class]="v.cls">{{ v.sample }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <!-- Utility classes -->
      <section class="mb-space-12">
        <h2 id="clases-de-utilidad" class="text-section text-canvas-fg mb-space-6">
          Clases de utilidad
        </h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Los tokens tipográficos se mapean directamente a clases Tailwind a través de
          <code class="font-mono text-body-sm">tailwind.config.js → theme.extend.fontSize</code>.
        </p>
        <div class="overflow-x-auto max-w-[720px]">
          <table class="w-full text-body-sm">
            <thead>
              <tr class="border-b border-border-hairline text-left">
                <th class="py-space-3 pr-space-4 text-body-sm-600 text-canvas-fg">
                  Clase Tailwind
                </th>
                <th class="py-space-3 pr-space-4 text-body-sm-600 text-canvas-fg">Token CSS</th>
                <th class="py-space-3 text-body-sm-600 text-canvas-fg">Uso</th>
              </tr>
            </thead>
            <tbody class="text-neutral-600">
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">text-display</td>
                <td class="py-space-3 pr-space-4 font-mono">--type-display</td>
                <td class="py-space-3">Hero, landing page</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">text-title</td>
                <td class="py-space-3 pr-space-4 font-mono">--type-title</td>
                <td class="py-space-3">Título de página</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">text-subtitle</td>
                <td class="py-space-3 pr-space-4 font-mono">--type-subtitle</td>
                <td class="py-space-3">Subtítulo, heading de sección</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">text-section</td>
                <td class="py-space-3 pr-space-4 font-mono">--type-section</td>
                <td class="py-space-3">Título de sección (H2)</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">text-body-md</td>
                <td class="py-space-3 pr-space-4 font-mono">--type-body</td>
                <td class="py-space-3">Párrafos, texto principal</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">text-button</td>
                <td class="py-space-3 pr-space-4 font-mono">--type-button</td>
                <td class="py-space-3">Etiquetas de botón</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Rules -->
      <section class="mb-space-12">
        <h2 id="reglas" class="text-section text-canvas-fg mb-space-6">Reglas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-6 max-w-[720px]">
          <div class="p-space-6 border border-border-hairline rounded-md">
            <p class="text-body-sm-600 text-system-success mb-space-2">Hacer</p>
            <ul class="list-disc list-inside text-body-sm text-neutral-600 space-y-space-1">
              <li>Usar Roboto Serif para toda la jerarquía</li>
              <li>Diferenciar con peso y tracking, no con familia</li>
              <li>Figuras tabulares en tablas numéricas</li>
            </ul>
          </div>
          <div class="p-space-6 border border-border-hairline rounded-md">
            <p class="text-body-sm-600 text-system-error mb-space-2">No hacer</p>
            <ul class="list-disc list-inside text-body-sm text-neutral-600 space-y-space-1">
              <li>Nunca mezclar Roboto Sans en v1</li>
              <li>Nunca usar tamaños fuera de la escala</li>
              <li>Nunca <code class="font-mono">font-size: 13px</code> hardcoded</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Related -->
      <hr class="border-border-hairline mb-space-6" />
      <section>
        <h2 id="temas-relacionados" class="text-section text-canvas-fg mb-space-6">
          Temas relacionados
        </h2>
        <ul class="text-body-sm text-action-700 space-y-space-2">
          <li>
            <a routerLink="/fundamentos/espacio" class="underline hover:text-action-800">Espacio</a>
          </li>
          <li>
            <a routerLink="/fundamentos/tokens" class="underline hover:text-action-800">Tokens</a>
          </li>
          <li>
            <a routerLink="/fundamentos/principios" class="underline hover:text-action-800"
              >Principios</a
            >
          </li>
        </ul>
        <p class="text-body-sm text-neutral-400 mt-space-4">
          Fuente: <code class="font-mono text-body-sm">docs/token-skill.md</code>
        </p>
      </section>
    </div>
  `,
})
export class TipografiaPage {
  readonly typeRoles = [
    { name: 'Display', spec: '96/112', class: 'text-display', sample: 'Coherence' },
    { name: 'Title', spec: '32/40', class: 'text-title', sample: 'Título de página' },
    { name: 'Subtitle', spec: '24/32', class: 'text-subtitle', sample: 'Subtítulo de sección' },
    { name: 'Section', spec: '20/24', class: 'text-section', sample: 'Encabezado de sección' },
    {
      name: 'Body',
      spec: '16/24',
      class: 'text-body-md',
      sample: 'Texto de párrafo regular con ritmo de lectura cómodo.',
    },
    {
      name: 'Subtitle Body',
      spec: '20/20',
      class: 'text-subtitle-body',
      sample: 'Subtítulo compacto',
    },
    { name: 'Button', spec: '14/14', class: 'text-button', sample: 'ETIQUETA DE BOTÓN' },
  ];

  readonly bodyVariants = [
    { cls: 'text-body-lg', spec: '18/28', sample: 'Body Large regular' },
    { cls: 'text-body-lg-500', spec: '18/28 · 500', sample: 'Body Large medium' },
    { cls: 'text-body-lg-600', spec: '18/28 · 600', sample: 'Body Large semibold' },
    { cls: 'text-body-md', spec: '16/24', sample: 'Body Medium regular' },
    { cls: 'text-body-md-600', spec: '16/24 · 600', sample: 'Body Medium semibold' },
    { cls: 'text-body-sm', spec: '14/20', sample: 'Body Small regular' },
    { cls: 'text-body-sm-600', spec: '14/20 · 600', sample: 'Body Small semibold' },
  ];
}
