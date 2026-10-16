import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  HostListener,
} from '@angular/core';

let nextId = 0;

/**
 * Navigation item for use inside `<afi-sidebar>`.
 *
 * Renders as a button, or as a link when `as="a"`, so route and wizard
 * navigation can be real links. Icon always visible; label visible when sidebar
 * expanded. Tooltip shown when sidebar collapsed, on hover/focus.
 */
@Component({
  selector: 'afi-nav-item',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './nav-item.component.scss',
  templateUrl: './nav-item.component.html',
})
export class NavItemComponent {
  readonly label = input.required<string>();
  readonly active = input<boolean>(false);
  /** The zip's name for `active`; either one marks the current page. */
  readonly selected = input<boolean>(false);
  /** Numbered chip shown instead of the icon (wizard step nav). */
  readonly step = input<number | string | null>(null);
  /** Render as a link (`a`, with `href`) or a button (default). */
  readonly tag = input<'button' | 'a'>('button', { alias: 'as' });
  readonly href = input<string | null>(null);
  readonly badge = input<number | string | null>(null);
  readonly disabled = input<boolean>(false);
  /**
   * Why the row is disabled, written as the action that unlocks it. When set,
   * a disabled row stays focusable (`aria-disabled`) and is described by the
   * reason, so keyboard and screen-reader users learn what to do. Unset: the
   * row is disabled as before (native `disabled`, not focusable).
   */
  readonly disabledReason = input<string | null>(null);
  /** Show a chevron indicator (right side). Use for expandable section parents. */
  readonly chevron = input<'right' | 'none'>('none');
  /** Whether the section this item controls is expanded (rotates chevron) */
  readonly expanded = input<boolean>(false);
  /** Whether to show the icon slot. When false, icon space is removed. */
  readonly showIcon = input<boolean>(true);

  /** Set by parent Sidebar — controls label visibility and tooltip */
  readonly sidebarExpanded = input<boolean>(true);

  readonly isSelected = computed(() => this.active() || this.selected());
  readonly reasonShown = computed(() => this.disabled() && !!this.disabledReason());
  readonly reasonId = `nav-item-reason-${nextId++}`;

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
