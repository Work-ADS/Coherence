import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TabItemComponent, TabsComponent } from '@coherence/ui';

import {
  DemoOverviewShellComponent,
  type DemoOverviewRelatedPost,
} from '../../../components/demo-overview-shell';

import { AWM_FEATURES } from './awm-features';

/**
 * AWM — AFI Wealth Manager — overview surface on the Coherence demo site.
 *
 * Lives at /demos/awm. Uses the editorial overview shell shared with the
 * Sarevi white-label demos: hero band + tabbed body. AWM is *not* a Sarevi
 * rebuild — it lives in its own Angular + PrimeNG app, so the cards in
 * Visión general link out (target="_blank") instead of routing to an
 * embedded simulator. This is the only Coherence surface that activates
 * the AWM brand-bind ([data-brand="awm"] is set on the host element),
 * so the page doubles as the white-label proof point for the AWM token
 * pack.
 */
@Component({
  selector: 'site-awm-overview',
  standalone: true,
  imports: [RouterLink, DemoOverviewShellComponent, TabsComponent, TabItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './awm.page.html',
  styleUrl: './awm.page.scss',
  host: {
    'data-brand': 'awm',
  },
})
export class AwmOverviewPage {
  readonly features = AWM_FEATURES;
  readonly activeTab = signal(0);

  readonly relatedPosts: DemoOverviewRelatedPost[] = [
    {
      title: 'White-label en una línea: el mixin coherence-brand-bind',
      slug: 'mixin-brand-bind',
      eyebrow: 'BLOG · TOKENS',
      description:
        'El mismo mixin que aplica Sarevi al rebrand de LK aplica AWM a su sub-marca AzulProfundo + Slate.',
    },
  ];
}
