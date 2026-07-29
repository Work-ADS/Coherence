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
  // NOTE: the panel-asesor cards (hero-lab, producto, editorial, trazos) and the
  // foundations-modern workbench are hidden from the landing (2026-07-28) while
  // Demo 1 is the single v2 card — routes stay live for direct links.
  {
    slug: 'demo-1',
    title: 'Demo 1',
    intro:
      'Primer dashboard de la reestructura: el desglose del patrimonio sobre la banda de composición, con el resto de bloques como marcadores.',
    system: 'v2',
    status: 'En curso',
    overviewRoute: '/demos/demo-1',
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
