import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

/**
 * Visual separator between groups of menu items.
 * Renders a 1px hairline with vertical spacing.
 */
@Component({
  selector: 'afi-menu-divider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'separator',
    '[class]': '"block my-1"',
  },
  template: `<div class="h-px bg-border-hairline"></div>`,
})
export class MenuDividerComponent {}
