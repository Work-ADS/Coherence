import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Top Bar — the page-level horizontal navigation bar pattern.
 *
 * A layout shell with 3 slot zones (start/center/end). Product apps fill
 * the slots with atoms/molecules as needed.
 */
@Component({
  selector: 'afi-top-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {
  readonly borderless = input<boolean>(false);
}
