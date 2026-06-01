import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PatrimonialProposalPage } from '../patrimonial/patrimonial-proposal.page';

/**
 * /demos/wealth-planner-2026/demo route. Previously wrapped Patrimonio +
 * Evolución behind a demo-shell view switcher; the shell was removed per
 * user request — both views are still reachable via the planner sidebar
 * (Patrimonio under Situación actual, Evolución comparada under Conclusiones).
 * This route now renders Patrimonio as the default entry point.
 */
@Component({
  selector: 'site-wealth-planner-demo',
  standalone: true,
  imports: [PatrimonialProposalPage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wealth-planner-demo.page.html',
  styleUrl: './wealth-planner-demo.page.scss',
})
export class WealthPlannerDemoPage {}
