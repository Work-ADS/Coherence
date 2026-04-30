import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  PageHeaderComponent,
  CheckboxComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
  InputComponent,
} from '@coherence/ui';
import type { PageHeaderDensity } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const DENSITIES: PageHeaderDensity[] = ['default', 'compact'];

const PAGE_HEADER_TOKENS: TokenRow[] = [
  { property: 'Fondo', token: 'var(--surface-elevated)' },
  { property: 'Título', token: 'var(--type-title), var(--canvas-fg)' },
  { property: 'Subtítulo', token: 'var(--type-body), var(--color-neutral-500)' },
  { property: 'Borde scroll', token: 'var(--border-hairline)' },
  { property: 'Backdrop blur', token: 'blur(8px)' },
  { property: 'Padding horizontal', token: 'var(--dim-space-8)' },
  { property: 'Altura mín. (default)', token: '56px' },
  { property: 'Altura mín. (compact)', token: '48px' },
  { property: 'Sticky z-index', token: 'z-10' },
  { property: 'Transición', token: 'var(--duration-fast) var(--easing-enter)' },
];

@Component({
  selector: 'site-page-header-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    PageHeaderComponent,
    CheckboxComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
    InputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="PageHeader"
      subtitle="Encabezado de página con título, estado, breadcrumb, acciones y soporte sticky con scroll-fade."
      docsSource="docs/build-prompts/coherence-site.md"
      buildPromptSlug="coherence-site"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">
        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <!-- Density -->
            <afi-radio-group legend="Densidad">
              @for (d of densities; track d) {
                <afi-radio-group-item
                  [value]="d"
                  [label]="d"
                  [selected]="density() === d"
                  (selectedChange)="$any(density).set($event)"
                  size="sm"
                  [compact]="true"
                />
              }
            </afi-radio-group>

            <!-- Toggles -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Opciones</legend>
              <afi-checkbox
                [checked]="sticky()"
                (checkedChange)="sticky.set($event)"
                label="sticky"
                size="sm"
                [compact]="true"
              />
              <afi-checkbox
                [checked]="scrollFade()"
                (checkedChange)="scrollFade.set($event)"
                label="scrollFade"
                size="sm"
                [compact]="true"
              />
              <afi-checkbox
                [checked]="showSubtitle()"
                (checkedChange)="showSubtitle.set($event)"
                label="subtitle"
                size="sm"
                [compact]="true"
              />
            </fieldset>

            <!-- Title -->
            <div>
              <label class="font-medium text-canvas-fg mb-space-1 block text-body-sm">Título</label>
              <afi-input
                size="sm"
                [value]="title()"
                (valueChange)="title.set($event?.toString() ?? '')"
              />
            </div>
          </div>

          <!-- Live preview -->
          <div slot="preview" class="border border-border-hairline rounded-md overflow-hidden">
            <afi-page-header
              [title]="title()"
              [subtitle]="showSubtitle() ? 'Gestione las operaciones activas de su cartera.' : null"
              [sticky]="sticky()"
              [scrollFade]="scrollFade()"
              [density]="density()"
            />
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
            <li>Encabezado principal de cada vista con título, acciones y contexto.</li>
            <li>Páginas con scroll largo donde el título debe permanecer visible (sticky).</li>
            <li>Vistas con breadcrumb, estado y acciones globales.</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Cuándo NO usar
          </h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Dentro de modales o drawers — use un título simple.</li>
            <li>Secciones internas de una página — use h2/h3 directamente.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Composiciones
          </h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            PageHeader + StatusChip para mostrar estado de entidad. PageHeader + Tabs en slot tabs
            para navegación de sub-secciones. PageHeader + Button en slot primaryAction para acción
            principal.
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

        <!-- Slots -->
        <section>
          <h2 id="slots" class="text-section text-canvas-fg mb-space-6">Slots de contenido</h2>
          <div class="overflow-x-auto rounded-lg border border-border-hairline">
            <table class="w-full text-body-sm">
              <thead>
                <tr class="bg-neutral-50 border-b border-border-hairline">
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Slot</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody>
                @for (s of slots; track s.name) {
                  <tr class="border-b border-border-hairline last:border-b-0">
                    <td class="px-space-4 py-space-3 font-mono text-action-700">{{ s.name }}</td>
                    <td class="px-space-4 py-space-3 text-neutral-500">{{ s.desc }}</td>
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
              Usa <code class="font-mono text-action-700">role="banner"</code> como landmark de
              página.
            </li>
            <li>
              Incluye <code class="font-mono text-action-700">aria-label</code> descriptivo (por
              defecto "Encabezado de página").
            </li>
            <li>
              El título usa <code class="font-mono text-action-700">&lt;h1&gt;</code> — solo un
              PageHeader por vista.
            </li>
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
              <span class="text-body-md text-neutral-600"
                >Navega entre acciones y controles del header</span
              >
            </div>
          </div>
        </section>

        <!-- Motion -->
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-6">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>
              Scroll-fade: borde inferior y backdrop-blur transicionan con
              <code class="font-mono">var(--duration-fast)</code>.
            </li>
            <li>Reduced motion: transiciones colapsan a instantáneo.</li>
          </ul>
        </section>

        <!-- Do & Don't -->
        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-6">Do & Don't</h2>
          <div class="space-y-space-4">
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">
                  Un solo PageHeader por vista como h1 de la página.
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Múltiples PageHeaders en la misma vista compiten por jerarquía.
                </p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">
                  Usar sticky con scrollFade para mantener contexto en páginas largas.
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Sticky sin scrollFade oculta contenido sin indicación visual.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class PageHeaderPage {
  readonly density = signal<PageHeaderDensity>('default');
  readonly sticky = signal(true);
  readonly scrollFade = signal(true);
  readonly showSubtitle = signal(true);
  readonly title = signal('Operaciones');

  readonly densities = DENSITIES;
  readonly tokenRows = PAGE_HEADER_TOKENS;

  readonly importCode = "import { PageHeaderComponent } from '@coherence/ui/page-header';";

  readonly realWorldCode = `<afi-page-header
  [title]="operacion().nombre"
  [estado]="operacion().estado"
  [sticky]="true"
>
  <nav slot="breadcrumb">Inicio / Operaciones / {{ operacion().id }}</nav>
  <afi-button slot="primaryAction" variant="primary" (clicked)="editar()">
    Editar
  </afi-button>
</afi-page-header>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = [`  title="${this.title()}"`];
    if (this.showSubtitle()) props.push('  subtitle="Gestione las operaciones activas."');
    if (this.density() !== 'default') props.push(`  density="${this.density()}"`);
    if (!this.sticky()) props.push('  [sticky]="false"');
    if (!this.scrollFade()) props.push('  [scrollFade]="false"');
    return `<afi-page-header\n${props.join('\n')}\n/>`;
  });

  readonly apiInputs = [
    { name: 'title', type: 'string', default: '(required)', notes: 'Título principal h1' },
    { name: 'subtitle', type: 'string | null', default: 'null', notes: 'Subtítulo descriptivo' },
    {
      name: 'estado',
      type: 'Estado | null',
      default: 'null',
      notes: 'Chip de estado junto al título',
    },
    { name: 'sticky', type: 'boolean', default: 'true', notes: 'Fija el header al hacer scroll' },
    {
      name: 'scrollFade',
      type: 'boolean',
      default: 'true',
      notes: 'Activa blur + borde al scrollear',
    },
    {
      name: 'density',
      type: "'compact' | 'default'",
      default: "'default'",
      notes: 'Altura del header',
    },
    {
      name: 'ariaLabel',
      type: 'string | null',
      default: 'null',
      notes: 'Sobrescribe el aria-label del banner',
    },
  ];

  readonly apiOutputs = [
    {
      name: 'stickyChange',
      payload: 'boolean',
      notes: 'Emitido al cambiar el estado de scroll (scrolled/not)',
    },
  ];

  readonly slots = [
    { name: '[slot=breadcrumb]', desc: 'Navegación breadcrumb en fila superior' },
    {
      name: '[slot=globalActions]',
      desc: 'Acciones globales (ej. configuración) en fila superior derecha',
    },
    { name: '[slot=meta]', desc: 'Metadatos junto al título (ej. fecha, ID)' },
    { name: '[slot=primaryAction]', desc: 'Acción principal (ej. botón Editar)' },
    { name: '[slot=filters]', desc: 'Barra de filtros debajo del título' },
    { name: '[slot=tabs]', desc: 'Tabs de sub-navegación' },
  ];
}
