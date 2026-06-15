import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeaserTileComponent } from '../../../components/teaser-tile/teaser-tile.component';

@Component({
  selector: 'site-tarjetas-landing',
  standalone: true,
  imports: [TeaserTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tarjetas.landing.html',
  styleUrl: './tarjetas.landing.scss',
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
