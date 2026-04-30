import { Routes } from '@angular/router';

export const graficos_routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./graficos.landing').then((m) => m.GraficosLandingPage),
  },
  { path: 'bar', loadComponent: () => import('./bar.page').then((m) => m.BarChartPage) },
  { path: 'line', loadComponent: () => import('./line.page').then((m) => m.LineChartPage) },
  {
    path: 'heatmap',
    loadComponent: () => import('./heatmap.page').then((m) => m.HeatmapChartPage),
  },
  {
    path: 'dumbbell',
    loadComponent: () => import('./dumbbell.page').then((m) => m.DumbbellChartPage),
  },
  {
    path: 'evolucion-patrimonial',
    loadComponent: () =>
      import('./evolucion-patrimonial/evolucion-patrimonial.page').then(
        (m) => m.EvolucionPatrimonialPage,
      ),
  },
];
