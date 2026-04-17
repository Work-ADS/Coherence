import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { InputComponent } from '@coherence/ui';
import type { InputSize, InputType } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const TYPES: InputType[] = ['text', 'textarea', 'number', 'email', 'password'];
const SIZES: InputSize[] = ['sm', 'md', 'lg'];

const INPUT_TOKENS: TokenRow[] = [
  { property: 'Fondo', token: 'var(--surface-base)' },
  { property: 'Borde (idle)', token: 'var(--border-hairline)' },
  { property: 'Borde (error)', token: 'var(--system-error-base)' },
  { property: 'Borde (hover)', token: 'var(--neutral-400)' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px offset' },
  { property: 'Texto', token: 'var(--canvas-fg)' },
  { property: 'Placeholder', token: 'var(--neutral-400)' },
  { property: 'Label', token: 'var(--canvas-fg)' },
  { property: 'Hint', token: 'var(--neutral-500)' },
  { property: 'Error', token: 'var(--system-error-base)' },
  { property: 'Altura (sm/md/lg)', token: 'var(--control-h-sm), -md, -lg' },
  { property: 'Radio', token: 'var(--radius-md)' },
  { property: 'Tipografía', token: 'var(--type-body-sm), var(--type-body-md)' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
];

@Component({
  selector: 'site-input-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    InputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Input"
      subtitle="Campo de formulario para texto, número, email y contraseña. Incluye label, hint y error integrados."
      docsSource="docs/build-prompts/coherence-input.md"
      buildPromptSlug="coherence-input"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">

        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <!-- Type -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Tipo</legend>
              @for (t of types; track t) {
                <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                  <input
                    type="radio"
                    name="type"
                    [value]="t"
                    [checked]="type() === t"
                    (change)="type.set(t)"
                    class="accent-action"
                  />
                  {{ t }}
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
                <input type="checkbox" [checked]="readonly()" (change)="readonly.set(!readonly())" class="accent-action" />
                readonly
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
                (input)="onFieldInput($event, 'label')"
                class="w-full border border-border-hairline rounded-md px-2 py-1 text-body-sm"
              />
            </div>

            <!-- Placeholder -->
            <div>
              <label class="font-medium text-canvas-fg mb-space-1 block text-body-sm">Placeholder</label>
              <input
                type="text"
                [value]="placeholder()"
                (input)="onFieldInput($event, 'placeholder')"
                class="w-full border border-border-hairline rounded-md px-2 py-1 text-body-sm"
              />
            </div>
          </div>

          <!-- Live preview -->
          <div slot="preview">
            <afi-input
              [type]="type()"
              [size]="size()"
              [label]="labelText()"
              [placeholder]="placeholder()"
              [hint]="hint()"
              [error]="showError() ? errorText() : null"
              [disabled]="disabled()"
              [readonly]="readonly()"
              [required]="required()"
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
            <li>Entrada de texto libre: nombre, correo electrónico, URL.</li>
            <li>Texto multilínea (comentarios, notas) con <code class="font-mono text-action-700">type="textarea"</code>.</li>
            <li>Valores numéricos con step/min/max.</li>
            <li>Contraseña enmascarada.</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo NO usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Selección de una lista conocida — use <code class="font-mono">&lt;afi-select&gt;</code>.</li>
            <li>Encendido/apagado binario — use <code class="font-mono">&lt;afi-switch&gt;</code>.</li>
            <li>Selección múltiple — use un grupo de <code class="font-mono">&lt;afi-checkbox&gt;</code>.</li>
            <li>Texto enriquecido — fuera de alcance en v1.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-3">Composiciones</h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            Input + Input + Button en formulario. Input con <code class="font-mono">size="sm"</code> en fila de filtros de Table.
            Consumer controla validación vía la prop <code class="font-mono">error</code>.
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
            <li>Siempre incluya un <code class="font-mono text-action-700">&lt;label&gt;</code> visible, salvo en filtros donde <code class="font-mono text-action-700">ariaLabel</code> es suficiente.</li>
            <li><code class="font-mono text-action-700">aria-describedby</code> enlaza hint y error de forma reactiva.</li>
            <li>En estado error: <code class="font-mono text-action-700">aria-invalid="true"</code> y el texto de error se anuncia con <code class="font-mono">role="alert"</code>.</li>
            <li>Campo requerido: <code class="font-mono text-action-700">aria-required="true"</code> + asterisco visual en la etiqueta.</li>
            <li><code class="font-mono text-action-700">autocomplete</code> siempre configurado para datos personales (email, name, current-password).</li>
            <li>Foco visible con anillo de 2px (<code class="font-mono">--border-focus</code>).</li>
          </ul>

          <h3 id="mapa-de-teclado" class="text-body-md font-medium text-canvas-fg mb-space-3">Mapa de teclado</h3>
          <div class="space-y-space-3 mb-space-8">
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Tab</kbd>
              <span class="text-body-md text-neutral-600">Enfoca el campo</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Shift + Tab</kbd>
              <span class="text-body-md text-neutral-600">Retrocede al campo anterior</span>
            </div>
          </div>

          <h3 id="demostracion-lectora" class="text-body-md font-medium text-canvas-fg mb-space-3">Demostración lectora de pantalla</h3>
          <div class="p-space-4 bg-neutral-50 rounded-md border border-border-hairline space-y-space-4">
            <afi-input
              label="Correo electrónico"
              type="email"
              [required]="true"
              autocomplete="email"
              error="Introduzca un correo electrónico válido."
            />
            <code class="block text-body-sm font-mono text-neutral-600">aria-invalid="true" · aria-describedby → error · role="alert"</code>
          </div>
        </section>

        <!-- Motion -->
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-4">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>Transición de borde: <code class="font-mono">var(--duration-fast)</code> (150ms) <code class="font-mono">ease-out</code></li>
            <li>Reduced motion: transiciones colapsan a instantáneo.</li>
          </ul>
          <div class="p-space-4 bg-neutral-50 rounded-md border border-border-hairline">
            <afi-input label="Enfóqueme" placeholder="Observe la transición de borde" />
            <p class="mt-space-2 text-body-sm text-neutral-500">Haga clic en el campo para ver la transición de foco.</p>
          </div>
        </section>

        <!-- Do & Don't -->
        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do & Don't</h2>
          <div class="space-y-space-4">
            <!-- Pair 1: Label siempre -->
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <div class="mb-space-2"><afi-input label="Correo electrónico" type="email" placeholder="usuario&#64;ejemplo.com" /></div>
                <p class="text-body-sm text-neutral-600">Label visible describe el campo.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <div class="mb-space-2"><afi-input placeholder="Correo electrónico" /></div>
                <p class="text-body-sm text-neutral-600">Placeholder como única etiqueta desaparece al escribir.</p>
              </div>
            </div>

            <!-- Pair 2: Error descriptivo -->
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <div class="mb-space-2"><afi-input label="Importe" type="number" error="El importe debe ser mayor que cero." /></div>
                <p class="text-body-sm text-neutral-600">Error indica la restricción y la corrección.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <div class="mb-space-2"><afi-input label="Importe" type="number" error="Valor no válido." /></div>
                <p class="text-body-sm text-neutral-600">Error genérico no ayuda al usuario a corregir.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class InputPage {
  readonly type = signal<InputType>('text');
  readonly size = signal<InputSize>('md');
  readonly disabled = signal(false);
  readonly readonly = signal(false);
  readonly required = signal(false);
  readonly showError = signal(false);
  readonly labelText = signal('Correo electrónico');
  readonly placeholder = signal('usuario@ejemplo.com');
  readonly hint = signal<string | null>('Usaremos este correo para la verificación.');
  readonly errorText = signal('Introduzca un correo electrónico válido.');

  readonly types = TYPES;
  readonly sizes = SIZES;
  readonly tokenRows = INPUT_TOKENS;

  readonly importCode = "import { InputComponent } from '@coherence/ui/input';";

  readonly realWorldCode = `<afi-input
  label="Correo electrónico"
  type="email"
  [required]="true"
  autocomplete="email"
  hint="Usaremos este correo para la verificación."
  [error]="emailError()"
  (valueChange)="onEmailChange($event)"
/>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = [];
    if (this.type() !== 'text') props.push(`  type="${this.type()}"`);
    if (this.size() !== 'md') props.push(`  size="${this.size()}"`);
    if (this.labelText()) props.push(`  label="${this.labelText()}"`);
    if (this.placeholder()) props.push(`  placeholder="${this.placeholder()}"`);
    if (this.disabled()) props.push('  [disabled]="true"');
    if (this.readonly()) props.push('  [readonly]="true"');
    if (this.required()) props.push('  [required]="true"');
    if (this.showError()) props.push(`  error="${this.errorText()}"`);

    const propsStr = props.length ? '\n' + props.join('\n') + '\n' : '';
    return `<afi-input${propsStr}/>`;
  });

  readonly apiInputs = [
    { name: 'type', type: "'text' | 'textarea' | 'number' | 'email' | 'password'", default: "'text'", notes: 'Elemento nativo y tipo de teclado' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", notes: 'Altura del campo' },
    { name: 'value', type: 'string | number | null', default: 'null', notes: 'Valor actual (bidireccional con valueChange)' },
    { name: 'label', type: 'string | null', default: 'null', notes: 'Texto visible del <label>' },
    { name: 'hint', type: 'string | null', default: 'null', notes: 'Texto de ayuda debajo del campo' },
    { name: 'error', type: 'string | null', default: 'null', notes: 'Error: borde rojo + aria-invalid' },
    { name: 'placeholder', type: 'string | null', default: 'null', notes: 'Texto de marcador' },
    { name: 'disabled', type: 'boolean', default: 'false', notes: 'Desactiva interacción' },
    { name: 'readonly', type: 'boolean', default: 'false', notes: 'Enfocable pero no editable' },
    { name: 'required', type: 'boolean', default: 'false', notes: 'Asterisco + aria-required' },
    { name: 'autocomplete', type: 'string | null', default: 'null', notes: 'Valor de autocompletado WHATWG' },
    { name: 'ariaLabel', type: 'string | null', default: 'null', notes: 'Solo cuando label está ausente' },
  ];

  readonly apiOutputs = [
    { name: 'valueChange', payload: 'string | number | null', notes: 'Emitido al escribir (input) o cambiar (change)' },
    { name: 'focused', payload: 'FocusEvent', notes: 'Emitido al enfocar el campo' },
    { name: 'blurred', payload: 'FocusEvent', notes: 'Emitido al desenfocar el campo' },
  ];

  onFieldInput(event: Event, field: 'label' | 'placeholder'): void {
    const target = event.target as HTMLInputElement;
    if (field === 'label') this.labelText.set(target.value);
    else this.placeholder.set(target.value);
  }
}
