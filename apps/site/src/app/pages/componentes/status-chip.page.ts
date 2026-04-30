import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  StatusChipComponent,
  estadoLabels,
  CheckboxComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
} from '@coherence/ui';
import type { Estado, StatusChipSize, StatusChipVariant } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const ESTADOS: Estado[] = [
  'borrador',
  'pendiente',
  'aprobada',
  'rechazada',
  'ejecutada',
  'cancelada',
  'en-revision',
  'archivada',
];
const SIZES: StatusChipSize[] = ['sm', 'md'];
const VARIANTS: StatusChipVariant[] = ['subtle', 'solid'];

const STATUS_CHIP_TOKENS: TokenRow[] = [
  { property: 'Fondo (subtle)', token: 'var(--status-{key}-bg)' },
  { property: 'Texto (subtle)', token: 'var(--status-{key}-fg)' },
  { property: 'Fondo (solid)', token: 'var(--status-{key}-dot)' },
  { property: 'Texto (solid)', token: 'white' },
  { property: 'Dot', token: 'var(--status-{key}-dot)' },
  { property: 'Radio', token: 'rounded-full' },
  { property: 'Altura (sm)', token: 'h-5 (20px)' },
  { property: 'Altura (md)', token: 'h-6 (24px)' },
  { property: 'Tipografía', token: 'var(--type-body-sm), font-medium' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
];

@Component({
  selector: 'site-status-chip-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    StatusChipComponent,
    CheckboxComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="StatusChip"
      subtitle="Indicador visual de estado para entidades del dominio. 8 estados, 2 variantes, 2 tamaños."
      docsSource="docs/build-prompts/coherence-site.md"
      buildPromptSlug="coherence-site"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">
        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <!-- Estado -->
            <afi-radio-group legend="Estado">
              @for (e of estados; track e) {
                <afi-radio-group-item
                  [value]="e"
                  [label]="e"
                  [selected]="estado() === e"
                  (selectedChange)="$any(estado).set($event)"
                  size="sm"
                  [compact]="true"
                />
              }
            </afi-radio-group>

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

            <!-- Size -->
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

            <!-- showDot -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Opciones</legend>
              <afi-checkbox
                [checked]="showDot()"
                (checkedChange)="showDot.set($event)"
                label="showDot"
                size="sm"
                [compact]="true"
              />
            </fieldset>
          </div>

          <!-- Live preview -->
          <div slot="preview" class="flex items-center gap-space-4">
            <afi-status-chip
              [estado]="estado()"
              [size]="size()"
              [variant]="variant()"
              [showDot]="showDot()"
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
            <li>Indicar el estado de una operación, transacción o entidad del dominio.</li>
            <li>Dentro de tablas, page headers y cards para comunicar estado rápidamente.</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Cuándo NO usar
          </h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Para etiquetas genéricas sin semántica de estado — use Badge.</li>
            <li>Para notificaciones o alertas — use los componentes de sistema.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Composiciones
          </h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            StatusChip dentro de PageHeader junto al título. StatusChip en columna de estado de
            Table. StatusChip en Card como indicador visual.
          </p>

          <h3 id="ejemplo-real" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Ejemplo real
          </h3>
          <afi-code-block [code]="realWorldCode" language="html" />
        </section>

        <!-- All states gallery -->
        <section>
          <h2 id="galeria" class="text-section text-canvas-fg mb-space-6">Galería de estados</h2>
          <div class="flex flex-wrap gap-space-3">
            @for (e of estados; track e) {
              <afi-status-chip [estado]="e" size="md" variant="subtle" />
            }
          </div>
          <div class="flex flex-wrap gap-space-3 mt-space-4">
            @for (e of estados; track e) {
              <afi-status-chip [estado]="e" size="md" variant="solid" />
            }
          </div>
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
              Usa <code class="font-mono text-action-700">role="status"</code> para anunciar cambios
              a lectoras de pantalla.
            </li>
            <li>
              Incluye <code class="font-mono text-action-700">aria-label</code> con el texto del
              estado.
            </li>
            <li>
              El dot decorativo tiene
              <code class="font-mono text-action-700">aria-hidden="true"</code>.
            </li>
            <li>Contraste mínimo 4.5:1 entre texto y fondo en ambas variantes.</li>
          </ul>
        </section>

        <!-- Motion -->
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-6">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>
              Transición de color: <code class="font-mono">var(--duration-fast)</code> (150ms)
              <code class="font-mono">ease-out</code>.
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
                  Usar estados del dominio (borrador, pendiente, aprobada…).
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Inventar estados ad-hoc fuera del vocabulario del dominio.
                </p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">
                  Variant subtle para tablas y listas (menor peso visual).
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Variant solid en todas partes satura la interfaz de color.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class StatusChipPage {
  readonly estado = signal<Estado>('aprobada');
  readonly size = signal<StatusChipSize>('md');
  readonly variant = signal<StatusChipVariant>('subtle');
  readonly showDot = signal(true);

  readonly estados = ESTADOS;
  readonly sizes = SIZES;
  readonly variants = VARIANTS;
  readonly tokenRows = STATUS_CHIP_TOKENS;

  readonly importCode = `import { StatusChipComponent } from '@coherence/ui/status-chip';
import type { Estado } from '@coherence/ui/status-chip';`;

  readonly realWorldCode = `<afi-status-chip
  [estado]="operacion().estado"
  size="sm"
  variant="subtle"
/>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = [`  estado="${this.estado()}"`];
    if (this.size() !== 'md') props.push(`  size="${this.size()}"`);
    if (this.variant() !== 'subtle') props.push(`  variant="${this.variant()}"`);
    if (!this.showDot()) props.push('  [showDot]="false"');
    return `<afi-status-chip\n${props.join('\n')}\n/>`;
  });

  readonly apiInputs = [
    {
      name: 'estado',
      type: 'Estado',
      default: '(required)',
      notes: 'Estado del dominio (borrador, pendiente, etc.)',
    },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", notes: 'Tamaño del chip' },
    { name: 'variant', type: "'subtle' | 'solid'", default: "'subtle'", notes: 'Estilo visual' },
    { name: 'showDot', type: 'boolean', default: 'true', notes: 'Muestra dot de color' },
    {
      name: 'ariaLabel',
      type: 'string | null',
      default: 'null',
      notes: 'Sobrescribe el aria-label',
    },
  ];
}
