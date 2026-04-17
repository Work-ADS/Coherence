import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Auth shell layout — login/signup.
 *
 * Centered single column, max-width 400px.
 * Brand logo above card, surface-quiet background, card on surface-elevated.
 */
@Component({
  selector: 'afi-shell-auth',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-space-2 focus:bg-action focus:text-white focus:rounded"
       href="#main-content">Saltar al contenido</a>

    <div class="min-h-screen bg-surface-quiet flex flex-col items-center justify-center p-space-6">
      <main id="main-content" class="w-full max-w-[400px] flex flex-col items-center gap-space-6">
        <!-- Brand logo slot -->
        <ng-content select="[slot=logo]" />

        <!-- Auth card content -->
        <div class="w-full bg-surface-elevated rounded-lg shadow-sm p-space-8">
          <ng-content />
        </div>
      </main>

      <!-- Footer slot (legal/help links) -->
      <footer class="mt-space-8 text-body-sm text-canvas-fg-muted text-center">
        <ng-content select="[slot=auth-footer]" />
      </footer>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class ShellAuthComponent {}
