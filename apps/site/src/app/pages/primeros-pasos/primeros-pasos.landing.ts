import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeaserTileComponent } from '../../components/teaser-tile/teaser-tile.component';

@Component({
  selector: 'site-primeros-pasos-landing',
  standalone: true,
  imports: [TeaserTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        Getting started
      </p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">Primeros pasos</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Guías para empezar a trabajar con Coherence: cómo cambia el sistema
        entre marcas (en diseño y en desarrollo) y el flujo de Git del equipo.
      </p>
      <div class="grid grid-cols-2 gap-space-4">
        @for (g of guias; track g.slug) {
          <site-teaser-tile
            [title]="g.name"
            [href]="'/primeros-pasos/' + g.slug"
            [description]="g.description"
          />
        }
      </div>
    </div>
  `,
})
export class PrimerosPasosLandingPage {
  readonly guias = [
    {
      slug: 'cambiar-marca-diseno',
      name: 'Cambiar de marca · Diseño',
      description: 'Cómo previsualizar la UI en otra marca sin recompilar — funciona como los modes de Figma.',
    },
    {
      slug: 'cambiar-marca-desarrollo',
      name: 'Cambiar de marca · Desarrollo',
      description: 'Cómo configurar un proyecto de producto para una sola marca cliente.',
    },
    {
      slug: 'git-ramas',
      name: 'Ramas de Git',
      description: 'Convenciones de nombres, creación de ramas y flujo del equipo.',
    },
  ];
}
