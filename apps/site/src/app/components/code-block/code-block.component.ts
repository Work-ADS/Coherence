import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

/**
 * Syntax-highlighted code block with copy button.
 * Used in Importar, Ejemplo real, and inside <afi-component-playground>.
 *
 * Highlighting: plain <pre><code> with dark bg for v1.
 * highlight.js integration deferred to v1.1.
 */
@Component({
  selector: 'afi-code-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-lg border border-border-hairline overflow-hidden bg-surface-quiet">
      <!-- Header bar: filename (or language) + copy button -->
      <div class="flex items-center justify-between px-space-4 py-space-2 border-b border-border-hairline">
        <span class="text-body-sm font-mono text-neutral-400">{{ filename() ?? language() }}</span>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-space-2 py-space-1 rounded text-body-sm text-neutral-400
                 hover:text-canvas-fg hover:bg-surface-muted transition-colors duration-fast
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          [attr.aria-label]="copyAriaLabel()"
          (click)="onCopy()"
        >
          @if (copied()) {
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 aria-hidden="true">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 aria-hidden="true">
              <rect width="14" height="14" x="8" y="8" rx="2"/>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
            </svg>
          }
        </button>
      </div>
      <!-- Code area -->
      <pre
        class="overflow-x-auto p-space-5 text-body-sm font-mono leading-relaxed text-canvas-fg"
        [attr.aria-label]="'Bloque de código' + (language() !== 'html' ? ' (' + language() + ')' : '')"
      ><code>{{ code() }}</code></pre>
    </div>
  `,
})
export class CodeBlockComponent {
  readonly code = input.required<string>();
  readonly language = input<'html' | 'ts' | 'css' | 'json' | 'bash'>('html');
  readonly filename = input<string | null>(null);
  readonly copyLabel = input<string>('Copiar');

  readonly copied = signal(false);

  readonly copyButtonText = computed(() =>
    this.copied() ? '✓ Copiado' : this.copyLabel(),
  );

  readonly copyAriaLabel = computed(() =>
    this.copied() ? 'Copiado' : this.copyLabel(),
  );

  onCopy(): void {
    navigator.clipboard.writeText(this.code()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
