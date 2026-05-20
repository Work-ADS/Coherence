import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Reusable shell for component/pattern documentation pages.
 *
 * Provides the standard layout skeleton:
 *   breadcrumb → overline → title → description → use-cases → controls → preview → tokens
 *
 * Each section is a named slot. Empty slots are hidden automatically.
 */
@Component({
  selector: 'site-doc-page-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './doc-page-shell.component.html',
  styleUrl: './doc-page-shell.component.scss',
})
export class DocPageShellComponent {
  readonly title = input.required<string>();
  readonly overline = input<string | null>(null);
  readonly description = input<string | null>(null);
}
