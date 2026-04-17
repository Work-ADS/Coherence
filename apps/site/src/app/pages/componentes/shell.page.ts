import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import type { ShellType } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const SHELL_TYPES: ShellType[] = ['workspace', 'docs', 'auth', 'focus', 'canvas'];

const SHELL_TOKENS: TokenRow[] = [
  { property: 'Fondo (workspace)', token: 'var(--canvas-bg)' },
  { property: 'Fondo (auth)', token: 'var(--surface-quiet)' },
  { property: 'Fondo (docs)', token: 'var(--canvas-bg)' },
  { property: 'Sidebar ancho', token: '260px' },
  { property: 'Contenido max-width', token: '920px (docs)' },
  { property: 'Right rail ancho', token: '240px' },
];

@Component({
  selector: 'site-shell-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Shell"
      subtitle="Compositor de layout de nivel superior. Cada producto AFI usa &lt;afi-shell&gt; en su raíz con uno de cinco tipos cerrados."
      docsSource="libs/ui/src/shell/shell.component.ts"
      buildPromptSlug="coherence-site"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">

        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <!-- Shell type -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Tipo</legend>
              @for (t of shellTypes; track t) {
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
                  @if (t === 'focus' || t === 'canvas') {
                    <span class="text-body-sm text-neutral-400">(stub)</span>
                  }
                </label>
              }
            </fieldset>

            <!-- Right rail (workspace only) -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Right rail</legend>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input
                  type="checkbox"
                  [checked]="rightRail()"
                  (change)="rightRail.set(!rightRail())"
                  class="accent-action"
                />
                Mostrar (solo workspace)
              </label>
            </fieldset>
          </div>

          <!-- Live preview (miniature shell diagram) -->
          <div slot="preview" class="w-full">
            <div class="border border-border-hairline rounded-md overflow-hidden bg-surface-base text-body-sm" style="height: 200px;">
              @switch (type()) {
                @case ('workspace') {
                  <div class="grid h-full" [style.grid-template-columns]="rightRail() ? '60px 1fr 50px' : '60px 1fr'">
                    <div class="bg-surface-quiet border-r border-border-hairline flex items-center justify-center text-neutral-400 text-body-sm">
                      <span class="writing-mode-vertical" style="writing-mode: vertical-lr;">Sidebar</span>
                    </div>
                    <div class="flex items-center justify-center text-neutral-400">Main</div>
                    @if (rightRail()) {
                      <div class="bg-surface-quiet border-l border-border-hairline flex items-center justify-center text-neutral-400 text-body-sm">
                        <span style="writing-mode: vertical-lr;">Rail</span>
                      </div>
                    }
                  </div>
                }
                @case ('auth') {
                  <div class="h-full bg-surface-quiet flex flex-col items-center justify-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-neutral-200"></div>
                    <div class="w-32 h-20 bg-surface-elevated rounded shadow-sm flex items-center justify-center text-neutral-400">Card</div>
                  </div>
                }
                @case ('docs') {
                  <div class="grid h-full" style="grid-template-columns: 60px 1fr 44px;">
                    <div class="bg-surface-quiet border-r border-border-hairline flex items-center justify-center text-neutral-400 text-body-sm">
                      <span style="writing-mode: vertical-lr;">Sidebar</span>
                    </div>
                    <div class="flex items-center justify-center text-neutral-400">Contenido</div>
                    <div class="bg-surface-quiet border-l border-border-hairline flex items-center justify-center text-neutral-400 text-body-sm">
                      <span style="writing-mode: vertical-lr;">TOC</span>
                    </div>
                  </div>
                }
                @default {
                  <div class="h-full flex items-center justify-center text-neutral-400">
                    {{ type() }} — stub reservado v1
                  </div>
                }
              }
            </div>
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
            <li>Contenedor raíz de toda aplicación AFI — siempre presente.</li>
            <li><strong>workspace</strong>: aplicaciones de datos con sidebar, main y rail opcional.</li>
            <li><strong>docs</strong>: documentación con sidebar estática, columna de lectura y TOC.</li>
            <li><strong>auth</strong>: login/signup centrado con tarjeta y logo.</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo NO usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Fragmentos de página embebidos — Shell ES la página completa.</li>
            <li>Layouts custom que no corresponden a ninguno de los cinco tipos cerrados.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-3">Composiciones</h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            Shell workspace compone Sidebar, PageHeader, y opcionalmente un right rail.
            Shell docs compone Sidebar, contenido principal, y un TOC rail.
            Shell auth compone un slot de logo y un card centrado.
          </p>

          <h3 id="ejemplo-real" class="text-body-md font-medium text-canvas-fg mb-space-3">Ejemplo real</h3>
          <afi-code-block
            [code]="realWorldCode"
            language="html"
          />
        </section>

        <!-- Shell types gallery -->
        <section>
          <h2 id="tipos" class="text-section text-canvas-fg mb-space-4">Tipos de shell</h2>
          <div class="overflow-x-auto rounded-lg border border-border-hairline mb-space-8">
            <table class="w-full text-body-sm">
              <thead>
                <tr class="bg-neutral-50 border-b border-border-hairline">
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Tipo</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Grid</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Estado v1</th>
                </tr>
              </thead>
              <tbody>
                @for (row of typeRows; track row.type) {
                  <tr class="border-b border-border-hairline last:border-b-0">
                    <td class="px-space-4 py-space-3 font-mono text-action-700">{{ row.type }}</td>
                    <td class="px-space-4 py-space-3 text-neutral-600">{{ row.grid }}</td>
                    <td class="px-space-4 py-space-3 text-neutral-500">{{ row.status }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
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

          <h3 id="slots" class="text-body-md font-medium text-canvas-fg mb-space-3">Slots (content projection)</h3>
          <div class="overflow-x-auto rounded-lg border border-border-hairline mb-space-8">
            <table class="w-full text-body-sm">
              <thead>
                <tr class="bg-neutral-50 border-b border-border-hairline">
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Slot</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Aplica a</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Descripción</th>
                </tr>
              </thead>
              <tbody>
                @for (row of slotRows; track row.slot) {
                  <tr class="border-b border-border-hairline last:border-b-0">
                    <td class="px-space-4 py-space-3 font-mono text-action-700">{{ row.slot }}</td>
                    <td class="px-space-4 py-space-3 text-neutral-600">{{ row.appliesTo }}</td>
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
            <li>Cada shell incluye un enlace <code class="font-mono text-action-700">skip-to-content</code> como primer elemento focusable.</li>
            <li>La región principal usa <code class="font-mono text-action-700">id="main-content"</code> y <code class="font-mono text-action-700">&lt;main&gt;</code> landmark.</li>
            <li>El sidebar se proyecta como <code class="font-mono text-action-700">&lt;nav&gt;</code> (provisto por <code>afi-sidebar</code>).</li>
            <li>El right rail / TOC usa <code class="font-mono text-action-700">&lt;aside&gt;</code> con <code class="font-mono text-action-700">aria-label</code> descriptivo.</li>
          </ul>

          <h3 id="mapa-teclado" class="text-body-md font-medium text-canvas-fg mb-space-3">Mapa de teclado</h3>
          <div class="overflow-x-auto rounded-lg border border-border-hairline mb-space-8">
            <table class="w-full text-body-sm">
              <thead>
                <tr class="bg-neutral-50 border-b border-border-hairline">
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Tecla</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Acción</th>
                </tr>
              </thead>
              <tbody>
                @for (row of keyboardMap; track row.key) {
                  <tr class="border-b border-border-hairline last:border-b-0">
                    <td class="px-space-4 py-space-3 font-mono">{{ row.key }}</td>
                    <td class="px-space-4 py-space-3 text-neutral-500">{{ row.action }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>

        <!-- Motion -->
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-4">Motion</h2>
          <p class="text-body-md text-neutral-600">
            Shell es estático — sin transiciones propias. Los sub-componentes (Sidebar, Drawer) gestionan su propia animación.
            Reduced motion: sin cambios necesarios en Shell.
          </p>
        </section>

        <!-- Do & Don't -->
        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do & Don't</h2>
          <div class="space-y-space-4">
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">Un solo <code class="font-mono">&lt;afi-shell&gt;</code> por aplicación, como contenedor raíz.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">Anidar shells — cada app tiene exactamente un shell.</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">Seleccionar el tipo de shell via route data y dejar que Shell componga el layout.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">Construir grids manuales fuera de Shell — los cinco tipos están cerrados por diseño.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class ShellPage {
  readonly type = signal<ShellType>('workspace');
  readonly rightRail = signal(false);

  readonly shellTypes = SHELL_TYPES;
  readonly tokenRows = SHELL_TOKENS;

  readonly importCode = "import { ShellComponent } from '@coherence/ui/shell';";

  readonly realWorldCode = `<!-- app.component.ts — workspace shell -->
<afi-shell type="workspace" [rightRail]="true">
  <afi-sidebar slot="sidebar">…</afi-sidebar>
  <afi-page-header slot="page-header" title="Dashboard" />
  <router-outlet />
  <div slot="rail">…filtros…</div>
</afi-shell>

<!-- login.component.ts — auth shell -->
<afi-shell type="auth">
  <img slot="logo" src="logo.svg" alt="AFI" />
  <form>…campos de login…</form>
  <a slot="auth-footer" href="/help">¿Necesita ayuda?</a>
</afi-shell>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = [`  type="${this.type()}"`];
    if (this.type() === 'workspace' && this.rightRail()) {
      props.push('  [rightRail]="true"');
    }
    return `<afi-shell\n${props.join('\n')}\n>\n  <!-- contenido proyectado -->\n</afi-shell>`;
  });

  readonly typeRows = [
    { type: 'workspace', grid: '[sidebar] [main] [rail?]', status: 'Implementado' },
    { type: 'docs', grid: '[sidebar] [main] [toc]', status: 'Implementado' },
    { type: 'auth', grid: 'centrado max-w-400px', status: 'Implementado' },
    { type: 'focus', grid: 'Por definir', status: 'Stub reservado' },
    { type: 'canvas', grid: 'Por definir', status: 'Stub reservado' },
  ];

  readonly apiInputs = [
    { name: 'type', type: "ShellType", default: "'workspace'", notes: 'Tipo de layout: workspace | docs | auth | focus | canvas' },
    { name: 'sidebarMode', type: "'static' | 'collapsible' | 'hover-expand'", default: "'hover-expand'", notes: 'Modo del sidebar (pasado al sub-componente)' },
    { name: 'rightRail', type: 'boolean', default: 'false', notes: 'Muestra el panel lateral derecho (solo workspace)' },
  ];

  readonly slotRows = [
    { slot: '(default)', appliesTo: 'workspace, auth, docs', notes: 'Contenido principal' },
    { slot: '[slot=sidebar]', appliesTo: 'workspace, docs', notes: 'Sidebar de navegación' },
    { slot: '[slot=page-header]', appliesTo: 'workspace, docs', notes: 'Cabecera de página' },
    { slot: '[slot=rail]', appliesTo: 'workspace', notes: 'Panel lateral derecho' },
    { slot: '[slot=logo]', appliesTo: 'auth', notes: 'Logo de marca' },
    { slot: '[slot=auth-footer]', appliesTo: 'auth', notes: 'Footer con enlaces legales' },
    { slot: '[slot=toc]', appliesTo: 'docs', notes: 'Tabla de contenidos' },
  ];

  readonly keyboardMap = [
    { key: 'Tab', action: 'Skip-to-content es el primer foco, luego sidebar, luego main.' },
    { key: 'F6', action: 'Navegar entre landmarks (sidebar ↔ main ↔ rail) en lectoras de pantalla.' },
  ];
}
