import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { KbdComponent } from '@coherence/ui';
import type { KbdSize, KbdSeparator } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const SIZES: KbdSize[] = ['sm', 'md'];
const SEPARATORS: KbdSeparator[] = ['none', 'plus', 'arrow'];

const KBD_TOKENS: TokenRow[] = [
  { property: 'Fondo tecla', token: 'var(--surface-muted)' },
  { property: 'Borde tecla', token: 'var(--border-hairline)' },
  { property: 'Texto', token: 'var(--canvas-fg)' },
  { property: 'Radio', token: 'rounded-sm (2px)' },
  { property: 'Tipografía', token: 'font-mono' },
  { property: 'Altura (sm)', token: 'h-5 (20px)' },
  { property: 'Altura (md)', token: 'h-6 (24px)' },
];

const PRESETS: { label: string; keys: string[] }[] = [
  { label: '⌘ K', keys: ['⌘', 'K'] },
  { label: 'Ctrl+Shift+P', keys: ['Ctrl', '⇧', 'P'] },
  { label: 'Enter', keys: ['↵'] },
  { label: 'Esc', keys: ['⎋'] },
  { label: 'Arrow keys', keys: ['↑', '↓', '←', '→'] },
];

@Component({
  selector: 'site-kbd-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    KbdComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Kbd"
      subtitle="Keycap visual para atajos de teclado. Solo presentación, sin interacción."
      docsSource="docs/build-prompts/coherence-kbd.md"
      buildPromptSlug="coherence-kbd"
    >
      <!-- ==================== CODE TAB ==================== -->
      <div slot="code-tab">

        <!-- Playground -->
        <afi-component-playground [code]="codeSnippet()">
          <div slot="controls" class="space-y-space-4">
            <!-- Preset -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Preset</legend>
              @for (p of presets; track p.label) {
                <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                  <input
                    type="radio"
                    name="preset"
                    [value]="p.label"
                    [checked]="presetLabel() === p.label"
                    (change)="selectPreset(p)"
                    class="accent-action"
                  />
                  {{ p.label }}
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

            <!-- Separator -->
            <fieldset>
              <legend class="font-medium text-canvas-fg mb-space-1 text-body-sm">Separador</legend>
              @for (sep of separators; track sep) {
                <label class="flex items-center gap-2 py-0.5 cursor-pointer text-body-sm">
                  <input
                    type="radio"
                    name="separator"
                    [value]="sep"
                    [checked]="separator() === sep"
                    (change)="separator.set(sep)"
                    class="accent-action"
                  />
                  {{ sep }}
                </label>
              }
            </fieldset>
          </div>

          <!-- Live preview -->
          <div slot="preview" class="flex items-center gap-space-4">
            <afi-kbd
              [keys]="keys()"
              [size]="size()"
              [separator]="separator()"
            />
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
            <li>Indicar atajos de teclado en menús contextuales (<code class="font-mono">⌘ K</code>).</li>
            <li>Buscadores y command palettes como indicador de activación.</li>
            <li>Documentación: sección "Mapa de teclado" de cada primitivo.</li>
            <li>Prosa inline: "Pulse <code class="font-mono">&lt;afi-kbd&gt;</code> para abrir el buscador."</li>
          </ul>

          <h3 id="cuando-no-usar" class="text-body-md font-medium text-canvas-fg mb-space-3">Cuándo NO usar</h3>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2 mb-space-8">
            <li>Etiquetas de botones — los botones no son teclas.</li>
            <li>Badges genéricos — use Badge.</li>
            <li>Iconos o glifos no relacionados con entrada de teclado.</li>
          </ul>

          <h3 id="composiciones" class="text-body-md font-medium text-canvas-fg mb-space-3">Composiciones</h3>
          <p class="text-body-md text-neutral-600 mb-space-8">
            Kbd dentro de MenuItem como indicador de shortcut. Kbd junto al campo de búsqueda (patrón ⌘K).
            Kbd en la sección "Mapa de teclado" de páginas de documentación.
          </p>

          <h3 id="ejemplo-real" class="text-body-md font-medium text-canvas-fg mb-space-3">Ejemplo real</h3>
          <afi-code-block
            [code]="realWorldCode"
            language="html"
          />
        </section>

        <!-- Gallery -->
        <section>
          <h2 id="galeria" class="text-section text-canvas-fg mb-space-4">Galería</h2>
          <div class="space-y-space-4">
            <div class="flex items-center gap-space-6">
              <afi-kbd [keys]="['⌘', 'K']" />
              <span class="text-body-sm text-neutral-500">Abrir búsqueda</span>
            </div>
            <div class="flex items-center gap-space-6">
              <afi-kbd [keys]="['Ctrl', '⇧', 'P']" separator="plus" />
              <span class="text-body-sm text-neutral-500">Command palette</span>
            </div>
            <div class="flex items-center gap-space-6">
              <afi-kbd [keys]="['↑', '↓']" />
              <span class="text-body-sm text-neutral-500">Navegar opciones</span>
            </div>
            <div class="flex items-center gap-space-6">
              <afi-kbd [keys]="['↵']" />
              <span class="text-body-sm text-neutral-500">Confirmar selección</span>
            </div>
            <div class="flex items-center gap-space-6">
              <afi-kbd [keys]="['⎋']" />
              <span class="text-body-sm text-neutral-500">Cerrar / cancelar</span>
            </div>
          </div>
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
            <li>Cada tecla usa <code class="font-mono text-action-700">&lt;kbd&gt;</code> nativo (HTML5 semántico).</li>
            <li>El wrapper usa <code class="font-mono text-action-700">role="group"</code> para agrupar teclas como un acorde.</li>
            <li>El <code class="font-mono text-action-700">aria-label</code> se genera automáticamente: "Atajo de teclado: ⌘ más K".</li>
            <li>Los separadores son <code class="font-mono text-action-700">aria-hidden="true"</code>.</li>
            <li>No es enfocable (display-only, sin <code class="font-mono">tabindex</code>).</li>
          </ul>

          <h3 id="glosario-sr" class="text-body-md font-medium text-canvas-fg mb-space-3">Glosario para lectora de pantalla</h3>
          <div class="overflow-x-auto rounded-lg border border-border-hairline mb-space-8">
            <table class="w-full text-body-sm">
              <thead>
                <tr class="bg-neutral-50 border-b border-border-hairline">
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Símbolo</th>
                  <th class="text-left px-space-4 py-space-3 font-medium text-neutral-500">Anuncio SR</th>
                </tr>
              </thead>
              <tbody>
                @for (entry of glossary; track entry.symbol) {
                  <tr class="border-b border-border-hairline last:border-b-0">
                    <td class="px-space-4 py-space-3 font-mono">{{ entry.symbol }}</td>
                    <td class="px-space-4 py-space-3 text-neutral-500">{{ entry.spoken }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>

        <!-- Motion -->
        <section>
          <h2 id="motion" class="text-section text-canvas-fg mb-space-4">Motion</h2>
          <p class="text-body-md text-neutral-600">
            Sin animaciones. Display-only. Reduced motion: sin cambios necesarios.
          </p>
        </section>

        <!-- Do & Don't -->
        <section>
          <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do & Don't</h2>
          <div class="space-y-space-4">
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <div class="mb-space-2"><afi-kbd [keys]="['⌘', 'K']" /></div>
                <p class="text-body-sm text-neutral-600">Usar símbolos Unicode estándar para teclas modificadoras.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <div class="mb-space-2"><span class="font-mono text-body-sm">Cmd+K</span></div>
                <p class="text-body-sm text-neutral-600">Texto plano sin keycap visual pierde la affordance de teclado.</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-space-4">
              <div class="p-space-4 border border-system-success rounded-md">
                <p class="text-body-sm font-medium text-system-success mb-space-2">Correcto</p>
                <p class="text-body-sm text-neutral-600">Kbd dentro de MenuItem para indicar shortcut.</p>
              </div>
              <div class="p-space-4 border border-system-error rounded-md">
                <p class="text-body-sm font-medium text-system-error mb-space-2">Incorrecto</p>
                <p class="text-body-sm text-neutral-600">Kbd como label de un botón — los botones no son teclas.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class KbdPage {
  readonly size = signal<KbdSize>('sm');
  readonly separator = signal<KbdSeparator>('none');
  readonly keys = signal<string[]>(['⌘', 'K']);
  readonly presetLabel = signal('⌘ K');

  readonly sizes = SIZES;
  readonly separators = SEPARATORS;
  readonly presets = PRESETS;
  readonly tokenRows = KBD_TOKENS;

  readonly importCode = "import { KbdComponent } from '@coherence/ui/kbd';";

  readonly realWorldCode = `<!-- Dentro de un MenuItem -->
<afi-menu-item label="Buscar">
  <afi-kbd slot="shortcut" [keys]="['⌘', 'K']" />
</afi-menu-item>

<!-- Junto al campo de búsqueda -->
<div class="flex items-center gap-2">
  <input placeholder="Buscar..." />
  <afi-kbd [keys]="['⌘', 'K']" />
</div>`;

  readonly codeSnippet = computed(() => {
    const keysStr = JSON.stringify(this.keys());
    const props: string[] = [`  [keys]="${keysStr}"`];
    if (this.size() !== 'sm') props.push(`  size="${this.size()}"`);
    if (this.separator() !== 'none') props.push(`  separator="${this.separator()}"`);
    return `<afi-kbd\n${props.join('\n')}\n/>`;
  });

  readonly apiInputs = [
    { name: 'keys', type: 'string[]', default: '(required)', notes: 'Cada string es UNA tecla. Acepta símbolos Unicode.' },
    { name: 'size', type: "'sm' | 'md'", default: "'sm'", notes: 'sm = 20px, md = 24px' },
    { name: 'separator', type: "'none' | 'plus' | 'arrow'", default: "'none'", notes: 'Carácter entre teclas: nada / + / →' },
    { name: 'ariaLabel', type: 'string | null', default: 'null', notes: 'Sobrescribe el aria-label auto-generado' },
  ];

  readonly glossary = [
    { symbol: '⌘', spoken: 'Comando' },
    { symbol: 'Ctrl', spoken: 'Control' },
    { symbol: '⇧', spoken: 'Mayús' },
    { symbol: '⌥', spoken: 'Opción' },
    { symbol: '↵', spoken: 'Intro' },
    { symbol: '⌫', spoken: 'Retroceso' },
    { symbol: '⎋', spoken: 'Escape' },
    { symbol: '↑↓←→', spoken: 'Flecha arriba/abajo/izquierda/derecha' },
    { symbol: '⇥', spoken: 'Tabulador' },
    { symbol: 'Space', spoken: 'Espacio' },
  ];

  selectPreset(p: { label: string; keys: string[] }): void {
    this.presetLabel.set(p.label);
    this.keys.set(p.keys);
  }
}
