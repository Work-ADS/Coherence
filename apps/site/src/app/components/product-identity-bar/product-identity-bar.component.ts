import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface IdentityBreadcrumbStep {
  label: string;
  /** Router link; absent on the current (terminal) step. */
  route?: string;
}

/**
 * site-product-identity-bar — thin persistent strip identifying the AWP
 * product across all 3 contexts (/clientes · /listado-planificaciones ·
 * simulation pages).
 *
 * Carries: AFI mark + product label (left), page title + optional
 * breadcrumb (right). Densifies at <768 px — breadcrumb collapses to a
 * single back-arrow showing the previous step.
 *
 * Sits ABOVE the existing chrome (planner-top-bar / page header). Brought
 * in via composition: each AWP page mounts it in its own template and
 * passes the right pageTitle + breadcrumb.
 */
@Component({
  selector: 'site-product-identity-bar',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-identity-bar.component.html',
  styleUrls: ['./product-identity-bar.component.scss'],
})
export class ProductIdentityBarComponent {
  readonly productLabel = input<string>('Wealth Planner');
  readonly pageTitle = input.required<string>();
  readonly breadcrumb = input<IdentityBreadcrumbStep[]>([]);
  /** Hint route for the back-arrow at <768; falls back to the last breadcrumb step. */
  readonly backRoute = input<string | null>(null);
}
