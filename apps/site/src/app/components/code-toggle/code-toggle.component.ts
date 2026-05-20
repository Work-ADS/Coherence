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
  templateUrl: './code-toggle.component.html',
  styleUrl: './code-toggle.component.scss',
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
