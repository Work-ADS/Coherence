import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeaserTileComponent } from '../../../components/teaser-tile/teaser-tile.component';

@Component({
  selector: 'site-graficos-landing',
  standalone: true,
  imports: [TeaserTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        PATTERNS / CHARTS
      </p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">Gráficos</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Cuatro primitivos de visualización de datos: bar, line, heatmap y dumbbell. SVG nativo, sin
        dependencias externas, doble codificación color + textura.
      </p>

      <div class="grid grid-cols-2 gap-space-4">
        @for (c of charts; track c.slug) {
          <site-teaser-tile
            [title]="c.name"
            [href]="'/patrones/graficos/' + c.slug"
            [description]="c.description"
          />
        }
      </div>
    </div>
  `,
})
export class GraficosLandingPage {
  readonly charts = [
    {
      slug: 'bar',
      name: 'Bar',
      description: 'Barras verticales u horizontales. Y siempre desde cero.',
    },
    {
      slug: 'line',
      name: 'Line',
      description: 'Series temporales con segmentos rectos. Gaps para valores nulos.',
    },
    {
      slug: 'heatmap',
      name: 'Heatmap',
      description: 'Grilla 2D con escala secuencial o divergente.',
    },
    {
      slug: 'dumbbell',
      name: 'Dumbbell',
      description: 'Comparación de dos valores por categoría (actual vs objetivo).',
    },
    {
      slug: 'evolucion-patrimonial',
      name: 'Evolución patrimonial — V3',
      description:
        'Patrón compuesto: cabecera flotante, filtros por zonas, barras monocromáticas. Iteración V3 en curso.',
    },
  ];
}
