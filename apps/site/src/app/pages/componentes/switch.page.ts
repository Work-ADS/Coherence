import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { SwitchComponent } from '@coherence/ui';
import type { SwitchSize } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const SIZES: SwitchSize[] = ['sm', 'md'];

const SWITCH_TOKENS: TokenRow[] = [
  { property: 'Track (off)', token: 'var(--neutral-300)' },
  { property: 'Track (on)', token: 'var(--action-500)' },
  { property: 'Thumb', token: 'white' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px offset' },
  { property: 'Texto label', token: 'var(--canvas-fg)' },
  { property: 'Hint', token: 'var(--neutral-500)' },
  { property: 'Tamaño track (sm/md)', token: '32×18px / 40×22px' },
  { property: 'Tamaño thumb (sm/md)', token: '14px / 18px' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
];

@Component({
  selector: 'site-switch-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    SwitchComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Switch"
      subtitle="Control de encendido/apagado con efecto inmediato. Usa role=&quot;switch&quot; para anuncio correcto en lectores de pantalla."
      docsSource="docs/build-prompts/coherence-primitive-page.md"
      buildPromptSlug="coherence-primitive-page"
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
                <input type="checkbox" [checked]="disabled()" (change)="disabled.set(!disabled())" class="accent-action" />
                disabled
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

            <!-- Hint text -->
            <div>
              <label class="font-medium text-canvas-fg mb-space-1 block text-body-sm">Hint</label>
              <input
                type="text"
                [value]="hintText()"
                (input)="onHintInput($event)"
                class="w-full border border-border-hairline rounded-md px-2 py-1 text-body-sm"
              />
            </div>
          </div>

          <!-- Live preview -->
          <div slot="preview">
            <afi-switch
              [checked]="checked()"
              [size]="size()"
              [label]="labelText()"
              [hint]="hintText() || null"
              [disabled]="disabled()"
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
            <li>Activar o desactivar un ajuste con efecto inmediato (modo oscuro, notificaciones).</li>
            <li>Preferencias de usuario que se aplican al instante sin un botón "Guardar".</li>
            <li>Habilitar/deshabilitar una funcionalidad en un formulario de configuración.</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo NO usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Selección que requiere confirmación (formulario con botón enviar) — use <code class="font-mono">&lt;afi-checkbox&gt;</code>.</li>
            <li>Selección múltiple dentro de un grupo — use checkboxes.</li>
            <li>Selección exclusiva entre opciones — use radio buttons.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-3">Composiciones</h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            Switch en panel de configuración. Switch con label + hint para ajustes con descripción extendida.
            Grupo de switches en sección de preferencias.
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
            <li>Usa <code class="font-mono text-action-700">&lt;button role="switch"&gt;</code> — no un checkbox ni un div.</li>
            <li><code class="font-mono text-action-700">aria-checked</code> refleja el estado actual (true/false).</li>
            <li>Siempre incluya un label visible o <code class="font-mono text-action-700">ariaLabel</code>.</li>
            <li>Hint enlazado vía <code class="font-mono text-action-700">aria-describedby</code>.</li>
            <li>Zona táctil mínima de 44×44px (garantizada por min-h del label wrapper).</li>
            <li>Advertencia en devMode si falta tanto label como ariaLabel.</li>
          </ul>

          <h3 id="mapa-de-teclado" class="text-body-md font-medium text-canvas-fg mb-space-3">Mapa de teclado</h3>
          <div class="space-y-space-3 mb-space-8">
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Tab</kbd>
              <span class="text-body-md text-neutral-600">Enfoca el switch</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Space</kbd>
              <span class="text-body-md text-neutral-600">Alterna el estado on/off</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Enter</kbd>
              <span class="text-body-md text-neutral-600">Alterna el estado (click nativo del button)</span>
            </div>
          </div>

          <h3 id="demostracion-lectora" class="text-body-md font-medium text-canvas-fg mb-space-3">Demostración lectora de pantalla</h3>
          <div class="p-space-4 bg-neutral-50 rounded-md border border-border-hairline space-y-space-4">
            <afi-switch
              label="Activar notificaciones"
              hint="Recibirá alertas en tiempo real."
              [checked]="true"
            />
            <code class="block text-body-sm font-mono text-neutral-600">role="switch" · aria-checked="true" · aria-describedby="…-hint"</code>
          </div>
        </section>

        <!-- Motion -->
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-4">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>Transición del thumb: <code class="font-mono">var(--duration-fast)</code> (150ms) <code class="font-mono">ease-out</code></li>
            <li>Transición de color del track: misma duración y curva.</li>
            <li>Reduced motion: ambas transiciones colapsan a 0ms.</li>
          </ul>
          <div class="flex items-center gap-space-4 p-space-4 bg-neutral-50 rounded-md border border-border-hairline">
            <afi-switch label="Haga clic para alternar" />
            <span class="text-body-sm text-neutral-500">Observe el desplazamiento del thumb.</span>
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
                <div class="mb-space-2"><afi-switch label="Modo oscuro" /></div>
                <p class="text-body-sm text-neutral-600">Switch para ajustes con efecto inmediato.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <div class="mb-space-2"><afi-switch label="Acepto los términos" /></div>
                <p class="text-body-sm text-neutral-600">Use Checkbox para consentimiento que requiere confirmación.</p>
              </div>
            </div>

            <!-- Pair 2 -->
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <div class="mb-space-2"><afi-switch label="Notificaciones push" hint="Reciba alertas en tiempo real." /></div>
                <p class="text-body-sm text-neutral-600">Label + hint describe claramente el efecto.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <div class="mb-space-2"><afi-switch ariaLabel="Notificaciones" /></div>
                <p class="text-body-sm text-neutral-600">Sin label visible el usuario no entiende el contexto.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class SwitchPage {
  readonly size = signal<SwitchSize>('md');
  readonly checked = signal(false);
  readonly disabled = signal(false);
  readonly labelText = signal('Activar notificaciones');
  readonly hintText = signal('Recibirá alertas en tiempo real.');

  readonly sizes = SIZES;
  readonly tokenRows = SWITCH_TOKENS;

  readonly importCode = "import { SwitchComponent } from '@coherence/ui/switch';";

  readonly realWorldCode = `<afi-switch
  label="Modo oscuro"
  hint="Cambia el tema de la aplicación."
  [checked]="modoOscuro()"
  (checkedChange)="onModoOscuroChange($event)"
/>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = [];
    if (this.size() !== 'md') props.push(`  size="${this.size()}"`);
    if (this.labelText()) props.push(`  label="${this.labelText()}"`);
    if (this.hintText()) props.push(`  hint="${this.hintText()}"`);
    if (this.checked()) props.push('  [checked]="true"');
    if (this.disabled()) props.push('  [disabled]="true"');

    const propsStr = props.length ? '\n' + props.join('\n') + '\n' : '';
    return `<afi-switch${propsStr}/>`;
  });

  readonly apiInputs = [
    { name: 'checked', type: 'boolean', default: 'false', notes: 'Estado encendido/apagado' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", notes: 'Tamaño del track y thumb' },
    { name: 'label', type: 'string | null', default: 'null', notes: 'Texto visible del label' },
    { name: 'hint', type: 'string | null', default: 'null', notes: 'Texto de ayuda (aria-describedby)' },
    { name: 'disabled', type: 'boolean', default: 'false', notes: 'Desactiva interacción' },
    { name: 'ariaLabel', type: 'string | null', default: 'null', notes: 'Solo cuando label está ausente' },
  ];

  readonly apiOutputs = [
    { name: 'checkedChange', payload: 'boolean', notes: 'Emitido al alternar el estado' },
  ];

  onLabelInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.labelText.set(target.value);
  }

  onHintInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.hintText.set(target.value);
  }
}
