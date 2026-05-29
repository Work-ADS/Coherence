import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { findAwmFeature } from '../awm-features';

/**
 * AWM feature sub-page — /demos/awm/:feature.
 *
 * Host sets `data-brand="awm"` so the AWM sub-brand (slate canvas,
 * AzulProfundo CTAs, Roboto type) re-themes the Coherence chrome
 * (breadcrumb, page header). The iframe loads the deployed AWM showcase
 * which carries its own PrimeNG-themed styling — the AWM brand on the
 * chrome telegraphs the visual handoff before the iframe renders.
 *
 * Feedback / inspect overlay is global (apps/site/app.component) — no
 * extra wiring needed; comment pins can be dropped anywhere on this page
 * including over the iframe wrapper.
 */
@Component({
  selector: 'site-awm-feature',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './awm-feature.page.html',
  styleUrl: './awm-feature.page.scss',
  host: {
    'data-brand': 'awm',
    class: 'awm-feature-page',
  },
})
export class AwmFeaturePage {
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);

  readonly slug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('feature'))),
    { initialValue: null },
  );

  readonly meta = computed(() => findAwmFeature(this.slug()));

  readonly safeIframeUrl = computed<SafeResourceUrl | null>(() => {
    const m = this.meta();
    return m ? this.sanitizer.bypassSecurityTrustResourceUrl(m.iframeUrl) : null;
  });
}
