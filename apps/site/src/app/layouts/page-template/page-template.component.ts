import { Component, input } from '@angular/core';
import { DownloadMdButtonComponent } from '@coherence/ui';

/**
 * 7-section page template per plan.md item 6.
 *
 * Placed in apps/site (not libs/ui) because this is a site-specific layout
 * concern — it orchestrates named content slots for the docs site pattern,
 * not a portable UI widget.
 *
 * Sections:
 *   1. Hero band        — title + eyebrow inputs
 *   2. Why              — <ng-content select="[why]">
 *   3. Visual exhibit   — <ng-content select="[exhibit]">
 *   4. How-to-use       — <ng-content select="[how-to]">
 *   5. Code examples    — <ng-content select="[code]">
 *   6. Rules / do-don't — <ng-content select="[rules]">
 *   7. Related footer   — <ng-content select="[related]"> + auto DownloadMdButton
 */
@Component({
  selector: 'app-page-template',
  standalone: true,
  imports: [DownloadMdButtonComponent],
  templateUrl: './page-template.component.html',
  styleUrl: './page-template.component.scss',
})
export class PageTemplateComponent {
  /** Hero display title (required) */
  title = input.required<string>();

  /** Eyebrow label above the title (e.g. "Foundations", "Components") */
  eyebrow = input<string>('');

  /** One-sentence role description below title */
  role = input<string>('');

  /** If set, auto-renders a DownloadMdButton in the related footer */
  downloadPath = input<string>('');

  /** Label for the auto-rendered download button */
  downloadLabel = input<string>('Download reference (.md)');
}
