import { Routes } from '@angular/router';

export const flujos_routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./flujos.landing').then(m => m.FlujosLandingPage),
  },
  { path: 'importacion', loadComponent: () => import('./importacion.page').then(m => m.ImportacionPage) },
  { path: 'edicion-de-fila', loadComponent: () => import('./edicion-de-fila.page').then(m => m.EdicionDeFilaPage) },
];
