import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Menu separator — identity v2 (foundations-modern).
 *
 * The hairline that groups `afi-menu-item-v2` rows inside an `afi-menu-v2`
 * panel (e.g. splitting a destructive action off the safe ones). Consumes only
 * `foundations-modern` tokens.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Menu separator (node
 * 2405:1966). Padded (dimension-1) above and below so the hairline line sits
 * centred in its own row within the panel's inter-item gap.
 */
@Component({
  selector: 'afi-menu-divider-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'separator',
    'aria-orientation': 'horizontal',
  },
  templateUrl: './menu-divider-v2.component.html',
  styleUrls: ['./menu-divider-v2.component.scss'],
})
export class MenuDividerV2Component {}
