import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeaserTileComponent } from '../../components/teaser-tile/teaser-tile.component';

@Component({
  selector: 'site-patrones-landing',
  standalone: true,
  imports: [TeaserTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        Patterns
      </p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">
        Patrones de composición
      </h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Shells, flujos y gráficos — composiciones de primitivos que resuelven
        problemas recurrentes de producto.
      </p>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-space-4">
        @for (p of patterns; track p.slug) {
          <site-teaser-tile
            [title]="p.name"
            [href]="'/patrones/' + p.slug"
            [description]="p.description" />
        }
      </div>
    </div>
  `,
})
export class PatronesLandingPage {
  readonly patterns = [
    { slug: 'shells', name: 'Shells', description: '5 tipos de layout: workspace, docs, auth, focus, canvas' },
    { slug: 'flujos', name: 'Flujos', description: 'Composiciones interactivas multi-primitivo' },
    { slug: 'graficos', name: 'Gráficos', description: 'Bar, line, heatmap, dumbbell' },
  ];
}
