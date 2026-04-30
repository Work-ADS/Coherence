import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  CardComponent,
  CheckboxComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
} from '@coherence/ui';
import type { CardVariant, CardPadding } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const VARIANTS: CardVariant[] = ['default', 'elevated', 'quiet'];
const PADDINGS: CardPadding[] = ['none', 'sm', 'md', 'lg'];

const CARD_TOKENS: TokenRow[] = [
  { property: 'Fondo (default)', token: 'var(--surface-100)' },
  { property: 'Fondo (elevated)', token: 'var(--surface-elevated)' },
  { property: 'Fondo (quiet)', token: 'var(--surface-quiet)' },
  { property: 'Borde', token: 'var(--border-hairline)' },
  { property: 'Sombra (elevated)', token: 'shadow-sm' },
  { property: 'Sombra hover (interactive)', token: 'shadow-md' },
  { property: 'Foco', token: 'var(--border-focus)', note: '2px offset' },
  { property: 'Radio', token: 'rounded-md (6px)' },
  { property: 'Padding (sm/md/lg)', token: 'space-3 / space-4 / space-6' },
  { property: 'Transición (interactive)', token: 'var(--duration-fast) ease-out' },
];

@Component({
  selector: 'site-card-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    CardComponent,
    CheckboxComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Card"
      subtitle="Contenedor de bajo nivel para agrupar contenido relacionado. Tres variantes visuales y tres slots: header, body, footer."
      docsSource="docs/build-prompts/coherence-primitive-page.md"
      buildPromptSlug="coherence-primitive-page"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">
        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <!-- Variant -->
            <afi-radio-group legend="Variante">
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

            <!-- Padding -->
            <afi-radio-group legend="Padding">
              @for (p of paddings; track p) {
                <afi-radio-group-item
                  [value]="p"
                  [label]="p"
                  [selected]="padding() === p"
                  (selectedChange)="$any(padding).set($event)"
                  size="sm"
                  [compact]="true"
                />
              }
            </afi-radio-group>

            <!-- Interactive -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Estado</legend>
              <afi-checkbox
                [checked]="interactive()"
                (checkedChange)="interactive.set($event)"
                label="interactive"
                size="sm"
                [compact]="true"
              />
            </fieldset>
          </div>

          <!-- Live preview -->
          <div slot="preview">
            <afi-card
              [variant]="variant()"
              [padding]="padding()"
              [interactive]="interactive()"
              [ariaLabel]="interactive() ? 'Tarjeta interactiva de ejemplo' : null"
            >
              <div slot="header">
                <h3 class="text-body-md font-medium text-canvas-fg">Título de la tarjeta</h3>
              </div>
              <p class="text-body-md text-neutral-600">
                Contenido de ejemplo dentro del body de la Card.
              </p>
              <div slot="footer">
                <span class="text-body-sm text-neutral-500">Pie de tarjeta</span>
              </div>
            </afi-card>
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
            <li>Agrupar contenido relacionado visualmente (métricas, resúmenes, previews).</li>
            <li>Contenedor para formularios, listas o paneles de configuración.</li>
            <li>
              Tarjeta interactiva que navega a un detalle (con
              <code class="font-mono">interactive</code>).
            </li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Cuándo NO usar
          </h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Layout de página completa — use secciones con divisores.</li>
            <li>Diálogos modales — use <code class="font-mono">&lt;afi-modal&gt;</code>.</li>
            <li>Paneles laterales — use <code class="font-mono">&lt;afi-drawer&gt;</code>.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Composiciones
          </h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            Grid de Cards para dashboards. Card con LoadingOverlay para carga asíncrona. Card con
            header + Table para listados con título.
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
            <li>Card no interactiva: contenedor semántico sin role adicional.</li>
            <li>
              Card interactiva: <code class="font-mono text-action-700">role="button"</code>,
              <code class="font-mono text-action-700">tabindex="0"</code>.
            </li>
            <li>
              Siempre proporcione <code class="font-mono text-action-700">ariaLabel</code> cuando
              interactive es true.
            </li>
            <li>Focus visible con ring de 2px.</li>
            <li>Enter y Space activan el click en modo interactivo.</li>
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
                >Enfoca la tarjeta (solo interactive)</span
              >
            </div>
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >Enter / Space</kbd
              >
              <span class="text-body-md text-neutral-600">Activa el click (solo interactive)</span>
            </div>
          </div>
        </section>

        <!-- Motion -->
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-6">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>
              Hover shadow (interactive):
              <code class="font-mono">var(--duration-fast)</code> ease-out.
            </li>
            <li>Reduced motion: transición de sombra colapsa a instantáneo.</li>
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
                  Use variant "default" con borde para separar del fondo.
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Anidar Cards dentro de Cards — genera ruido visual.
                </p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">
                  Use interactive + ariaLabel para tarjetas clickeables.
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Card interactiva sin ariaLabel — inaccesible para lectores.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class CardPage {
  readonly variant = signal<CardVariant>('default');
  readonly padding = signal<CardPadding>('md');
  readonly interactive = signal(false);

  readonly variants = VARIANTS;
  readonly paddings = PADDINGS;
  readonly tokenRows = CARD_TOKENS;

  readonly importCode = "import { CardComponent } from '@coherence/ui/card';";

  readonly realWorldCode = `<afi-card variant="default" padding="md">
  <div slot="header">
    <h3 class="text-body-md font-medium">Métricas del mes</h3>
  </div>
  <p>Usuarios activos: {{ usuariosActivos() }}</p>
  <div slot="footer">
    <span class="text-body-sm text-neutral-500">Actualizado hace 5 min</span>
  </div>
</afi-card>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = [];
    if (this.variant() !== 'default') props.push(`  variant="${this.variant()}"`);
    if (this.padding() !== 'md') props.push(`  padding="${this.padding()}"`);
    if (this.interactive()) props.push('  [interactive]="true"');

    const propsStr = props.length ? '\n' + props.join('\n') + '\n' : '';
    return `<afi-card${propsStr}>\n  <!-- contenido -->\n</afi-card>`;
  });

  readonly apiInputs = [
    {
      name: 'variant',
      type: "'default' | 'elevated' | 'quiet'",
      default: "'default'",
      notes: 'Estilo visual',
    },
    {
      name: 'padding',
      type: "'none' | 'sm' | 'md' | 'lg'",
      default: "'md'",
      notes: 'Padding del body',
    },
    { name: 'interactive', type: 'boolean', default: 'false', notes: 'Hace la tarjeta clickeable' },
    {
      name: 'ariaLabel',
      type: 'string | null',
      default: 'null',
      notes: 'Etiqueta accesible (requerido si interactive)',
    },
  ];

  readonly apiOutputs = [
    {
      name: 'clicked',
      payload: '{ event: MouseEvent | KeyboardEvent }',
      notes: 'Emitido al hacer click (solo interactive)',
    },
  ];
}
