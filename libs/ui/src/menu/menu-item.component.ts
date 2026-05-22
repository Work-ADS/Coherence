import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  HostListener,
} from '@angular/core';

import type { MenuItemVariant } from './menu.variants';

/**
 * Single action row inside `<afi-menu>`.
 *
 * Slots:
 * - `[slot=icon]` — leading icon (shown only when `iconStart` is truthy)
 * - `[slot=trailing]` — trailing content (e.g. check mark for selected state, badge)
 *
 * Inputs:
 * - `label` — primary text (required)
 * - `secondaryLabel` — optional second line shown below `label` in a muted style
 * - `shortcut` — optional keyboard shortcut hint, right-aligned
 * - `variant` — `'default' | 'danger'`
 * - `disabled` — disables the action
 */
@Component({
  selector: 'afi-menu-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './menu-item.component.scss',
  host: {
    role: 'menuitem',
    tabindex: '-1',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.aria-label]': 'ariaLabel()',
  },
  template: `
    <button
      type="button"
      class="menu-item"
      [class.is-danger]="variant() === 'danger'"
      [class.is-disabled]="disabled()"
      [class.has-secondary]="!!secondaryLabel()"
      [disabled]="disabled()"
      (click)="onClick($event)">
      <!-- Leading icon -->
      @if (iconStart()) {
        <span class="menu-item__icon">
          <ng-content select="[slot=icon]" />
        </span>
      }

      <!-- Label group (primary + optional secondary line) -->
      <span class="menu-item__label-group">
        <span class="menu-item__label">{{ label() }}</span>
        @if (secondaryLabel()) {
          <span class="menu-item__secondary-label">{{ secondaryLabel() }}</span>
        }
      </span>

      <!-- Shortcut hint -->
      @if (shortcut()) {
        <span class="menu-item__shortcut">{{ shortcut() }}</span>
      }

      <!-- Trailing slot (e.g. check icon for selected, badge) -->
      <span class="menu-item__trailing">
        <ng-content select="[slot=trailing]" />
      </span>
    </button>
  `,
})
export class MenuItemComponent {
  readonly iconStart = input<string | null>(null);
  readonly label = input.required<string>();
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

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKeyActivate(event: Event): void {
    if (!this.disabled()) {
      event.preventDefault();
      this.clicked.emit({ event });
    }
  }
}
