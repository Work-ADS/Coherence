import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { TableComponent } from '@coherence/ui';
import type { TableColumn, TableSortState, TableDensity } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const DENSITIES: TableDensity[] = ['compact', 'comfortable'];

const SAMPLE_COLUMNS: TableColumn[] = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'nombre', label: 'Nombre', sortable: true },
  { key: 'estado', label: 'Estado' },
  { key: 'monto', label: 'Monto', align: 'end', sortable: true },
];

const SAMPLE_ROWS: Record<string, unknown>[] = [
  { id: 1, nombre: 'Operación Alpha', estado: 'Activo', monto: '$12,500' },
  { id: 2, nombre: 'Operación Beta', estado: 'Pendiente', monto: '$8,300' },
  { id: 3, nombre: 'Operación Gamma', estado: 'Cerrado', monto: '$45,000' },
  { id: 4, nombre: 'Operación Delta', estado: 'Activo', monto: '$3,200' },
];

const TABLE_TOKENS: TokenRow[] = [
  { property: 'Fondo cabecera', token: 'var(--surface-100)' },
  { property: 'Texto cabecera', token: 'var(--color-neutral-500)' },
  { property: 'Borde fila', token: 'var(--border-hairline)' },
  { property: 'Fondo hover fila', token: 'var(--surface-100)' },
  { property: 'Fondo seleccionado', token: 'var(--action-500) / 5%' },
  { property: 'Borde selección', token: 'var(--action-500)' },
  { property: 'Estado vacío texto', token: 'var(--color-neutral-500)' },
  { property: 'Skeleton', token: 'var(--color-neutral-200)' },
  { property: 'Tipografía', token: 'var(--type-body-sm)' },
  { property: 'Altura (compact)', token: 'h-9 (36px)' },
  { property: 'Altura (comfortable)', token: 'h-12 (48px)' },
];

