import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { ButtonComponent } from '@coherence/ui';
import type { ButtonVariant, ButtonSize } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger'];
const SIZES: ButtonSize[] = ['sm', 'md', 'lg'];

const BUTTON_TOKENS: TokenRow[] = [
  { property: 'Fondo (primary)', token: 'var(--action-500)' },
  { property: 'Fondo (secondary)', token: 'var(--surface-quiet)' },
  { property: 'Fondo (danger)', token: 'var(--system-error-base)' },
  { property: 'Texto (primary)', token: 'var(--color-base-white)' },
  { property: 'Borde (secondary)', token: 'var(--border-hairline)' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px offset' },
  { property: 'Altura (sm/md/lg)', token: 'var(--control-h-sm), -md, -lg' },
  { property: 'Radio', token: 'var(--radius-md)' },
  { property: 'Tipografía', token: 'var(--type-button)' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
];

@Component({
  selector: 'site-button-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    ButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Button"
      subtitle="Acción primaria del sistema. Cuatro variantes, tres tamaños."
      docsSource="docs/build-prompts/coherence-button.md"
      buildPromptSlug="coherence-button"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">

        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <!-- Variant -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Variante</legend>
              @for (v of variants; track v) {
                <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                  <input
                    type="radio"
                    name="variant"
                    [value]="v"
                    [checked]="variant() === v"
                    (change)="variant.set(v)"
                    class="accent-action"
                  />
                  {{ v }}
                </label>
              }
            </fieldset>

            <!-- Size -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Tamaño</legend>
              @for (s of sizes; track s) {
                <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                  <input
                    type="radio"
                    name="size"
                    [value]="s"
                    [checked]="size() === s"
                    (change)="size.set(s)"
                    class="accent-action"
                  />
                  {{ s }}
                </label>
              }
            </fieldset>

            <!-- State toggles -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Estado</legend>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="disabled()" (change)="disabled.set(!disabled())" class="accent-action" />
                disabled
              </label>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="loading()" (change)="loading.set(!loading())" class="accent-action" />
                loading
              </label>
            </fieldset>

            <!-- Label -->
            <div>
              <label class="font-medium text-canvas-fg mb-space-1 block text-body-sm">Etiqueta</label>
              <input
                type="text"
                [value]="label()"
                (input)="onLabelInput($event)"
                class="w-full border border-border-hairline rounded-md px-2 py-1 text-body-sm"
              />
            </div>
          </div>

          <!-- Live preview -->
          <div slot="preview">
            <afi-button
              [variant]="variant()"
              [size]="size()"
              [disabled]="disabled()"
              [loading]="loading()"
            >{{ label() }}</afi-button>
          </div>
        </afi-component-playground>

        <!-- Importar -->
        <section>
          <h2 id="importar" class="text-section text-canvas-fg mb-space-4">Importar</h2>
          <afi-code-block
            [code]="importCode"
            language="ts"
          />
        </section>

        <!-- Uso -->
        <section>
          <h2 id="uso" class="text-section text-canvas-fg mb-space-4">Uso</h2>

          <h3 id="cuando-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Acción principal de una vista o formulario.</li>
            <li>Confirmación de diálogos y flujos de aprobación.</li>
            <li>Navegación contextual cuando la semántica es de acción.</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo NO usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Navegación simple entre páginas — use un enlace.</li>
            <li>Más de una acción primaria en la misma vista.</li>
            <li>Acciones destructivas sin confirmación previa.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-3">Composiciones</h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            Botón primario + secundario en barra de acciones de Modal. Botón ghost como disparador de Menu.
          </p>

          <h3 id="ejemplo-real" class="text-body-md font-medium text-canvas-fg mb-space-3">Ejemplo real</h3>
          <afi-code-block
            [code]="realWorldCode"
            language="html"
          />
        </section>

        <!-- API Reference -->
        <section>
          <h2 id="api-reference" class="text-section text-canvas-fg mb-space-4">API Reference</h2>

          <h3 id="entradas" class="text-body-md font-medium text-canvas-fg mb-space-3">Entradas</h3>
          <div class="overflow-x-auto rounded-lg border border-border-hairline mb-space-8">
            <table class="w-full text-body-sm">
              <thead>
                <tr class="bg-neutral-50 border-b border-border-hairline">
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Nombre</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Tipo</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Predeterminado</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Descripción</th>
                </tr>
              </thead>
              <tbody>
                @for (row of apiInputs; track row.name) {
                  <tr class="border-b border-border-hairline last:border-b-0">
                    <td class="px-space-4 py-space-3 font-mono text-action-700">{{ row.name }}</td>
                    <td class="px-space-4 py-space-3 font-mono text-body-sm">{{ row.type }}</td>
                    <td class="px-space-4 py-space-3 font-mono text-body-sm">{{ row.default }}</td>
                    <td class="px-space-4 py-space-3 text-neutral-500">{{ row.notes }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <h3 id="salidas" class="text-body-md font-medium text-canvas-fg mb-space-3">Salidas</h3>
          <div class="overflow-x-auto rounded-lg border border-border-hairline">
            <table class="w-full text-body-sm">
              <thead>
                <tr class="bg-neutral-50 border-b border-border-hairline">
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Nombre</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Carga útil</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Descripción</th>
                </tr>
              </thead>
              <tbody>
                @for (row of apiOutputs; track row.name) {
                  <tr class="border-b border-border-hairline last:border-b-0">
                    <td class="px-space-4 py-space-3 font-mono text-action-700">{{ row.name }}</td>
                    <td class="px-space-4 py-space-3 font-mono">{{ row.payload }}</td>
                    <td class="px-space-4 py-space-3 text-neutral-500">{{ row.notes }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- ==================== DESIGN TAB ==================== -->
      <div slot="design-tab">

        <!-- Tokens consumidos -->
        <section>
          <h2 id="tokens-consumidos" class="text-section text-canvas-fg mb-space-4">Tokens consumidos</h2>
          <afi-tokens-table [rows]="tokenRows" title="" />
        </section>

        <!-- Accesibilidad -->
        <section>
          <h2 id="accesibilidad" class="text-section text-canvas-fg mb-space-4">Accesibilidad</h2>

          <h3 id="reglas" class="text-body-md font-medium text-canvas-fg mb-space-3">Reglas</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Usa <code class="font-mono text-action-700">&lt;button&gt;</code> nativo, nunca <code class="font-mono">&lt;div&gt;</code> ni <code class="font-mono">&lt;a&gt;</code> para acciones.</li>
            <li>Botones con icono sin texto requieren <code class="font-mono text-action-700">ariaLabel</code>.</li>
            <li>En estado loading, <code class="font-mono text-action-700">aria-busy="true"</code> y texto <code class="font-mono">"Cargando…"</code> en <code class="font-mono">sr-only</code>.</li>
            <li>Foco visible con anillo de 2px (<code class="font-mono">--border-focus</code>).</li>
          </ul>

          <h3 id="mapa-de-teclado" class="text-body-md font-medium text-canvas-fg mb-space-3">Mapa de teclado</h3>
          <div class="space-y-space-3 mb-space-8">
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Tab</kbd>
              <span class="text-body-md text-neutral-600">Enfoca el botón</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Enter / Space</kbd>
              <span class="text-body-md text-neutral-600">Activa el botón</span>
            </div>
          </div>

          <h3 id="demostracion-lectora" class="text-body-md font-medium text-canvas-fg mb-space-3">Demostración lectora de pantalla</h3>
          <div class="flex items-center gap-space-6 p-space-4 bg-neutral-50 rounded-md border border-border-hairline">
            <afi-button variant="primary" [loading]="true">Guardar</afi-button>
            <code class="text-body-sm font-mono text-neutral-600">aria-busy="true" · "Cargando…"</code>
          </div>
        </section>

        <!-- Motion -->
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-4">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>Transición de color: <code class="font-mono">var(--duration-fast)</code> (150ms) <code class="font-mono">ease-out</code></li>
            <li>Reduced motion: transiciones colapsan a instantáneo.</li>
          </ul>
          <div class="flex items-center gap-space-4 p-space-4 bg-neutral-50 rounded-md border border-border-hairline">
            <afi-button variant="primary">Hover me</afi-button>
            <span class="text-body-sm text-neutral-500">Pase el cursor para ver la transición de color.</span>
          </div>
        </section>

        <!-- Do & Don't -->
        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do & Don't</h2>
          <div class="space-y-space-4">
            <!-- Pair 1 -->
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <div class="mb-space-2"><afi-button variant="danger">Eliminar cuenta</afi-button></div>
                <p class="text-body-sm text-neutral-600">Usar variante danger solo para acciones destructivas.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <div class="mb-space-2"><afi-button variant="danger">Guardar</afi-button></div>
                <p class="text-body-sm text-neutral-600">No usar danger para acciones constructivas.</p>
              </div>
            </div>

            <!-- Pair 2 -->
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <div class="mb-space-2"><afi-button variant="primary">Confirmar</afi-button></div>
                <p class="text-body-sm text-neutral-600">Una sola acción primaria por vista.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <div class="mb-space-2 flex gap-2">
                  <afi-button variant="primary">Guardar</afi-button>
                  <afi-button variant="primary">Enviar</afi-button>
                </div>
                <p class="text-body-sm text-neutral-600">Dos primarios compiten por atención.</p>
              </div>
            </div>

            <!-- Pair 3 -->
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <div class="mb-space-2"><afi-button variant="primary" size="md">Guardar cambios</afi-button></div>
                <p class="text-body-sm text-neutral-600">Etiqueta describe la acción concreta.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <div class="mb-space-2"><afi-button variant="primary" size="md">Aceptar</afi-button></div>
                <p class="text-body-sm text-neutral-600">Etiqueta genérica no comunica qué ocurrirá.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class ButtonPage {
  readonly variant = signal<ButtonVariant>('primary');
  readonly size = signal<ButtonSize>('md');
  readonly disabled = signal(false);
  readonly loading = signal(false);
  readonly label = signal('Guardar');

  readonly variants = VARIANTS;
  readonly sizes = SIZES;
  readonly tokenRows = BUTTON_TOKENS;

  readonly importCode = "import { ButtonComponent } from '@coherence/ui/button';";

  readonly realWorldCode = `<afi-button
  variant="primary"
  (clicked)="activarOptimizacionLiquidez()">
  {{ 'activar_optimizacion_liquidez' | translate }}
</afi-button>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = [];
    if (this.variant() !== 'primary') props.push(`  variant="${this.variant()}"`);
    if (this.size() !== 'md') props.push(`  size="${this.size()}"`);
    if (this.disabled()) props.push('  [disabled]="true"');
    if (this.loading()) props.push('  [loading]="true"');

    const propsStr = props.length ? '\n' + props.join('\n') + '\n' : '';
    return `<afi-button${propsStr ? propsStr : ' '}>\n  ${this.label()}\n</afi-button>`;
  });

  readonly apiInputs = [
    { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", default: "'primary'", notes: 'Estilo visual' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", notes: 'Altura del botón' },
    { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", notes: 'Tipo HTML nativo' },
    { name: 'disabled', type: 'boolean', default: 'false', notes: 'Desactiva interacción' },
    { name: 'loading', type: 'boolean', default: 'false', notes: 'Muestra spinner, desactiva clic' },
    { name: 'iconStart', type: 'string | null', default: 'null', notes: 'Slot de icono al inicio' },
    { name: 'iconEnd', type: 'string | null', default: 'null', notes: 'Slot de icono al final' },
    { name: 'fullWidth', type: 'boolean', default: 'false', notes: 'Ocupa 100% del ancho' },
    { name: 'ariaLabel', type: 'string | null', default: 'null', notes: 'Requerido en botones solo-icono' },
  ];

  readonly apiOutputs = [
    { name: 'clicked', payload: '{ event: MouseEvent }', notes: 'Emitido al hacer clic (no emite si disabled/loading)' },
  ];

  onLabelInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.label.set(target.value);
  }
}
