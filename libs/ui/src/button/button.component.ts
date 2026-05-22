import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  isDevMode,
  output,
} from '@angular/core';

import type { ButtonSize, ButtonVariant } from './button.variants';

/**
 * Primary action button primitive.
 *
 * Variants and sizes are driven by signal inputs; all visual styling lives
 * in `button.component.scss` using BEM classes + DS tokens. The template
 * binds a single BEM class string computed from the inputs.
 *
 * `size="sm"` (32 px) is a desktop-dense opt-out — see `docs/accessibility.md`
 * for touch-target guidance.
 */
@Component({
  selector: 'afi-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly iconStart = input<string | null>(null);
  readonly iconEnd = input<string | null>(null);
  readonly fullWidth = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly clicked = output<{ event: MouseEvent }>();

  readonly classes = computed(() => {
    const parts = [
      'btn',
      `btn--${this.variant()}`,
      `btn--${this.size()}`,
    ];
    if (this.fullWidth()) parts.push('btn--full');
    if (this.loading()) parts.push('btn--loading');
    return parts.join(' ');
  });

  onClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      return;
    }

    if (isDevMode()) {
      this.warnMissingLabel();
    }

    this.clicked.emit({ event });
  }

  private warnMissingLabel(): void {
    if ((this.iconStart() || this.iconEnd()) && !this.ariaLabel()) {
      console.warn(
        '[afi-button] Icon-only button detected without ariaLabel. ' +
          'Provide an ariaLabel input for accessibility.',
      );
    }
  }
}
