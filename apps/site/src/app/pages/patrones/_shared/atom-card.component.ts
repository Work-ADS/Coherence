import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent, BadgeComponent } from '@coherence/ui';

import type { PrimitiveRef } from './primitives-used.component';

export type FigmaAttr = {
  readonly key: string;
  readonly value: string;
};

export type AtomSpec = {
  readonly number: number;
  readonly name: string;
  readonly description?: string;
  readonly backingPrimitives: readonly PrimitiveRef[];
  readonly figmaAttrs: readonly FigmaAttr[];
  readonly codeSnippet: string;
};

@Component({
  selector: 'site-atom-card',
  standalone: true,
  imports: [RouterLink, ButtonComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="rounded-md border border-border-hairline bg-surface-elevated overflow-hidden"
      [attr.aria-labelledby]="headingId()"
    >
      <header
        class="flex items-start gap-space-4 border-b border-border-hairline px-space-5 py-space-4 bg-surface-quiet"
      >
        <span
          class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-action text-white text-body-md font-semibold shrink-0"
          aria-hidden="true"
        >
          {{ atom().number }}
        </span>

        <div class="min-w-0 flex-1">
          <h3 [id]="headingId()" class="text-body-md font-medium text-canvas-fg">
            {{ atom().name }}
          </h3>
          @if (atom().description; as d) {
            <p class="text-body-sm text-neutral-500 mt-space-1">{{ d }}</p>
          }
          @if (atom().backingPrimitives.length > 0) {
            <div class="flex items-center gap-space-2 flex-wrap mt-space-3">
              <span class="text-caption uppercase tracking-wider text-neutral-500">
                Primitivo
              </span>
              @for (p of atom().backingPrimitives; track p.slug) {
                @if (p.status === 'missing') {
                  <span
                    class="inline-flex items-center gap-space-2 rounded border border-dashed border-system-warning px-space-2 py-space-1 text-body-sm font-mono text-system-warning"
                    [attr.title]="p.note ?? 'Primitivo aún no construido — bloqueante.'"
                  >
                    &lt;{{ p.name }}&gt;
                    <afi-badge size="sm" intent="warning">faltante</afi-badge>
                  </span>
                } @else {
                  <a
                    [routerLink]="'/primitivos/' + p.slug"
                    class="inline-flex items-center gap-space-2 rounded border border-border-hairline bg-surface-elevated px-space-2 py-space-1 text-body-sm font-mono text-canvas-fg hover:border-action hover:text-action transition-colors"
                    [attr.title]="p.note ?? null"
                  >
                    &lt;{{ p.name }}&gt;
                    @if (p.status === 'partial') {
                      <afi-badge size="sm" intent="info">extender</afi-badge>
                    }
                  </a>
                }
              }
            </div>
          }
        </div>

        <afi-button
          variant="ghost"
          size="sm"
          ariaLabel="Copiar atributos de Figma al portapapeles"
          (clicked)="copyAttrs()"
        >
          @if (justCopied()) {
            <span aria-hidden="true">✓</span> Copiado
          } @else {
            <span aria-hidden="true">⧉</span> Copiar
          }
        </afi-button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-hairline">
        <div class="bg-surface-elevated px-space-5 py-space-4">
          <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3">
            Atributos Figma
          </p>
          @if (atom().figmaAttrs.length === 0) {
            <p class="text-body-sm text-neutral-500 italic">Pendiente de enumerar.</p>
          } @else {
            <dl class="grid grid-cols-[max-content_1fr] gap-x-space-4 gap-y-space-2">
              @for (a of atom().figmaAttrs; track a.key) {
                <dt class="text-body-sm text-neutral-500 font-mono">{{ a.key }}</dt>
                <dd class="text-body-sm text-canvas-fg font-mono">{{ a.value }}</dd>
              }
            </dl>
          }
        </div>

        <div class="bg-surface-elevated px-space-5 py-space-4">
          <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3">
            Código
          </p>
          @if (atom().codeSnippet.length === 0) {
            <p class="text-body-sm text-neutral-500 italic">Pendiente de redactar.</p>
          } @else {
            <pre
              class="text-body-sm font-mono text-canvas-fg bg-surface-quiet rounded p-space-3 overflow-x-auto whitespace-pre"
            ><code>{{ atom().codeSnippet }}</code></pre>
          }
        </div>
      </div>
    </article>
  `,
})
export class AtomCardComponent {
  readonly atom = input.required<AtomSpec>();

  protected readonly justCopied = signal(false);

  private static counter = 0;
  private readonly cardId = `atom-card-${++AtomCardComponent.counter}`;
  protected readonly headingId = computed(() => `${this.cardId}-heading`);

  protected async copyAttrs(): Promise<void> {
    const a = this.atom();
    const lines = a.figmaAttrs.map((attr) => `${attr.key}: ${attr.value}`);
    const text = `# ${a.number}. ${a.name}\n${lines.join('\n')}`;
    try {
      await navigator.clipboard.writeText(text);
      this.justCopied.set(true);
      setTimeout(() => this.justCopied.set(false), 1800);
    } catch {
      // Clipboard API may be unavailable in non-secure contexts; fail quietly.
    }
  }
}
