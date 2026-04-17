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
  template: `
    <a
      [routerLink]="href()"
      class="block border border-border-hairline rounded-md p-space-6
             hover:bg-surface-muted
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
             transition-colors duration-fast">
      <div class="h-[120px] flex items-center justify-center mb-space-4 rounded-sm bg-surface-quiet">
        <ng-content select="[slot=preview]" />
      </div>
      <h3 class="text-body-md font-semibold text-canvas-fg">{{ title() }}</h3>
      @if (description(); as desc) {
        <p class="text-body-sm text-neutral-500 mt-space-1">{{ desc }}</p>
      }
    </a>
  `,
})
export class TeaserTileComponent {
  readonly title = input.required<string>();
  readonly href = input.required<string>();
  readonly description = input<string | null>(null);
}
