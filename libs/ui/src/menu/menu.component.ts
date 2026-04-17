import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
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
 * focus, keyboard navigation, and dismiss behavior. No CDK dependency —
 * uses absolute positioning relative to the trigger.
 */
@Component({
  selector: 'afi-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"relative inline-block"',
  },
  template: `
    @if (open()) {
      <!-- Backdrop for click-outside dismiss -->
      <div
        class="fixed inset-0 z-40"
        (click)="dismiss('click-outside')"
        aria-hidden="true">
      </div>

      <!-- Menu panel -->
      <div
        role="menu"
        [attr.aria-label]="ariaLabel()"
        aria-orientation="vertical"
        class="absolute z-50 min-w-[12rem] py-1 bg-surface-elevated border border-border-hairline rounded-lg shadow-lg
               animate-menu-enter"
        [class.left-0]="placement() === 'bottom-start' || placement() === 'top-start'"
        [class.right-0]="placement() === 'bottom-end' || placement() === 'top-end'"
        [class.top-full]="placement() === 'bottom-start' || placement() === 'bottom-end'"
        [class.bottom-full]="placement() === 'top-start' || placement() === 'top-end'"
        [class.mt-1]="placement() === 'bottom-start' || placement() === 'bottom-end'"
        [class.mb-1]="placement() === 'top-start' || placement() === 'top-end'"
        (keydown)="onKeydown($event)">
        <ng-content />
      </div>
    }
  `,
  styles: [`
    .animate-menu-enter {
      animation: menu-enter 150ms ease-out;
    }

    @keyframes menu-enter {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .animate-menu-enter {
        animation: none;
      }
    }
  `],
})
export class MenuComponent {
  readonly open = input<boolean>(false);
  readonly placement = input<MenuPlacement>('bottom-start');
  readonly ariaLabel = input<string>('Menú contextual');

  readonly openChange = output<boolean>();
  readonly dismissed = output<'escape' | 'click-outside' | 'item-select'>();

  private readonly items = contentChildren(MenuItemComponent, { descendants: true });
  private readonly focusedIndex = signal(-1);
  private readonly el = inject(ElementRef);

  constructor() {
    // Auto-close when an item is clicked
    effect(() => {
      const itemList = this.items();
      // Re-subscribe whenever items change — but we can't do event subscriptions in effect
      // Instead, rely on the parent wiring item clicks to close
    });
  }

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
