import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SegmentedControlComponent } from '@coherence/ui';

import {
  ScopedFoundationService,
  type ScopedFoundation,
} from '../../services/scoped-foundation.service';

const FOUNDATION_OPTIONS = [
  { value: 'legacy', label: 'v1' },
  { value: 'modern', label: 'v2' },
];

/**
 * Identity picker for component documentation pages — v1 (serif) or v2
 * (foundations-modern).
 *
 * Segmented control rather than a select: two mutually exclusive options that
 * both need to be readable at a glance, which is the same call the Variant /
 * Size / State rows on every doc page already make. `Marca` stays a select
 * because it is a longer list.
 *
 * Only rendered where a v2 counterpart actually exists — the shell gates it on
 * `hasModern`. Showing a v2 tab on a page that has no v2 component would
 * promise a swap that cannot happen.
 */
@Component({
  selector: 'site-scoped-foundation-picker',
  standalone: true,
  imports: [SegmentedControlComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scoped-foundation-picker.component.html',
  styleUrl: './scoped-foundation-picker.component.scss',
})
export class ScopedFoundationPickerComponent {
  protected readonly svc = inject(ScopedFoundationService);

  protected readonly options = FOUNDATION_OPTIONS;

  protected onChange(value: string | number | null): void {
    this.svc.set(this.coerce(value));
  }

  private coerce(value: unknown): ScopedFoundation {
    return value === 'modern' ? 'modern' : 'legacy';
  }
}
