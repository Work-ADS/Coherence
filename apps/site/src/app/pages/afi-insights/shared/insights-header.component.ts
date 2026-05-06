import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '@coherence/ui';

@Component({
  selector: 'ai-insights-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Demo-only exit bar — would NOT appear in the production AFI Insights site -->
    <div class="bg-neutral-100 border-b border-border-hairline">
      <div class="max-w-[1200px] mx-auto px-space-6 h-8 flex items-center justify-between text-caption text-neutral-500">
        <a
          routerLink="/novedades"
          class="inline-flex items-center gap-space-1 hover:text-canvas-fg transition-colors"
        >
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver a Coherence — Novedades
        </a>
        <span class="hidden sm:inline">Demo · No formaria parte del sitio en produccion</span>
      </div>
    </div>

    <header
      class="sticky top-0 z-50 bg-canvas/80 backdrop-blur-md border-b border-border-hairline"
    >
      <div class="max-w-[1200px] mx-auto px-space-6 h-14 flex items-center justify-between gap-space-6">
        <a routerLink="/afi-insights" class="flex items-center gap-space-2 shrink-0">
          <span class="text-body-lg-600 font-serif text-canvas-fg tracking-tight">AFI</span>
          <span class="text-body-sm text-neutral-500">Insights</span>
        </a>

        <nav class="hidden md:flex items-center gap-space-4">
          <a
            routerLink="/afi-insights/home"
            routerLinkActive="text-action-700 font-medium"
            class="text-body-sm text-neutral-500 hover:text-canvas-fg transition-colors"
          >Inicio</a>
          <a
            routerLink="/afi-insights/articulos"
            routerLinkActive="text-action-700 font-medium"
            class="text-body-sm text-neutral-500 hover:text-canvas-fg transition-colors"
          >Articulos</a>
          <a
            routerLink="/afi-insights/caso-de-estudio"
            routerLinkActive="text-action-700 font-medium"
            class="text-body-sm text-neutral-500 hover:text-canvas-fg transition-colors"
          >Caso de estudio</a>
        </nav>

        <afi-button
          variant="primary"
          size="sm"
          (clicked)="subscribeClicked.emit()"
        >Suscribirse</afi-button>
      </div>
    </header>
  `,
})
export class InsightsHeaderComponent {
  readonly subscribeClicked = output<void>();
}
