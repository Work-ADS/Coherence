import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Wise-style teaser tile for section landing pages.
 * Flat card with hairline border, title, description, and a preview slot.
 */
@Component({
  selector: 'site-teaser-tile',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './teaser-tile.component.html',
  styleUrl: './teaser-tile.component.scss',
})
export class TeaserTileComponent {
  readonly title = input.required<string>();
  readonly href = input.required<string>();
  readonly description = input<string | null>(null);
}
