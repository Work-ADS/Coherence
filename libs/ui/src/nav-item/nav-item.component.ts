import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  HostListener,
} from '@angular/core';

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
  styleUrl: './nav-item.component.scss',
  template: `
    <button
      type="button"
      class="nav-item"
      [class.is-active]="active()"
      [class.is-disabled]="disabled()"
      [attr.aria-current]="active() ? 'page' : null"
      [attr.aria-label]="label()"
      [disabled]="disabled()">
      <!-- Icon slot -->
      @if (showIcon()) {
        <span class="nav-item__icon">
          <ng-content select="[slot=icon]" />
        </span>
      }

      <!-- Label (hidden when collapsed via parent CSS) -->
      <span
        class="nav-item__label"
        [class.is-collapsed]="!sidebarExpanded()">
        {{ label() }}
      </span>

      <!-- Badge -->
      @if (badge() !== null) {
        <span class="nav-item__badge">
          {{ badge() }}
        </span>
      }

      <!-- Chevron (right) -->
      @if (chevron() === 'right') {
        <svg
          class="nav-item__chevron"
          [class.is-expanded]="expanded()"
          viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z" />
        </svg>
      }
    </button>

    <!-- Tooltip (visible when sidebar collapsed, on hover/focus) -->
    @if (!sidebarExpanded()) {
      <span role="tooltip" class="nav-item__tooltip">
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
  /** Show a chevron indicator (right side). Use for expandable section parents. */
  readonly chevron = input<'right' | 'none'>('none');
  /** Whether the section this item controls is expanded (rotates chevron) */
  readonly expanded = input<boolean>(false);
  /** Whether to show the icon slot. When false, icon space is removed. */
  readonly showIcon = input<boolean>(true);

  /** Set by parent Sidebar — controls label visibility and tooltip */
  readonly sidebarExpanded = input<boolean>(true);

  readonly clicked = output<{ event: MouseEvent }>();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    this.clicked.emit({ event });
  }
}
