import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Section-level header — the middle tier between the page header and
 * the body. Title + optional eyebrow + optional one-line snippet, with
 * a quiet bottom hairline so each section reads as contained without
 * a card. Trailing slot lets pages drop in actions, badges, or filters.
 *
 * Typography:
 *   - Eyebrow: caption uppercase, neutral-500
 *   - Title:   16 px / 600, canvas-fg
 *   - Snippet: body-sm, neutral-600
 */
@Component({
  selector: 'afi-section-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex items-end justify-between gap-space-4 border-b border-border-hairline pb-space-3 mb-space-4"
    >
      <div class="min-w-0 flex flex-col">
        @if (eyebrow()) {
          <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-1">
            {{ eyebrow() }}
          </p>
        }
        <h2 class="text-body-lg-600 text-canvas-fg">{{ title() }}</h2>
        @if (snippet()) {
          <p class="text-body-sm text-neutral-600 mt-space-1">{{ snippet() }}</p>
        }
      </div>
      <div class="shrink-0 flex items-center gap-space-2">
        <ng-content />
      </div>
    </div>
  `,
})
export class SectionHeaderComponent {
  readonly title = input.required<string>();
  readonly eyebrow = input<string | undefined>(undefined);
  readonly snippet = input<string | undefined>(undefined);
}
