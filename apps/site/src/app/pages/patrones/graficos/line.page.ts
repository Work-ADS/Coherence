import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { ChartLineComponent } from '@coherence/ui';
import type { LineSeries } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../../components/component-playground';
import { CodeBlockComponent } from '../../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../../components/tokens-table';

const LINE_TOKENS: TokenRow[] = [
  { property: 'Stroke series', token: 'var(--data-neutral-strong), var(--data-highlight-primary)' },
  { property: 'Stroke width', token: '2px' },
  { property: 'Marker radio', token: '3px (5px hover)' },
  { property: 'Grid', token: 'var(--border-hairline) @ 50% opacity' },
  { property: 'Focus ring', token: 'var(--border-focus)' },
];

const SAMPLE_DATA: LineSeries[] = [
  {
    key: 'Conservador',
    points: [
      { x: 2024, y: 100000 }, { x: 2026, y: 108000 }, { x: 2028, y: 115000 },
      { x: 2030, y: 122000 }, { x: 2032, y: 128000 }, { x: 2034, y: 134000 },
    ],
  },
  {
    key: 'Moderado',
    points: [
      { x: 2024, y: 100000 }, { x: 2026, y: 115000 }, { x: 2028, y: 132000 },
      { x: 2030, y: 150000 }, { x: 2032, y: 170000 }, { x: 2034, y: 192000 },
    ],
  },
  {
    key: 'Agresivo',
    points: [
      { x: 2024, y: 100000 }, { x: 2026, y: 125000 }, { x: 2028, y: 155000 },
      { x: 2030, y: 190000 }, { x: 2032, y: 230000 }, { x: 2034, y: 280000 },
    ],
  },
];

