import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { PageHeaderComponent } from '@coherence/ui';

import { DemoShellComponent } from '../../demo-shell/demo-shell.component';
import { PlannerSidebarComponent } from '../../shared/planner-sidebar.component';
import { PlannerTopBarComponent } from '../../shared/planner-top-bar.component';
import { VersionToggleComponent, type VersionOption } from '../../shared/version-toggle.component';
import { ObjetivosBannerComponent } from './objetivos-banner.component';

@Component({
  selector: 'site-objetivos-page-shell',
  standalone: true,
  imports: [
    PageHeaderComponent,
    DemoShellComponent,
    PlannerSidebarComponent,
    PlannerTopBarComponent,
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
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly breadcrumb = input<string>('OBJETIVOS');
  readonly clientName = input<string>('Ricard Vazquez Fajardo');
  readonly showBanner = input<boolean>(false);
  readonly versionAriaLabel = input<string>('Versión del layout');

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
