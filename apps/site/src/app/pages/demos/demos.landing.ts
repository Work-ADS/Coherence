// external
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// internal (libs)
import { CardV2Component, TagV2Component } from '@coherence/ui';

export interface DemoCard {
  slug: string;
  title: string;
  intro: string;
  /** Which identity system the demo showcases — drives the landing grouping. */
  system: 'v2' | 'traditional';
  status?: string;
  overviewRoute: string;
}

const DEMOS: DemoCard[] = [
  // NOTE: 'nueva-simulacion-overview' is intentionally NOT listed here yet —
  // the page + route exist at /demos/nueva-simulacion-overview for iteration,
  // but it's hidden from the demos landing until the look is ready.
  // NOTE: the Sarevi demos (laboral-kutxa-sarevi, sarevi-unicaja) and AWM are
  // hidden from the landing (2026-07-22) — routes stay live for direct links.
  {
    slug: 'panel-asesor-hero-lab',
    title: 'Panel del asesor — hero lab',
    intro:
      'Laboratorio del hero del panel: los tres tratamientos (Producto, Editorial, Trazos) lado a lado sobre el mismo dato, con pines de comentario para elegir registro.',
    system: 'v2',
    status: 'Identidad v2',
    overviewRoute: '/demos/panel-asesor/hero-lab',
  },
  {
    slug: 'panel-asesor-producto',
    title: 'Panel del asesor · T1 Producto',
    intro:
      'El dashboard de marca en registro producto: tarjeta contenida, píldoras con hueco, cifra en display-metric.',
    system: 'v2',
    status: 'Identidad v2',
    overviewRoute: '/demos/panel-asesor/producto',
  },
  {
    slug: 'panel-asesor-editorial',
    title: 'Panel del asesor · T2 Editorial',
    intro:
      'El dashboard de marca en registro editorial: cifra a gran cuerpo sobre el lienzo, bloques planos, voz de informe.',
    system: 'v2',
    status: 'Identidad v2',
    overviewRoute: '/demos/panel-asesor/editorial',
  },
  {
    slug: 'panel-asesor-trazos',
    title: 'Panel del asesor · T3 Trazos',
    intro:
      'El dashboard de marca en la variante de autor: campo de trazos finos con banda sólida solo en el foco.',
    system: 'v2',
    status: 'Identidad v2',
    overviewRoute: '/demos/panel-asesor/trazos',
  },
  {
    slug: 'foundations-modern-workbench',
    title: 'Identidad v2 — workbench',
    intro:
      'Banco de pruebas de la nueva identidad (foundations-modern): botón v2 con todas sus variantes, tamaños y estados. Crecerá hasta convertirse en el moodboard de componentes.',
    system: 'v2',
    status: 'En curso',
    overviewRoute: '/demos/foundations-modern/workbench',
  },
  {
    slug: 'wealth-planner-2026',
    title: 'Wealth Planner 2026',
    intro:
      'Rediseño completo — patrimonio, evolución, simulación. Entra por el listado de planificaciones del cliente.',
    system: 'traditional',
    status: 'Identidad tradicional',
    // Card lands on the listado (the per-cliente hub). The overview
    // (case study + bitácora + documento funcional + tokens) is still
    // reachable at /demos/wealth-planner-2026 for direct links.
    overviewRoute: '/listado-planificaciones',
  },
];

/**
 * Demos landing — identity v2 (foundations-modern).
 *
 * «Productos»: the v2 demos as action cards (card-v2 + tag-v2 inside a
 * routerLink), then the «AFI tradicional» divider with the legacy-identity
 * demos beneath. Single view — the team switch was retired 2026-07-22.
 */
@Component({
  selector: 'site-demos-landing',
  standalone: true,
  imports: [RouterLink, CardV2Component, TagV2Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demos.landing.html',
  styleUrl: './demos.landing.scss',
})
export class DemosLandingPage {
  readonly v2Demos: DemoCard[] = DEMOS.filter((d) => d.system === 'v2');
  readonly traditionalDemos: DemoCard[] = DEMOS.filter((d) => d.system === 'traditional');
}
