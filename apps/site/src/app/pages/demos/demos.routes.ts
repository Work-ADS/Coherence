import { Routes } from '@angular/router';

export const demos_routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./demos.landing').then((m) => m.DemosLandingPage),
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
      import('./wealth-planner-demo/wealth-planner-demo.page').then((m) => m.WealthPlannerDemoPage),
  },
  // Direct deep links into individual proposal views (used by planner sidebar links)
  {
    path: 'wealth-planner-2026/familia',
    loadComponent: () => import('./familia/familia.page').then((m) => m.FamiliaPage),
  },
  {
    path: 'wealth-planner-2026/sociedades',
    loadComponent: () => import('./sociedades/sociedades.page').then((m) => m.SociedadesPage),
  },
  {
    path: 'wealth-planner-2026/ingresos',
    loadComponent: () => import('./ingresos/ingresos.page').then((m) => m.IngresosPage),
  },
  {
    path: 'wealth-planner-2026/gastos',
    loadComponent: () => import('./gastos/gastos.page').then((m) => m.GastosPage),
  },
  {
    path: 'wealth-planner-2026/legado-retiro',
    loadComponent: () =>
      import('./legado-retiro/legado-retiro.page').then((m) => m.LegadoRetiroPage),
  },
  {
    path: 'wealth-planner-2026/inversiones-futuras',
    loadComponent: () =>
      import('./inversiones-futuras/inversiones-futuras.page').then(
        (m) => m.InversionesFuturasPage,
      ),
  },
  {
    path: 'wealth-planner-2026/patrimonial',
    loadComponent: () =>
      import('./patrimonial/patrimonial-proposal.page').then((m) => m.PatrimonialProposalPage),
  },
  {
    path: 'wealth-planner-2026/evolucion-patrimonial',
    loadComponent: () =>
      import('./evolucion-patrimonial/evolucion-patrimonial-proposal.page').then(
        (m) => m.EvolucionPatrimonialProposalPage,
      ),
  },
  // Laboral Kutxa — Sarevi 360 overview (3-tab demo shell)
  {
    path: 'laboral-kutxa-sarevi',
    loadComponent: () =>
      import('./laboral-kutxa-sarevi-overview/laboral-kutxa-sarevi-overview.page').then(
        (m) => m.LaboralKutxaSareviOverviewPage,
      ),
  },
  // Laboral Kutxa — Sarevi 360 interactive simulator (wrapped in demo-shell)
  {
    path: 'laboral-kutxa-sarevi/demo',
    loadComponent: () =>
      import('./laboral-kutxa-sarevi/laboral-kutxa-sarevi.page').then(
        (m) => m.LaboralKutxaSareviPage,
      ),
  },
];
