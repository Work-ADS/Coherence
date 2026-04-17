import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeaserTileComponent } from '../../components/teaser-tile/teaser-tile.component';

@Component({
  selector: 'site-primeros-pasos-landing',
  standalone: true,
  imports: [TeaserTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">GETTING STARTED</p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">Primeros pasos</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Guías paso a paso para comenzar a trabajar con Coherence — desde crear un proyecto nuevo
        hasta actualizar el sistema de diseño en un producto existente.
      </p>
      <div class="grid grid-cols-2 gap-space-4">
        @for (g of guias; track g.slug) {
          <site-teaser-tile [title]="g.name" [href]="'/primeros-pasos/' + g.slug" [description]="g.description" />
        }
      </div>
    </div>
  `,
})
export class PrimerosPasosLandingPage {
  readonly guias = [
    { slug: 'nuevo-proyecto', name: 'Iniciar un proyecto', description: 'Crear un proyecto Angular desde cero con Coherence configurado.' },
    { slug: 'nueva-marca', name: 'Crear una marca nueva', description: 'Definir un brand manifest y generar tokens personalizados.' },
    { slug: 'clonar-producto', name: 'Clonar un producto', description: 'Duplicar un producto existente y cambiar su identidad de marca.' },
    { slug: 'git-ramas', name: 'Ramas de Git', description: 'Crear, enviar y eliminar ramas siguiendo el flujo del equipo.' },
    { slug: 'actualizar-ds', name: 'Actualizar el DS', description: 'Incorporar la última versión de Coherence en tu proyecto.' },
  ];
}
