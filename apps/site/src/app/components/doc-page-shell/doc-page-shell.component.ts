import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  effect,
  inject,
  input,
} from '@angular/core';

import { BrandContextRowComponent } from '../brand-context-row';
import { HandoffInspectService } from '../../services/handoff-inspect.service';
import { InspectService } from '../../services/inspect.service';
import { ScopedBrandService } from '../../services/scoped-brand.service';

/**
 * Reusable shell for component/pattern documentation pages.
 *
 * Provides the standard layout skeleton:
 *   breadcrumb → overline → title → description → use-cases → brand picker → controls → preview → tokens
 *
 * Brand picker + inspect popover are baked in — every page that uses the
 * shell gets them automatically. Pages pass `componentName` (and optional
 * `variant`) so the popover composes the team-style flat-output name
 * (e.g. `button-primary-background: var(--brand-secondary-background-default)`).
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
export class DocPageShellComponent implements OnDestroy {
  readonly title = input.required<string>();
  readonly overline = input<string | null>(null);
  readonly description = input<string | null>(null);

  /** Component slug for the handoff popover (e.g. 'button', 'card'). */
  readonly componentName = input<string | null>(null);
  /** Active variant (e.g. 'primary'). Reactive — re-registers on change. */
  readonly variant = input<string | null>(null);

  private readonly inspect = inject(InspectService);
  protected readonly handoff = inject(HandoffInspectService);
  protected readonly brandSvc = inject(ScopedBrandService);

  constructor() {
    effect(() => {
      const name = this.componentName();
      if (!name) {
        this.handoff.setContext(null);
        return;
      }
      const variant = this.variant();
      this.handoff.setContext(variant ? { name, variant } : { name });
    });
  }

  ngOnDestroy(): void {
    this.handoff.setContext(null);
  }

  onPreviewClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const token = this.inspect.getHandoffToken(target);
    if (token) {
      void this.handoff.copyLeaf(token);
    }
  }
}
