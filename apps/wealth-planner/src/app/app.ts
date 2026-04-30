import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogoComponent } from '@coherence/ui';

@Component({
  selector: 'wp-root',
  standalone: true,
  imports: [RouterOutlet, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-canvas-base text-canvas-fg">
      <!-- Top bar with brand lockup -->
      <header class="h-14 border-b border-border-hairline px-space-6 flex items-center gap-space-3">
        <coherence-logo variant="positivo" size="sm" />
        <div class="w-px h-6 bg-neutral-300 shrink-0"></div>
        <span class="text-body-sm font-light text-canvas-fg whitespace-nowrap tracking-wide">Wealth Planner</span>
      </header>
      <router-outlet />
    </div>
  `,
})
export class App {}
