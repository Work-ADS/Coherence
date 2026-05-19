import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IconButtonVariant, IconButtonSize } from './icon-button.variants';

/**
 * Icon Button — a square interactive button containing only an icon.
 *
 * Accessibility: `ariaLabel` is REQUIRED.
 */
@Component({
  selector: 'afi-icon-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
})
export class IconButtonComponent {
  readonly variant = input<IconButtonVariant>('ghost');
  readonly size = input<IconButtonSize>('md');
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input.required<string>();
  readonly pressed = input<boolean | null>(null);
  readonly expanded = input<boolean | null>(null);
  readonly badge = input<number | null>(null);

  readonly clicked = output<{ event: MouseEvent }>();

  readonly hostClasses = computed(() =>
    `icon-button icon-button--${this.variant()} icon-button--${this.size()}`,
  );

  onClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.clicked.emit({ event });
    }
  }
}
