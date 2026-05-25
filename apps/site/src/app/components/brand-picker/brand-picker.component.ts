import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { SelectComponent, type SelectOption } from '@coherence/ui';

type Brand = 'afi' | 'mutualidad' | 'unicaja' | 'laboral-kutxa';

const STORAGE_KEY = 'coherence-brand';

const DEFAULT_BRAND: Brand = 'afi';

const BRAND_OPTIONS: SelectOption[] = [
  { value: 'afi',           label: 'AFI' },
  { value: 'laboral-kutxa', label: 'Laboral Kutxa' },
  { value: 'mutualidad',    label: 'Mutualidad' },
  { value: 'unicaja',       label: 'Unicaja' },
];

/**
 * Brand picker for the Coherence DS site + demo chrome.
 *
 * Reads/writes the `data-brand` attribute on `<html>`. The semantic tokens
 * in libs/tokens/semantic.scss `[data-brand="..."]` blocks re-bind every
 * relevant CSS custom property — components automatically follow.
 *
 * Persists the choice to localStorage so the brand survives reload.
 * SSR-safe via `isPlatformBrowser` guards.
 *
 * Sibling of site-theme-toggle: same pattern, same lifecycle, swap `theme`
 * for `brand` and dropdown for binary toggle.
 */
@Component({
  selector: 'site-brand-picker',
  standalone: true,
  imports: [SelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './brand-picker.component.html',
  styleUrl: './brand-picker.component.scss',
})
export class BrandPickerComponent {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly options = BRAND_OPTIONS;
  protected readonly brand = signal<Brand>(this.readInitialBrand());

  constructor() {
    this.applyBrand(this.brand());
  }

  protected onChange(value: string | number | null): void {
    const next = this.coerce(value);
    this.brand.set(next);
    this.applyBrand(next);
    this.persist(next);
  }

  private readInitialBrand(): Brand {
    if (!isPlatformBrowser(this.platformId)) return DEFAULT_BRAND;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return this.coerce(stored);
    } catch {
      return DEFAULT_BRAND;
    }
  }

  private applyBrand(brand: Brand): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const html = document.documentElement;
    if (brand === DEFAULT_BRAND) {
      html.removeAttribute('data-brand');
    } else {
      html.setAttribute('data-brand', brand);
    }
  }

  private persist(brand: Brand): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(STORAGE_KEY, brand);
    } catch {
      // Disabled / quota / etc. — switching still works for the session.
    }
  }

  private coerce(value: unknown): Brand {
    return value === 'mutualidad' || value === 'unicaja' || value === 'laboral-kutxa'
      ? value
      : DEFAULT_BRAND;
  }
}
