import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  NavSectionComponent,
  NavItemComponent,
  SidebarComponent,
  CheckboxComponent,
} from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const NAV_SECTION_TOKENS: TokenRow[] = [
  { property: 'Fondo hover (fila padre)', token: 'var(--surface-muted)' },
  { property: 'Texto padre (activo)', token: 'var(--canvas-fg), font-medium' },
  { property: 'Chevron', token: 'var(--neutral-400)' },
  { property: 'Línea guía', token: 'var(--border-hairline)' },
  { property: 'Trail hover', token: 'var(--action-300)' },
  { property: 'Marker', token: 'var(--action-500)', note: '2×16px rounded' },
  { property: 'Sangría hijos', token: 'var(--space-8)' },
  { property: 'Rotación chevron', token: 'var(--duration-fast) var(--easing-enter)' },
  { property: 'Expand/collapse', token: 'grid-template-rows 0fr→1fr, var(--duration-200)' },
];

@Component({
  selector: 'site-nav-section-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    NavSectionComponent,
    NavItemComponent,
    SidebarComponent,
    CheckboxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="NavSection"
      subtitle="Sección expandible de navegación con líneas de árbol, trail de hover y marcador deslizante. Se usa dentro de Sidebar para agrupar NavItems jerárquicamente."
      docsSource="docs/build-prompts/coherence-primitive-page.md"
      buildPromptSlug="coherence-primitive-page"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">
        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Opciones</legend>
              <afi-checkbox
                [checked]="showTreeLines()"
                (checkedChange)="showTreeLines.set($event)"
                label="showTreeLines"
                size="sm"
                [compact]="true"
              />
              <afi-checkbox
                [checked]="defaultExpanded()"
                (checkedChange)="defaultExpanded.set($event)"
                label="defaultExpanded"
                size="sm"
                [compact]="true"
              />
              <afi-checkbox
                [checked]="disabled()"
                (checkedChange)="disabled.set($event)"
                label="disabled"
                size="sm"
                [compact]="true"
              />
            </fieldset>
          </div>

          <!-- Live preview -->
          <div
            slot="preview"
            class="h-[320px] flex border border-border-hairline rounded-lg overflow-hidden"
          >
            <afi-sidebar mode="static" ariaLabel="Navegación de ejemplo">
              <span slot="top" class="text-body-md font-medium text-canvas-fg truncate"
                >Coherence</span
              >

              <afi-nav-section
                label="Fundamentos"
                [showTreeLines]="showTreeLines()"
                [defaultExpanded]="defaultExpanded()"
                [disabled]="disabled()"
              >
                <afi-nav-item label="Principios" />
                <afi-nav-item label="Color" [active]="true" />
                <afi-nav-item label="Tipografía" />
                <afi-nav-item label="Espacio" />
              </afi-nav-section>

              <afi-nav-section label="Componentes" [showTreeLines]="showTreeLines()">
                <afi-nav-item label="Button" />
                <afi-nav-item label="Input" />
                <afi-nav-item label="Select" />
              </afi-nav-section>

              <span slot="bottom" class="text-body-sm text-neutral-500 truncate">v1.0.0</span>
            </afi-sidebar>
            <div class="flex-1 bg-surface-base p-space-6 text-body-sm text-neutral-500">
              Contenido principal
            </div>
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
            <li>Grupos jerárquicos en sidebar: workspaces, colecciones, carpetas, equipos.</li>
            <li>Navegación donde el padre agrupa hijos que son destinos individuales.</li>
            <li>Hasta 2 niveles de anidación (NavSection puede contener NavSection).</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Cuándo NO usar
          </h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Listas planas sin jerarquía — use NavItem directamente.</li>
            <li>Contenido de acordeón (FAQ, disclosure) — use un primitivo de acordeón.</li>
            <li>Switching de secciones tipo tab — use Tabs.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Composiciones
          </h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            NavSection dentro de Sidebar con trailing action (+) para crear subcarpetas. NavSection
            anidadas para jerarquías de 2 niveles. NavSection con auto-expand cuando la ruta activa
            coincide con un hijo.
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
              Fila padre usa <code class="font-mono text-action-700">aria-expanded</code> y
              <code class="font-mono text-action-700">aria-controls</code> apuntando al contenedor
              de hijos.
            </li>
            <li>
              Contenedor de hijos usa
              <code class="font-mono text-action-700">role="group"</code> con
              <code class="font-mono text-action-700">aria-label</code> del label de la sección.
            </li>
            <li>
              <code class="font-mono text-action-700">aria-current="page"</code> solo en el NavItem
              hoja activo — nunca en la fila padre.
            </li>
            <li>
              Líneas de árbol, trail y marker son
              <code class="font-mono text-action-700">aria-hidden="true"</code> — puramente
              visuales.
            </li>
            <li>
              Trailing action debe incluir contexto de sección en su ariaLabel (ej: "Crear carpeta
              en Richard HQ").
            </li>
          </ul>

          <h3 id="mapa-de-teclado" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Mapa de teclado
          </h3>
          <div class="space-y-space-3 mb-space-8">
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >Enter / Space</kbd
              >
              <span class="text-body-md text-neutral-600">Expande/colapsa la sección</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >→</kbd
              >
              <span class="text-body-md text-neutral-600"
                >Expande (si colapsado); mueve foco al primer hijo</span
              >
            </div>
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >←</kbd
              >
              <span class="text-body-md text-neutral-600"
                >Colapsa (si expandido); mueve foco al padre</span
              >
            </div>
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >↑ ↓</kbd
              >
              <span class="text-body-md text-neutral-600">Navega entre padre e hijos</span>
            </div>
          </div>
        </section>

        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-6">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>
              Expand/collapse: <code class="font-mono">grid-template-rows 0fr→1fr</code>,
              <code class="font-mono">duration-200 ease-out</code>.
            </li>
            <li>
              Chevron: rotación <code class="font-mono">0→90deg</code>,
              <code class="font-mono">duration-fast</code>.
            </li>
            <li>
              Trail de hover: <code class="font-mono">background 120ms ease-out</code> en la línea
              guía.
            </li>
            <li>
              Marker: <code class="font-mono">top 200ms ease-out, opacity 120ms ease-out</code>.
            </li>
            <li>
              Reduced motion: todo colapsa a instantáneo vía
              <code class="font-mono">prefers-reduced-motion</code>.
            </li>
          </ul>
        </section>

        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-6">Do & Don't</h2>
          <div class="space-y-space-4">
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">
                  Máximo 2 niveles de anidación. Más niveles dificultan la navegación.
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Tres o más niveles de NavSection anidados — refactore la IA de navegación.
                </p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">
                  Sección auto-expande cuando la ruta activa coincide con un hijo.
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Todas las secciones abiertas por defecto — el usuario pierde contexto visual.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class NavSectionPage {
  readonly showTreeLines = signal(true);
  readonly defaultExpanded = signal(true);
  readonly disabled = signal(false);

  readonly tokenRows = NAV_SECTION_TOKENS;

  readonly importCode = `import { NavSectionComponent, NavItemComponent } from '@coherence/ui';`;

  readonly realWorldCode = `<afi-sidebar mode="static">
  <afi-nav-section label="Richard HQ" [defaultExpanded]="true">
    <button slot="trailingAction" aria-label="Crear carpeta en Richard HQ">+</button>

    <afi-nav-item label="Design system" [active]="true">
      <svg slot="icon" ...><!-- folder --></svg>
    </afi-nav-item>
    <afi-nav-item label="KT360">
      <svg slot="icon" ...><!-- folder --></svg>
    </afi-nav-item>
  </afi-nav-section>
</afi-sidebar>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = [`  label="Fundamentos"`];
    if (!this.showTreeLines()) props.push('  [showTreeLines]="false"');
    if (this.defaultExpanded()) props.push('  [defaultExpanded]="true"');
    if (this.disabled()) props.push('  [disabled]="true"');

    return `<afi-nav-section\n${props.join('\n')}\n>\n  <afi-nav-item label="Principios" />\n  <afi-nav-item label="Color" [active]="true" />\n  <afi-nav-item label="Tipografía" />\n</afi-nav-section>`;
  });

  readonly apiInputs = [
    { name: 'label', type: 'string', default: '(required)', notes: 'Texto de la fila padre' },
    {
      name: 'expanded',
      type: 'boolean | null',
      default: 'null',
      notes: 'Override manual. null = auto mode',
    },
    {
      name: 'defaultExpanded',
      type: 'boolean',
      default: 'false',
      notes: 'Estado inicial cuando expanded es null',
    },
    { name: 'disabled', type: 'boolean', default: 'false', notes: 'Desactiva la fila padre' },
    {
      name: 'ariaLabel',
      type: 'string | null',
      default: 'null',
      notes: 'Override de "Sección: {label}"',
    },
    {
      name: 'showTreeLines',
      type: 'boolean',
      default: 'true',
      notes: 'Muestra/oculta líneas de árbol',
    },
  ];

  readonly apiOutputs = [
    { name: 'expandedChange', payload: 'boolean', notes: 'Emitido al expandir/colapsar' },
    {
      name: 'parentClicked',
      payload: '{ event: MouseEvent }',
      notes: 'Emitido al hacer clic en la fila padre',
    },
  ];
}
