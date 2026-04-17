import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeaserTileComponent } from '../../../components/teaser-tile/teaser-tile.component';

@Component({
  selector: 'site-shells-landing',
  standalone: true,
  imports: [TeaserTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        PATTERNS / SHELLS
      </p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">
        Shells
      </h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Cinco variantes de shell que cubren los contextos operacionales de AFI:
        datos, documentación, autenticación, flujos guiados y contenido de lectura.
      </p>

      <div class="grid grid-cols-2 gap-space-4">
        @for (s of shells; track s.slug) {
          <site-teaser-tile
            [title]="s.name"
            [href]="'/patrones/shells/' + s.slug"
            [description]="s.description" />
        }
      </div>
    </div>
  `,
})
export class ShellsLandingPage {
  readonly shells = [
    { slug: 'workspace', name: 'Workspace', description: 'Shell de datos y operación — columna de nav, área de contenido tabular, acciones contextuales.' },
    { slug: 'docs', name: 'Docs', description: 'Shell de documentación — sidebar con secciones, columna de lectura estrecha, TOC en rail derecho.' },
    { slug: 'auth', name: 'Auth', description: 'Shell de autenticación — centrado, sin sidebar, flujo login / signup / reset.' },
    { slug: 'focus', name: 'Focus (reservado)', description: 'Shell de flujo guiado — pasos progresivos, sin navegación lateral. Contrato documentado.' },
    { slug: 'canvas', name: 'Canvas (reservado)', description: 'Shell de lectura / consumo — contenido inmersivo, chrome mínimo. Contrato documentado.' },
  ];
}
