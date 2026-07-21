import { Routes } from '@angular/router';

export const demos_routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./demos.landing').then((m) => m.DemosLandingPage),
  },
  // Identity v2 workbench moved to top-level /workbench (nav destination);
  // the old /demos/foundations-modern/workbench URL redirects in app.routes.ts.
  // Nueva simulación · Overview — goal-driven client dashboard (concept surface)
  {
    path: 'nueva-simulacion-overview',
    loadComponent: () =>
      import('./nueva-simulacion-overview/nueva-simulacion-overview.page').then(
        (m) => m.NuevaSimulacionOverviewPage,
      ),
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
    path: 'wealth-planner-2026/desinversiones-futuras',
    loadComponent: () =>
      import('./desinversiones-futuras/desinversiones-futuras.page').then(
        (m) => m.DesinversionesFuturasPage,
      ),
  },
  {
    path: 'wealth-planner-2026/desinversiones-futuras/:id',
    loadComponent: () =>
      import('./desinversiones-futuras/desinversion-detail.page').then(
        (m) => m.DesinversionDetailPage,
      ),
  },
  {
    path: 'wealth-planner-2026/proteccion-familiar',
    loadComponent: () =>
      import('./proteccion-familiar/proteccion-familiar.page').then(
        (m) => m.ProteccionFamiliarPage,
      ),
  },
  {
    path: 'wealth-planner-2026/proteccion-familiar/flujo',
    loadComponent: () =>
      import('./proteccion-familiar/flujo/proteccion-familiar-flujo.page').then(
        (m) => m.ProteccionFamiliarFlujoPage,
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
  // Diagnóstico — Brief I
  {
    path: 'wealth-planner-2026/patrimonio-previsto',
    loadComponent: () =>
      import('./patrimonio-previsto/patrimonio-previsto.page').then(
        (m) => m.PatrimonioPrevistoPage,
      ),
  },
  // Diagnóstico — Brief J (Estrategias)
  {
    path: 'wealth-planner-2026/estrategias',
    loadComponent: () =>
      import('./estrategias/estrategias.page').then((m) => m.EstrategiasPage),
  },
  // Plan de acción — §4.b (Optimización de la liquidez)
  {
    path: 'wealth-planner-2026/optimizacion-liquidez',
    loadComponent: () =>
      import('./optimizacion-liquidez/optimizacion-liquidez.page').then(
        (m) => m.OptimizacionLiquidezPage,
      ),
  },
  // Plan de acción — §4.c (Optimización del asset allocation) — landing
  {
    path: 'wealth-planner-2026/optimizacion-asset',
    loadComponent: () =>
      import('./optimizacion-asset/optimizacion-asset.page').then(
        (m) => m.OptimizacionAssetPage,
      ),
  },
  // Plan de acción — §4.c (Optimización del asset allocation) — 3-step wizard
  {
    path: 'wealth-planner-2026/optimizacion-asset/nuevo',
    loadComponent: () =>
      import('./optimizacion-asset/nuevo/optimizacion-asset-flujo.page').then(
        (m) => m.OptimizacionAssetFlujoPage,
      ),
  },
  // Conclusiones — §5.b
  {
    path: 'wealth-planner-2026/consecucion-objetivos',
    loadComponent: () =>
      import('./consecucion-objetivos/consecucion-objetivos.page').then(
        (m) => m.ConsecucionObjetivosPage,
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
  // AWM — AFI Wealth Manager — overview. Cards link out to the AWM showcase
  // (running locally on :4200 or wherever it's deployed). No sub-route here:
  // Coherence is the entry point, AWM is where the demo actually lives.
  {
    path: 'awm',
    loadComponent: () => import('./awm/awm.page').then((m) => m.AwmOverviewPage),
  },
  // Sarevi Unicaja — overview surface (shell consumer).
  {
    path: 'sarevi-unicaja',
    loadComponent: () =>
      import('./sarevi-unicaja-overview/sarevi-unicaja-overview.page').then(
        (m) => m.SareviUnicajaOverviewPage,
      ),
  },
  // Sarevi Unicaja — interactive simulator (same component as Laboral Kutxa Sarevi,
  // Unicaja brand mode via route data).
  {
    path: 'sarevi-unicaja/demo',
    data: { sareviBrand: 'unicaja' },
    loadComponent: () =>
      import('./laboral-kutxa-sarevi/laboral-kutxa-sarevi.page').then(
        (m) => m.LaboralKutxaSareviPage,
      ),
  },
  // Sarevi Banco Cooperativo — overview surface (shell consumer).
  {
    path: 'sarevi-banco-cooperativo',
    loadComponent: () =>
      import('./sarevi-banco-cooperativo-overview/sarevi-banco-cooperativo-overview.page').then(
        (m) => m.SareviBancoCooperativoOverviewPage,
      ),
  },
  // Sarevi Banco Cooperativo — interactive simulator (same component, BC brand mode).
  {
    path: 'sarevi-banco-cooperativo/demo',
    data: { sareviBrand: 'banco-cooperativo' },
    loadComponent: () =>
      import('./laboral-kutxa-sarevi/laboral-kutxa-sarevi.page').then(
        (m) => m.LaboralKutxaSareviPage,
      ),
  },
];
