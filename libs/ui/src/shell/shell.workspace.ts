import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Workspace shell layout — data/operator default.
 *
 * Grid: [sidebar] [main] [rail?]
 * Sidebar on surface-quiet, main on surface-base, optional right rail.
 */
@Component({
  selector: 'afi-shell-workspace',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-space-2 focus:bg-action focus:text-white focus:rounded"
       href="#main-content">Saltar al contenido</a>

    <div class="grid h-screen overflow-hidden"
         [style.grid-template-columns]="rightRail() ? 'min-content 1fr min-content' : 'min-content 1fr'">

      <!-- Sidebar -->
      <ng-content select="[slot=sidebar], afi-sidebar" />

      <!-- Main area: page-header + content -->
      <div class="flex flex-col overflow-hidden bg-surface-base">
        <ng-content select="[slot=page-header], afi-page-header" />
        <main id="main-content" class="flex-1 overflow-y-auto">
          <ng-content />
        </main>
      </div>

      <!-- Optional right rail -->
      @if (rightRail()) {
        <aside
          aria-label="Panel lateral"
          class="w-80 bg-surface-quiet border-l border-border-hairline overflow-y-auto">
          <ng-content select="[slot=rail]" />
        </aside>
      }
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
  `],
})
export class ShellWorkspaceComponent {
  readonly rightRail = input(false);
}
