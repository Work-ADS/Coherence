import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import type { MenuItemVariant } from './menu.variants';

/**
 * Single action row inside `<afi-menu>`.
 *
 * The host is a plain wrapper (`role="none"`); the one interactive element is
 * the inner `<button role="menuitem">`, so Enter and Space activate it once
 * through the native click.
 *
 * Slots:
 * - `[slot=icon]` — leading icon (shown only when `iconStart` is truthy)
 * - `[slot=label]` — projected label content (use when the row's label is a
 *   non-text primitive — e.g. a status chip). When this slot has content, the
 *   `label` input is ignored.
 * - `[slot=trailing]` — trailing content (e.g. check mark for selected state, badge)
 *
 * Inputs:
 * - `label` — primary text (used when no slot=label content is projected)
 * - `secondaryLabel` — optional second line shown below `label` in a muted style
 * - `shortcut` — optional keyboard shortcut hint, right-aligned
 * - `variant` — `'default' | 'danger'`
 * - `disabled` — disables the action
 */
@Component({
  selector: 'afi-menu-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
  host: { role: 'none' },
})
export class MenuItemComponent {
  readonly iconStart = input<string | null>(null);
  readonly label = input<string | null>(null);
  readonly secondaryLabel = input<string | null>(null);
  readonly shortcut = input<string | null>(null);
  readonly variant = input<MenuItemVariant>('default');
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly clicked = output<{ event: Event }>();

  onClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.clicked.emit({ event });
    }
  }
}
