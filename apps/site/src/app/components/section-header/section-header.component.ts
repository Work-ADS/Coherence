import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Section-level header — the middle tier between the page header and the body.
 *
 * Title + optional eyebrow + optional one-line snippet, with a quiet bottom
 * hairline so each section reads as contained without a card. Trailing slot
 * (`<ng-content />`) lets pages drop in actions, badges, or filters.
 *
 * Typography (token-driven):
 *   - Eyebrow: caption uppercase, foreground-tertiary
 *   - Title:   body-lg/600, foreground-primary
 *   - Snippet: body-sm/400, foreground-secondary
 */
@Component({
  selector: 'afi-section-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss'],
})
export class SectionHeaderComponent {
  readonly title = input.required<string>();
  readonly eyebrow = input<string | undefined>(undefined);
  readonly snippet = input<string | undefined>(undefined);
}
