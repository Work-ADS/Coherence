import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent, CardComponent } from '@coherence/ui';

export interface DemoOverviewScreenshot {
  src: string;
  alt: string;
  caption?: string;
}

export interface DemoOverviewRelatedPost {
  title: string;
  /** Route slug — concatenated to /blog/ on the rendered link. */
  slug: string;
  eyebrow?: string;
  description?: string;
}

/**
 * Reusable shell for the overview page of any demo under /demos.
 *
 * Renders four blocks in editorial register:
 *   1. Hero — overline + title + intro
 *   2. Primary CTA — "Abrir demo" routerLink button
 *   3. Screenshot grid — preview imagery
 *   4. Related posts — cards linking into /blog
 *
 * Inputs (not slots) so the structure is uniform across every demo page.
 * Add a demo? Build its overview page by binding inputs to this shell.
 *
 * @example
 * ```html
 * <site-demo-overview-shell
 *   overline="WEALTH PLANNER · 2026"
 *   title="Wealth Planner 2026"
 *   intro="Rediseño completo — patrimonio, evolución, simulación."
 *   demoRoute="/demos/wealth-planner-2026/demo"
 *   [screenshots]="[{ src: 'assets/demos/wealth-planner-2026/patrimonio.png', alt: 'Patrimonio' }]"
 *   [relatedPosts]="[{ title: 'Caso de estudio', slug: 'wealth-planner-2026' }]"
 * />
 * ```
 */
@Component({
  selector: 'site-demo-overview-shell',
  standalone: true,
  imports: [RouterLink, ButtonComponent, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-overview-shell.component.html',
  styleUrls: ['./demo-overview-shell.component.scss'],
})
export class DemoOverviewShellComponent {
  /** Optional eyebrow text above the title (e.g. "WEALTH PLANNER · 2026"). */
  readonly overline = input<string | null>(null);

  /** Page title — the demo's display name. */
  readonly title = input.required<string>();

  /** Intro paragraph beneath the title. */
  readonly intro = input<string | null>(null);

  /** Router target for the "Open demo" CTA. */
  readonly demoRoute = input.required<string>();

  /** CTA label. Defaults to "Abrir demo". */
  readonly demoLabel = input<string>('Abrir demo');

  /** Screenshot cards rendered below the CTA. Empty by default. */
  readonly screenshots = input<DemoOverviewScreenshot[]>([]);

  /** Related-post cards rendered at the bottom. Empty by default. */
  readonly relatedPosts = input<DemoOverviewRelatedPost[]>([]);

  /** Convenience: hide the screenshots section when no images provided. */
  readonly hasScreenshots = computed(() => this.screenshots().length > 0);

  /** Convenience: hide the related-posts section when none provided. */
  readonly hasRelatedPosts = computed(() => this.relatedPosts().length > 0);
}
