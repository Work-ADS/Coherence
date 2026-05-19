import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PatrimonialDecisionesPage } from '../patrimonial-decisiones/patrimonial-decisiones.page';
import { EvolucionPatrimonialDecisionesPage } from '../evolucion-patrimonial-decisiones/evolucion-patrimonial-decisiones.page';

@Component({
  selector: 'site-wealth-planner-page',
  standalone: true,
  imports: [RouterLink, PatrimonialDecisionesPage, EvolucionPatrimonialDecisionesPage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wealth-planner.page.html',
  styleUrl: './wealth-planner.page.scss',
})
export class WealthPlannerPage {
  readonly activeTab = signal<'overview' | 'patrimonio' | 'evolucion'>('overview');
}
