import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ScopedFoundation = 'legacy' | 'modern';

const STORAGE_KEY = 'coherence-scoped-foundation';
const DEFAULT_FOUNDATION: ScopedFoundation = 'legacy';

/**
 * Which identity the preview frame renders in — v1 (serif, `:root`) or v2
 * (foundations-modern, `[data-foundation="modern"]`).
 *
 * Sibling of `ScopedBrandService`, and deliberately the same shape: a signal, a
 * `attr()` for `[attr.data-foundation]`, and its own localStorage key. Brand and
 * foundation are orthogonal — Laboral Kutxa in v2 is a real combination — so
 * they stay two services rather than one enum.
 *
 * Worth being explicit about what this attribute does and does not do. The
 * foundations-modern mirror is a PARALLEL token namespace (`--brand-background-
 * default`, `--content-primary`, `--font-family-primary`), not an override of
 * the v1 names (`--brand-secondary-background-default`, `--foreground-*`). So
 * putting `data-foundation="modern"` on a wrapper does NOT re-skin an
 * `<afi-button>` — v1 primitives read v1 tokens and would look untouched.
 *
 * Switching identity therefore means swapping the COMPONENT, not just the
 * scope: a page opts in by rendering `<afi-button-v2>` under v2 and
 * `<afi-button>` under v1. The attribute still has to be on the wrapper, because
 * that is what feeds the v2 tokens to the v2 component and what lets the
 * `Tokens consumidos` table resolve them out of the same cascade.
 *
 * Pages that have no v2 counterpart never show the picker — see
 * `DocPageShellComponent.foundations`.
 */
@Injectable({ providedIn: 'root' })
export class ScopedFoundationService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly foundation = signal<ScopedFoundation>(this.readInitial());

  /** True when the preview should render the v2 primitive. */
  readonly isModern = computed(() => this.foundation() === 'modern');

  /**
   * Value to bind into `[attr.data-foundation]`. Null on the legacy default so
   * the attribute is removed — same reasoning as `ScopedBrandService.attr()`.
   */
  readonly attr = computed<string | null>(() => (this.isModern() ? 'modern' : null));

  set(next: ScopedFoundation): void {
    this.foundation.set(next);
    this.persist(next);
  }

  private readInitial(): ScopedFoundation {
    if (!isPlatformBrowser(this.platformId)) return DEFAULT_FOUNDATION;
    try {
      return this.coerce(localStorage.getItem(STORAGE_KEY));
    } catch {
      return DEFAULT_FOUNDATION;
    }
  }

  private persist(foundation: ScopedFoundation): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(STORAGE_KEY, foundation);
    } catch {
      // Storage disabled / quota — switching still works for the session.
    }
  }

  private coerce(value: unknown): ScopedFoundation {
    return value === 'modern' ? 'modern' : DEFAULT_FOUNDATION;
  }
}
