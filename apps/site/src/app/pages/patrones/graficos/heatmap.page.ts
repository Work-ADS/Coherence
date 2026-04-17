import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { ChartHeatmapComponent } from '@coherence/ui';
import type { HeatmapCell, HeatmapScale } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../../components/component-playground';
import { CodeBlockComponent } from '../../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../../components/tokens-table';

const HEATMAP_TOKENS: TokenRow[] = [
  { property: 'Escala secuencial', token: 'var(--data-neutral-muted) → var(--data-highlight-primary)' },
  { property: 'Escala divergente +', token: 'var(--data-diverge-pos-300/500/700)' },
  { property: 'Escala divergente −', token: 'var(--data-diverge-neg-300/500/700)' },
  { property: 'Borde celda', token: 'var(--surface-base) (stroke 1px)' },
  { property: 'Focus ring', token: 'var(--border-focus)' },
];

const SCALES: HeatmapScale[] = ['sequential', 'divergent'];

const SEQUENTIAL_DATA: HeatmapCell[] = (() => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
  const products = ['Renta fija', 'Renta variable', 'Inmobiliario', 'Alternatives'];
  const cells: HeatmapCell[] = [];
  for (const y of products) {
    for (const x of months) {
      cells.push({ x, y, value: Math.round(Math.random() * 100) });
    }
  }
  return cells;
})();

const DIVERGENT_DATA: HeatmapCell[] = (() => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
  const products = ['Renta fija', 'Renta variable', 'Inmobiliario', 'Alternatives'];
  const cells: HeatmapCell[] = [];
  for (const y of products) {
    for (const x of months) {
      cells.push({ x, y, value: Math.round((Math.random() - 0.5) * 200) / 10 });
    }
  }
  return cells;
})();

@Component({
  selector: 'site-heatmap-chart-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    ChartHeatmapComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="PATTERNS / CHARTS"
      title="Heatmap"
      subtitle="Grilla bidimensional con celdas coloreadas. Escala secuencial o divergente."
      docsSource="libs/ui/src/chart/chart-heatmap.component.ts"
      buildPromptSlug="coherence-site"
    >
      <div slot="code-tab">
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Escala</legend>
              @for (s of scales; track s) {
                <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                  <input type="radio" name="scale" [value]="s"
                    [checked]="scale() === s" (change)="scale.set(s)" class="accent-action" />
                  {{ s }}
                </label>
              }
            </fieldset>
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Opciones</legend>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="showCellLabels()" (change)="showCellLabels.set(!showCellLabels())" class="accent-action" />
                Etiquetas en celda
              </label>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="loading()" (change)="loading.set(!loading())" class="accent-action" />
                Loading
              </label>
            </fieldset>
          </div>
          <div slot="preview" class="w-full">
            <afi-chart-heatmap
              [data]="currentData()"
              [scale]="scale()"
              [showCellLabels]="showCellLabels()"
              [loading]="loading()"
              title="Rendimiento por activo"
              subtitle="Primer semestre 2026"
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
            <li>Correlación o densidad bidimensional (activos × tiempo, regiones × métricas).</li>
            <li>Divergente: comparar ganancias vs pérdidas (verde/rojo).</li>
            <li>Secuencial: mostrar intensidad (volumen, concentración).</li>
          </ul>
          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo NO usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Valores exactos importan más que la tendencia — use Table.</li>
            <li>Pocas categorías — un Bar es más legible.</li>
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
            <li>Cada celda: <code class="font-mono text-action-700">role="graphics-symbol"</code> + aria-label con fila, columna y valor.</li>
            <li>Focusable con teclado.</li>
            <li>La escala de color NO es el único encoding — etiquetas en celda como refuerzo.</li>
          </ul>
        </section>
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-4">Motion</h2>
          <p class="text-body-md text-neutral-600">
            Hover: opacity 0.8, 180ms. Reduced motion: 0ms.
          </p>
        </section>
        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do & Don't</h2>
          <div class="grid grid-cols-2 gap-space-4">
            <div class="p-space-4 border border-system-success rounded-md">
              <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
              <p class="text-body-sm text-neutral-600">Usar divergente para datos con punto medio significativo (ej: rentabilidad).</p>
            </div>
            <div class="p-space-4 border border-system-error rounded-md">
              <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
              <p class="text-body-sm text-neutral-600">Más de 2 colores sin leyenda — confunde al lector.</p>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class HeatmapChartPage {
  readonly scale = signal<HeatmapScale>('sequential');
  readonly showCellLabels = signal(false);
  readonly loading = signal(false);
  readonly scales = SCALES;
  readonly tokenRows = HEATMAP_TOKENS;

  readonly currentData = computed(() =>
    this.scale() === 'divergent' ? DIVERGENT_DATA : SEQUENTIAL_DATA,
  );

  readonly importCode = `import { ChartHeatmapComponent } from '@coherence/ui/chart';
import type { HeatmapCell, HeatmapScale } from '@coherence/ui/chart';`;

  readonly realWorldCode = `<!-- Correlación de activos — Wealth Manager -->
<afi-chart-heatmap
  [data]="correlationCells"
  scale="divergent"
  [showCellLabels]="true"
  title="Matriz de correlación"
  locale="es-ES"
/>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = ['  [data]="cells"'];
    if (this.scale() !== 'sequential') props.push(`  scale="${this.scale()}"`);
    if (this.showCellLabels()) props.push('  [showCellLabels]="true"');
    if (this.loading()) props.push('  [loading]="true"');
    return `<afi-chart-heatmap\n${props.join('\n')}\n/>`;
  });

  readonly apiInputs = [
    { name: 'data', type: 'HeatmapCell[]', default: '[]', notes: 'Array de { x, y, value }' },
    { name: 'scale', type: "'sequential' | 'divergent'", default: "'sequential'", notes: 'Escala de color' },
    { name: 'showCellLabels', type: 'boolean', default: 'false', notes: 'Muestra valor numérico en cada celda' },
    { name: 'loading', type: 'boolean', default: 'false', notes: 'Muestra LoadingOverlay' },
    { name: 'title', type: 'string | null', default: 'null', notes: 'Título del gráfico' },
    { name: 'subtitle', type: 'string | null', default: 'null', notes: 'Subtítulo' },
    { name: 'locale', type: 'string', default: "'es-ES'", notes: 'Locale para formateo' },
    { name: 'height', type: 'string', default: "'320px'", notes: 'Altura del SVG' },
  ];
}
