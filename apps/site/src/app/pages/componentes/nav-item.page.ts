import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  NavItemComponent,
  CheckboxComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
  InputComponent,
} from '@coherence/ui';

type NavItemVariant = 'default' | 'active';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const VARIANTS: NavItemVariant[] = ['default', 'active'];

const NAV_ITEM_TOKENS: TokenRow[] = [
  { property: 'Texto (idle)', token: 'var(--neutral-700)' },
  { property: 'Texto (activo)', token: 'var(--action-900)' },
  { property: 'Fondo hover', token: 'var(--surface-100)' },
  { property: 'Fondo activo', token: 'var(--action) / 5%' },
  { property: 'Borde activo', token: 'var(--action)' },
  { property: 'Badge fondo', token: 'var(--system-error-500)' },
  { property: 'Tooltip fondo', token: 'var(--neutral-900)' },
  { property: 'Foco', token: 'var(--action)', note: '2px offset' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
];

@Component({
  selector: 'app-nav-item-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    NavItemComponent,
    CheckboxComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
    InputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="NavItem"
      subtitle="Elemento de navegación individual para uso dentro de barras laterales y menús."
      docsSource="docs/build-prompts/coherence-nav-item.md"
      buildPromptSlug="coherence-nav-item"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">
        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <!-- Active (variant) -->
            <afi-radio-group legend="Estado activo">
              @for (v of variants; track v) {
                <afi-radio-group-item
                  [value]="v"
                  [label]="v"
                  [selected]="variant() === v"
                  (selectedChange)="$any(variant).set($event)"
                  size="sm"
                  [compact]="true"
                />
              }
            </afi-radio-group>

            <!-- Sidebar expanded -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Sidebar</legend>
              <afi-checkbox
                [checked]="sidebarExpanded()"
                (checkedChange)="sidebarExpanded.set($event)"
                label="sidebarExpanded"
                size="sm"
                [compact]="true"
              />
            </fieldset>

            <!-- State toggles -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Estado</legend>
              <afi-checkbox
                [checked]="disabled()"
                (checkedChange)="disabled.set($event)"
                label="disabled"
                size="sm"
                [compact]="true"
              />
            </fieldset>

            <!-- Label -->
            <div>
              <label class="font-medium text-canvas-fg mb-space-1 block text-body-sm"
                >Etiqueta</label
              >
              <afi-input
                size="sm"
                [value]="label()"
                (valueChange)="label.set($event?.toString() ?? '')"
              />
            </div>

            <!-- Badge -->
            <div>
              <label class="font-medium text-canvas-fg mb-space-1 block text-body-sm">Badge</label>
              <afi-input
                size="sm"
                [value]="badge()"
                (valueChange)="badge.set($event?.toString() ?? '')"
              />
            </div>
          </div>

          <!-- Live preview -->
          <div slot="preview" class="w-64 bg-neutral-50 rounded-lg p-space-2">
            <afi-nav-item
              [label]="label()"
              [active]="variant() === 'active'"
              [badge]="badgeValue()"
              [disabled]="disabled()"
              [sidebarExpanded]="sidebarExpanded()"
            >
              <span slot="icon" class="text-body-sm">📄</span>
            </afi-nav-item>
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
            <li>Elementos de navegación dentro de barras laterales y menús verticales.</li>
            <li>Indicar la sección activa dentro de un panel de navegación.</li>
            <li>Mostrar notificaciones o contadores mediante el badge integrado.</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Cuándo NO usar
          </h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Navegación principal horizontal — use Tabs o enlaces directos.</li>
            <li>Acciones que no impliquen navegación — use Button.</li>
            <li>Menús contextuales emergentes — use Menu o Dropdown.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Composiciones
          </h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            NavItem dentro de Sidebar colapsable. NavItem con badge numérico para notificaciones
            pendientes.
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
        <!-- Tokens consumidos -->
        <section>
          <h2 id="tokens-consumidos" class="text-section text-canvas-fg mb-space-6">
            Tokens consumidos
          </h2>
          <afi-tokens-table [rows]="tokenRows" title="" />
        </section>

        <!-- Accesibilidad -->
        <section>
          <h2 id="accesibilidad" class="text-section text-canvas-fg mb-space-6">Accesibilidad</h2>

          <h3 id="reglas" class="text-body-md font-medium text-canvas-fg mb-space-4">Reglas</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>
              Usa <code class="font-mono text-action-700">&lt;button&gt;</code> nativo como elemento
              interactivo.
            </li>
            <li>
              El elemento activo se marca con
              <code class="font-mono text-action-700">aria-current="page"</code>.
            </li>
            <li>
              Cuando la sidebar está colapsada, el tooltip muestra la etiqueta en hover/focus.
            </li>
            <li>Foco visible con anillo de 2px (<code class="font-mono">--action</code>).</li>
            <li>El badge utiliza contenido textual accesible por lectores de pantalla.</li>
          </ul>

          <h3 id="mapa-de-teclado" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Mapa de teclado
          </h3>
          <div class="space-y-space-3 mb-space-8">
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >Tab</kbd
              >
              <span class="text-body-md text-neutral-600">Enfoca el elemento de navegación</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >Enter / Space</kbd
              >
              <span class="text-body-md text-neutral-600">Activa la navegación</span>
            </div>
          </div>

          <h3 id="demostracion-lectora" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Demostración lectora de pantalla
          </h3>
          <div
            class="flex items-center gap-space-6 p-space-4 bg-neutral-50 rounded-md border border-border-hairline"
          >
            <afi-nav-item label="Dashboard" [active]="true" [sidebarExpanded]="true">
              <span slot="icon" class="text-body-sm">📊</span>
            </afi-nav-item>
            <code class="text-body-sm font-mono text-neutral-600"
              >aria-current="page" · "Dashboard"</code
            >
          </div>
        </section>

        <!-- Motion -->
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-6">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>
              Transición de color y fondo:
              <code class="font-mono">var(--duration-fast)</code> (150ms)
              <code class="font-mono">ease-out</code>
            </li>
            <li>
              Opacidad de la etiqueta al colapsar sidebar:
              <code class="font-mono">var(--duration-fast)</code>
            </li>
            <li>
              Tooltip: <code class="font-mono">opacity</code> con
              <code class="font-mono">var(--duration-fast)</code>
            </li>
            <li>Reduced motion: transiciones colapsan a instantáneo.</li>
          </ul>
          <div
            class="flex items-center gap-space-4 p-space-4 bg-neutral-50 rounded-md border border-border-hairline"
          >
            <afi-nav-item label="Hover me" [sidebarExpanded]="true">
              <span slot="icon" class="text-body-sm">📁</span>
            </afi-nav-item>
            <span class="text-body-sm text-neutral-500"
              >Pase el cursor para ver la transición de fondo.</span
            >
          </div>
        </section>

        <!-- Do & Don't -->
        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-6">Do & Don't</h2>
          <div class="space-y-space-4">
            <!-- Pair 1 -->
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <div class="mb-space-2">
                  <afi-nav-item label="Transacciones" [active]="true" [sidebarExpanded]="true">
                    <span slot="icon" class="text-body-sm">💳</span>
                  </afi-nav-item>
                </div>
                <p class="text-body-sm text-neutral-600">
                  Un solo NavItem activo a la vez en la sidebar.
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <div class="mb-space-2 space-y-1">
                  <afi-nav-item label="Transacciones" [active]="true" [sidebarExpanded]="true">
                    <span slot="icon" class="text-body-sm">💳</span>
                  </afi-nav-item>
                  <afi-nav-item label="Dashboard" [active]="true" [sidebarExpanded]="true">
                    <span slot="icon" class="text-body-sm">📊</span>
                  </afi-nav-item>
                </div>
                <p class="text-body-sm text-neutral-600">
                  Dos NavItems activos confunden al usuario.
                </p>
              </div>
            </div>

            <!-- Pair 2 -->
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <div class="mb-space-2">
                  <afi-nav-item label="Alertas" [badge]="3" [sidebarExpanded]="true">
                    <span slot="icon" class="text-body-sm">🔔</span>
                  </afi-nav-item>
                </div>
                <p class="text-body-sm text-neutral-600">
                  Badge para indicar notificaciones pendientes.
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <div class="mb-space-2">
                  <afi-nav-item label="Alertas" [badge]="999" [sidebarExpanded]="true">
                    <span slot="icon" class="text-body-sm">🔔</span>
                  </afi-nav-item>
                </div>
                <p class="text-body-sm text-neutral-600">
                  Números grandes desbordan el badge. Use "99+".
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class NavItemPage {
  readonly variant = signal<NavItemVariant>('default');
  readonly sidebarExpanded = signal(true);
  readonly disabled = signal(false);
  readonly label = signal('Dashboard');
  readonly badge = signal('');

  readonly variants = VARIANTS;
  readonly tokenRows = NAV_ITEM_TOKENS;

  readonly importCode = "import { NavItemComponent } from '@coherence/ui/nav-item';";

  readonly realWorldCode = `<afi-nav-item
  label="Transacciones"
  [active]="ruta === 'transacciones'"
  [badge]="alertasPendientes()"
  [sidebarExpanded]="sidebarAbierta()"
  (clicked)="navegarA('transacciones')">
  <afi-icon slot="icon" name="receipt" />
</afi-nav-item>`;

  readonly badgeValue = computed(() => {
    const raw = this.badge();
    if (!raw) return null;
    const num = Number(raw);
    return isNaN(num) ? raw : num;
  });

  readonly codeSnippet = computed(() => {
    const props: string[] = [];
    props.push(`  label="${this.label()}"`);
    if (this.variant() === 'active') props.push('  [active]="true"');
    if (this.badge()) props.push(`  [badge]="${this.badge()}"`);
    if (this.disabled()) props.push('  [disabled]="true"');
    if (!this.sidebarExpanded()) props.push('  [sidebarExpanded]="false"');

    const propsStr = props.length ? '\n' + props.join('\n') + '\n' : '';
    return `<afi-nav-item${propsStr}>\n  <afi-icon slot="icon" name="file" />\n</afi-nav-item>`;
  });

  readonly apiInputs = [
    { name: 'label', type: 'string', default: '(required)', notes: 'Texto visible del elemento' },
    {
      name: 'active',
      type: 'boolean',
      default: 'false',
      notes: 'Marca el elemento como sección activa',
    },
    {
      name: 'badge',
      type: 'number | string | null',
      default: 'null',
      notes: 'Contador o texto del badge',
    },
    { name: 'disabled', type: 'boolean', default: 'false', notes: 'Desactiva interacción' },
    {
      name: 'sidebarExpanded',
      type: 'boolean',
      default: 'true',
      notes: 'Controla visibilidad de la etiqueta y tooltip',
    },
  ];

  readonly apiOutputs = [
    {
      name: 'clicked',
      payload: '{ event: MouseEvent }',
      notes: 'Emitido al hacer clic (no emite si disabled)',
    },
  ];
}
