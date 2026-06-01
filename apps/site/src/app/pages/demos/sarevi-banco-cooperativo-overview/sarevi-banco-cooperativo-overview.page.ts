import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TabItemComponent, TabsComponent } from '@coherence/ui';

import {
  DemoOverviewShellComponent,
  type DemoOverviewRelatedPost,
} from '../../../components/demo-overview-shell';

/**
 * Sarevi Banco Cooperativo Español — demo overview surface.
 *
 * Lives at /demos/sarevi-banco-cooperativo. Mirrors the Sarevi Laboral Kutxa
 * / Unicaja pattern: hero + 3 tabs (Visión general / Caso de estudio /
 * Bitácora). The interactive simulator sits one route deeper at
 * /demos/sarevi-banco-cooperativo/demo.
 */
@Component({
  selector: 'site-sarevi-banco-cooperativo-overview',
  standalone: true,
  imports: [RouterLink, DemoOverviewShellComponent, TabsComponent, TabItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sarevi-banco-cooperativo-overview.page.html',
  styleUrl: './sarevi-banco-cooperativo-overview.page.scss',
})
export class SareviBancoCooperativoOverviewPage {
  readonly activeTab = signal(0);

  readonly relatedPosts: DemoOverviewRelatedPost[] = [
    {
      title: 'White-label en una línea: el mixin coherence-brand-bind',
      slug: 'mixin-brand-bind',
      eyebrow: 'BLOG · TOKENS',
      description:
        'Tercera marca aplicada sobre el mismo simulador — el mixin demuestra su valor cuando crece la lista de clientes.',
    },
  ];
}
