import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import type { MenuPlacement } from './menu.variants';
import { MenuItemComponent } from './menu-item.component';

/**
 * Contextual action menu overlay.
 *
 * Positions itself relative to a trigger element. Manages open state,
 * focus, keyboard navigation, and dismiss behavior.
 */
@Component({
  selector: 'afi-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './menu.component.scss',
  template: `
    @if (open()) {
      <!-- Backdrop for click-outside dismiss -->
      <div
        class="menu__backdrop"
        (click)="dismiss('click-outside')"
        aria-hidden="true">
      </div>

      <!-- Menu panel -->
      <div
        role="menu"
        [attr.aria-label]="ariaLabel()"
        aria-orientation="vertical"
        class="menu__panel"
        [class]="'menu__panel placement-' + placement()"
        (keydown)="onKeydown($event)">
        <ng-content />
      </div>
    }
  `,
})
export class MenuComponent {
  readonly open = input<boolean>(false);
  readonly placement = input<MenuPlacement>('bottom-start');
  readonly ariaLabel = input<string>('Context menu');

  readonly openChange = output<boolean>();
  readonly dismissed = output<'escape' | 'click-outside' | 'item-select'>();

  private readonly items = contentChildren(MenuItemComponent, { descendants: true });
  private readonly focusedIndex = signal(-1);
  private readonly el = inject(ElementRef);

  dismiss(reason: 'escape' | 'click-outside' | 'item-select'): void {
    this.openChange.emit(false);
    this.dismissed.emit(reason);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) {
      this.dismiss('escape');
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const itemList = this.items().filter(i => !i.disabled());
    if (!itemList.length) return;

    let idx = this.focusedIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        idx = idx < itemList.length - 1 ? idx + 1 : 0;
        break;
      case 'ArrowUp':
        event.preventDefault();
        idx = idx > 0 ? idx - 1 : itemList.length - 1;
        break;
      case 'Home':
        event.preventDefault();
        idx = 0;
        break;
      case 'End':
        event.preventDefault();
        idx = itemList.length - 1;
        break;
      case 'Tab':
        this.dismiss('escape');
        return;
      default:
        return;
    }

    this.focusedIndex.set(idx);
    const el = this.el.nativeElement as HTMLElement;
    const buttons = el.querySelectorAll<HTMLElement>('afi-menu-item button:not([disabled])');
    buttons[idx]?.focus();
  }
}
