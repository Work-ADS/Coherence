import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ScopedBrandPickerComponent } from '../scoped-brand-picker/scoped-brand-picker.component';

/**
 * Context-selector row for component documentation pages.
 *
 * Visual quiet — a label + scoped brand picker, sitting between the page
 * kicker/title and the playground. Communicates "this preview is in the
 * [Unicaja] brand" — the one context control on component pages.
 *
 * Uses `<site-scoped-brand-picker>` (not the global one) so the brand swap
 * stays confined to the preview frame on the page — chrome never re-skins.
 *
 * Inspection was removed from component pages on 2026-05-28: the
 * `Tokens consumidos` table below the playground IS the inspection now,
 * so the hover-to-copy + Inspección toggle were redundant. Inspect mode
 * still lives on the full /demos shell via `InspectService`.
 */
@Component({
  selector: 'site-brand-context-row',
  standalone: true,
  imports: [ScopedBrandPickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './brand-context-row.component.html',
  styleUrl: './brand-context-row.component.scss',
})
export class BrandContextRowComponent {}
