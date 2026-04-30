import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  SelectComponent,
  CheckboxComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
} from '@coherence/ui';
import type { SelectSize, SelectOption } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const SIZES: SelectSize[] = ['sm', 'md', 'lg'];

const DEMO_OPTIONS: SelectOption[] = [
  { value: 'mx', label: 'México' },
  { value: 'co', label: 'Colombia' },
  { value: 'ar', label: 'Argentina' },
  { value: 'cl', label: 'Chile' },
  { value: 'pe', label: 'Perú' },
];

const SELECT_TOKENS: TokenRow[] = [
  { property: 'Fondo', token: 'var(--surface-base)' },
  { property: 'Texto', token: 'var(--canvas-fg)' },
  { property: 'Borde (idle)', token: 'var(--border-hairline)' },
  { property: 'Borde (error)', token: 'var(--system-error-base)' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px offset' },
  { property: 'Altura (sm/md/lg)', token: 'var(--control-h-sm), -md, -lg' },
  { property: 'Radio', token: 'var(--radius-md)' },
  { property: 'Tipografía', token: 'var(--type-body-sm), var(--type-body-md)' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
];

@Component({
  selector: 'site-select-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    SelectComponent,
    CheckboxComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Select"
      subtitle="Selector nativo estilizado. Soporta opciones, grupos, placeholder, validación y tres tamaños."
      docsSource="docs/build-prompts/coherence-primitive-page.md"
      buildPromptSlug="coherence-primitive-page"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">
        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <!-- Size -->
            <afi-radio-group legend="Tamaño">
              @for (s of sizes; track s) {
                <afi-radio-group-item
                  [value]="s"
                  [label]="s"
                  [selected]="size() === s"
                  (selectedChange)="$any(size).set($event)"
                  size="sm"
                  [compact]="true"
                />
              }
            </afi-radio-group>

            <!-- Options -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Opciones</legend>
              <afi-checkbox
                [checked]="disabled()"
                (checkedChange)="disabled.set($event)"
                label="disabled"
                size="sm"
                [compact]="true"
              />
              <afi-checkbox
                [checked]="required()"
                (checkedChange)="required.set($event)"
                label="required"
                size="sm"
                [compact]="true"
              />
              <afi-checkbox
                [checked]="hasError()"
                (checkedChange)="hasError.set($event)"
                label="error"
                size="sm"
                [compact]="true"
              />
            </fieldset>
          </div>

          <!-- Live preview -->
          <div slot="preview" class="max-w-xs">
            <afi-select
              label="País"
              placeholder="Seleccione un país"
              hint="Seleccione su país de residencia."
              [options]="demoOptions"
              [size]="size()"
              [disabled]="disabled()"
              [required]="required()"
              [error]="hasError() ? 'Este campo es obligatorio.' : null"
              [value]="selectedValue()"
              (valueChange)="selectedValue.set($event)"
            />
          </div>
        </afi-component-playground>

        <!-- Importar -->
        <section>
          <h2 id="importar" class="text-section text-canvas-fg mb-space-6">Importar</h2>
          <afi-code-block [code]="importCode" language="ts" />
        </section>

        <!-- Uso -->
        <section>
          <h2 id="uso" class="text-section text-canvas-fg mb-space-6">Uso</h2>

          <h3 id="cuando-usar" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Cuándo usar
          </h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Listas de 5–15 opciones predefinidas (países, roles, categorías).</li>
            <li>Formularios donde el espacio vertical es limitado.</li>
            <li>Cuando el usuario debe elegir exactamente una opción.</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Cuándo NO usar
          </h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Menos de 4 opciones — use radio buttons.</li>
            <li>Más de 20 opciones — use un autocomplete o combobox con búsqueda.</li>
            <li>Selección múltiple — use checkboxes o un multiselect dedicado.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Composiciones
          </h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            Select con label + hint. Select con grupos de opciones (optgroup). Select dentro de
            formulario con validación reactiva.
          </p>

          <h3 id="ejemplo-real" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Ejemplo real
          </h3>
          <afi-code-block [code]="realWorldCode" language="html" />
        </section>

        <!-- API Reference -->
        <section>
          <h2 id="api-reference" class="text-section text-canvas-fg mb-space-6">API Reference</h2>

          <h3 id="entradas" class="text-body-md font-medium text-canvas-fg mb-space-4">Entradas</h3>
          <div class="overflow-x-auto rounded-lg border border-border-hairline mb-space-8">
            <table class="w-full text-body-sm">
              <thead>
                <tr class="bg-neutral-50 border-b border-border-hairline">
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">
                    Nombre
                  </th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Tipo</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">
                    Predeterminado
                  </th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">
                    Descripción
                  </th>
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

          <h3 id="salidas" class="text-body-md font-medium text-canvas-fg mb-space-4">Salidas</h3>
          <div class="overflow-x-auto rounded-lg border border-border-hairline">
            <table class="w-full text-body-sm">
              <thead>
                <tr class="bg-neutral-50 border-b border-border-hairline">
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">
                    Nombre
                  </th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">
                    Carga útil
                  </th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">
                    Descripción
                  </th>
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
        <section>
          <h2 id="tokens-consumidos" class="text-section text-canvas-fg mb-space-6">
            Tokens consumidos
          </h2>
          <afi-tokens-table [rows]="tokenRows" title="" />
        </section>

        <section>
          <h2 id="accesibilidad" class="text-section text-canvas-fg mb-space-6">Accesibilidad</h2>

          <h3 id="reglas" class="text-body-md font-medium text-canvas-fg mb-space-4">Reglas</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>
              Usa <code class="font-mono text-action-700">&lt;select&gt;</code> nativo — lector de
              pantalla lo anuncia como combobox.
            </li>
            <li>
              <code class="font-mono text-action-700">label</code> o
              <code class="font-mono text-action-700">ariaLabel</code> obligatorio — se emite
              advertencia en dev si falta.
            </li>
            <li>
              <code class="font-mono text-action-700">aria-required</code> se añade cuando
              <code class="font-mono">required</code> es true.
            </li>
            <li>
              <code class="font-mono text-action-700">aria-invalid</code> se añade cuando
              <code class="font-mono">error</code> tiene valor.
            </li>
            <li>
              <code class="font-mono text-action-700">aria-describedby</code> enlaza hint o mensaje
              de error según estado.
            </li>
          </ul>

          <h3 id="mapa-de-teclado" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Mapa de teclado
          </h3>
          <div class="space-y-space-3 mb-space-8">
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >Space / Enter</kbd
              >
              <span class="text-body-md text-neutral-600"
                >Abre la lista de opciones (nativo del navegador)</span
              >
            </div>
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >↑ ↓</kbd
              >
              <span class="text-body-md text-neutral-600">Navega entre opciones</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >Esc</kbd
              >
              <span class="text-body-md text-neutral-600">Cierra la lista sin seleccionar</span>
            </div>
          </div>
        </section>

        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-6">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>
              Transición de borde: <code class="font-mono">duration-fast ease-out</code> en hover y
              focus.
            </li>
            <li>El dropdown es nativo del navegador — sin animación personalizada.</li>
            <li>Reduced motion: sin cambios necesarios (ya es instantáneo).</li>
          </ul>
        </section>

        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-6">Do & Don't</h2>
          <div class="space-y-space-4">
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">
                  Incluya siempre un label visible o ariaLabel para accesibilidad.
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Select sin label — el lector de pantalla no puede anunciar el propósito.
                </p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">
                  Use placeholder descriptivo ("Seleccione un país").
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Más de 20 opciones sin búsqueda — use autocomplete.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class SelectPage {
  readonly size = signal<SelectSize>('md');
  readonly disabled = signal(false);
  readonly required = signal(false);
  readonly hasError = signal(false);
  readonly selectedValue = signal<string | number | null>(null);

  readonly sizes = SIZES;
  readonly demoOptions = DEMO_OPTIONS;
  readonly tokenRows = SELECT_TOKENS;

  readonly importCode = "import { SelectComponent } from '@coherence/ui/select';";

  readonly realWorldCode = `<afi-select
  label="País de residencia"
  placeholder="Seleccione un país"
  hint="Requerido para facturación."
  [options]="paises()"
  [required]="true"
  [error]="paisError()"
  [value]="paisSeleccionado()"
  (valueChange)="paisSeleccionado.set($event)"
/>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = [];
    props.push('  label="País"');
    props.push('  placeholder="Seleccione un país"');
    if (this.size() !== 'md') props.push(`  size="${this.size()}"`);
    props.push('  [options]="paises()"');
    if (this.disabled()) props.push('  [disabled]="true"');
    if (this.required()) props.push('  [required]="true"');
    if (this.hasError()) props.push('  error="Este campo es obligatorio."');
    props.push('  [value]="seleccion()"');
    props.push('  (valueChange)="seleccion.set($event)"');

    return `<afi-select\n${props.join('\n')}\n/>`;
  });

  readonly apiInputs = [
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", notes: 'Tamaño del control' },
    {
      name: 'options',
      type: 'SelectOption[]',
      default: '[]',
      notes: 'Lista de opciones a mostrar',
    },
    { name: 'value', type: 'string | number | null', default: 'null', notes: 'Valor seleccionado' },
    { name: 'label', type: 'string | null', default: 'null', notes: 'Label visible del campo' },
    {
      name: 'hint',
      type: 'string | null',
      default: 'null',
      notes: 'Texto de ayuda bajo el select',
    },
    {
      name: 'error',
      type: 'string | null',
      default: 'null',
      notes: 'Mensaje de error (activa estado error)',
    },
    {
      name: 'placeholder',
      type: 'string | null',
      default: 'null',
      notes: 'Opción placeholder deshabilitada',
    },
    { name: 'disabled', type: 'boolean', default: 'false', notes: 'Desactiva el select' },
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      notes: 'Marca como obligatorio (aria-required)',
    },
    {
      name: 'ariaLabel',
      type: 'string | null',
      default: 'null',
      notes: 'Solo cuando label está ausente',
    },
  ];

  readonly apiOutputs = [
    {
      name: 'valueChange',
      payload: 'string | number | null',
      notes: 'Emitido al seleccionar una opción',
    },
    { name: 'opened', payload: 'void', notes: 'Emitido al abrir el listbox' },
    { name: 'closed', payload: 'void', notes: 'Emitido al cerrar el listbox' },
  ];
}
