import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import type { MenuItemV2Role, MenuItemV2Variant } from './menu-v2.variants';

/**
 * Menu item — identity v2 (foundations-modern).
 *
 * The atomic row shared by the v2 Menu panel, context menus, and (later) the
 * Select listbox. Consumes only `foundations-modern` tokens, so it renders
 * correctly only inside a `[data-foundation="modern"]` scope. Legacy pages keep
 * using `afi-menu`'s `MenuItemComponent` untouched.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Menu Item set (node
 * 2401:1966), 6 states. Anatomy: [icon-slot?] · label · [shortcut?] · [check?].
 * Icon slot projects consumer content sized to `--icon-sm`; the selected check
 * is rendered by the component (fixed Lucide glyph).
 *
 * Renders a `<button>` for native keyboard actuation. `role` switches between
 * `menuitem` (context menu) and `option` (Select listbox); the parent panel
 * owns roving focus / list semantics.
 */
@Component({
  selector: 'afi-menu-item-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-item-v2.component.html',
  styleUrls: ['./menu-item-v2.component.scss'],
})
export class MenuItemV2Component {
  readonly variant = input<MenuItemV2Variant>('default');
  readonly role = input<MenuItemV2Role>('menuitem');
  readonly selected = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly shortcut = input<string | null>(null);

  /**
   * Keyboard-highlighted row. In a Select listbox the parent keeps DOM focus on
   * the trigger (aria-activedescendant), so the "cursor" is a visual state here,
   * not `:focus`. Renders the same tint as hover.
   */
  readonly active = input<boolean>(false);

  /** Stable element id, so a listbox parent can point aria-activedescendant at it. */
  readonly optionId = input<string | null>(null);

  readonly clicked = output<{ event: MouseEvent }>();

  readonly classes = computed(() => {
    const parts = ['afi-menu-item-v2', `afi-menu-item-v2--${this.variant()}`];
    if (this.selected()) parts.push('afi-menu-item-v2--selected');
    if (this.active()) parts.push('afi-menu-item-v2--active');
    return parts.join(' ');
  });

  readonly ariaSelected = computed(() =>
    this.role() === 'option' ? String(this.selected()) : null,
  );

  onClick(event: MouseEvent): void {
    if (this.disabled()) {
      return;
    }

    this.clicked.emit({ event });
  }
}
