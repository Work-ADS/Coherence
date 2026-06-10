import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  PageHeaderComponent,
} from '@coherence/ui';

/**
 * Ejemplo compuesto — Patrimonio.
 *
 * Demuestra los tres niveles del scaffold encajados en una página real (el
 * mismo título "Patrimonio" que aparece en las maquetas Figma). Sirve como
 * receta visual de que el componente compone coherentemente a lo largo de la
 * jerarquía de IA: página → secciones → sub-secciones.
 *
 * Usa exclusivamente primitivos del DS: afi-page-header, afi-button, afi-badge,
 * afi-card. Sin botones ad-hoc ni chips a mano.
 */
@Component({
  selector: 'site-cabeceras-ejemplo-page',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, CardComponent, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ejemplo.page.html',
  styleUrl: './ejemplo.page.scss',
})
export class CabecerasEjemploPage {}
