import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  ModalComponent,
  CheckboxComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
} from '@coherence/ui';
import type { ModalSize } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const SIZES: ModalSize[] = ['sm', 'md', 'lg'];

const MODAL_TOKENS: TokenRow[] = [
  { property: 'Fondo panel', token: 'var(--surface-elevated)' },
  { property: 'Backdrop', token: 'black/40' },
  { property: 'Borde footer', token: 'var(--border-hairline)' },
  { property: 'Título', token: 'var(--canvas-fg)' },
  { property: 'Descripción', token: 'var(--neutral-600)' },
  { property: 'Botón cerrar (idle)', token: 'var(--neutral-400)' },
  { property: 'Botón cerrar (hover)', token: 'var(--canvas-fg)' },
  { property: 'Foco', token: 'var(--border-focus)' },
  { property: 'Sombra', token: 'shadow-lg' },
  { property: 'Tamaño (sm/md/lg)', token: '400px / 560px / 720px' },
];

@Component({
  selector: 'site-modal-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    ModalComponent,
    CheckboxComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Modal"
      subtitle="Diálogo modal basado en &lt;dialog&gt; nativo. Focus trap, scroll lock y backdrop integrados sin CDK."
      docsSource="docs/build-prompts/coherence-primitive-page.md"
      buildPromptSlug="coherence-primitive-page"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">
        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
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

            <!-- Options -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Opciones</legend>
              <afi-checkbox
                [checked]="closeOnBackdrop()"
                (checkedChange)="closeOnBackdrop.set($event)"
                label="closeOnBackdrop"
                size="sm"
                [compact]="true"
              />
              <afi-checkbox
                [checked]="closeOnEsc()"
                (checkedChange)="closeOnEsc.set($event)"
                label="closeOnEsc"
                size="sm"
                [compact]="true"
              />
            </fieldset>

            <!-- Open button -->
            <button
              type="button"
              class="w-full px-space-4 py-space-2 bg-action text-white rounded-md text-body-sm font-medium hover:bg-action-600 transition-colors"
              (click)="openModal.set(true)"
            >
              Abrir modal
            </button>
          </div>

          <!-- Live preview -->
          <div slot="preview">
            <p class="text-body-md text-neutral-600">
              Use el botón "Abrir modal" en los controles para ver el componente.
            </p>
            <afi-modal
              [open]="openModal()"
              [size]="size()"
              title="Confirmar acción"
              description="¿Está seguro de que desea continuar con esta operación?"
              [closeOnEsc]="closeOnEsc()"
              [closeOnBackdrop]="closeOnBackdrop()"
              (openChange)="openModal.set($event)"
            >
              <p class="text-body-md text-neutral-600">
                Esta acción no se puede deshacer. Revise los detalles antes de confirmar.
              </p>
              <div slot="footer">
                <button
                  type="button"
                  class="px-space-4 py-space-2 border border-border-hairline rounded-md text-body-sm hover:bg-surface-100"
                  (click)="openModal.set(false)"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  class="px-space-4 py-space-2 bg-action text-white rounded-md text-body-sm font-medium hover:bg-action-600"
                  (click)="openModal.set(false)"
                >
                  Confirmar
                </button>
              </div>
            </afi-modal>
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
            <li>Confirmación de acciones destructivas (eliminar, descartar cambios).</li>
            <li>Formularios cortos que no justifican una página nueva.</li>
            <li>Información crítica que requiere atención inmediata.</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Cuándo NO usar
          </h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>
              Contenido extenso o formularios largos — use
              <code class="font-mono">&lt;afi-drawer&gt;</code> o una página dedicada.
            </li>
            <li>Notificaciones no bloqueantes — use toast o banner.</li>
            <li>Modales anidados — nunca abra un modal desde otro modal.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Composiciones
          </h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            Modal de confirmación con dos botones (Cancelar / Confirmar). Modal de formulario con
            inputs y validación. Modal de alerta con un solo botón de aceptar.
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
              Usa <code class="font-mono text-action-700">&lt;dialog&gt;</code> nativo — focus trap
              y scroll lock incluidos.
            </li>
            <li>
              <code class="font-mono text-action-700">aria-labelledby</code> apunta al título del
              modal.
            </li>
            <li>
              <code class="font-mono text-action-700">aria-describedby</code> apunta a la
              descripción si existe.
            </li>
            <li>
              Botón de cerrar con
              <code class="font-mono text-action-700">aria-label="Cerrar"</code>.
            </li>
            <li>Al cerrar, el foco regresa al elemento que disparó la apertura.</li>
            <li>
              Esc cierra el modal por defecto (configurable con
              <code class="font-mono">closeOnEsc</code>).
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
                >Navega entre elementos focusables dentro del modal</span
              >
            </div>
            <div class="flex items-center gap-space-3">
              <kbd
                class="px-2 py-1 bg-neutral-100 border border-border-hairline rounded text-body-sm font-mono"
                >Esc</kbd
              >
              <span class="text-body-md text-neutral-600"
                >Cierra el modal (si closeOnEsc es true)</span
              >
            </div>
          </div>
        </section>

        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-6">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>Backdrop: fade-in nativo del <code class="font-mono">&lt;dialog&gt;</code>.</li>
            <li>
              Panel: aparición instantánea (sin animación adicional — el nativo es suficiente).
            </li>
            <li>Reduced motion: sin cambios necesarios (ya es instantáneo).</li>
          </ul>
        </section>

        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-6">Do & Don't</h2>
          <div class="space-y-space-4">
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">
                  Use modal para confirmaciones que requieren atención inmediata.
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Modal para contenido largo — use Drawer o página dedicada.
                </p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">Devolver foco al trigger al cerrar.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Anidar modales — confunde al usuario y al lector de pantalla.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class ModalPage {
  readonly size = signal<ModalSize>('md');
  readonly openModal = signal(false);
  readonly closeOnBackdrop = signal(false);
  readonly closeOnEsc = signal(true);

  readonly sizes = SIZES;
  readonly tokenRows = MODAL_TOKENS;

  readonly importCode = "import { ModalComponent } from '@coherence/ui/modal';";

  readonly realWorldCode = `<afi-modal
  [open]="confirmarEliminar()"
  title="Eliminar proyecto"
  description="Esta acción es irreversible."
  [closeOnBackdrop]="true"
  (openChange)="confirmarEliminar.set($event)"
  (closed)="onModalClosed($event)"
>
  <p>Se eliminarán todos los datos asociados al proyecto.</p>
  <div slot="footer">
    <button (click)="confirmarEliminar.set(false)">Cancelar</button>
    <button (click)="eliminarProyecto()">Eliminar</button>
  </div>
</afi-modal>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = [];
    props.push('  [open]="abierto()"');
    if (this.size() !== 'md') props.push(`  size="${this.size()}"`);
    props.push('  title="Confirmar acción"');
    if (this.closeOnBackdrop()) props.push('  [closeOnBackdrop]="true"');
    if (!this.closeOnEsc()) props.push('  [closeOnEsc]="false"');
    props.push('  (openChange)="abierto.set($event)"');

    return `<afi-modal\n${props.join('\n')}\n>\n  <!-- contenido -->\n</afi-modal>`;
  });

  readonly apiInputs = [
    { name: 'open', type: 'boolean', default: 'false', notes: 'Abre/cierra el modal' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", notes: 'Ancho máximo del panel' },
    { name: 'title', type: 'string | null', default: 'null', notes: 'Título del modal' },
    {
      name: 'description',
      type: 'string | null',
      default: 'null',
      notes: 'Descripción bajo el título',
    },
    { name: 'closeOnEsc', type: 'boolean', default: 'true', notes: 'Cierra con Esc' },
    {
      name: 'closeOnBackdrop',
      type: 'boolean',
      default: 'false',
      notes: 'Cierra al clic en backdrop',
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
    { name: 'closed', payload: "'esc' | 'backdrop' | 'button'", notes: 'Razón de cierre' },
  ];
}
