import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeaserTileComponent } from '../../../components/teaser-tile/teaser-tile.component';

@Component({
  selector: 'site-cabeceras-landing',
  standalone: true,
  imports: [TeaserTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cabeceras.landing.html',
  styleUrl: './cabeceras.landing.scss',
})
export class CabecerasLandingPage {
  readonly patterns = [
    {
      slug: 'cabecera-de-pagina',
      name: 'afi-page-header',
      description:
        'Un componente, tres niveles. El toggle "Level" en el demo cambia entre page / section / subsection — la misma anatomía, distinta tipografía y caja.',
    },
    {
      slug: 'ejemplo',
      name: 'Ejemplo compuesto',
      description:
        '"Patrimonio" con los tres niveles encajados — page + sections + sub-sections con tablas dentro de la caja.',
    },
  ];
}
