import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeaserTileComponent } from '../../components/teaser-tile/teaser-tile.component';

@Component({
  selector: 'site-recursos-landing',
  standalone: true,
  imports: [TeaserTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        Resources
      </p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">
        Recursos
      </h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Descargas, changelog, roadmap y preguntas frecuentes.
      </p>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-space-4">
        @for (r of resources; track r.slug) {
          <site-teaser-tile
            [title]="r.name"
            [href]="'/recursos/' + r.slug"
            [description]="r.description" />
        }
      </div>
    </div>
  `,
})
export class RecursosLandingPage {
  readonly resources = [
    { slug: 'descargas', name: 'Descargas', description: 'Build prompts y skills en un zip' },
    { slug: 'changelog', name: 'Changelog', description: 'Historial de cambios del sistema' },
    { slug: 'roadmap', name: 'Roadmap', description: 'Lo que viene y lo que está reservado' },
    { slug: 'faq', name: 'FAQ', description: 'Preguntas frecuentes' },
  ];
}
