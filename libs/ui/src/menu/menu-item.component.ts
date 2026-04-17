import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  host: {
    role: 'menuitem',
    tabindex: '-1',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.aria-label]': 'ariaLabel()',
    '[class]': '"block"',
  },
  template: `
    <button
      type="button"
      [class]="itemClasses()"
      [disabled]="disabled()"
      (click)="onClick($event)">
      <!-- Icon -->
      @if (iconStart()) {
        <span class="menu-item__icon flex items-center justify-center w-4 h-4 shrink-0 transition-transform duration-[120ms]">
          <ng-content select="[slot=icon]" />
        </span>
      }

      <!-- Label -->
      <span class="flex-1 text-left truncate">{{ label() }}</span>

      <!-- Shortcut hint -->
      @if (shortcut()) {
        <span class="ml-auto pl-space-4 text-neutral-400 font-mono text-body-sm shrink-0">{{ shortcut() }}</span>
      }
    </button>
  `,
  styles: [`
    button:hover .menu-item__icon,
    button:focus-visible .menu-item__icon {
      transform: translateX(2px);
    }

    @media (prefers-reduced-motion: reduce) {
      button:hover .menu-item__icon,
      button:focus-visible .menu-item__icon {
        transform: none;
      }
      .menu-item__icon {
        transition: none !important;
      }
    }
  `],
})
export class MenuItemComponent {
  readonly iconStart = input<string | null>(null);
  readonly label = input.required<string>();
  readonly shortcut = input<string | null>(null);
  readonly variant = input<MenuItemVariant>('default');
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly clicked = output<{ event: Event }>();

  readonly itemClasses = computed(() => {
    const v = this.variant();
    const base = 'flex items-center gap-space-2 w-full px-space-3 py-space-2 text-body-sm rounded-md transition-colors duration-fast cursor-pointer';
    const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action';
    const disabled = this.disabled() ? 'opacity-50 pointer-events-none' : '';

    const variant = v === 'danger'
      ? 'text-system-error hover:bg-system-error-bg'
      : 'text-canvas-fg hover:bg-surface-muted';

    return [base, focus, variant, disabled].filter(Boolean).join(' ');
  });

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
