import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TabsComponent, TabItemComponent } from '@coherence/ui';

/**
 * Wealth Planner 2026 — case study entry point.
 *
 * Two tabs:
 *   - "Caso de estudio" — narrative + links into the deep decisiones pages.
 *   - "Bitácora"        — change-log entries (bitácora + iteracion-2 + -3).
 *
 * The deep records (patrimonial-decisiones, evolucion-patrimonial-decisiones,
 * bitacora, iteracion-2, iteracion-3) live as standalone /blog/<slug> entries
 * so nothing is lost; this page is the curated entry point that ties them
 * together and is what links from /demos/wealth-planner-2026 and the in-demo
 * "Decisiones" trigger in planner-top-bar.
 */
@Component({
  selector: 'site-wealth-planner-2026-case-study',
  standalone: true,
  imports: [RouterLink, TabsComponent, TabItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wealth-planner-2026.page.html',
  styleUrl: './wealth-planner-2026.page.scss',
})
export class WealthPlannerCaseStudyPage {
  readonly activeTab = signal(0);
}
