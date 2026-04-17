import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { ShellType } from './shell.variants';
import { coerceShellType } from './shell.variants';
import { ShellWorkspaceComponent } from './shell.workspace';
import { ShellAuthComponent } from './shell.auth';
import { ShellDocsComponent } from './shell.docs';
import { ShellFocusComponent } from './shell.focus';
import { ShellCanvasComponent } from './shell.canvas';

/**
 * Top-level layout composer.
 *
 * Reads the `type` input (usually from route data) and renders one of
 * five locked shell types. Every AFI product uses `<afi-shell>` at its root.
 *
 * Ships v1: workspace, docs, auth.
 * Reserved v1 (stub): focus, canvas.
 */
@Component({
  selector: 'afi-shell',
  standalone: true,
  imports: [
    ShellWorkspaceComponent,
    ShellAuthComponent,
    ShellDocsComponent,
    ShellFocusComponent,
    ShellCanvasComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (shellType()) {
      @case ('workspace') {
        <afi-shell-workspace [rightRail]="rightRail()">
          <ng-content />
          <ng-content select="[slot=sidebar], afi-sidebar" />
          <ng-content select="[slot=page-header], afi-page-header" />
          <ng-content select="[slot=rail]" />
        </afi-shell-workspace>
      }
      @case ('auth') {
        <afi-shell-auth>
          <ng-content />
          <ng-content select="[slot=logo]" />
          <ng-content select="[slot=auth-footer]" />
        </afi-shell-auth>
      }
      @case ('docs') {
        <afi-shell-docs>
          <ng-content />
          <ng-content select="[slot=sidebar], afi-sidebar" />
          <ng-content select="[slot=page-header], afi-page-header" />
          <ng-content select="[slot=toc]" />
        </afi-shell-docs>
      }
      @case ('focus') {
        <afi-shell-focus />
      }
      @case ('canvas') {
        <afi-shell-canvas />
      }
    }
  `,
  styles: [`:host { display: block; }`],
})
export class ShellComponent {
  readonly type = input<ShellType>('workspace');
  readonly sidebarMode = input<'static' | 'collapsible' | 'hover-expand'>('hover-expand');
  readonly rightRail = input(false);

  readonly shellType = computed(() => coerceShellType(this.type()));
}
