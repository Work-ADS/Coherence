import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Canvas shell — read/consume (RESERVED v1).
 *
 * Renders a polite placeholder. When the first Canvas consumer
 * appears, this stub becomes the real implementation.
 */
@Component({
  selector: 'afi-shell-canvas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-space-2 focus:bg-action focus:text-white focus:rounded"
       href="#main-content">Saltar al contenido</a>

    <main id="main-content" class="min-h-screen flex items-center justify-center bg-surface-base p-space-8 text-center">
      <p class="text-body-md text-canvas-fg-muted">Este layout se habilitará próximamente.</p>
    </main>
  `,
  styles: [`:host { display: block; }`],
})
export class ShellCanvasComponent {}
