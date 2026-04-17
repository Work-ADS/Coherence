import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { SidebarComponent, NavItemComponent } from '@coherence/ui';
import type { SidebarMode } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const SIDEBAR_MODES: SidebarMode[] = ['static', 'collapsible', 'hover-expand'];

const SIDEBAR_TOKENS: TokenRow[] = [
  { property: 'Fondo', token: 'var(--surface-quiet)' },
  { property: 'Borde derecho', token: 'var(--border-hairline)' },
  { property: 'Pin activo', token: 'var(--action-500)' },
  { property: 'Pin inactivo', token: 'var(--neutral-400)' },
  { property: 'Ancho colapsado', token: '64px' },
  { property: 'Ancho expandido', token: '240px' },
  { property: 'Transición', token: 'var(--duration-200) ease-out' },
];

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

const NAV_ITEMS = [
  { label: 'Inicio', icon: 'home', active: false, badge: null },
  { label: 'Proyectos', icon: 'folder', active: true, badge: 3 },
  { label: 'Equipo', icon: 'users', active: false, badge: null },
  { label: 'Configuración', icon: 'settings', active: false, badge: null },
];

@Component({
  selector: 'site-sidebar-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    SidebarComponent,
    NavItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Sidebar + NavItem"
      subtitle="Barra lateral de navegación con tres modos (estática, colapsable, hover-expand) y elementos NavItem con ícono, label, badge y tooltip."
      docsSource="docs/build-prompts/coherence-primitive-page.md"
      buildPromptSlug="coherence-primitive-page"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">

        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <!-- Mode -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Modo</legend>
              @for (m of modes; track m) {
                <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                  <input type="radio" name="mode" [value]="m" [checked]="mode() === m" (change)="mode.set(m)" class="accent-action" />
                  {{ m }}
                </label>
              }
            </fieldset>

            <!-- Options -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Opciones</legend>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="pinned()" (change)="pinned.set(!pinned())" class="accent-action" />
                pinned (hover-expand)
              </label>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="showBadges()" (change)="showBadges.set(!showBadges())" class="accent-action" />
                Mostrar badges
              </label>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="disabledItem()" (change)="disabledItem.set(!disabledItem())" class="accent-action" />
                Item deshabilitado
              </label>
            </fieldset>
          </div>

          <!-- Live preview -->
          <div slot="preview" class="h-[360px] flex border border-border-hairline rounded-lg overflow-hidden">
            <afi-sidebar
              [mode]="mode()"
              [pinned]="pinned()"
              ariaLabel="Navegación de ejemplo"
            >
              <span slot="top" class="text-body-md font-medium text-canvas-fg truncate">Logo</span>

              @for (item of navItems; track item.label; let i = $index) {
                <afi-nav-item
                  [label]="item.label"
                  [active]="item.active"
                  [badge]="showBadges() ? item.badge : null"
                  [disabled]="disabledItem() && i === 3"
                >
                  <svg slot="icon" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    @switch (item.icon) {
                      @case ('home') {
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
                      }
                      @case ('folder') {
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      }
                      @case ('users') {
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      }
                      @case ('settings') {
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      }
                    }
                  </svg>
                </afi-nav-item>
              }

              <span slot="bottom" class="text-body-sm text-neutral-500 truncate">v1.0.0</span>
            </afi-sidebar>
            <div class="flex-1 bg-surface-base p-space-6 text-body-sm text-neutral-500">
              Contenido principal
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
            <li>Navegación principal de aplicación con 4–12 destinos.</li>
            <li>Layouts donde la navegación debe ser persistente y accesible.</li>
            <li>Aplicaciones de escritorio o dashboards con espacio lateral disponible.</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo NO usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Menos de 3 destinos — use tabs o un header nav.</li>
            <li>Viewports móviles — use un drawer o bottom nav en su lugar.</li>
            <li>Navegación secundaria dentro de una sección — use NavSection o tabs.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-3">Composiciones</h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            Sidebar con NavItems agrupados por secciones. Sidebar con slot top para logo
            y slot bottom para avatar de usuario. Sidebar hover-expand con pin para fijar.
          </p>

          <h3 id="ejemplo-real" class="text-body-md font-medium text-canvas-fg mb-space-3">Ejemplo real</h3>
          <afi-code-block [code]="realWorldCode" language="html" />
        </section>

        <!-- API Reference — Sidebar -->
        <section>
          <h2 id="api-reference" class="text-section text-canvas-fg mb-space-4">API Reference</h2>

          <h3 id="sidebar-entradas" class="text-body-md font-medium text-canvas-fg mb-space-3">Sidebar — Entradas</h3>
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
                @for (row of sidebarInputs; track row.name) {
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

          <h3 id="sidebar-salidas" class="text-body-md font-medium text-canvas-fg mb-space-3">Sidebar — Salidas</h3>
          <div class="overflow-x-auto rounded-lg border border-border-hairline mb-space-8">
            <table class="w-full text-body-sm">
              <thead>
                <tr class="bg-neutral-50 border-b border-border-hairline">
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Nombre</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Carga útil</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Descripción</th>
                </tr>
              </thead>
              <tbody>
                @for (row of sidebarOutputs; track row.name) {
                  <tr class="border-b border-border-hairline last:border-b-0">
                    <td class="px-space-4 py-space-3 font-mono text-action-700">{{ row.name }}</td>
                    <td class="px-space-4 py-space-3 font-mono">{{ row.payload }}</td>
                    <td class="px-space-4 py-space-3 text-neutral-500">{{ row.notes }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- API Reference — NavItem -->
          <h3 id="navitem-entradas" class="text-body-md font-medium text-canvas-fg mb-space-3">NavItem — Entradas</h3>
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
                @for (row of navItemInputs; track row.name) {
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

          <h3 id="navitem-salidas" class="text-body-md font-medium text-canvas-fg mb-space-3">NavItem — Salidas</h3>
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
                @for (row of navItemOutputs; track row.name) {
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
          <h3 class="text-body-md font-medium text-canvas-fg mb-space-3">Sidebar</h3>
          <afi-tokens-table [rows]="sidebarTokenRows" title="" />
          <h3 class="text-body-md font-medium text-canvas-fg mb-space-3 mt-space-6">NavItem</h3>
          <afi-tokens-table [rows]="navItemTokenRows" title="" />
        </section>

        <section>
          <h2 id="accesibilidad" class="text-section text-canvas-fg mb-space-4">Accesibilidad</h2>

          <h3 id="reglas" class="text-body-md font-medium text-canvas-fg mb-space-3">Reglas</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Sidebar renderiza un <code class="font-mono text-action-700">&lt;nav&gt;</code> con <code class="font-mono text-action-700">aria-label</code> y <code class="font-mono text-action-700">aria-expanded</code>.</li>
            <li>NavItem usa <code class="font-mono text-action-700">aria-current="page"</code> cuando está activo.</li>
            <li>Tooltip aparece cuando el sidebar está colapsado — accesible vía <code class="font-mono text-action-700">role="tooltip"</code>.</li>
            <li>Items deshabilitados usan <code class="font-mono text-action-700">disabled</code> nativo del botón.</li>
            <li>Proporcione siempre <code class="font-mono text-action-700">ariaLabel</code> en el Sidebar (predeterminado: "Navegación principal").</li>
          </ul>

          <h3 id="mapa-de-teclado" class="text-body-md font-medium text-canvas-fg mb-space-3">Mapa de teclado</h3>
          <div class="space-y-space-3 mb-space-8">
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">↑ ↓</kbd>
              <span class="text-body-md text-neutral-600">Navega entre items</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Home / End</kbd>
              <span class="text-body-md text-neutral-600">Primer / último item</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Enter / Space</kbd>
              <span class="text-body-md text-neutral-600">Activa el item enfocado</span>
            </div>
            <div class="flex items-center gap-space-3">
              <kbd class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono">Tab</kbd>
              <span class="text-body-md text-neutral-600">Entra/sale del sidebar</span>
            </div>
          </div>
        </section>

        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-4">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>Ancho del sidebar: <code class="font-mono">duration-200 ease-out</code> al expandir/colapsar.</li>
            <li>Label opacity: <code class="font-mono">duration-fast</code> — aparece al expandir.</li>
            <li>Tooltip: <code class="font-mono">opacity duration-fast</code> en hover/focus.</li>
            <li>Chevron (collapsible): <code class="font-mono">rotate-180 duration-fast</code>.</li>
            <li>Reduced motion: todas las transiciones colapsan a 0ms vía <code class="font-mono">prefers-reduced-motion</code>.</li>
          </ul>
        </section>

        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do & Don't</h2>
          <div class="space-y-space-4">
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">Use íconos claros y reconocibles en cada NavItem para contexto cuando el sidebar está colapsado.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">NavItem sin ícono — al colapsar el sidebar, el usuario pierde contexto.</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">Máximo 8–10 items de primer nivel. Agrupe con NavSection si necesita más.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">Más de 15 items sin agrupación — el usuario no puede escanear rápido.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class SidebarPage {
  readonly mode = signal<SidebarMode>('hover-expand');
  readonly pinned = signal(false);
  readonly showBadges = signal(true);
  readonly disabledItem = signal(false);

  readonly modes = SIDEBAR_MODES;
  readonly navItems = NAV_ITEMS;
  readonly sidebarTokenRows = SIDEBAR_TOKENS;
  readonly navItemTokenRows = NAV_ITEM_TOKENS;

  readonly importCode = `import { SidebarComponent, NavItemComponent } from '@coherence/ui';`;

  readonly realWorldCode = `<afi-sidebar mode="hover-expand" ariaLabel="Navegación principal">
  <img slot="top" src="/logo.svg" alt="Coherence" class="h-8" />

  <afi-nav-item label="Inicio" [active]="router.isActive('/inicio')">
    <svg slot="icon" ...><!-- home --></svg>
  </afi-nav-item>

  <afi-nav-item label="Proyectos" [badge]="pendientes()">
    <svg slot="icon" ...><!-- folder --></svg>
  </afi-nav-item>

  <span slot="bottom">
    <afi-nav-item label="Mi cuenta">
      <img slot="icon" [src]="avatarUrl()" class="rounded-full" />
    </afi-nav-item>
  </span>
</afi-sidebar>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = [];
    if (this.mode() !== 'hover-expand') props.push(`  mode="${this.mode()}"`);
    if (this.pinned()) props.push('  [pinned]="true"');
    props.push('  ariaLabel="Navegación principal"');

    const items = this.navItems.map(item => {
      const itemProps: string[] = [`    label="${item.label}"`];
      if (item.active) itemProps.push('    [active]="true"');
      if (this.showBadges() && item.badge !== null) itemProps.push(`    [badge]="${item.badge}"`);
      return `  <afi-nav-item\n${itemProps.join('\n')}\n  >\n    <svg slot="icon" ...></svg>\n  </afi-nav-item>`;
    }).join('\n');

    return `<afi-sidebar\n${props.join('\n')}\n>\n${items}\n</afi-sidebar>`;
  });

  readonly sidebarInputs = [
    { name: 'mode', type: "'static' | 'collapsible' | 'hover-expand'", default: "'hover-expand'", notes: 'Modo de interacción del sidebar' },
    { name: 'expanded', type: 'boolean | null', default: 'null', notes: 'Override manual del estado expandido' },
    { name: 'pinned', type: 'boolean', default: 'false', notes: 'Fija el sidebar abierto (hover-expand)' },
    { name: 'ariaLabel', type: 'string', default: "'Navegación principal'", notes: 'Label accesible del nav' },
    { name: 'width', type: '{ collapsed: string; expanded: string }', default: "{ collapsed: '64px', expanded: '240px' }", notes: 'Anchos personalizados' },
  ];

  readonly sidebarOutputs = [
    { name: 'expandedChange', payload: 'boolean', notes: 'Emitido al cambiar el estado expandido' },
    { name: 'pinnedChange', payload: 'boolean', notes: 'Emitido al fijar/desfijar el sidebar' },
  ];

  readonly navItemInputs = [
    { name: 'label', type: 'string', default: '(required)', notes: 'Texto del item de navegación' },
    { name: 'active', type: 'boolean', default: 'false', notes: 'Marca el item como activo (aria-current="page")' },
    { name: 'badge', type: 'number | string | null', default: 'null', notes: 'Badge de notificación' },
    { name: 'disabled', type: 'boolean', default: 'false', notes: 'Desactiva el item' },
    { name: 'sidebarExpanded', type: 'boolean', default: 'true', notes: 'Controla visibilidad del label (set por Sidebar)' },
  ];

  readonly navItemOutputs = [
    { name: 'clicked', payload: '{ event: MouseEvent }', notes: 'Emitido al hacer clic en el item' },
  ];
}
