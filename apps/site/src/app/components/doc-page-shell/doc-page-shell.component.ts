import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { BrandContextRowComponent } from '../brand-context-row';
import { ScopedBrandService } from '../../services/scoped-brand.service';

/**
 * Reusable shell for component/pattern documentation pages.
 *
 * Provides the standard layout skeleton:
 *   breadcrumb → overline → title → description → use-cases → brand picker → controls → preview → tokens
 *
 * 2026-05-28: Click-to-copy handoff inspection removed from component
 * pages — the `Tokens consumidos` table below the playground IS the
 * inspection now (per user feedback: the panel itself shows what tokens
 * the current variant consumes). Inspect mode is still live on the full
 * /demos shell via `InspectService` for the "click any element on a real
 * screen" workflow. `componentName` and `variant` inputs are kept as
 * no-op accepts so the ~21 consumer pages don't break; if you're a future
 * reader and they're still unused, drop them and update consumers in one
 * sweep.
 *
 * Each section is a named slot. Empty slots are hidden automatically.
 */
@Component({
  selector: 'site-doc-page-shell',
  standalone: true,
  imports: [BrandContextRowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './doc-page-shell.component.html',
  styleUrl: './doc-page-shell.component.scss',
})
export class DocPageShellComponent {
  readonly title = input.required<string>();
  readonly overline = input<string | null>(null);
  readonly description = input<string | null>(null);

  /** Kept for backward compatibility with existing pages; no longer wired. */
  readonly componentName = input<string | null>(null);
  /** Kept for backward compatibility with existing pages; no longer wired. */
  readonly variant = input<string | null>(null);

  protected readonly brandSvc = inject(ScopedBrandService);

  /**
   * Direct element access is unavoidable here: the scoped brand exists only
   * as a `data-brand` attribute on this node, and the tokens table has to
   * read resolved custom-property values out of that node's cascade.
   */
  private readonly preview = viewChild.required<ElementRef<HTMLElement>>('preview');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const element = this.preview().nativeElement;
      this.brandSvc.registerScope(element);
      this.destroyRef.onDestroy(() => this.brandSvc.releaseScope(element));
    });
  }
}
