import { Routes } from '@angular/router';

export const patrones_routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./patrones.landing').then(m => m.PatronesLandingPage),
  },
  { path: 'shells', loadChildren: () => import('./shells/shells.routes').then(m => m.shells_routes) },
  { path: 'flujos', loadChildren: () => import('./flujos/flujos.routes').then(m => m.flujos_routes) },
  { path: 'graficos', loadChildren: () => import('./graficos/graficos.routes').then(m => m.graficos_routes) },
  { path: 'tarjetas', loadChildren: () => import('./tarjetas/tarjetas.routes').then(m => m.tarjetas_routes) },
];
