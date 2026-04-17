import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { TabsComponent, TabComponent } from '@coherence/ui';
import type { TabsSize } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const SIZES: TabsSize[] = ['sm', 'md'];

const TABS_TOKENS: TokenRow[] = [
  { property: 'Borde inferior', token: 'var(--border-hairline)' },
  { property: 'Tab activo (borde)', token: 'var(--action-500)' },
  { property: 'Tab activo (texto)', token: 'var(--action-500)' },
  { property: 'Tab inactivo (texto)', token: 'var(--neutral-500)' },
  { property: 'Tab hover (fondo)', token: 'var(--surface-100)' },
  { property: 'Badge fondo', token: 'var(--action-500)' },
  { property: 'Foco', token: 'var(--border-focus)', note: 'ring inset' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
];

@Component({
  selector: 'site-tabs-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    TabsComponent,
    TabComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Tabs"
      subtitle="Navegación horizontal con patrón ARIA tablist/tab/tabpanel. Soporte de teclado completo sin dependencia de CDK."
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
                  <input type="radio" name="size" [value]="s" [checked]="size() === s" (change)="size.set(s)" class="accent-action" />
                  {{ s }}
                </label>
              }
            </fieldset>

            <!-- Options -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Opciones</legend>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="lazy()" (change)="lazy.set(!lazy())" class="accent-action" />
                lazy
              </label>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="disableSecond()" (change)="disableSecond.set(!disableSecond())" class="accent-action" />
                deshabilitar 2da pestaña
              </label>
            </fieldset>
          </div>

          <!-- Live preview -->
          <div slot="preview">
            <afi-tabs
              [activeIndex]="activeTab()"
              [size]="size()"
              [lazy]="lazy()"
              ariaLabel="Pestañas de ejemplo"
              (activeChange)="activeTab.set($event)"
            >
              <afi-tab label="General" />
              <afi-tab label="Configuración" [disabled]="disableSecond()" />
              <afi-tab label="Actividad" [badge]="3" />
            </afi-tabs>
            <div class="p-space-4 text-body-md text-neutral-600">
              Contenido de la pestaña {{ activeTab() + 1 }}.
            </div>
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
            <li>Organizar contenido relacionado en secciones horizontales.</li>
            <li>Vistas alternativas del mismo conjunto de datos (tabla vs. gráfico).</li>
            <li>Secciones de configuración (General, Avanzado, Permisos).</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo NO usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Navegación principal de la aplicación — use Sidebar.</li>
            <li>Pasos secuenciales (wizard) — use un stepper.</li>
            <li>Más de 6 pestañas — considere un menú o filtros.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-3">Composiciones</h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            Tabs dentro de Card para paneles con secciones. Tabs con badge para indicar
            contadores. Tabs con lazy loading para pestañas pesadas.
          </p>

          <h3 id="ejemplo-real" class="text-body-md font-medium text-canvas-fg mb-space-3">Ejemplo real</h3>
          <afi-code-block [code]="realWorldCode" language="html" />
        </section>

        <!-- API Reference -->
        <section>
          <h2 id="api-reference" class="text-section text-canvas-fg mb-space-4">API Reference</h2>

          <h3 id="entradas" class="text-body-md font-medium text-canvas-fg mb-space-3">Entradas (TabsComponent)</h3>
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
                @for (row of apiInputsTabs; track row.name) {
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

          <h3 id="entradas-tab" class="text-body-md font-medium text-canvas-fg mb-space-3">Entradas (TabComponent)</h3>
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
                @for (row of apiInputsTab; track row.name) {
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

        <section>
          <h2 id="tokens-consumidos" class="text-section text-canvas-fg mb-space-4">Tokens consumidos</h2>
          <afi-tokens-table [rows]="tokenRows" title="" />
        </section>

        <section>
          <h2 id="accesibilidad" class="text-section text-canvas-fg mb-space-4">Accesibilidad</h2>

          <h3 id="reglas" class="text-body-md font-medium text-canvas-fg mb-space-3">Reglas</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Contenedor con <code class="font-mono text-action-700">role="tablist"</code> y <code class="font-mono text-action-700">aria-label</code>.</li>
            <li>Cada botón con <code class="font-mono text-action-700">role="tab"</code>, <code class="font-mono text-action-700">aria-selected</code>, <code class="font-mono text-action-700">aria-controls</code>.</li>
            <li>Panel con <code class="font-mono text-action-700">role="tabpanel"</code> y <code class="font-mono text-action-700">aria-labelledby</code>.</li>
            <li>Roving tabindex: solo el tab activo tiene <code class="font-mono">tabindex="0"</code>.</li>
            <li>Tabs deshabilitados marcados con <code class="font-mono text-action-700">disabled</code> y opacidad reducida.</li>
          </ul>

          <h3 id="mapa-de-teclado" class="text-body-md font-medium text-canvas-fg mb-space-3">Mapa de teclado</h3>
          <div class="space-y-space-3 mb-space-8">
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Tab</kbd>
              <span class="text-body-md text-neutral-600">Enfoca el tab activo</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">← / →</kbd>
              <span class="text-body-md text-neutral-600">Navega entre pestañas (salta deshabilitadas)</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Home / End</kbd>
              <span class="text-body-md text-neutral-600">Primera / última pestaña habilitada</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Enter / Space</kbd>
              <span class="text-body-md text-neutral-600">Activa la pestaña enfocada</span>
            </div>
          </div>
        </section>

        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-4">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>Transición de color en tabs: <code class="font-mono">var(--duration-fast)</code> ease-out.</li>
            <li>Reduced motion: transiciones colapsan a instantáneo.</li>
          </ul>
        </section>

        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do & Don't</h2>
          <div class="space-y-space-4">
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">Use 2–5 tabs con etiquetas cortas y descriptivas.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">Más de 6 tabs o etiquetas largas que truncan.</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">Proporcione ariaLabel en el tablist.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">Tabs como navegación principal — use Sidebar.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class TabsPage {
  readonly size = signal<TabsSize>('md');
  readonly lazy = signal(false);
  readonly disableSecond = signal(false);
  readonly activeTab = signal(0);

  readonly sizes = SIZES;
  readonly tokenRows = TABS_TOKENS;

  readonly importCode = "import { TabsComponent, TabComponent } from '@coherence/ui/tabs';";

  readonly realWorldCode = `<afi-tabs
  [activeIndex]="tabActivo()"
  ariaLabel="Secciones del proyecto"
  (activeChange)="tabActivo.set($event)"
>
  <afi-tab label="General" />
  <afi-tab label="Configuración" />
  <afi-tab label="Actividad" [badge]="pendientes()" />
</afi-tabs>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = [];
    props.push('  [activeIndex]="tabActivo()"');
    if (this.size() !== 'md') props.push(`  size="${this.size()}"`);
    if (this.lazy()) props.push('  [lazy]="true"');
    props.push('  ariaLabel="Pestañas de ejemplo"');
    props.push('  (activeChange)="tabActivo.set($event)"');

    return `<afi-tabs\n${props.join('\n')}\n>\n  <afi-tab label="General" />\n  <afi-tab label="Configuración" />\n  <afi-tab label="Actividad" [badge]="3" />\n</afi-tabs>`;
  });

  readonly apiInputsTabs = [
    { name: 'activeIndex', type: 'number', default: '0', notes: 'Índice de la pestaña activa' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", notes: 'Tamaño de las pestañas' },
    { name: 'lazy', type: 'boolean', default: 'false', notes: 'Renderiza solo el panel activo' },
    { name: 'ariaLabel', type: 'string | null', default: 'null', notes: 'Etiqueta accesible del tablist' },
  ];

  readonly apiInputsTab = [
    { name: 'label', type: 'string', default: '(requerido)', notes: 'Texto de la pestaña' },
    { name: 'icon', type: 'string | null', default: 'null', notes: 'Icono (reservado)' },
    { name: 'badge', type: 'number | string | null', default: 'null', notes: 'Indicador numérico o textual' },
    { name: 'disabled', type: 'boolean', default: 'false', notes: 'Desactiva la pestaña' },
  ];

  readonly apiOutputs = [
    { name: 'activeChange', payload: 'number', notes: 'Índice de la pestaña activada' },
  ];
}