@Component({
  selector: 'site-table-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    TableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Table"
      subtitle="Tabla de datos semántica con columnas ordenables, selección de filas y estados vacío/cargando."
      docsSource="docs/build-prompts/coherence-site.md"
      buildPromptSlug="coherence-site"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">

        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <!-- Density -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Densidad</legend>
              @for (d of densities; track d) {
                <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                  <input
                    type="radio"
                    name="density"
                    [value]="d"
                    [checked]="density() === d"
                    (change)="density.set(d)"
                    class="accent-action"
                  />
                  {{ d }}
                </label>
              }
            </fieldset>

            <!-- State toggles -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Estado</legend>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="selectable()" (change)="selectable.set(!selectable())" class="accent-action" />
                selectable
              </label>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="loading()" (change)="loading.set(!loading())" class="accent-action" />
                loading
              </label>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="empty()" (change)="empty.set(!empty())" class="accent-action" />
                empty (sin datos)
              </label>
            </fieldset>
          </div>

          <!-- Live preview -->
          <div slot="preview">
            <afi-table
              [columns]="columns"
              [rows]="visibleRows()"
              [density]="density()"
              [selectable]="selectable()"
              [loading]="loading()"
              [selected]="selected()"
              (selectedChange)="selected.set($event)"
              (sortChange)="sortBy.set($event)"
              [sortBy]="sortBy()"
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
            <li>Presentar datos tabulares con posibilidad de ordenar y seleccionar.</li>
            <li>Listas de operaciones, transacciones o registros.</li>
            <li>Cuando la densidad de información requiere columnas alineadas.</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo NO usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Datos con una sola columna — use una lista.</li>
            <li>Contenido principalmente visual — use Cards o una cuadrícula.</li>
            <li>Menos de 3 registros — considere un resumen en texto.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-3">Composiciones</h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            Table + PageHeader con filtros y acciones masivas. Table dentro de Card para contexto visual.
            Table + StatusChip en la columna de estado.
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
            <li>Usa <code class="font-mono text-action-700">&lt;table&gt;</code> semántico con <code class="font-mono">&lt;thead&gt;</code>, <code class="font-mono">&lt;tbody&gt;</code>, <code class="font-mono">&lt;th scope="col"&gt;</code>.</li>
            <li>Columnas ordenables incluyen <code class="font-mono text-action-700">aria-sort</code> (ascending | descending | none).</li>
            <li>Estado cargando usa <code class="font-mono text-action-700">aria-busy="true"</code> en <code class="font-mono">&lt;tbody&gt;</code>.</li>
            <li>Celda de estado vacío usa <code class="font-mono text-action-700">aria-live="polite"</code>.</li>
            <li>Checkboxes de selección incluyen <code class="font-mono text-action-700">ariaLabel</code> descriptivo.</li>
          </ul>

          <h3 id="mapa-de-teclado" class="text-body-md font-medium text-canvas-fg mb-space-3">Mapa de teclado</h3>
          <div class="space-y-space-3 mb-space-8">
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Tab</kbd>
              <span class="text-body-md text-neutral-600">Navega entre celdas interactivas (checkboxes, cabeceras ordenables)</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Enter / Space</kbd>
              <span class="text-body-md text-neutral-600">Activa ordenamiento o selección</span>
            </div>
          </div>
        </section>

        <!-- Motion -->
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-4">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>Transición de color de fila en hover: <code class="font-mono">var(--duration-fast)</code> (150ms).</li>
            <li>Skeleton pulsa con <code class="font-mono">animate-pulse</code>.</li>
            <li>Reduced motion: transiciones colapsan a instantáneo; skeleton estático.</li>
          </ul>
        </section>

        <!-- Do & Don't -->
        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do & Don't</h2>
          <div class="space-y-space-4">
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">Alinear montos y números a la derecha con <code class="font-mono">align: 'end'</code>.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">Alinear cifras a la izquierda dificulta la comparación visual.</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">Mostrar skeleton rows durante la carga para preservar el layout.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">Usar un spinner genérico que colapsa la altura de la tabla.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class TablePage {
  readonly density = signal<TableDensity>('compact');
  readonly selectable = signal(false);
  readonly loading = signal(false);
  readonly empty = signal(false);
  readonly selected = signal<Record<string, unknown>[]>([]);
  readonly sortBy = signal<TableSortState | null>(null);

  readonly densities = DENSITIES;
  readonly columns = SAMPLE_COLUMNS;
  readonly tokenRows = TABLE_TOKENS;

  readonly visibleRows = computed(() =>
    this.empty() ? [] : SAMPLE_ROWS,
  );

  readonly importCode = `import { TableComponent } from '@coherence/ui/table';
import type { TableColumn, TableSortState } from '@coherence/ui/table';`;

  readonly realWorldCode = `<afi-table
  [columns]="columnas"
  [rows]="operaciones()"
  [selectable]="true"
  [sortBy]="orden()"
  (sortChange)="orden.set($event)"
  (selectedChange)="seleccion.set($event)"
  (rowClicked)="abrirDetalle($event.row)"
/>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = [
      '  [columns]="columns"',
      '  [rows]="rows()"',
    ];
    if (this.density() !== 'compact') props.push(`  density="${this.density()}"`);
    if (this.selectable()) props.push('  [selectable]="true"');
    if (this.loading()) props.push('  [loading]="true"');
    return `<afi-table\n${props.join('\n')}\n/>`;
  });

  readonly apiInputs = [
    { name: 'columns', type: 'TableColumn[]', default: '[]', notes: 'Definición de columnas' },
    { name: 'rows', type: 'Record<string, unknown>[]', default: '[]', notes: 'Datos a mostrar' },
    { name: 'trackByKey', type: 'string', default: "'id'", notes: 'Propiedad usada como track key' },
    { name: 'selected', type: 'Record<string, unknown>[]', default: '[]', notes: 'Filas seleccionadas' },
    { name: 'selectable', type: 'boolean', default: 'false', notes: 'Habilita checkboxes de selección' },
    { name: 'sortBy', type: 'TableSortState | null', default: 'null', notes: 'Estado de ordenamiento' },
    { name: 'loading', type: 'boolean', default: 'false', notes: 'Muestra skeleton rows' },
    { name: 'emptyText', type: 'string', default: "'Sin datos'", notes: 'Texto cuando no hay filas' },
    { name: 'rowHoverable', type: 'boolean', default: 'true', notes: 'Habilita hover en filas' },
    { name: 'density', type: "'compact' | 'comfortable'", default: "'compact'", notes: 'Altura de fila' },
  ];

  readonly apiOutputs = [
    { name: 'selectedChange', payload: 'Record<string, unknown>[]', notes: 'Emitido al cambiar la selección' },
    { name: 'sortChange', payload: 'TableSortState | null', notes: 'Emitido al cambiar el ordenamiento' },
    { name: 'rowClicked', payload: '{ row, event }', notes: 'Emitido al hacer clic en una fila' },
  ];
}