@Component({
  selector: 'site-line-chart-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    ChartLineComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="PATTERNS / CHARTS"
      title="Line"
      subtitle="Series temporales con segmentos rectos. Valores nulos producen gaps visibles. Markers opcionales."
      docsSource="libs/ui/src/chart/chart-line.component.ts"
      buildPromptSlug="coherence-site"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">

        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Opciones</legend>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="showMarkers()" (change)="showMarkers.set(!showMarkers())" class="accent-action" />
                Markers
              </label>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="baselineZero()" (change)="baselineZero.set(!baselineZero())" class="accent-action" />
                Baseline zero
              </label>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="loading()" (change)="loading.set(!loading())" class="accent-action" />
                Loading
              </label>
            </fieldset>
          </div>

          <div slot="preview" class="w-full">
            <afi-chart-line
              [data]="sampleData"
              [showMarkers]="showMarkers()"
              [baselineZero]="baselineZero()"
              [loading]="loading()"
              title="Evolución del patrimonio"
              subtitle="Proyección a 10 años por escenario"
              locale="es-ES"
            />
          </div>
        </afi-component-playground>

        <section>
          <h2 id="importar" class="text-section text-canvas-fg mb-space-4">Importar</h2>
          <afi-code-block [code]="importCode" language="ts" />
        </section>

        <section>
          <h2 id="uso" class="text-section text-canvas-fg mb-space-4">Uso</h2>
          <h3 id="cuando-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Series temporales continuas (proyecciones, evolución patrimonial).</li>
            <li>Comparar tendencias de múltiples series (escenarios).</li>
            <li>Datos con posibles gaps (valores nulos).</li>
          </ul>
          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo NO usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Comparación de categorías discretas — use Bar.</li>
            <li>Correlación bidimensional — use Heatmap.</li>
          </ul>
          <h3 id="ejemplo-real" class="text-body-md font-medium text-canvas-fg mb-space-3">Ejemplo real</h3>
          <afi-code-block [code]="realWorldCode" language="html" />
        </section>

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
          <div class="overflow-x-auto rounded-lg border border-border-hairline mb-space-8">
            <table class="w-full text-body-sm">
              <thead>
                <tr class="bg-neutral-50 border-b border-border-hairline">
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Nombre</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Tipo</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Descripción</th>
                </tr>
              </thead>
              <tbody>
                @for (row of apiOutputs; track row.name) {
                  <tr class="border-b border-border-hairline last:border-b-0">
                    <td class="px-space-4 py-space-3 font-mono text-action-700">{{ row.name }}</td>
                    <td class="px-space-4 py-space-3 font-mono text-body-sm">{{ row.type }}</td>
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
          <h2 id="tokens-consumidos" class="text-section text-canvas-fg mb-space-4">Tokens consumidos</h2>
          <afi-tokens-table [rows]="tokenRows" title="" />
        </section>
        <section>
          <h2 id="accesibilidad" class="text-section text-canvas-fg mb-space-4">Accesibilidad</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>SVG <code class="font-mono text-action-700">role="img"</code> + aria-labelledby al título.</li>
            <li>Cada marker es focusable con <code class="font-mono text-action-700">role="graphics-symbol"</code> + aria-label.</li>
            <li>Leyenda de series con swatch de color+textura.</li>
            <li>Tabla de datos alternativa accesible.</li>
            <li>Doble codificación: color + textura en strokes/markers.</li>
          </ul>
        </section>
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-4">Motion</h2>
          <p class="text-body-md text-neutral-600">
            Lines: opacity 180ms. Markers: radio 120ms. Reduced motion: ambos a 0ms.
          </p>
        </section>
        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do & Don't</h2>
          <div class="grid grid-cols-2 gap-space-4">
            <div class="p-space-4 border border-system-success rounded-md">
              <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
              <p class="text-body-sm text-neutral-600">Limitar a ≤5 series para legibilidad. Usar markers cuando hay pocos puntos.</p>
            </div>
            <div class="p-space-4 border border-system-error rounded-md">
              <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
              <p class="text-body-sm text-neutral-600">Más de 5 series sin filtro — el gráfico se convierte en espagueti.</p>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class LineChartPage {
  readonly showMarkers = signal(false);
  readonly baselineZero = signal(false);
  readonly loading = signal(false);
  readonly sampleData = SAMPLE_DATA;
  readonly tokenRows = LINE_TOKENS;

  readonly importCode = `import { ChartLineComponent } from '@coherence/ui/chart';
import type { LineSeries } from '@coherence/ui/chart';`;

  readonly realWorldCode = `<!-- EvolucionChart — Wealth Planner -->
<afi-chart-line
  [data]="escenarios"
  title="Evolución del patrimonio"
  subtitle="Proyección a 30 años"
  [showMarkers]="false"
  [baselineZero]="true"
  locale="es-ES"
  (dataPointActivated)="onPointClick($event)"
/>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = ['  [data]="series"'];
    if (this.showMarkers()) props.push('  [showMarkers]="true"');
    if (this.baselineZero()) props.push('  [baselineZero]="true"');
    if (this.loading()) props.push('  [loading]="true"');
    return `<afi-chart-line\n${props.join('\n')}\n/>`;
  });

  readonly apiInputs = [
    { name: 'data', type: 'LineSeries[]', default: '[]', notes: 'Array de series { key, points: { x, y }[] }' },
    { name: 'showMarkers', type: 'boolean', default: 'false', notes: 'Muestra círculos en cada punto' },
    { name: 'baselineZero', type: 'boolean', default: 'false', notes: 'Fuerza Y-min a 0' },
    { name: 'loading', type: 'boolean', default: 'false', notes: 'Muestra LoadingOverlay' },
    { name: 'title', type: 'string | null', default: 'null', notes: 'Título del gráfico' },
    { name: 'subtitle', type: 'string | null', default: 'null', notes: 'Subtítulo' },
    { name: 'locale', type: 'string', default: "'es-ES'", notes: 'Locale para formateo' },
    { name: 'height', type: 'string', default: "'320px'", notes: 'Altura del SVG' },
    { name: 'focus', type: 'number | string | null', default: 'null', notes: 'Resalta una serie' },
  ];

  readonly apiOutputs = [
    { name: 'dataPointActivated', type: '{ index: number; datum: unknown }', notes: 'Click en un marker' },
    { name: 'dataTableToggled', type: 'boolean', notes: 'Toggle de la tabla de datos' },
    { name: 'instructionsOpened', type: 'void', notes: 'Se abrió el panel de instrucciones' },
  ];
}
