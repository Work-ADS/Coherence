import { Routes } from '@angular/router';

export const demos_routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./demos.landing').then((m) => m.DemosLandingPage),
  },
  // Wealth Planner 2026 — overview surface (shell consumer)
  {
    path: 'wealth-planner-2026',
    loadComponent: () =>
      import('./wealth-planner-2026/wealth-planner-2026.page').then(
        (m) => m.WealthPlannerOverviewPage,
      ),
  },
  // Wealth Planner 2026 — the live interactive demo (segmented inside demo-shell)
  {
    path: 'wealth-planner-2026/demo',
    loadComponent: () =>
      import('./wealth-planner-demo/wealth-planner-demo.page').then(
        (m) => m.WealthPlannerDemoPage,
      ),
  },
  // Direct deep links into individual proposal views (used by planner sidebar links)
  {
    path: 'wealth-planner-2026/patrimonial',
    loadComponent: () =>
      import('./patrimonial/patrimonial-proposal.page').then(
        (m) => m.PatrimonialProposalPage,
      ),
  },
  {
    path: 'wealth-planner-2026/evolucion-patrimonial',
    loadComponent: () =>
      import('./evolucion-patrimonial/evolucion-patrimonial-proposal.page').then(
        (m) => m.EvolucionPatrimonialProposalPage,
      ),
  },
];
