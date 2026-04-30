import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeaserTileComponent } from '../../../components/teaser-tile/teaser-tile.component';

@Component({
  selector: 'site-tablas-landing',
  standalone: true,
  imports: [TeaserTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        PATTERNS / TABLAS
      </p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">Tablas</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Tablas densas con jerarquía. Documentamos las decisiones que las hacen legibles — corners,
        separación entre secciones, columnas dinámicas, menú de acciones por fila.
      </p>

      <div class="grid grid-cols-2 gap-space-4">
        @for (p of patterns; track p.slug) {
          <site-teaser-tile
            [title]="p.name"
            [href]="'/patrones/tablas/' + p.slug"
            [description]="p.description"
          />
        }
      </div>
    </div>
  `,
})
export class TablasLandingPage {
  readonly patterns = [
    {
      slug: 'patrimonio',
      name: 'Tabla de Patrimonio',
      description:
        'Secciones por clase de activo, columnas adaptadas a cada sección, totales por segmento, filas expandibles, menú de acciones por fila.',
    },
  ];
}
