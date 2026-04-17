import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { ChartDumbbellComponent } from '@coherence/ui';
import type { DumbbellDatum } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../../components/component-playground';
import { CodeBlockComponent } from '../../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../../components/tokens-table';

const DUMBBELL_TOKENS: TokenRow[] = [
  { property: 'Dot A', token: 'var(--data-neutral-strong) (dots texture)' },
  { property: 'Dot B', token: 'var(--data-highlight-primary) (lines texture)' },
  { property: 'Conector', token: 'var(--color-neutral-300) (2px)' },
  { property: 'Labels categoría', token: 'text-neutral-600 (body-sm)' },
  { property: 'Focus ring', token: 'var(--border-focus)' },
];

const SAMPLE_DATA: DumbbellDatum[] = [
  { key: 'Renta fija', valueA: 35, valueB: 30, labelA: 'Actual', labelB: 'Recomendado' },
  { key: 'Renta variable', valueA: 40, valueB: 50, labelA: 'Actual', labelB: 'Recomendado' },
  { key: 'Inmobiliario', valueA: 15, valueB: 10, labelA: 'Actual', labelB: 'Recomendado' },
  { key: 'Alternatives', valueA: 5, valueB: 8, labelA: 'Actual', labelB: 'Recomendado' },
  { key: 'Liquidez', valueA: 5, valueB: 2, labelA: 'Actual', labelB: 'Recomendado' },
];

@Component({
  selector: 'site-dumbbell-chart-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    ChartDumbbellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="PATTERNS / CHARTS"
      title="Dumbbell"
      subtitle="Compara dos valores por categoría: actual vs objetivo, período A vs B. Horizontal por defecto."
      docsSource="libs/ui/src/chart/chart-dumbbell.component.ts"
      buildPromptSlug="coherence-site"
    >
      <div slot="code-tab">
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Opciones</legend>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="loading()" (change)="loading.set(!loading())" class="accent-action" />
                Loading
              </label>
            </fieldset>
          </div>
          <div slot="preview" class="w-full">
            <afi-chart-dumbbell
              [data]="sampleData"
              [loading]="loading()"
              title="Asignación de activos"
              subtitle="Actual vs recomendado (%)"
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
            <li>Comparar dos puntos por categoría (actual vs recomendado, antes vs después).</li>
            <li>Destacar el gap entre dos métricas relacionadas.</li>
            <li>Asset allocation: peso actual vs peso objetivo.</li>
          </ul>
          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo NO usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Más de dos valores por categoría — use Bar agrupado.</li>
            <li>Tendencia temporal — use Line.</li>
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

      <div slot="design-tab">
        <section>
          <h2 id="tokens-consumidos" class="text-section text-canvas-fg mb-space-4">Tokens consumidos</h2>
          <afi-tokens-table [rows]="tokenRows" title="" />
        </section>
        <section>
          <h2 id="accesibilidad" class="text-section text-canvas-fg mb-space-4">Accesibilidad</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Cada dot: <code class="font-mono text-action-700">role="graphics-symbol"</code> + aria-label con label y valor.</li>
            <li>Leyenda indica qué color representa A y B.</li>
            <li>Tabla de datos alternativa accesible con columnas A / B.</li>
            <li>Dots focusables con teclado.</li>
          </ul>
        </section>
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-4">Motion</h2>
          <p class="text-body-md text-neutral-600">
            Dots: radio 120ms ease-out (3→7px hover). Reduced motion: 0ms.
          </p>
        </section>
        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do & Don't</h2>
          <div class="grid grid-cols-2 gap-space-4">
            <div class="p-space-4 border border-system-success rounded-md">
              <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
              <p class="text-body-sm text-neutral-600">Etiquetar A y B claramente (Actual / Recomendado).</p>
            </div>
            <div class="p-space-4 border border-system-error rounded-md">
              <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
              <p class="text-body-sm text-neutral-600">Omitir leyenda — los dos puntos se vuelven ambiguos.</p>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class DumbbellChartPage {
  readonly loading = signal(false);
  readonly sampleData = SAMPLE_DATA;
  readonly tokenRows = DUMBBELL_TOKENS;

  readonly importCode = `import { ChartDumbbellComponent } from '@coherence/ui/chart';
import type { DumbbellDatum } from '@coherence/ui/chart';`;

  readonly realWorldCode = `<!-- AssetAllocationChart — Wealth Planner -->
<afi-chart-dumbbell
  [data]="assetAllocation"
  title="Asignación de activos"
  subtitle="Actual vs recomendado"
  locale="es-ES"
  (dataPointActivated)="onDotClick($event)"
/>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = ['  [data]="data"'];
    if (this.loading()) props.push('  [loading]="true"');
    return `<afi-chart-dumbbell\n${props.join('\n')}\n/>`;
  });

  readonly apiInputs = [
    { name: 'data', type: 'DumbbellDatum[]', default: '[]', notes: 'Array de { key, valueA, valueB, labelA?, labelB? }' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", notes: 'Dirección del gráfico' },
    { name: 'loading', type: 'boolean', default: 'false', notes: 'Muestra LoadingOverlay' },
    { name: 'title', type: 'string | null', default: 'null', notes: 'Título' },
    { name: 'subtitle', type: 'string | null', default: 'null', notes: 'Subtítulo' },
    { name: 'locale', type: 'string', default: "'es-ES'", notes: 'Locale para formateo' },
    { name: 'height', type: 'string', default: "'320px'", notes: 'Altura del SVG' },
    { name: 'focus', type: 'number | string | null', default: 'null', notes: 'Resalta una fila' },
  ];

  readonly apiOutputs = [
    { name: 'dataPointActivated', type: '{ index: number; datum: DumbbellDatum }', notes: 'Click en un dot' },
    { name: 'dataTableToggled', type: 'boolean', notes: 'Toggle de la tabla de datos' },
    { name: 'instructionsOpened', type: 'void', notes: 'Se abrió el panel de instrucciones' },
  ];
}
