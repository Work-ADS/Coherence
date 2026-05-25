import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TabItemComponent, TabsComponent } from '@coherence/ui';

import {
  DemoOverviewShellComponent,
  type DemoOverviewRelatedPost,
} from '../../../components/demo-overview-shell';

/**
 * Laboral Kutxa · Sarevi 360 — demo overview surface.
 *
 * Lives at /demos/laboral-kutxa-sarevi. Mirrors the wealth-planner-2026
 * pattern: a hero + 3 tabs (Visión general / Caso de estudio / Bitácora)
 * + related posts. The interactive simulator lives one route deeper at
 * /demos/laboral-kutxa-sarevi/demo.
 *
 * Content is intentionally light — Sarevi is a new demo and the bitácora
 * will fill as we iterate.
 */
@Component({
  selector: 'site-laboral-kutxa-sarevi-overview',
  standalone: true,
  imports: [RouterLink, DemoOverviewShellComponent, TabsComponent, TabItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './laboral-kutxa-sarevi-overview.page.html',
  styleUrl: './laboral-kutxa-sarevi-overview.page.scss',
})
export class LaboralKutxaSareviOverviewPage {
  readonly activeTab = signal(0);

  readonly relatedPosts: DemoOverviewRelatedPost[] = [
    {
      title: 'White-label en una línea: el mixin coherence-brand-bind',
      slug: 'mixin-brand-bind',
      eyebrow: 'BLOG · TOKENS',
      description:
        'La pieza de tokens que hace posible aplicar la paleta LK a los componentes del DS sin reescribir nada.',
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
