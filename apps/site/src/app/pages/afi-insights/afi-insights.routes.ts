import { Routes } from '@angular/router';

export const afi_insights_routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./afi-insights.landing').then((m) => m.AfiInsightsLandingPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/insights-home.page').then((m) => m.InsightsHomePage),
  },
  {
    path: 'suscripcion',
    loadComponent: () =>
      import('./suscripcion/insights-suscripcion.page').then(
        (m) => m.InsightsSuscripcionPage,
      ),
  },
  {
    path: 'articulos',
    loadComponent: () =>
      import('./articulos/insights-articulos.page').then((m) => m.InsightsArticulosPage),
  },
  {
    path: 'articulo',
    loadComponent: () =>
      import('./articulo/insights-articulo.page').then((m) => m.InsightsArticuloPage),
  },
  {
    path: 'caso-de-estudio',
    loadComponent: () =>
      import('./caso-de-estudio/insights-caso-de-estudio.page').then(
        (m) => m.InsightsCasoDeEstudioPage,
      ),
  },
];
