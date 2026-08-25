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
import { ScopedFoundationPickerComponent } from '../scoped-foundation-picker';
import { EmbedService } from '../../services/embed.service';
import { ScopedBrandService } from '../../services/scoped-brand.service';
import { ScopedFoundationService } from '../../services/scoped-foundation.service';

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
 *
 * 2026-08-25: `?embed=1` collapses the page to controls → preview → tokens.
 * Everything else here is prose written for someone reading the docs at full
 * width; in a narrow iframe it pushes the playground and the token table below the
 * fold, and a cross-origin frame can't be scrolled by the host page. The preview
 * div stays unconditional so the `#preview` viewChild below always resolves.
 * See `EmbedService` for why it's a query param and not a frame check.
 */
@Component({
  selector: 'site-doc-page-shell',
  standalone: true,
  imports: [BrandContextRowComponent, ScopedFoundationPickerComponent],
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

  /**
   * Whether this component has a v2 (foundations-modern) counterpart worth
   * showing. Opt-in per page, because most pages don't: a v2 primitive is a
   * different component with its own API, not a restyle of the v1 one, so a
   * page can only offer the switch once someone has written the v2 branch of
   * its preview and its token table.
   */
  readonly hasModern = input<boolean>(false);

  protected readonly brandSvc = inject(ScopedBrandService);
  protected readonly foundationSvc = inject(ScopedFoundationService);
  protected readonly embed = inject(EmbedService);

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
