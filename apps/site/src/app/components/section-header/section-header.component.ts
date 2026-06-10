import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// NOTE (2026-06-09, page-patterns branch): this component is superseded by
// `<afi-page-header level="section|subsection">` (libs/ui/src/page-header).
// Live consumers were migrated in the page-patterns branch. The file is kept
// alive only because versioned-snapshot blog posts under
// `apps/site/src/app/pages/blog/iteracion-*` and `.../blog/bitacora` still
// reference it — those pages are frozen by project convention and must not be
// modified mid-flight. Do not add new consumers.

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
 *
 * @deprecated Use `<afi-page-header level="section">` (or `level="subsection"`)
 *   from `@coherence/ui`. New pages must not import this component.
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
