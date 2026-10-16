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
  templateUrl: './nav-item.component.html',
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
