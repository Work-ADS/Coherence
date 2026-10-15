import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit,
  computed,
  ElementRef,
  inject,
  input,
  isDevMode,
  output,
} from '@angular/core';

import { IconComponent } from '../icon';

import type { ButtonSize, ButtonVariant } from './button.variants';

/**
 * Primary action button primitive.
 *
 * Variants and sizes are driven by signal inputs; all visual styling lives
 * in `button.component.scss` using BEM classes + DS tokens. The template
 * binds a single BEM class string computed from the inputs.
 *
 * Sizes sit on the chrome scale (24 to 40 px); the `touch-area` mixin keeps
 * the hit area at 44 px, see `docs/rules/accessibility.md` rule 7. `iconStart` and
 * `iconEnd` are flags: set one and project the glyph into `slot="iconStart"` or
 * `slot="iconEnd"` (an `afi-icon` or an svg). Consumers bind them today, so the
 * gate stays until they move to icon names.
 */
@Component({
  selector: 'afi-button',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements AfterViewInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

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

    this.clicked.emit({ event });
  }

  /** Dev-only: an icon-only button needs an accessible name. Reads the rendered
   *  text once, which is the only way to see projected content. */
  ngAfterViewInit(): void {
    if (!isDevMode() || this.ariaLabel()) return;
    const text = this.host.nativeElement.textContent?.replace('Cargando…', '').trim();
    if (!text) {
      console.warn(
        '[afi-button] Icon-only button detected without ariaLabel. ' +
          'Provide an ariaLabel input for accessibility.',
      );
    }
  }
}
