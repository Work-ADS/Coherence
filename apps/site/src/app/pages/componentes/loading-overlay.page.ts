import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  LoadingOverlayComponent,
  CheckboxComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
  InputComponent,
} from '@coherence/ui';
import type { LoadingOverlayVariant } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const VARIANTS: LoadingOverlayVariant[] = ['quiet-spinner', 'line-reveal'];

const LO_TOKENS: TokenRow[] = [
  { property: 'Fondo overlay', token: 'var(--surface-quiet)', note: 'opacity 0.85' },
  { property: 'Spinner borde', token: 'var(--neutral-200)' },
  { property: 'Spinner acento', token: 'var(--action-500)' },
  { property: 'Barra line-reveal', token: 'var(--action-500)' },
  { property: 'Texto mensaje', token: 'var(--neutral-600)' },
  { property: 'Fade-in', token: 'var(--duration-fast) ease-out' },
  { property: 'Spinner spin', token: '700ms linear infinite' },
  { property: 'Barra grow', token: '400ms ease-out' },
];

@Component({
  selector: 'site-loading-overlay-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    LoadingOverlayComponent,
    CheckboxComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
    InputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Loading Overlay"
      subtitle="Indica al usuario que una operación está en curso. Dos variantes: spinner con overlay o barra de revelado progresivo."
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

            <!-- State toggles -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Estado</legend>
              <afi-checkbox
                [checked]="visible()"
                (checkedChange)="visible.set($event)"
                label="visible"
                size="sm"
                [compact]="true"
              />
              <afi-checkbox
                [checked]="blocking()"
                (checkedChange)="blocking.set($event)"
                label="blocking"
                size="sm"
                [compact]="true"
              />
            </fieldset>

            <!-- Message -->
            <div>
              <label class="font-medium text-canvas-fg mb-space-1 block text-body-sm"
                >Mensaje</label
              >
              <afi-input
                size="sm"
                [value]="message()"
                (valueChange)="message.set($event?.toString() ?? '')"
              />
            </div>

            <!-- Delay -->
            <div>
              <label class="font-medium text-canvas-fg mb-space-1 block text-body-sm"
                >Delay (ms)</label
              >
              <input
                type="number"
                [value]="delay()"
                (input)="onDelayInput($event)"
                min="0"
                step="100"
                class="w-full border border-border-hairline rounded-md px-2 py-1 text-body-sm"
              />
            </div>
          </div>

          <!-- Live preview -->
          <div slot="preview">
            <afi-loading-overlay
              [visible]="visible()"
              [variant]="variant()"
              [message]="message() || null"
              [blocking]="blocking()"
              [delay]="delay()"
            >
              <div
                class="p-space-6 border border-border-hairline rounded-md text-body-md text-neutral-600"
              >
                Contenido envuelto por el overlay. Active "visible" para ver el efecto.
              </div>
            </afi-loading-overlay>
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
            <li>Operaciones asíncronas que toman más de 300ms (carga de datos, guardado).</li>
            <li>Transiciones de página con carga progresiva (variante line-reveal).</li>
            <li>Bloquear interacción del usuario mientras se procesa una acción crítica.</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Cuándo NO usar
          </h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>
              Cargas instantáneas (&lt;300ms) — el delay evita flashes, pero no añada el componente
              si no es necesario.
            </li>
            <li>Carga de un elemento pequeño — use un skeleton o placeholder inline.</li>
            <li>
              Feedback de botón — use el estado loading del
              <code class="font-mono">&lt;afi-button&gt;</code>.
            </li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Composiciones
          </h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            Envuelve secciones de Card o Table para indicar carga parcial. Usa line-reveal en Shell
            para transiciones de página. Combina con delay para evitar flashes en cargas rápidas.
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
              Overlay tiene <code class="font-mono text-action-700">role="status"</code> y
              <code class="font-mono text-action-700">aria-live="polite"</code>.
            </li>
            <li>
              Host usa <code class="font-mono text-action-700">aria-busy="true"</code> mientras el
              overlay es visible.
            </li>
            <li>
              Spinner decorativo tiene
              <code class="font-mono text-action-700">aria-hidden="true"</code>.
            </li>
            <li>
              Si no hay mensaje visible, un
              <code class="font-mono text-action-700">sr-only</code> anuncia "Cargando…".
            </li>
            <li>
              Variante line-reveal: la barra es decorativa, el anuncio va en un status region
              oculto.
            </li>
          </ul>

          <h3 id="mapa-de-teclado" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Mapa de teclado
          </h3>
          <div class="space-y-space-3 mb-space-8">
            <p class="text-body-md text-neutral-600">
              No aplica: el componente es informativo, no interactivo. Cuando
              <code class="font-mono">blocking</code>
              es true, las interacciones dentro del contenedor se bloquean vía overlay.
            </p>
          </div>

          <h3 id="demostracion-lectora" class="text-body-md font-medium text-canvas-fg mb-space-4">
            Demostración lectora de pantalla
          </h3>
          <div
            class="p-space-4 bg-neutral-50 rounded-md border border-border-hairline space-y-space-4"
          >
            <afi-loading-overlay [visible]="true" [delay]="0" message="Guardando cambios…">
              <div class="p-space-4 text-body-sm text-neutral-400">Contenido bloqueado</div>
            </afi-loading-overlay>
            <code class="block text-body-sm font-mono text-neutral-600"
              >aria-busy="true" · role="status" · aria-live="polite"</code
            >
          </div>
        </section>

        <!-- Motion -->
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-6">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>
              Fade-in del overlay: <code class="font-mono">var(--duration-fast)</code> (150ms)
              ease-out.
            </li>
            <li>Spinner: 700ms rotación lineal infinita.</li>
            <li>Line-reveal barra: 400ms ease-out scaleX(0→1).</li>
            <li>Line-reveal contenido: 200ms ease-out fade-in con 400ms de retraso.</li>
            <li>Reduced motion: todas las animaciones colapsan a instantáneo.</li>
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
                  Use delay ≥ 300ms para evitar flashes en cargas rápidas.
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Mostrar spinner para operaciones &lt;300ms causa parpadeo molesto.
                </p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">
                  Line-reveal para transiciones de página completa.
                </p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">
                  Line-reveal para cargar un solo campo de formulario — demasiado dramático.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class LoadingOverlayPage {
  readonly variant = signal<LoadingOverlayVariant>('quiet-spinner');
  readonly visible = signal(false);
  readonly blocking = signal(true);
  readonly message = signal('Cargando datos…');
  readonly delay = signal(300);

  readonly variants = VARIANTS;
  readonly tokenRows = LO_TOKENS;

  readonly importCode = "import { LoadingOverlayComponent } from '@coherence/ui/loading-overlay';";

  readonly realWorldCode = `<afi-loading-overlay
  [visible]="cargando()"
  variant="quiet-spinner"
  message="Guardando cambios…"
  [delay]="300"
>
  <afi-card>…contenido…</afi-card>
</afi-loading-overlay>`;

  readonly codeSnippet = computed(() => {
    const props: string[] = [];
    props.push(`  [visible]="${this.visible()}"`);
    if (this.variant() !== 'quiet-spinner') props.push(`  variant="${this.variant()}"`);
    if (this.message()) props.push(`  message="${this.message()}"`);
    if (!this.blocking()) props.push('  [blocking]="false"');
    if (this.delay() !== 300) props.push(`  [delay]="${this.delay()}"`);

    return `<afi-loading-overlay\n${props.join('\n')}\n>\n  <!-- contenido -->\n</afi-loading-overlay>`;
  });

  readonly apiInputs = [
    {
      name: 'visible',
      type: 'boolean',
      default: 'false',
      notes: 'Muestra/oculta el overlay (con delay)',
    },
    {
      name: 'variant',
      type: "'quiet-spinner' | 'line-reveal'",
      default: "'quiet-spinner'",
      notes: 'Estilo visual',
    },
    {
      name: 'message',
      type: 'string | null',
      default: 'null',
      notes: 'Texto visible bajo el spinner',
    },
    {
      name: 'blocking',
      type: 'boolean',
      default: 'true',
      notes: 'Bloquea interacción del contenido',
    },
    {
      name: 'delay',
      type: 'number',
      default: '300',
      notes: 'Milisegundos antes de mostrar (evita flash)',
    },
  ];

  readonly apiOutputs = [
    {
      name: 'visibleChange',
      payload: 'boolean',
      notes: 'Emitido cuando el overlay se muestra u oculta',
    },
  ];

  onDelayInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.delay.set(Number(target.value) || 0);
  }
}
