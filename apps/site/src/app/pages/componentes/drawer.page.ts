import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  DrawerComponent,
  CheckboxComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
} from '@coherence/ui';
import type { DrawerSize } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const SIZES: DrawerSize[] = ['sm', 'md', 'lg'];

const DRAWER_TOKENS: TokenRow[] = [
  { property: 'Fondo', token: 'var(--surface-base)' },
  { property: 'Borde izquierdo', token: 'var(--border-hairline)' },
  { property: 'Sombra', token: 'shadow-elevation-high' },
  { property: 'Título', token: 'var(--canvas-fg)' },
  { property: 'Navegación (texto)', token: 'var(--neutral-500)' },
  { property: 'Hover (botones)', token: 'var(--surface-100)' },
  { property: 'Tamaño (sm/md/lg)', token: '400px / 480px / 640px' },
  { property: 'Animación slide-in', token: 'translateX (CSS animation)' },
];

@Component({
  selector: 'site-drawer-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    DrawerComponent,
    CheckboxComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Drawer"
      subtitle="Panel lateral no-modal que se desliza desde la derecha. No bloquea la página — ideal para detalle de fila y edición rápida."
      docsSource="docs/build-prompts/coherence-primitive-page.md"
      buildPromptSlug="coherence-primitive-page"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
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

            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Opciones</legend>
              <afi-checkbox
                [checked]="showPosition()"
                (checkedChange)="showPosition.set($event)"
                label="position (navegación)"
                size="sm"
                [compact]="true"
              />
              <afi-checkbox
                [checked]="closeOnOutside()"
                (checkedChange)="closeOnOutside.set($event)"
                label="closeOnOutsideClick"
                size="sm"
                [compact]="true"
              />
            </fieldset>

            <button
              type="button"
              class="w-full px-space-4 py-space-2 bg-action text-white rounded-md text-body-sm font-medium hover:bg-action-600 transition-colors"
              (click)="openDrawer.set(true)"
            >
              Abrir drawer
            </button>
          </div>

          <div slot="preview">
            <p class="text-body-md text-neutral-600">
              Use el botón "Abrir drawer" en los controles para ver el componente.
            </p>
            <afi-drawer
              [open]="openDrawer()"
              [size]="size()"
              title="Detalle del registro"
              [position]="showPosition() ? drawerPosition() : null"
              [closeOnOutsideClick]="closeOnOutside()"
              (openChange)="openDrawer.set($event)"
              (navigated)="onNavigate($event)"
            >
              <p class="text-body-md text-neutral-600">
                Contenido del drawer. La página detrás sigue siendo interactiva.
              </p>
            </afi-drawer>
          </div>
        </afi-component-playground>

        <section>
          <h2 id="importar" class="text-section text-canvas-fg mb-space-6">Importar</h2>
          <afi-code-block [code]="importCode" language="ts" />
        </section>

        <section>
          <h2 id="uso" class="text-section text-canvas-fg mb-space-6">Uso</h2>

          <h3 id="cuando-usar" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Cuándo usar
          </h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Detalle de fila en Table — patrón click-to-detail.</li>
            <li>Edición rápida sin perder contexto de la lista.</li>
            <li>Paneles de configuración secundarios.</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Cuándo NO usar
          </h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Acciones que requieren atención exclusiva — use Modal.</li>
            <li>Navegación principal — use Sidebar.</li>
            <li>Contenido que no se relaciona con la vista actual.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Composiciones
          </h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            Table + Drawer para detalle de fila con navegación ← →. Drawer con formulario y footer
            con botones de acción. Drawer con LoadingOverlay para carga asíncrona.
          </p>

          <h3 id="ejemplo-real" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Ejemplo real
          </h3>
          <afi-code-block [code]="realWorldCode" language="html" />
        </section>

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
              <code class="font-mono text-action-700">role="region"</code> con
              <code class="font-mono text-action-700">aria-label</code> o
              <code class="font-mono text-action-700">aria-labelledby</code>.
            </li>
            <li>NO es modal — no hay focus trap. La página sigue interactiva.</li>
            <li>Foco inicial en el primer elemento interactivo al abrir.</li>
            <li>Esc cierra el drawer (configurable).</li>
            <li>
              Navegación ← → con
              <code class="font-mono text-action-700">aria-live="polite"</code> para anunciar
              posición.
            </li>
            <li>
              Botón cerrar con <code class="font-mono text-action-700">aria-label="Cerrar"</code>.
            </li>
          </ul>

          <h3 id="mapa-de-teclado" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Mapa de teclado
          </h3>
          <div class="space-y-space-3 mb-space-8">
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >Esc</kbd
              >
              <span class="text-body-md text-neutral-600">Cierra el drawer</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >← / →</kbd
              >
              <span class="text-body-md text-neutral-600"
                >Navega entre filas (cuando position está presente)</span
              >
            </div>
          </div>
        </section>

        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-6">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>
              Slide-in: <code class="font-mono">translateX(100% → 0)</code> via CSS animation.
            </li>
            <li>Reduced motion: animación deshabilitada, aparición instantánea.</li>
          </ul>
        </section>

        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-6">Do & Don't</h2>
          <div class="space-y-space-4">
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">
                  Drawer para detalle de fila con navegación entre registros.
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Drawer para confirmación destructiva — use Modal.
                </p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">Un solo Drawer abierto a la vez.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Múltiples drawers apilados — confunde al usuario.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class DrawerPage {
  readonly size = signal<DrawerSize>('md');
  readonly openDrawer = signal(false);
  readonly showPosition = signal(true);
  readonly closeOnOutside = signal(true);
  readonly drawerPosition = signal({ current: 3, total: 12 });

  readonly sizes = SIZES;
  readonly tokenRows = DRAWER_TOKENS;

  readonly importCode = "import { DrawerComponent } from '@coherence/ui/drawer';";

  readonly realWorldCode = `<afi-drawer
  [open]="drawerAbierto()"
  title="Detalle de {{ registro().nombre }}"
  [position]="{ current: indice(), total: totalFilas() }"
  (openChange)="drawerAbierto.set($event)"
  (navigated)="onNavegar($event)"
>
  <p>{{ registro().descripcion }}</p>
  <div slot="footer">
    <button (click)="editar()">Editar</button>
  </div>
</afi-drawer>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = [];
    props.push('  [open]="abierto()"');
    if (this.size() !== 'md') props.push(`  size="${this.size()}"`);
    props.push('  title="Detalle del registro"');
    if (this.showPosition()) props.push('  [position]="{ current: 3, total: 12 }"');
    if (!this.closeOnOutside()) props.push('  [closeOnOutsideClick]="false"');
    props.push('  (openChange)="abierto.set($event)"');

    return `<afi-drawer\n${props.join('\n')}\n>\n  <!-- contenido -->\n</afi-drawer>`;
  });

  readonly apiInputs = [
    { name: 'open', type: 'boolean', default: 'false', notes: 'Abre/cierra el drawer' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", notes: 'Ancho del panel' },
    { name: 'title', type: 'string | null', default: 'null', notes: 'Título del header' },
    {
      name: 'position',
      type: '{ current; total } | null',
      default: 'null',
      notes: 'Navegación entre filas',
    },
    { name: 'closeOnEsc', type: 'boolean', default: 'true', notes: 'Cierra con Esc' },
    {
      name: 'closeOnOutsideClick',
      type: 'boolean',
      default: 'true',
      notes: 'Cierra al clic fuera',
    },
    {
      name: 'ariaLabel',
      type: 'string | null',
      default: 'null',
      notes: 'Solo cuando title está ausente',
    },
  ];

  readonly apiOutputs = [
    { name: 'openChange', payload: 'boolean', notes: 'Emitido al abrir/cerrar' },
    { name: 'closed', payload: "'esc' | 'outside' | 'button'", notes: 'Razón de cierre' },
    { name: 'navigated', payload: "'prev' | 'next'", notes: 'Dirección de navegación' },
  ];

  onNavigate(dir: 'prev' | 'next'): void {
    const pos = this.drawerPosition();
    if (dir === 'prev' && pos.current > 1) {
      this.drawerPosition.set({ ...pos, current: pos.current - 1 });
    } else if (dir === 'next' && pos.current < pos.total) {
      this.drawerPosition.set({ ...pos, current: pos.current + 1 });
    }
  }
}
