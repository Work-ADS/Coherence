import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeaserTileComponent } from '../../../components/teaser-tile/teaser-tile.component';

@Component({
  selector: 'site-cabeceras-landing',
  standalone: true,
  imports: [TeaserTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        PATTERNS / HEADERS
      </p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">Cabeceras</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Cromo de página — consistencia entre vistas. Top bar para contexto global, page header para
        contexto de página. Secciones opcionales que se encienden o se apagan según la página.
      </p>

      <div class="grid grid-cols-2 gap-space-4">
        @for (p of patterns; track p.slug) {
          <site-teaser-tile
            [title]="p.name"
            [href]="'/patrones/cabeceras/' + p.slug"
            [description]="p.description"
          />
        }
      </div>
    </div>
  `,
})
export class CabecerasLandingPage {
  readonly patterns = [
    {
      slug: 'cabecera-de-pagina',
      name: 'Cabecera de página',
      description:
        'Plantilla completa: top bar, page header, acciones, métricas, tabs. Secciones conmutables.',
    },
    {
      slug: 'cabecera-de-seccion',
      name: 'Cabecera de sección',
      description:
        'Tier intermedio entre page header y contenido. Título + snippet + slot de acciones, con hairline inferior — sin contenedores.',
    },
  ];
}
