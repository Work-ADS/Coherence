import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeaserTileComponent } from '../../components/teaser-tile/teaser-tile.component';

@Component({
  selector: 'site-fundamentos-landing',
  standalone: true,
  imports: [TeaserTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        Foundations
      </p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">
        Fundamentos del sistema
      </h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Las reglas compartidas que gobiernan todo el sistema: color, tipografía,
        espacio, movimiento, accesibilidad y copy.
      </p>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-space-4">
        @for (f of foundations; track f.slug) {
          <site-teaser-tile
            [title]="f.name"
            [href]="'/fundamentos/' + f.slug"
            [description]="f.description" />
        }
      </div>
    </div>
  `,
})
export class FundamentosLandingPage {
  readonly foundations = [
    { slug: 'principios', name: 'Principios', description: 'Manifiesto y filosofía de diseño' },
    { slug: 'color', name: 'Color', description: 'Escalas, mapeo semántico, contraste' },
    { slug: 'tipografia', name: 'Tipografía', description: 'Escala de 7 roles tipográficos' },
    { slug: 'espacio', name: 'Espacio', description: 'Escala base-4 + semántica t-shirt' },
    { slug: 'movimiento', name: 'Movimiento', description: 'Disciplina de movimiento y tokens' },
    { slug: 'accesibilidad', name: 'Accesibilidad', description: 'WCAG 2.1 AA y checklists' },
    { slug: 'copy', name: 'Copy', description: 'RAE, registro formal, glosario' },
    { slug: 'tokens', name: 'Tokens', description: 'Primitivo → semántico → marca' },
  ];
}
