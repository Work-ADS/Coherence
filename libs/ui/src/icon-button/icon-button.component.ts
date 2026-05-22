import { ChangeDetectionStrategy, Component, computed, input, output, ViewEncapsulation } from '@angular/core';
import { IconButtonVariant, IconButtonVariantLegacy, IconButtonSize } from './icon-button.variants';

/**
 * Icon Button — a square interactive button containing only an icon.
 *
 * Accessibility: `ariaLabel` is REQUIRED.
 *
 * `wide` opts out of the fixed-square footprint when the projected content
 * needs more room (e.g. a dual-icon trigger). Width becomes auto with
 * horizontal padding. Orthogonal to `size` — works with sm/md/lg.
 */
@Component({
  selector: 'afi-icon-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
})
export class IconButtonComponent {
  readonly variant = input<IconButtonVariant | IconButtonVariantLegacy>('ghost');
  readonly size = input<IconButtonSize>('md');
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input.required<string>();
  readonly pressed = input<boolean | null>(null);
  readonly expanded = input<boolean | null>(null);
  readonly badge = input<number | null>(null);
  readonly wide = input<boolean>(false);

  readonly clicked = output<{ event: MouseEvent }>();

  readonly hostClasses = computed(() => {
    const base = `icon-button icon-button--${this.variant()} icon-button--${this.size()}`;
    return this.wide() ? `${base} icon-button--wide` : base;
  });

  onClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.clicked.emit({ event });
    }
  }
}
