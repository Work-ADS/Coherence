import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

/**
 * Visual separator between groups of menu items.
 * Renders a 1px line with vertical spacing.
 */
@Component({
  selector: 'afi-menu-divider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'separator',
  },
  template: `<div class="divider"></div>`,
  styles: [`
    :host {
      display: block;
      margin: var(--space-2xs) 0;
    }
    .divider {
      height: 1px;
      background: var(--border-subtle);
    }
  `],
})
export class MenuDividerComponent {}
