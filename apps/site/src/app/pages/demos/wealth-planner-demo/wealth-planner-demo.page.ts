import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoShellComponent } from '../demo-shell/demo-shell.component';
import { PatrimonialProposalPage } from '../patrimonial/patrimonial-proposal.page';
import { EvolucionPatrimonialProposalPage } from '../evolucion-patrimonial/evolucion-patrimonial-proposal.page';

@Component({
  selector: 'site-wealth-planner-demo',
  standalone: true,
  imports: [DemoShellComponent, PatrimonialProposalPage, EvolucionPatrimonialProposalPage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wealth-planner-demo.page.html',
  styleUrl: './wealth-planner-demo.page.scss',
})
export class WealthPlannerDemoPage {}
