import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { RadioGroupComponent, RadioGroupItemComponent } from '@coherence/ui';
import type { RadioSize } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const SIZES: RadioSize[] = ['sm', 'md'];

const RADIO_TOKENS: TokenRow[] = [
  { property: 'Fondo (unselected)', token: 'var(--surface-base)' },
  { property: 'Fondo (selected)', token: 'var(--action-500)' },
  { property: 'Borde (idle)', token: 'var(--border-hairline)' },
  { property: 'Borde (selected)', token: 'var(--action-500)' },
  { property: 'Punto interior', token: 'white' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px offset' },
  { property: 'Texto label', token: 'var(--canvas-fg)' },
  { property: 'Hint', token: 'var(--neutral-500)' },
  { property: 'Tamaño (sm/md)', token: '16px / 20px' },
  { property: 'Radio', token: 'rounded-full' },
  { property: 'Transición escala', token: '250ms cubic-bezier(0.34, 1.56, 0.64, 1)' },
];

@Component({
  selector: 'site-radio-group-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Radio Group"
      subtitle="Selección exclusiva de una opción dentro de un grupo. Micro-animación elástica al seleccionar."
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
                <input type="checkbox" [checked]="disabled()" (change)="disabled.set(!disabled())" class="accent-action" />
                disabled
              </label>
            </fieldset>
          </div>

          <!-- Live preview -->
          <div slot="preview">
            <afi-radio-group legend="Método de pago" [ariaLabel]="'Método de pago'">
              @for (opt of options; track opt.value) {
                <afi-radio-group-item
                  [value]="opt.value"
                  [label]="opt.label"
                  [hint]="opt.hint"
                  [name]="'payment-method'"
                  [selected]="selectedValue() === opt.value"
                  [disabled]="disabled()"
                  [size]="size()"
                  (selectedChange)="selectedValue.set($event)"
                />
              }
            </afi-radio-group>
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
            <li>Selección exclusiva de una opción entre 2–6 alternativas.</li>
            <li>Formularios donde el usuario debe elegir exactamente una opción.</li>
            <li>Preferencias de envío, método de pago, tipo de cuenta.</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo NO usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Selección múltiple — use <code class="font-mono">&lt;afi-checkbox&gt;</code>.</li>
            <li>Más de 6 opciones — use <code class="font-mono">&lt;afi-select&gt;</code>.</li>
            <li>Toggle on/off — use <code class="font-mono">&lt;afi-switch&gt;</code>.</li>
          </ul>

          <h3 id="ejemplo-real" class="text-body-md font-medium text-canvas-fg mb-space-3">Ejemplo real</h3>
          <afi-code-block
            [code]="realWorldCode"
            language="html"
          />
        </section>

        <!-- API Reference -->
        <section>
          <h2 id="api-reference" class="text-section text-canvas-fg mb-space-4">API Reference</h2>

          <h3 id="radio-group-inputs" class="text-body-md font-medium text-canvas-fg mb-space-3">RadioGroup — Entradas</h3>
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
                @for (row of groupApiInputs; track row.name) {
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

          <h3 id="radio-item-inputs" class="text-body-md font-medium text-canvas-fg mb-space-3">RadioGroupItem — Entradas</h3>
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
                @for (row of itemApiInputs; track row.name) {
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
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Componente</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Nombre</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Carga útil</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Descripción</th>
                </tr>
              </thead>
              <tbody>
                @for (row of apiOutputs; track row.name) {
                  <tr class="border-b border-border-hairline last:border-b-0">
                    <td class="px-space-4 py-space-3 font-mono text-action-700">{{ row.component }}</td>
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
            <li>Usa <code class="font-mono text-action-700">&lt;input type="radio"&gt;</code> nativo dentro de un <code class="font-mono text-action-700">&lt;fieldset&gt;</code> con <code class="font-mono">role="radiogroup"</code>.</li>
            <li>Cada opción debe tener un <code class="font-mono text-action-700">label</code> visible.</li>
            <li>El grupo necesita una <code class="font-mono text-action-700">legend</code> o <code class="font-mono text-action-700">ariaLabel</code>.</li>
            <li>Zona táctil mínima de 44×44px.</li>
          </ul>

          <h3 id="mapa-de-teclado" class="text-body-md font-medium text-canvas-fg mb-space-3">Mapa de teclado</h3>
          <div class="space-y-space-3 mb-space-8">
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Tab</kbd>
              <span class="text-body-md text-neutral-600">Enfoca el grupo de radio</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">↑ ↓</kbd>
              <span class="text-body-md text-neutral-600">Navega entre opciones</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Space</kbd>
              <span class="text-body-md text-neutral-600">Selecciona la opción enfocada</span>
            </div>
          </div>
        </section>

        <!-- Motion -->
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-4">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>Punto interior: escala elástica 250ms <code class="font-mono">cubic-bezier(0.34, 1.56, 0.64, 1)</code> — efecto rebote al seleccionar.</li>
            <li>Anillo exterior: transición de color 150ms <code class="font-mono">ease-out</code>.</li>
            <li>Reduced motion: todas las transiciones colapsan a 0ms.</li>
          </ul>
          <div class="flex flex-col gap-space-2 p-space-4 bg-neutral-50 rounded-md border border-border-hairline">
            <afi-radio-group [ariaLabel]="'Ejemplo de animación'">
              <afi-radio-group-item
                value="a"
                label="Opción A"
                name="motion-demo"
                [selected]="motionDemo() === 'a'"
                (selectedChange)="motionDemo.set($event)"
              />
              <afi-radio-group-item
                value="b"
                label="Opción B"
                name="motion-demo"
                [selected]="motionDemo() === 'b'"
                (selectedChange)="motionDemo.set($event)"
              />
            </afi-radio-group>
            <span class="text-body-sm text-neutral-500">Observe la animación elástica del punto al seleccionar.</span>
          </div>
        </section>

        <!-- Do & Don't -->
        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do & Don't</h2>
          <div class="space-y-space-4">
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <afi-radio-group [ariaLabel]="'Tipo de cuenta'">
                  <afi-radio-group-item value="personal" label="Personal" name="do1" [selected]="true" />
                  <afi-radio-group-item value="empresa" label="Empresa" name="do1" />
                </afi-radio-group>
                <p class="text-body-sm text-neutral-600 mt-space-2">Radio para selección exclusiva entre pocas opciones.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">No use radio para selección múltiple — use Checkbox.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class RadioGroupPage {
  readonly size = signal<RadioSize>('md');
  readonly disabled = signal(false);
  readonly selectedValue = signal('tarjeta');
  readonly motionDemo = signal('a');

  readonly sizes = SIZES;
  readonly tokenRows = RADIO_TOKENS;

  readonly options = [
    { value: 'tarjeta', label: 'Tarjeta de crédito', hint: 'Visa, Mastercard, AMEX' },
    { value: 'transferencia', label: 'Transferencia bancaria', hint: 'ACH o wire' },
    { value: 'efectivo', label: 'Efectivo', hint: null },
  ];

  readonly importCode = `import { RadioGroupComponent, RadioGroupItemComponent } from '@coherence/ui/radio-group';`;

  readonly realWorldCode = `<afi-radio-group legend="Método de pago" [ariaLabel]="'Método de pago'">
  <afi-radio-group-item
    value="tarjeta"
    label="Tarjeta de crédito"
    hint="Visa, Mastercard, AMEX"
    name="payment"
    [selected]="metodo() === 'tarjeta'"
    (selectedChange)="metodo.set($event)"
  />
  <afi-radio-group-item
    value="transferencia"
    label="Transferencia bancaria"
    name="payment"
    [selected]="metodo() === 'transferencia'"
    (selectedChange)="metodo.set($event)"
  />
</afi-radio-group>`;

  readonly codeSnippet = computed(() => {
    const sz = this.size() !== 'md' ? `\n    [size]="'${this.size()}'"` : '';
    const dis = this.disabled() ? '\n    [disabled]="true"' : '';
    return `<afi-radio-group legend="Método de pago">
  <afi-radio-group-item
    value="tarjeta"
    label="Tarjeta de crédito"
    name="payment"${sz}${dis}
    [selected]="metodo() === 'tarjeta'"
    (selectedChange)="metodo.set($event)"
  />
  <afi-radio-group-item
    value="transferencia"
    label="Transferencia bancaria"
    name="payment"${sz}${dis}
    [selected]="metodo() === 'transferencia'"
    (selectedChange)="metodo.set($event)"
  />
</afi-radio-group>`;
  });

  readonly groupApiInputs = [
    { name: 'value', type: 'string | null', default: 'null', notes: 'Valor seleccionado actual' },
    { name: 'legend', type: 'string | null', default: 'null', notes: 'Título visible del grupo' },
    { name: 'disabled', type: 'boolean', default: 'false', notes: 'Desactiva todo el grupo' },
    { name: 'ariaLabel', type: 'string | null', default: 'null', notes: 'Label para lectoras de pantalla' },
    { name: 'ariaLabelledBy', type: 'string | null', default: 'null', notes: 'ID del elemento que etiqueta el grupo' },
  ];

  readonly itemApiInputs = [
    { name: 'value', type: 'string', default: '(requerido)', notes: 'Valor de esta opción' },
    { name: 'label', type: 'string | null', default: 'null', notes: 'Texto visible' },
    { name: 'hint', type: 'string | null', default: 'null', notes: 'Texto de ayuda' },
    { name: 'disabled', type: 'boolean', default: 'false', notes: 'Desactiva esta opción' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", notes: 'Tamaño del indicador' },
    { name: 'name', type: 'string', default: "''", notes: 'Nombre del grupo (agrupa los radios nativos)' },
    { name: 'selected', type: 'boolean', default: 'false', notes: 'Si esta opción está seleccionada' },
  ];

  readonly apiOutputs = [
    { component: 'RadioGroup', name: 'valueChange', payload: 'string', notes: 'Emitido al cambiar la selección' },
    { component: 'RadioGroupItem', name: 'selectedChange', payload: 'string', notes: 'Emitido cuando este item es seleccionado' },
  ];
}
