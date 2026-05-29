import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AWM_FEATURES } from './awm-features';

/**
 * AWM — AFI Wealth Manager — overview surface on the Coherence demo site.
 *
 * Lives at /demos/awm. Renders in the default AFI/Coherence brand using the
 * same card pattern as the /demos landing. Each card is an external link
 * that opens the deployed (or locally-served) AWM showcase in a new tab —
 * AWM lives in its own repo (AfiDesigner/Afi-AWM); Coherence is the entry
 * point, not the host.
 */
@Component({
  selector: 'site-awm-overview',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './awm.page.html',
  styleUrl: './awm.page.scss',
})
export class AwmOverviewPage {
  readonly features = AWM_FEATURES;
}
