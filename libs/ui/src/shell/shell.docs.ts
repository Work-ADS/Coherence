import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Docs shell layout — Coherence site + help center.
 *
 * Grid: [sidebar] [main] [toc]
 * Static sidebar, readable main column (max-width 720-800px), sticky TOC rail.
 */
@Component({
  selector: 'afi-shell-docs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-space-2 focus:bg-action focus:text-white focus:rounded"
       href="#main-content">Saltar al contenido</a>

    <div class="grid h-screen overflow-hidden"
         style="grid-template-columns: min-content 1fr 220px;">

      <!-- Sidebar (static by default for docs) -->
      <ng-content select="[slot=sidebar], afi-sidebar" />

      <!-- Main area -->
      <div class="flex flex-col overflow-hidden bg-surface-base">
        <ng-content select="[slot=page-header], afi-page-header" />
        <main id="main-content" class="flex-1 overflow-y-auto">
          <div class="max-w-[780px] mx-auto px-space-10 py-space-10">
            <ng-content />
          </div>
        </main>
      </div>

      <!-- TOC rail -->
      <aside
        aria-label="Índice de la página"
        class="bg-surface-quiet border-l border-border-hairline overflow-y-auto py-space-8 px-space-4 sticky top-0">
        <ng-content select="[slot=toc]" />
      </aside>
    </div>
  `,
  styles: [`:host { display: block; height: 100vh; }`],
})
export class ShellDocsComponent {}
