import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-espacio-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Foundations</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Espacio</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        Una escala base-4 gobierna todo el espaciado en Coherence. Nada de píxeles sueltos — cada
        margen, padding y gap se resuelve desde un token dimensional.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <!-- Scale visualizer -->
      <section class="mb-space-12">
        <h2 id="escala-base-4" class="text-section text-canvas-fg mb-space-6">Escala base-4</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Doce pasos: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 px. Sin píxeles impares.
        </p>
        <div class="flex flex-col gap-space-3 max-w-[720px]">
          @for (step of scale; track step.px) {
            <div class="flex items-center gap-space-4">
              <code class="font-mono text-body-sm text-neutral-500 w-[100px]"
                >space-{{ step.token }}</code
              >
              <div
                class="h-space-6 rounded-sm bg-action-100 border border-action-300"
                [style.width.px]="step.px"
              ></div>
              <span class="text-body-sm text-neutral-400">{{ step.px }}px</span>
            </div>
          }
        </div>
      </section>

      <!-- Semantic aliases -->
      <section class="mb-space-12">
        <h2 id="alias-semanticos" class="text-section text-canvas-fg mb-space-6">
          Alias semánticos
        </h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Nombres con camiseta para contextos de uso frecuente. Resuelven a los mismos valores
          base-4.
        </p>
        <div class="overflow-x-auto max-w-[720px]">
          <table class="w-full text-body-sm">
            <thead>
              <tr class="border-b border-border-hairline text-left">
                <th class="py-space-3 pr-space-4 text-body-sm-600 text-canvas-fg">Alias</th>
                <th class="py-space-3 pr-space-4 text-body-sm-600 text-canvas-fg">Valor</th>
                <th class="py-space-3 text-body-sm-600 text-canvas-fg">Uso típico</th>
              </tr>
            </thead>
            <tbody class="text-neutral-600">
              @for (a of aliases; track a.alias) {
                <tr class="border-b border-border-hairline">
                  <td class="py-space-3 pr-space-4 font-mono">{{ a.alias }}</td>
                  <td class="py-space-3 pr-space-4">{{ a.value }}</td>
                  <td class="py-space-3">{{ a.use }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <!-- Tailwind mapping -->
      <section class="mb-space-12">
        <h2 id="uso-en-tailwind" class="text-section text-canvas-fg mb-space-6">Uso en Tailwind</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Todas las clases usan el prefijo <code class="font-mono text-body-sm">space-</code>:
          <code class="font-mono text-body-sm">p-space-4</code>,
          <code class="font-mono text-body-sm">gap-space-6</code>,
          <code class="font-mono text-body-sm">mb-space-8</code>.
        </p>
        <div class="p-space-6 bg-surface-quiet rounded-md max-w-[720px]">
          <p class="font-mono text-body-sm text-neutral-600">
            &lt;div class="p-space-6 gap-space-4 mb-space-8"&gt;<br />
            &nbsp;&nbsp;&lt;!-- padding: 24px, gap: 16px, margin-bottom: 32px --&gt;<br />
            &lt;/div&gt;
          </p>
        </div>
      </section>

      <!-- Rules -->
      <section class="mb-space-12">
        <h2 id="reglas" class="text-section text-canvas-fg mb-space-6">Reglas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-6 max-w-[720px]">
          <div class="p-space-6 border border-border-hairline rounded-md">
            <p class="text-body-sm-600 text-system-success mb-space-2">Hacer</p>
            <ul class="list-disc list-inside text-body-sm text-neutral-600 space-y-space-1">
              <li>Usar solo valores de la escala base-4</li>
              <li>Preferir alias semánticos para contextos repetidos</li>
              <li>Mantener ritmo vertical consistente</li>
            </ul>
          </div>
          <div class="p-space-6 border border-border-hairline rounded-md">
            <p class="text-body-sm-600 text-system-error mb-space-2">No hacer</p>
            <ul class="list-disc list-inside text-body-sm text-neutral-600 space-y-space-1">
              <li>Nunca <code class="font-mono">margin: 7px</code> — no existe en la escala</li>
              <li>
                Nunca usar <code class="font-mono">p-3</code> (Tailwind default) — usar
                <code class="font-mono">p-space-3</code>
              </li>
              <li>Nunca mezclar px hardcoded con tokens</li>
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
            <a routerLink="/fundamentos/tipografia" class="underline hover:text-action-800"
              >Tipografía</a
            >
          </li>
          <li>
            <a routerLink="/fundamentos/tokens" class="underline hover:text-action-800">Tokens</a>
          </li>
          <li>
            <a routerLink="/fundamentos/color" class="underline hover:text-action-800">Color</a>
          </li>
        </ul>
        <p class="text-body-sm text-neutral-400 mt-space-4">
          Fuente: <code class="font-mono text-body-sm">docs/token-skill.md</code>
        </p>
      </section>
    </div>
  `,
})
export class EspacioPage {
  readonly scale = [
    { token: '1', px: 4 },
    { token: '2', px: 8 },
    { token: '3', px: 12 },
    { token: '4', px: 16 },
    { token: '5', px: 20 },
    { token: '6', px: 24 },
    { token: '8', px: 32 },
    { token: '10', px: 40 },
    { token: '12', px: 48 },
    { token: '16', px: 64 },
    { token: '20', px: 80 },
    { token: '24', px: 96 },
  ];

  readonly aliases = [
    { alias: 'space-2xs', value: '4px', use: 'Iconos inline, micro-gaps' },
    { alias: 'space-xs', value: '8px', use: 'Gaps internos compactos' },
    { alias: 'space-sm', value: '12px', use: 'Padding de chips, badges' },
    { alias: 'space-md', value: '16px', use: 'Padding estándar de controles' },
    { alias: 'space-lg', value: '24px', use: 'Padding de tarjetas, secciones' },
    { alias: 'space-xl', value: '32px', use: 'Separación entre secciones' },
    { alias: 'space-2xl', value: '48px', use: 'Margen de página' },
    { alias: 'space-3xl', value: '64px', use: 'Hero spacing' },
  ];
}
