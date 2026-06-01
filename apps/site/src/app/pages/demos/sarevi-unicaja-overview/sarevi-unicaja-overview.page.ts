import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TabItemComponent, TabsComponent } from '@coherence/ui';

import {
  DemoOverviewShellComponent,
  type DemoOverviewRelatedPost,
} from '../../../components/demo-overview-shell';

/**
 * Sarevi Unicaja — demo overview surface.
 *
 * Lives at /demos/sarevi-unicaja. Mirrors the Laboral Kutxa Sarevi pattern:
 * hero + 3 tabs (Visión general / Caso de estudio / Bitácora). The
 * interactive simulator sits one route deeper at /demos/sarevi-unicaja/demo.
 */
@Component({
  selector: 'site-sarevi-unicaja-overview',
  standalone: true,
  imports: [RouterLink, DemoOverviewShellComponent, TabsComponent, TabItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sarevi-unicaja-overview.page.html',
  styleUrl: './sarevi-unicaja-overview.page.scss',
})
export class SareviUnicajaOverviewPage {
  readonly activeTab = signal(0);

  readonly relatedPosts: DemoOverviewRelatedPost[] = [
    {
      title: 'White-label en una línea: el mixin coherence-brand-bind',
      slug: 'mixin-brand-bind',
      eyebrow: 'BLOG · TOKENS',
      description:
        'El mismo mixin que recolora Sarevi para Laboral Kutxa lo hace para Unicaja con un cambio de argumentos.',
    },
  ];
}
