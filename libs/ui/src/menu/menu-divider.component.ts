import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

/**
 * Visual separator between groups of menu items.
 * Renders a hairline that runs the full width of the panel.
 */
@Component({
  selector: 'afi-menu-divider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-divider.component.html',
  styleUrl: './menu-divider.component.scss',
  host: {
    role: 'separator',
  },
})
export class MenuDividerComponent {}
