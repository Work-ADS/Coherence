import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SelectComponent, type SelectOption } from '@coherence/ui';

import { ScopedBrandService, type ScopedBrand } from '../../services/scoped-brand.service';

const BRAND_OPTIONS: SelectOption[] = [
  { value: 'afi', label: 'AFI' },
  { value: 'laboral-kutxa', label: 'Laboral Kutxa' },
  { value: 'unicaja', label: 'Unicaja' },
];

/**
 * Scoped brand picker for component documentation pages.
 *
 * Looks identical to `<site-brand-picker>` but writes to
 * `ScopedBrandService` instead of mutating `<html data-brand>`. The
 * consuming page binds `[attr.data-brand]` on a wrapper around just the
 * preview slot — chrome stays Coherence, preview re-skins.
 *
 * Sibling, not replacement: the production-pattern global picker still
 * exists and remains the recommended pattern for consumer apps.
 */
@Component({
  selector: 'site-scoped-brand-picker',
  standalone: true,
  imports: [SelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scoped-brand-picker.component.html',
  styleUrl: './scoped-brand-picker.component.scss',
})
export class ScopedBrandPickerComponent {
  protected readonly svc = inject(ScopedBrandService);

  protected readonly options = BRAND_OPTIONS;

  protected onChange(value: string | number | null): void {
    this.svc.set(this.coerce(value));
  }

  private coerce(value: unknown): ScopedBrand {
    return value === 'unicaja' || value === 'laboral-kutxa' ? value : 'afi';
  }
}
