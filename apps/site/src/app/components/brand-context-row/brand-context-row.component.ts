import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ButtonComponent } from '@coherence/ui';

import { ScopedBrandPickerComponent } from '../scoped-brand-picker/scoped-brand-picker.component';
import { HandoffInspectService } from '../../services/handoff-inspect.service';

/**
 * Context-selector row for component documentation pages.
 *
 * Visual quiet — a label + scoped brand picker + an inspect-mode toggle,
 * sitting between the page kicker/title and the playground. Communicates
 * "this preview is in the [Unicaja] brand, click to copy any token" and
 * doubles as the two context controls.
 *
 * Uses `<site-scoped-brand-picker>` (not the global one) so the brand swap
 * stays confined to the preview frame on the page — chrome never re-skins.
 * Inspect state lives in `HandoffInspectService`.
 */
@Component({
  selector: 'site-brand-context-row',
  standalone: true,
  imports: [ScopedBrandPickerComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './brand-context-row.component.html',
  styleUrl: './brand-context-row.component.scss',
})
export class BrandContextRowComponent {
  protected readonly handoff = inject(HandoffInspectService);

  protected onToggleInspect(): void {
    this.handoff.toggle();
  }
}
