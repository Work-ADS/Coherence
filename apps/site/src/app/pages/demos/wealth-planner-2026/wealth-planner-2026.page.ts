import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  AnimatedChartComponent,
  TabItemComponent,
  TabsComponent,
  type ChartColumn,
} from '@coherence/ui';

import {
  DemoOverviewShellComponent,
  type DemoOverviewRelatedPost,
} from '../../../components/demo-overview-shell';

/**
 * Wealth Planner 2026 — demo overview surface.
 *
 * Lives at /demos/wealth-planner-2026. Uses `<site-demo-overview-shell>`
 * for the hero + CTA + related-posts chrome, and projects three tabs into
 * the shell body:
 *
 *   1. **Visión general** — what the product is, who it's for, when it
 *      shipped, who built it.
 *   2. **Caso de estudio** — problems, solutions, processes. The narrative
 *      thread is "start with the hardest screens first".
 *   3. **Bitácora** — condensed change-log per iteration with links into
 *      the full per-iteration records preserved in /blog.
 */
@Component({
  selector: 'site-wealth-planner-2026-overview',
  standalone: true,
  imports: [
    RouterLink,
    DemoOverviewShellComponent,
    TabsComponent,
    TabItemComponent,
    AnimatedChartComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wealth-planner-2026.page.html',
  styleUrl: './wealth-planner-2026.page.scss',
})
export class WealthPlannerOverviewPage {
  readonly activeTab = signal(0);

  // Same AnimatedChart primitive that the LK Sarevi demo uses — here it
  // runs under the AFI default brand, so the data-viz series palette
  // resolves to AFI's azul-tinted series colors instead of LK's magenta/
  // verde. Proof that the chart component is brand-agnostic: one source,
  // two visual identities.
  readonly portfolioColumns: ChartColumn[] = [
    { title: 'Liquidez',     value: 18, appendString: '%', caption: 'cash + bonos', series: 2 },
    { title: 'Renta fija',   value: 32, appendString: '%', caption: 'bonos + IF',   series: 1 },
    { title: 'Renta variable', value: 35, appendString: '%', caption: 'acciones',   series: 5 },
    { title: 'Inmuebles',    value: 15, appendString: '%', caption: 'vivienda',     series: 6 },
  ];

  readonly relatedPosts: DemoOverviewRelatedPost[] = [
    {
      title: 'Patrimonio — decisiones de diseño',
      slug: 'patrimonial-decisiones',
      eyebrow: 'BLOG',
      description:
        'Registro detallado de cada decisión de chrome y contenido en la pantalla Patrimonio.',
    },
    {
      title: 'Evolución Patrimonial — decisiones de diseño',
      slug: 'evolucion-patrimonial-decisiones',
      eyebrow: 'BLOG',
      description:
        'Mismo registro para Evolución, cada decisión acompañada de un snippet "Ejemplo".',
    },
    {
      title: 'Proceso de componentes',
      slug: 'proceso-componente',
      eyebrow: 'BLOG',
      description:
        'Cómo pasamos de "veo una necesidad" a un spec de primitivo listo para handoff.',
    },
  ];
}
