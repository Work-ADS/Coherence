import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeaserTileComponent } from '../../../components/teaser-tile/teaser-tile.component';

@Component({
  selector: 'site-flujos-landing',
  standalone: true,
  imports: [TeaserTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        PATTERNS / FLUJOS
      </p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">
        Flujos
      </h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Composiciones de múltiples primitivos que resuelven flujos operacionales comunes:
        importación masiva de datos y edición inline de filas.
      </p>

      <div class="grid grid-cols-2 gap-space-4">
        @for (f of flujos; track f.slug) {
          <site-teaser-tile
            [title]="f.name"
            [href]="'/patrones/flujos/' + f.slug"
            [description]="f.description" />
        }
      </div>
    </div>
  `,
})
export class FlujosLandingPage {
  readonly flujos = [
    { slug: 'importacion', name: 'Importación', description: 'Table + Drawer + Badge + LoadingOverlay — flujo de carga masiva con validación y feedback.' },
    { slug: 'edicion-de-fila', name: 'Edición de fila', description: 'Drawer inline-edit — seleccionar fila, abrir drawer lateral, editar y guardar.' },
  ];
}
