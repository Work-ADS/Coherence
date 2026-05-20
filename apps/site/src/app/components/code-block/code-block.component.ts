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
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.scss',
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
