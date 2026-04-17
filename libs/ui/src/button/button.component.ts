import { ChangeDetectionStrategy, Component, computed, input, output, isDevMode } from '@angular/core';

import { baseClasses, variantClasses, sizeClasses, ButtonVariant, ButtonSize } from './button.variants';

/**
 * Primary action button primitive.
 *
 * Variants and sizes are driven by signal inputs; all styling uses
 * token-backed Tailwind classes (no hex/rgba/px). `size="sm"` (32 px) is a
 * desktop-dense opt-out — see `docs/accessibility.md` for touch-target guidance.
 */
@Component({
  selector: 'afi-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      [class]="classes()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading() ? 'true' : null"
      [attr.aria-label]="ariaLabel()"
      (click)="onClick($event)"
    >
      @if (iconStart()) {
        <ng-content select="[slot=iconStart]" />
      }
      @if (!loading()) {
        <ng-content />
      } @else {
        <span class="inline-block animate-spin" aria-hidden="true">⟳</span>
        <span class="sr-only">Cargando…</span>
      }
      @if (iconEnd()) {
        <ng-content select="[slot=iconEnd]" />
      }
    </button>
  `,
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

  readonly classes = computed(() =>
    [
      baseClasses,
      variantClasses[this.variant()],
      sizeClasses[this.size()],
      this.fullWidth() ? 'w-full' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

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
