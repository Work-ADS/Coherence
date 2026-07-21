import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Visual treatment of the bar surface. */
export type TopBarVariant = 'solid' | 'glass';

/**
 * Top Bar — the page-level horizontal navigation bar pattern.
 *
 * A layout shell with 3 slot zones (start/center/end). Product apps fill
 * the slots with atoms/molecules as needed.
 *
 * `variant`:
 * - `solid` (default) — opaque surface with a hairline bottom border.
 * - `glass` — transparent tint + backdrop blur, no border, so page content
 *   frosts through it as it scrolls under. The host must overlay the content
 *   (e.g. position: sticky/absolute) for the effect to read.
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
  readonly variant = input<TopBarVariant>('solid');
}
