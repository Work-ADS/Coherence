import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { ChartBarComponent } from '@coherence/ui';
import type { BarDatum, BarOrientation, BarSort } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../../components/component-playground';
import { CodeBlockComponent } from '../../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../../components/tokens-table';

const BAR_TOKENS: TokenRow[] = [
  { property: 'Paleta series', token: 'var(--data-neutral-strong), var(--data-highlight-primary)' },
  { property: 'Ejes / grid', token: 'var(--border-hairline)' },
  { property: 'Texto ejes', token: 'text-neutral-500 (body-sm)' },
  { property: 'Título', token: 'text-section text-canvas-fg' },
  { property: 'Focus ring', token: 'var(--border-focus)' },
  { property: 'Transición hover', token: '180ms ease-out (opacity)' },
];

const SAMPLE_DATA: BarDatum[] = [
  { key: 'Ene', value: 42000 },
  { key: 'Feb', value: 58000 },
  { key: 'Mar', value: 35000 },
  { key: 'Abr', value: 71000 },
  { key: 'May', value: 63000 },
  { key: 'Jun', value: 89000 },
];

const ORIENTATIONS: BarOrientation[] = ['vertical', 'horizontal'];
const SORTS: (BarSort | 'none')[] = ['none', 'asc', 'desc'];

