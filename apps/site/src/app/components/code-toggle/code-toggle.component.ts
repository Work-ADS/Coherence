import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';

/**
 * Pill-toggle that swaps between a preview slot and a syntax-highlighted code block.
 * Used by <afi-component-playground> and standalone on other site pages.
 */
@Component({
  selector: 'afi-code-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-lg border border-border-hairline overflow-hidden">
      <!-- Top bar: pill toggle + copy button -->
      <div class="flex items-center justify-between px-space-4 py-space-2 border-b border-border-hairline bg-neutral-50/60">
        <div class="flex" role="tablist" aria-label="Alternar vista">
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="!showCode()"
            class="px-space-3 py-space-1 text-body-sm rounded-l-md border border-border-hairline transition-colors duration-fast"
            [class.bg-white]="!showCode()"
            [class.text-canvas-fg]="!showCode()"
            [class.font-medium]="!showCode()"
            [class.text-neutral-400]="showCode()"
            [class.bg-transparent]="showCode()"
            [class.border-transparent]="showCode()"
            (click)="showCode.set(false)"
          >Vista previa</button>
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="showCode()"
            class="px-space-3 py-space-1 text-body-sm rounded-r-md border border-border-hairline -ml-px transition-colors duration-fast"
            [class.bg-white]="showCode()"
            [class.text-canvas-fg]="showCode()"
            [class.font-medium]="showCode()"
            [class.text-neutral-400]="!showCode()"
            [class.bg-transparent]="!showCode()"
            [class.border-transparent]="!showCode()"
            (click)="showCode.set(true)"
          >Código</button>
        </div>

        @if (showCode()) {
          <button
            type="button"
            class="px-2 py-1 rounded text-body-sm text-neutral-500 hover:bg-neutral-100 transition-colors duration-fast"
            [attr.aria-label]="'Copiar código'"
            (click)="copyCode()"
          >{{ copied() ? '✓ Copiado' : 'Copiar' }}</button>
        }
      </div>

      <!-- Content area -->
      @if (!showCode()) {
        <div class="p-space-8 bg-white">
          <ng-content />
        </div>
      } @else {
        @if (filename()) {
          <p class="text-body-sm text-neutral-500 px-space-4 pt-space-3 font-mono">{{ filename() }}</p>
        }
        <pre
          class="overflow-x-auto p-space-5 text-body-sm font-mono text-canvas-fg leading-relaxed bg-neutral-900 text-neutral-100"
          aria-label="Código de ejemplo"
        ><code>{{ code() }}</code></pre>
      }
    </div>

    <span class="sr-only" aria-live="polite">Vista: {{ showCode() ? 'Código' : 'Vista previa' }}</span>
  `,
})
export class CodeToggleComponent {
  readonly code = input.required<string>();
  readonly language = input<string>('html');
  readonly filename = input<string | null>(null);

  readonly showCode = signal(false);
  readonly copied = signal(false);

  copyCode(): void {
    navigator.clipboard.writeText(this.code()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
