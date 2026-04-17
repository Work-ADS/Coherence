import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { BadgeComponent } from '@coherence/ui';
import type { BadgeIntent, BadgeSize } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const INTENTS: BadgeIntent[] = ['neutral', 'info', 'success', 'warning', 'error'];
const SIZES: BadgeSize[] = ['sm', 'md'];

const BADGE_TOKENS: TokenRow[] = [
  { property: 'Fondo (neutral)', token: 'var(--neutral-200)' },
  { property: 'Texto (neutral)', token: 'var(--neutral-800)' },
  { property: 'Fondo (info)', token: 'var(--action-100)' },
  { property: 'Texto (info)', token: 'var(--action-700)' },
  { property: 'Fondo (success)', token: 'var(--system-success-bg)' },
  { property: 'Fondo (warning)', token: 'var(--system-warning-bg)' },
  { property: 'Fondo (error)', token: 'var(--system-error-bg)' },
  { property: 'Altura (sm/md)', token: 'h-5, h-6' },
  { property: 'Radio', token: 'rounded-full' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
];

@Component({
  selector: 'app-badge-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    BadgeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Badge"
      subtitle="Indicador numérico o de estado que se superpone sobre otro elemento."
      docsSource="docs/build-prompts/coherence-badge.md"
      buildPromptSlug="coherence-badge"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">

        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <!-- Intent -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Intención</legend>
              @for (i of intents; track i) {
                <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                  <input
                    type="radio"
                    name="intent"
                    [value]="i"
                    [checked]="intent() === i"
                    (change)="intent.set(i)"
                    class="accent-action"
                  />
                  {{ i }}
                </label>
              }
            </fieldset>

            <!-- Size -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Tamaño</legend>
              @for (s of sizes; track s) {
                <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                  <input
                    type="radio"
                    name="size"
                    [value]="s"
                    [checked]="size() === s"
                    (change)="size.set(s)"
                    class="accent-action"
                  />
                  {{ s }}
                </label>
              }
            </fieldset>

            <!-- Dot mode -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Modo</legend>
              <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                <input type="checkbox" [checked]="dot()" (change)="dot.set(!dot())" class="accent-action" />
                dot (solo indicador)
              </label>
            </fieldset>

            <!-- Label -->
            <div>
              <label class="font-medium text-canvas-fg mb-space-1 block text-body-sm">Contenido</label>
              <input
                type="text"
                [value]="content()"
                (input)="onContentInput($event)"
                class="w-full border border-border-hairline rounded-md px-2 py-1 text-body-sm"
              />
            </div>
          </div>

          <!-- Live preview -->
          <div slot="preview" class="flex items-center gap-space-4">
            <afi-badge
              [intent]="intent()"
              [size]="size()"
              [dot]="dot()"
            >{{ content() }}</afi-badge>
          </div>
        </afi-component-playground>

        <!-- Importar -->
        <section>
          <h2 id="importar" class="text-section text-canvas-fg mb-space-4">Importar</h2>
          <afi-code-block
            [code]="importCode"
            language="ts"
          />
        </section>

        <!-- Uso -->
        <section>
          <h2 id="uso" class="text-section text-canvas-fg mb-space-4">Uso</h2>

          <h3 id="cuando-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Mostrar contadores de notificaciones o elementos pendientes.</li>
            <li>Indicar el estado de un recurso (activo, advertencia, error).</li>
            <li>Etiquetar categorías o niveles dentro de tablas y listas.</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo NO usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Acciones interactivas — use Button o Chip.</li>
            <li>Texto extenso — el badge es para contenido breve (1-3 palabras o números).</li>
            <li>Decoración sin significado semántico — no use badge solo por estética.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-3">Composiciones</h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            Badge dentro de NavItem para notificaciones. Badge dot junto a un avatar para estado en línea. Badge en columnas de DataTable para categorizar filas.
          </p>

          <h3 id="ejemplo-real" class="text-body-md font-medium text-canvas-fg mb-space-3">Ejemplo real</h3>
          <afi-code-block
            [code]="realWorldCode"
            language="html"
          />
        </section>

        <!-- API Reference -->
        <section>
          <h2 id="api-reference" class="text-section text-canvas-fg mb-space-4">API Reference</h2>

          <h3 id="entradas" class="text-body-md font-medium text-canvas-fg mb-space-3">Entradas</h3>
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

          <h3 id="salidas" class="text-body-md font-medium text-canvas-fg mb-space-3">Salidas</h3>
          <p class="text-body-md text-neutral-500">Este componente no emite eventos.</p>
        </section>
      </div>

      <!-- ==================== DESIGN TAB ==================== -->
      <div slot="design-tab">

        <!-- Tokens consumidos -->
        <section>
          <h2 id="tokens-consumidos" class="text-section text-canvas-fg mb-space-4">Tokens consumidos</h2>
          <afi-tokens-table [rows]="tokenRows" title="" />
        </section>

        <!-- Accesibilidad -->
        <section>
          <h2 id="accesibilidad" class="text-section text-canvas-fg mb-space-4">Accesibilidad</h2>

          <h3 id="reglas" class="text-body-md font-medium text-canvas-fg mb-space-3">Reglas</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>El badge usa <code class="font-mono text-action-700">role="status"</code> para anunciar cambios a lectores de pantalla.</li>
            <li>En modo dot, proporcione <code class="font-mono text-action-700">ariaLabel</code> para comunicar el significado del indicador.</li>
            <li>El contraste de color cumple WCAG AA en todas las variantes de intención.</li>
            <li>No dependa únicamente del color para comunicar el estado — acompañe con texto o icono.</li>
          </ul>

          <h3 id="mapa-de-teclado" class="text-body-md font-medium text-canvas-fg mb-space-3">Mapa de teclado</h3>
          <div class="space-y-space-3 mb-space-8">
            <p class="text-body-md text-neutral-600">El badge no es interactivo, por lo tanto no recibe foco de teclado.</p>
          </div>

          <h3 id="demostracion-lectora" class="text-body-md font-medium text-canvas-fg mb-space-3">Demostración lectora de pantalla</h3>
          <div class="flex items-center gap-space-6 p-space-4 bg-neutral-50 rounded-md border border-border-hairline">
            <afi-badge intent="error" ariaLabel="3 errores pendientes">3</afi-badge>
            <code class="text-body-sm font-mono text-neutral-600">role="status" · "3 errores pendientes"</code>
          </div>
        </section>

        <!-- Motion -->
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-4">Motion</h2>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-6">
            <li>Transición de propiedades: <code class="font-mono">var(--duration-fast)</code> (150ms) <code class="font-mono">ease-out</code></li>
            <li>Aplica a cambios de color e intención al actualizar dinámicamente.</li>
            <li>Reduced motion: transiciones colapsan a instantáneo.</li>
          </ul>
          <div class="flex items-center gap-space-4 p-space-4 bg-neutral-50 rounded-md border border-border-hairline">
            <afi-badge intent="info">Nuevo</afi-badge>
            <afi-badge intent="success">Activo</afi-badge>
            <afi-badge intent="warning">Pendiente</afi-badge>
            <afi-badge intent="error">Error</afi-badge>
            <span class="text-body-sm text-neutral-500">Variantes de intención con transición suave.</span>
          </div>
        </section>

        <!-- Do & Don't -->
        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do & Don't</h2>
          <div class="space-y-space-4">
            <!-- Pair 1 -->
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <div class="mb-space-2"><afi-badge intent="error">3</afi-badge></div>
                <p class="text-body-sm text-neutral-600">Contenido breve y numérico para contadores.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <div class="mb-space-2"><afi-badge intent="error">Hay 3 errores en el formulario</afi-badge></div>
                <p class="text-body-sm text-neutral-600">Texto largo desborda el badge. Use un mensaje aparte.</p>
              </div>
            </div>

            <!-- Pair 2 -->
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <div class="mb-space-2 flex gap-2">
                  <afi-badge intent="success">Activo</afi-badge>
                  <afi-badge intent="error">Inactivo</afi-badge>
                </div>
                <p class="text-body-sm text-neutral-600">Usar intención semántica acorde al significado.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <div class="mb-space-2 flex gap-2">
                  <afi-badge intent="success">Inactivo</afi-badge>
                  <afi-badge intent="error">Activo</afi-badge>
                </div>
                <p class="text-body-sm text-neutral-600">Intención invertida confunde al usuario.</p>
              </div>
            </div>

            <!-- Pair 3 -->
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <div class="mb-space-2"><afi-badge intent="error" [dot]="true" ariaLabel="Tiene errores" /></div>
                <p class="text-body-sm text-neutral-600">Dot con ariaLabel para lectores de pantalla.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <div class="mb-space-2"><afi-badge intent="error" [dot]="true" /></div>
                <p class="text-body-sm text-neutral-600">Dot sin ariaLabel es invisible para lectores de pantalla.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class BadgePage {
  readonly intent = signal<BadgeIntent>('neutral');
  readonly size = signal<BadgeSize>('md');
  readonly dot = signal(false);
  readonly content = signal('5');

  readonly intents = INTENTS;
  readonly sizes = SIZES;
  readonly tokenRows = BADGE_TOKENS;

  readonly importCode = "import { BadgeComponent } from '@coherence/ui/badge';";

  readonly realWorldCode = `<afi-badge
  intent="error"
  size="sm"
  ariaLabel="3 alertas pendientes">
  3
</afi-badge>`;

  readonly codeSnippet = computed(() => {
    if (this.dot()) {
      const props: string[] = [];
      if (this.intent() !== 'neutral') props.push(`  intent="${this.intent()}"`);
      props.push('  [dot]="true"');
      props.push('  ariaLabel="Estado indicador"');
      return `<afi-badge\n${props.join('\n')}\n/>`;
    }

    const props: string[] = [];
    if (this.intent() !== 'neutral') props.push(`  intent="${this.intent()}"`);
    if (this.size() !== 'md') props.push(`  size="${this.size()}"`);

    const propsStr = props.length ? '\n' + props.join('\n') + '\n' : '';
    return `<afi-badge${propsStr ? propsStr : ' '}>\n  ${this.content()}\n</afi-badge>`;
  });

  readonly apiInputs = [
    { name: 'intent', type: "'neutral' | 'info' | 'success' | 'warning' | 'error'", default: "'neutral'", notes: 'Intención semántica del color' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", notes: 'Tamaño del badge' },
    { name: 'dot', type: 'boolean', default: 'false', notes: 'Modo indicador sin texto (solo punto)' },
    { name: 'icon', type: 'string | null', default: 'null', notes: 'Icono antes del contenido' },
    { name: 'ariaLabel', type: 'string | null', default: 'null', notes: 'Etiqueta accesible (requerida en modo dot)' },
  ];

  onContentInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.content.set(target.value);
  }
}
