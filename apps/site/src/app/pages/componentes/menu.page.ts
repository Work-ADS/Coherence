import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  MenuComponent,
  MenuItemComponent,
  MenuDividerComponent,
  CheckboxComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
} from '@coherence/ui';
import type { MenuPlacement, MenuItemVariant } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const PLACEMENTS: MenuPlacement[] = ['bottom-start', 'bottom-end', 'top-start', 'top-end'];

const MENU_TOKENS: TokenRow[] = [
  { property: 'Fondo panel', token: 'var(--surface-elevated)' },
  { property: 'Borde panel', token: 'var(--border-hairline)' },
  { property: 'Sombra panel', token: 'var(--shadow-lg)' },
  { property: 'Fondo item hover', token: 'var(--surface-muted)' },
  { property: 'Texto item', token: 'var(--canvas-fg)' },
  { property: 'Texto danger', token: 'var(--system-error-600)' },
  { property: 'Fondo danger hover', token: 'var(--system-error-50)' },
  { property: 'Ícono item', token: 'var(--neutral-500)' },
  { property: 'Shortcut', token: 'var(--neutral-400), font-mono' },
  { property: 'Divider', token: 'var(--border-hairline)' },
  { property: 'Radio panel', token: 'var(--radius-lg)' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px offset' },
  { property: 'Animación entrada', token: 'var(--duration-fast) var(--easing-enter)' },
  { property: 'Hover lean-in ícono', token: 'translateX(2px) 120ms var(--easing-enter)' },
];

@Component({
  selector: 'site-menu-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    MenuComponent,
    MenuItemComponent,
    MenuDividerComponent,
    CheckboxComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Menu"
      subtitle="Menú contextual de acciones anclado a un trigger. Incluye MenuItem con ícono, shortcut y variante danger, más MenuDivider."
      docsSource="docs/build-prompts/coherence-primitive-page.md"
      buildPromptSlug="coherence-primitive-page"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">
        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <afi-radio-group legend="Placement">
              @for (p of placements; track p) {
                <afi-radio-group-item
                  [value]="p"
                  [label]="p"
                  [selected]="placement() === p"
                  (selectedChange)="$any(placement).set($event)"
                  size="sm"
                  [compact]="true"
                />
              }
            </afi-radio-group>

            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Opciones</legend>
              <afi-checkbox
                [checked]="showShortcuts()"
                (checkedChange)="showShortcuts.set($event)"
                label="Mostrar shortcuts"
                size="sm"
                [compact]="true"
              />
              <afi-checkbox
                [checked]="showDanger()"
                (checkedChange)="showDanger.set($event)"
                label="Incluir item danger"
                size="sm"
                [compact]="true"
              />
              <afi-checkbox
                [checked]="showDisabled()"
                (checkedChange)="showDisabled.set($event)"
                label="Item deshabilitado"
                size="sm"
                [compact]="true"
              />
            </fieldset>
          </div>

          <!-- Live preview -->
          <div slot="preview" class="flex items-center justify-center py-space-12">
            <afi-menu
              [open]="menuOpen()"
              [placement]="placement()"
              (openChange)="menuOpen.set($event)"
            >
              <button
                type="button"
                class="px-space-3 py-space-2 rounded-md border border-border-hairline text-body-sm hover:bg-surface-muted transition-colors duration-fast"
                [attr.aria-haspopup]="'menu'"
                [attr.aria-expanded]="menuOpen()"
                (click)="menuOpen.set(!menuOpen())"
              >
                ⋮ Acciones
              </button>

              <afi-menu-item
                label="Crear carpeta"
                iconStart="folder-plus"
                [shortcut]="showShortcuts() ? '⌘ N' : null"
                (clicked)="menuOpen.set(false)"
              />
              <afi-menu-item
                label="Renombrar"
                iconStart="edit"
                [shortcut]="showShortcuts() ? '⌘ R' : null"
                (clicked)="menuOpen.set(false)"
              />
              <afi-menu-item
                label="Duplicar"
                iconStart="copy"
                [disabled]="showDisabled()"
                (clicked)="menuOpen.set(false)"
              />
              <afi-menu-item label="Compartir" iconStart="share" (clicked)="menuOpen.set(false)" />
              @if (showDanger()) {
                <afi-menu-divider />
                <afi-menu-item
                  label="Eliminar"
                  iconStart="trash"
                  variant="danger"
                  [shortcut]="showShortcuts() ? 'Supr' : null"
                  (clicked)="menuOpen.set(false)"
                />
              }
            </afi-menu>
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
            <li>Acciones contextuales por fila — botón ⋮ en tablas, cards, nav-sections.</li>
            <li>Operaciones por objeto: eliminar, renombrar, duplicar, compartir, exportar.</li>
            <li>Overflow de toolbar cuando las acciones no caben inline.</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Cuándo NO usar
          </h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Selección de valores de formulario — use Select.</li>
            <li>Navegación entre rutas — use NavItem / Sidebar.</li>
            <li>Diálogos con formularios — use Modal.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Composiciones
          </h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            Menu con trigger Button ghost icon-only (⋮). Menu dentro de NavSection con trailing
            action. Menu en fila de tabla con acciones por registro.
          </p>

          <h3 id="ejemplo-real" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Ejemplo real
          </h3>
          <afi-code-block [code]="realWorldCode" language="html" />
        </section>

        <!-- API Reference -->
        <section>
          <h2 id="api-reference" class="text-section text-canvas-fg mb-space-6">API Reference</h2>

          <h3 id="menu-entradas" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Menu — Entradas
          </h3>
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
                @for (row of menuInputs; track row.name) {
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

          <h3 id="menu-salidas" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Menu — Salidas
          </h3>
          <div class="overflow-x-auto rounded-lg border border-border-hairline mb-space-8">
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
                @for (row of menuOutputs; track row.name) {
                  <tr class="border-b border-border-hairline last:border-b-0">
                    <td class="px-space-4 py-space-3 font-mono text-action-700">{{ row.name }}</td>
                    <td class="px-space-4 py-space-3 font-mono">{{ row.payload }}</td>
                    <td class="px-space-4 py-space-3 text-neutral-500">{{ row.notes }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <h3 id="menuitem-entradas" class="text-body-md font-medium text-canvas-fg mb-space-4">
            MenuItem — Entradas
          </h3>
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
                @for (row of menuItemInputs; track row.name) {
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

          <h3 id="menuitem-salidas" class="text-body-md font-medium text-canvas-fg mb-space-4">
            MenuItem — Salidas
          </h3>
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
                <tr class="border-b border-border-hairline last:border-b-0">
                  <td class="px-space-4 py-space-3 font-mono text-action-700">clicked</td>
                  <td class="px-space-4 py-space-3 font-mono">
                    {{ '{ event: MouseEvent | KeyboardEvent }' }}
                  </td>
                  <td class="px-space-4 py-space-3 text-neutral-500">Emitido al activar el item</td>
                </tr>
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
              Panel usa <code class="font-mono text-action-700">role="menu"</code> con
              <code class="font-mono text-action-700">aria-orientation="vertical"</code>.
            </li>
            <li>Cada item usa <code class="font-mono text-action-700">role="menuitem"</code>.</li>
            <li>Divider usa <code class="font-mono text-action-700">role="separator"</code>.</li>
            <li>
              Trigger (responsabilidad del consumidor):
              <code class="font-mono text-action-700">aria-haspopup="menu"</code> +
              <code class="font-mono text-action-700">aria-expanded</code>.
            </li>
            <li>
              Items disabled: <code class="font-mono text-action-700">aria-disabled</code>, no
              reciben foco.
            </li>
          </ul>

          <h3 id="mapa-de-teclado" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Mapa de teclado
          </h3>
          <div class="space-y-space-3 mb-space-8">
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >↑ ↓</kbd
              >
              <span class="text-body-md text-neutral-600">Navega entre items (wraps)</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >Home / End</kbd
              >
              <span class="text-body-md text-neutral-600">Primer / último item</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >Enter / Space</kbd
              >
              <span class="text-body-md text-neutral-600">Activa el item enfocado</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >Esc</kbd
              >
              <span class="text-body-md text-neutral-600"
                >Cierra el menú, devuelve foco al trigger</span
              >
            </div>
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >Tab</kbd
              >
              <span class="text-body-md text-neutral-600">Cierra el menú (no atrapa Tab)</span>
            </div>
          </div>
        </section>

        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-6">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>
              Entrada panel: <code class="font-mono">opacity 0→1 + translateY(-4px→0)</code>,
              <code class="font-mono">duration-fast</code>.
            </li>
            <li>Hover item: <code class="font-mono">bg transition duration-fast</code>.</li>
            <li>
              Hover lean-in ícono: <code class="font-mono">translateX(2px) 120ms ease-out</code>.
            </li>
            <li>Reduced motion: animación de entrada instantánea; ícono no se traslada.</li>
          </ul>
        </section>

        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-6">Do & Don't</h2>
          <div class="space-y-space-4">
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">
                  Acciones destructivas (Eliminar) al final, separadas por divider, con variante
                  danger.
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Mezclar acciones destructivas con acciones normales sin separación visual.
                </p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">
                  Máximo 8 items por menú. Si necesita más, agrupe o use un Drawer.
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Usar Menu para selección de valores — eso es un Select.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class MenuPage {
  readonly menuOpen = signal(false);
  readonly placement = signal<MenuPlacement>('bottom-start');
  readonly showShortcuts = signal(true);
  readonly showDanger = signal(true);
  readonly showDisabled = signal(false);

  readonly placements = PLACEMENTS;
  readonly tokenRows = MENU_TOKENS;

  readonly importCode = `import { MenuComponent, MenuItemComponent, MenuDividerComponent } from '@coherence/ui';`;

  readonly realWorldCode = `<afi-menu [open]="menuOpen()" placement="bottom-start" (openChange)="menuOpen.set($event)">
  <button
    aria-haspopup="menu"
    [aria-expanded]="menuOpen()"
    (click)="menuOpen.set(!menuOpen())">⋮</button>

  <afi-menu-item label="Crear carpeta" iconStart="folder-plus" shortcut="⌘ N" />
  <afi-menu-item label="Renombrar" iconStart="edit" />
  <afi-menu-item label="Compartir" iconStart="share" />
  <afi-menu-divider />
  <afi-menu-item label="Eliminar" iconStart="trash" variant="danger" shortcut="Supr" />
</afi-menu>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = ['  [open]="menuOpen()"'];
    if (this.placement() !== 'bottom-start') props.push(`  placement="${this.placement()}"`);
    props.push('  (openChange)="menuOpen.set($event)"');

    let items = '  <afi-menu-item label="Crear carpeta" iconStart="folder-plus"';
    if (this.showShortcuts()) items += ' shortcut="⌘ N"';
    items += ' />\n  <afi-menu-item label="Renombrar" iconStart="edit" />';
    if (this.showDisabled()) items += '\n  <afi-menu-item label="Duplicar" [disabled]="true" />';
    if (this.showDanger()) {
      items += '\n  <afi-menu-divider />\n  <afi-menu-item label="Eliminar" variant="danger"';
      if (this.showShortcuts()) items += ' shortcut="Supr"';
      items += ' />';
    }

    return `<afi-menu\n${props.join('\n')}\n>\n  <button (click)="toggle()">⋮</button>\n${items}\n</afi-menu>`;
  });

  readonly menuInputs = [
    { name: 'open', type: 'boolean', default: 'false', notes: 'Estado abierto/cerrado del menú' },
    {
      name: 'placement',
      type: 'MenuPlacement',
      default: "'bottom-start'",
      notes: 'Posición relativa al trigger',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      default: "'Menú contextual'",
      notes: 'Label accesible del menú',
    },
  ];

  readonly menuOutputs = [
    { name: 'openChange', payload: 'boolean', notes: 'Emitido al abrir/cerrar' },
    {
      name: 'dismissed',
      payload: "'escape' | 'click-outside' | 'item-select'",
      notes: 'Razón del cierre',
    },
  ];

  readonly menuItemInputs = [
    { name: 'label', type: 'string', default: '(required)', notes: 'Texto del item' },
    {
      name: 'iconStart',
      type: 'string | null',
      default: 'null',
      notes: 'Nombre de ícono (display only)',
    },
    {
      name: 'shortcut',
      type: 'string | null',
      default: 'null',
      notes: 'Hint de atajo (display only)',
    },
    {
      name: 'variant',
      type: "'default' | 'danger'",
      default: "'default'",
      notes: 'Variante visual',
    },
    { name: 'disabled', type: 'boolean', default: 'false', notes: 'Desactiva el item' },
    {
      name: 'ariaLabel',
      type: 'string | null',
      default: 'null',
      notes: 'Override de label para SR',
    },
  ];
}
