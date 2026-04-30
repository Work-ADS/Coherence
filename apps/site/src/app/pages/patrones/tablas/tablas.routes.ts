import { Routes } from '@angular/router';

export const tablas_routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tablas.landing').then((m) => m.TablasLandingPage),
  },
  {
    path: 'patrimonio',
    loadComponent: () => import('./patrimonio/patrimonio.page').then((m) => m.TablaPatrimonioPage),
  },
];
