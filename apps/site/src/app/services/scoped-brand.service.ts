import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ScopedBrand = 'afi' | 'unicaja' | 'laboral-kutxa';

const STORAGE_KEY = 'coherence-scoped-brand';
const DEFAULT_BRAND: ScopedBrand = 'afi';

/**
 * Scoped brand selection — used by component documentation pages where the
 * brand swap MUST be confined to the preview frame (not the whole site
 * chrome).
 *
 * Sibling of the production-pattern `BrandPickerComponent` which sets
 * `data-brand` on `<html>`. This service keeps brand state in memory and
 * exposes `attr()` so consuming pages can bind `[attr.data-brand]` to a
 * wrapper around their preview slot — the cascade then applies the brand
 * tokens to that subtree only.
 *
 * Persists to its own localStorage key so the choice survives reloads but
 * never collides with the global `coherence-brand` (which production apps
 * read).
 */
@Injectable({ providedIn: 'root' })
export class ScopedBrandService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly brand = signal<ScopedBrand>(this.readInitial());

  /**
   * Value to bind directly into `[attr.data-brand]`. Returns null for the
   * default brand (AFI) so the attribute is removed from the wrapper —
   * keeps the DOM clean and avoids selector-specificity surprises.
   */
  readonly attr = computed<string | null>(() =>
    this.brand() === DEFAULT_BRAND ? null : this.brand(),
  );

  /**
   * The node the scoped `data-brand` attribute is written to — the doc
   * shell's preview frame. Registered by `DocPageShellComponent`.
   *
   * Anything that has to READ a resolved token value (the `Tokens
   * consumidos` table) must read it out of the same cascade the preview
   * renders in. Reading `<html>` instead always returns the default brand,
   * which is how the table used to show AFI hexes under Laboral Kutxa.
   *
   * Null when no scoped preview is mounted — pattern pages that show a
   * tokens table without a shell. Readers fall back to the document root.
   */
  private readonly scopeElement = signal<HTMLElement | null>(null);

  readonly scope = this.scopeElement.asReadonly();

  set(next: ScopedBrand): void {
    this.brand.set(next);
    this.persist(next);
  }

  registerScope(element: HTMLElement): void {
    this.scopeElement.set(element);
  }

  /**
   * Clears the scope only if `element` is still the registered one, so a
   * shell being destroyed can never unregister its replacement.
   */
  releaseScope(element: HTMLElement): void {
    if (this.scopeElement() === element) this.scopeElement.set(null);
  }

  private readInitial(): ScopedBrand {
    if (!isPlatformBrowser(this.platformId)) return DEFAULT_BRAND;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return this.coerce(stored);
    } catch {
      return DEFAULT_BRAND;
    }
  }

  private persist(brand: ScopedBrand): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(STORAGE_KEY, brand);
    } catch {
      // Storage disabled / quota — switching still works for the session.
    }
  }

  private coerce(value: unknown): ScopedBrand {
    return value === 'unicaja' || value === 'laboral-kutxa' ? value : DEFAULT_BRAND;
  }
}
