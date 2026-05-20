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
 * Supports icon, label, shortcut hint, danger variant, and hover lean-in micro-animation.
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
      [disabled]="disabled()"
      (click)="onClick($event)">
      <!-- Icon -->
      @if (iconStart()) {
        <span class="menu-item__icon">
          <ng-content select="[slot=icon]" />
        </span>
      }

      <!-- Label -->
      <span class="menu-item__label">{{ label() }}</span>

      <!-- Shortcut hint -->
      @if (shortcut()) {
        <span class="menu-item__shortcut">{{ shortcut() }}</span>
      }
    </button>
  `,
})
export class MenuItemComponent {
  readonly iconStart = input<string | null>(null);
  readonly label = input.required<string>();
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
