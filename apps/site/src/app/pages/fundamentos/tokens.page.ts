import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tokens-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Foundations</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Tokens</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        Tres capas — primitivo, semántico y marca — gobiernan cada valor visual en Coherence. JSON
        es la fuente de verdad; CSS custom properties son artefactos generados, nunca escritos a
        mano.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <!-- 3-layer architecture -->
      <section class="mb-space-12">
        <h2 id="arquitectura-de-tres-capas" class="text-section text-canvas-fg mb-space-6">
          Arquitectura de tres capas
        </h2>
        <div class="flex flex-col md:flex-row gap-space-4 max-w-[720px]">
          @for (layer of layers; track layer.name) {
            <div
              class="flex-1 p-space-6 border rounded-md"
              [class]="
                layer.active ? 'border-action-500 bg-surface-quiet' : 'border-border-hairline'
              "
            >
              <p class="text-body-sm-600 text-canvas-fg mb-space-2">{{ layer.name }}</p>
              <p class="text-body-sm text-neutral-600 mb-space-3">{{ layer.desc }}</p>
              <code class="font-mono text-body-sm text-neutral-400 block">{{ layer.example }}</code>
            </div>
          }
        </div>
        <div class="flex items-center gap-space-2 mt-space-4 max-w-[720px]">
          <div class="h-px flex-1 bg-border-hairline"></div>
          <span class="text-body-sm text-neutral-400">primitivo → semántico → marca</span>
          <div class="h-px flex-1 bg-border-hairline"></div>
        </div>
      </section>

      <!-- Token pipeline -->
      <section class="mb-space-12">
        <h2 id="pipeline" class="text-section text-canvas-fg mb-space-6">Pipeline de generación</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Style Dictionary transforma los archivos JSON en CSS custom properties. El build se
          ejecuta con <code class="font-mono text-body-sm">node libs/tokens/build.mjs</code>.
        </p>
        <div class="flex flex-col gap-space-2 max-w-[720px]">
          @for (step of pipeline; track step.label) {
            <div class="flex items-center gap-space-4 p-space-3 bg-surface-quiet rounded-md">
              <span class="text-body-sm-600 text-action-700 shrink-0 w-space-6 text-center">{{
                step.num
              }}</span>
              <div>
                <p class="text-body-sm-600 text-canvas-fg">{{ step.label }}</p>
                <code class="font-mono text-body-sm text-neutral-500">{{ step.path }}</code>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Semantic buckets -->
      <section class="mb-space-12">
        <h2 id="buckets-semanticos" class="text-section text-canvas-fg mb-space-6">
          Buckets semánticos
        </h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Seis categorías organizan todos los tokens semánticos. Un componente nunca referencia un
          primitivo directamente.
        </p>
        <div class="overflow-x-auto max-w-[720px]">
          <table class="w-full text-body-sm">
            <thead>
              <tr class="border-b border-border-hairline text-left">
                <th class="py-space-3 pr-space-4 text-body-sm-600 text-canvas-fg">Bucket</th>
                <th class="py-space-3 pr-space-4 text-body-sm-600 text-canvas-fg">
                  Ejemplo de token
                </th>
                <th class="py-space-3 text-body-sm-600 text-canvas-fg">Rol</th>
              </tr>
            </thead>
            <tbody class="text-neutral-600">
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">Canvas</td>
                <td class="py-space-3 pr-space-4 font-mono">--canvas-base, --canvas-fg</td>
                <td class="py-space-3">Fondo de página y texto principal</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">Surface</td>
                <td class="py-space-3 pr-space-4 font-mono">--surface-quiet, --surface-elevated</td>
                <td class="py-space-3">Contenedores a diferentes niveles</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">Action</td>
                <td class="py-space-3 pr-space-4 font-mono">--color-action-500</td>
                <td class="py-space-3">Botones primarios, enlaces activos</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">Control-neutral</td>
                <td class="py-space-3 pr-space-4 font-mono">--control-bg, --control-border</td>
                <td class="py-space-3">Inputs, checkboxes, selects</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">System</td>
                <td class="py-space-3 pr-space-4 font-mono">--system-error-base</td>
                <td class="py-space-3">Error, warning, success, info</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">Data-viz</td>
                <td class="py-space-3 pr-space-4 font-mono">--data-highlight-primary</td>
                <td class="py-space-3">Series de gráficos</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Brand manifest -->
      <section class="mb-space-12">
        <h2 id="manifiesto-de-marca" class="text-section text-canvas-fg mb-space-6">
          Manifiesto de marca
        </h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          La capa de marca es un override mínimo sobre los semánticos. Permite white-label sin tocar
          componentes. V1 usa el default AFI; AWM será el primer brand manifest externo.
        </p>
        <div class="p-space-6 bg-surface-quiet rounded-md max-w-[720px]">
          <p class="font-mono text-body-sm text-neutral-600">
            // libs/tokens/brand/awm.ts (v2)<br />
            export const awmManifest = &#123;<br />
            &nbsp;&nbsp;'font-brand-display': '"Roboto Serif", serif',<br />
            &nbsp;&nbsp;'font-brand-text': '"Roboto Serif", serif',<br />
            &nbsp;&nbsp;'color-action-500': 'hsl(220, 65%, 38%)',<br />
            &#125;;
          </p>
        </div>
      </section>

      <!-- Token categories summary -->
      <section class="mb-space-12">
        <h2 id="resumen-de-categorias" class="text-section text-canvas-fg mb-space-6">
          Resumen de categorías
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-space-4 max-w-[720px]">
          @for (cat of categories; track cat.name) {
            <div class="p-space-4 border border-border-hairline rounded-md text-center">
              <p class="text-subtitle text-canvas-fg mb-space-1">{{ cat.count }}</p>
              <p class="text-body-sm text-neutral-500">{{ cat.name }}</p>
            </div>
          }
        </div>
      </section>

      <!-- Rules -->
      <section class="mb-space-12">
        <h2 id="reglas" class="text-section text-canvas-fg mb-space-6">Reglas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-6 max-w-[720px]">
          <div class="p-space-6 border border-border-hairline rounded-md">
            <p class="text-body-sm-600 text-system-success mb-space-2">Hacer</p>
            <ul class="list-disc list-inside text-body-sm text-neutral-600 space-y-space-1">
              <li>JSON → Style Dictionary → CSS vars</li>
              <li>Semánticos en componentes, primitivos solo en tokens</li>
              <li>Brand manifest para overrides de marca</li>
            </ul>
          </div>
          <div class="p-space-6 border border-border-hairline rounded-md">
            <p class="text-body-sm-600 text-system-error mb-space-2">No hacer</p>
            <ul class="list-disc list-inside text-body-sm text-neutral-600 space-y-space-1">
              <li>Nunca editar los CSS generados a mano</li>
              <li>Nunca referencia directa a primitivo en un componente</li>
              <li>Nunca hex/rgba fuera de libs/tokens/</li>
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
            <a routerLink="/fundamentos/color" class="underline hover:text-action-800">Color</a>
          </li>
          <li>
            <a routerLink="/fundamentos/tipografia" class="underline hover:text-action-800"
              >Tipografía</a
            >
          </li>
          <li>
            <a routerLink="/fundamentos/espacio" class="underline hover:text-action-800">Espacio</a>
          </li>
        </ul>
        <p class="text-body-sm text-neutral-400 mt-space-4">
          Fuente: <code class="font-mono text-body-sm">docs/token-skill.md</code>
        </p>
      </section>
    </div>
  `,
})
export class TokensPage {
  readonly layers = [
    {
      name: 'Primitivo',
      desc: 'Valores crudos: hex, px, ms. Sin semántica.',
      example: '--color-blue-500: hsl(220, 65%, 38%)',
      active: false,
    },
    {
      name: 'Semántico',
      desc: 'Nombre por intención. Lo que usa el componente.',
      example: '--color-action-500: var(--color-blue-500)',
      active: true,
    },
    {
      name: 'Marca',
      desc: 'Override de marca. Mínimo, solo lo que cambia.',
      example: '--color-action-500: hsl(190, 70%, 35%)',
      active: false,
    },
  ];

  readonly pipeline = [
    { num: '1', label: 'Fuente JSON', path: 'libs/tokens/primitive/*.json + semantic/*.json' },
    { num: '2', label: 'Style Dictionary', path: 'libs/tokens/build.mjs' },
    { num: '3', label: 'CSS Custom Properties', path: 'libs/tokens/dist/variables.css' },
    {
      num: '4',
      label: 'Tailwind theme.extend',
      path: 'tailwind.config.js → tokens a utility classes',
    },
  ];

  readonly categories = [
    { name: 'Color', count: '80+' },
    { name: 'Spacing', count: '20' },
    { name: 'Typography', count: '14' },
    { name: 'Motion', count: '7' },
  ];
}