@Component({
  selector: 'site-bar-chart-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    ChartBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="PATTERNS / CHARTS"
      title="Bar"
      subtitle="Barras verticales u horizontales. El eje Y siempre arranca en cero (no negociable). Color + textura aplicados juntos."
      docsSource="libs/ui/src/chart/chart-bar.component.ts"
      buildPromptSlug="coherence-site"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">

        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Orientación</legend>
              @for (o of orientations; track o) {
                <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                  <input type="radio" name="orientation" [value]="o"
                    [checked]="orientation() === o" (change)="orientation.set(o)" class="accent-action" />
                  {{ o }}
                </label>
              }
            </fieldset>
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Orden</legend>
              @for (s of sorts; track s) {
                <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                  <input type="radio" name="sort" [value]="s"
                    [checked]="sortVal() === s" (change)="sortVal.set(s)" class="accent-action" />
                  {{ s }}
                </label>
              }
            </fieldset>
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Loading</legend>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="loading()" (change)="loading.set(!loading())" class="accent-action" />
                Mostrar loading
              </label>
            </fieldset>
          </div>

          <div slot="preview" class="w-full">
            <afi-chart-bar
              [data]="sampleData"
              [orientation]="orientation()"
              [sort]="sortComputed()"
              [loading]="loading()"
              title="Ventas mensuales"
              subtitle="Primer semestre 2026"
              locale="es-ES"
            />
          </div>
        </afi-component-playground>

        <!-- Importar -->
        <section>
          <h2 id="importar" class="text-section text-canvas-fg mb-space-4">Importar</h2>
          <afi-code-block [code]="importCode" language="ts" />
        </section>

        <!-- Uso -->
        <section>
          <h2 id="uso" class="text-section text-canvas-fg mb-space-4">Uso</h2>
          <h3 id="cuando-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Comparar cantidades discretas por categoría.</li>
            <li>Evolución temporal cuando las categorías son pocas (≤12).</li>
            <li>Rankings — use <code class="font-mono">sort="desc"</code>.</li>
          </ul>
          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo NO usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Series temporales continuas con muchos puntos — use Line.</li>
            <li>Comparación de dos valores por categoría — use Dumbbell.</li>
            <li>Correlación bidimensional — use Heatmap.</li>
          </ul>
          <h3 id="ejemplo-real" class="text-body-md font-medium text-canvas-fg mb-space-3">Ejemplo real</h3>
          <afi-code-block [code]="realWorldCode" language="html" />
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
            <li>Cada barra es <code class="font-mono text-action-700">role="graphics-symbol"</code> con <code class="font-mono text-action-700">aria-label</code> descriptivo.</li>
            <li>El SVG usa <code class="font-mono text-action-700">role="img"</code> + <code class="font-mono text-action-700">aria-labelledby</code> vinculado al título.</li>
            <li>Región sr-only con longDescription, statisticalNotes, contextExplanation.</li>
            <li>Doble codificación: color + textura (dots / lines / crosshatch).</li>
            <li>Tabla de datos alternativa accesible vía <code class="font-mono text-action-700">&lt;afi-chart-data-table&gt;</code>.</li>
            <li>Barras focusables con teclado (tabindex + Enter).</li>
          </ul>
        </section>
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-4">Motion</h2>
          <p class="text-body-md text-neutral-600">
            Hover: opacity 0.8, 180ms ease-out. Reduced motion: transición a 0ms.
          </p>
        </section>
        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do & Don't</h2>
          <div class="grid grid-cols-2 gap-space-4">
            <div class="p-space-4 border border-system-success rounded-md">
              <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
              <p class="text-body-sm text-neutral-600">Y siempre desde cero para no distorsionar la comparación visual.</p>
            </div>
            <div class="p-space-4 border border-system-error rounded-md">
              <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
              <p class="text-body-sm text-neutral-600">Truncar el eje Y para exagerar diferencias.</p>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class BarChartPage {
  readonly orientation = signal<BarOrientation>('vertical');
  readonly sortVal = signal<BarSort | 'none'>('none');
  readonly loading = signal(false);
  readonly sampleData = SAMPLE_DATA;
  readonly orientations = ORIENTATIONS;
  readonly sorts = SORTS;
  readonly tokenRows = BAR_TOKENS;

  readonly sortComputed = computed<BarSort>(() => {
    const v = this.sortVal();
    return v === 'none' ? null : v;
  });

  readonly importCode = `import { ChartBarComponent } from '@coherence/ui/chart';
import type { BarDatum } from '@coherence/ui/chart';`;

  readonly realWorldCode = `<!-- CashflowChart — Wealth Planner -->
<afi-chart-bar
  [data]="cashflowData"
  title="Flujo de caja anual"
  subtitle="Ingresos vs gastos proyectados"
  orientation="vertical"
  locale="es-ES"
  (dataPointActivated)="onBarClick($event)"
/>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = ['  [data]="data"'];
    if (this.orientation() !== 'vertical') props.push(`  orientation="${this.orientation()}"`);
    const s = this.sortVal();
    if (s !== 'none') props.push(`  sort="${s}"`);
    if (this.loading()) props.push('  [loading]="true"');
    return `<afi-chart-bar\n${props.join('\n')}\n/>`;
  });

  readonly apiInputs = [
    { name: 'data', type: 'BarDatum[]', default: '[]', notes: 'Array de { key, value, label? }' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", notes: 'Dirección de las barras' },
    { name: 'sort', type: "'asc' | 'desc' | null", default: 'null', notes: 'Ordenar barras por valor' },
    { name: 'loading', type: 'boolean', default: 'false', notes: 'Muestra LoadingOverlay' },
    { name: 'title', type: 'string | null', default: 'null', notes: 'Título del gráfico' },
    { name: 'subtitle', type: 'string | null', default: 'null', notes: 'Subtítulo' },
    { name: 'locale', type: 'string', default: "'es-ES'", notes: 'Locale para formateo de números' },
    { name: 'height', type: 'string', default: "'320px'", notes: 'Altura del SVG' },
    { name: 'focus', type: 'number | string | null', default: 'null', notes: 'Resalta una barra (índice o key)' },
    { name: 'longDescription', type: 'string', default: "''", notes: 'Descripción sr-only para lectoras' },
  ];

  readonly apiOutputs = [
    { name: 'dataPointActivated', type: '{ index: number; datum: BarDatum }', notes: 'Click o Enter en una barra' },
    { name: 'dataTableToggled', type: 'boolean', notes: 'Toggle de la tabla de datos alternativa' },
    { name: 'instructionsOpened', type: 'void', notes: 'Se abrió el panel de instrucciones de accesibilidad' },
  ];
}
