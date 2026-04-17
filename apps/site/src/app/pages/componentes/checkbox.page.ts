import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { CheckboxComponent } from '@coherence/ui';
import type { CheckboxSize } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const SIZES: CheckboxSize[] = ['sm', 'md'];

const CHECKBOX_TOKENS: TokenRow[] = [
  { property: 'Fondo (unchecked)', token: 'var(--surface-base)' },
  { property: 'Fondo (checked)', token: 'var(--action-500)' },
  { property: 'Borde (idle)', token: 'var(--border-hairline)' },
  { property: 'Borde (checked)', token: 'var(--action-500)' },
  { property: 'Borde (error)', token: 'var(--system-error-base)' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px offset' },
  { property: 'Texto label', token: 'var(--canvas-fg)' },
  { property: 'Hint', token: 'var(--neutral-500)' },
  { property: 'Error', token: 'var(--system-error-base)' },
  { property: 'Tamaño (sm/md)', token: '16px / 20px' },
  { property: 'Radio', token: 'rounded-sm (2px)' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
];

@Component({
  selector: 'site-checkbox-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    CheckboxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Checkbox"
      subtitle="Control de selección binaria o múltiple. Soporta estados checked, indeterminate y error."
      docsSource="docs/build-prompts/coherence-input.md"
      buildPromptSlug="coherence-input"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">

        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
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
                <input type="checkbox" [checked]="checked()" (change)="checked.set(!checked())" class="accent-action" />
                checked
              </label>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="indeterminate()" (change)="indeterminate.set(!indeterminate())" class="accent-action" />
                indeterminate
              </label>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="disabled()" (change)="disabled.set(!disabled())" class="accent-action" />
                disabled
              </label>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="required()" (change)="required.set(!required())" class="accent-action" />
                required
              </label>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="showError()" (change)="showError.set(!showError())" class="accent-action" />
                error
              </label>
            </fieldset>

            <!-- Label text -->
            <div>
              <label class="font-medium text-canvas-fg mb-space-1 block text-body-sm">Etiqueta</label>
              <input
                type="text"
                [value]="labelText()"
                (input)="onLabelInput($event)"
                class="w-full border border-border-hairline rounded-md px-2 py-1 text-body-sm"
              />
            </div>
          </div>

          <!-- Live preview -->
          <div slot="preview">
            <afi-checkbox
              [checked]="checked()"
              [indeterminate]="indeterminate()"
              [size]="size()"
              [label]="labelText()"
              [hint]="hint()"
              [error]="showError() ? errorText() : null"
              [disabled]="disabled()"
              [required]="required()"
              (checkedChange)="checked.set($event)"
            />
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
            <li>Activar o desactivar una opción individual.</li>
            <li>Selección múltiple dentro de un grupo.</li>
            <li>Aceptación de términos y condiciones.</li>
            <li>Estado indeterminado en fila padre de Table (selección parcial).</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo NO usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Encendido/apagado con efecto inmediato — use <code class="font-mono">&lt;afi-switch&gt;</code>.</li>
            <li>Selección exclusiva (una opción de varias) — use radio buttons.</li>
            <li>Selección de un valor de una lista larga — use <code class="font-mono">&lt;afi-select&gt;</code>.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-3">Composiciones</h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            Grupo de Checkbox para filtros. Checkbox indeterminado como selector de fila padre en Table.
            Checkbox + label + hint para términos legales.
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
            <li>Usa <code class="font-mono text-action-700">&lt;input type="checkbox"&gt;</code> nativo — nunca un <code class="font-mono">&lt;div&gt;</code> con role.</li>
            <li>Siempre incluya un <code class="font-mono text-action-700">label</code> visible, salvo en tablas donde <code class="font-mono text-action-700">ariaLabel</code> es suficiente.</li>
            <li>Estado indeterminado sincronizado vía propiedad DOM (no atributo HTML).</li>
            <li>En estado error: <code class="font-mono text-action-700">aria-invalid="true"</code> y texto de error con <code class="font-mono">role="alert"</code>.</li>
            <li>Campo requerido: <code class="font-mono text-action-700">aria-required="true"</code> + asterisco visual.</li>
            <li>Zona táctil mínima de 44×44px.</li>
          </ul>

          <h3 id="mapa-de-teclado" class="text-body-md font-medium text-canvas-fg mb-space-3">Mapa de teclado</h3>
          <div class="space-y-space-3 mb-space-8">
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Tab</kbd>
              <span class="text-body-md text-neutral-600">Enfoca el checkbox</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Space</kbd>
              <span class="text-body-md text-neutral-600">Alterna el estado checked</span>
            </div>
          </div>

          <h3 id="demostracion-lectora" class="text-body-md font-medium text-canvas-fg mb-space-3">Demostración lectora de pantalla</h3>
          <div class="p-space-4 bg-neutral-50 rounded-md border border-border-hairline space-y-space-4">
            <afi-checkbox
              label="Acepto los términos y condiciones"
              [required]="true"
              error="Debe aceptar los términos para continuar."
            />
            <code class="block text-body-sm font-mono text-neutral-600">aria-invalid="true" · aria-required="true" · role="alert"</code>
          </div>
        </section>

        <!-- Motion -->
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-4">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>Marca de verificación SVG: animación de trazo (<code class="font-mono">stroke-dashoffset</code>) 200ms con retardo de 80ms.</li>
            <li>Trazo indeterminado: 150ms con el mismo retardo.</li>
            <li>Caja: transición de color 150ms <code class="font-mono">ease-out</code> + escala elástica 250ms <code class="font-mono">cubic-bezier(0.34, 1.56, 0.64, 1)</code>.</li>
            <li>Reduced motion: todas las transiciones colapsan a 0ms.</li>
          </ul>
          <div class="flex items-center gap-space-4 p-space-4 bg-neutral-50 rounded-md border border-border-hairline">
            <afi-checkbox label="Haga clic para alternar" />
            <span class="text-body-sm text-neutral-500">Observe la animación del trazo al marcar y desmarcar.</span>
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
                <div class="mb-space-2"><afi-checkbox label="Recibir notificaciones por correo" /></div>
                <p class="text-body-sm text-neutral-600">Checkbox para opciones que el usuario activa o desactiva.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <div class="mb-space-2"><afi-checkbox label="Activar modo oscuro" /></div>
                <p class="text-body-sm text-neutral-600">Use Switch para ajustes con efecto inmediato.</p>
              </div>
            </div>

            <!-- Pair 2 -->
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <div class="mb-space-2"><afi-checkbox label="Acepto los términos" [required]="true" /></div>
                <p class="text-body-sm text-neutral-600">Requerido con asterisco visible.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <div class="mb-space-2"><afi-checkbox ariaLabel="Términos" /></div>
                <p class="text-body-sm text-neutral-600">Sin label visible el usuario no sabe qué acepta.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class CheckboxPage {
  readonly size = signal<CheckboxSize>('md');
  readonly checked = signal(false);
  readonly indeterminate = signal(false);
  readonly disabled = signal(false);
  readonly required = signal(false);
  readonly showError = signal(false);
  readonly labelText = signal('Acepto los términos y condiciones');
  readonly hint = signal<string | null>('Lea los términos antes de continuar.');
  readonly errorText = signal('Debe aceptar los términos para continuar.');

  readonly sizes = SIZES;
  readonly tokenRows = CHECKBOX_TOKENS;

  readonly importCode = "import { CheckboxComponent } from '@coherence/ui/checkbox';";

  readonly realWorldCode = `<afi-checkbox
  label="Acepto los términos y condiciones"
  [required]="true"
  [checked]="aceptado()"
  (checkedChange)="onAceptadoChange($event)"
  [error]="terminosError()"
/>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = [];
    if (this.size() !== 'md') props.push(`  size="${this.size()}"`);
    if (this.labelText()) props.push(`  label="${this.labelText()}"`);
    if (this.checked()) props.push('  [checked]="true"');
    if (this.indeterminate()) props.push('  [indeterminate]="true"');
    if (this.disabled()) props.push('  [disabled]="true"');
    if (this.required()) props.push('  [required]="true"');
    if (this.showError()) props.push(`  error="${this.errorText()}"`);

    const propsStr = props.length ? '\n' + props.join('\n') + '\n' : '';
    return `<afi-checkbox${propsStr}/>`;
  });

  readonly apiInputs = [
    { name: 'checked', type: 'boolean', default: 'false', notes: 'Estado marcado' },
    { name: 'indeterminate', type: 'boolean', default: 'false', notes: 'Estado indeterminado (fila padre de Table)' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", notes: 'Tamaño de la casilla' },
    { name: 'label', type: 'string | null', default: 'null', notes: 'Texto visible del label' },
    { name: 'hint', type: 'string | null', default: 'null', notes: 'Texto de ayuda' },
    { name: 'error', type: 'string | null', default: 'null', notes: 'Error: borde rojo + aria-invalid' },
    { name: 'disabled', type: 'boolean', default: 'false', notes: 'Desactiva interacción' },
    { name: 'required', type: 'boolean', default: 'false', notes: 'Asterisco + aria-required' },
    { name: 'ariaLabel', type: 'string | null', default: 'null', notes: 'Solo cuando label está ausente' },
  ];

  readonly apiOutputs = [
    { name: 'checkedChange', payload: 'boolean', notes: 'Emitido al alternar el estado' },
  ];

  onLabelInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.labelText.set(target.value);
  }
}
