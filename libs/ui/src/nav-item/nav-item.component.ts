import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  computed,
  HostListener,
} from '@angular/core';

import { navItemClasses } from './nav-item.variants';

/**
 * Navigation item for use inside `<afi-sidebar>`.
 *
 * Renders as a button. Icon always visible; label visible when sidebar expanded.
 * Tooltip shown when sidebar collapsed, on hover/focus.
 */
@Component({
  selector: 'afi-nav-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"block relative group"',
  },
  template: `
    <button
      type="button"
      [class]="itemClasses()"
      [attr.aria-current]="active() ? 'page' : null"
      [attr.aria-label]="label()"
      [disabled]="disabled()">
      <!-- Icon slot -->
      <span class="flex items-center justify-center w-6 h-6 shrink-0">
        <ng-content select="[slot=icon]" />
      </span>

      <!-- Label (hidden when collapsed via parent CSS) -->
      <span
        class="nav-item-label truncate text-body-sm transition-opacity duration-fast whitespace-nowrap"
        [class.opacity-0]="!sidebarExpanded()"
        [class.w-0]="!sidebarExpanded()"
        [class.overflow-hidden]="!sidebarExpanded()">
        {{ label() }}
      </span>

      <!-- Badge -->
      @if (badge() !== null) {
        <span
          class="ml-auto text-caption bg-system-error text-white rounded-full px-1.5 py-0.5 leading-none min-w-[18px] text-center"
          [class.absolute]="!sidebarExpanded()"
          [class.top-0]="!sidebarExpanded()"
          [class.right-1]="!sidebarExpanded()"
          [class.ml-0]="!sidebarExpanded()">
          {{ badge() }}
        </span>
      }
    </button>

    <!-- Tooltip (visible when sidebar collapsed, on hover/focus) -->
    @if (!sidebarExpanded()) {
      <span
        role="tooltip"
        class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-caption bg-neutral-900 text-white rounded whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-fast z-50">
        {{ label() }}
      </span>
    }
  `,
})
export class NavItemComponent {
  readonly label = input.required<string>();
  readonly active = input<boolean>(false);
  readonly badge = input<number | string | null>(null);
  readonly disabled = input<boolean>(false);

  /** Set by parent Sidebar — controls label visibility and tooltip */
  readonly sidebarExpanded = input<boolean>(true);

  readonly clicked = output<{ event: MouseEvent }>();

  readonly itemClasses = computed(() => {
    const variant = this.active() ? 'active' : 'default';
    return [
      'flex items-center gap-space-3 w-full px-space-4 py-space-2 rounded-md transition-colors duration-fast',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action',
      navItemClasses[variant],
      this.disabled() ? 'opacity-40 pointer-events-none' : 'cursor-pointer',
    ].join(' ');
  });

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    this.clicked.emit({ event });
  }
}
