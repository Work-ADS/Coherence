import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-color-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Foundations</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Color</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        Coherence usa color con moderación. La base es monocromática neutra; el acento (azul
        profundo) comunica acción e intención. Cada color se consume como token semántico, nunca
        como valor hexadecimal.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <!-- Semantic buckets -->
      <section class="mb-space-12">
        <h2 id="buckets-semanticos" class="text-section text-canvas-fg mb-space-6">
          Buckets semánticos
        </h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Seis categorías organizan todos los tokens de color. Un componente nunca accede a
          primitivos directamente — siempre a través de su bucket semántico.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-6 max-w-[720px]">
          @for (bucket of buckets; track bucket.name) {
            <div class="border border-border-hairline rounded-md overflow-hidden">
              <div class="h-space-10" [style.background]="bucket.sample"></div>
              <div class="p-space-4">
                <p class="text-body-sm-600 text-canvas-fg">{{ bucket.name }}</p>
                <p class="text-body-sm text-neutral-500">{{ bucket.desc }}</p>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Action ladder (Azul Profundo) -->
      <section class="mb-space-12">
        <h2 id="escala-accion" class="text-section text-canvas-fg mb-space-6">
          Escala de acción (Azul Profundo)
        </h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          El color de acción usa matiz 220 (azul profundo) con contraste ≥ 4.5:1 en todos los
          niveles funcionales.
          <code class="font-mono text-body-sm">action-500</code> alcanza ~6.3:1 contra blanco.
        </p>
        <div class="flex flex-wrap gap-space-2 max-w-[720px]">
          @for (step of actionSteps; track step.name) {
            <div class="flex flex-col items-center gap-space-1">
              <div
                class="w-space-12 h-space-12 rounded-md border border-border-hairline"
                [style.background]="step.var"
              ></div>
              <span class="text-body-sm text-neutral-500">{{ step.name }}</span>
            </div>
          }
        </div>
      </section>

      <!-- Neutral ladder -->
      <section class="mb-space-12">
        <h2 id="escala-neutral" class="text-section text-canvas-fg mb-space-6">Escala neutral</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Grises neutros para texto, bordes y superficies. De 50 (casi blanco) a 950 (casi negro).
        </p>
        <div class="flex flex-wrap gap-space-2 max-w-[720px]">
          @for (step of neutralSteps; track step.name) {
            <div class="flex flex-col items-center gap-space-1">
              <div
                class="w-space-12 h-space-12 rounded-md border border-border-hairline"
                [style.background]="step.var"
              ></div>
              <span class="text-body-sm text-neutral-500">{{ step.name }}</span>
            </div>
          }
        </div>
      </section>

      <!-- Surface tonal ladder -->
      <section class="mb-space-12">
        <h2 id="escalera-de-superficie" class="text-section text-canvas-fg mb-space-6">
          Escalera de superficie
        </h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Cinco niveles de superficie. Tono = contexto, sombra = elevación. Nunca se mezclan.
        </p>
        <div class="flex flex-col gap-space-3 max-w-[720px]">
          @for (s of surfaces; track s.name) {
            <div
              class="flex items-center gap-space-4 p-space-4 rounded-md border border-border-hairline"
              [style.background]="s.var"
            >
              <span class="text-body-sm-600 text-canvas-fg w-[120px]">{{ s.name }}</span>
              <code class="font-mono text-body-sm text-neutral-500">{{ s.token }}</code>
              <span class="text-body-sm text-neutral-400 ml-auto">{{ s.use }}</span>
            </div>
          }
        </div>
      </section>

      <!-- System colors -->
      <section class="mb-space-12">
        <h2 id="colores-de-sistema" class="text-section text-canvas-fg mb-space-6">
          Colores de sistema
        </h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Error, advertencia, éxito e información. Cada uno con tres roles: fondo (<code
            class="font-mono text-body-sm"
            >bg</code
          >), texto (<code class="font-mono text-body-sm">fg</code>) y base.
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-space-4 max-w-[720px]">
          @for (sys of systemColors; track sys.name) {
            <div class="border border-border-hairline rounded-md overflow-hidden">
              <div class="h-space-8" [style.background]="sys.bg"></div>
              <div class="h-space-4" [style.background]="sys.base"></div>
              <div class="p-space-3">
                <p class="text-body-sm-600 text-canvas-fg">{{ sys.name }}</p>
              </div>
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
              <li>Usar tokens semánticos: <code class="font-mono">text-action-700</code></li>
              <li>Respetar la escalera de superficie para anidamiento</li>
              <li>Color nunca como único indicador (accesibilidad)</li>
            </ul>
          </div>
          <div class="p-space-6 border border-border-hairline rounded-md">
            <p class="text-body-sm-600 text-system-error mb-space-2">No hacer</p>
            <ul class="list-disc list-inside text-body-sm text-neutral-600 space-y-space-1">
              <li>Nunca <code class="font-mono">#3B82F6</code> en un componente</li>
              <li>Nunca mezclar tono y sombra en una superficie</li>
              <li>Nunca inventar grises fuera de la escala neutral</li>
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
            <a routerLink="/fundamentos/tokens" class="underline hover:text-action-800">Tokens</a>
          </li>
          <li>
            <a routerLink="/fundamentos/accesibilidad" class="underline hover:text-action-800"
              >Accesibilidad</a
            >
          </li>
          <li>
            <a routerLink="/componentes/button" class="underline hover:text-action-800"
              >Button (consumidor de action)</a
            >
          </li>
          <li>
            <a routerLink="/componentes/status-chip" class="underline hover:text-action-800"
              >StatusChip (consumidor de system)</a
            >
          </li>
        </ul>
        <p class="text-body-sm text-neutral-400 mt-space-4">
          Fuente: <code class="font-mono text-body-sm">docs/rules/token-skill.md</code>
        </p>
      </section>
    </div>
  `,
})
export class ColorPage {
  readonly buckets = [
    { name: 'Canvas', desc: 'Fondo de página y texto principal.', sample: 'var(--canvas-base)' },
    {
      name: 'Surface',
      desc: 'Contenedores: tarjetas, paneles, overlays.',
      sample: 'var(--surface-muted)',
    },
    {
      name: 'Action',
      desc: 'Botones primarios y enlaces activos.',
      sample: 'var(--color-action-500)',
    },
    { name: 'Control-neutral', desc: 'Inputs, checkboxes, selects.', sample: 'var(--control-bg)' },
    {
      name: 'System',
      desc: 'Error, advertencia, éxito, información.',
      sample: 'var(--system-error-bg)',
    },
    {
      name: 'Data-viz',
      desc: 'Series de gráficos y paletas divergentes.',
      sample: 'var(--data-highlight-primary)',
    },
  ];

  readonly actionSteps = [
    { name: '50', var: 'var(--color-action-50)' },
    { name: '100', var: 'var(--color-action-100)' },
    { name: '200', var: 'var(--color-action-200)' },
    { name: '300', var: 'var(--color-action-300)' },
    { name: '400', var: 'var(--color-action-400)' },
    { name: '500', var: 'var(--color-action-500)' },
    { name: '600', var: 'var(--color-action-600)' },
    { name: '700', var: 'var(--color-action-700)' },
    { name: '800', var: 'var(--color-action-800)' },
    { name: '900', var: 'var(--color-action-900)' },
  ];

  readonly neutralSteps = [
    { name: '50', var: 'var(--color-neutral-50)' },
    { name: '100', var: 'var(--color-neutral-100)' },
    { name: '200', var: 'var(--color-neutral-200)' },
    { name: '300', var: 'var(--color-neutral-300)' },
    { name: '400', var: 'var(--color-neutral-400)' },
    { name: '500', var: 'var(--color-neutral-500)' },
    { name: '600', var: 'var(--color-neutral-600)' },
    { name: '700', var: 'var(--color-neutral-700)' },
    { name: '800', var: 'var(--color-neutral-800)' },
    { name: '900', var: 'var(--color-neutral-900)' },
    { name: '950', var: 'var(--color-neutral-950)' },
  ];

  readonly surfaces = [
    { name: 'Base', token: '--surface-base', var: 'var(--surface-base)', use: 'Fondo de página' },
    {
      name: 'Quiet',
      token: '--surface-quiet',
      var: 'var(--surface-quiet)',
      use: 'Chrome persistente (sidebar)',
    },
    {
      name: 'Muted',
      token: '--surface-muted',
      var: 'var(--surface-muted)',
      use: 'Hover, estado activo',
    },
    {
      name: 'Elevated',
      token: '--surface-elevated',
      var: 'var(--surface-elevated)',
      use: 'Tarjetas, paneles',
    },
    {
      name: 'Overlay',
      token: '--surface-overlay',
      var: 'var(--surface-overlay)',
      use: 'Modales, drawers',
    },
  ];

  readonly systemColors = [
    { name: 'Error', bg: 'var(--system-error-bg)', base: 'var(--system-error-base)' },
    { name: 'Warning', bg: 'var(--system-warning-bg)', base: 'var(--system-warning-base)' },
    { name: 'Success', bg: 'var(--system-success-bg)', base: 'var(--system-success-base)' },
    { name: 'Info', bg: 'var(--system-info-bg)', base: 'var(--system-info-base)' },
  ];
}
