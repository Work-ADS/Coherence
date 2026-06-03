import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LogoComponent } from '@coherence/ui';

export interface IdentityBreadcrumbStep {
  label: string;
  /** Router link; absent on the current (terminal) step. */
  route?: string;
}

/**
 * site-product-identity-bar — thin persistent strip identifying the AWP
 * product on the routes that don't have a planner-sidebar (/clientes and
 * /listado-planificaciones). Carries the AFI mark + product wordmark on
 * the left, followed by an optional breadcrumb path inline. The page's
 * own `<afi-page-header>` handles the title — this bar is purely identity
 * + position context.
 *
 * Not mounted on simulation pages — the sidebar already carries the
 * wordmark via `<coherence-logo>`, and the planner-top-bar carries the
 * operational context.
 */
@Component({
  selector: 'site-product-identity-bar',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-identity-bar.component.html',
  styleUrls: ['./product-identity-bar.component.scss'],
})
export class ProductIdentityBarComponent {
  readonly productLabel = input<string>('Wealth Planner');
  readonly breadcrumb = input<IdentityBreadcrumbStep[]>([]);
}
