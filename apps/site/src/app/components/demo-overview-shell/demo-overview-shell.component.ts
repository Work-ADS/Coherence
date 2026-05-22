import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@coherence/ui';

export interface DemoOverviewRelatedPost {
  /** Card title. */
  title: string;
  /** Route slug — concatenated to /blog/ for the rendered link. */
  slug: string;
  /** Optional small label above the title (e.g. "BLOG", "GUÍA"). */
  eyebrow?: string;
  /** Optional 1-2 sentence summary rendered under the title. */
  description?: string;
}

/**
 * Demo overview template — shared by every page under /demos/<slug>.
 *
 * The shell renders:
 *   1. **Hero** — overline + title + intro + primary CTA ("Abrir demo").
 *   2. **Body** — a single `<ng-content />` slot where the consumer drops
 *      the per-demo narrative. The convention is a 3-tab `<afi-tabs>`
 *      with "Visión general", "Caso de estudio" and "Bitácora" tabs,
 *      but the slot is freeform so future demos can adapt as needed.
 *   3. **Lectura relacionada** — optional list of related-post cards
 *      rendered at the bottom (driven by the `relatedPosts` input).
 *
 * All visual styling lives in `.scss` using BEM classes + DS tokens —
 * no Tailwind utilities, no inline styles.
 *
 * @example
 * ```html
 * <site-demo-overview-shell
 *   overline="WEALTH PLANNER · 2026"
 *   title="Wealth Planner 2026"
 *   intro="Rediseño completo — patrimonio, evolución y simulación."
 *   demoRoute="/demos/wealth-planner-2026/demo"
 *   [relatedPosts]="related"
 * >
 *   <afi-tabs [activeIndex]="activeTab()" (activeChange)="activeTab.set($event)">
 *     <afi-tab-item label="Visión general">…</afi-tab-item>
 *     <afi-tab-item label="Caso de estudio">…</afi-tab-item>
 *     <afi-tab-item label="Bitácora">…</afi-tab-item>
 *   </afi-tabs>
 * </site-demo-overview-shell>
 * ```
 */
@Component({
  selector: 'site-demo-overview-shell',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
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

  /** Related-post cards rendered below the projected content. Empty by default. */
  readonly relatedPosts = input<DemoOverviewRelatedPost[]>([]);

  /** Convenience: hide the related-posts section when none provided. */
  readonly hasRelatedPosts = computed(() => this.relatedPosts().length > 0);
}
