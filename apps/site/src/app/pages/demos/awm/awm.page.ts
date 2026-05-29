import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AWM_FEATURES } from './awm-features';

/**
 * AWM — AFI Wealth Manager — overview surface on the Coherence demo site.
 *
 * Lives at /demos/awm. Renders in the default AFI/Coherence brand (no host
 * data-brand) using the same card pattern as /demos landing: title row +
 * status pill + intro. Each card routes into /demos/awm/<slug> where the
 * AWM sub-brand kicks in (slate canvas, AzulProfundo CTAs, Roboto) and the
 * AWM showcase loads in an iframe.
 *
 * Inspect/feedback overlay is global (mounted in app.component) — no extra
 * wiring needed for comments to work here or on the sub-pages.
 */
@Component({
  selector: 'site-awm-overview',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './awm.page.html',
  styleUrl: './awm.page.scss',
})
export class AwmOverviewPage {
  readonly features = AWM_FEATURES;
}
