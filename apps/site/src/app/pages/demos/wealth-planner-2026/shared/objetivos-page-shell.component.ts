import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import {
  ProductIdentityBarComponent,
  type IdentityBreadcrumbStep,
} from '../../../../components/product-identity-bar';
import { DemoShellComponent } from '../../demo-shell/demo-shell.component';
import { PlannerSidebarComponent } from '../../shared/planner-sidebar.component';
import { PlannerTopBarComponent } from '../../shared/planner-top-bar.component';
import { VersionToggleComponent, type VersionOption } from '../../shared/version-toggle.component';
import { ObjetivosBannerComponent } from './objetivos-banner.component';

/**
 * Shared chrome for AWP planner pages (Objetivos / Diagnóstico / Plan de
 * acción). Owns the demo-shell wrapper, sidebar, planner top-bar, optional
 * scenario banner, scroll container, and the (globally hidden) version
 * toggle.
 *
 * The shell intentionally **does not** wrap `<afi-page-header>` — each
 * consuming page renders its own header inline as the first child of the
 * projected `<ng-content />`, gaining direct access to the primitive's
 * full slot API (`slot="breadcrumb"`, `slot="actions"`, `slot="primaryAction"`,
 * `slot="cards"`, `slot="filters"`, `slot="tabs"`). This lifts the
 * multi-level content-projection ceiling that briefly forced F/G/H to put
 * their CTAs in body-level toolbars — recorded in
 * `docs/session-briefs/2026-05-26-awp-chore-shell-refactor-header-slot.md`.
 */
@Component({
  selector: 'site-objetivos-page-shell',
  standalone: true,
  imports: [
    DemoShellComponent,
    PlannerSidebarComponent,
    PlannerTopBarComponent,
    ProductIdentityBarComponent,
    VersionToggleComponent,
    ObjetivosBannerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './objetivos-page-shell.component.html',
  styleUrls: ['./objetivos-page-shell.component.scss'],
})
export class ObjetivosPageShellComponent {
  readonly views = input.required<string[]>();
  readonly demoSlug = input.required<string>();
  readonly demoRoute = input.required<string>();
  readonly activeKey = input.required<string>();
  readonly clientName = input<string>('Marco Fernández Castro');
  readonly pageTitle = input<string>('');
  readonly showBanner = input<boolean>(false);
  readonly versionAriaLabel = input<string>('Versión del layout');

  /** Identity-bar breadcrumb: Clientes › [cliente name]. */
  readonly identityBreadcrumb = computed<IdentityBreadcrumbStep[]>(() => [
    { label: 'Clientes', route: '/clientes' },
    { label: this.clientName(), route: '/listado-planificaciones' },
  ]);

  readonly version = signal<string>('v1');
  readonly versions: VersionOption[] = [
    { key: 'v1', label: 'Versión 1' },
    { key: 'v2', label: 'Versión 2' },
    { key: 'v3', label: 'Versión 3' },
  ];

  setVersion(value: string): void {
    this.version.set(value);
  }
}
