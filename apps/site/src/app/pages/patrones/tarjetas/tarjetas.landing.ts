import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeaserTileComponent } from '../../../components/teaser-tile/teaser-tile.component';

@Component({
  selector: 'site-tarjetas-landing',
  standalone: true,
  imports: [TeaserTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">PATTERNS / TARJETAS</p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">Tarjetas</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Diez variantes de contenido para el primitivo Card — cada una resuelve un caso de uso
        específico en dashboards, listados y vistas de detalle.
      </p>
      <div class="grid grid-cols-2 gap-space-4">
        @for (t of tarjetas; track t.slug) {
          <site-teaser-tile [title]="t.name" [href]="'/patrones/tarjetas/' + t.slug" [description]="t.description" />
        }
      </div>
    </div>
  `,
})
export class TarjetasLandingPage {
  readonly tarjetas = [
    { slug: 'metrica', name: 'Métrica', description: 'Número + label + trend chip.' },
    { slug: 'grafico', name: 'Gráfico', description: 'Chart container con título + valor + range tabs.' },
    { slug: 'fila-de-lista', name: 'Fila de lista', description: 'Thumbnail + título + meta + trailing action.' },
    { slug: 'accion', name: 'Acción', description: 'Prose + primary CTA.' },
    { slug: 'entidad', name: 'Entidad', description: 'Business object visual + key facts.' },
    { slug: 'lista-de-indicadores', name: 'Lista de indicadores', description: 'Rows con inline sparklines o bars.' },
    { slug: 'composicion', name: 'Composición', description: 'Donut + legend + deltas.' },
    { slug: 'convertidor', name: 'Convertidor', description: 'Input → transform → output + CTA.' },
    { slug: 'estado', name: 'Estado', description: 'Status label + optional confirmation visual.' },
    { slug: 'editorial', name: 'Editorial', description: 'Kicker + serif title + decorative flourish.' },
  ];
}
