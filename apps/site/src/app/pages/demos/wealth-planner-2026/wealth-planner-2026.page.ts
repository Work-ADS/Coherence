import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  DemoOverviewShellComponent,
  type DemoOverviewRelatedPost,
  type DemoOverviewScreenshot,
} from '../../../components/demo-overview-shell';

/**
 * Wealth Planner 2026 — overview surface.
 *
 * Lives at /demos/wealth-planner-2026 and renders the standard demo-overview
 * shell with title + intro + "Abrir demo" CTA + screenshots + related posts.
 */
@Component({
  selector: 'site-wealth-planner-2026-overview',
  standalone: true,
  imports: [DemoOverviewShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wealth-planner-2026.page.html',
  styleUrl: './wealth-planner-2026.page.scss',
})
export class WealthPlannerOverviewPage {
  readonly screenshots: DemoOverviewScreenshot[] = [
    // Placeholders — real screenshots ship in a separate asset PR.
    // {
    //   src: 'assets/demos/wealth-planner-2026/patrimonio.png',
    //   alt: 'Pantalla Patrimonio del Wealth Planner 2026',
    //   caption: 'Patrimonio — listado completo con filtros activos.',
    // },
  ];

  readonly relatedPosts: DemoOverviewRelatedPost[] = [
    {
      title: 'Caso de estudio — Wealth Planner 2026',
      slug: 'wealth-planner-2026',
      eyebrow: 'BLOG',
      description:
        'Decisiones de diseño y bitácora de iteraciones del rediseño.',
    },
    {
      title: 'Proceso de componentes',
      slug: 'proceso-componente',
      eyebrow: 'BLOG',
      description:
        'Cómo pasamos de "veo una necesidad" a un spec listo para handoff.',
    },
  ];
}
